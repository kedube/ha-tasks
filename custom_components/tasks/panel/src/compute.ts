import { localize } from '../localize/localize';
import { EntityRegistryEntry, Task } from './types';

/**
 * Pure task computations for the panel and the Add Task card. This module is
 * deliberately DOM- and lit-free so the vitest unit tests can exercise it in
 * plain Node; anything that renders belongs in util.ts or a component.
 */

/**
 * Parse a stored ISO date/datetime as a local calendar date (midnight).
 * The backend stores local-midnight ISO strings; `new Date(iso)` would shift
 * them through the browser timezone and can land on the neighboring day.
 */
export const parseStoredDate = (value: string): Date => {
    const [datePart] = value.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    return new Date(year, month - 1, day);
};

/** Whether a task's trigger produces calendar due dates (time or date). */
export const isDatedTrigger = (task: Task): boolean => {
    const triggerType = task.trigger_type ?? "time";
    return triggerType === "time" || triggerType === "date";
};

/** "3 / 10" progress label for count/runtime tasks. */
export const formatProgress = (task: Task): string =>
    `${task.progress_current ?? 0} / ${task.progress_target ?? 0}`;

/** Localized "30 Days" / "1 Week" label for a time-based interval. */
export const formatTimeInterval = (value: number, type: string, lang: string): string => {
    const key = value === 1 ? type.slice(0, -1) : type;
    return `${value} ${localize(`intervals.${key}`, lang)}`;
};

/** Trigger-aware interval label: threshold for count/runtime, span for dated. */
export const formatTriggerInterval = (task: Task, lang: string): string => {
    const triggerType = task.trigger_type ?? "time";
    if (triggerType === "count") {
        return localize('intervals.every_uses', lang, '{value}', String(task.count_threshold ?? 0));
    }
    if (triggerType === "runtime") {
        return localize('intervals.every_runtime', lang, '{value}', String(task.runtime_threshold ?? 0));
    }
    return formatTimeInterval(task.interval_value, task.interval_type, lang);
};

export type TaskStatus = "overdue" | "due_soon" | "upcoming";

export interface TaskSchedule {
    nextDue: Date | null;
    daysUntilDue: number | null;
    status: TaskStatus;
    completedToday: boolean;
}

/**
 * Bucket a task for the task list: overdue when the backend says it's due,
 * due_soon within the window, upcoming otherwise. `now` defaults to today's
 * local midnight and is injectable for tests.
 */
