# Changelog

Notable changes to Tasks (formerly Home Maintenance). The Unreleased section
is rotated into a versioned section by the release workflow and becomes the
Highlights block of the GitHub release notes.

## Unreleased

- Fixed: links still pointed at the old `kedube/ha-home_maintenance`
  repository, which no longer exists. The README's HACS install URL,
  download link, badges and issue links now point at `kedube/ha-tasks`, as
  do the Documentation and Report issue links on the integration's page in
  Home Assistant.

## 1.6 — 2026-09-25

- Changed: releases are numbered `X.Y` and step by 0.1, rolling over to the
  next whole number after .9 (0.9 → 1.0). The next release after 1.5.27 is
  **1.6**. Tags and release names drop the `v` prefix (`1.6`, not `v1.6`).
- Removed: the version number in the panel's toolbar. Home Assistant already
  shows it on the integration's page (Settings → Devices & services → Tasks).

## 1.5.27 — 2026-09-25

- Docs: the README is rewritten for Tasks. It has new screenshots, a
  *Coming from Home Maintenance* guide that also covers @TJPoorman's
  original integration, and a Credits section for the original project and
  its contributors. Screenshots now also show in HACS, which ignored the
  README's HTML images. Development and release details moved to
  CONTRIBUTING.md, and the LICENSE now names Home Maintenance's and Tasks'
  authors alongside the template's.
- Fixed: the template library showed intervals like "1 years" and left
  the unit in English in every language. It now uses the same wording as the
  task list ("1 Year", "3 Months"; "1 Jahr" in German), as does the CSV
  import preview.

## 1.5.26 — 2026-09-25

- **Breaking — renamed to Tasks.** The integration is now **Tasks**, with the
  domain `tasks` (was `home_maintenance`), a new icon, and a new sidebar
  icon. Home Assistant treats it as a new integration, so delete the old
  *Home Maintenance* entry, replace the files, restart, and add **Tasks** —
  your tasks, groups, and history are imported from the old storage on first
  setup. Then update references: services `home_maintenance.*` →
  `tasks.*`, events `home_maintenance_task_completed` / `_task_due` →
  `tasks_task_completed` / `tasks_task_due`, `todo.home_maintenance` /
  `calendar.home_maintenance` → `todo.tasks` / `calendar.tasks`, the Add
  Task card `custom:home-maintenance-add-task-card` →
  `custom:tasks-add-task-card`, and the panel URL `/home-maintenance` →
  `/tasks`. Step-by-step: *Upgrading from Home Maintenance* in the README.
- Changed: the panel is redesigned around the "what
  needs doing?" task list, replacing the stacked Create New Task / Current
  Tasks / Groups cards.
  - A **group sidebar** lists All tasks, each group, and Ungrouped with task
    counts and attention badges; click one to focus the list. Groups are
    created (**+**), renamed, and deleted (**Edit**) right in the sidebar —
    the separate Groups card is gone.
  - The list shows the status line and Overdue / Due soon / Upcoming tiles
    (click to filter), search, label filter chips, and a **Status / Group**
    toggle that sections tasks by urgency or by group (remembered per
    browser). The old task table is gone.
  - Tapping a task shows its description, dates, labels, area, and history,
    with **Edit**, **Move to group**, and **Remove** — no more row menu.
  - **Add task** is a floating button that opens the add form in a dialog;
    picking a template opens that dialog prefilled.
  - On phones and narrow windows the sidebar folds into group chips and
    **Manage groups** moves to the toolbar.
  - A first-run screen offers **Add task** and **Browse templates** when
    there are no tasks yet.
- Removed: the **Home Maintenance Todo** dashboard card
  (`custom:home-maintenance-todo-card`) — its task list now lives in the
  panel. A dashboard that still uses it shows a "Custom element doesn't
  exist" error: delete the card, or replace it with Home Assistant's built-in
  to-do list card on `todo.tasks`. The example dashboard now uses
  core cards (to-do list, calendar, markdown) plus the **Add Task** card.
