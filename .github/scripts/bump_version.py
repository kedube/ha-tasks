"""
Bump the integration version in const.py and manifest.json, print it.

Versions are MAJOR.MINOR with a single-digit minor, so every release steps by
0.1 and rolls over to the next major after .9 (0.9 -> 1.0, 1.9 -> 2.0).
Three-part versions from before this scheme (1.5.27) are still read; the
patch part is dropped on the next bump (1.5.27 -> 1.6).
"""

from __future__ import annotations

import argparse
import re
from pathlib import Path

CONST_PATH = Path("custom_components/tasks/const.py")
MANIFEST_PATH = Path("custom_components/tasks/manifest.json")
VERSION_RE = re.compile(r'^(VERSION\s*=\s*")((\d+)\.(\d+)(?:\.\d+)?)(")', re.MULTILINE)
MANIFEST_VERSION_RE = re.compile(r'("version"\s*:\s*")([^"]+)(")')


def next_version(major: int, minor: int, bump: str) -> str:
    """Step to the next release: +0.1 (minor, rolling over after .9) or +1.0."""
    if bump == "major":
        return f"{major + 1}.0"
    minor += 1
    if minor > 9:
        major, minor = major + 1, 0
    return f"{major}.{minor}"


def main() -> int:
    """Update const.py in place and print the resulting version."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--bump",
        choices=("minor", "major"),
        default="minor",
        help="minor: +0.1, the automatic release path (0.9 -> 1.0); "
        "major: the next whole version (1.6 -> 2.0)",
    )
    parser.add_argument(
        "--print-current",
        action="store_true",
        help="Print the current version without modifying anything",
    )
    args = parser.parse_args()

    text = CONST_PATH.read_text(encoding="utf-8")
    match = VERSION_RE.search(text)
    if match is None:
        msg = f"Could not locate VERSION in {CONST_PATH}"
        raise ValueError(msg)

    if args.print_current:
        print(match[2])
        return 0

    new_version = next_version(int(match[3]), int(match[4]), args.bump)
    updated = VERSION_RE.sub(rf"\g<1>{new_version}\g<5>", text, count=1)
    CONST_PATH.write_text(updated, encoding="utf-8")

    manifest_text = MANIFEST_PATH.read_text(encoding="utf-8")
    manifest_updated, replacements = MANIFEST_VERSION_RE.subn(
        rf"\g<1>{new_version}\g<3>", manifest_text, count=1
    )
    if replacements != 1:
        msg = f"Could not locate the version field in {MANIFEST_PATH}"
        raise ValueError(msg)
    MANIFEST_PATH.write_text(manifest_updated, encoding="utf-8")

    print(new_version)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
