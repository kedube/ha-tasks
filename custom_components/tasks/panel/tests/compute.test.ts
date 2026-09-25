import { describe, expect, it, vi } from 'vitest';

import {
    Debouncer,
    attentionByGroup,
    bucketTasksByStatus,
    computeDueProgress,
    computeTaskSchedule,
    displayBucket,
    filterTasks,
    formatDaysLabel,
    formatProgress,
    formatTimeInterval,
    formatTriggerInterval,
    isDatedTrigger,
    parseStoredDate,
    sectionTasksByGroup,
} from '../src/compute';
import type { TaskStatus } from '../src/compute';
import type { Task } from '../src/types';

const baseTask = (overrides: Partial<Task> = {}): Task => ({
    id: 'tasks_test',
    title: 'Test Task',
    interval_value: 30,
    interval_type: 'days',
    last_performed: '2026-08-01T00:00:00-07:00',
    trigger_type: 'time',
    due: false,
    next_due: '2026-08-31T00:00:00-07:00',
    ...overrides,
});

// Local midnight of a fixed "today" used across the schedule tests.
const TODAY = new Date(2026, 7, 21); // 2026-08-21

describe('parseStoredDate', () => {
    it('parses the calendar date, ignoring time and offset', () => {
        const parsed = parseStoredDate('2026-08-31T00:00:00-07:00');
        expect(parsed.getFullYear()).toBe(2026);
        expect(parsed.getMonth()).toBe(7);
        expect(parsed.getDate()).toBe(31);
        expect(parsed.getHours()).toBe(0);
    });

    it('accepts a bare date string', () => {
        expect(parseStoredDate('2026-01-05').getDate()).toBe(5);
    });
});

describe('isDatedTrigger', () => {
    it('treats time, date, and missing trigger types as dated', () => {
        expect(isDatedTrigger(baseTask())).toBe(true);
        expect(isDatedTrigger(baseTask({ trigger_type: 'date' }))).toBe(true);
        expect(isDatedTrigger(baseTask({ trigger_type: undefined }))).toBe(true);
        expect(isDatedTrigger(baseTask({ trigger_type: 'count' }))).toBe(false);
        expect(isDatedTrigger(baseTask({ trigger_type: 'runtime' }))).toBe(false);
    });
});

describe('computeTaskSchedule', () => {
    it('buckets a backend-due task as overdue', () => {
        const schedule = computeTaskSchedule(baseTask({ due: true }), 14, TODAY);
        expect(schedule.status).toBe('overdue');
    });

    it('buckets a task inside the due-soon window', () => {
        const schedule = computeTaskSchedule(baseTask(), 14, TODAY);
        expect(schedule.daysUntilDue).toBe(10);
        expect(schedule.status).toBe('due_soon');
    });

    it('buckets a far-out task as upcoming', () => {
        const schedule = computeTaskSchedule(baseTask(), 5, TODAY);
        expect(schedule.status).toBe('upcoming');
    });

    it('treats a fixed-date task like a dated task', () => {
        const schedule = computeTaskSchedule(
            baseTask({ trigger_type: 'date', next_due: '2026-08-22T00:00:00-07:00' }),
            14,
            TODAY,
        );
        expect(schedule.daysUntilDue).toBe(1);
        expect(schedule.status).toBe('due_soon');
        expect(schedule.nextDue?.getDate()).toBe(22);
    });

    it('gives count/runtime tasks no dates', () => {
        const schedule = computeTaskSchedule(
            baseTask({ trigger_type: 'count', next_due: null }),
            14,
            TODAY,
        );
        expect(schedule.nextDue).toBeNull();
        expect(schedule.daysUntilDue).toBeNull();
        expect(schedule.status).toBe('upcoming');
    });

    it('detects a completion today', () => {
        const schedule = computeTaskSchedule(
            baseTask({ last_performed: '2026-08-21T00:00:00-07:00' }),
            14,
            TODAY,
        );
        expect(schedule.completedToday).toBe(true);
    });

    it('counts days correctly across a DST fall-back transition', () => {
        // US DST ends Nov 1 2026: the Oct 31 -> Nov 3 span is 73 hours, and
        // ceil(73/24) would report 4 days for a task due in 3.
        const schedule = computeTaskSchedule(
            baseTask({ next_due: '2026-11-03T00:00:00-08:00' }),
            14,
            new Date(2026, 9, 31),
        );
        expect(schedule.daysUntilDue).toBe(3);
    });
});

