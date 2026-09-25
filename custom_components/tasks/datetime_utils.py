"""
Shared date/time helpers.

`last_performed` and `snooze_until` are stored as local-midnight ISO strings
with a fixed UTC offset. Parsing them back consistently — treating a naive
value as local, and re-resolving the offset against the current zone so
interval arithmetic survives DST transitions — is subtle enough that every
call site must use the same helper rather than re-deriving it.
"""

from __future__ import annotations

from datetime import timedelta
from typing import TYPE_CHECKING

from homeassistant.util import dt as dt_util

if TYPE_CHECKING:
    from datetime import datetime


def normalize_last_performed(last_str: str | None) -> str | None:
    """
    Return a midnight-floored local ISO date, or None if unparseable.

    An empty value means "performed today". Shared by the websocket add/update
    handlers and the create_task service so both normalize identically.
    """
    if not last_str:
        return dt_util.start_of_local_day().isoformat()
    parsed = dt_util.parse_datetime(last_str)
    if parsed is None:
        return None
    # Naive datetimes are taken as local time, not UTC.
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=dt_util.get_default_time_zone())
    return dt_util.start_of_local_day(dt_util.as_local(parsed)).isoformat()


def default_date_task_last_performed(anchor_date: object) -> str | None:
    """
    Return the implied last-performed date for a new fixed-date task.

    A fixed-date task created without a last-performed date starts with its
    anchor pending: the day before the anchor, so a past (or today's) anchor
    is immediately due instead of "completed today" silently deferring it a
    full interval. None when the anchor is unparseable (the store's trigger
    validation reports that).
    """
    anchor = dt_util.parse_date(str(anchor_date or "").split("T")[0])
    if anchor is None:
        return None
    return (anchor - timedelta(days=1)).isoformat()


def parse_local_datetime(value: str | None) -> datetime | None:
    """
    Parse a stored ISO datetime into an aware local datetime, or None.

    A naive value is taken as local time (not UTC). An aware value is
    converted to the local zone. The result is re-anchored to the current
    local zone so that later interval arithmetic (add days/weeks/months,
    then floor to local midnight) does not carry a stale fixed offset across
    a DST boundary — which would otherwise shift the due date by a day.
    """
    if not value:
        return None
    parsed = dt_util.parse_datetime(value)
    if parsed is None:
        return None
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=dt_util.get_default_time_zone())
    return dt_util.as_local(parsed)
