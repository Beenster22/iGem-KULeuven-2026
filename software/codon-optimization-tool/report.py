"""
report.py

Compiles the diagnostics/warning report from a RepairResult. Never a hard
failure -- unresolved violations are surfaced as warnings rather than an
exception, per spec ("A diagnostics/warning report listing any constraints
that could not be fully resolved, rather than a hard failure").
"""
from __future__ import annotations

import json
from dataclasses import asdict, dataclass, field
from typing import Optional

from core.violation import Violation
from repair.repair_engine import RepairResult


@dataclass
class ConstraintSummary:
    constraint: str
    priority: int
    initial_violation_count: int = 0
    resolved_count: int = 0
    unresolved_count: int = 0
    unresolved_details: list[str] = field(default_factory=list)


@dataclass
class DiagnosticsReport:
    species: str
    mode: str
    sequence_length_nt: int
    gc_content_pct: float
    converged: bool
    passes_run: int
    total_repairs_made: int
    per_constraint: list[ConstraintSummary]
    repair_log: list[dict]   # flattened RepairAction records, in the order they were applied
    unresolved: list[dict]   # flattened remaining Violation records, priority order
    notes: list[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        return asdict(self)

    def to_json(self, indent: int = 2) -> str:
        return json.dumps(self.to_dict(), indent=indent)

    def to_text(self) -> str:
        lines = [
            f"=== Codon Optimization Diagnostics: {self.species} ({self.mode}) ===",
            f"Sequence length: {self.sequence_length_nt} nt   GC%: {self.gc_content_pct:.1f}%",
        ]
        status = (
            "PASS - all constraints satisfied"
            if self.converged
            else "PARTIAL - unresolved constraints remain (best-effort output)"
        )
        lines.append(f"Status: {status}")
        lines.append(f"Repair passes run: {self.passes_run}   Substitutions made: {self.total_repairs_made}")
        lines.append("")
        lines.append("Per-constraint summary (priority order):")
        for cs in sorted(self.per_constraint, key=lambda c: c.priority):
            lines.append(
                f"  [{cs.priority}] {cs.constraint}: "
                f"{cs.initial_violation_count} found -> {cs.resolved_count} resolved, "
                f"{cs.unresolved_count} unresolved"
            )
            for d in cs.unresolved_details:
                lines.append(f"        ! {d}")
        if self.notes:
            lines.append("")
            lines.append("Notes:")
            for n in self.notes:
                lines.append(f"  - {n}")
        return "\n".join(lines)


def _gc_content(seq: str) -> float:
    seq = seq.upper()
    if not seq:
        return 0.0
    gc = sum(1 for b in seq if b in "GC")
    return 100.0 * gc / len(seq)


def build_report(
    species: str,
    mode: str,
    final_sequence: str,
    repair_result: RepairResult,
    notes: Optional[list[str]] = None,
) -> DiagnosticsReport:
    initial = repair_result.initial_violations
    unresolved = repair_result.unresolved
    actions = repair_result.actions

    by_constraint: dict[str, ConstraintSummary] = {}

    def get(v_or_name, priority=None):
        name = v_or_name if isinstance(v_or_name, str) else v_or_name.constraint
        pri = priority if priority is not None else v_or_name.priority
        return by_constraint.setdefault(name, ConstraintSummary(name, pri))

    for v in initial:
        get(v).initial_violation_count += 1

    for a in actions:
        # resolved count is attributed to the constraint the action targeted;
        # priority comes along with it even if that constraint had zero initial
        # violations recorded above (shouldn't happen, but stay defensive)
        get(a.fixed_violation, a.triggered_by_priority).resolved_count += 1

    for v in unresolved:
        cs = get(v)
        cs.unresolved_count += 1
        cs.unresolved_details.append(f"{v.message} (nt {v.nt_range[0]}-{v.nt_range[1]})")

    per_constraint = sorted(by_constraint.values(), key=lambda c: c.priority)

    repair_log = [asdict(a) for a in actions]
    unresolved_flat = [
        {
            "constraint": v.constraint,
            "priority": v.priority,
            "nt_range": v.nt_range,
            "message": v.message,
            "severity": v.severity,
        }
        for v in sorted(unresolved, key=lambda v: v.priority)
    ]

    all_notes = list(notes) if notes else []
    if not repair_result.converged:
        if getattr(repair_result, "stop_reason", None) == "stagnated":
            all_notes.append(
                "Repair loop stopped early: a full pass made no progress on the remaining "
                "violation(s) below, so it gave up rather than spin. Output is best-effort. "
                "Raising max_passes will not help here -- the remaining constraint(s) need a "
                "different fix strategy (e.g. a wider repair window, or relaxing the constraint)."
            )
        else:
            all_notes.append(
                "Repair loop reached its pass cap before all constraints were satisfied; "
                "output is best-effort. Consider raising max_passes or revisiting the "
                "unresolved constraint(s) listed above."
            )

    return DiagnosticsReport(
        species=species,
        mode=mode,
        sequence_length_nt=len(final_sequence),
        gc_content_pct=_gc_content(final_sequence),
        converged=repair_result.converged,
        passes_run=repair_result.passes_run,
        total_repairs_made=len(actions),
        per_constraint=per_constraint,
        repair_log=repair_log,
        unresolved=unresolved_flat,
        notes=all_notes,
    )