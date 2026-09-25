"""Tests for the release automation scripts in .github/scripts."""

import importlib.util
import subprocess
import sys
from pathlib import Path

SCRIPTS_DIR = Path(__file__).parent.parent / ".github" / "scripts"

CONST_TEMPLATE = 'VERSION = "{version}"\n'
MANIFEST_TEMPLATE = '{{\n  "domain": "tasks",\n  "version": "{version}"\n}}\n'


def load_script(name: str):
    """Load a release script as a module."""
    spec = importlib.util.spec_from_file_location(name, SCRIPTS_DIR / f"{name}.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def write_version_fixtures(tmp_path: Path, version: str) -> tuple[Path, Path]:
    component = tmp_path / "custom_components" / "tasks"
    component.mkdir(parents=True)
    const = component / "const.py"
    manifest = component / "manifest.json"
    const.write_text(CONST_TEMPLATE.format(version=version))
    manifest.write_text(MANIFEST_TEMPLATE.format(version=version))
    return const, manifest


def run_bump(tmp_path, monkeypatch, capsys, *args: str) -> str:
    monkeypatch.chdir(tmp_path)
    monkeypatch.setattr(sys, "argv", ["bump_version.py", *args])
    load_script("bump_version").main()
    return capsys.readouterr().out.strip()


def test_bump_steps_by_a_tenth_in_const_and_manifest(
    tmp_path, monkeypatch, capsys
) -> None:
    const, manifest = write_version_fixtures(tmp_path, "1.6")
    assert run_bump(tmp_path, monkeypatch, capsys) == "1.7"
    assert 'VERSION = "1.7"' in const.read_text()
    assert '"version": "1.7"' in manifest.read_text()


def test_bump_rolls_over_to_the_next_major_after_9(
    tmp_path, monkeypatch, capsys
) -> None:
    write_version_fixtures(tmp_path, "0.9")
    assert run_bump(tmp_path, monkeypatch, capsys) == "1.0"
    assert run_bump(tmp_path, monkeypatch, capsys) == "1.1"


def test_bump_drops_the_patch_part_of_older_versions(
    tmp_path, monkeypatch, capsys
) -> None:
    const, _ = write_version_fixtures(tmp_path, "1.5.27")
    assert run_bump(tmp_path, monkeypatch, capsys) == "1.6"
    assert 'VERSION = "1.6"' in const.read_text()


def test_bump_major(tmp_path, monkeypatch, capsys) -> None:
    write_version_fixtures(tmp_path, "1.6")
    assert run_bump(tmp_path, monkeypatch, capsys, "--bump", "major") == "2.0"
    assert run_bump(tmp_path, monkeypatch, capsys, "--bump", "minor") == "2.1"


def test_bump_print_current_modifies_nothing(tmp_path, monkeypatch, capsys) -> None:
    const, manifest = write_version_fixtures(tmp_path, "1.6")
    assert run_bump(tmp_path, monkeypatch, capsys, "--print-current") == "1.6"
    assert 'VERSION = "1.6"' in const.read_text()
    assert '"version": "1.6"' in manifest.read_text()


def test_update_changelog_rotates_unreleased(tmp_path, monkeypatch, capsys) -> None:
    changelog = tmp_path / "CHANGELOG.md"
    changelog.write_text(
        "# Changelog\n\n## Unreleased\n\n- something new\n\n"
        "## 1.5.5 — 2026-08-01\n\n- old\n"
    )
    monkeypatch.setattr(sys, "argv", ["update_changelog.py", "1.5.6", str(changelog)])
    load_script("update_changelog").main()
    assert capsys.readouterr().out.strip() == "rotated"

    text = changelog.read_text()
    assert "## Unreleased" not in text
    assert "## 1.5.6 — " in text
    assert "- something new" in text


def test_update_changelog_skips_empty_unreleased(tmp_path, monkeypatch, capsys) -> None:
    changelog = tmp_path / "CHANGELOG.md"
    original = "# Changelog\n\n## Unreleased\n\n## 1.5.5 — 2026-08-01\n\n- old\n"
    changelog.write_text(original)
    monkeypatch.setattr(sys, "argv", ["update_changelog.py", "1.5.6", str(changelog)])
    load_script("update_changelog").main()
    assert capsys.readouterr().out.strip() == "skipped"
    assert changelog.read_text() == original


def _git(cwd: Path, *args: str) -> None:
    subprocess.run(
        ["git", "-c", "user.email=t@t", "-c", "user.name=t", *args],
        cwd=cwd,
        check=True,
        capture_output=True,
    )


def _commit(cwd: Path, content: str, message: str) -> None:
    (cwd / "file").write_text(content)
    _git(cwd, "add", "-A")
    _git(cwd, "commit", "-qm", message)


def _generate_notes(tmp_path, monkeypatch, capsys, version: str) -> str:
    monkeypatch.chdir(tmp_path)
    monkeypatch.setenv("GITHUB_REPOSITORY", "kedube/ha-tasks")
    monkeypatch.setattr(sys, "argv", ["generate_release_notes.py", version, "notes.md"])
    load_script("generate_release_notes").main()
    capsys.readouterr()
    return (tmp_path / "notes.md").read_text()


def test_generate_release_notes(tmp_path, monkeypatch, capsys) -> None:
    _git(tmp_path, "init", "-q")
    _commit(tmp_path, "a", "initial commit")
    _git(tmp_path, "tag", "1.6")
    _commit(tmp_path, "b", "fix: a real change")
    _commit(tmp_path, "c", "chore(release): 1.7 [skip ci]")
    (tmp_path / "CHANGELOG.md").write_text(
        "# Changelog\n\n## 1.7 — 2026-10-01\n\n- highlight entry\n\n"
        "## 1.6 — 2026-09-26\n\n- older entry\n"
    )

    notes = _generate_notes(tmp_path, monkeypatch, capsys, "1.7")

    assert "## Highlights" in notes
    assert "- highlight entry" in notes
    assert "- older entry" not in notes
    assert "fix: a real change" in notes
    assert "chore(release)" not in notes
    assert "https://github.com/kedube/ha-tasks/compare/1.6...1.7" in notes


def test_release_notes_compare_against_the_highest_older_release(
    tmp_path, monkeypatch, capsys
) -> None:
    """Old v-prefixed three-part tags sort by number, not by git's tag order."""
    _git(tmp_path, "init", "-q")
    _commit(tmp_path, "a", "initial commit")
    _git(tmp_path, "tag", "v1.5.26")
    _commit(tmp_path, "b", "change one")
    _git(tmp_path, "tag", "v1.5.27")
    _commit(tmp_path, "c", "change two")
    (tmp_path / "CHANGELOG.md").write_text(
        "# Changelog\n\n## 1.5.27 — 2026-09-25\n\n- patch-era entry\n"
    )

    # The first X.Y release follows v1.5.27, and "1.5" must not pick up the
    # "## 1.5.27" changelog section.
    notes = _generate_notes(tmp_path, monkeypatch, capsys, "1.6")
    assert "compare/v1.5.27...1.6" in notes
    assert "change two" in notes
    assert "change one" not in notes

    _git(tmp_path, "tag", "1.6")
    _commit(tmp_path, "d", "change three")
    notes = _generate_notes(tmp_path, monkeypatch, capsys, "1.7")
    assert "compare/1.6...1.7" in notes

    notes = _generate_notes(tmp_path, monkeypatch, capsys, "1.5")
    assert "patch-era entry" not in notes
