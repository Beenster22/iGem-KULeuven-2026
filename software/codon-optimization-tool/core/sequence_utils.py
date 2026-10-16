"""
sequence_utils.py

Small, dependency-free DNA sequence helpers shared across assignment,
constraint-checking, and repair modules.
"""

from __future__ import annotations


def clean_dna(seq: str) -> str:
    """Uppercase and strip whitespace from a raw pasted DNA sequence."""
    return "".join(seq.split()).upper()


def validate_cds(seq: str, codon_to_aa: dict[str, str]) -> None:
    """
    Basic sanity checks on a coding sequence. Raises ValueError if the
    sequence isn't usable as a CDS.
    """
    if len(seq) % 3 != 0:
        raise ValueError(f"Sequence length ({len(seq)}) is not a multiple of 3.")
    if not set(seq) <= set("ACGT"):
        bad_chars = set(seq) - set("ACGT")
        raise ValueError(f"Sequence contains non-ACGT characters: {bad_chars}")

    codons = [seq[i:i + 3] for i in range(0, len(seq), 3)]
    stop_codons = [c for c in codons if codon_to_aa.get(c) == "*"]
    if not stop_codons:
        # Not fatal -- some users pass CDS fragments -- but worth knowing.
        pass
    internal_stops = [c for c in codons[:-1] if codon_to_aa.get(c) == "*"]
    if internal_stops:
        raise ValueError(
            f"Sequence contains {len(internal_stops)} internal stop codon(s) "
            "before the final codon. Check reading frame."
        )


def split_codons(seq: str) -> list[str]:
    """Split a DNA sequence into a list of codons (assumes len % 3 == 0)."""
    return [seq[i:i + 3] for i in range(0, len(seq), 3)]


def translate_cds(seq: str, codon_to_aa: dict[str, str]) -> str:
    """Translate a DNA CDS into a single-letter amino acid string ('*' = stop)."""
    return "".join(codon_to_aa[codon] for codon in split_codons(seq))


def gc_content(seq: str) -> float:
    """Global GC fraction (0-1) of a DNA sequence."""
    if not seq:
        return 0.0
    gc = sum(1 for base in seq if base in "GC")
    return gc / len(seq)


def gc_content_windowed(seq: str, window: int = 50, step: int = 10) -> list[tuple[int, float]]:
    """
    Sliding-window GC% across a sequence.

    Returns a list of (window_start_index, gc_fraction) tuples.
    """
    if len(seq) < window:
        return [(0, gc_content(seq))]
    return [
        (i, gc_content(seq[i:i + window]))
        for i in range(0, len(seq) - window + 1, step)
    ]


def reverse_complement(seq: str) -> str:
    complement = {"A": "T", "T": "A", "G": "C", "C": "G"}
    return "".join(complement[b] for b in reversed(seq))
