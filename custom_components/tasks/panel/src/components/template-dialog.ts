import { LitElement, html, css, nothing } from "lit";
import { property, state, query } from "lit/decorators.js";
import type { HomeAssistant } from "custom-card-helpers";

import { localize } from '../../localize/localize';
import { commonStyle } from '../styles';
import { dialogFooter } from '../util';
import { computeISODate } from '../schema';
import { formatTimeInterval } from '../compute';
import { saveTask } from '../data/websockets';
import { csvToTasks, parseCsv, CsvTaskRow } from '../csv';
import { TASK_TEMPLATES, TEMPLATE_CATEGORIES, TaskTemplate } from '../templates';

/**
 * Template library + CSV import dialog. Browsing a template fires
 * `template-selected` (the panel prefills the add-task form with it); the
 * CSV tab parses a file, previews it, and creates the tasks directly.
 */
class HMTemplateDialog extends LitElement {
    @property() hass?: HomeAssistant;

    @state() private _open = false;
    @state() private _query = "";
    @state() private _csvRows: CsvTaskRow[] | null = null;
    @state() private _csvErrors: string[] = [];
    @state() private _importing = false;

    @query('input[type="file"]') private _fileInput?: HTMLInputElement;

    public open() {
        this._open = true;
    }

    private _close = () => {
        this._open = false;
        this._query = "";
        this._resetCsv();
    };

    private _resetCsv() {
        this._csvRows = null;
        this._csvErrors = [];
        this._importing = false;
        if (this._fileInput) this._fileInput.value = "";
    }

    private get _filteredTemplates(): TaskTemplate[] {
        const needle = this._query.trim().toLowerCase();
        if (!needle) return TASK_TEMPLATES;
        return TASK_TEMPLATES.filter((template) =>
            `${template.title}\n${template.description}`.toLowerCase().includes(needle));
    }

    private _selectTemplate(template: TaskTemplate) {
        this.dispatchEvent(new CustomEvent('template-selected', {
            detail: { template },
            bubbles: true,
            composed: true,
        }));
        this._close();
    }

    private async _handleFilePicked(ev: Event) {
        const file = (ev.target as HTMLInputElement).files?.[0];
        if (!file) return;
        const text = await file.text();
        const result = csvToTasks(parseCsv(text));
        this._csvRows = result.tasks;
        this._csvErrors = result.errors;
    }

    private async _handleImport() {
        if (!this._csvRows?.length || this._importing) return;
        this._importing = true;
        let created = 0;
        const failures: string[] = [];
        for (const row of this._csvRows) {
            try {
                await saveTask(this.hass!, {
                    title: row.title,
                    interval_value: row.interval_value,
                    interval_type: row.interval_type,
                    trigger_type: "time",
                    last_performed: computeISODate(row.last_performed ?? ""),
                    icon: row.icon || "mdi:calendar-check",
                    ...(row.description ? { description: row.description } : {}),
                    ...(row.group_id ? { group_id: row.group_id } : {}),
                });
                created += 1;
            } catch (e) {
                console.error("Failed to import task:", row.title, e);
                failures.push(row.title);
            }
        }
        this.dispatchEvent(new CustomEvent('csv-imported', {
            detail: { created, failures },
            bubbles: true,
            composed: true,
        }));
        this._close();
    }