export const computeTaskSchedule = (
    task: Task,
    dueSoonDays: number,
    now?: Date,
): TaskSchedule => {
    const today = now ? new Date(now) : new Date();
    today.setHours(0, 0, 0, 0);

    let nextDue: Date | null = null;
    let daysUntilDue: number | null = null;
    if (isDatedTrigger(task) && task.next_due) {
        // Parse the calendar date, not the instant: new Date(iso) would
        // shift the backend's local midnight through the browser TZ.
        // Round, don't ceil: a DST transition makes the midnight-to-midnight
        // span 23 or 25 hours, and ceil would inflate the day count by one.
        nextDue = parseStoredDate(task.next_due);
        daysUntilDue = Math.round((nextDue.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    }

    let status: TaskStatus;
    if (task.due) status = "overdue";
    else if (daysUntilDue !== null && daysUntilDue <= dueSoonDays) status = "due_soon";
    else status = "upcoming";

    let completedToday = false;
    if (task.last_performed) {
        completedToday = parseStoredDate(task.last_performed).getTime() === today.getTime();
    }

    return { nextDue, daysUntilDue, status, completedToday };
};

/**
 * How far a task has moved toward its next due point, from 0 (just done) to
 * 1 (due): the elapsed share of the interval for dated tasks, the counter or
 * runtime share for count/runtime tasks. Drives the task list's progress
 * ring. `now` defaults to today's local midnight and is injectable for tests.
 */
export const computeDueProgress = (
    task: Task,
    schedule: TaskSchedule,
    now?: Date,
): number => {
    if (task.due) return 1;
    const clamp = (value: number) => Math.min(Math.max(value, 0), 1);
    if (!isDatedTrigger(task)) {
        const target = task.progress_target ?? 0;
        return target > 0 ? clamp((task.progress_current ?? 0) / target) : 0;
    }
    if (!schedule.nextDue || !task.last_performed) return 0;
    const today = now ? new Date(now) : new Date();
    today.setHours(0, 0, 0, 0);
    const start = parseStoredDate(task.last_performed).getTime();
    const span = schedule.nextDue.getTime() - start;
    if (span <= 0) return 1;
    return clamp((today.getTime() - start) / span);
};

/** Localized "Due today" / "3 days overdue" / "5 days left" label. */
export const formatDaysLabel = (schedule: TaskSchedule, task: Task, lang: string): string => {
    if (!isDatedTrigger(task)) {
        return formatProgress(task);
    }
    const days = schedule.daysUntilDue;
    if (days === null) return "";
    if (days === 0) return localize('panel.list.due_today', lang);
    if (days < 0) {
        return localize('panel.list.days_overdue', lang, '{count}', Math.abs(days));
    }
    return localize('panel.list.days_left', lang, '{count}', days);
};

/**
 * Filter the task list by a free-text query (title/description/group name,
 * case-insensitive — the task list's search semantics) and selected
 * label ids (OR logic — a task matches when its entity carries any selected
 * label). Empty query and no labels returns the input list unchanged so
 * render caches keyed on identity stay warm.
 */
export const filterTasks = (
    tasks: Task[],
    registry: EntityRegistryEntry[],
    query: string,
    labelIds: string[],
): Task[] => {
    const needle = query.trim().toLowerCase();
    if (!needle && !labelIds.length) return tasks;

    const labelsByTask = new Map<string, string[]>();
    if (labelIds.length) {
        registry.forEach((entry) => labelsByTask.set(entry.unique_id, entry.labels));
    }

    return tasks.filter((task) => {
        if (needle) {
            const haystack =
                `${task.title}\n${task.description ?? ''}\n${task.group_id ?? ''}`.toLowerCase();
            if (!haystack.includes(needle)) return false;
        }
        if (labelIds.length) {
            const taskLabels = labelsByTask.get(task.id) ?? [];
            if (!labelIds.some((id) => taskLabels.includes(id))) return false;
        }
        return true;
    });
};

/** A task list section: the three statuses plus "completed today". */
export type DisplayBucket = TaskStatus | "done";

interface Bucketable {
    status: TaskStatus;
    nextDue: Date | null;
    completedToday?: boolean;
}

/**
 * Which task list section a task belongs in. A task completed today moves
 * to "done" so the active sections list only what still needs doing —
 * unless it is already due again, which keeps it in "overdue".
 */
export const displayBucket = (task: Bucketable): DisplayBucket =>
    task.completedToday && task.status !== "overdue" ? "done" : task.status;

export interface StatusBuckets<T> {
    overdue: T[];
    dueSoon: T[];
    upcoming: T[];
    done: T[];
}

/**
 * Per group, how many tasks need attention (overdue or due soon, not done
 * today) and the most urgent status among them. Groups with nothing
 * pending are absent. Feeds the group sidebar and chip badges.
 */
export const attentionByGroup = <T extends Bucketable>(
    tasks: T[],
    groupOf: (task: T) => string,
): Map<string, { count: number; status: TaskStatus }> => {
    const out = new Map<string, { count: number; status: TaskStatus }>();
    tasks.forEach((task) => {
        const bucket = displayBucket(task);
        if (bucket !== "overdue" && bucket !== "due_soon") return;
        const group = groupOf(task);
        const entry = out.get(group);
        if (!entry) {
            out.set(group, { count: 1, status: bucket });
        } else {
            entry.count += 1;
            if (bucket === "overdue") entry.status = "overdue";
        }
    });
    return out;
};

/**
 * Split tasks into the task list's display buckets (see displayBucket),
 * each sorted by due date (undated last, then by title).
 *
 * `titleOf` reads each task's title for the tie-break, so callers can pass
 * their own shape without copying it. Lives here rather than in the list so
 * the bucketing rules stay unit testable in plain Node.
 */
export const bucketTasksByStatus = <T extends Bucketable>(
    tasks: T[],
    titleOf: (task: T) => string,
    language?: string,
): StatusBuckets<T> => {
    // One collator beats a localeCompare call per comparison.
    const collator = new Intl.Collator(language);
    const byDate = (a: T, b: T) => {
        if (a.nextDue && b.nextDue) return a.nextDue.getTime() - b.nextDue.getTime();
        if (a.nextDue) return -1;
        if (b.nextDue) return 1;
        return collator.compare(titleOf(a), titleOf(b));
    };

    // Bucket in a single pass, then sort each bucket — rather than three
    // filter+sort passes over the whole list followed by three more filters.
    const buckets: StatusBuckets<T> = { overdue: [], dueSoon: [], upcoming: [], done: [] };
    tasks.forEach((task) => {
        const bucket = displayBucket(task);
        if (bucket === "overdue") buckets.overdue.push(task);
        else if (bucket === "due_soon") buckets.dueSoon.push(task);
        else if (bucket === "done") buckets.done.push(task);
        else buckets.upcoming.push(task);
    });
    buckets.overdue.sort(byDate);
    buckets.dueSoon.sort(byDate);
    buckets.upcoming.sort(byDate);
    buckets.done.sort(byDate);

    return buckets;
};

/**
 * Split tasks into task-group sections for the panel's "group by group"
 * view: named groups in collator order, then ungrouped ("") last. Within a
 * section tasks run in display order — overdue, due soon, upcoming, then
 * done today — each part sorted by due date as in bucketTasksByStatus.
 */
export const sectionTasksByGroup = <T extends Bucketable>(
    tasks: T[],
    groupOf: (task: T) => string,
    titleOf: (task: T) => string,
    language?: string,
): { group: string; tasks: T[] }[] => {
    const byGroup = new Map<string, T[]>();
    tasks.forEach((task) => {
        const group = groupOf(task);
        const members = byGroup.get(group);
        if (members) members.push(task);
        else byGroup.set(group, [task]);
    });
    const collator = new Intl.Collator(language);
    const names = [...byGroup.keys()].sort((a, b) => {
        if (a === "") return 1;
        if (b === "") return -1;
        return collator.compare(a, b);
    });
    return names.map((group) => {
        const buckets = bucketTasksByStatus(byGroup.get(group)!, titleOf, language);
        return {
            group,
            tasks: [...buckets.overdue, ...buckets.dueSoon, ...buckets.upcoming, ...buckets.done],
        };
    });
};

/** Trailing-edge debouncer for coalescing subscription pushes. */
export class Debouncer {
    private _timer?: ReturnType<typeof setTimeout>;

    constructor(private readonly _fn: () => void, private readonly _ms: number) { }

    schedule() {
        this.cancel();
        this._timer = setTimeout(() => {
            this._timer = undefined;
            this._fn();
        }, this._ms);
    }

    cancel() {
        if (this._timer !== undefined) clearTimeout(this._timer);
        this._timer = undefined;
    }
}
