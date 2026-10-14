"""
restriction.py

Restriction site constraint: flags any occurrence of a fixed set of
restriction enzyme recognition sequences (or their reverse complements)
within a DNA sequence. currently: BsaI, PaqCI, SapI, BbsI, EcoRI, NotI,
XbaI, SpeI and PstI.

Both the forward recognition sequence and its reverse complement are
searched for every enzyme. This is necessary for the four Type IIS
enzymes (BsaI, PaqCI, SapI, BbsI), whose recognition sequences are
non-palindromic and asymmetric; for the remaining five palindromic
enzymes (EcoRI, NotI, XbaI, SpeI, PstI) the forward and reverse-complement
searches will find the same sites, so duplicate hits at the same position
are deduplicated.
"""

from __future__ import annotations
from dataclasses import dataclass
from data.restriction_sites import RESTRICTION_ENZYMES
_COMPLEMENT = str.maketrans("ACGT", "TGCA")


@dataclass
class RestrictionViolation:
    """A single restriction site match."""
    enzyme: str
    start: int
    end: int
    strand: str  # "forward" or "reverse"
    matched_seq: str


def reverse_complement(seq: str) -> str:
    return seq.translate(_COMPLEMENT)[::-1]


def check_restriction_sites(
    seq: str,
    enzymes: dict[str, str] = RESTRICTION_ENZYMES,
) -> list[RestrictionViolation]:
    """
    Scan seq for every enzyme's recognition sequence, on both strands.
    Returns a list of violations (empty if none). Palindromic enzymes'
    forward/reverse hits at the same position are deduplicated, keeping
    the forward-strand entry.
    """
    seq = seq.upper()
    seen: set[tuple[str, int, int]] = set()
    violations: list[RestrictionViolation] = []

    for enzyme, site in enzymes.items():
        site = site.upper()
        rc_site = reverse_complement(site)

        for strand, pattern in (("forward", site), ("reverse", rc_site)):
            start = 0
            while True:
                idx = seq.find(pattern, start)
                if idx == -1:
                    break
                end = idx + len(pattern)
                key = (enzyme, idx, end)
                if key not in seen:
                    seen.add(key)
                    violations.append(RestrictionViolation(
                        enzyme=enzyme, start=idx, end=end,
                        strand=strand, matched_seq=seq[idx:end],
                    ))
                start = idx + 1  # allow overlapping matches

    return violations