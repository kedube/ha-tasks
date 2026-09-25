import { describe, expect, it } from 'vitest';

import { TASK_TEMPLATES, TEMPLATE_CATEGORIES } from '../src/templates';
import { INTERVAL_TYPES } from '../src/types';
import * as en from '../localize/languages/en.json';

describe('template library', () => {
    it('offers a substantial library', () => {
        expect(TASK_TEMPLATES.length).toBeGreaterThanOrEqual(85);
    });

    it('has unique titles', () => {
        const titles = TASK_TEMPLATES.map((template) => template.title);
        expect(new Set(titles).size).toBe(titles.length);
    });

    it('every template is well-formed', () => {
        for (const template of TASK_TEMPLATES) {
            expect(template.title.length).toBeGreaterThan(0);
            expect(template.description.length).toBeGreaterThan(0);
            expect(template.interval_value).toBeGreaterThanOrEqual(1);
            expect(INTERVAL_TYPES).toContain(template.interval_type);
            expect(template.icon).toMatch(/^mdi:[a-z0-9-]+$/);
            expect(TEMPLATE_CATEGORIES).toContain(template.category);
        }
    });

    it('every category is used and localized', () => {
        const used = new Set(TASK_TEMPLATES.map((template) => template.category));
        const localized = ((en as any).default ?? en).templates.categories;
        for (const category of TEMPLATE_CATEGORIES) {
            expect(used.has(category), `unused category ${category}`).toBe(true);
            expect(localized[category], `missing label for ${category}`).toBeTruthy();
        }
    });
});
