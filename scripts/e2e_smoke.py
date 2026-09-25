#!/usr/bin/env python3
"""
Browser smoke test for the Tasks panel.

Boots a throwaway Home Assistant instance with the integration installed,
completes onboarding via the API, then drives the real panel in a headless
browser: adds a task, creates a group, and asserts both appear. This catches
the class of breakage pytest cannot see — Home Assistant removing or
changing frontend components so parts of the panel stop rendering (as
happened with mwc-button in #122 and ha-textfield in 1.5.16).

Usage: python scripts/e2e_smoke.py [--port 8129] [--keep]
Requires: homeassistant and playwright installed in the current environment,
plus a chromium (``playwright install chromium``) or system Chrome. Set
HASS_PYTHON to launch Home Assistant from a different interpreter than the
one running playwright.
"""

from __future__ import annotations

import argparse
import contextlib
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
import urllib.parse
import urllib.request
from pathlib import Path
from typing import TYPE_CHECKING

from playwright.sync_api import sync_playwright

if TYPE_CHECKING:
    from playwright.sync_api import Browser, Playwright

REPO = Path(__file__).resolve().parent.parent
USERNAME = "smoke"
PASSWORD = "smoke-test-password"
SCREENSHOT = "/tmp/hm_smoke_panel.png"

# On a bare `pip install homeassistant`, the frontend needs requirements the
# wheel does not ship: hass_frontend itself (else HA boots into recovery
# mode) and the packages of every component HA's service-description
# validation imports at runtime (hassil, numpy, mutagen, ...). Resolve them
# from the installed HA itself: seed with frontend plus the component list
# inside helpers.service._base_components, walk each manifest's dependency
# graph, and collect the pinned requirements — version-correct for whatever
# HA release is installed.
_COLLECT_REQUIREMENTS = """
import inspect
import json
import pathlib

import homeassistant.components as comps
from homeassistant.helpers import service

base = pathlib.Path(comps.__file__).parent
src = inspect.getsource(service._base_components)
block = src.split("from homeassistant.components import (", 1)[1].split(")", 1)[0]
names = (name.strip(",") for name in block.split())
seeds = {name for name in names if name.isidentifier()}
# stream: imported by camera at module level without a manifest link
seeds |= {"frontend", "onboarding", "config", "lovelace", "stream"}
seen = set()
queue = sorted(seeds)
reqs = set()
while queue:
    domain = queue.pop()
    if domain in seen:
        continue
    seen.add(domain)
    manifest = base / domain / "manifest.json"
    if not manifest.exists():
        continue
    data = json.loads(manifest.read_text())
    reqs.update(data.get("requirements", []))
    queue.extend(data.get("dependencies", []))
    # after_dependencies matter too: e.g. camera imports stream (numpy, av)
    # at module import time but only declares it as an after_dependency.
    queue.extend(data.get("after_dependencies", []))
print("\\n".join(sorted(reqs)))
"""


def install_ha_component_requirements(hass_python: str) -> None:
    """Install the frontend-critical component requirements of installed HA."""
    reqs = subprocess.check_output(
        [hass_python, "-c", _COLLECT_REQUIREMENTS], text=True
    ).split()
    print(f"installing HA component requirements: {' '.join(reqs)}")
    subprocess.check_call([hass_python, "-m", "pip", "install", "--quiet", *reqs])