describe('format helpers', () => {
    it('formats progress for count/runtime tasks', () => {
        expect(formatProgress(baseTask({ progress_current: 3, progress_target: 10 }))).toBe('3 / 10');
        expect(formatProgress(baseTask())).toBe('0 / 0');
    });

    it('formats time intervals with singular/plural keys', () => {
        expect(formatTimeInterval(1, 'weeks', 'en')).toBe('1 Week');
        expect(formatTimeInterval(3, 'months', 'en')).toBe('3 Months');
        expect(formatTimeInterval(1, 'years', 'en')).toBe('1 Year');
    });

    it('formats trigger-aware intervals', () => {
        expect(formatTriggerInterval(baseTask(), 'en')).toBe('30 Days');
        expect(formatTriggerInterval(baseTask({ trigger_type: 'date', interval_value: 1, interval_type: 'years' }), 'en')).toBe('1 Year');
        expect(formatTriggerInterval(baseTask({ trigger_type: 'count', count_threshold: 60 }), 'en')).toBe('Every 60 uses');
        expect(formatTriggerInterval(baseTask({ trigger_type: 'runtime', runtime_threshold: 50 }), 'en')).toBe('Every 50 runtime');
    });

    it('formats the due-days label including plurals', () => {
        const label = (next_due: string, due = false) =>
            formatDaysLabel(
                computeTaskSchedule(baseTask({ next_due, due }), 14, TODAY),
                baseTask({ next_due, due }),
                'en',
            );
        expect(label('2026-08-21T00:00:00-07:00')).toBe('Due today');
        expect(label('2026-08-22T00:00:00-07:00')).toBe('Due in 1 day');
        expect(label('2026-08-26T00:00:00-07:00')).toBe('5 days left');
        expect(label('2026-08-20T00:00:00-07:00', true)).toBe('1 day overdue');
        expect(label('2026-08-11T00:00:00-07:00', true)).toBe('10 days overdue');
    });

    it('falls back to progress for undated tasks', () => {
        const task = baseTask({ trigger_type: 'count', next_due: null, progress_current: 2, progress_target: 5 });
        expect(formatDaysLabel(computeTaskSchedule(task, 14, TODAY), task, 'en')).toBe('2 / 5');
    });
});

describe('Debouncer', () => {
    it('coalesces rapid schedules into one trailing call', () => {
        vi.useFakeTimers();
        const fn = vi.fn();
        const debouncer = new Debouncer(fn, 300);
        debouncer.schedule();
        debouncer.schedule();
        debouncer.schedule();
        vi.advanceTimersByTime(299);
        expect(fn).not.toHaveBeenCalled();
        vi.advanceTimersByTime(1);
        expect(fn).toHaveBeenCalledTimes(1);
        vi.useRealTimers();
    });

    it('cancel stops a pending call', () => {
        vi.useFakeTimers();
        const fn = vi.fn();
        const debouncer = new Debouncer(fn, 300);
        debouncer.schedule();
        debouncer.cancel();
        vi.advanceTimersByTime(1000);
        expect(fn).not.toHaveBeenCalled();
        vi.useRealTimers();
    });
});

