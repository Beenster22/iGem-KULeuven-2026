"""
codon_table.py

Loads the standard genetic code and vendored per-species Kazusa codon usage
tables, and exposes a CodonTable object that downstream modules
(assign_optimize, assign_harmonize, repair_engine) use to look up codon
frequencies, synonymous codon groups, and usage ranks/percentiles.

Data is never fetched live -- everything comes from local files under
data/genetic_code.tsv and data/codon_tables/*.txt, vendored once from Kazusa
(http://www.kazusa.or.jp/codon/). See data/codon_tables/metadata.json for
provenance (species ID, source URL, download date, CDS count).
"""

from __future__ import annotations

import json
import re
import warnings
from dataclasses import dataclass, field
from pathlib import Path
from collections import Counter

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
CODON_TABLES_DIR = DATA_DIR / "codon_tables"
GENETIC_CODE_PATH = DATA_DIR / "genetic_code.tsv"
METADATA_PATH = CODON_TABLES_DIR / "metadata.json"
MIN_RELIABLE_CODON_COUNT = 10_000

# Regex for Kazusa's CUTG-style table: TRIPLET  freq_per_thousand( raw_count )
_KAZUSA_LINE_RE = re.compile(r"([UCAGT]{3})\s+([\d.]+)\(\s*(\d+)\)")


def load_genetic_code(path: Path = GENETIC_CODE_PATH) -> tuple[dict[str, str], dict[str, list[str]]]:
    """
    Load the standard genetic code from a tab-separated file with header
    'amino_acid\tcodon'. Stop codons are labeled '*'.

    Returns:
        codon_to_aa: {"GCA": "A", ...}
        aa_to_codons: {"A": ["GCA", "GCC", "GCG", "GCT"], ...}
    """
    codon_to_aa: dict[str, str] = {}
    with open(path) as f:
        header_skipped = False
        for line in f:
            line = line.strip()
            if not line:
                continue
            if not header_skipped:
                header_skipped = True
                continue
            amino_acid, codon = line.split("\t")
            codon_to_aa[codon.strip().upper()] = amino_acid.strip()

    aa_to_codons: dict[str, list[str]] = {}
    for codon, aa in codon_to_aa.items():
        aa_to_codons.setdefault(aa, []).append(codon)

    return codon_to_aa, aa_to_codons


def _parse_kazusa_matches(path: Path) -> list[tuple[str, str, str]]:
    """Shared low-level parse: returns raw (codon, freq, count) regex matches."""
    text = Path(path).read_text()
    matches = _KAZUSA_LINE_RE.findall(text)
    if not matches:
        raise ValueError(f"No codon usage lines found in {path}. Check file format.")
    return matches


def parse_kazusa_table(path: Path) -> dict[str, float]:
    """
    Parse a vendored Kazusa codon usage table (CUTG-style, RNA alphabet,
    frequency per thousand) into a DNA-alphabet codon -> frequency dict.

    Example line matched: "UUU 22.6( 42439)"
    """
    matches = _parse_kazusa_matches(path)

    codon_usage: dict[str, float] = {}
    for codon, freq, _count in matches:
        dna_codon = codon.replace("U", "T")
        codon_usage[dna_codon] = float(freq)

    if len(codon_usage) != 64:
        raise ValueError(
            f"Expected 64 codons, parsed {len(codon_usage)} from {path}. "
            "File may be truncated or malformed."
        )
    return codon_usage


def total_codon_count(path: Path) -> int:
    """
    Sum of raw codon occurrence counts across all 64 codons in a Kazusa
    table -- used as a reliability proxy for user-supplied source tables
    in codon harmonization (mirrors the CDS-count reliability reasoning
    already applied to excluding low-CDS vendored Bacteroides entries).
    """
    matches = _parse_kazusa_matches(path)
    return sum(int(count) for _codon, _freq, count in matches)


@dataclass
class CodonTable:
    """Bundles codon usage + genetic code + derived ranks for one species."""

    species_key: str
    display_name: str
    kazusa_species_id: int
    source_url: str
    codon_usage: dict[str, float]                  # codon -> freq per thousand
    codon_to_aa: dict[str, str]                     # codon -> amino acid ('*' = stop)
    aa_to_codons: dict[str, list[str]]              # amino acid -> synonymous codons
    codon_rank_within_aa: dict[str, int] = field(init=False)       # 1 = most used
    codon_percentile_within_aa: dict[str, float] = field(init=False)  # 0-1, 1 = most used

    def __post_init__(self):
        self.codon_rank_within_aa = {}
        self.codon_percentile_within_aa = {}
        for aa, codons in self.aa_to_codons.items():
            ranked = sorted(codons, key=lambda c: self.codon_usage[c], reverse=True)
            n = len(ranked)
            for i, codon in enumerate(ranked):
                self.codon_rank_within_aa[codon] = i + 1
                # percentile: 1.0 = most-used synonymous codon, 0.0 = least-used
                self.codon_percentile_within_aa[codon] = (
                    1.0 if n == 1 else 1.0 - (i / (n - 1))
                )

    def best_codon(self, amino_acid: str) -> str:
        """Return the highest-usage codon for a given amino acid."""
        return max(self.aa_to_codons[amino_acid], key=lambda c: self.codon_usage[c])

    def codons_by_usage(self, amino_acid: str) -> list[str]:
        """Synonymous codons for an amino acid, sorted highest usage first."""
        return sorted(self.aa_to_codons[amino_acid], key=lambda c: self.codon_usage[c], reverse=True)