def request(
    method: str,
    url: str,
    data: dict | None = None,
    token: str | None = None,
    *,
    form: bool = False,
) -> dict | list | None:
    """Make a JSON (or form-encoded) HTTP request and decode the response."""
    headers = {}
    body = None
    if data is not None:
        if form:
            body = urllib.parse.urlencode(data).encode()
            headers["Content-Type"] = "application/x-www-form-urlencoded"
        else:
            body = json.dumps(data).encode()
            headers["Content-Type"] = "application/json"
    if token:
        headers["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    with urllib.request.urlopen(req, timeout=30) as resp:
        raw = resp.read()
    return json.loads(raw) if raw else None


def wait_for_ha(base: str, timeout: int = 420) -> None:
    """Poll until the Home Assistant HTTP server responds."""
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            urllib.request.urlopen(base + "/", timeout=5)
        except Exception:  # noqa: BLE001 - retry until the server is up
            time.sleep(2)
        else:
            return
    msg = f"Home Assistant did not come up within {timeout}s"
    raise TimeoutError(msg)


def onboard(base: str) -> str:
    """Complete onboarding and return a bearer token."""
    client = base + "/"
    result = request(
        "POST",
        f"{base}/api/onboarding/users",
        {
            "client_id": client,
            "name": "Smoke",
            "username": USERNAME,
            "password": PASSWORD,
            "language": "en",
        },
    )
    token_resp = request(
        "POST",
        f"{base}/auth/token",
        {
            "grant_type": "authorization_code",
            "code": result["auth_code"],
            "client_id": client,
        },
        form=True,
    )
    token = token_resp["access_token"]
    request("POST", f"{base}/api/onboarding/core_config", {}, token)
    request("POST", f"{base}/api/onboarding/analytics", {}, token)
    request(
        "POST",
        f"{base}/api/onboarding/integration",
        {"client_id": client, "redirect_uri": client + "?auth_callback=1"},
        token,
    )
    return token


def add_integration(base: str, token: str) -> None:
    """Create the tasks config entry via the config flow API."""
    flow = request(
        "POST",
        f"{base}/api/config/config_entries/flow",
        {"handler": "tasks", "show_advanced_options": False},
        token,
    )
    result = request(
        "POST",
        f"{base}/api/config/config_entries/flow/{flow['flow_id']}",
        {"admin_only": True, "sidebar_title": "Tasks"},
        token,
    )
    if result.get("type") != "create_entry":
        msg = f"Config flow did not create an entry: {result}"
        raise RuntimeError(msg)


def launch_browser(p: Playwright) -> Browser:
    """Prefer the bundled chromium (CI); fall back to system Chrome (local)."""
    try:
        return p.chromium.launch(headless=True)
    except Exception:  # noqa: BLE001 - bundled browser not installed
        return p.chromium.launch(channel="chrome", headless=True)


# Page errors that indicate our code actually broke. Anything else (HA
# core's own unhandled promise rejections, view-transition noise, opaque
# non-Error rejections that stringify to "Object") is reported as a warning
# but does not fail the run — the functional assertions below are the
# authoritative signal.
FATAL_JS_ERROR = re.compile(
    r"TypeError|ReferenceError|SyntaxError|RangeError|not a function|is not defined"
)


def drive_panel(base: str) -> tuple[list[str], list[str]]:
    """Exercise the panel in a real browser. Returns (errors, warnings)."""
    errors: list[str] = []
    warnings: list[str] = []

    def on_pageerror(err: object) -> None:
        text = f"pageerror: {err}"
        if "Transition was skipped" in text:
            return
        (errors if FATAL_JS_ERROR.search(text) else warnings).append(text)

    with sync_playwright() as p:
        browser = launch_browser(p)
        page = browser.new_page(viewport={"width": 1400, "height": 950})
        page.on("pageerror", on_pageerror)

        page.goto(base, wait_until="networkidle")
        page.fill('input[name="username"]', USERNAME, timeout=30000)
        page.fill('input[name="password"]', PASSWORD)
        page.keyboard.press("Enter")
        page.wait_for_url("**/home/**", timeout=60000)

        page.goto(f"{base}/tasks", wait_until="networkidle")
        # A fresh install has no tasks, so the panel shows its first-run
        # state; the group sidebar renders at this (wide) viewport.
        page.wait_for_selector("tasks-panel .onboarding", timeout=30000)
        page.wait_for_selector("hm-group-nav", state="attached", timeout=30000)

        # Every input the panel depends on must actually render. Wait for
        # each selector rather than sleeping a fixed interval and counting:
        # slow CI runners can take several seconds after the panel attaches
        # to load the HA component chunks that render the fields, and a
        # too-early census reports 0 for a panel that works fine.
        def expect_rendered(checks: list[tuple[str, str, int]]) -> None:
            for name, selector, minimum in checks:
                with contextlib.suppress(Exception):
                    page.wait_for_selector(selector, state="attached", timeout=30000)
                count = page.locator(selector).count()
                if count < minimum:
                    errors.append(
                        f"{name}: expected >= {minimum} of {selector}, found {count}"
                    )

        # Add a task through the add-task dialog (opened by the FAB).
        page.locator("tasks-panel .fab").click()
        expect_rendered(
            [
                ("task form fields", "hm-add-task-dialog hm-task-form ha-selector", 5),
                ("task title input", "hm-add-task-dialog .field.title input", 1),
                ("dialog add button", "hm-add-task-dialog .submit-button", 1),
            ]
        )
        dialog = page.locator("hm-add-task-dialog")
        dialog.locator(".field.title input").first.fill("Smoke Test Task")
        dialog.locator(".field.interval_value input").first.fill("30")
        dialog.locator(".submit-button").first.click()
        try:
            page.wait_for_selector(
                "hm-task-list .row-title >> text=Smoke Test Task", timeout=15000
            )
        except Exception:  # noqa: BLE001 - absence is the failure being recorded
            errors.append("added task did not appear in the task list")

        # The task's details open the edit dialog, whose fields must render.
        with contextlib.suppress(Exception):
            page.locator("hm-task-list .row-main").first.click()
            page.locator("hm-task-list .details .action-button").first.click()
        expect_rendered(
            [("edit dialog fields", "hm-edit-dialog ha-dialog ha-selector", 5)]
        )
        # Cancel, not Escape: HA 2026.3+ ignores Escape on dialogs that set
        # prevent-scrim-close (so a half-filled form isn't lost).
        page.locator("hm-edit-dialog ha-button[data-dialog='close']").first.click()

        # Create a group from the sidebar.
        page.locator("hm-group-nav .nav-heading .icon-button").first.click()
        group_input = page.locator("hm-group-nav .nav-input").first
        group_input.fill("Smoke Group")
        group_input.press("Enter")
        try:
            page.wait_for_selector(
                "hm-group-nav .nav-label >> text=Smoke Group", timeout=15000
            )
        except Exception:  # noqa: BLE001 - absence is the failure being recorded
            errors.append("created group did not appear in the group sidebar")

        page.screenshot(path=SCREENSHOT, full_page=True)
        browser.close()
    return errors, warnings


def main() -> int:
    """Run the smoke test and return a process exit code."""
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=8129)
    parser.add_argument("--keep", action="store_true", help="keep the temp config dir")
    parser.add_argument(
        "--install-deps",
        action="store_true",
        help="pip install the HA component requirements the frontend needs "
        "(for bare CI environments)",
    )
    args = parser.parse_args()
    base = f"http://localhost:{args.port}"

    config_dir = Path(tempfile.mkdtemp(prefix="hm-smoke-"))
    # Deliberately minimal: default_config would pip-install requirements
    # for dozens of integrations on a cold CI environment and blow the boot
    # timeout. frontend + config are all the panel and config-flow need.
    (config_dir / "configuration.yaml").write_text(
        f"frontend:\nconfig:\nhttp:\n  server_port: {args.port}\n"
    )
    (config_dir / "custom_components").symlink_to(REPO / "custom_components")

    # HASS_PYTHON lets a local run pair a playwright env with the project's
    # Home Assistant venv; in CI both live in the same interpreter.
    hass_python = os.environ.get("HASS_PYTHON", sys.executable)
    if args.install_deps:
        install_ha_component_requirements(hass_python)
    log_path = config_dir / "hass-output.log"
    errors: list[str] = []
    warnings: list[str] = []
    with log_path.open("wb") as log_file:
        # HA 2026.9+ migrates http: YAML into storage and stages anything that
        # differs from the default as a pending trial, which pops a modal
        # confirm/revert dialog over the panel. SETUP_PORT makes the default
        # port match the YAML, so nothing is staged; older releases ignore it
        # and read the YAML.
        proc = subprocess.Popen(
            [hass_python, "-m", "homeassistant", "--config", str(config_dir)],
            stdout=log_file,
            stderr=subprocess.STDOUT,
            env={**os.environ, "SETUP_PORT": str(args.port)},
        )
        try:
            print("waiting for Home Assistant to boot...")
            wait_for_ha(base)
            print("onboarding...")
            token = onboard(base)
            print("adding the tasks integration...")
            add_integration(base, token)
            time.sleep(3)
            print("driving the panel...")
            errors, warnings = drive_panel(base)
        except Exception as err:  # noqa: BLE001 - report, dump logs, fail the run
            errors.append(f"{type(err).__name__}: {err}")
        finally:
            proc.terminate()
            try:
                proc.wait(timeout=30)
            except subprocess.TimeoutExpired:
                proc.kill()

    for w in warnings:
        print(f"warning (non-fatal): {w}")
    if errors:
        print("SMOKE TEST FAILED:")
        for e in errors:
            print(f"  - {e}")
        print("---- Home Assistant output (tail) ----")
        tail = log_path.read_text(errors="replace").splitlines()[-100:]
        print("\n".join(tail))
    if not args.keep:
        shutil.rmtree(config_dir, ignore_errors=True)
    if errors:
        return 1
    print("Smoke test passed: panel rendered, task added, group created.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
