import { describe, expect, it } from 'vitest';

import {
    computeISODate,
    emptyTaskFormData,
    monthOptions,
    taskFormToAddPayload,
    taskFormToUpdates,
    taskToFormData,
    validateTaskForm,
} from '../src/schema';
import type { Task, TaskFormData } from '../src/types';

const formData = (overrides: Partial<TaskFormData> = {}): TaskFormData => ({
    ...emptyTaskFormData(),
    title: 'Test Task',
    interval_value: 30,
    interval_type: 'days',
    ...overrides,
});

describe('validateTaskForm', () => {
    it('requires a title', () => {
        expect(validateTaskForm(formData({ title: '  ' }))).toBe(false);
    });

    it('validates time tasks on interval fields', () => {
        expect(validateTaskForm(formData())).toBe(true);
        expect(validateTaskForm(formData({ interval_value: '' }))).toBe(false);
    });

    it('validates date tasks on anchor and interval', () => {
        const valid = formData({ trigger_type: 'date', anchor_date: '2026-10-01' });
        expect(validateTaskForm(valid)).toBe(true);
        expect(validateTaskForm({ ...valid, anchor_date: '' })).toBe(false);
        expect(validateTaskForm({ ...valid, interval_value: '' })).toBe(false);
    });

    it('validates count tasks on entity and threshold', () => {
        const valid = formData({ trigger_type: 'count', count_entity_id: 'switch.x', count_threshold: 5 });
        expect(validateTaskForm(valid)).toBe(true);
        expect(validateTaskForm({ ...valid, count_entity_id: '' })).toBe(false);
        expect(validateTaskForm({ ...valid, count_threshold: '' })).toBe(false);
    });

    it('validates runtime tasks on sensor and threshold', () => {
        const valid = formData({ trigger_type: 'runtime', runtime_entity_id: 'sensor.x', runtime_threshold: 50 });
        expect(validateTaskForm(valid)).toBe(true);
        expect(validateTaskForm({ ...valid, runtime_entity_id: '' })).toBe(false);
    });
});

describe('computeISODate', () => {
    it('floors a date string to local midnight', () => {
        const iso = computeISODate('2026-10-01')!;
        const parsed = new Date(iso);
        expect(parsed.getFullYear()).toBe(2026);
        expect(parsed.getMonth()).toBe(9);
        expect(parsed.getDate()).toBe(1);
        expect(parsed.getHours()).toBe(0);
    });

    it('defaults to today when empty', () => {
        const parsed = new Date(computeISODate('')!);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        expect(parsed.getTime()).toBe(today.getTime());
    });

    it('rejects garbage', () => {
        expect(computeISODate('not-a-date')).toBeNull();
    });
});

describe('payload builders', () => {
    it('includes anchor_date only for date tasks', () => {
        const datePayload = taskFormToAddPayload(
            formData({ trigger_type: 'date', anchor_date: '2026-10-01' }),
            '2026-08-21T07:00:00.000Z',
        );
        expect(datePayload.anchor_date).toBe('2026-10-01');
        expect(datePayload.trigger_type).toBe('date');
        expect(datePayload.interval_value).toBe(30);

        const timePayload = taskFormToAddPayload(formData(), '2026-08-21T07:00:00.000Z');
        expect(timePayload.anchor_date).toBeUndefined();
    });

    it('nulls anchor_date when a task is retyped away from date', () => {
        const updates = taskFormToUpdates(formData(), '2026-08-21T07:00:00.000Z');
        expect(updates.anchor_date).toBeNull();
        expect(updates.trigger_type).toBe('time');
    });

    it('strips a datetime suffix from the anchor defensively', () => {
        const updates = taskFormToUpdates(
            formData({ trigger_type: 'date', anchor_date: '2026-10-01T00:00:00' }),
            '2026-08-21T07:00:00.000Z',
        );
        expect(updates.anchor_date).toBe('2026-10-01');
    });

    it('zeroes count/runtime fields for time tasks', () => {
        const payload = taskFormToUpdates(formData(), '2026-08-21T07:00:00.000Z');
        expect(payload.count_entity_id).toBeNull();
        expect(payload.count_threshold).toBe(0);
        expect(payload.runtime_entity_id).toBeNull();
        expect(payload.runtime_threshold).toBe(0);
    });

    it('normalizes interval fields for count tasks', () => {
        const payload = taskFormToAddPayload(
            formData({ trigger_type: 'count', count_entity_id: 'switch.x', count_threshold: 60, interval_value: '' }),
            '2026-08-21T07:00:00.000Z',
        );
        expect(payload.interval_value).toBe(1);
        expect(payload.interval_type).toBe('days');
        expect(payload.count_entity_id).toBe('switch.x');
        expect(payload.count_threshold).toBe(60);
    });
});

