"""
Generate GitHub release notes markdown for a version.

Used by .github/workflows/release.yml. Builds the release body from:
  1. The CHANGELOG.md section for the version (rotated there from
     "Unreleased" by update_changelog.py), shown as Highlights.
  2. The commit subjects since the previous release tag (release
     bookkeeping commits are excluded).
  3. A GitHub compare link between the previous tag and the new one.

Usage: generate_release_notes.py <version> [output_path]
Tags are the bare version (1.6). Releases before 1.6 were tagged with a "v"
prefix and three parts (v1.5.27); they still count as previous releases.
The repository slug is taken from $GITHUB_REPOSITORY when set.
"""

from __future__ import annotations

import os
import re
import subprocess
import sys
from pathlib import Path

RELEASE_TAG_RE = re.compile(r"^v?(\d+(?:\.\d+){1,2})$")


def _git(*args: str) -> str:
    return subprocess.run(
        ["git", *args],
        check=True,
        capture_output=True,
        text=True,
    ).stdout.strip()


def _version_key(version: str) -> tuple[int, ...]:
    return tuple(int(part) for part in version.split("."))


def _previous_tag(version: str) -> str | None:
    """
    Highest release tag below the version being published.

    Compared numerically rather than with git's version sort, which ranks
    the old "v1.5.27" tags above "1.6".
    """
    current = _version_key(version)
    releases = []
    for candidate in _git("tag").splitlines():
        match = RELEASE_TAG_RE.match(candidate)
        if match and _version_key(match[1]) < current:
            releases.append((_version_key(match[1]), candidate))
    return max(releases)[1] if releases else None


def _changelog_section(version: str) -> str:
    changelog_path = Path("CHANGELOG.md")
    if not changelog_path.exists():
        return ""
    text = changelog_path.read_text(encoding="utf-8")
    # (?![.\d]) keeps "1.5" from matching the old "## 1.5.27" heading.
    match = re.search(
        rf"^## {re.escape(version)}(?![.\d])[^\n]*\n(.*?)(?=^## |\Z)",
        text,
        re.MULTILINE | re.DOTALL,
    )
    return match.group(1).strip() if match else ""


def _commit_lines(previous_tag: str | None) -> list[str]:
    log_range = f"{previous_tag}..HEAD" if previous_tag else "HEAD"
    subjects = _git("log", "--no-merges", "--format=%s (%h)", log_range).splitlines()
    return [
        f"- {subject}"
        for subject in subjects
        if subject and not subject.startswith("chore(release):")
    ]


def main() -> int:
    """Write the release notes markdown and echo it to stdout."""
    if len(sys.argv) < 2:
        msg = "usage: generate_release_notes.py <version> [output_path]"
        raise SystemExit(msg)
    version = sys.argv[1]
    tag = version
    output_path = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("release_notes.md")
    repo = os.environ.get("GITHUB_REPOSITORY", "kedube/ha-home_maintenance")

    previous_tag = _previous_tag(version)
    sections: list[str] = []

    highlights = _changelog_section(version)
    if highlights:
        sections.append(f"## Highlights\n\n{highlights}")

    commits = _commit_lines(previous_tag)
    if commits:
        sections.append("## Commits\n\n" + "\n".join(commits))

    if previous_tag:
        sections.append(
            f"**Full Changelog**: "
            f"https://github.com/{repo}/compare/{previous_tag}...{tag}"
        )

    body = "\n\n".join(sections) if sections else f"Release {tag}."
    output_path.write_text(body + "\n", encoding="utf-8")
    print(body)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
