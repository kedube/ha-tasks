"""
Decide whether main has changes worth an automatic release.

Used by .github/workflows/release.yml. Prints "true" when a file users
install has changed since the latest release tag, "false" otherwise, so
dependency bumps, CI fixes, tests and docs ride along with the next real
release instead of publishing one of their own.

Releasable: anything under custom_components/tasks/ (what tasks.zip ships)
and hacs.json, except the panel's build tooling. That includes the committed
panel bundles: dependabot's npm bumps change only package*.json and the
rebuilt dist/, while a real panel change always touches src/ or localize/.

Usage: has_releasable_changes.py
With no release tag yet, everything counts as releasable.
"""

from __future__ import annotations

import re
import subprocess
import sys

RELEASE_TAG_RE = re.compile(r"^v?(\d+(?:\.\d+){1,2})$")

RELEASABLE_PREFIXES = ("custom_components/tasks/", "hacs.json")

PANEL = "custom_components/tasks/panel/"
BUILD_TOOLING_PREFIXES = (
    f"{PANEL}dist/",
    f"{PANEL}tests/",
    f"{PANEL}node_modules/",
    f"{PANEL}package.json",
    f"{PANEL}package-lock.json",
    f"{PANEL}tsconfig.json",
    f"{PANEL}vitest.config.ts",
)


def _git(*args: str) -> str:
    return subprocess.run(
        ["git", *args],
        check=True,
        capture_output=True,
        text=True,
    ).stdout.strip()


def _version_key(version: str) -> tuple[int, ...]:
    return tuple(int(part) for part in version.split("."))


def _latest_tag() -> str | None:
    """Highest release tag, compared numerically (old tags are v1.5.27)."""
    releases = []
    for candidate in _git("tag").splitlines():
        match = RELEASE_TAG_RE.match(candidate)
        if match:
            releases.append((_version_key(match[1]), candidate))
    return max(releases)[1] if releases else None


def is_releasable(path: str) -> bool:
    """Whether a changed path affects what users install."""
    return path.startswith(RELEASABLE_PREFIXES) and not path.startswith(
        BUILD_TOOLING_PREFIXES
    )


def releasable_changes() -> list[str] | None:
    """Releasable paths changed since the latest tag; None when untagged."""
    tag = _latest_tag()
    if tag is None:
        return None
    changed = _git("diff", "--name-only", f"{tag}..HEAD").splitlines()
    return [path for path in changed if is_releasable(path)]


def main() -> int:
    """Print "true" or "false"; explain the decision on stderr."""
    changes = releasable_changes()
    if changes is None:
        print("No release tag found; releasing.", file=sys.stderr)
        print("true")
    elif changes:
        print("User-facing changes since the last release:", file=sys.stderr)
        for path in changes:
            print(f"  {path}", file=sys.stderr)
        print("true")
    else:
        print(
            "Only dependency, CI, test or docs changes since the last release.",
            file=sys.stderr,
        )
        print("false")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
