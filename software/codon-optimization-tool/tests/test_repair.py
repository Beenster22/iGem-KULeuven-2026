"""
End-to-end checks of the repair loop against the real constraint checkers.

Short synthetic sequences only. The folding check is stochastic, so these
tests avoid asserting anything about the folding outcome.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from core.codon_table import load_species
from core.sequence_utils import translate_cds
from constraints.restriction import check_restriction_sites
from repair.repair_engine import repair_sequence

SPECIES = "thetaiotaomicron_VPI-5482"



def test_restriction_site_is_removed_and_protein_unchanged():
    # E-F-S-K: GAA TTC ... plants an EcoRI site (GAATTC) across codons 0-1
    cds = "ATG" + "GAA" + "TTC" + "AAA" * 8 + "TAA"
    table = load_species(SPECIES)
    start = cds  # deliberately keep the planted site
    assert check_restriction_sites(start)
    result = repair_sequence(start, table, mode="optimize", max_passes=5)
    assert translate_cds(result.sequence, table.codon_to_aa) == translate_cds(start, table.codon_to_aa)
    assert not any(v.constraint == "restriction_sites" for v in result.unresolved)
    assert "GAATTC" not in result.sequence


def test_result_is_in_frame_and_same_length():
    cds = "ATG" + "GAA" * 5 + "TTC" + "GAA" * 5 + "TAA"
    table = load_species(SPECIES)
    result = repair_sequence(cds, table, mode="optimize", max_passes=3)
    assert len(result.sequence) == len(cds)
    assert len(result.sequence) % 3 == 0
    assert translate_cds(result.sequence, table.codon_to_aa) == translate_cds(cds, table.codon_to_aa)


def test_stop_reason_is_reported():
    cds = "ATG" + "GAA" + "TTC" + "AAA" * 8 + "TAA"
    table = load_species(SPECIES)
    result = repair_sequence(cds, table, mode="optimize", max_passes=3)
    assert result.stop_reason in {"converged", "stagnated", "max_passes"}
