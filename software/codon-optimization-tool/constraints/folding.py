"""
constraints/folding.py

Constraint #1 (highest repair priority): 5' translation initiation folding.
Evaluate mRNA secondary structure across the first 10-15 codons (plus the
5' UTR, if the user provided one) using ViennaRNA (e.g. RNAfold), to flag
strong structure that would block ribosome initiation.

Design notes
------------
- Window = UTR (if given) + first `n_codons` codons of the CDS (default 15,
  the top of the spec's 10-15 codon range). Only the CDS portion of the
  window is mutable during repair; the UTR is fixed context that still
  contributes to folding.

- Metric: rather than a fixed MFE (kcal/mol) cutoff, this compares the
  window's real MFE against a null distribution built from randomized
  (composition-shuffled) versions of the same window, and reports a
  z-score. This avoids needing a hand-picked absolute threshold -- a fixed
  cutoff from other organisms' literature wouldn't account for window
  length/composition, and Bacteroides' AT-rich genome shifts baseline
  foldability relative to GC-richer species those thresholds are usually
  derived from. z_threshold (default -2.0) still needs calibration against
  real Bacteroides 5' regions, but is a far more defensible number than a
  raw kcal/mol cutoff.

- Shuffling is simple (single-nucleotide, composition-preserving) for v1.
  A dinucleotide-preserving shuffle (Altschul-Erikson) would be more
  rigorous but likely overkill given how short the window is (30-60 nt).

- `fold_energy()` is exposed separately and cheaply for the repair engine:
  when trying synonymous codon swaps at early CDS positions, the repair
  loop should compare raw MFE deltas between candidates directly rather
  than recomputing a full null distribution per candidate. Re-run
  `check_5prime_folding()` once after a repair pass completes, same as
  the other constraints.

Environment note: ViennaRNA is installed via conda (bioconda, Linux/WSL
only -- no native Windows build) into the `bacteroides` env.
"""

from dataclasses import dataclass
import random
import RNA  # ViennaRNA Python bindings


DEFAULT_N_CODONS = 15
DEFAULT_Z_THRESHOLD = -2.0          # <- Still needs to be defined for sure
DEFAULT_N_SHUFFLES = 100


@dataclass
class FoldingResult:
    passed: bool
    mfe: float                 # MFE (kcal/mol) of the real window
    null_mean: float           # mean MFE across shuffled controls
    null_std: float            # std dev of MFE across shuffled controls
    z_score: float             # (mfe - null_mean) / null_std
    z_threshold: float
    window_seq: str
    window_structure: str      # dot-bracket structure of the real window
    utr_len: int
    cds_window_len: int


def _build_window(cds: str, utr: str | None, n_codons: int) -> tuple[str, int, int]:
    """Concatenate UTR (if any) with the first `n_codons` codons of the CDS.

    Returns (window_seq, utr_len, cds_window_len).
    """
    cds_window_len = min(n_codons * 3, len(cds))
    cds_window = cds[:cds_window_len]
    utr_seq = utr or ""
    return utr_seq + cds_window, len(utr_seq), cds_window_len


def fold_energy(seq: str) -> tuple[float, str]:
    """Return (MFE in kcal/mol, dot-bracket structure) for seq via RNAfold.

    Cheap single-call helper -- intended for the repair loop to compare
    candidate codon substitutions directly against each other.
    """
    structure, mfe = RNA.fold(seq)
    return mfe, structure


def _shuffled_null(seq: str, n_shuffles: int, utr_len: int) -> tuple[float, float]:
    """Build a null MFE distribution from composition-shuffled versions of seq.

    Only the CDS-derived portion of the window is shuffled if a UTR is
    present, since the UTR is fixed biological context, not something a
    codon-choice-driven repair could ever change.
    """
    utr_part = seq[:utr_len]
    cds_part = list(seq[utr_len:])

    mfes = []
    for _ in range(n_shuffles):
        shuffled = cds_part.copy()
        random.shuffle(shuffled)
        candidate = utr_part + "".join(shuffled)
        mfe, _ = fold_energy(candidate)
        mfes.append(mfe)

    mean = sum(mfes) / len(mfes)
    variance = sum((m - mean) ** 2 for m in mfes) / len(mfes)
    std = variance ** 0.5
    return mean, std


def check_5prime_folding(
    cds: str,
    utr: str | None = None,
    n_codons: int = DEFAULT_N_CODONS,
    z_threshold: float = DEFAULT_Z_THRESHOLD,
    n_shuffles: int = DEFAULT_N_SHUFFLES,
) -> FoldingResult:
    """Check whether the 5' initiation window is more structured than expected by chance.

    A more negative z-score means the real window folds more strongly
    than composition-matched random sequences. Fails when z_score falls
    below z_threshold (default -2.0, i.e. notably more structured than
    the null).
    """
    window_seq, utr_len, cds_window_len = _build_window(cds, utr, n_codons)
    mfe, structure = fold_energy(window_seq)
    null_mean, null_std = _shuffled_null(window_seq, n_shuffles, utr_len)

    z_score = (mfe - null_mean) / null_std if null_std > 0 else 0.0
    passed = z_score >= z_threshold

    return FoldingResult(
        passed=passed,
        mfe=mfe,
        null_mean=null_mean,
        null_std=null_std,
        z_score=z_score,
        z_threshold=z_threshold,
        window_seq=window_seq,
        window_structure=structure,
        utr_len=utr_len,
        cds_window_len=cds_window_len,
    )
