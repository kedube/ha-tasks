# Example dashboard

A ready-to-copy Lovelace dashboard for the Tasks integration: the
due tasks as a to-do list you can check off, a templated "at a glance"
summary, plain entity rows, upcoming due dates on a calendar, and the bundled
[Add Task card](../README.md#dashboards) — everything works with standard Home
Assistant cards plus the card that ships with this integration (no HACS
frontend extras required). The [panel](../README.md#using-the-panel) remains
the place to manage tasks.

The same dashboard is loaded automatically in the development environment
(`scripts/develop`) as **Tasks Example** in the sidebar, from
[`config/dashboards/tasks-example.yaml`](../config/dashboards/tasks-example.yaml).

> Replace the example entity IDs (`binary_sensor.change_hvac_filter`, …) with
> your own. Every task you create in the panel gets a `binary_sensor` named
> after its title.

## Quick start: one card

In any dashboard, choose **Edit dashboard → Add card → To-do list**, pick the
**Tasks** list, or paste this into the manual card editor:

```yaml
type: todo-list
entity: todo.tasks
hide_completed: true
display_order: duedate_asc
```

## Full view

Paste into a dashboard's **raw configuration editor** (⋮ → *Edit dashboard* →
⋮ → *Raw configuration editor*) as an entry under `views:`, or use it as-is in
a YAML-mode dashboard.

```yaml
title: Tasks
path: tasks
icon: mdi:checkbox-marked-circle-auto-outline
type: sections
max_columns: 3
sections:
  # ── What's due: check tasks off right here ────────────────────────────
  - type: grid
    cards:
      - type: heading
        heading: Due now
        icon: mdi:clipboard-text-clock-outline
      - type: todo-list
        entity: todo.tasks
        hide_completed: true
        display_order: duedate_asc

  # ── At a glance ───────────────────────────────────────────────────────
  - type: grid
    cards:
      - type: heading
        heading: At a glance
        icon: mdi:clipboard-check-outline
      - type: markdown
        content: |-
          {% set tasks = states.binary_sensor
             | selectattr('attributes.trigger_type', 'defined') | list %}
          {% set due = tasks | selectattr('state', 'eq', 'on') | list %}
          {% if due %}
          ⚠️ **{{ due | count }} of {{ tasks | count }} tasks due**

          {% for t in due %}
          - {{ t.name }}
          {% endfor %}
          {% else %}
          ✅ All {{ tasks | count }} tasks are up to date.
          {% endif %}
      - type: entities
        title: Key tasks
        entities:
          - binary_sensor.change_hvac_filter
          - binary_sensor.clean_gutters
          - binary_sensor.test_smoke_alarms
          - binary_sensor.descale_coffee_machine

  # ── Coming up: projected due dates ────────────────────────────────────
  - type: grid
    cards:
      - type: heading
        heading: Coming up
        icon: mdi:calendar-clock
      - type: calendar
        entities:
          - calendar.tasks
        initial_view: listWeek

  # ── Create tasks without opening the panel ────────────────────────────
  - type: grid
    cards:
      - type: heading
        heading: New task
        icon: mdi:plus-circle-outline
      - type: custom:tasks-add-task-card
        title: Add Task
```

## What each piece does

- **Due now** — Home Assistant's built-in to-do list card on the integration's
  [todo list entity](../README.md#todo-list). `hide_completed` leaves only the
  due tasks, soonest first; checking one off completes the task, exactly like
  the panel's ✓.
- **Markdown summary** — counts every task and lists the due
  ones. It identifies tasks by the `trigger_type` attribute this integration
  sets on its sensors, so new tasks are picked up automatically with no
  per-entity configuration.
- **Key tasks** — a plain entities card, to show tasks are ordinary binary
  sensors that work with any core card (tile, glance, history-graph, …).
- **Coming up** — the integration's [calendar](../README.md#calendar) as a
  week list: every time-based and fixed-date task's next due date, plus
  projected recurrences.
- **New task** — the add-task card embeds the panel's full creation form
  (trigger types, groups, and every optional field) and shows a toast when the
  task is created. Its only option is `title` (empty for no header).

## Notifications to match

Pair the dashboard with an automation so due tasks reach your phone — see
[Automation ideas](../README.md#automation-ideas) in the README.
