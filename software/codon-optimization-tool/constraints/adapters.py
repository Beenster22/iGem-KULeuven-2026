"""
constraints/adapters.py

Thin adapters translating each real constraint-check function's own
signature/return type into the uniform interface repair/repair_engine.py
drives:

    name: str
    priority: int
    check(sequence: str, context: RepairContext) -> list[Violation]

The real constraint modules (folding.py, repeats.py, gc_content.py,
restriction.py) are left exactly as they are -- these adapters just wrap
them. repair_engine.py's _CHECKERS should import the instances below.

Coordinate convention: all four real check_* functions use 0-indexed,
end-exclusive nt positions (seq[start:end] is the affected span) --
confirmed directly against check_restriction_sites (matched_seq ==
seq[start:end]), check_repeats (direct/inverted/fuzzy hits all line up
against seq[start1:end1] / seq[start2:end2], including reverse-complement
for inverted repeats), and check_gc_content (reported gc_fraction matches
gc_fraction(seq[start:end]) across every window). This matches how
Violation.nt_range is documented in core/violation.py, so
_nt_range_to_codon_indices below needs no adjustment.
"""
from __future__ import annotations

from core.violation import Violation
from constraints.folding import check_5prime_folding
from constraints.repeats import check_repeats
from constraints.gc_content import check_gc_content
from constraints.restriction import check_restriction_sites


def _nt_range_to_codon_indices(start: int, end: int) -> tuple[int, ...]:
    """nt coordinates (start inclusive, end exclusive) -> codon indices they overlap."""
    first = start // 3
    last = (end - 1) // 3
    return tuple(range(first, last + 1))


class _FoldingAdapter:
    name = "initiation_folding"
    priority = 4  # checked/fixed last -- protected least, per user decision

    # Mirror check_5prime_folding's own defaults. Repair calls check() once per
    # candidate codon substitution, and each call re-runs n_shuffles RNAfold
    # calls -- at the default n_shuffles=100 that's expensive across a
    # 15-codon window. Flagging, not deciding: consider a cheaper n_shuffles
    # for the repair loop's search and a full-n_shuffles re-verification of
    # only the final accepted sequence.
    n_codons = 15
    z_threshold = -2.0
    n_shuffles = 100

    def check(self, sequence: str, context) -> list[Violation]:
        result = check_5prime_folding(
            sequence,
            utr=context.utr,
            n_codons=self.n_codons,
            z_threshold=self.z_threshold,
            n_shuffles=self.n_shuffles,
        )
        if result.passed:
            return []

        window_codons = result.cds_window_len // 3
        return [
            Violation(
                constraint=self.name,
                priority=self.priority,
                # Whole-window violation -- check_5prime_folding scores the window
                # as one unit, so any codon in it is a legal repair target; there's
                # no finer localization available from this check.
                codon_indices=tuple(range(window_codons)),
                nt_range=(0, result.cds_window_len),
                message=(
                    f"5' initiation window folds too strongly "
                    f"(z={result.z_score:.2f}, threshold={result.z_threshold}, "
                    f"mfe={result.mfe:.2f})"
                ),
                # positive when z_score <= z_threshold (too stable/negative); higher = worse
                magnitude=max(0.0, result.z_threshold - result.z_score),
            )
        ]


folding = _FoldingAdapter()


class _RepeatsAdapter:
    name = "repeats"
    priority = 3
    min_len = 11
    max_mismatches = 2

    def check(self, sequence: str, context) -> list[Violation]:
        raw = check_repeats(sequence, min_len=self.min_len, max_mismatches=self.max_mismatches)
        violations = []
        for r in raw:
            # Either copy of the repeat is a legal repair target -- breaking
            # either one resolves this instance.
            codon_indices = tuple(
                sorted(
                    set(_nt_range_to_codon_indices(r.start1, r.end1))
                    | set(_nt_range_to_codon_indices(r.start2, r.end2))
                )
            )
            violations.append(
                Violation(
                    constraint=self.name,
                    priority=self.priority,
                    codon_indices=codon_indices,
                    nt_range=(min(r.start1, r.start2), max(r.end1, r.end2)),
                    message=(
                        f"{r.kind} repeat: {r.start1}-{r.end1} vs {r.start2}-{r.end2} "
                        f"({r.mismatches} mismatches)"
                    ),
                )
            )
        return violations


repeats = _RepeatsAdapter()


class _GCContentAdapter:
    name = "gc_content"
    priority = 2
    ceiling = 0.7
    window_size = 30

    def check(self, sequence: str, context) -> list[Violation]:
        # context.gc_bounds, if the caller set it, overrides the module default
        # ceiling -- e.g. once the ceiling-vs-window open item is finalized
        # against real Bacteroides genomic GC% baselines.
        ceiling = context.gc_bounds[1] if context.gc_bounds else self.ceiling
        raw = check_gc_content(sequence, ceiling=ceiling, window_size=self.window_size)
        violations = []
        for g in raw:
            violations.append(
                Violation(
                    constraint=self.name,
                    priority=self.priority,
                    codon_indices=_nt_range_to_codon_indices(g.start, g.end),
                    nt_range=(g.start, g.end),
                    message=(
                        f"GC {g.gc_fraction:.1%} exceeds ceiling {g.ceiling:.1%} "
                        f"in window {g.start}-{g.end}"
                    ),
                    # positive when over ceiling; higher = worse
                    magnitude=max(0.0, g.gc_fraction - g.ceiling),
                )
            )
        return violations


gc_content = _GCContentAdapter()


class _RestrictionAdapter:
    name = "restriction_sites"
    priority = 1

    def check(self, sequence: str, context) -> list[Violation]:
        # context.restriction_enzymes, if set, overrides check_restriction_sites'
        # own built-in default list.
        kwargs = {} if context.restriction_enzymes is None else {"enzymes": context.restriction_enzymes}
        raw = check_restriction_sites(sequence, **kwargs)
        violations = []
        for r in raw:
            violations.append(
                Violation(
                    constraint=self.name,
                    priority=self.priority,
                    codon_indices=_nt_range_to_codon_indices(r.start, r.end),
                    nt_range=(r.start, r.end),
                    message=f"{r.enzyme} site ({r.strand} strand) at {r.start}-{r.end}: {r.matched_seq}",
                )
            )
        return violations


restriction = _RestrictionAdapter()