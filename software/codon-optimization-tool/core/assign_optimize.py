"""
assign_optimize.py

Full codon optimization: at every position, assign the highest-usage
synonymous codon for that amino acid in the target species' codon usage
table. Maximizes translation speed/yield; best for simple, well-behaved
heterologous proteins (see project spec).

This is the "Mode 1" assignment strategy. It shares the CodonTable object
(from core.codon_table) with assign_harmonize.py, so both strategies stay
decoupled from constraint-checking and repair.
"""

from __future__ import annotations

from core.codon_table import CodonTable
from core.sequence_utils import split_codons, translate_cds, validate_cds


def optimize_sequence(cds: str, codon_table: CodonTable) -> str:
    """
    Full codon optimization of a DNA CDS for the given species.

    Args:
        cds: input coding DNA sequence (uppercase ACGT, len % 3 == 0)
        codon_table: a loaded CodonTable for the target species

    Returns:
        A new DNA sequence of the same length, with the highest-usage
        synonymous codon substituted at every position. The stop codon
        (if present as the last codon) is preserved as a stop, using the
        target species' most-used stop codon.
    """
    validate_cds(cds, codon_table.codon_to_aa)
    protein = translate_cds(cds, codon_table.codon_to_aa)

    optimized_codons = [codon_table.best_codon(aa) for aa in protein]
    return "".join(optimized_codons)


def optimize_report(cds: str, codon_table: CodonTable) -> list[dict]:
    """
    Same as optimize_sequence, but returns a per-position diagnostic list
    instead of just the final sequence -- useful for notebook inspection
    and for feeding into report.py later.

    Each entry: {position, amino_acid, original_codon, new_codon,
                 original_usage, new_usage}
    """
    validate_cds(cds, codon_table.codon_to_aa)
    original_codons = split_codons(cds)
    protein = translate_cds(cds, codon_table.codon_to_aa)

    rows = []
    for i, (aa, orig_codon) in enumerate(zip(protein, original_codons)):
        new_codon = codon_table.best_codon(aa)
        rows.append({
            "position": i,
            "amino_acid": aa,
            "original_codon": orig_codon,
            "new_codon": new_codon,
            "original_usage": codon_table.codon_usage.get(orig_codon),
            "new_usage": codon_table.codon_usage[new_codon],
            "changed": orig_codon != new_codon,
        })
    return rows
