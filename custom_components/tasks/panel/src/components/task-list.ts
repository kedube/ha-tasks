import { LitElement, html, svg, css, nothing, TemplateResult } from "lit";
import { property, query, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import type { HomeAssistant } from "custom-card-helpers";

import { localize } from '../../localize/localize';
import {
    DisplayBucket,
    StatusBuckets,
    TaskSchedule,
    TaskStatus,
    attentionByGroup,
    bucketTasksByStatus,
    computeDueProgress,
    computeTaskSchedule,
    displayBucket,
    filterTasks,
    formatDaysLabel,
    formatProgress,
    formatTriggerInterval,
    isDatedTrigger,
    parseStoredDate,
    sectionTasksByGroup,
} from '../compute';
import { historyStyles, renderHistoryList } from '../util';
import { baseStyles } from '../styles';
import { Label, Task } from '../types';
import { confirmCompleteTask, confirmRemoveTask } from './task-actions';
import './confirm-dialog';
import type { HMConfirmDialog } from './confirm-dialog';

/**
 * The panel's task list, laid out around the "what needs doing?" workflow:
 * a status header and summary tiles (which filter the list), group chips
 * flagged with what needs attention, and one row per task with a progress
 * ring, a relative due label, and a single complete action. Tapping a row
 * reveals its details and the rarer actions.
 *
 * The panel owns data loading and the group filter. Completing and removing
 * run the shared confirm flows in here; edit and move are dispatched as
 * `task-edit` / `task-move` events for the panel's dialogs.
 */

/** Where search lives: behind a header toggle, or as a field in the header. */
export type SearchMode = "toggle" | "header";
export type GroupBy = "status" | "group";

interface ComputedTask extends TaskSchedule {
    raw: Task;
}

interface Section {
    /** Collapse-state key, unique across both group-by modes. */
    key: string;
    /** Status bucket for status sections; "group" for task-group sections. */
    tone: DisplayBucket | "group";
    label: string;
    tasks: ComputedTask[];
    attention?: { count: number; status: TaskStatus };
}

interface ListView {
    /** Uncapped bucket sizes for the current search and group. */
    counts: Record<DisplayBucket, number>;
    sections: Section[];
    groupAttention: Map<string, { count: number; status: TaskStatus }>;
}

const HISTORY_ENTRIES = 3;

// Display order, bucket key, heading, and summary tile icon per status.
const STATUS_SECTIONS: { bucket: DisplayBucket; key: keyof StatusBuckets<unknown>; label: string; icon: string }[] = [
    { bucket: "overdue", key: "overdue", label: "panel.list.overdue", icon: "mdi:alert-circle-outline" },
    { bucket: "due_soon", key: "dueSoon", label: "panel.list.due_soon", icon: "mdi:clock-alert-outline" },
    { bucket: "upcoming", key: "upcoming", label: "panel.list.upcoming", icon: "mdi:calendar-check-outline" },
    { bucket: "done", key: "done", label: "panel.list.done_today", icon: "mdi:check-circle-outline" },
];

// Fallback row icons for tasks without one, by trigger type.
const TRIGGER_ICONS: Record<string, string> = {
    time: "mdi:calendar-refresh",
    date: "mdi:calendar-star",
    count: "mdi:counter",
    runtime: "mdi:timer-cog-outline",
};

// Progress ring geometry (40px box, 3px stroke).
const RING_RADIUS = 17;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const groupOf = (task: ComputedTask) => task.raw.group_id?.trim() || "";
const titleOf = (task: ComputedTask) => task.raw.title;

/** A label's color as CSS: theme color names map to HA's --<name>-color. */
const labelColor = (color?: string): string | undefined =>
    color && /^[a-z-]+$/.test(color) ? `var(--${color}-color)` : color;

export class HMTaskList extends LitElement {
    @property({ attribute: false }) hass?: HomeAssistant;
    @property({ attribute: false }) tasks: Task[] = [];
    @property({ attribute: false }) groups: string[] = [];
    @property() heading = "";
    @property({ type: Number }) dueSoonDays = 14;
    @property() searchMode: SearchMode = "toggle";
    /** Group chips above the list (narrow layouts, where the sidebar is hidden). */
    @property({ type: Boolean }) showGroupChips = true;
    /** Selected group: null = all, "" = ungrouped. Fires group-filter-changed. */
    @property({ attribute: false }) groupFilter: string | null = null;
    /** Fires group-by-changed when the segmented control changes it. */
    @property() groupBy: GroupBy = "status";
    /** Labels per task id, shown in the details. */
    @property({ attribute: false }) labelsByTask?: Map<string, Label[]>;
    /** View and complete only: hides edit, move, and remove (non-admin users). */
    @property({ type: Boolean }) readonly = false;

    @state() private _completing: Set<string> = new Set();
    @state() private _expandedTasks: Set<string> = new Set();
    @state() private _collapsed: Set<string> = new Set();
    @state() private _searchQuery = "";
    @state() private _searchOpen = false;
    @state() private _statusFilter: TaskStatus | "" = "";

    @query('hm-confirm-dialog') private _confirmDialog?: HMConfirmDialog;
    @query('.search input') private _searchInput?: HTMLInputElement;

    // --- Compute ---

    private get _hasUngrouped(): boolean {
        return this.tasks.some((task) => !task.group_id?.trim());
    }

    /** The selected group if it still exists (null = all). */
    private get _activeGroup(): string | null {
        const group = this.groupFilter;
        if (group === null) return null;
        if (group === "") return this._hasUngrouped ? "" : null;
        return this.groups.includes(group) ? group : null;
    }

    // `hass` is a reactive property, so render() re-runs on every Home
    // Assistant state change — not just ours. Computing, filtering and
    // sorting the whole list each time is wasted work when none of the
    // inputs moved, so cache on their identities.
    private _viewCache?: { deps: unknown[]; view: ListView };

    private get _view(): ListView {
        const lang = this.hass?.language ?? "en";
        const deps = [
            this.tasks, this.groups, this._searchQuery, this.groupFilter,
            this._statusFilter, this.dueSoonDays, this.groupBy, lang,
        ];
        const cache = this._viewCache;
        if (cache && cache.deps.every((dep, i) => dep === deps[i])) return cache.view;

        const searched: ComputedTask[] = filterTasks(this.tasks, [], this._searchQuery, [])
            .map((task) => ({ raw: task, ...computeTaskSchedule(task, this.dueSoonDays) }));

        // Chip badges count across all groups, so they're taken before the
        // group filter; the summary counts reflect the selected group.
        const groupAttention = attentionByGroup(searched, groupOf);
        const group = this._activeGroup;
        const scoped = group === null ? searched : searched.filter((task) => groupOf(task) === group);
        const all = bucketTasksByStatus(scoped, titleOf, lang);
        const counts = {
            overdue: all.overdue.length,
            due_soon: all.dueSoon.length,
            upcoming: all.upcoming.length,
            done: all.done.length,
        };

        let sections: Section[];
        if (this.groupBy === "group") {
            const rows = this._statusFilter
                ? scoped.filter((task) => displayBucket(task) === this._statusFilter)
                : scoped;
            sections = sectionTasksByGroup(rows, groupOf, titleOf, lang).map(({ group: name, tasks }) => ({
                key: `group:${name}`,
                tone: "group",
                label: name || localize('common.ungrouped', lang),
                tasks,
                attention: groupAttention.get(name),
            }));
        } else {
            let filtered = all;
            if (this._statusFilter) {
                const key = STATUS_SECTIONS.find((s) => s.bucket === this._statusFilter)!.key;
                filtered = { overdue: [], dueSoon: [], upcoming: [], done: [], [key]: all[key] };
            }
            sections = STATUS_SECTIONS
                .map(({ bucket, key, label }) => ({
                    key: `status:${bucket}`,
                    tone: bucket,
                    label: localize(label, lang),
                    tasks: filtered[key],
                }))
                .filter((section) => section.tasks.length > 0);
        }

        const view: ListView = { counts, sections, groupAttention };
        this._viewCache = { deps, view };
        return view;
    }

    // --- Helpers ---

    private _dateFormats?: { lang: string; short: Intl.DateTimeFormat; withYear: Intl.DateTimeFormat };

    /** "Sep 15", or "Jan 9, 2027" outside the current year. */
    private _formatDate = (date: Date): string => {
        const lang = this.hass?.locale?.language ?? this.hass?.language ?? "en";
        if (this._dateFormats?.lang !== lang) {
            let locale: string | undefined = lang;
            try {
                new Intl.DateTimeFormat(locale);
            } catch {
                locale = undefined;
            }
            this._dateFormats = {
                lang,
                short: new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }),
                withYear: new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", year: "numeric" }),
            };
        }
        const format = date.getFullYear() === new Date().getFullYear()
            ? this._dateFormats.short
            : this._dateFormats.withYear;
        return format.format(date);
    };

    private _fire(type: string, detail: Record<string, unknown>) {
        this.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
    }

    // --- Actions ---

    private _completeTask(task: Task) {
        if (this._completing.has(task.id)) return;
        // Wrap the shared action to drive the per-task in-flight state.
        confirmCompleteTask(this, this._confirmDialog, this.hass!, task, async (action) => {
            this._completing = new Set(this._completing).add(task.id);
            try {
                await action();
            } finally {
                const after = new Set(this._completing);
                after.delete(task.id);
                this._completing = after;
            }
        });
    }

    private _removeTask(taskId: string) {
        const task = this.tasks.find((t) => t.id === taskId);
        confirmRemoveTask(this, this._confirmDialog, this.hass!, task, taskId);
    }

    private _toggleExpand(taskId: string) {
        const next = new Set(this._expandedTasks);
        if (next.has(taskId)) next.delete(taskId);
        else next.add(taskId);
        this._expandedTasks = next;
    }

    private _toggleSection(key: string) {
        const next = new Set(this._collapsed);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        this._collapsed = next;
    }

    private _toggleStatusFilter(status: TaskStatus) {
        this._statusFilter = this._statusFilter === status ? "" : status;
        const key = `status:${status}`;
        if (this._collapsed.has(key)) {
            const next = new Set(this._collapsed);
            next.delete(key);
            this._collapsed = next;
        }
    }

    private _setGroupFilter(group: string | null) {
        this.groupFilter = group;
        this._fire('group-filter-changed', { group });
    }

    private _setGroupBy(groupBy: GroupBy) {
        if (this.groupBy === groupBy) return;
        this.groupBy = groupBy;
        this._fire('group-by-changed', { groupBy });
    }

    private async _toggleSearch() {
        if (this._searchOpen) {
            this._searchOpen = false;
            this._searchQuery = "";
            return;
        }
        this._searchOpen = true;
        await this.updateComplete;
        this._searchInput?.focus();
    }

    private _onSearchKeydown(e: KeyboardEvent) {
        if (e.key !== "Escape") return;
        this._searchQuery = "";
        if (this.searchMode === "toggle") this._searchOpen = false;
    }

    // --- Render ---

    render() {
        if (!this.hass) return html``;
        const lang = this.hass.language;
        const view = this._view;
        const searchRowVisible = this.searchMode === "toggle" && (this._searchOpen || !!this._searchQuery);
        const chipsVisible = this.showGroupChips && this.groups.length > 0;
        const totalShown = view.sections.reduce((sum, section) => sum + section.tasks.length, 0);

        return html`
            ${this._renderHeader(view.counts, searchRowVisible)}
            ${searchRowVisible ? html`<div class="search-row">${this._renderSearchField()}</div>` : nothing}
            ${this._renderSummary(view.counts)}
            ${chipsVisible ? this._renderGroupChips(view) : nothing}
            ${this._renderToolbar()}

            <div class="task-list">
                ${repeat(view.sections, (section) => section.key, (section) => this._renderSection(section))}

                ${totalShown === 0 ? html`
                    <div class="empty">
                        <ha-icon icon="mdi:clipboard-check-outline"></ha-icon>
                        <span>${localize('panel.list.no_tasks', lang)}</span>
                    </div>
                ` : nothing}
            </div>

            <hm-confirm-dialog></hm-confirm-dialog>
        `;
    }

    private _renderHeader(counts: ListView["counts"], searchRowVisible: boolean): TemplateResult {
        const lang = this.hass!.language;
        const attention = counts.overdue + counts.due_soon;
        const tone = counts.overdue ? "overdue" : counts.due_soon ? "due_soon" : "done";
        return html`
            <div class="header">
                <div class="header-icon ${tone}">
                    <ha-icon icon=${attention ? "mdi:clipboard-text-clock-outline" : "mdi:check-decagram-outline"}></ha-icon>
                </div>
                <div class="header-text">
                    <div class="title">${this.heading}</div>
                    <div class="subtitle ${tone}">
                        ${attention
                            ? localize('panel.list.needs_attention', lang, '{count}', attention)
                            : localize('panel.list.all_caught_up', lang)}
                    </div>
                </div>
                ${this.searchMode === "header" ? html`
                    <div class="header-search">${this._renderSearchField()}</div>
                ` : html`
                    <button
                        class="icon-button ${searchRowVisible ? "active" : ""}"
                        @click=${this._toggleSearch}
                        title=${localize('panel.list.search', lang)}
                        aria-label=${localize('panel.list.search', lang)}
                        aria-pressed=${searchRowVisible ? "true" : "false"}
                    >
                        <ha-icon icon="mdi:magnify"></ha-icon>
                    </button>
                `}
            </div>
        `;
    }

    private _renderSearchField(): TemplateResult {
        const lang = this.hass!.language;
        return html`
            <div class="search">
                <ha-icon icon="mdi:magnify"></ha-icon>
                <input
                    type="search"
                    .value=${this._searchQuery}
                    @input=${(e: Event) => this._searchQuery = (e.target as HTMLInputElement).value}
                    @keydown=${this._onSearchKeydown}
                    placeholder=${localize('panel.list.search', lang)}
                    aria-label=${localize('panel.list.search', lang)}
                />
                ${this._searchQuery ? html`
                    <button
                        class="icon-button small"
                        @click=${() => { this._searchQuery = ""; this._searchInput?.focus(); }}
                        title=${localize('panel.list.clear_search', lang)}
                        aria-label=${localize('panel.list.clear_search', lang)}
                    >
                        <ha-icon icon="mdi:close"></ha-icon>
                    </button>
                ` : nothing}
            </div>
        `;
    }

    private _renderSummary(counts: ListView["counts"]): TemplateResult {
        const lang = this.hass!.language;
        return html`
            <div class="summary ${this._statusFilter ? "filtering" : ""}">
                ${STATUS_SECTIONS.slice(0, 3).map(({ bucket, label, icon }) => {
                    const count = counts[bucket];
                    const active = this._statusFilter === bucket;
                    return html`
                        <button
                            class="tile ${bucket} ${count === 0 ? "zero" : ""} ${active ? "active" : ""}"
                            aria-pressed=${active ? "true" : "false"}
                            @click=${() => this._toggleStatusFilter(bucket as TaskStatus)}
                        >
                            <ha-icon icon=${icon}></ha-icon>
                            <span class="tile-count">${count}</span>
                            <span class="tile-label">${localize(label, lang)}</span>
                        </button>
                    `;
                })}
            </div>
        `;
    }

    private _renderGroupChips(view: ListView): TemplateResult {
        const lang = this.hass!.language;
        const active = this._activeGroup;
        const chip = (group: string | null, label: string) => {
            const selected = active === group;
            const attention = group === null ? undefined : view.groupAttention.get(group);
            return html`
                <button
                    class="chip ${selected ? "selected" : ""}"
                    aria-pressed=${selected ? "true" : "false"}
                    @click=${() => this._setGroupFilter(selected ? null : group)}
                >
                    ${label}
                    ${attention ? html`
                        <span class="chip-badge ${attention.status}">${attention.count}</span>
                    ` : nothing}
                </button>
            `;
        };
        return html`
            <div class="chips" role="group">
                ${chip(null, localize('panel.list.all_groups', lang))}
                ${this.groups.map((group) => chip(group, group))}
                ${this._hasUngrouped ? chip("", localize('common.ungrouped', lang)) : nothing}
            </div>
        `;
    }

    private _renderToolbar(): TemplateResult {
        const lang = this.hass!.language;
        const option = (value: GroupBy, label: string) => html`
            <button
                class=${this.groupBy === value ? "selected" : ""}
                aria-pressed=${this.groupBy === value ? "true" : "false"}
                @click=${() => this._setGroupBy(value)}
            >${label}</button>
        `;
        return html`
            <div class="list-toolbar">
                <slot name="filters"></slot>
                <div class="segmented" role="group" aria-label=${localize('panel.list.group_by', lang)}>
                    <span class="segmented-label">${localize('panel.list.group_by', lang)}</span>
                    ${option("status", localize('panel.list.by_status', lang))}
                    ${option("group", localize('panel.dialog.move_task.fields.group_id.heading', lang))}
                </div>
            </div>
        `;
    }

    private _renderSection(section: Section): TemplateResult {
        const collapsed = this._collapsed.has(section.key);
        return html`
            <section class="section ${section.tone}">
                <button
                    class="section-header"
                    aria-expanded=${collapsed ? "false" : "true"}
                    @click=${() => this._toggleSection(section.key)}
                >
                    <span class="section-title">${section.label}</span>
                    <span class="section-count">${section.tasks.length}</span>
                    ${section.attention ? html`
                        <span class="chip-badge ${section.attention.status}">${section.attention.count}</span>
                    ` : nothing}
                    <span class="section-rule"></span>
                    <ha-icon class="chevron ${collapsed ? "collapsed" : ""}" icon="mdi:chevron-down"></ha-icon>
                </button>
                ${collapsed ? nothing : html`
                    <div class="rows">
                        ${repeat(section.tasks, (ct) => ct.raw.id, (ct) => this._renderRow(ct))}
                    </div>
                `}
            </section>
        `;
    }

    private _renderRow(ct: ComputedTask): TemplateResult {
        const task = ct.raw;
        const lang = this.hass!.language;
        const bucket = displayBucket(ct);
        const isDone = bucket === "done";
        const isExpanded = this._expandedTasks.has(task.id);
        const isCompleting = this._completing.has(task.id);
        // Redundant when the list shows one group or sections are groups.
        const showGroup = !!task.group_id && this._activeGroup === null && this.groupBy !== "group";
        const dueLabel = isDone ? localize('panel.list.done', lang) : formatDaysLabel(ct, task, lang);

        let dueLine: string | undefined;
        if (isDone && ct.nextDue) {
            dueLine = localize('panel.list.next_due', lang, '{date}', this._formatDate(ct.nextDue));
        } else if (!isDone && ct.nextDue) {
            dueLine = this._formatDate(ct.nextDue);
        }

        return html`
            <div class="row ${bucket} ${isExpanded ? "expanded" : ""} ${isCompleting ? "completing" : ""}">
                <button
                    class="row-main"
                    aria-expanded=${isExpanded ? "true" : "false"}
                    @click=${() => this._toggleExpand(task.id)}
                >
                    ${this._renderRing(ct, bucket)}
                    <span class="row-text">
                        <span class="row-title">${task.title}</span>
                        <span class="row-meta">
                            <!-- Narrow layouts show the due pill here instead of in .row-due. -->
                            <span class="pill meta-due">${dueLabel}</span>
                            ${showGroup ? html`
                                <span class="meta-item meta-group">
                                    <ha-icon icon="mdi:folder-outline"></ha-icon>
                                    <span class="meta-text">${task.group_id}</span>
                                </span>
                            ` : nothing}
                            <span class="meta-item meta-interval">
                                <ha-icon icon="mdi:repeat"></ha-icon>${formatTriggerInterval(task, lang)}
                            </span>
                        </span>
                    </span>
                    <span class="row-due">
                        <span class="pill">${dueLabel}</span>
                        ${dueLine ? html`<span class="due-date">${dueLine}</span>` : nothing}
                    </span>
                </button>
                <button
                    class="check"
                    @click=${() => this._completeTask(task)}
                    ?disabled=${isCompleting || isDone}
                    title=${localize(isDone ? 'panel.list.done' : 'panel.list.complete', lang)}
                    aria-label=${`${localize(isDone ? 'panel.list.done' : 'panel.list.complete', lang)}: ${task.title}`}
                >
                    <ha-icon icon="mdi:check-bold"></ha-icon>
                </button>
                ${isExpanded ? this._renderDetails(ct) : nothing}
            </div>
        `;
    }

    private _renderRing(ct: ComputedTask, bucket: DisplayBucket): TemplateResult {
        const progress = bucket === "done" ? 1 : computeDueProgress(ct.raw, ct);
        const icon = ct.raw.icon || TRIGGER_ICONS[ct.raw.trigger_type ?? "time"] || TRIGGER_ICONS.time;
        return html`
            <span class="ring">
                <svg viewBox="0 0 40 40" aria-hidden="true">
                    <circle class="ring-track" cx="20" cy="20" r=${RING_RADIUS}></circle>
                    ${progress > 0.02 ? svg`
                        <circle
                            class="ring-arc"
                            cx="20" cy="20" r=${RING_RADIUS}
                            stroke-dasharray=${RING_CIRCUMFERENCE}
                            stroke-dashoffset=${RING_CIRCUMFERENCE * (1 - progress)}
                        ></circle>
                    ` : nothing}
                </svg>
                <ha-icon .icon=${icon}></ha-icon>
            </span>
        `;
    }

    private _renderDetails(ct: ComputedTask): TemplateResult {
        const task = ct.raw;
        const lang = this.hass!.language;
        const isDated = isDatedTrigger(task);
        const progress = computeDueProgress(task, ct);
        const area = task.area_id ? (this.hass as any).areas?.[task.area_id]?.name : undefined;
        const labels = this.labelsByTask?.get(task.id) ?? [];

        return html`
            <div class="details">
                ${task.description ? html`<p class="description">${task.description}</p>` : nothing}

                <div class="facts">
                    <div class="fact">
                        <span class="fact-label">${localize('panel.list.last_performed', lang)}</span>
                        <span class="fact-value">
                            ${task.last_performed ? this._formatDate(parseStoredDate(task.last_performed)) : "—"}
                        </span>
                    </div>
                    ${isDated ? html`
                        <div class="fact">
                            <span class="fact-label">${localize('panel.cards.current.next', lang)}</span>
                            <span class="fact-value">${ct.nextDue ? this._formatDate(ct.nextDue) : "—"}</span>
                        </div>
                    ` : html`
                        <div class="fact">
                            <span class="fact-label">${localize('panel.list.progress', lang)}</span>
                            <span class="fact-value">${formatProgress(task)}</span>
                            <span class="bar"><span style="width: ${Math.round(progress * 100)}%"></span></span>
                        </div>
                    `}
                    <div class="fact">
                        <span class="fact-label">${localize('panel.list.repeats', lang)}</span>
                        <span class="fact-value">${formatTriggerInterval(task, lang)}</span>
                    </div>
                    ${area ? html`
                        <div class="fact">
                            <span class="fact-label">${localize('panel.cards.new.fields.area.heading', lang)}</span>
                            <span class="fact-value">${area}</span>
                        </div>
                    ` : nothing}
                    ${labels.length ? html`
                        <div class="fact">
                            <span class="fact-label">${localize('panel.cards.new.fields.label.heading', lang)}</span>
                            <span class="fact-value fact-labels">
                                ${labels.map((label) => html`
                                    <span class="label-chip" style=${`--label-color: ${labelColor(label.color) ?? "var(--primary-color)"}`}>
                                        ${label.icon ? html`<ha-icon .icon=${label.icon}></ha-icon>` : nothing}${label.name}
                                    </span>
                                `)}
                            </span>
                        </div>
                    ` : nothing}
                </div>

                ${task.history?.length ? html`
                    <div class="history">
                        <span class="fact-label">${localize('panel.list.history', lang)}</span>
                        ${renderHistoryList(task.history, HISTORY_ENTRIES, this.hass!.locale, this._formatDate)}
                    </div>
                ` : nothing}

                ${this.readonly ? nothing : html`
                    <div class="details-actions">
                        <button class="action-button" @click=${() => this._fire('task-edit', { taskId: task.id })}>
                            <ha-icon icon="mdi:pencil-outline"></ha-icon>
                            ${localize('panel.cards.current.actions.edit', lang)}
                        </button>
                        <button class="action-button" @click=${() => this._fire('task-move', { taskId: task.id })}>
                            <ha-icon icon="mdi:folder-move-outline"></ha-icon>
                            ${localize('panel.cards.current.actions.move', lang)}
                        </button>
                        <button class="action-button danger" @click=${() => this._removeTask(task.id)}>
                            <ha-icon icon="mdi:delete-outline"></ha-icon>
                            ${localize('panel.list.remove', lang)}
                        </button>
                    </div>
                `}
            </div>
        `;
    }

    static styles = [baseStyles, historyStyles, css`
        :host {
            display: block;
            /* Size-responsive to the list's own width, not the viewport. */
            container-type: inline-size;
        }

        /* Header */
        .header {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 12px;
            padding: 16px 12px 0 16px;
        }

        .header-search {
            flex: 0 1 300px;
            margin-left: auto;
            padding-right: 4px;
        }

        .header-icon {
            flex-shrink: 0;
            display: grid;
            place-items: center;
            width: 42px;
            height: 42px;
            border-radius: 12px;
            background: color-mix(in srgb, var(--hm-c) 14%, transparent);
            color: var(--hm-ink);
            --mdc-icon-size: 22px;
        }

        .header-text {
            flex: 1;
            min-width: 0;
        }

        .title {
            font-size: 18px;
            font-weight: 600;
            line-height: 24px;
            color: var(--primary-text-color);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .subtitle {
            font-size: 13px;
            font-weight: 500;
            line-height: 18px;
            color: var(--hm-ink);
        }

        /* Search */
        .search-row {
            padding: 12px 16px 0;
        }

        .search {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 0 6px 0 12px;
            height: 40px;
            border-radius: 12px;
            background: var(--hm-subtle);
            border: 1px solid transparent;
            color: var(--secondary-text-color);
            --mdc-icon-size: 20px;
            transition: border-color 0.15s;
        }

        .search:focus-within {
            border-color: var(--primary-color);
        }

        .search input {
            flex: 1;
            min-width: 0;
            height: 100%;
            border: none;
            outline: none;
            background: transparent;
            color: var(--primary-text-color);
            font: inherit;
            font-size: 14px;
        }

        .search input::-webkit-search-cancel-button {
            display: none;
        }

        .search input::placeholder {
            color: var(--secondary-text-color);
        }

        /* Summary tiles */
        .summary {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 8px;
            padding: 14px 16px 0;
        }

        .tile {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 2px;
            min-width: 0;
            padding: 10px 12px;
            border-radius: 14px;
            text-align: left;
            background: color-mix(in srgb, var(--hm-c) 12%, transparent);
            transition: box-shadow 0.15s, opacity 0.15s, background-color 0.15s;
        }

        .tile:hover {
            background: color-mix(in srgb, var(--hm-c) 18%, transparent);
        }

        .tile ha-icon {
            position: absolute;
            top: 10px;
            right: 10px;
            color: var(--hm-ink);
            opacity: 0.85;
            --mdc-icon-size: 18px;
        }

        .tile-count {
            font-size: 26px;
            font-weight: 600;
            line-height: 32px;
            color: var(--hm-ink);
            font-variant-numeric: tabular-nums;
        }

        .tile-label {
            max-width: 100%;
            font-size: 12px;
            font-weight: 500;
            color: var(--secondary-text-color);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .tile.zero {
            background: var(--hm-subtle);
        }

        .tile.zero .tile-count,
        .tile.zero ha-icon {
            color: var(--secondary-text-color);
            opacity: 0.6;
        }

        .tile.active {
            box-shadow: inset 0 0 0 2px var(--hm-c);
        }

        .summary.filtering .tile:not(.active) {
            opacity: 0.55;
        }

        /* Group chips */
        .chips {
            display: flex;
            gap: 8px;
            padding: 12px 16px 2px;
            overflow-x: auto;
            scrollbar-width: none;
            /* Fade the trailing edge so overflowing chips read as scrollable. */
            -webkit-mask-image: linear-gradient(to right, #000 calc(100% - 28px), transparent);
            mask-image: linear-gradient(to right, #000 calc(100% - 28px), transparent);
        }

        .chips::-webkit-scrollbar {
            display: none;
        }

        .chip {
            flex-shrink: 0;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            height: 32px;
            padding: 0 12px;
            border-radius: 16px;
            border: 1px solid var(--divider-color);
            font-size: 13px;
            font-weight: 500;
            white-space: nowrap;
            color: var(--primary-text-color);
            transition: background-color 0.15s, border-color 0.15s;
        }

        .chip:hover {
            background: var(--hm-subtle);
        }

        .chip.selected {
            background: color-mix(in srgb, var(--primary-color) 14%, transparent);
            border-color: color-mix(in srgb, var(--primary-color) 45%, transparent);
            color: color-mix(in srgb, var(--primary-color) 80%, var(--primary-text-color));
        }

        /* Toolbar: host filters (slot) + the group-by control */
        .list-toolbar {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 8px 12px;
            padding: 12px 16px 0;
        }

        ::slotted([slot="filters"]) {
            flex: 1 1 auto;
            min-width: 0;
        }

        .segmented {
            display: inline-flex;
            align-items: center;
            gap: 2px;
            margin-left: auto;
            padding: 3px;
            border-radius: 18px;
            background: var(--hm-subtle);
        }

        .segmented-label {
            padding: 0 8px 0 10px;
            font-size: 12px;
            font-weight: 500;
            color: var(--secondary-text-color);
        }

        .segmented button {
            height: 28px;
            padding: 0 12px;
            border-radius: 14px;
            font-size: 13px;
            font-weight: 500;
            color: var(--secondary-text-color);
            transition: background-color 0.15s, color 0.15s;
        }

        .segmented button.selected {
            background: var(--card-background-color, var(--ha-card-background, #fff));
            color: var(--primary-text-color);
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
        }

        /* Sections */
        .task-list {
            padding: 6px 0 10px;
        }

        .section-header {
            display: flex;
            align-items: center;
            gap: 8px;
            width: 100%;
            padding: 14px 16px 6px;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            color: var(--hm-ink);
        }

        .section.upcoming .section-header {
            color: var(--secondary-text-color);
        }

        .section.group .section-header {
            color: var(--primary-text-color);
        }

        .section-header .chip-badge {
            min-width: 18px;
            height: 18px;
            padding: 0 5px;
            letter-spacing: 0;
        }

        .section-count {
            font-weight: 500;
            color: var(--secondary-text-color);
            font-variant-numeric: tabular-nums;
        }

        .section-rule {
            flex: 1;
            height: 1px;
            background: var(--divider-color);
        }

        .chevron {
            color: var(--secondary-text-color);
            transition: transform 0.2s;
            --mdc-icon-size: 18px;
        }

        .chevron.collapsed {
            transform: rotate(-90deg);
        }

        .rows {
            display: flex;
            flex-direction: column;
            gap: 2px;
            padding: 0 8px;
        }

        /* Task rows */
        .row {
            display: grid;
            grid-template-columns: minmax(0, 1fr) auto;
            align-items: center;
            padding-right: 8px;
            border-radius: 14px;
            transition: background-color 0.15s, opacity 0.2s;
        }

        .row:hover,
        .row.expanded {
            background: var(--hm-hover);
        }

        .row.completing {
            opacity: 0.5;
        }

        .row-main {
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 0;
            padding: 8px;
            border-radius: 14px;
            text-align: left;
        }

        .ring {
            position: relative;
            flex-shrink: 0;
            display: grid;
            place-items: center;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: color-mix(in srgb, var(--hm-c) 10%, transparent);
            color: var(--hm-ink);
            --mdc-icon-size: 20px;
        }

        .row.upcoming .ring {
            color: var(--secondary-text-color);
        }

        .ring svg {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            transform: rotate(-90deg);
        }

        .ring-track {
            fill: none;
            stroke: color-mix(in srgb, var(--hm-c) 18%, transparent);
            stroke-width: 3;
        }

        .ring-arc {
            fill: none;
            stroke: var(--hm-c);
            stroke-width: 3;
            stroke-linecap: round;
            transition: stroke-dashoffset 0.4s ease;
        }

        .row-text {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .row-title {
            font-size: 15px;
            font-weight: 500;
            line-height: 20px;
            color: var(--primary-text-color);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .row.done .row-title {
            color: var(--secondary-text-color);
        }

        .row-meta {
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 0;
            font-size: 12.5px;
            line-height: 16px;
            color: var(--secondary-text-color);
            --mdc-icon-size: 14px;
        }

        .meta-item {
            display: inline-flex;
            align-items: center;
            gap: 3px;
            white-space: nowrap;
        }

        .meta-group {
            min-width: 0;
        }

        .meta-text {
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .meta-interval {
            flex-shrink: 0;
        }

        .meta-due {
            display: none;
        }

        .meta-item ha-icon {
            flex-shrink: 0;
            opacity: 0.8;
        }

        .row-due {
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 3px;
        }

        .pill {
            padding: 3px 9px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 600;
            line-height: 16px;
            white-space: nowrap;
            font-variant-numeric: tabular-nums;
            background: color-mix(in srgb, var(--hm-c) 15%, transparent);
            color: var(--hm-ink);
        }

        .row.upcoming .pill {
            background: var(--hm-subtle);
            color: var(--secondary-text-color);
        }

        .due-date {
            padding-right: 2px;
            font-size: 12px;
            line-height: 14px;
            color: var(--secondary-text-color);
            white-space: nowrap;
        }

        .check {
            display: grid;
            place-items: center;
            width: 40px;
            height: 40px;
            margin-left: 4px;
            border-radius: 50%;
            border: 2px solid var(--divider-color);
            color: var(--secondary-text-color);
            transition: background-color 0.15s, border-color 0.15s, color 0.15s, transform 0.1s;
            --mdc-icon-size: 20px;
        }

        .check:hover:not(:disabled) {
            background: var(--todo-done);
            border-color: var(--todo-done);
            color: var(--text-primary-color, #fff);
        }

        .check:active:not(:disabled) {
            transform: scale(0.92);
        }

        .check:disabled {
            cursor: default;
        }

        .row.done .check {
            background: var(--todo-done);
            border-color: var(--todo-done);
            color: var(--text-primary-color, #fff);
        }

        .row.completing .check {
            animation: hm-pulse 1s ease-in-out infinite;
        }

        /* Expanded details */
        .details {
            grid-column: 1 / -1;
            padding: 2px 8px 14px 60px;
            animation: hm-reveal 0.18s ease-out;
        }

        .description {
            margin: 0 0 12px;
            padding: 10px 12px;
            border-radius: 10px;
            border: 1px solid var(--divider-color);
            background: var(--card-background-color, var(--ha-card-background));
            font-size: 14px;
            line-height: 1.45;
            white-space: pre-wrap;
        }

        .facts {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 10px 16px;
        }

        .fact {
            display: flex;
            flex-direction: column;
            min-width: 0;
        }

        .fact-label {
            margin-bottom: 2px;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            color: var(--secondary-text-color);
        }

        .fact-value {
            font-size: 14px;
            font-variant-numeric: tabular-nums;
        }

        .fact-labels {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
        }

        .label-chip {
            display: inline-flex;
            align-items: center;
            gap: 3px;
            padding: 1px 8px;
            border-radius: 10px;
            font-size: 12px;
            line-height: 18px;
            background: color-mix(in srgb, var(--label-color) 18%, transparent);
            color: color-mix(in srgb, var(--label-color) 70%, var(--primary-text-color));
            --mdc-icon-size: 14px;
        }

        .bar {
            height: 6px;
            margin-top: 5px;
            border-radius: 3px;
            overflow: hidden;
            background: color-mix(in srgb, var(--hm-c) 18%, transparent);
        }

        .bar > span {
            display: block;
            height: 100%;
            border-radius: 3px;
            background: var(--hm-c);
        }

        .history {
            margin-top: 12px;
        }

        /* Completion history as a small timeline, newest first. */
        .history .history-list {
            list-style: none;
            margin: 4px 0 0;
            padding: 0;
            font-size: 13px;
        }

        .history .history-list li {
            position: relative;
            margin: 0;
            padding: 2px 0 6px 18px;
        }

        .history .history-list li::before {
            content: "";
            position: absolute;
            left: 2px;
            top: 7px;
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: var(--divider-color);
        }

        .history .history-list li:first-child::before {
            background: var(--todo-done);
        }

        .history .history-list li:not(:last-child)::after {
            content: "";
            position: absolute;
            left: 5px;
            top: 16px;
            bottom: -2px;
            width: 1px;
            background: var(--divider-color);
        }

        .details-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 14px;
        }

        .action-button {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            height: 32px;
            padding: 0 14px 0 10px;
            border-radius: 16px;
            border: 1px solid var(--divider-color);
            font-size: 13px;
            font-weight: 500;
            transition: background-color 0.15s;
            --mdc-icon-size: 18px;
        }

        .action-button:hover {
            background: var(--hm-subtle);
        }

        .action-button.danger {
            color: var(--todo-overdue);
        }

        .action-button.danger:hover {
            background: color-mix(in srgb, var(--todo-overdue) 10%, transparent);
        }

        /* Empty state */
        .empty {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            padding: 28px 16px 20px;
            font-size: 14px;
            color: var(--secondary-text-color);
            --mdc-icon-size: 40px;
        }

        .empty ha-icon {
            opacity: 0.5;
        }

        @keyframes hm-reveal {
            from { opacity: 0; transform: translateY(-4px); }
            to { opacity: 1; transform: none; }
        }

        @keyframes hm-pulse {
            50% { transform: scale(0.9); }
        }

        /* Narrow lists (phones, narrow windows) — sized by the list, not
           the viewport. */
        @container (max-width: 560px) {
            .header-search {
                order: 3;
                flex-basis: 100%;
                margin-left: 0;
            }

            /* The control's aria-label still names it; the visible label
               would push it onto a row of its own. */
            .segmented-label {
                display: none;
            }
        }

        @container (max-width: 420px) {
            .tile ha-icon {
                display: none;
            }

            .tile-count {
                font-size: 22px;
                line-height: 28px;
            }

            .row-main {
                gap: 10px;
            }

            /* Give the title the full row: the due pill moves onto the
               meta line (the date is dropped) and long titles wrap. */
            .row-due {
                display: none;
            }

            .meta-due {
                display: inline-block;
                flex-shrink: 0;
                padding: 1px 7px;
                font-size: 11.5px;
            }

            .row-title {
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                white-space: normal;
            }

            .details {
                padding-left: 8px;
            }
        }

        @container (max-width: 340px) {
            .meta-interval {
                display: none;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation: none !important;
                transition: none !important;
            }
        }
    `];
}

if (!customElements.get('hm-task-list')) customElements.define('hm-task-list', HMTaskList);

declare global {
    interface HTMLElementTagNameMap {
        'hm-task-list': HMTaskList;
    }
}