def available_species() -> dict[str, dict]:
    """
    Return metadata for species that are verified and safe to select,
    excluding anything flagged pending/unreliable in metadata.json.
    """
    metadata = json.loads(METADATA_PATH.read_text())
    return {
        key: entry
        for key, entry in metadata["species"].items()
        if entry.get("status") == "verified"
    }


def load_species(species_key: str) -> CodonTable:
    """
    Load a CodonTable for one of the verified vendored species.

    Raises ValueError with a helpful message if the species is unknown or
    not yet verified (e.g. 'fragilis_YCH46' is currently pending -- see
    metadata.json for why).
    """
    metadata = json.loads(METADATA_PATH.read_text())
    species_meta = metadata["species"].get(species_key)

    if species_meta is None:
        valid = list(available_species().keys())
        raise ValueError(f"Unknown species '{species_key}'. Available: {valid}")

    if species_meta.get("status") != "verified":
        raise ValueError(
            f"Species '{species_key}' is not available: status="
            f"{species_meta.get('status')!r}. Note: {species_meta.get('note', 'no details')}"
        )

    codon_usage = parse_kazusa_table(CODON_TABLES_DIR / species_meta["file"])
    codon_to_aa, aa_to_codons = load_genetic_code()

    return CodonTable(
        species_key=species_key,
        display_name=species_meta["display_name"],
        kazusa_species_id=species_meta["kazusa_species_id"],
        source_url=species_meta["source_url"],
        codon_usage=codon_usage,
        codon_to_aa=codon_to_aa,
        aa_to_codons=aa_to_codons,
    )

def source_codon_rank(
    cds_seq: str,
    aa_to_codons: dict[str, list[str]],
) -> dict[str, int]:
    """
    Compute per-codon usage rank (0 = most-used) from a single source CDS,
    ranked within each amino acid's fixed synonymous family (defined by the
    standard genetic code -- same family structure as the target species'
    CodonTable, just re-used here via aa_to_codons).

    Codons in a family that never appear in the source CDS get usage count
    0. Ties (very common in short CDSs, including all-zero ties) are broken
    alphabetically by codon string for determinism.

    Returns: {codon: rank} covering every codon in every family, not just
    the ones observed in this CDS.
    """
    cds_seq = cds_seq.upper()
    codons = [cds_seq[i:i + 3] for i in range(0, len(cds_seq) - 2, 3)]
    counts = Counter(codons)

    rank_map: dict[str, int] = {}
    for aa, family in aa_to_codons.items():
        ranked = sorted(family, key=lambda c: (-counts.get(c, 0), c))
        for i, codon in enumerate(ranked):
            rank_map[codon] = i
    return rank_map


def load_source_table_from_file(path: str | Path, display_name: str | None = None) -> CodonTable:
    """
    Load a CodonTable from a user-supplied Kazusa-format codon usage file,
    for use as the SOURCE organism's table in codon harmonization (see
    core/assign_harmonize.py::harmonize()). Unlike load_species(), this is
    not restricted to the vendored/verified target species set -- the user
    supplies a file downloaded directly from Kazusa for their gene's
    organism of origin.

    Warns (does not raise) if the file's total codon count falls below
    MIN_RELIABLE_CODON_COUNT, since a thin source table produces noisier,
    less trustworthy rank assignments. The user is responsible for judging
    whether to proceed despite the warning.
    """
    path = Path(path)
    total_count = total_codon_count(path)
    if total_count < MIN_RELIABLE_CODON_COUNT:
        warnings.warn(
            f"Source codon usage file '{path.name}' has only {total_count} "
            f"total codon occurrences (threshold: {MIN_RELIABLE_CODON_COUNT}). "
            "Codon usage ranks derived from this table may be unreliable due "
            "to a small underlying sample size. Proceeding anyway.",
            UserWarning,
        )

    codon_usage = parse_kazusa_table(path)
    codon_to_aa, aa_to_codons = load_genetic_code()

    return CodonTable(
        species_key=path.stem,
        display_name=display_name or path.stem,
        kazusa_species_id=-1,
        source_url="user-supplied",
        codon_usage=codon_usage,
        codon_to_aa=codon_to_aa,
        aa_to_codons=aa_to_codons,
    )