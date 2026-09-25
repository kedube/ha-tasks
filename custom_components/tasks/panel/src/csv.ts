import { INTERVAL_TYPES, IntervalType, Task } from './types';

/**
 * Minimal CSV support for task import/export. Pure and DOM-free so the
 * parsing rules are unit-testable; file reading and downloads live in the
 * components that use this module.
 */

/** Columns understood by the importer; `title` is the only required one. */
const IMPORT_COLUMNS = [
    'title',
    'description',
    'interval_value',
    'interval_type',
    'last_performed',
    'icon',
    'group_id',
] as const;

export interface CsvTaskRow {
    title: string;
    description?: string;
    interval_value: number;
    interval_type: IntervalType;
    last_performed?: string;
    icon?: string;
    group_id?: string;
}

export interface CsvImportResult {
    tasks: CsvTaskRow[];
    /** Human-readable problems, one per skipped row. */
    errors: string[];
}

/**
 * Parse CSV text into rows of fields (RFC-4180 style): quoted fields may
 * contain commas, newlines, and doubled quotes; both \n and \r\n records are
 * accepted. Blank records are dropped.
 */
export const parseCsv = (text: string): string[][] => {
    const rows: string[][] = [];
    let row: string[] = [];
    let field = '';
    let inQuotes = false;
    let i = 0;

    const endField = () => {
        row.push(field);
        field = '';
    };
    const endRow = () => {
        endField();
        // A record of nothing but empty fields is a blank line.
        if (row.some((value) => value.trim() !== '')) rows.push(row);
        row = [];
    };

    while (i < text.length) {
        const char = text[i];
        if (inQuotes) {
            if (char === '"') {
                if (text[i + 1] === '"') {
                    field += '"';
                    i += 2;
                    continue;
                }
                inQuotes = false;
                i += 1;
                continue;
            }
            field += char;
            i += 1;
            continue;
        }
        if (char === '"' && field === '') {
            inQuotes = true;
            i += 1;
            continue;
        }
        if (char === ',') {
            endField();
            i += 1;
            continue;
        }
        if (char === '\n' || char === '\r') {
            if (char === '\r' && text[i + 1] === '\n') i += 1;
            endRow();
            i += 1;
            continue;
        }
        field += char;
        i += 1;
    }
    if (field !== '' || row.length) endRow();
    return rows;
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Interpret parsed CSV rows as importable tasks. The first row must be a
 * header naming at least a `title` column; unknown columns are ignored.
 * Rows with problems are reported in `errors` and skipped, so one bad line
 * never blocks the rest of the file.
 */
export const csvToTasks = (rows: string[][]): CsvImportResult => {
    if (!rows.length) return { tasks: [], errors: ['The file is empty.'] };

    const header = rows[0].map((name) => name.trim().toLowerCase());
    if (!header.includes('title')) {
        return { tasks: [], errors: ['The header row must include a "title" column.'] };
    }

    const tasks: CsvTaskRow[] = [];
    const errors: string[] = [];
    rows.slice(1).forEach((row, index) => {
        const line = index + 2; // 1-based, after the header
        const get = (column: string): string => {
            const at = header.indexOf(column);
            return at >= 0 ? (row[at] ?? '').trim() : '';
        };

        const title = get('title');
        if (!title) {
            errors.push(`Line ${line}: missing title.`);
            return;
        }

        const rawValue = get('interval_value');
        const intervalValue = rawValue === '' ? 30 : Number(rawValue);
        if (!Number.isFinite(intervalValue) || intervalValue < 1) {
            errors.push(`Line ${line}: invalid interval_value "${rawValue}".`);
            return;
        }

        const rawType = get('interval_type').toLowerCase();
        const intervalType = (rawType === '' ? 'days' : rawType) as IntervalType;
        if (!INTERVAL_TYPES.includes(intervalType)) {
            errors.push(`Line ${line}: invalid interval_type "${rawType}".`);
            return;
        }

        const lastPerformed = get('last_performed');
        if (lastPerformed && !DATE_RE.test(lastPerformed)) {
            errors.push(`Line ${line}: last_performed must be YYYY-MM-DD.`);
            return;
        }

        tasks.push({
            title,
            description: get('description') || undefined,
            interval_value: Math.floor(intervalValue),
            interval_type: intervalType,
            last_performed: lastPerformed || undefined,
            icon: get('icon') || undefined,
            group_id: get('group_id') || undefined,
        });
    });
    return { tasks, errors };
};

const escapeField = (value: string): string => {
    // Neutralize spreadsheet formula injection: a cell starting with = + - @
    // or a tab would be evaluated as a formula when the export is opened in
    // Excel/Sheets. The leading apostrophe makes it inert text there; on
    // re-import it rides along harmlessly in the title/description.
    const neutralized = /^[=+\-@\t]/.test(value) ? `'${value}` : value;
    return /[",\n\r]/.test(neutralized)
        ? `"${neutralized.replace(/"/g, '""')}"`
        : neutralized;
};

/** Build export CSV text (import-compatible columns) from the task list. */
export const tasksToCsv = (tasks: Task[]): string => {
    const lines = [IMPORT_COLUMNS.join(',')];
    tasks.forEach((task) => {
        lines.push(
            [
                task.title,
                task.description ?? '',
                String(task.interval_value),
                task.interval_type,
                task.last_performed ? task.last_performed.split('T')[0] : '',
                task.icon ?? '',
                task.group_id ?? '',
            ]
                .map(escapeField)
                .join(','),
        );
    });
    return lines.join('\r\n') + '\r\n';
};