- Added: a **"Due soon" window** option (**Configure** on the integration)
  sets how many days ahead a task counts as *Due soon* in the panel
  (default 14).
- Changed: with **Admin only** turned off, non-admin users get a
  view-and-complete panel — they can browse tasks and mark them complete,
  while adding, editing, and removing tasks and managing groups stay with
  admins. Before, the panel showed them every control but each action
  failed. The **Add Task** card shows them a note instead of a form.
- Changed: the **Add Task** card's button moves to a footer below
  **Optional settings** instead of sitting between the main fields and the
  optional ones.
- Fixed: the **Add Task** card could show "Custom element doesn't exist"
  when a dashboard loaded from the browser cache.
- Fixed: release zips now include the integration's `brand/` icons, which
  Home Assistant 2026.3+ shows for custom integrations.
- Fixed: dialogs in the panel (add, edit, move, confirm, templates, manage
  groups) had no title on Home Assistant 2026.3+.
- Fixed: the version number in the panel toolbar was invisible on light
  themes.
- Fixed: the example dashboard's markdown summary ran the due tasks together
  on one line instead of listing them.

## 1.5.25 — 2026-09-25

- Changed: the **Home Maintenance Todo** dashboard card is redesigned around
  the "what needs doing?" workflow.
  - A header status line ("6 tasks need attention" / "All caught up") and
    Overdue / Due soon / Upcoming summary tiles; tapping a tile shows only
    that bucket. Hide the tiles with the new `show_summary: false` option.
  - Group chips replace the group dropdown, each badged with how many of the
    group's tasks need attention. Search moves behind a header button (it
    stays inline on cards without a title).
  - Flat task rows: a progress ring around the icon fills as the task
    approaches due (elapsed interval, uses, or runtime), a pill shows the
    relative due date above the date, and a single ✓ button completes the
    task. Edit and remove move into the tap-to-expand details, which add the
    next due date and a completion-history timeline.
  - Tasks completed today move to a **Done today** section at the bottom
    instead of sitting struck through among the upcoming tasks.
  - `max_items` ends the list with a **Show N more** button instead of
    silently cutting it off.
  - The layout adapts to the card's own width rather than the viewport, so
    narrow dashboard columns and phones move the due pill under the title
    instead of truncating titles.
  - Upcoming tasks use the theme's primary color (was green; green now means
    done). Override `--todo-upcoming` to change it.
- Added: the card's **Edit** action opens that task's edit dialog in the
  panel (via `/home-maintenance?edit=<task_id>`), and the card's panel links
  navigate in place instead of reloading the page.

## 1.5.24 — 2026-09-23

- Changed: task due state is computed once per task instead of twice.
  `is_due` and `next_transition` now accept an already-computed next due
  date, so serializing the task list for the panel and refreshing the
  **Any task due** sensor each halve their date arithmetic (measured: 400
  to 200 interval computations over 200 tasks).
