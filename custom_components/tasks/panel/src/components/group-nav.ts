import { LitElement, html, css, nothing, TemplateResult } from "lit";
import { property, query, state } from "lit/decorators.js";
import type { HomeAssistant } from "custom-card-helpers";

import { localize } from '../../localize/localize';
import { baseStyles } from '../styles';
import { showToast } from '../toast';
import { TaskStatus, attentionByGroup, computeTaskSchedule } from '../compute';
import { Task } from '../types';
import { createGroup, deleteGroup, renameGroup } from '../data/websockets';
import './confirm-dialog';
import type { HMConfirmDialog } from './confirm-dialog';

interface GroupStats {
    total: Map<string, number>;
    attention: Map<string, { count: number; status: TaskStatus }>;
}

/**
 * The panel's group sidebar: navigation (All tasks, each group, Ungrouped —
 * with task counts and attention badges) and group management in one place.
 * "+" creates a group inline; "Edit" switches the rows to rename / delete.
 * Selecting fires `group-selected` ({ group: null | "" | name }). Mutations
 * reach the panel through the backend's subscribe_updates push channel.
 *
 * With `manageOnly` (the narrow-layout dialog) it drops the navigation rows
 * and opens straight into edit mode; with `readonly` (non-admin users) it is
 * navigation only.
 */
class HMGroupNav extends LitElement {
    @property({ attribute: false }) hass?: HomeAssistant;
    @property({ attribute: false }) groups: string[] = [];
    @property({ attribute: false }) tasks: Task[] = [];
    @property({ type: Number }) dueSoonDays = 14;
    /** Selected group: null = all tasks, "" = ungrouped. */
    @property({ attribute: false }) selected: string | null = null;
    @property({ type: Boolean }) manageOnly = false;
    @property({ type: Boolean }) readonly = false;

    @state() private _editing = false;
    @state() private _creating = false;
    @state() private _newName = "";
    @state() private _renaming: string | null = null;
    @state() private _renameValue = "";

    @query('hm-confirm-dialog') private _confirmDialog?: HMConfirmDialog;
    @query('.nav-input') private _input?: HTMLInputElement;

    private get _isEditing(): boolean {
        return this.manageOnly || this._editing;
    }

    private _statsCache?: { tasks: Task[]; dueSoonDays: number; stats: GroupStats };

    private get _stats(): GroupStats {
        const cache = this._statsCache;
        if (cache && cache.tasks === this.tasks && cache.dueSoonDays === this.dueSoonDays) {
            return cache.stats;
        }
        const groupOf = (task: Task) => task.group_id?.trim() || "";
        const total = new Map<string, number>();
        this.tasks.forEach((task) => total.set(groupOf(task), (total.get(groupOf(task)) ?? 0) + 1));
        const schedules = this.tasks.map((task) => ({ task, ...computeTaskSchedule(task, this.dueSoonDays) }));
        const attention = attentionByGroup(schedules, (entry) => groupOf(entry.task));
        const stats = { total, attention };
        this._statsCache = { tasks: this.tasks, dueSoonDays: this.dueSoonDays, stats };
        return stats;
    }

    private _select(group: string | null) {
        this.dispatchEvent(new CustomEvent('group-selected', {
            detail: { group }, bubbles: true, composed: true,
        }));
    }

    private async _focusInput() {
        await this.updateComplete;
        this._input?.focus();
        this._input?.select();
    }

    // --- Create ---

    private _startCreate() {
        this._creating = true;
        this._newName = "";
        this._focusInput();
    }

    private async _commitCreate() {
        const groupId = this._newName.trim();
        if (!groupId) {
            this._creating = false;
            return;
        }
        if (this.groups.includes(groupId)) {
            showToast(this, localize('panel.cards.groups.alerts.exists', this.hass!.language, '{title}', groupId));
            return;
        }
        try {
            await createGroup(this.hass!, groupId);
            this._newName = "";
            this._creating = this.manageOnly;
        } catch (e) {
            console.error("Failed to create group:", e);
            showToast(this, localize('panel.cards.groups.alerts.error', this.hass!.language));
        }
    }

    // --- Rename ---

    private _startRename(groupId: string) {
        this._renaming = groupId;
        this._renameValue = groupId;
        this._focusInput();
    }

    private async _commitRename() {
        const oldGroup = this._renaming;
        const newGroup = this._renameValue.trim();
        if (!oldGroup || !newGroup || oldGroup === newGroup) {
            this._renaming = null;
            return;
        }
        if (this.groups.includes(newGroup)) {
            // Renaming onto an existing group would merge them; the backend
            // rejects it, so surface the conflict without closing the editor.
            showToast(this, localize('panel.cards.groups.alerts.exists', this.hass!.language, '{title}', newGroup));
            return;
        }
        this._renaming = null;
        try {
            await renameGroup(this.hass!, oldGroup, newGroup);
            // Keep the renamed group selected rather than dropping to "All".
            if (this.selected === oldGroup) this._select(newGroup);
        } catch (e) {
            console.error("Failed to rename group:", e);
            showToast(this, localize('panel.cards.groups.alerts.rename_error', this.hass!.language));
        }
    }

