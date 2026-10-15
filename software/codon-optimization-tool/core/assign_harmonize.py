"""
assign_harmonize.py

Codon harmonization: preserve the source gene's per-position codon usage
rank (rare vs. common, within each amino acid's synonymous group), mapped
onto the equivalent rank in the target Bacteroides species' codon usage
table.

Source usage can come from either:
- a user-supplied Kazusa-format codon usage table for the gene's
  organism of origin (loaded via core.codon_table.load_source_table_from_file),
  matching the classical harmonization method (Angov et al. 2008); or
- self-referential ranking computed directly from the input CDS itself,
  used as a fallback when no source-organism table is supplied.

Rank-based (not raw frequency-percentile) in both cases: short/synthetic
source sequences produce sparse counts and frequent ties, which rank
handles cleanly (see source_codon_rank in core/codon_table.py for
tie-breaking, used only in the self-referential fallback path).
"""

from core.codon_table import CodonTable, source_codon_rank


def harmonize(
    source_cds: str,
    target_table: CodonTable,
    source_table: CodonTable | None = None,
) -> tuple[str, list[dict]]:
    """
    Returns (harmonized_sequence, position_metadata). Each metadata entry
    records source_rank/family_size so repair_engine.py can later prefer
    the synonymous codon closest to the original rank when repairing a
    constraint violation.

    Args:
        source_cds: input coding DNA sequence.
        target_table: CodonTable for the target Bacteroides species.
        source_table: optional CodonTable for the source gene's organism
            of origin, loaded via core.codon_table.load_source_table_from_file
            from a user-supplied Kazusa-format file. If provided, codon
            rank is computed from that organism's genome-wide usage
            (classical harmonization). If None, falls back to
            self-referential ranking computed from source_cds itself.
    """
    source_cds = source_cds.upper()

    if source_table is not None:
        # codon_rank_within_aa is 1-indexed (1 = most used); normalize to
        # 0-indexed so it matches source_codon_rank()'s convention below.
        rank_map = {
            codon: rank - 1
            for codon, rank in source_table.codon_rank_within_aa.items()
        }
        rank_method = "source_organism_table"
    else:
        rank_map = source_codon_rank(source_cds, target_table.aa_to_codons)
        rank_method = "self_referential"

    codons = [source_cds[i:i + 3] for i in range(0, len(source_cds) - 2, 3)]
    assigned, metadata = [], []

    for codon in codons:
        aa = target_table.codon_to_aa[codon]
        rank = rank_map[codon]
        family_size = len(target_table.aa_to_codons[aa])

        target_ranked = target_table.codons_by_usage(aa)  # highest usage first
        new_codon = target_ranked[rank]

        assigned.append(new_codon)
        metadata.append({
            "aa": aa,
            "source_codon": codon,
            "source_rank": rank,
            "family_size": family_size,
            "assigned_codon": new_codon,
            "source_rank_method": rank_method,
        })

    return "".join(assigned), metadata