describe('filterTasks', () => {
    const registry = [
        { entity_id: 'binary_sensor.a', unique_id: 'a', platform: 'tasks', labels: ['l1'] },
        { entity_id: 'binary_sensor.b', unique_id: 'b', platform: 'tasks', labels: ['l2'] },
        { entity_id: 'binary_sensor.c', unique_id: 'c', platform: 'tasks', labels: [] },
    ];
    const tasks = [
        baseTask({ id: 'a', title: 'Clean Gutters', description: 'roof work' }),
        baseTask({ id: 'b', title: 'Replace Filter', description: null }),
        baseTask({ id: 'c', title: 'Mow Lawn', description: 'yard' }),
    ];

    it('returns the same array when no filter is active', () => {
        expect(filterTasks(tasks, registry as any, '', [])).toBe(tasks);
    });

    it('matches title and description case-insensitively', () => {
        expect(filterTasks(tasks, registry as any, 'FILTER', []).map((t) => t.id)).toEqual(['b']);
        expect(filterTasks(tasks, registry as any, 'roof', []).map((t) => t.id)).toEqual(['a']);
    });

    it('filters by any selected label (OR logic)', () => {
        expect(filterTasks(tasks, registry as any, '', ['l1']).map((t) => t.id)).toEqual(['a']);
        expect(filterTasks(tasks, registry as any, '', ['l1', 'l2']).map((t) => t.id)).toEqual(['a', 'b']);
    });

    it('combines query and labels with AND', () => {
        expect(filterTasks(tasks, registry as any, 'clean', ['l2'])).toEqual([]);
        expect(filterTasks(tasks, registry as any, 'clean', ['l1']).map((t) => t.id)).toEqual(['a']);
    });

    it('excludes unlabeled tasks when labels are selected', () => {
        expect(filterTasks(tasks, registry as any, '', ['l1']).find((t) => t.id === 'c')).toBeUndefined();
    });
});

describe('filterTasks group matching', () => {
    it('matches the group name', () => {
        const registry: any[] = [];
        const tasks = [
            baseTask({ id: 'g1', title: 'Task A', group_id: 'Kitchen' }),
            baseTask({ id: 'g2', title: 'Task B', group_id: 'Garage' }),
        ];
        expect(filterTasks(tasks, registry, 'kitchen', []).map((t) => t.id)).toEqual(['g1']);
    });
});

describe('bucketTasksByStatus', () => {
    const t = (id: string, status: TaskStatus, nextDue: Date | null, title = id) =>
        ({ id, status, nextDue, title });
    const ids = (bucket: { id: string }[]) => bucket.map((b) => b.id);
    const day = (d: number) => new Date(2026, 0, d);

    it('sorts each bucket by due date, undated last', () => {
        const { overdue, dueSoon, upcoming } = bucketTasksByStatus(
            [
                t('c', 'overdue', day(3)),
                t('a', 'overdue', day(1)),
                t('z', 'overdue', null),
                t('b', 'overdue', day(2)),
                t('soon', 'due_soon', day(9)),
                t('up', 'upcoming', day(20)),
            ],
            (task) => task.title,
        );
        expect(ids(overdue)).toEqual(['a', 'b', 'c', 'z']);
        expect(ids(dueSoon)).toEqual(['soon']);
        expect(ids(upcoming)).toEqual(['up']);
    });

    it('breaks ties between undated tasks by title', () => {
        const { upcoming } = bucketTasksByStatus(
            [
                t('x', 'upcoming', null, 'Zebra'),
                t('y', 'upcoming', null, 'Apple'),
            ],
            (task) => task.title,
        );
        expect(ids(upcoming)).toEqual(['y', 'x']);
    });

    it('handles an empty list', () => {
        const out = bucketTasksByStatus([], (task: { title: string }) => task.title);
        expect(out).toEqual({ overdue: [], dueSoon: [], upcoming: [], done: [] });
    });

    it('moves tasks completed today into the trailing done bucket', () => {
        const done = (id: string, status: TaskStatus) =>
            ({ ...t(id, status, day(9)), completedToday: true });
        const out = bucketTasksByStatus(
            [done('d1', 'upcoming'), done('d2', 'due_soon'), t('u1', 'upcoming', day(4))],
            (task) => task.title,
        );
        expect(ids(out.done)).toEqual(['d1', 'd2']);
        expect(ids(out.dueSoon)).toEqual([]);
        expect(ids(out.upcoming)).toEqual(['u1']);
    });

    it('keeps a task completed today but already due again in overdue', () => {
        const out = bucketTasksByStatus(
            [{ ...t('o', 'overdue', day(1)), completedToday: true }],
            (task) => task.title,
        );
        expect(ids(out.overdue)).toEqual(['o']);
        expect(out.done).toEqual([]);
    });
});