    // --- Delete ---

    private _confirmDelete(groupId: string) {
        const lang = this.hass!.language;
        this._confirmDialog?.open({
            heading: localize('panel.cards.groups.confirm_delete_title', lang),
            message: localize('panel.cards.groups.confirm_delete', lang, '{title}', groupId),
            confirmLabel: localize('panel.cards.groups.actions.delete', lang),
            cancelLabel: localize('common.cancel', lang),
            destructive: true,
            onConfirm: async () => {
                try {
                    await deleteGroup(this.hass!, groupId);
                    if (this.selected === groupId) this._select(null);
                } catch (e) {
                    console.error("Failed to delete group:", e);
                    showToast(this, localize('panel.cards.groups.alerts.delete_error', this.hass!.language));
                }
            },
        });
    }

    private _onInputKeydown(e: KeyboardEvent, commit: () => void, cancel: () => void) {
        if (e.key === "Enter") commit();
        else if (e.key === "Escape") {
            e.stopPropagation();
            cancel();
        }
    }

    // --- Render ---

    render() {
        if (!this.hass) return html``;
        const lang = this.hass.language;
        const { total } = this._stats;
        const ungrouped = total.get("") ?? 0;
        const editing = this._isEditing;

        return html`
            ${this.manageOnly ? nothing : this._renderItem(
                null, localize('panel.nav.all_tasks', lang), "mdi:format-list-checks", this.tasks.length,
            )}

            ${this.readonly && !this.groups.length ? nothing : html`
                <div class="nav-heading">
                    <span>${localize('panel.cards.groups.title', lang)}</span>
                    <span class="spacer"></span>
                    ${this.readonly ? nothing : html`
                        <button
                            class="icon-button small"
                            @click=${this._startCreate}
                            title=${localize('panel.cards.groups.fields.new_group.heading', lang)}
                            aria-label=${localize('panel.cards.groups.fields.new_group.heading', lang)}
                        >
                            <ha-icon icon="mdi:plus"></ha-icon>
                        </button>
                    `}
                    ${this.readonly || this.manageOnly || !this.groups.length ? nothing : html`
                        <button class="text-button" @click=${() => { this._editing = !this._editing; this._renaming = null; }}>
                            ${localize(editing ? 'panel.nav.done_editing' : 'panel.cards.current.actions.edit', lang)}
                        </button>
                    `}
                </div>
            `}

            ${this.groups.map((group) => editing
                ? this._renderEditableItem(group)
                : this._renderItem(group, group, "mdi:folder-outline", total.get(group) ?? 0))}

            ${this._creating || (this.manageOnly && !this.groups.length) ? html`
                <div class="nav-item editing">
                    <ha-icon icon="mdi:folder-plus-outline"></ha-icon>
                    <input
                        class="nav-input"
                        .value=${this._newName}
                        placeholder=${localize('panel.cards.groups.fields.new_group.heading', lang)}
                        aria-label=${localize('panel.cards.groups.fields.new_group.heading', lang)}
                        @input=${(e: Event) => this._newName = (e.target as HTMLInputElement).value}
                        @keydown=${(e: KeyboardEvent) => this._onInputKeydown(
                            e, () => this._commitCreate(), () => { this._creating = false; },
                        )}
                        @blur=${() => { if (!this._newName.trim() && !this.manageOnly) this._creating = false; }}
                    />
                    <button
                        class="icon-button small"
                        @click=${this._commitCreate}
                        title=${localize('panel.cards.groups.actions.create', lang)}
                        aria-label=${localize('panel.cards.groups.actions.create', lang)}
                    >
                        <ha-icon icon="mdi:check"></ha-icon>
                    </button>
                </div>
            ` : nothing}

            ${!this.groups.length && !this._creating && !this.manageOnly && !this.readonly ? html`
                <p class="empty">${localize('panel.cards.groups.empty', lang)}</p>
            ` : nothing}

            ${!this.manageOnly && ungrouped && this.groups.length ? this._renderItem(
                "", localize('common.ungrouped', lang), "mdi:folder-hidden", ungrouped,
            ) : nothing}

            <hm-confirm-dialog></hm-confirm-dialog>
        `;
    }

    private _renderItem(group: string | null, label: string, icon: string, count: number): TemplateResult {
        const selected = this.selected === group;
        const attention = group === null ? this._totalAttention() : this._stats.attention.get(group);
        return html`
            <button
                class="nav-item ${selected ? "selected" : ""}"
                aria-current=${selected ? "true" : "false"}
                ?disabled=${this._isEditing}
                @click=${() => this._select(group)}
            >
                <ha-icon .icon=${selected && icon === "mdi:folder-outline" ? "mdi:folder" : icon}></ha-icon>
                <span class="nav-label">${label}</span>
                ${attention ? html`<span class="chip-badge ${attention.status}">${attention.count}</span>` : nothing}
                <span class="nav-count">${count}</span>
            </button>
        `;
    }

