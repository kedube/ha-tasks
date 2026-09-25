import { html, css, TemplateResult } from "lit";
import type { HomeAssistant } from "custom-card-helpers";

import { localize } from '../../localize/localize';

/**
 * Shared task-field rendering for the add form and the edit dialog: every
 * field is a bare ha-selector with a uniform label above the input, so
 * inputs line up horizontally regardless of whether the underlying selector
 * draws its own label inside (text, select, icon) or above (entity, label
 * pickers) the input.
 */

export interface TaskFieldContext {
    hass: HomeAssistant;
    /** Localization prefix, e.g. "panel.cards.new.fields". */
    keyPrefix: string;
    data: Record<string, any>;
    onChange: (name: string, ev: CustomEvent) => void;
}

const fieldText = (ctx: TaskFieldContext, name: string, kind: string, fallback: string): string => {
    try {
        return localize(`${ctx.keyPrefix}.${name}.${kind}`, ctx.hass.language) ?? fallback;
    } catch {
        return fallback;
    }
};

export const renderTaskField = (ctx: TaskFieldContext, field: any): TemplateResult => html`
    <div class="field ${field.name}">
        <div class="field-label">
            ${fieldText(ctx, field.name, 'heading', field.name)}${field.required ? " *" : ""}
        </div>
        <ha-selector
            .hass=${ctx.hass}
            .selector=${field.selector}
            .value=${ctx.data[field.name]}
            .helper=${fieldText(ctx, field.name, 'helper', "")}
            .required=${field.required ?? false}
            @value-changed=${(e: CustomEvent) => ctx.onChange(field.name, e)}
        ></ha-selector>
    </div>
`;

export const taskFieldStyles = css`
    .fields-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
        column-gap: 8px;
        row-gap: 16px;
        align-items: start;
    }

    .field-label {
        font-size: 12px;
        font-weight: 500;
        color: var(--secondary-text-color);
        margin-bottom: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .field ha-selector {
        display: block;
        width: 100%;
    }

    /* Description spans the full line below the other fields. */
    .field.description {
        grid-column: 1 / -1;
    }
`;
