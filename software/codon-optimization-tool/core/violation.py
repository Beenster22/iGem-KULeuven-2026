"""
core/violation.py

Shared data structures used across constraints/*.py, repair/repair_engine.py,
and report.py.

Interface contract for constraint checkers (constraints/*.py)
---------------------------------------------------------------
This is the contract the repair engine is built against. If your existing
constraints/*.py modules from earlier sessions don't yet match this shape,
they need a thin adapter (or a rewrite of `check()`'s return type) before
the repair engine can drive them -- flag that back if so.

Each constraint module should expose a module-level object (or class
instance) conforming to `ConstraintChecker`:

    name: str        -- one of "restriction_sites", "gc_content", "repeats",
                         "initiation_folding" (see PRIORITY_NAMES below)
    priority: int     -- 1 (highest, protected first) .. 4 (lowest), per the
                         tie-break order (updated per user decision -- folding
                         checked/protected last, not first):
                           1 = restriction sites
                           2 = GC content
                           3 = repeats
                           4 = 5' translation initiation folding
    def check(sequence: str, context: RepairContext) -> list[Violation]: ...

`check()` must be a *pure* function of (sequence, context) - it re-derives
violations from scratch on every call. The repair loop leans on this to
safely probe candidate substitutions (build a trial sequence, re-check,
discard if it doesn't help) without any hidden state.

Each Violation must localize itself to specific codon positions via
`codon_indices` -- these are the only positions the repair engine will try
substituting to resolve that violation. For constraints that are inherently
about a specific short region (initiation folding: first ~10-15 codons +
UTR; a restriction site: the codons spanning the recognition sequence; a
repeat: the codons spanning one copy of the repeat), list the codon indices
whose synonymous substitution could plausibly break the offending pattern --
not necessarily every codon in the CDS.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Optional, Protocol

PRIORITY_NAMES = {
    1: "restriction_sites",
    2: "gc_content",
    3: "repeats",
    4: "initiation_folding",
}


@dataclass(frozen=True)
class Violation:
    constraint: str                  # must match a key in PRIORITY_NAMES' values
    priority: int                    # 1 = highest priority (protected first) ... 4 = lowest
    codon_indices: tuple[int, ...]   # 0-indexed codon positions that may be substituted to fix this
    nt_range: tuple[int, int]        # (start, end) nt coordinates, end-exclusive -- for reporting only
    message: str
    severity: str = "violation"      # "violation" (must fix) or "warning" (soft, e.g. folding margin)
    magnitude: Optional[float] = None
    # How far this instance is from passing, for constraints that are scored over a whole
    # window rather than localized to one codon (GC content, folding) -- e.g. gc_fraction
    # minus ceiling, or z_threshold minus z_score. Higher = worse; 0 or below = passing.
    # None (the default) means this constraint is binary -- a fix must fully resolve it in
    # one substitution (used by repeats and restriction_sites, which genuinely are
    # point-fixable). When set, the repair loop accepts a substitution that measurably
    # lowers this value even if it doesn't reach zero, since a window-wide violation often
    # needs several codons' worth of cumulative change, not one swap.

    def __post_init__(self):
        if self.priority not in PRIORITY_NAMES:
            raise ValueError(f"priority must be 1-4, got {self.priority!r}")
        if PRIORITY_NAMES[self.priority] != self.constraint:
            # Not fatal -- constraint names are free text in principle -- but priority order
            # is the whole point of the tie-break rule, so mismatches are almost always a bug.
            raise ValueError(
                f"constraint {self.constraint!r} does not match expected name "
                f"{PRIORITY_NAMES[self.priority]!r} for priority {self.priority}"
            )


class ConstraintChecker(Protocol):
    name: str
    priority: int

    def check(self, sequence: str, context: "RepairContext") -> list[Violation]: ...


@dataclass
class RepairContext:
    """Everything a constraint checker or the repair engine needs beyond the raw sequence."""

    target_table: object                                   # core.codon_table.CodonTable
    mode: str                                               # "full" or "harmonize"
    utr: Optional[str] = None
    harmonize_metadata: Optional[list[dict]] = None         # per-position dicts from assign_harmonize.harmonize()
    restriction_enzymes: Optional[dict[str, str]] = None    # name -> recognition seq (fixed user list; Open Item)
    gc_bounds: Optional[tuple[float, float]] = None         # (min_gc, max_gc) fractions -- final cutoff is an Open Item