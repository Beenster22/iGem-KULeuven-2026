"""
repair/repair_engine.py

Repairs constraint violations via synonymous codon substitution, using the
constraint priority order as a tie-breaker when a fix for one constraint
would violate another. Restriction sites, GC content, and repeats are
checked and protected first; 5' initiation folding is checked and fixed
last, per user decision -- a folding fix must not break any of the other
three, but the other three are free to disturb folding (it'll be
re-addressed on a later pass):

    1. Restriction sites (constraints/restriction.py)
    2. GC content (constraints/gc_content.py)
    3. Repeats (constraints/repeats.py)
    4. 5' initiation folding (constraints/folding.py)

Repairs re-trigger constraint checks after every substitution (a fix can
introduce a new violation elsewhere -- the "whack-a-mole" risk). A candidate
substitution is only accepted if it does NOT introduce a *new* violation at
a strictly higher priority than the one it's fixing; regressions at the same
or lower priority are tolerated and re-addressed on a later pass. Capped at
max_passes; if unresolved after that, returns the best-effort sequence for
report.py to describe rather than hard-failing.

NOTE on an earlier draft of this docstring: it previously described
harmonized-sequence repair as preferring the codon closest to the source
codon's usage PERCENTILE (CodonTable.codon_percentile_within_aa). That was
superseded by the later spec decision: harmonization (and its repair branch)
uses RANK, not percentile -- percentile interpolation is unstable on the
short/sparse per-gene codon counts harmonization works from, while rank is
well-defined even for codons observed once. This implementation follows the
rank decision: repair prefers the constraint-safe synonymous codon closest
to harmonize_metadata[i]["source_rank"], ties broken alphabetically (same
tie-break rule as assign_harmonize.py).

max_passes default of 10 (this module's existing signature) is taken as the
resolved answer to the "max iteration count" open item unless told
otherwise.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Optional, Sequence

from constraints.adapters import folding, repeats, gc_content, restriction
from core.violation import RepairContext, Violation

# Each entry in _CHECKERS exposes: name, priority, check(sequence, context)
# -> list[Violation]. All four are adapters (constraints/adapters.py)
# wrapping the real check_5prime_folding / check_repeats / check_gc_content /
# check_restriction_sites functions, each of which has its own natural
# signature and return type. The real constraint modules are untouched.
# List order here is cosmetic (the loop always re-sorts by .priority) --
# written in priority order for readability: restriction, gc, repeats, folding.
_CHECKERS = [restriction, gc_content, repeats, folding]

DEFAULT_MAX_PASSES = 10


@dataclass
class RepairAction:
    """One accepted synonymous substitution, for the diagnostics report."""

    pass_num: int
    codon_index: int
    old_codon: str
    new_codon: str
    fixed_violation: str
    triggered_by_priority: int
    rank_before: Optional[int] = None   # harmonize mode only: target-table rank of the old codon
    rank_after: Optional[int] = None    # harmonize mode only: target-table rank of the new codon
    magnitude_before: Optional[float] = None  # gradual constraints only -- see Violation.magnitude
    magnitude_after: Optional[float] = None   # None here too means "fully resolved", not "unknown"


@dataclass
class RepairResult:
    sequence: str
    passes_run: int
    converged: bool
    actions: list[RepairAction]
    unresolved: list[Violation]
    initial_violations: list[Violation]
    stop_reason: str = "converged"  # "converged" | "stagnated" | "max_passes"


def _codon_at(seq: str, codon_index: int) -> str:
    start = codon_index * 3
    return seq[start : start + 3]


def _substitute_codon(seq: str, codon_index: int, new_codon: str) -> str:
    start = codon_index * 3
    return seq[:start] + new_codon + seq[start + 3 :]


def _violation_key(v: Violation) -> tuple:
    return (v.constraint, v.codon_indices, v.message)


def _ordered_candidates(
    seq: str,
    codon_index: int,
    codon_table,
    context: RepairContext,
    forbidden: Optional[set[str]] = None,
) -> list[str]:
    """Synonymous codons for the amino acid at codon_index, best-first.

    mode == "optimize": highest target usage first.
    mode == "harmonize": closest to the source codon's usage RANK first
    (ties broken alphabetically), per the spec's rank-preserving repair rule.

    `forbidden`, if given, excludes a set of codons from the candidate list --
    used to stop a gradual-constraint fix from cycling back through values it's
    already tried at this position (see _attempt_fix's `tried` tracking).
    """
    current_codon = _codon_at(seq, codon_index)
    aa = codon_table.codon_to_aa[current_codon]
    ranked = codon_table.codons_by_usage(aa)  # highest-usage-first; list index == target rank
    rank_of = {codon: i for i, codon in enumerate(ranked)}

    candidates = [c for c in ranked if c != current_codon and c not in (forbidden or set())]

    if context.mode == "harmonize" and context.harmonize_metadata is not None:
        source_rank = context.harmonize_metadata[codon_index]["source_rank"]
        candidates.sort(key=lambda c: (abs(rank_of[c] - source_rank), c))
    else:
        candidates.sort(key=lambda c: (rank_of[c], c))

    return candidates


def _ranges_overlap(a: tuple[int, int], b: tuple[int, int]) -> bool:
    return a[0] < b[1] and b[0] < a[1]


_CHECK_CACHE_MAX = 50_000


def _check(checker, seq: str, context: RepairContext) -> list[Violation]:
    """checker.check(seq, context), memoized per repair_sequence() run.

    The repair loop asks the same question about the same sequence many times
    (the baseline for one violation is the result of an earlier trial, a
    rejected candidate is re-evaluated by the next violation, every pass
    re-checks everything, ...). The cache lives on the per-run RepairContext, so
    it never leaks between runs or between different restriction/GC/UTR settings.

    Side effect worth knowing about: check_5prime_folding estimates its z-score
    from random shuffles, so two calls on the same sequence give slightly
    different numbers. With the cache an identical sequence always gets the same
    answer within one run, which removes a source of noise-driven back-and-forth
    in the comparisons the repair loop makes.
    """
    cache = context.__dict__.setdefault("_check_cache", {})
    key = (checker.name, seq)
    hit = cache.get(key)
    if hit is None:
        if len(cache) >= _CHECK_CACHE_MAX:
            cache.clear()
        hit = cache[key] = checker.check(seq, context)
    return hit


def _live_violation(seq: str, violation: Violation, checker, context: RepairContext) -> Optional[Violation]:
    """Return the current version of `violation` in `seq`, or None if it is gone.

    Violations are collected at the start of a pass, but every accepted swap
    changes the sequence -- and in optimize mode one real repeat or one GC-rich
    stretch shows up as dozens of overlapping window violations that a single
    swap resolves together. Without this check the loop went on to "fix" each of
    those already-resolved leftovers anyway, making needless substitutions away
    from the optimal codon (and paying a full-sequence scan for each).

    Binary violations (repeats, restriction sites) are the same violation if the
    constraint, codon indices and message are unchanged. Gradual violations (GC,
    folding) carry numbers in their message that shift as the window improves, so
    they are matched by overlapping nt_range instead, and the worst overlapping
    instance is returned so the caller works against fresh numbers.
    """
    current = _check(checker, seq, context)
    if violation.magnitude is None:
        key = _violation_key(violation)
        return next((v for v in current if _violation_key(v) == key), None)
    overlapping = [
        v for v in current
        if v.constraint == violation.constraint
        and (v.magnitude or 0.0) > 0.0
        and _ranges_overlap(v.nt_range, violation.nt_range)
    ]
    return max(overlapping, key=lambda v: v.magnitude or 0.0) if overlapping else None


def _attempt_fix(
    seq: str,
    violation: Violation,
    codon_table,
    context: RepairContext,
    pass_num: int,
    no_revert: dict[int, set[str]],
) -> tuple[str, Optional[RepairAction]]:
    """Try to make progress on one violation via a single synonymous substitution.

    Binary constraints (violation.magnitude is None -- repeats, restriction_sites):
    a candidate is accepted only if it fully clears this violation instance, same
    as the original all-or-nothing rule.

    Gradual constraints (violation.magnitude is not None -- GC content, folding):
    a candidate is accepted if it measurably lowers the worst magnitude among the
    target checker's violations overlapping this one's nt_range, even if it doesn't
    reach zero -- these are scored over a whole window, so a single codon often
    can't fully resolve them; repeated incremental acceptance across passes is what
    gets there. Candidates are still tried in the same best-usage-first (or
    closest-rank-first, in harmonize mode) order as always -- this doesn't search
    for the single best-possible swap, just the first one that helps, to keep the
    call count bounded (folding's check is expensive: ~100 RNAfold calls each).

    `no_revert` maps codon_index -> the full set of values that codon has already
    moved away from during this repair_sequence() call; none of them are offered
    as candidates again. This exists because check_5prime_folding's z-score is a
    Monte Carlo estimate (n_shuffles random samples), not deterministic -- two
    calls on the same sequence can legitimately disagree on which of two close
    candidates is better. A single-step "don't undo the last swap" guard isn't
    enough: noise can drive a 3-way rotation (A->B->C->A->...) that never reverts
    to the *immediately* prior value while still looping forever. Banning every
    previously-tried value is stronger and also guarantees termination by a
    simple argument -- each amino acid has finitely many synonyms, so once
    they're all exhausted at a position, there's nothing left to cycle between
    and that codon just freezes. The tradeoff: a value rejected once (possibly
    due to noise, possibly correctly) is never reconsidered even if the window's
    composition changes later in a way that would have made it the right choice
    -- that's an acceptable cost against a checker that would otherwise loop
    indefinitely.
    """
    higher_priority = [c for c in _CHECKERS if c.priority < violation.priority]
    target_checker = next(c for c in _CHECKERS if c.name == violation.constraint)
    gradual = violation.magnitude is not None

    # Skip (and report no action for) a violation an earlier swap already resolved;
    # otherwise work against its current form rather than the stale pass-start copy.
    live = _live_violation(seq, violation, target_checker, context)
    if live is None:
        return seq, None
    violation = live

    # Baseline higher-priority violations before touching anything -- a candidate is only
    # rejected for "regression" if it introduces something NOT already present here, so
    # pre-existing unresolved higher-priority issues don't block unrelated lower-priority fixes.
    baseline_higher = {
        hc.name: {_violation_key(v) for v in _check(hc, seq, context)} for hc in higher_priority
    }

    for codon_index in violation.codon_indices:
        old_codon = _codon_at(seq, codon_index)
        forbidden = no_revert.get(codon_index) if gradual else None
        for candidate in _ordered_candidates(seq, codon_index, codon_table, context, forbidden=forbidden):
            trial_seq = _substitute_codon(seq, codon_index, candidate)
            trial_violations = _check(target_checker, trial_seq, context)

            magnitude_before = magnitude_after = None
            if gradual:
                overlapping = [
                    nv
                    for nv in trial_violations
                    if nv.constraint == violation.constraint
                    and _ranges_overlap(nv.nt_range, violation.nt_range)
                ]
                magnitude_before = violation.magnitude
                magnitude_after = max((nv.magnitude or 0.0) for nv in overlapping) if overlapping else 0.0
                accepted = magnitude_after < magnitude_before - 1e-9  # strict, meaningful improvement
            else:
                still_present = any(
                    nv.constraint == violation.constraint and codon_index in nv.codon_indices
                    for nv in trial_violations
                )
                accepted = not still_present

            if not accepted:
                continue

            regression = False
            for hc in higher_priority:
                trial_set = {_violation_key(v) for v in _check(hc, trial_seq, context)}
                if not trial_set.issubset(baseline_higher[hc.name]):
                    regression = True
                    break
            if regression:
                continue

            rank_before = rank_after = None
            if context.mode == "harmonize" and context.harmonize_metadata is not None:
                meta = context.harmonize_metadata[codon_index]
                ranked = codon_table.codons_by_usage(meta["aa"])
                rank_before = ranked.index(old_codon) if old_codon in ranked else None
                rank_after = ranked.index(candidate)
                meta["assigned_codon"] = candidate
                meta["repaired"] = True
                meta["repaired_rank"] = rank_after

            action = RepairAction(
                pass_num=pass_num,
                codon_index=codon_index,
                old_codon=old_codon,
                new_codon=candidate,
                fixed_violation=violation.constraint,
                triggered_by_priority=violation.priority,
                rank_before=rank_before,
                rank_after=rank_after,
                magnitude_before=magnitude_before,
                magnitude_after=magnitude_after,
            )
            return trial_seq, action

    # No synonymous swap at any implicated codon made progress without a higher-priority
    # regression -- leave it; reported as unresolved (best-effort) if still present at the end.
    return seq, None


def repair_sequence(
    cds: str,
    codon_table,
    mode: str = "optimize",
    max_passes: int = DEFAULT_MAX_PASSES,
    *,
    utr: Optional[str] = None,
    harmonize_metadata: Optional[list[dict]] = None,
    restriction_enzymes: Optional[dict[str, str]] = None,
    gc_bounds: Optional[tuple[float, float]] = None,
) -> RepairResult:
    """Run the priority-ordered repair loop to convergence or max_passes.

    mode: "optimize" or "harmonize". harmonize_metadata is required for
    "harmonize" mode (the per-position list returned by
    assign_harmonize.harmonize()) -- repair updates it in place
    (assigned_codon / repaired / repaired_rank) as it goes, so the caller's
    copy reflects any rank drift introduced during repair.

    Each pass: re-check everything via constraints/{folding,repeats,
    gc_content,restriction}.py, then walk violations highest-priority-first,
    applying the first non-regressive synonymous fix found for each. Fixes
    apply immediately within a pass so later violations in the same pass see
    the updated sequence. Stops early on a no-progress pass (stagnation), on
    zero violations, or at max_passes -- whichever comes first. Never raises
    on unresolved violations; those come back on RepairResult.unresolved for
    report.py to surface as warnings.
    """
    context = RepairContext(
        target_table=codon_table,
        mode=mode,
        utr=utr,
        harmonize_metadata=harmonize_metadata,
        restriction_enzymes=restriction_enzymes,
        gc_bounds=gc_bounds,
    )

    def run_all_checks(s: str) -> list[Violation]:
        violations: list[Violation] = []
        for c in _CHECKERS:
            violations.extend(_check(c, s, context))
        return violations

    seq = cds
    actions: list[RepairAction] = []
    initial_violations = run_all_checks(seq)
    prev_signature: Optional[frozenset] = None
    pass_num = 0
    no_revert: dict[int, set[str]] = {}  # codon_index -> every value it's already moved away from

    for pass_num in range(1, max_passes + 1):
        violations = run_all_checks(seq)
        if not violations:
            return RepairResult(seq, pass_num - 1, True, actions, [], initial_violations, "converged")

        signature = frozenset(_violation_key(v) for v in violations)
        if signature == prev_signature:
            final_violations = run_all_checks(seq)
            return RepairResult(
                seq, pass_num - 1, False, actions, final_violations, initial_violations, "stagnated"
            )
        prev_signature = signature
        actions_before_this_pass = len(actions)

        for v in sorted(violations, key=lambda v: v.priority):
            # Binary constraints (repeats, restriction) are fully resolved by one
            # accepted substitution. Gradual constraints (GC, folding) are scored
            # over a whole window and often need several codons' worth of change --
            # keep chipping away at the SAME violation within this pass rather than
            # moving on after one improving swap, or convergence takes as many passes
            # as there are codons to fix.
            current_v = v
            # Safety cap, independent of no_revert: bounds worst-case cost per violation
            # per pass even if some multi-step cycle (A->B->C->A) slips past the
            # single-step no_revert guard -- generous relative to codon_indices so it
            # never limits genuine progress, just runaway churn.
            max_inner_iterations = max(50, 5 * len(v.codon_indices))
            for _ in range(max_inner_iterations):
                seq, action = _attempt_fix(seq, current_v, codon_table, context, pass_num, no_revert)
                if action is None:
                    break
                actions.append(action)
                if current_v.magnitude is not None:
                    no_revert.setdefault(action.codon_index, set()).add(action.old_codon)
                if current_v.magnitude is None:
                    break  # binary: one accepted fix always fully resolves it
                target_checker = next(c for c in _CHECKERS if c.name == current_v.constraint)
                remaining = [
                    nv
                    for nv in _check(target_checker, seq, context)
                    if nv.constraint == current_v.constraint
                    and _ranges_overlap(nv.nt_range, current_v.nt_range)
                ]
                if not remaining:
                    break  # this window's fully clear now
                current_v = max(remaining, key=lambda nv: nv.magnitude or 0.0)

        if len(actions) == actions_before_this_pass:
            # A full pass applied zero substitutions. This is a stronger, noise-proof
            # stagnation signal than the message-text comparison above: that one relies
            # on the violation set looking identical to the previous pass, which never
            # quite happens for a stochastic checker like folding (its z-score isn't
            # bit-identical between calls even when nothing was actually fixed) --
            # meaning it could otherwise burn every remaining pass doing nothing once
            # every codon in a violation's tabu set is exhausted.
            final_violations = run_all_checks(seq)
            return RepairResult(
                seq, pass_num, False, actions, final_violations, initial_violations, "stagnated"
            )

    final_violations = run_all_checks(seq)
    converged = len(final_violations) == 0
    stop_reason = "converged" if converged else "max_passes"
    return RepairResult(seq, pass_num, converged, actions, final_violations, initial_violations, stop_reason)