    private _renderCsvSection() {
        const lang = this.hass!.language;
        return html`
            <div class="csv-section">
                <div class="csv-actions">
                    <ha-button appearance="plain" size="small" @click=${() => this._fileInput?.click()}>
                        ${localize('panel.dialog.templates.choose_csv', lang)}
                    </ha-button>
                    <input type="file" accept=".csv,text/csv" hidden @change=${this._handleFilePicked} />
                    <span class="csv-hint">${localize('panel.dialog.templates.csv_hint', lang)}</span>
                </div>

                ${this._csvErrors.length ? html`
                    <ul class="csv-errors">
                        ${this._csvErrors.map((error) => html`<li>${error}</li>`)}
                    </ul>
                ` : nothing}

                ${this._csvRows?.length ? html`
                    <div class="csv-preview">
                        <table>
                            <thead>
                                <tr>
                                    <th>${localize('panel.dialog.templates.preview.title', lang)}</th>
                                    <th>${localize('panel.dialog.templates.preview.interval', lang)}</th>
                                    <th>${localize('panel.dialog.templates.preview.last_performed', lang)}</th>
                                    <th>${localize('panel.dialog.templates.preview.group', lang)}</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this._csvRows.map((row) => html`
                                    <tr>
                                        <td>${row.title}</td>
                                        <td>${formatTimeInterval(row.interval_value, row.interval_type, lang)}</td>
                                        <td>${row.last_performed ?? "—"}</td>
                                        <td>${row.group_id ?? "—"}</td>
                                    </tr>
                                `)}
                            </tbody>
                        </table>
                    </div>
                    <ha-button
                        class="import-button"
                        .disabled=${this._importing}
                        @click=${this._handleImport}
                    >
                        ${localize('panel.dialog.templates.import_count', lang, '{count}', this._csvRows.length)}
                    </ha-button>
                ` : this._csvRows !== null && !this._csvErrors.length ? html`
                    <span class="csv-hint">${localize('panel.dialog.templates.csv_empty', lang)}</span>
                ` : nothing}
            </div>
        `;
    }

    render() {
        if (!this.hass || !this._open) return html``;
        const lang = this.hass.language;
        const templates = this._filteredTemplates;

        return html`
            <ha-dialog
                open
                heading="${localize('panel.dialog.templates.title', lang)}"
                header-title="${localize('panel.dialog.templates.title', lang)}"
                @closed=${this._close}
            >
                <input
                    class="search-input"
                    type="search"
                    .value=${this._query}
                    placeholder=${localize('panel.dialog.templates.search', lang)}
                    @input=${(e: InputEvent) => { this._query = (e.target as HTMLInputElement).value; }}
                />

                <div class="template-list">
                    ${TEMPLATE_CATEGORIES.map((category) => {
                        const members = templates.filter((template) => template.category === category);
                        if (!members.length) return nothing;
                        return html`
                            <div class="category-header">
                                ${localize(`templates.categories.${category}`, lang)}
                            </div>
                            ${members.map((template) => html`
                                <button class="template-row" @click=${() => this._selectTemplate(template)}>
                                    <ha-icon .icon=${template.icon}></ha-icon>
                                    <span class="template-text">
                                        <span class="template-title">${template.title}</span>
                                        <span class="template-detail">
                                            ${formatTimeInterval(template.interval_value, template.interval_type, lang)} — ${template.description}
                                        </span>
                                    </span>
                                </button>
                            `)}
                        `;
                    })}
                    ${templates.length === 0 ? html`
                        <span class="csv-hint">${localize('panel.dialog.templates.no_matches', lang)}</span>
                    ` : nothing}
                </div>

                <div class="section-label">${localize('panel.dialog.templates.import_csv', lang)}</div>
                ${this._renderCsvSection()}

                ${dialogFooter(html`
                    <ha-button data-dialog="close" appearance="plain" slot="secondaryAction" @click=${this._close}>
                        ${localize('common.cancel', lang)}
                    </ha-button>
                `)}
            </ha-dialog>
        `;
    }

    static styles = [commonStyle, css`
        ha-dialog {
            --mdc-dialog-min-width: min(720px, 95vw);
        }

        .search-input {
            width: 100%;
            box-sizing: border-box;
            padding: 10px 12px;
            border: 1px solid var(--divider-color);
            border-radius: 8px;
            background: var(--card-background-color);
            color: var(--primary-text-color);
            font: inherit;
        }

        .search-input:focus {
            outline: 2px solid var(--primary-color);
            outline-offset: -1px;
        }

        .template-list {
            max-height: 320px;
            overflow-y: auto;
            margin-top: 8px;
            border: 1px solid var(--divider-color);
            border-radius: 8px;
        }

        .category-header {
            position: sticky;
            top: 0;
            padding: 6px 12px;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            color: var(--secondary-text-color);
            background: var(--secondary-background-color);
        }

        .template-row {
            display: flex;
            gap: 12px;
            align-items: center;
            width: 100%;
            padding: 8px 12px;
            border: none;
            background: none;
            color: var(--primary-text-color);
            text-align: left;
            font: inherit;
            cursor: pointer;
        }

        .template-row:hover {
            background: var(--secondary-background-color);
        }

        .template-row ha-icon {
            color: var(--secondary-text-color);
            flex-shrink: 0;
        }

        .template-text {
            display: flex;
            flex-direction: column;
            min-width: 0;
        }

        .template-detail {
            font-size: 12px;
            color: var(--secondary-text-color);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .section-label {
            font-weight: 500;
            color: var(--secondary-text-color);
            margin: 20px 0 8px;
        }

        .csv-actions {
            display: flex;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
        }

        .csv-hint {
            font-size: 12px;
            color: var(--secondary-text-color);
        }

        .csv-errors {
            margin: 8px 0 0;
            padding-left: 18px;
            font-size: 13px;
            color: var(--error-color, #b71c1c);
        }

        .csv-preview {
            max-height: 200px;
            overflow: auto;
            margin-top: 8px;
            border: 1px solid var(--divider-color);
            border-radius: 8px;
        }

        .csv-preview table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
        }

        .csv-preview th,
        .csv-preview td {
            padding: 6px 10px;
            text-align: left;
            border-bottom: 1px solid var(--divider-color);
            white-space: nowrap;
        }

        .csv-preview th {
            position: sticky;
            top: 0;
            background: var(--secondary-background-color);
        }

        .import-button {
            margin-top: 12px;
        }
    `];
}

if (!customElements.get('hm-template-dialog')) customElements.define('hm-template-dialog', HMTemplateDialog)

declare global {
    interface HTMLElementTagNameMap {
        'hm-template-dialog': HMTemplateDialog;
    }
}

export type { HMTemplateDialog };
