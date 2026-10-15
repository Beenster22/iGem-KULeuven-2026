"""
gc_content.py

GC content constraint: checks that a DNA sequence's GC% stays under an
upper ceiling, both globally (whole sequence) and locally (sliding
window), to avoid synthesis difficulty and GC-rich secondary structure.

Ceiling-only, no floor: The ceiling
exists purely to catch drift toward GC-rich extremes, most likely
introduced by repair substitutions made to satisfy a higher-priority
constraint (folding, repeats).

Windowed check catches localized GC-rich stretches (e.g. a short
hairpin-prone hotspot) that a global average could dilute and miss in
an otherwise typical-GC sequence.

Default ceiling (70%) follows common gene-synthesis-vendor guidance for
flagging hairpin-prone, synthesis-difficult GC-rich regions -- not tied
to Bacteroides' native genomic GC%.
"""

from __future__ import annotations

from dataclasses import dataclass

GC_CEILING = 0.70   # global and windowed upper bound, as a fraction (0-1)
WINDOW_SIZE = 30    # bp, sliding-window size for local GC checks


@dataclass
class GCViolation:
    """A single GC%-ceiling violation, either global or windowed."""
    kind: str            # "global" or "windowed"
    start: int            # nt index into the sequence (0 for global)
    end: int              # nt index (len(seq) for global)
    gc_fraction: float    # the actual GC fraction observed
    ceiling: float        # the ceiling that was exceeded


def gc_fraction(seq: str) -> float:
    """Fraction of G/C bases in a DNA sequence (0.0-1.0)."""
    seq = seq.upper()
    if not seq:
        return 0.0
    gc_count = seq.count("G") + seq.count("C")
    return gc_count / len(seq)


def check_gc_content(
    seq: str,
    ceiling: float = GC_CEILING,
    window_size: int = WINDOW_SIZE,
) -> list[GCViolation]:
    """
    Check a DNA sequence against the GC% ceiling, both globally and in
    every sliding window of window_size. Returns a list of violations
    (empty if none). Sequences shorter than window_size skip the
    windowed check and rely on the global check only.
    """
    violations: list[GCViolation] = []
    seq = seq.upper()

    # Global check
    global_gc = gc_fraction(seq)
    if global_gc > ceiling:
        violations.append(GCViolation(
            kind="global", start=0, end=len(seq),
            gc_fraction=global_gc, ceiling=ceiling,
        ))

    # Windowed check
    if len(seq) >= window_size:
        for start in range(0, len(seq) - window_size + 1):
            window = seq[start:start + window_size]
            window_gc = gc_fraction(window)
            if window_gc > ceiling:
                violations.append(GCViolation(
                    kind="windowed", start=start, end=start + window_size,
                    gc_fraction=window_gc, ceiling=ceiling,
                ))

    return violations