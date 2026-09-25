import { css, html, nothing, TemplateResult } from "lit";
import type { HomeAssistant } from "custom-card-helpers";
import { formatDateNumeric } from "custom-card-helpers";

import { parseStoredDate } from './compute';
import { HistoryEntry } from './types';

/**
 * DOM- and HA-dependent helpers. Pure task computations live in compute.ts
 * (unit-tested in plain Node); this module holds everything that renders or
 * talks to the frontend runtime.
 */

/** Sorted "notify.<service>" ids from the frontend's service registry. */
export const listNotifyServices = (hass: HomeAssistant): string[] =>
    Object.keys(hass.services?.notify ?? {})
        .filter((service) => service !== "notify")
        .map((service) => `notify.${service}`)
        .sort((a, b) => a.localeCompare(b));

/**
 * Newer HA slots dialog buttons through ha-dialog-footer; older HA expects
 * them slotted directly. Render whichever this frontend supports.
 */
export const dialogFooter = (buttons: TemplateResult): TemplateResult =>
    customElements.get("ha-dialog-footer")
        ? html`<ha-dialog-footer slot="footer">${buttons}</ha-dialog-footer>`
        : buttons;

/**
 * The completion-history list ("8/21/2026 — note" items, newest first),
 * shared by the edit dialog and the task list's expanded view. Pair with
 * historyStyles in the consuming component's styles. `formatDate` overrides
 * the numeric date format (the task list uses short month names).
 */
export const renderHistoryList = (
    history: HistoryEntry[] | undefined,
    count: number,
    locale: HomeAssistant["locale"],
    formatDate: (date: Date) => string = (date) => formatDateNumeric(date, locale),
): TemplateResult | typeof nothing => {
    if (!history?.length) return nothing;
    return html`
        <ul class="history-list">
            ${history.slice(-count).reverse().map((entry) => html`
                <li>
                    ${formatDate(parseStoredDate(entry.performed))}${entry.note ? html` — <span class="history-note">${entry.note}</span>` : nothing}
                </li>
            `)}
        </ul>
    `;
};

export const historyStyles = css`
    .history-list {
        margin: 0;
        padding-left: 18px;
        font-size: 14px;
    }

    /* Wrap a long (uncapped) history list so the dialog doesn't grow. */
    .history-scroll {
        max-height: 180px;
        overflow-y: auto;
    }

    .history-list li {
        margin: 2px 0;
    }

    .history-note {
        color: var(--secondary-text-color);
    }
`;
