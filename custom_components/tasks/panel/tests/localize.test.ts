import { describe, expect, it } from 'vitest';

import { localize } from '../localize/localize';
import * as en from '../localize/languages/en.json';

// Every translation file, discovered so a newly added language is covered
// automatically without touching this test.
const languageModules = import.meta.glob('../localize/languages/*.json', { eager: true }) as Record<string, any>;

const deepKeys = (obj: any, prefix = ''): string[] =>
    Object.entries(obj).flatMap(([key, value]) => {
        if (key === 'default') return []; // module namespace artifact
        const path = prefix ? `${prefix}.${key}` : key;
        return value && typeof value === 'object' ? deepKeys(value, path) : [path];
    });

const enKeys = new Set(deepKeys((en as any).default ?? en));

describe('translation files', () => {
    it('found the language files', () => {
        expect(Object.keys(languageModules).length).toBeGreaterThanOrEqual(2);
    });

    for (const [path, module] of Object.entries(languageModules)) {
        const language = path.split('/').pop()!.replace('.json', '');
        it(`${language} has exactly the same keys as en`, () => {
            const keys = new Set(deepKeys((module as any).default ?? module));
            const missing = [...enKeys].filter((key) => !keys.has(key));
            const extra = [...keys].filter((key) => !enKeys.has(key));
            expect(missing, `missing keys in ${language}`).toEqual([]);
            expect(extra, `extra keys in ${language}`).toEqual([]);
        });

        it(`${language} has no empty strings`, () => {
            const empty = deepKeys((module as any).default ?? module).filter((key) => {
                const value = key.split('.').reduce((o: any, part) => o?.[part], (module as any).default ?? module);
                return typeof value === 'string' && value.trim() === '';
            });
            expect(empty).toEqual([]);
        });
    }
});

describe('localize', () => {
    it('resolves a key in the requested language', () => {
        expect(localize('common.cancel', 'en')).toBe('Cancel');
        expect(localize('common.cancel', 'de')).toBe('Abbrechen');
    });

    it('falls back to English for unknown languages', () => {
        expect(localize('common.cancel', 'xx')).toBe('Cancel');
    });

    it('resolves regional variants through the base language', () => {
        expect(localize('common.cancel', 'es-419')).toBe(localize('common.cancel', 'es'));
        expect(localize('common.cancel', 'de-CH')).toBe(localize('common.cancel', 'de'));
    });

    it('resolves a bare base tag to its regional variant', () => {
        expect(localize('common.cancel', 'pt')).toBe(localize('common.cancel', 'pt-BR'));
    });

    it('substitutes placeholders', () => {
        expect(localize('card.add_task.added', 'en', '{title}', 'Gutters')).toBe('"Gutters" added.');
    });

    it('formats plural messages', () => {
        expect(localize('panel.list.days_overdue', 'en', '{count}', 1)).toBe('1 day overdue');
        expect(localize('panel.list.days_overdue', 'en', '{count}', 3)).toBe('3 days overdue');
        expect(localize('panel.list.days_left', 'en', '{count}', 1)).toBe('Due in 1 day');
        expect(localize('panel.list.days_left', 'en', '{count}', 5)).toBe('5 days left');
    });
});
