"""
Minimal pytest-style regression tests for core/codon_table.py and
core/assign_optimize.py. Graduate more of these here as modules stabilize
-- the notebook is for interactive/visual checks, not the permanent test
suite (see project instructions, Development Environment section).
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from core.codon_table import load_species, available_species
from core.assign_optimize import optimize_sequence
from core.sequence_utils import translate_cds, gc_content


def test_available_species_excludes_unverified():
    species = available_species()
    assert "thetaiotaomicron_VPI-5482" in species
    assert "fragilis_NCTC_9343" in species
    assert "fragilis_YCH46" not in species  # pending verification, must not leak in


def test_codon_table_has_64_codons():
    ct = load_species("thetaiotaomicron_VPI-5482")
    assert len(ct.codon_usage) == 64
    assert len(ct.codon_to_aa) == 64


def test_best_codon_is_highest_usage():
    ct = load_species("thetaiotaomicron_VPI-5482")
    best = ct.best_codon("L")
    all_L_usages = [ct.codon_usage[c] for c in ct.aa_to_codons["L"]]
    assert ct.codon_usage[best] == max(all_L_usages)


def test_optimize_preserves_translation():
    ct = load_species("thetaiotaomicron_VPI-5482")
    cds = "ATGCTATTATCATAA"
    optimized = optimize_sequence(cds, ct)
    assert len(optimized) == len(cds)
    assert translate_cds(cds, ct.codon_to_aa) == translate_cds(optimized, ct.codon_to_aa)


def test_gc_content_bounds():
    assert gc_content("GGCC") == 1.0
    assert gc_content("AATT") == 0.0
    assert gc_content("") == 0.0
