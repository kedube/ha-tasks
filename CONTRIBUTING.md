# Contribution guidelines

Contributing to this project should be as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features

## Github is used for everything

Github is used to host code, to track issues and feature requests, as well as accept pull requests.

Pull requests are the best way to propose changes to the codebase.

1. Fork the repo and create your branch from `main`.
2. If you've changed something, update the documentation (including [docs/architecture.md](docs/architecture.md) if the design changed).
3. Add a line describing your change under `## Unreleased` in [CHANGELOG.md](CHANGELOG.md) — it becomes part of the next release's notes.
4. If you changed the panel sources (`custom_components/tasks/panel/src/`), rebuild the committed bundles (see [The panel](#the-panel)). CI fails if the committed bundles drift from the sources.
5. Make sure your code lints (using `scripts/lint`).
6. Run the tests (see [Tests](#tests)) and add tests for new behavior.
7. Issue that pull request!

## Any contributions you make will be under the MIT Software License

In short, when you submit code changes, your submissions are understood to be under the same [MIT License](http://choosealicense.com/licenses/mit/) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using Github's [issues](../../issues)

GitHub issues are used to track public bugs.
Report a bug by [opening a new issue](../../issues/new/choose); it's that easy!

## Write bug reports with detail, background, and sample code

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can.
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

People *love* thorough bug reports. I'm not even kidding.

## Development environment

You need Python 3.14.2 or newer (Home Assistant 2026.3 requires it) and, for the panel, Node 24. Then use the helper scripts:

- `scripts/setup`: create a `.venv` and install the requirements.
- `scripts/develop`: run a local Home Assistant with the integration symlinked in, using the included [`configuration.yaml`](./config/configuration.yaml), which also loads the [example dashboard](docs/example-dashboard.md).
- `scripts/lint`: run `ruff format` and `ruff check --fix`.
- `scripts/e2e_smoke.py`: the browser smoke test (see [Tests](#tests)).

For a tour of how the pieces fit together (the task store, dispatcher signals, trigger strategies, push entities, the websocket API, and the panel components), see [docs/architecture.md](docs/architecture.md).

## Tests

Run the Python suite (CI enforces an 85% coverage gate):

```sh
pip install -r requirements_test.txt
python -m pytest
```

The **browser smoke test** catches what pytest can't. It boots a throwaway Home Assistant with the integration and completes onboarding through the API. Then it logs in with headless Chrome, adds a task, and creates a group. It fails if any form field stops rendering or any flow breaks:

```sh
pip install homeassistant colorlog playwright
python -m playwright install chromium
python scripts/e2e_smoke.py --install-deps
```

`--install-deps` adds the manifest-pinned packages the Home Assistant frontend needs on a bare pip install. To run Home Assistant from a different environment than playwright, set `HASS_PYTHON=/path/to/venv/bin/python`.

## The panel

The sidebar panel and the Add Task card are a Lit + TypeScript app in `custom_components/tasks/panel/`. Its dependencies are exact-pinned in the committed `package-lock.json`. After changing panel sources, rebuild the committed bundles:

```sh
cd custom_components/tasks/panel
npm ci
npm run build   # regenerates dist/main.js and dist/add-task-card.js
npm test        # vitest: date math, bucketing, form validation, translations
```

### Frontend guidelines

- Build UI only from current Home Assistant components — `ha-selector`, `ha-form`, `ha-button`, `ha-dialog`, `ha-dropdown`. Legacy elements (`mwc-*`, `ha-textfield`, `ha-formfield`, `ha-md-*`, `paper-*`) break silently when Home Assistant deletes them, and CI fails if they appear in `panel/src/`.
- User feedback goes through toasts (`src/toast.ts`) and the shared `hm-confirm-dialog` — never browser-native `alert()`/`confirm()`, which the companion apps can suppress.
- Form fields render as bare `ha-selector`s with a uniform label above each input (see `task-form.ts`); follow that pattern so inputs stay aligned.

### Translations

The panel and the Add Task card are translated in `panel/localize/languages/*.json`, and the config flow in `custom_components/tasks/translations/*.json`. The current languages are English, German, French, Spanish, Italian, Dutch, Polish, and Brazilian Portuguese.

- New user-facing strings go into every panel language file. The vitest suite fails if any language's keys drift from English.
- To add a language, copy both `en.json` files and translate every key. Then register the panel file in `panel/localize/localize.ts`.

## Use a Consistent Coding Style

Use [ruff](https://docs.astral.sh/ruff/) to make sure the code follows the style — `scripts/lint` runs `ruff format` and `ruff check --fix` for you, and CI enforces both on every pull request.

## CI and releases

Every push and pull request runs the **CI** workflow:

- HACS validation and hassfest
- ruff
- pytest on Python 3.13 and 3.14, with the 85% coverage gate
- for the panel: a type-check, the vitest run, and a build that fails if the committed bundles drift from the sources or legacy Home Assistant components reappear
- the browser smoke test, whose screenshot is uploaded as a run artifact

A weekly, non-blocking **HA next** job runs pytest and the smoke test against the newest Home Assistant pre-release, as an early warning of upstream breaking changes. Dependabot keeps the panel's npm dependencies current, and its pull requests get the bundles rebuilt automatically.

When CI passes on `main`, the **Release** workflow:

1. bumps the version by 0.1 (in `const.py` and `manifest.json` together). Versions are `X.Y`, and after `.9` they roll over to the next whole number: 1.8 → 1.9 → 2.0.
2. turns the `Unreleased` section of [CHANGELOG.md](CHANGELOG.md) into that version's notes
3. tags the bare version, such as `1.9`, with no `v` prefix
4. publishes a GitHub release with the same name and `tasks.zip` attached

To jump to the next whole number (1.6 → 2.0), or to re-release the current version, run the workflow by hand from its **Run workflow** menu and pick **major** or **none**.

## License

By contributing, you agree that your contributions will be licensed under its MIT License.
