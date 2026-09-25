"""Tests for config entry diagnostics."""

from datetime import timedelta

from homeassistant.util import dt as dt_util

from custom_components.tasks import TasksData
from custom_components.tasks.const import DOMAIN
from custom_components.tasks.diagnostics import (
    async_get_config_entry_diagnostics,
)
from custom_components.tasks.store import Task


async def test_diagnostics_redact_free_text(hass, setup_entry) -> None:
    data: TasksData = hass.data[DOMAIN]
    data.store.add(
        Task(
            id="tasks_diag",
            title="Clean Gutters",
            interval_value=6,
            interval_type="months",
            last_performed=(dt_util.now() - timedelta(days=10)).isoformat(),
            description="ladder is in the shed",
            tag_id="tag.gutter_tag",
            notification_url="http://internal.example/manual",
            group_id="Outdoors",
        )
    )
    data.store.update_last_performed("tasks_diag", note="hired a crew")
    await hass.async_block_till_done()

    diagnostics = await async_get_config_entry_diagnostics(hass, setup_entry)

    assert diagnostics["task_count"] == 1
    assert diagnostics["groups"] == ["Outdoors"]
    assert diagnostics["entry"]["options"]["admin_only"] is True

    task = diagnostics["tasks"][0]
    # Structure and computed state are visible...
    assert task["title"] == "Clean Gutters"
    assert task["trigger_type"] == "time"
    assert "due" in task
    assert task["next_due"] is not None
    # ...but free-text and identifying fields are redacted.
    assert task["description"] == "**REDACTED**"
    assert task["tag_id"] == "**REDACTED**"
    assert task["notification_url"] == "**REDACTED**"
    assert task["history"][0]["note"] == "**REDACTED**"
    assert task["history"][0]["performed"] == dt_util.now().date().isoformat()
