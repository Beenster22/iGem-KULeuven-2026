"""
restriction_sites.py

Fixed restriction enzyme recognition sequences used by
constraints/restriction.py. Not user-configurable at runtime -- a fixed
list decided by the project, covering common
Golden-Gate-assembly Type IIS enzymes plus standard palindromic cloning
enzymes (Biobrick).

Sequences confirmed against NEB product pages (2026-08).
"""

RESTRICTION_ENZYMES: dict[str, str] = {
    "BsaI":  "GGTCTC",
    "PaqCI": "CACCTGC",
    "SapI":  "GCTCTTC",
    "BbsI":  "GAAGAC",
    "EcoRI": "GAATTC",
    "NotI":  "GCGGCCGC",
    "XbaI":  "TCTAGA",
    "SpeI":  "ACTAGT",
    "PstI":  "CTGCAG",
}