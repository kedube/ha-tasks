import { LitElement, html, css, nothing } from "lit";
import { property, query, state } from "lit/decorators.js";
import type { HomeAssistant } from "custom-card-helpers";
import { fireEvent } from "custom-card-helpers";

import { localize } from '../localize/localize';
import { loadConfigDashboard } from './helpers';
import { Debouncer } from './compute';
import { loadGroups, subscribeUpdates } from './data/websockets';
import './components/task-form';

/**
 * A Lovelace card wrapping the panel's "Add New Task" form, so tasks can be
 * created from any dashboard. Reuses hm-task-form — the exact form the panel
 * shows — including trigger types, groups, and all optional fields — with
 * the Add Task button in the card's footer. Only admins can create tasks, so
 * other users see a note instead of a form that would fail.
 */

interface CardConfig {
    title?: string;
}

const DEFAULT_CONFIG: CardConfig = {
    title: "Add Task",
};

const RELOAD_DEBOUNCE_MS = 300;

class TasksAddTaskCard extends LitElement {
    @property({ attribute: false }) hass?: HomeAssistant;
    @state() private _config: CardConfig = DEFAULT_CONFIG;
    @state() private _groups: string[] = [];
    @state() private _ready = false;
    @state() private _submitting = false;

    @query('hm-task-form') private _form?: any;

    private _unsubscribe?: () => Promise<void>;
    private _reload = new Debouncer(() => this._loadGroups(), RELOAD_DEBOUNCE_MS);
    private _initialized = false;

    setConfig(config: CardConfig) {
        this._config = { ...DEFAULT_CONFIG, ...config };
    }

    static getConfigElement() {
        return document.createElement("tasks-add-task-card-editor");
    }

    static getStubConfig() {
        return { title: "Add Task" };
    }

    getCardSize() {
        return 6;
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this._reload.cancel();
        this._unsubscribe?.();
        this._unsubscribe = undefined;
        this._initialized = false;
    }

    private get _canAdd(): boolean {
        return !!this.hass?.user?.is_admin;
    }

    updated() {
        if (this.hass && this._canAdd && !this._initialized) {
            this._initialized = true;
            this._initialize();
        }
    }

    private async _initialize() {
        // Dashboards don't ship ha-form and friends by default; load the
        // config panel's components the same way the sidebar panel does.
        await loadConfigDashboard();
        this._ready = true;
        await this._loadGroups();
        try {
            this._unsubscribe = await subscribeUpdates(this.hass!, () => this._reload.schedule());
        } catch (e) {
            console.error("Failed to subscribe to task updates:", e);
        }
    }

    private async _loadGroups() {
        if (!this.hass) return;
        try {
            this._groups = await loadGroups(this.hass);
        } catch {
            // Integration may not be loaded yet
        }
    }

    private async _submit() {
        // A second click while the first add is in flight would duplicate the task.
        if (this._submitting) return;
        this._submitting = true;
        try {
            await this._form?.submit();
        } finally {
            this._submitting = false;
        }
    }

    private _handleTaskAdded(e: CustomEvent) {
        fireEvent(this, "hass-notification" as any, {
            message: localize(
                'card.add_task.added', this.hass!.language,
                '{title}', e.detail?.title ?? '',
            ),
        });
    }

    render() {
        if (!this.hass) return html``;
        const lang = this.hass.language;

        return html`
            <ha-card>
                ${this._config.title ? html`
                    <h1 class="card-header">${this._config.title}</h1>
                ` : nothing}
                ${this._canAdd ? this._renderForm() : html`
                    <div class="card-content note">
                        <ha-icon icon="mdi:lock-outline"></ha-icon>
                        <span>${localize('card.add_task.admin_only', lang)}</span>
                    </div>
                `}
            </ha-card>
        `;
    }

    private _renderForm() {
        const lang = this.hass!.language;
        if (!this._ready) {
            return html`<div class="card-content"><p>${localize('common.loading', lang)}</p></div>`;
        }
        return html`
            <div class="card-content">
                <hm-task-form
                    .hass=${this.hass}
                    .groups=${this._groups}
                    @task-added=${this._handleTaskAdded}
                ></hm-task-form>
            </div>
            <div class="card-actions">
                <ha-button class="submit-button" ?disabled=${this._submitting} @click=${this._submit}>
                    ${localize('panel.cards.new.actions.add_task', lang)}
                </ha-button>
            </div>
        `;
    }

    static styles = css`
        .card-header {
            font-size: 18px;
            font-weight: 500;
            padding: 12px 16px 0;
            margin: 0;
            color: var(--primary-text-color);
        }

        .card-content {
            padding: 8px 16px 2px;
        }

        /* Home Assistant's card footer: a divider, then the action on the right. */
        .card-actions {
            display: flex;
            justify-content: flex-end;
            padding: 8px 12px;
            border-top: 1px solid var(--divider-color);
        }

        .note {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px 16px;
            color: var(--secondary-text-color);
        }
    `;
}

// --- Config editor ---
class TasksAddTaskCardEditor extends LitElement {
    @property({ attribute: false }) hass?: HomeAssistant;
    @state() private _config: CardConfig = DEFAULT_CONFIG;

    setConfig(config: CardConfig) {
        this._config = { ...DEFAULT_CONFIG, ...config };
    }

    private _valueChanged(ev: CustomEvent) {
        ev.stopPropagation();
        this._config = { ...this._config, ...ev.detail.value };
        this.dispatchEvent(new CustomEvent("config-changed", {
            detail: { config: this._config },
            bubbles: true,
            composed: true,
        }));
    }

    render() {
        return html`
            <ha-form
                .hass=${this.hass}
                .data=${this._config}
                .schema=${[{ name: "title", selector: { text: {} } }]}
                .computeLabel=${() => "Title (empty for none)"}
                @value-changed=${(e: CustomEvent) => this._valueChanged(e)}
            ></ha-form>
        `;
    }
}

if (!customElements.get("tasks-add-task-card")) {
    customElements.define("tasks-add-task-card", TasksAddTaskCard);
}
if (!customElements.get("tasks-add-task-card-editor")) {
    customElements.define("tasks-add-task-card-editor", TasksAddTaskCardEditor);
}

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
    type: "tasks-add-task-card",
    name: "Tasks: Add Task",
    description: "Create tasks from a dashboard — the Tasks panel's full add-task form, including trigger types, groups, and optional fields",
    preview: false,
});
