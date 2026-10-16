# Bacteroides codon optimization tool

A command-line tool for codon-optimizing or codon-harmonizing a coding sequence (CDS) for expression in *Bacteroides* species. No existing codon optimization tool covers this genus, so target codon usage tables are vendored locally from the [Kazusa Codon Usage Database](http://www.kazusa.or.jp/codon/).

Developed for the KU Leuven iGEM 2026 project.

**Status: early development.** It works on short synthetic test sequences. It has not yet been validated on full-length genes (see [Known limitations](#known-limitations)). Please read that section before relying on the output.

## What it does

1. **Assigns codons** to your CDS in one of two modes:
   - `optimize`: use the highest-usage synonymous codon of the target species at every position.
   - `harmonize`: rank-preserving mapping. Each codon's usage rank in the *source* organism is mapped onto the same rank in the target species, so rare codons stay rare and common codons stay common. This is meant to preserve translation-speed patterns. The source ranks can come from a source-organism codon usage table you supply, or (fallback) from the input CDS itself.
2. **Repairs constraint violations** by synonymous codon substitution (the protein sequence never changes), in this priority order. A fix for a lower-priority constraint is never accepted if it introduces a new violation of a higher-priority one:

   | Priority | Constraint | Default |
   |---|---|---|
   | 1 | Restriction sites (both strands) | BsaI, PaqCI, SapI, BbsI, EcoRI, NotI, XbaI, SpeI, PstI |
   | 2 | GC content | no 30 nt window above 70% GC |
   | 3 | Repeats (direct and inverted, exact and fuzzy) | ≥ 11 bp, ≤ 2 mismatches |
   | 4 | 5′ translation-initiation folding | first 15 codons (+ optional UTR), z-score of MFE vs. shuffled sequences must be above −2.0 |

3. **Reports** what it did and what it could not fix. If the constraints cannot all be satisfied, it returns a best-effort sequence together with a diagnostics report listing the unresolved constraints. It does not fail hard.

## Installation

Requires Python 3.11 and [ViennaRNA](https://www.tbi.univie.ac.at/RNA/) (used for the 5′ folding check). The easiest way is conda:

```bash
git clone <this repository>
cd <repository folder>
conda env create -f environment.yml
conda activate bacteroides
```

Run all commands from the repository root (imports are root-relative).

## Usage

```bash
# list the available target species
python cli.py --list-species

# optimize
python cli.py --mode optimize --species thetaiotaomicron_VPI-5482 input.fasta

# harmonize, using a Kazusa-format table for the source organism
python cli.py --mode harmonize --species thetaiotaomicron_VPI-5482 \
    --source-table path/to/source_organism.txt \
    --source-display-name "Escherichia coli K12" input.fasta

# harmonize without a source table (source ranks computed from the input CDS itself)
python cli.py --mode harmonize --species thetaiotaomicron_VPI-5482 input.fasta
```

The input is a FASTA file with one or more in-frame CDS records (DNA alphabet). Each record is processed independently.

### Options

| Option | Meaning |
|---|---|
| `--mode {optimize,harmonize}` | Assignment mode (required) |
| `--species KEY` | Target species key, see `--list-species` (required) |
| `--source-table FILE` | harmonize only: Kazusa-format table of the source organism |
| `--source-display-name NAME` | Display name for the source table |
| `--utr SEQ` | 5′ UTR sequence to include in the folding window |
| `--max-passes N` | Cap on repair passes (default 10) |
| `--gc-ceiling X` | Override the GC ceiling, as a fraction (e.g. `0.65`) |
| `--restriction-enzymes FILE` | JSON file `{"EnzymeName": "RECOGNITIONSEQ", ...}` replacing the default enzyme list |
| `-o, --output FILE` | Write the FASTA here instead of stdout |
| `--report-output FILE` | Write the diagnostics report here instead of stderr |
| `--report-format {text,json}` | Report format (default text) |
| `--fasta-only` | Skip the diagnostics report |
| `-q, --quiet` | Suppress progress messages on stderr |

### Output streams

- **stdout** carries the resulting FASTA only, so `python cli.py ... > result.fasta` is always safe.
- The **diagnostics report** goes to `--report-output` if given, otherwise to **stderr**. Stderr also carries progress messages unless `--quiet` is set, so for machine-readable JSON use either `--report-output report.json` or `--report-format json --quiet 2> report.json`.

### Reading the report

The report states per constraint how many violations were found, how many repair substitutions were made, and which violations remain, with their nucleotide positions. `Status: PARTIAL` means the output is best-effort and at least one constraint is still violated. A note explains whether the repair loop stopped because it made no further progress or because it hit the pass cap.

## Supported species

Run `python cli.py --list-species` for the current list. Only species marked `verified` in `data/codon_tables/metadata.json` can be selected. *B. fragilis* YCH46 is currently marked `pending` and is not selectable (see the note in `metadata.json`).

## Known limitations

- **Only tested on short synthetic sequences** so far. Behavior and run time on full-length genes are untested. In particular, the folding check runs ViennaRNA on 100 shuffled sequences per evaluation, and the repair loop evaluates it repeatedly, so long or heavily constrained sequences may be slow.
- **The folding check is stochastic.** The z-score is estimated from random shuffles, so repeated runs can give slightly different results for the folding constraint. The repair loop contains safeguards against oscillating between near-equivalent codons, but folding repair is the noisiest part of the pipeline.
- **Densely constrained sequences may not fully resolve.** For example, a long GC-rich run next to a restriction site in a short CDS can leave GC, repeat or folding violations that synonymous substitution alone cannot fix. The tool reports these rather than hiding them.
- **Harmonization quality depends on the source table.** Source tables with fewer than 10,000 total codon occurrences trigger a warning because the derived ranks are less reliable. The self-referential fallback (no `--source-table`) is much noisier on short CDSs.
- The default thresholds (GC ceiling, repeat length, folding z-threshold, enzyme list) are not yet benchmarked against expression data.

## Data and credits

- Codon usage tables are from the [Kazusa Codon Usage Database](http://www.kazusa.or.jp/codon/). Provenance (species ID, source URL, download date, CDS count) is recorded in `data/codon_tables/metadata.json`. Please cite Kazusa if you use them.
- RNA folding uses [ViennaRNA](https://www.tbi.univie.ac.at/RNA/): Lorenz et al., *Algorithms for Molecular Biology* 6:26 (2011).

## License

This directory (`software/codon-optimization-tool/`) is released under the MIT
License — see [LICENSE](LICENSE). The MIT License covers this tool only; the rest of the
KU Leuven iGEM 2026 wiki repository is covered by the CC BY 4.0 license at the repository
root.

The vendored codon usage tables under `data/codon_tables/` are data from the
[Kazusa Codon Usage Database](http://www.kazusa.or.jp/codon/) and keep their own terms —
please cite Kazusa if you use them. ViennaRNA is an external dependency, not redistributed
here, and is covered by its own license.