- Changed: a tag scan now looks up only the task ids bound to that tag,
  rather than serializing every matching task (which deep-copied each
  task's full completion history on every scan).
- Changed: the todo card caches its sorted Overdue / Due soon / Upcoming
  buckets, so an unrelated Home Assistant state change no longer
  recomputes, re-filters and re-sorts the whole task list on every render.
  Bucketing moved into `compute.ts` and is now unit tested.

## 1.5.23 — 2026-08-24

- Added: a built-in template library — 90+ pre-built maintenance tasks
  (HVAC, plumbing, electrical, appliances, interior, exterior, yard, safety,
  vehicles) browsable and searchable from the panel; picking one prefills
  the add-task form.
- Added: CSV import and export. Bulk-import tasks from a CSV file (with a
  preview and per-line error reporting) via the template dialog, and export
  all tasks to `home_maintenance_tasks.csv` — also a migration path from
  other maintenance-tracker integrations.
- Added: search and label filtering in the panel — a search box over task
  titles, descriptions, and group names plus clickable label chips (OR
  logic) above the task table. Replaces the data table's built-in
  per-section search box.
- Added: seasonal tasks. Time-based tasks can be restricted to **active
  months** (e.g. April–October for lawn care): due dates landing out of
  season move to the start of the next season, and the task is never
  flagged due outside its months.
- Added: a `days_until_due` attribute on time-based and fixed-date task
  sensors (`0` = due today, negative = overdue) for automations and
  dashboards.
- Added: a global **Any task due** binary sensor aggregating all tasks,
  with `due_count` and `due_tasks` attributes — one automation hook for
  "does anything need attention".
- Added: `create_task` and `mark_overdue` services. Automations, scripts,
  and voice assistants can now create tasks (optionally returning the new
  task id as a response variable) and force a task due for testing
  notification/automation flows.
- Added: a `max_history_entries` integration option controlling how many
  completion-history entries are kept per task (default 50, `0` =
  unlimited); the edit dialog now shows the full history in a scrollable
  list.
- Added: completing a task now dismisses its outstanding companion-app
  notification (via `clear_notification` with the task's tag) and resets
  the notification state so the task re-notifies when next due.
- Fixed: seasonal tasks now flip their sensors (and the any-task-due
  aggregate) exactly at season boundaries — a pending occurrence resurfaces
  the moment the season starts, and a still-due task stops nagging when it
  ends — and the todo list agrees with the sensors out of season.
- Fixed: a fixed-date task created from the panel with a blank
  "Last performed" now starts with its anchor pending (a past anchor is due
  immediately), matching the documented behavior and the API default.
- Fixed: `mark_overdue` fails loudly for a seasonal task outside its active
  months instead of silently doing nothing, and `active_months` is dropped
  when a task is created or retyped to a non-time trigger.
- Changed: the API now rejects non-positive `interval_value` (matching the
  panel), bounds the label list per task, and `create_task`/`mark_overdue`
  require an admin user (automations and scripts are unaffected).
- Changed: CSV export neutralizes spreadsheet formula injection (a leading
  `=` `+` `-` `@` in a title/description is prefixed with an apostrophe).
- Changed: the create-task form moved **Last performed** into Optional
  settings (it defaults to today when blank); the edit dialog keeps it on
  the main row.

## 1.5.22 — 2026-08-23

- Added: a `todo.home_maintenance` todo list entity mirroring the tasks —
  due tasks are pending, checking one off completes it, and renaming or
  editing an item's description updates the task. Works with the native todo
  card, the companion-app widgets, and voice assistants.
- Added: a new **Fixed date** trigger type for seasonal tasks ("every year
  on October 1"): pick an anchor date and a repeat interval, and the
  schedule stays anchored to the calendar no matter when the task is
  completed. A **years** interval unit is also available for both time-based
  and fixed-date tasks.
- Added: completion history. Every completion is recorded per task (date,
  actual completion time, optional note) — the panel's complete dialog and
  `reset_last_performed`/`complete_task` accept a note, the edit dialog and
  todo card show recent entries, and history is capped at 50 entries.
- Added: the calendar now projects future recurrences (up to a year ahead)
  for time-based and fixed-date tasks instead of showing only the next due
  date.
- Added: `home_maintenance_task_completed` and `home_maintenance_task_due`
  bus events for event-triggered automations, fired on every completion and
  whenever a task's entity flips to due.
- Added: Repairs issues when a count/runtime task's watched entity no longer
  exists or a task's notify service is missing, clearing automatically once
  the reference is valid again.
- Added: config entry diagnostics (Settings → Devices & Services →
  Home Maintenance → Download diagnostics) with free-text fields redacted.
- Added: French, Spanish, Italian, Dutch, Polish, and Brazilian Portuguese
  translations for the panel, the cards, and the config flow; the todo
  card's remaining hard-coded strings are now localized.
- Added: frontend unit tests (vitest) covering the panel's date math,
  bucketing, form validation, and translation completeness, wired into CI.

## 1.5.21 — 2026-08-10

- Fixed (regression in 1.5.20): existing installs could get stuck on
  "Initializing" after upgrading, because the config-entry version changed
  from a string ("1.1.0") to an int (1). Setup now migrates the legacy string
  version to the int in place, so upgraded entries load without needing to be
  deleted and re-added.

## 1.5.20 — 2026-08-10

- Security: mutating websocket commands now require an admin user, matching
  the panel's admin-only option (a non-admin could previously add/edit/delete
  tasks and groups directly over the API). Notification "Open" URLs are
  restricted to http(s), and task text fields are length-bounded.
- Fixed: time-based tasks whose interval spans a daylight-saving fall-back no
  longer come due a day early.
- Fixed: duplicate push notifications when a processing pass overlapped a
  task change; passes are now serialized and skipped entirely when no task
  has notifications enabled.
- Fixed: `notify_when: overdue` now fires for count/runtime tasks; a failing
  notify target is retried at most once per day instead of every minute.
- Fixed: count/runtime tasks that share a watched entity, or are retyped in
  place, now keep their state listeners correctly wired; changing a task's
  watched entity re-captures its baseline/counter.
- Fixed: runtime tasks created or completed while their sensor is unavailable
  no longer baseline at 0 (and read as instantly due); a transient sensor dip
  no longer permanently zeroes the baseline.
- Fixed: count tasks no longer miscount an `unavailable → on` reconnect as a
  use; the maintenance calendar and entity area assignments no longer get
  rewritten on unrelated changes or every restart.
- Fixed: an options-save reload immediately after a task change no longer
  loses that change; a single malformed stored record no longer aborts setup
  of the whole integration; a tag-scanned event without a tag id no longer
  completes tasks with orphaned tag references.
- Fixed: `update_task` with an explicit `last_performed: null` no longer
  silently marks the task completed today.

## 1.5.19 — 2026-08-09

- Added: per-task push notifications. Each task can pick a notify service
  and send on due, overdue, or both, at a configurable time of day, with an
  optional "days before due" early reminder for time-based tasks. At most
  one notification per task and state is sent per day. Mobile app
  notifications carry **Mark complete** and **Snooze** action buttons, plus
  an optional **Open** action linking a configurable URL.
- Added: `snooze_task` service (silence a task's notifications for N days
  without completing it) and `send_task_notification` service (fire a
  task's notification immediately); the edit dialog gained a **Send test
  notification** button.
- Added: a `calendar.home_maintenance` calendar entity with one all-day
  event per time-based task on its next due date — upcoming maintenance
  shows up in the Calendar dashboard, calendar cards, and calendar-trigger
  automations. Count- and runtime-based tasks have no due date and are not
  shown; overdue tasks stay on their original date.

## 1.5.18 — 2026-08-08

- Fixed: the `reset_last_performed` service recorded the wrong day for
  timezones west of UTC when `performed_date` was given (the date was
  interpreted as UTC midnight); it now lands on the given calendar day in
  Home Assistant's timezone. All day-boundary math (store, triggers,
  websocket API) is consolidated on HA's `start_of_local_day`.
- Fixed: editing a task can no longer switch it into a state where it
  silently never becomes due — trigger-specific required fields (count/
  runtime entity and threshold) are now validated by the store on every
  write path, not just when adding.
- Fixed: renaming a group to the name of an existing group irreversibly
  merged the two; it is now rejected with a clear error, and the Groups
  card warns before even calling the backend.
- Fixed: task mutations on a missing task (update, complete, remove,
  increment, reset) now return a clean websocket error instead of an
  unhandled exception; the same applies to any command called while the
  integration is not loaded.
- Fixed: stored data written by a newer version of the integration no
  longer aborts setup (unknown task fields are dropped on load, and a
  storage migrate hook accepts other schema versions), and the
  integration's services are properly removed when the entry unloads.
- Fixed: dates shown in the panel and todo card are now parsed as calendar
  days — previously `new Date(iso)` could shift last-performed/next-due a
  day in browser timezones that differ from Home Assistant's.
- Performance: runtime sensors that update every few seconds no longer
  rewrite entity state and reload every open panel on each tick — updates
  push only when the due state flips or progress advances a whole unit.
  The panel loads static data (HA components, tags, config) once instead
  of on every push, the todo card no longer reloads twice after
  complete/remove, and group rename/delete sends one change signal instead
  of one per member task.
- The todo card's interval labels ("Every 5 uses") are now localized
  (English and German) like the rest of the UI.
- Internal cleanup: task completion uses the shared confirmation dialog
  (one dialog implementation instead of two), all dialogs work on both
  newer and older Home Assistant footer styles, the add form and edit
  dialog share one field renderer, shared frontend helpers replace
  triplicated debounce/date/interval code, and dead code was removed
  (`async_reload_entry`, `get_by_tag_id`, unused websocket wrappers, the
  unused device id).
- Documentation refresh: the README now describes the redesigned panel
  layout, documents the todo card's `group` option in the YAML example, and
  gains a Troubleshooting section (stale frontend after upgrades, component
  conflicts, admin-only panel visibility) plus browser-smoke-test
  instructions; docs/architecture.md covers the current frontend (three
  bundles, uniform ha-selector field rendering, shared confirm dialog and
  toasts, cache-busted serving, component-compatibility policy, smoke
  test); CONTRIBUTING.md adds frontend guidelines matching what CI
  enforces.

## 1.5.17 — 2026-08-08

- HA-native feedback everywhere: all browser-native alert()/confirm()
  dialogs (which look foreign and can be silently suppressed by the
  companion apps) are replaced with toast notifications and a shared
  ha-dialog confirmation — task removal, group deletion, task completion in
  the todo card, and all validation/error messages. Adding a task from the
  panel now shows a confirmation toast, and creating a group that already
  exists says so instead of silently clearing the field.
- Edit dialog fields now use the same uniform label-above-input rendering
  as the add form, so all inputs line up.
- Browser smoke test (scripts/e2e_smoke.py + CI job): boots a throwaway
  Home Assistant, logs in with a headless browser, adds a task, and creates
  a group — catching frontend component removals that pytest cannot see.
  Also runs against HA pre-releases in the weekly HA-next job.
- CI now fails if legacy Home Assistant components (mwc-*, ha-textfield,
  ha-formfield, ha-md-*, paper-*) reappear in the panel sources.
- Faster panel loads: static bundles are served with long-lived cache
  headers, safe now that URLs are version-stamped.
- scripts/develop now launches Home Assistant via the venv's python -m
  homeassistant, surviving repository moves/renames that break entrypoint
  shebangs.
- All three README screenshots recaptured in a consistent dark theme: the
  redesigned single-column panel (with an overdue task highlighted), the
  integration device page, and the entity attributes dialog.

## 1.5.16 — 2026-08-07

- Fixed: the Groups card's name fields did not render on Home Assistant
  builds that removed the legacy `ha-textfield` component, making it
  impossible to type a group name or create a group. The create and rename
  fields now use `ha-selector` (the same component as the task forms), and
  the todo/add-task card config editors were moved from hand-rolled
  `ha-textfield`/`ha-formfield` markup to schema-driven `ha-form`.

## 1.5.15 — 2026-08-07

- Groups card: the Create action now reads the group name directly from the
  text field as a fallback (guarding against environments where another
  frontend resource registers a conflicting ha-textfield and input events
  are lost) and shows an alert if the backend call fails instead of failing
  silently.

## 1.5.14 — 2026-08-07

- Create New Task form: all fields now render with a uniform label above the
  input, so fields line up horizontally regardless of selector style (the
  Tag and Label(s) pickers previously drew their own label above the input,
  pushing it lower than the neighboring fields).

## 1.5.13 — 2026-08-07

- Compact task forms, restoring the density of the original design while
  keeping trigger types, groups, and all optional fields: the panel now
  stacks its cards in a single full-width column with Create New Task on
  top, whose main fields (title, trigger type, trigger fields, last
  performed) and the Add Task button sit on one line. Optional settings
  expand onto a second line, with description on its own line below. The
  edit dialog and Add Task Lovelace card use the same responsive grid,
  fitting as many fields per line as their width allows.
- Cache busting: the panel and card bundles are served with a `?v=<version>`
  query string tied to the installed integration version, so browsers fetch
  the matching frontend after an upgrade instead of reusing stale cached
  modules.

## 1.5.11 — 2026-08-07

- Add Task Lovelace card (`custom:home-maintenance-add-task-card`): the
  panel's full task-creation form — trigger types, groups, and all optional
  fields — on any dashboard, with a confirmation toast. Auto-registered like
  the todo card, and included in the example dashboard.

## 1.5.9 — 2026-08-07

- Todo card: new `group` option pins a card to a single task group and hides
  the group dropdown — one card per room or system
- Example dashboard: documented copy-paste view in `docs/example-dashboard.md`,
  also loaded as a live dashboard in the development environment

## 1.5.8 — 2026-08-07

- Task groups: organize tasks into named groups. The panel gains a Groups
  card (create, rename, delete), a group picker in the add/edit forms, a
  "Move to group" task action, and the task table renders one section per
  group. Groups persist in storage and survive renames/deletes with member
  tasks reassigned. Ported from @select-star-from's fork.
- Completion confirmation: marking a task complete now asks for confirmation
  (with the recalculation consequences spelled out) and shows a toast on
  success, replacing the silent one-click ✓. Ported from @select-star-from's
  fork.
- Home Maintenance Todo Lovelace card (`custom:home-maintenance-todo-card`):
  a dashboard card showing tasks bucketed into Overdue / Due soon / Upcoming
  with search, group filter, quick complete/remove actions, and expandable
  details. Auto-registered — no manual resource setup needed. Ported from
  @csteamengine's fork and adapted to backend-computed trigger state.

## 1.5.7 — 2026-08-07

- Bundled brand icons (`brand/icon.png`, `brand/icon@2x.png`) — a house with
  hammer and wrench — so HACS shows the integration's own icon instead of
  falling back to the brands repository

## 1.5.6 — 2026-08-06

- Home Assistant 2026.3 compatibility: replaced removed `ha-md-menu` and
  `mwc-button` components with `ha-dropdown`-based `hm-task-menu` and
  `ha-button` (#122)
- Count-based task triggers: tasks can fire after a number of events on a
  monitored entity (#115)
- Runtime-based task triggers: tasks can fire when a sensor value delta
  crosses a threshold (#116)
- Area support: tasks can be assigned to a Home Assistant area (#117)
- Task description field in the add and edit dialogs (#101)
- Task titles can be edited from the edit dialog (#100)
- Trigger-type dropdown and all new form fields localized (English and German)
- Performance: state listeners no longer copy every task on each state change,
  storage writes are coalesced, and the task table no longer rebuilds on
  unrelated state updates
- Fixed: edit dialog validates count/runtime fields, description is no longer
  dropped on edit, and count/runtime sensors now expose the description
  attribute
- CI overhaul (HACS, hassfest, ruff, pytest, panel build with bundle drift
  check) and automatic releases with generated notes on every green build of
  main
- Architecture: the task store is now the single source of truth (entities no
  longer keep task copies); per-trigger-type logic consolidated into one
  strategy module shared by entities, API, and panel; entities are push-based
  and time-based tasks flip due exactly at their due moment; count/runtime
  sensors are watched with targeted state listeners
- The panel updates live via a websocket subscription (changes from NFC scans,
  services, and automations appear without a refresh), renders backend-computed
  due/progress state, and is split into focused components
- Task updates are validated against an explicit field whitelist server-side;
  switching a task's trigger type resets the counter or captures a fresh
  runtime baseline
- German panel translations are now actually loaded
- Test suite added (pytest-homeassistant-custom-component) covering triggers,
  store, websocket API, watchers, services, entities, config flow, and the
  release scripts, with an enforced 85% coverage gate, run on Python 3.13 and
  3.14
- Fixed: the options (Configure) dialog crashed on recent Home Assistant
  versions that made OptionsFlow.config_entry read-only
- CI hardening: all actions pinned to commit SHAs, a weekly non-blocking
  "HA next" job runs the suite against the newest Home Assistant pre-release
  for early breakage warning, and dependabot now maintains the panel's npm
  dependencies with an automatic bundle rebuild on its PRs
