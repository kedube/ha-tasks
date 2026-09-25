import { describe, expect, it } from 'vitest';

import { csvToTasks, parseCsv, tasksToCsv } from '../src/csv';
import type { Task } from '../src/types';

describe('parseCsv', () => {
    it('parses simple rows and drops blank lines', () => {
        expect(parseCsv('a,b,c\n\n1,2,3\n')).toEqual([
            ['a', 'b', 'c'],
            ['1', '2', '3'],
        ]);
    });

    it('handles quoted fields with commas, quotes, and newlines', () => {
        const text = 'title,description\n"Clean, oil","He said ""go""\nnow"\n';
        expect(parseCsv(text)).toEqual([
            ['title', 'description'],
            ['Clean, oil', 'He said "go"\nnow'],
        ]);
    });

    it('accepts CRLF line endings', () => {
        expect(parseCsv('a,b\r\n1,2\r\n')).toEqual([['a', 'b'], ['1', '2']]);
    });
});

describe('csvToTasks', () => {
    const HEADER = 'title,description,interval_value,interval_type,last_performed,icon,group_id';

    it('maps well-formed rows to tasks', () => {
        const rows = parseCsv(
            `${HEADER}\nReplace filter,MERV 13,90,days,2026-01-15,mdi:air-filter,HVAC\n`,
        );
        const result = csvToTasks(rows);
        expect(result.errors).toEqual([]);
        expect(result.tasks).toEqual([{
            title: 'Replace filter',
            description: 'MERV 13',
            interval_value: 90,
            interval_type: 'days',
            last_performed: '2026-01-15',
            icon: 'mdi:air-filter',
            group_id: 'HVAC',
        }]);
    });

    it('applies defaults for omitted optional columns', () => {
        const result = csvToTasks(parseCsv('title\nJust a title\n'));
        expect(result.tasks).toEqual([{
            title: 'Just a title',
            description: undefined,
            interval_value: 30,
            interval_type: 'days',
            last_performed: undefined,
            icon: undefined,
            group_id: undefined,
        }]);
    });

    it('skips bad rows with line-numbered errors without dropping good ones', () => {
        const rows = parseCsv([
            HEADER,
            ',missing title,30,days,,,',
            'Bad interval,,abc,days,,,',
            'Bad unit,,30,fortnights,,,',
            'Bad date,,30,days,01/15/2026,,',
            'Good,,30,days,,,',
        ].join('\n'));
        const result = csvToTasks(rows);
        expect(result.tasks.map((task) => task.title)).toEqual(['Good']);
        expect(result.errors).toHaveLength(4);
        expect(result.errors[0]).toContain('Line 2');
        expect(result.errors[3]).toContain('YYYY-MM-DD');
    });

    it('requires a title header', () => {
        const result = csvToTasks(parseCsv('name,interval\nX,30\n'));
        expect(result.tasks).toEqual([]);
        expect(result.errors[0]).toContain('title');
    });
});

describe('tasksToCsv', () => {
    it('round-trips through the importer', () => {
        const tasks = [
            {
                id: 'x',
                title: 'Clean, gutters',
                description: 'With "care"',
                interval_value: 6,
                interval_type: 'months',
                last_performed: '2026-08-01T00:00:00-07:00',
                icon: 'mdi:home-roof',
                group_id: 'Exterior',
            },
        ] as Task[];
        const parsed = csvToTasks(parseCsv(tasksToCsv(tasks)));
        expect(parsed.errors).toEqual([]);
        expect(parsed.tasks).toEqual([{
            title: 'Clean, gutters',
            description: 'With "care"',
            interval_value: 6,
            interval_type: 'months',
            last_performed: '2026-08-01',
            icon: 'mdi:home-roof',
            group_id: 'Exterior',
        }]);
    });
});

describe('formula injection', () => {
    it('neutralizes cells starting with formula characters on export', () => {
        const tasks = [
            {
                id: 'x',
                title: '=1+2',
                description: '+SUM(A1:A9)',
                interval_value: 30,
                interval_type: 'days',
                last_performed: '2026-08-01T00:00:00-07:00',
            },
        ] as Task[];
        const lines = tasksToCsv(tasks).split('\r\n');
        expect(lines[1].startsWith("'=1+2")).toBe(true);
        expect(lines[1]).toContain("'+SUM");
    });

    it('leaves ordinary values untouched', () => {
        const tasks = [
            {
                id: 'x',
                title: 'Clean gutters',
                interval_value: 30,
                interval_type: 'days',
                last_performed: '2026-08-01T00:00:00-07:00',
            },
        ] as Task[];
        expect(tasksToCsv(tasks)).toContain('Clean gutters,');
    });
});