    private _renderEditableItem(group: string): TemplateResult {
        const lang = this.hass!.language;
        return html`
            <div class="nav-item editing">
                <ha-icon icon="mdi:folder-outline"></ha-icon>
                ${this._renaming === group ? html`
                    <input
                        class="nav-input"
                        .value=${this._renameValue}
                        aria-label=${localize('panel.cards.groups.actions.rename', lang)}
                        @input=${(e: Event) => this._renameValue = (e.target as HTMLInputElement).value}
                        @keydown=${(e: KeyboardEvent) => this._onInputKeydown(
                            e, () => this._commitRename(), () => { this._renaming = null; },
                        )}
                    />
                    <button
                        class="icon-button small"
                        @click=${this._commitRename}
                        title=${localize('panel.cards.groups.actions.save', lang)}
                        aria-label=${localize('panel.cards.groups.actions.save', lang)}
                    >
                        <ha-icon icon="mdi:check"></ha-icon>
                    </button>
                ` : html`
                    <span class="nav-label">${group}</span>
                    <button
                        class="icon-button small"
                        @click=${() => this._startRename(group)}
                        title=${localize('panel.cards.groups.actions.rename', lang)}
                        aria-label=${`${localize('panel.cards.groups.actions.rename', lang)}: ${group}`}
                    >
                        <ha-icon icon="mdi:pencil-outline"></ha-icon>
                    </button>
                    <button
                        class="icon-button small danger"
                        @click=${() => this._confirmDelete(group)}
                        title=${localize('panel.cards.groups.actions.delete', lang)}
                        aria-label=${`${localize('panel.cards.groups.actions.delete', lang)}: ${group}`}
                    >
                        <ha-icon icon="mdi:delete-outline"></ha-icon>
                    </button>
                `}
            </div>
        `;
    }

    /** Attention across every group, for the "All tasks" row. */
    private _totalAttention(): { count: number; status: TaskStatus } | undefined {
        let count = 0;
        let status: TaskStatus = "due_soon";
        this._stats.attention.forEach((entry) => {
            count += entry.count;
            if (entry.status === "overdue") status = "overdue";
        });
        return count ? { count, status } : undefined;
    }

    static styles = [baseStyles, css`
        :host {
            display: block;
        }

        .nav-item {
            display: flex;
            align-items: center;
            gap: 12px;
            width: 100%;
            min-height: 40px;
            padding: 0 10px 0 12px;
            box-sizing: border-box;
            border-radius: 10px;
            font-size: 14px;
            font-weight: 500;
            color: var(--primary-text-color);
            text-align: left;
            transition: background-color 0.15s;
            --mdc-icon-size: 20px;
        }

        .nav-item ha-icon {
            flex-shrink: 0;
            color: var(--secondary-text-color);
        }

        button.nav-item:hover:not(:disabled) {
            background: var(--hm-subtle);
        }

        button.nav-item:disabled {
            cursor: default;
            opacity: 0.6;
        }

        .nav-item.selected {
            background: color-mix(in srgb, var(--primary-color) 14%, transparent);
            color: color-mix(in srgb, var(--primary-color) 80%, var(--primary-text-color));
        }

        .nav-item.selected ha-icon {
            color: inherit;
        }

        .nav-item.editing {
            padding-right: 4px;
        }

        .nav-label {
            flex: 1;
            min-width: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .nav-count {
            min-width: 16px;
            text-align: right;
            font-size: 12px;
            color: var(--secondary-text-color);
            font-variant-numeric: tabular-nums;
        }

        .nav-heading {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 14px 4px 4px 12px;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            color: var(--secondary-text-color);
        }

        .spacer {
            flex: 1;
        }

        .text-button {
            height: 28px;
            padding: 0 10px;
            border-radius: 14px;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0;
            text-transform: none;
            color: var(--primary-color);
        }

        .text-button:hover {
            background: color-mix(in srgb, var(--primary-color) 10%, transparent);
        }

        .nav-input {
            flex: 1;
            min-width: 0;
            height: 32px;
            padding: 0 10px;
            box-sizing: border-box;
            border: 1px solid var(--primary-color);
            border-radius: 8px;
            background: var(--card-background-color, transparent);
            color: var(--primary-text-color);
            font: inherit;
            font-size: 14px;
            outline: none;
        }

        .icon-button.danger:hover {
            color: var(--todo-overdue);
            background: color-mix(in srgb, var(--todo-overdue) 10%, transparent);
        }

        .empty {
            margin: 4px 12px 8px;
            font-size: 13px;
            line-height: 1.4;
            color: var(--secondary-text-color);
        }
    `];
}

if (!customElements.get('hm-group-nav')) customElements.define('hm-group-nav', HMGroupNav);

declare global {
    interface HTMLElementTagNameMap {
        'hm-group-nav': HMGroupNav;
    }
}