describe('displayBucket', () => {
    it('maps statuses through, and completed-today tasks to done', () => {
        expect(displayBucket({ status: 'due_soon', nextDue: null })).toBe('due_soon');
        expect(displayBucket({ status: 'upcoming', nextDue: null, completedToday: true })).toBe('done');
        expect(displayBucket({ status: 'overdue', nextDue: null, completedToday: true })).toBe('overdue');
    });
});

describe('attentionByGroup', () => {
    const task = (group: string, status: TaskStatus, completedToday = false) =>
        ({ group, status, nextDue: null, completedToday });

    it('counts overdue and due-soon tasks per group with the worst status', () => {
        const out = attentionByGroup(
            [
                task('Kitchen', 'due_soon'),
                task('Kitchen', 'overdue'),
                task('Kitchen', 'upcoming'),
                task('HVAC', 'due_soon'),
                task('Garage', 'upcoming'),
            ],
            (t) => t.group,
        );
        expect(out.get('Kitchen')).toEqual({ count: 2, status: 'overdue' });
        expect(out.get('HVAC')).toEqual({ count: 1, status: 'due_soon' });
        expect(out.has('Garage')).toBe(false);
    });

    it('skips due-soon tasks already completed today', () => {
        const out = attentionByGroup([task('Kitchen', 'due_soon', true)], (t) => t.group);
        expect(out.size).toBe(0);
    });
});

describe('sectionTasksByGroup', () => {
    const task = (id: string, group: string, status: TaskStatus, day: number, completedToday = false) =>
        ({ id, group, status, nextDue: new Date(2026, 0, day), completedToday });
    const ids = (tasks: { id: string }[]) => tasks.map((t) => t.id);

    it('orders named groups alphabetically with ungrouped last', () => {
        const sections = sectionTasksByGroup(
            [task('a', '', 'upcoming', 1), task('b', 'Kitchen', 'upcoming', 1), task('c', 'HVAC', 'upcoming', 1)],
            (t) => t.group,
            (t) => t.id,
        );
        expect(sections.map((s) => s.group)).toEqual(['HVAC', 'Kitchen', '']);
    });

    it('orders tasks within a group by status, then due date, done today last', () => {
        const [kitchen] = sectionTasksByGroup(
            [
                task('done', 'Kitchen', 'upcoming', 2, true),
                task('up', 'Kitchen', 'upcoming', 3),
                task('soon2', 'Kitchen', 'due_soon', 9),
                task('soon1', 'Kitchen', 'due_soon', 5),
                task('over', 'Kitchen', 'overdue', 20),
            ],
            (t) => t.group,
            (t) => t.id,
        );
        expect(ids(kitchen.tasks)).toEqual(['over', 'soon1', 'soon2', 'up', 'done']);
    });

    it('returns no sections for no tasks', () => {
        expect(sectionTasksByGroup([], (t: { group: string }) => t.group, () => '')).toEqual([]);
    });
});

describe('computeDueProgress', () => {
    it('reports the elapsed share of a dated interval', () => {
        // Performed Aug 1, due Aug 31, today Aug 21: 20 of 30 days.
        const task = baseTask();
        const progress = computeDueProgress(task, computeTaskSchedule(task, 14, TODAY), TODAY);
        expect(progress).toBeCloseTo(20 / 30, 2);
    });

    it('is full for a due task', () => {
        const task = baseTask({ due: true });
        expect(computeDueProgress(task, computeTaskSchedule(task, 14, TODAY), TODAY)).toBe(1);
    });

    it('uses the counter share for count/runtime tasks, clamped to 1', () => {
        const partial = baseTask({ trigger_type: 'count', next_due: null, progress_current: 3, progress_target: 12 });
        expect(computeDueProgress(partial, computeTaskSchedule(partial, 14, TODAY), TODAY)).toBe(0.25);
        const over = baseTask({ trigger_type: 'runtime', next_due: null, progress_current: 15, progress_target: 12 });
        expect(computeDueProgress(over, computeTaskSchedule(over, 14, TODAY), TODAY)).toBe(1);
        const unset = baseTask({ trigger_type: 'count', next_due: null });
        expect(computeDueProgress(unset, computeTaskSchedule(unset, 14, TODAY), TODAY)).toBe(0);
    });
});