describe('taskToFormData', () => {
    it('round-trips the anchor date and years interval', () => {
        const task = {
            id: 'tasks_x',
            title: 'Winterize',
            trigger_type: 'date',
            interval_value: 1,
            interval_type: 'years',
            anchor_date: '2026-10-01',
            last_performed: '2026-08-21T00:00:00-07:00',
        } as Task;
        const data = taskToFormData(task, undefined, []);
        expect(data.anchor_date).toBe('2026-10-01');
        expect(data.interval_type).toBe('years');
        expect(data.trigger_type).toBe('date');
    });
});

describe('active months', () => {
    it('sends numeric active_months for seasonal time tasks', () => {
        const payload = taskFormToAddPayload(
            formData({ active_months: ['4', '5', '10'] }),
            '2026-08-21T07:00:00.000Z',
        );
        expect(payload.active_months).toEqual([4, 5, 10]);
    });

    it('omits active_months from add payloads when empty', () => {
        const payload = taskFormToAddPayload(formData(), '2026-08-21T07:00:00.000Z');
        expect(payload.active_months).toBeUndefined();
    });

    it('clears active_months when a task is retyped away from time', () => {
        const updates = taskFormToUpdates(
            formData({ trigger_type: 'date', anchor_date: '2026-10-01', active_months: ['4'] }),
            '2026-08-21T07:00:00.000Z',
        );
        expect(updates.active_months).toEqual([]);
    });

    it('always includes active_months in update payloads so it can be cleared', () => {
        const updates = taskFormToUpdates(
            formData({ active_months: [] }),
            '2026-08-21T07:00:00.000Z',
        );
        expect(updates.active_months).toEqual([]);
    });

    it('round-trips task months into string form values', () => {
        const task = {
            id: 'tasks_x',
            title: 'Mow',
            interval_value: 2,
            interval_type: 'weeks',
            last_performed: '2026-08-21T00:00:00-07:00',
            active_months: [4, 5],
        } as Task;
        expect(taskToFormData(task, undefined, []).active_months).toEqual(['4', '5']);
    });
});

describe('monthOptions', () => {
    it('returns twelve localized month options', () => {
        const options = monthOptions('en');
        expect(options).toHaveLength(12);
        expect(options[0]).toEqual({ value: '1', label: 'January' });
        expect(options[11].label).toBe('December');
        expect(monthOptions('de')[2].label).toBe('März');
    });

    it('falls back to English for unknown locales', () => {
        expect(monthOptions('not-a-locale!')[0].label).toBe('January');
    });
});

describe('fixed-date last_performed default', () => {
    it('omits last_performed for a date task with a blank field', () => {
        const payload = taskFormToAddPayload(
            formData({ trigger_type: 'date', anchor_date: '2026-10-01', last_performed: '' }),
            '2026-08-21T07:00:00.000Z',
        );
        expect('last_performed' in payload).toBe(false);
    });

    it('sends an explicitly chosen date on a date task', () => {
        const payload = taskFormToAddPayload(
            formData({ trigger_type: 'date', anchor_date: '2026-10-01', last_performed: '2026-08-01' }),
            '2026-08-01T07:00:00.000Z',
        );
        expect(payload.last_performed).toBe('2026-08-01T07:00:00.000Z');
    });

    it('keeps the today default for blank time tasks', () => {
        const payload = taskFormToAddPayload(
            formData({ last_performed: '' }),
            '2026-08-21T07:00:00.000Z',
        );
        expect(payload.last_performed).toBe('2026-08-21T07:00:00.000Z');
    });
});
