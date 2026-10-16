"""
repeats.py

Repeats constraint: flags exact and approximate direct/inverted repeats
within a DNA sequence, motivated by recombination/instability risk during
cloning/propagation and synthesis difficulty (long homopolymers,
GC-rich hairpins).

Hierarchical/tiered approach (per project spec):
  Tier 1 - exact repeats >= MIN_REPEAT_LEN bp (direct and inverted)
  Tier 2 - approximate/fuzzy repeats (allowing up to MAX_MISMATCHES
           mismatches), same minimum length reported separately from
           tier 1, so an exact match is never double-counted as fuzzy.

"Direct" repeat: an identical substring occurring at
two or more positions in the sequence recombination risk between the
repeated segments.

"Inverted" repeat: a substring whose reverse complement occurs elsewhere
in the sequence: risk of hairpin/cruciform secondary structure.

Implementation note: reports every qualifying window pair of length
MIN_REPEAT_LEN, rather than merging overlapping windows into a single
maximal-length match. A real repeat longer than MIN_REPEAT_LEN will
therefore surface as several overlapping violations rather than one --
an intentional simplification for a first correct version. Merging into
maximal runs can be layered on later (e.g. in report.py) without
changing this detection logic.

Performance note: comparing every pair of windows directly is O(n^2) and
took over a second per call on a ~700 bp gene, which dominated the repair
loop (it re-checks the whole sequence for every candidate codon swap). The
search below returns exactly the same violations in exactly the same order
but avoids almost all of those comparisons with a pigeonhole k-mer index:
if two windows of length L differ in at most m positions, then splitting
both into m+1 equal-position segments guarantees at least one segment pair
is identical. So only window pairs that share an exact segment need to be
compared in full. For m=0 (the exact tier) the single "segment" is the
whole window, so it reduces to a hash lookup.
"""

from __future__ import annotations

from bisect import bisect_left
from dataclasses import dataclass

MIN_REPEAT_LEN = 11    # bp, per project spec
MAX_MISMATCHES = 2      # allowed mismatches for the fuzzy tier

_COMPLEMENT = str.maketrans("ACGT", "TGCA")


@dataclass
class RepeatViolation:
    """A single repeat match between two windows of the sequence."""
    kind: str            # "direct_exact", "inverted_exact", "direct_fuzzy", "inverted_fuzzy"
    start1: int
    end1: int
    start2: int
    end2: int
    mismatches: int       # 0 for the exact tier


def reverse_complement(seq: str) -> str:
    return seq.translate(_COMPLEMENT)[::-1]


def _hamming(a: str, b: str) -> int:
    return sum(1 for x, y in zip(a, b) if x != y)


def _segment_bounds(length: int, n_segments: int) -> list[tuple[int, int]]:
    """Split [0, length) into n_segments contiguous, near-equal pieces."""
    base, extra = divmod(length, n_segments)
    bounds = []
    pos = 0
    for k in range(n_segments):
        size = base + (1 if k < extra else 0)
        bounds.append((pos, pos + size))
        pos += size
    return bounds


def _find_pairs(
    windows_a: list[str],
    windows_b: list[str],
    min_len: int,
    max_mismatches: int,
) -> list[tuple[int, int, int]]:
    """
    Return (i, j, mismatches) for every i, j with j >= i + min_len (so the two
    windows do not overlap) and hamming(windows_a[i], windows_b[j]) <=
    max_mismatches, ordered by i then j -- the same order a nested
    "for i: for j:" scan would produce.

    max_mismatches=0 -> exact matches only.
    max_mismatches=N (N>0) -> fuzzy matches only (1..N mismatches); exact
    matches are excluded because they belong to the separate exact tier.
    """
    n_windows = len(windows_a)
    n_segments = max_mismatches + 1
    results: list[tuple[int, int, int]] = []

    if n_segments > min_len:
        # Degenerate parameters (more allowed mismatches than segments of
        # at least one base): the pigeonhole guarantee no longer prunes
        # anything, so fall back to comparing every pair.
        for i in range(n_windows):
            for j in range(i + min_len, n_windows):
                mm = _hamming(windows_a[i], windows_b[j])
                if mm <= max_mismatches and (max_mismatches == 0 or mm > 0):
                    results.append((i, j, mm))
        return results

    bounds = _segment_bounds(min_len, n_segments)

    # index[k][segment_string] -> ascending list of j whose window has that
    # segment at position k
    index: list[dict[str, list[int]]] = [{} for _ in range(n_segments)]
    for j, wb in enumerate(windows_b):
        for k, (lo, hi) in enumerate(bounds):
            index[k].setdefault(wb[lo:hi], []).append(j)

    for i, wa in enumerate(windows_a):
        first_j = i + min_len
        if first_j >= n_windows:
            break
        candidates: set[int] = set()
        for k, (lo, hi) in enumerate(bounds):
            js = index[k].get(wa[lo:hi])
            if js:
                start = bisect_left(js, first_j)
                if start < len(js):
                    candidates.update(js[start:])
        for j in sorted(candidates):
            mm = _hamming(wa, windows_b[j])
            if mm <= max_mismatches and (max_mismatches == 0 or mm > 0):
                results.append((i, j, mm))
    return results


def _find_direct_repeats(seq: str, min_len: int, max_mismatches: int) -> list[RepeatViolation]:
    """
    Compare every pair of non-overlapping windows of length min_len.
    max_mismatches=0 -> exact tier. max_mismatches=N (N>0) -> fuzzy tier
    only (mismatches in 1..N; exact matches are excluded here since
    they're reported by the separate exact-tier call).
    """
    n = len(seq)
    windows = [seq[i:i + min_len] for i in range(n - min_len + 1)]
    return [
        RepeatViolation(
            kind="direct_exact" if mm == 0 else "direct_fuzzy",
            start1=i, end1=i + min_len,
            start2=j, end2=j + min_len,
            mismatches=mm,
        )
        for i, j, mm in _find_pairs(windows, windows, min_len, max_mismatches)
    ]


def _find_inverted_repeats(seq: str, min_len: int, max_mismatches: int) -> list[RepeatViolation]:
    """
    Compare every window of length min_len against the reverse complement
    of every later, non-overlapping window (i < j only, to avoid
    reporting each inverted pair twice -- reverse complement is an
    involution, so (i,j) and (j,i) are the same physical repeat).
    """
    n = len(seq)
    windows = [seq[i:i + min_len] for i in range(n - min_len + 1)]
    rc_windows = [reverse_complement(w) for w in windows]
    return [
        RepeatViolation(
            kind="inverted_exact" if mm == 0 else "inverted_fuzzy",
            start1=i, end1=i + min_len,
            start2=j, end2=j + min_len,
            mismatches=mm,
        )
        for i, j, mm in _find_pairs(windows, rc_windows, min_len, max_mismatches)
    ]


def check_repeats(
    seq: str,
    min_len: int = MIN_REPEAT_LEN,
    max_mismatches: int = MAX_MISMATCHES,
) -> list[RepeatViolation]:
    """
    Run both tiers (exact, then fuzzy) for both direct and inverted
    repeats. Returns a combined list of violations (empty if none).
    """
    seq = seq.upper()
    violations = []
    violations += _find_direct_repeats(seq, min_len, max_mismatches=0)
    violations += _find_inverted_repeats(seq, min_len, max_mismatches=0)
    if max_mismatches > 0:
        violations += _find_direct_repeats(seq, min_len, max_mismatches)
        violations += _find_inverted_repeats(seq, min_len, max_mismatches)
    return violations
