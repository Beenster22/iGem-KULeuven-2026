"""
tests/test_repeats_fast.py

The repeat scanner in constraints/repeats.py uses a k-mer index to avoid
comparing every pair of windows. These tests pin it to the obvious brute-force
definition: the fast version must return exactly the same violations, in the
same order, as comparing every non-overlapping window pair directly.
"""
import dataclasses
import random

import pytest

from constraints.repeats import check_repeats, reverse_complement


def _hamming(a, b):
    return sum(1 for x, y in zip(a, b) if x != y)


def _brute_force(seq, min_len, max_mismatches):
    """Reference implementation: the straightforward O(n^2) definition."""
    seq = seq.upper()
    n = len(seq)
    last = n - min_len + 1  # number of windows
    out = []

    def scan(kind, mm_limit, inverted):
        for i in range(last):
            wi = seq[i:i + min_len]
            for j in range(i + min_len, last):
                wj = seq[j:j + min_len]
                if inverted:
                    wj = reverse_complement(wj)
                mm = _hamming(wi, wj)
                if mm <= mm_limit and (mm_limit == 0 or mm > 0):
                    name = f"{'inverted' if inverted else 'direct'}_{'exact' if mm == 0 else 'fuzzy'}"
                    out.append((name, i, i + min_len, j, j + min_len, mm))

    scan("direct", 0, False)
    scan("inverted", 0, True)
    if max_mismatches > 0:
        scan("direct", max_mismatches, False)
        scan("inverted", max_mismatches, True)
    return out


def _as_tuples(violations):
    return [dataclasses.astuple(v) for v in violations]


def _random_seq(rng, kind):
    if kind == "random":
        return "".join(rng.choice("ACGT") for _ in range(rng.randint(0, 90)))
    if kind == "low_complexity":
        return "".join(rng.choice("AC") for _ in range(rng.randint(0, 70)))
    if kind == "codon_run":
        return "GCT" * rng.randint(0, 25) + "".join(rng.choice("ACGT") for _ in range(rng.randint(0, 20)))
    # planted direct, mutated-direct and inverted copies of one block
    block = "".join(rng.choice("ACGT") for _ in range(rng.randint(10, 22)))
    mutated = list(block)
    mutated[rng.randrange(len(mutated))] = rng.choice("ACGT")
    return (
        "".join(rng.choice("ACGT") for _ in range(12))
        + block
        + "".join(rng.choice("ACGT") for _ in range(9))
        + "".join(mutated)
        + "".join(rng.choice("ACGT") for _ in range(7))
        + reverse_complement(block)
    )


@pytest.mark.parametrize("kind", ["random", "low_complexity", "codon_run", "planted"])
@pytest.mark.parametrize("min_len,max_mismatches", [(5, 0), (5, 1), (8, 2), (11, 0), (11, 2)])
def test_fast_scan_matches_brute_force(kind, min_len, max_mismatches):
    rng = random.Random(f"{kind}-{min_len}-{max_mismatches}")
    for _ in range(12):
        seq = _random_seq(rng, kind)
        assert _as_tuples(check_repeats(seq, min_len=min_len, max_mismatches=max_mismatches)) == \
            _brute_force(seq, min_len, max_mismatches), seq


def test_sequence_shorter_than_window_has_no_repeats():
    assert check_repeats("ACGTACG") == []
    assert check_repeats("") == []


def test_more_mismatches_than_window_length_falls_back_correctly():
    seq = "ACGTTGCAACGT"
    assert _as_tuples(check_repeats(seq, min_len=3, max_mismatches=4)) == _brute_force(seq, 3, 4)
