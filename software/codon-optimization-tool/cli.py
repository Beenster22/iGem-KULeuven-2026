"""
cli.py

Command-line entry point for the Bacteroides codon optimization tool.
Wires together the three stages that already exist as separate modules:

    1. Codon assignment  -- core.assign_optimize.optimize_sequence() (mode=optimize)
                             or core.assign_harmonize.harmonize()     (mode=harmonize)
    2. Constraint repair -- repair.repair_engine.repair_sequence()
    3. Diagnostics        -- report.build_report()

Usage:
    python cli.py --mode optimize --species thetaiotaomicron_VPI-5482 input.fasta
    python cli.py --mode harmonize --species thetaiotaomicron_VPI-5482 \\
        --source-table ecoli_k12.txt --source-display-name "E. coli K12" input.fasta

Output: for now, always both the assigned+repaired FASTA and the diagnostics
report (per the current dev-phase decision -- see --fasta-only below). Once
the repair loop has been validated against real gene-length input, the plan
is to flip the *default* to FASTA-only and make the report opt-in instead.
That's a one-line change (swap the `default=` on --fasta-only) when the time
comes -- flagged here so it isn't lost.

Stream layout for scripting: stdout is FASTA only, always. The report goes
to --report-output if given, otherwise to stderr -- but stderr also carries
the progress messages (unless --quiet), so stderr alone is only guaranteed
clean/parseable when combined with --quiet, or just use --report-output for
a real file regardless of --quiet. E.g. for machine-parseable JSON:
    python cli.py ... --report-format json --quiet > out.fasta 2> out.json
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Optional

from core.codon_table import load_species, load_source_table_from_file, available_species
from core.assign_optimize import optimize_sequence
from core.assign_harmonize import harmonize
from repair.repair_engine import repair_sequence, DEFAULT_MAX_PASSES
from report import build_report


# ---------------------------------------------------------------------------
# Minimal FASTA I/O -- no Biopython dependency, since its availability in the
# project's conda env hasn't been confirmed. Swap for Bio.SeqIO freely if
# it's already a dependency elsewhere; this is intentionally bare-bones.
# ---------------------------------------------------------------------------

def parse_fasta(path: Path) -> list[tuple[str, str]]:
    """Returns [(header, sequence), ...] -- header is the text after '>', sequence
    is upper-cased and has all whitespace stripped. Supports multiple records."""
    records: list[tuple[str, str]] = []
    header: Optional[str] = None
    seq_parts: list[str] = []
    with open(path) as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            if line.startswith(">"):
                if header is not None:
                    records.append((header, "".join(seq_parts).upper()))
                header = line[1:].strip()
                seq_parts = []
            else:
                seq_parts.append(line)
        if header is not None:
            records.append((header, "".join(seq_parts).upper()))
    if not records:
        raise ValueError(f"No FASTA records found in {path}")
    return records


def write_fasta(records: list[tuple[str, str]], path: Optional[Path]) -> None:
    """Writes [(header, sequence), ...] to `path`, or stdout if path is None.
    Wraps sequence lines at 70 chars, standard FASTA convention."""
    out = sys.stdout if path is None else open(path, "w")
    try:
        for header, seq in records:
            out.write(f">{header}\n")
            for i in range(0, len(seq), 70):
                out.write(seq[i : i + 70] + "\n")
    finally:
        if path is not None:
            out.close()


# ---------------------------------------------------------------------------
# Argument parsing
# ---------------------------------------------------------------------------

def build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="codon-opt",
        description="Codon-optimize or -harmonize a CDS for expression in a Bacteroides species.",
    )
    parser.add_argument("input_fasta", type=Path, nargs="?", default=None,
                         help="FASTA file with one or more CDS records")
    parser.add_argument(
        "--mode", default=None, choices=["optimize", "harmonize"],
        help="optimize: maximize target-species codon usage. "
             "harmonize: rank-preserving mapping of source-organism codon usage onto the target.",
    )
    parser.add_argument(
        "--species", default=None,
        help="Target species key, e.g. thetaiotaomicron_VPI-5482 (see --list-species)",
    )
    parser.add_argument(
        "--list-species", action="store_true",
        help="Print available target species keys and exit (ignores other required args)",
    )
    parser.add_argument(
        "--source-table", type=Path, default=None,
        help="harmonize mode only: path to a source-organism codon usage file "
             "(Kazusa-format). Omit to use the self-referential fallback (source "
             "codon rank computed from the input CDS itself).",
    )
    parser.add_argument(
        "--source-display-name", type=str, default=None,
        help="Display name for --source-table, e.g. 'Escherichia coli K12'",
    )
    parser.add_argument(
        "--utr", type=str, default=None,
        help="UTR sequence (5' of the start codon) to include in the folding-window check",
    )
    parser.add_argument(
        "--max-passes", type=int, default=DEFAULT_MAX_PASSES,
        help=f"Repair loop pass cap (default: {DEFAULT_MAX_PASSES})",
    )
    parser.add_argument(
        "--gc-ceiling", type=float, default=None,
        help="Override the GC content ceiling (fraction, e.g. 0.65). "
             "Default: constraints/gc_content.py's own default (0.7).",
    )
    parser.add_argument(
        "--restriction-enzymes", type=Path, default=None,
        help="Path to a JSON file mapping enzyme name -> recognition sequence, "
             "overriding constraints/restriction.py's default enzyme list.",
    )
    parser.add_argument(
        "--output", "-o", type=Path, default=None,
        help="Output FASTA path. Default: print to stdout.",
    )
    parser.add_argument(
        "--report-output", type=Path, default=None,
        help="Diagnostics report output path. Default: print to stderr (stdout is "
             "reserved for the FASTA output, so it stays safe to redirect).",
    )
    parser.add_argument(
        "--report-format", choices=["text", "json"], default="text",
        help="Diagnostics report format (default: text)",
    )
    parser.add_argument(
        "--fasta-only", action="store_true", default=False,
        # NOTE: this default is the current dev-phase choice (report included
        # by default). Flip to default=True once repair has been validated
        # against real gene-length input, per the plan in this module's
        # docstring -- and flip the help text below to match.
        help="Skip the diagnostics report; print/write only the resulting FASTA.",
    )
    parser.add_argument(
        "--quiet", "-q", action="store_true", default=False,
        help="Suppress per-record progress messages on stderr.",
    )
    return parser


# ---------------------------------------------------------------------------
# Pipeline
# ---------------------------------------------------------------------------

def process_record(
    header: str,
    cds: str,
    args: argparse.Namespace,
    codon_table,
    source_table,
) -> tuple[str, object]:
    """Runs assignment + repair for one record. Returns (final_sequence, DiagnosticsReport)."""
    if args.mode == "optimize":
        assigned_seq = optimize_sequence(cds, codon_table)
        harmonize_metadata = None
    else:
        assigned_seq, harmonize_metadata = harmonize(cds, codon_table, source_table=source_table)

    gc_bounds = (0.0, args.gc_ceiling) if args.gc_ceiling is not None else None
    restriction_enzymes = None
    if args.restriction_enzymes is not None:
        with open(args.restriction_enzymes) as f:
            restriction_enzymes = json.load(f)

    repair_result = repair_sequence(
        assigned_seq,
        codon_table,
        mode=args.mode,
        max_passes=args.max_passes,
        utr=args.utr,
        harmonize_metadata=harmonize_metadata,
        restriction_enzymes=restriction_enzymes,
        gc_bounds=gc_bounds,
    )

    report = build_report(
        species=args.species,
        mode=args.mode,
        final_sequence=repair_result.sequence,
        repair_result=repair_result,
    )
    return repair_result.sequence, report


def main(argv: Optional[list[str]] = None) -> int:
    parser = build_arg_parser()
    args = parser.parse_args(argv)

    if args.list_species:
        for key, entry in available_species().items():
            print(f"{key}\t{entry.get('display_name', key)}")
        return 0

    missing = [
        name for name, val in
        [("input_fasta", args.input_fasta), ("--mode", args.mode), ("--species", args.species)]
        if val is None
    ]
    if missing:
        parser.error(f"the following arguments are required: {', '.join(missing)}")

    if not args.quiet:
        print(f"Loading target species '{args.species}'...", file=sys.stderr)
    try:
        codon_table = load_species(args.species)
    except ValueError as e:
        # load_species() raises ValueError specifically for both an unknown key
        # and a known-but-not-yet-verified one, with a message that already lists
        # valid keys or explains the pending status -- just surface it as-is.
        # Anything else (e.g. a missing data/ directory) is a real bug/setup
        # problem, not a bad --species value, so it's left to propagate normally.
        print(f"Error loading species '{args.species}': {e}", file=sys.stderr)
        return 1

    source_table = None
    if args.mode == "harmonize" and args.source_table is not None:
        if not args.quiet:
            print(f"Loading source table from {args.source_table}...", file=sys.stderr)
        try:
            source_table = load_source_table_from_file(
                str(args.source_table), display_name=args.source_display_name
            )
        except (ValueError, FileNotFoundError) as e:
            print(f"Error loading source table '{args.source_table}': {e}", file=sys.stderr)
            return 1
    elif args.source_table is not None and args.mode == "optimize":
        print("Warning: --source-table is ignored in --mode optimize.", file=sys.stderr)

    records = parse_fasta(args.input_fasta)

    output_records: list[tuple[str, str]] = []
    reports = []
    for header, cds in records:
        if not args.quiet:
            print(f"Processing '{header}' ({len(cds)} nt)...", file=sys.stderr)
        final_seq, report = process_record(header, cds, args, codon_table, source_table)
        output_records.append((header, final_seq))
        reports.append((header, report))
        if not args.quiet:
            status = "converged" if report.converged else "PARTIAL (see report for details)"
            print(f"  -> {status}", file=sys.stderr)

    write_fasta(output_records, args.output)

    if not args.fasta_only:
        if args.report_format == "json":
            report_text = json.dumps([{"header": h, **r.to_dict()} for h, r in reports], indent=2)
        else:
            report_text = "\n\n".join(f"### {h} ###\n{r.to_text()}" for h, r in reports)

        if args.report_output is not None:
            with open(args.report_output, "w") as f:
                f.write(report_text + "\n")
        else:
            # stderr, not stdout: stdout is reserved for the FASTA output (written
            # above) so `cli.py ... > result.fasta` is always safe regardless of
            # report settings, same reasoning as the progress messages above.
            print(report_text, file=sys.stderr)

    return 0


if __name__ == "__main__":
    sys.exit(main())