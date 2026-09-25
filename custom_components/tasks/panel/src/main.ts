import { LitElement, PropertyValues, TemplateResult, css, html, nothing } from "lit";
import { property, state, query } from "lit/decorators.js";
import type { HomeAssistant } from "custom-card-helpers";

import { localize } from '../localize/localize';
import { loadConfigDashboard } from "./helpers";
import { showToast } from './toast';
import { baseStyles, commonStyle } from './styles'
import { Debouncer, filterTasks } from './compute';
import { tasksToCsv } from './csv';
import type { TaskTemplate } from './templates';
import { dialogFooter } from './util';
import { EntityRegistryEntry, IntegrationConfig, Label, Task } from './types';
import {
    getConfig,
    loadGroups,
    loadLabelRegistry,
    loadRegistryEntries,
    loadTasks,
    subscribeUpdates,
} from './data/websockets';
import './components/task-list'
import './components/group-nav'
import './components/add-task-dialog'
import './components/edit-dialog'
import './components/move-dialog'
import './components/template-dialog'
import type { GroupBy } from './components/task-list'
import type { HMAddTaskDialog } from './components/add-task-dialog'
import type { HMEditDialog } from './components/edit-dialog'
import type { HMMoveDialog } from './components/move-dialog'
import type { HMTemplateDialog } from './components/template-dialog'

const RELOAD_DEBOUNCE_MS = 300;
/** Below this panel width the group sidebar folds into chips above the list. */
const WIDE_LAYOUT_MIN_WIDTH = 880;
const GROUP_BY_STORAGE_KEY = "tasks.panel.group_by";

/** The remembered Status / Group choice (browser storage may be unavailable). */
const readStoredGroupBy = (): GroupBy => {
    try {
        return localStorage.getItem(GROUP_BY_STORAGE_KEY) === "group" ? "group" : "status";
    } catch {
        return "status";
    }
};

/** A label's color as CSS: theme color names map to HA's --<name>-color. */
const labelColor = (color?: string): string =>
    color && /^[a-z-]+$/.test(color) ? `var(--${color}-color)` : color || "var(--primary-color)";

/**
 * Panel orchestrator: loads data, keeps it live via the backend's
 * subscribe_updates push channel, and lays out the page — a group sidebar
 * (navigation + group management) beside the task list, which folds into a
 * single column with group chips on narrow screens. Adding a task (from
 * scratch or a template) and editing happen in dialogs.
 *
 * Non-admin users (who only reach the panel when its Admin only option is
 * off) get a view-and-complete panel: the backend rejects every other
 * mutation from them, so those controls are hidden rather than left to fail.
 */
export class TasksPanel extends LitElement {
    @property() hass?: HomeAssistant;
    @property() narrow!: boolean;

    @state() private _loaded = false;
    @state() private tasks: Task[] = [];
    @state() private groups: string[] = [];
    @state() private config: IntegrationConfig | null = null;
    @state() private registry: EntityRegistryEntry[] = [];
    @state() private labelRegistry: Label[] = [];
    @state() private _selectedLabels: string[] = [];
    /** Selected group: null = all tasks, "" = ungrouped. */
    @state() private _groupFilter: string | null = null;
    @state() private _groupBy: GroupBy = readStoredGroupBy();
    @state() private _wide = true;
    @state() private _groupsDialogOpen = false;

    @query('hm-add-task-dialog') private _addDialog?: HMAddTaskDialog;
    @query('hm-edit-dialog') private _editDialog?: HMEditDialog;
    @query('hm-move-dialog') private _moveDialog?: HMMoveDialog;
    @query('hm-template-dialog') private _templateDialog?: HMTemplateDialog;

    private _unsubscribe?: () => Promise<void>;
    private _reload = new Debouncer(() => this._loadData(), RELOAD_DEBOUNCE_MS);
    private _resizeObserver = new ResizeObserver((entries) => {
        const width = entries[0]?.contentRect.width ?? 0;
        const wide = width >= WIDE_LAYOUT_MIN_WIDTH;
        if (wide !== this._wide) this._wide = wide;
    });

    connectedCallback() {
        super.connectedCallback();
        this._resizeObserver.observe(this);
        this._initialize();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this._resizeObserver.disconnect();
        this._reload.cancel();
        this._unsubscribe?.();
        this._unsubscribe = undefined;
    }

    willUpdate(changed: PropertyValues) {
        // A selected group that was renamed or deleted elsewhere falls back
        // to "All tasks" rather than showing an empty list.
        if ((changed.has('tasks') || changed.has('groups')) && this._groupFilter !== null) {
            const group = this._groupFilter;
            const exists = group === ""
                ? this.tasks.some((task) => !task.group_id?.trim())
                : this.groups.includes(group);
            if (!exists) this._groupFilter = null;
        }
    }

    private async _initialize() {
        // One-time setup: HA components, plus data no task mutation can
        // change. The push path below only refetches what mutations touch.
        await loadConfigDashboard();
        this.config = await getConfig(this.hass!);
        await this._loadData();
        this._loaded = true;
        this._openEditFromUrl();
        try {
            this._unsubscribe = await subscribeUpdates(this.hass!, () => this._reload.schedule());
        } catch (e) {
            console.error("Failed to subscribe to task updates:", e);
        }
    }

    private async _loadData() {
        // Fetch concurrently, then assign synchronously so LitElement
        // batches the updates into a single render. Registries are included
        // because task edits can change entity labels and areas.
        const [tasks, groups, registry, labelRegistry] = await Promise.all([
            loadTasks(this.hass!),
            loadGroups(this.hass!),
            loadRegistryEntries(this.hass!),
            loadLabelRegistry(this.hass!),
        ]);
        this.tasks = tasks;
        this.groups = groups;
        this.registry = registry;
        this.labelRegistry = labelRegistry;
    }

    /**
     * Deep link (e.g. a notification's Open URL): open the edit dialog for
     * ?edit=<task_id>, then drop the param so a reload doesn't reopen it.
     */
    private async _openEditFromUrl() {
        const url = new URL(window.location.href);
        const taskId = url.searchParams.get('edit');
        if (!taskId) return;
        url.searchParams.delete('edit');
        history.replaceState(history.state, '', url.pathname + url.search + url.hash);
        if (!this._canManage || !this.tasks.some((task) => task.id === taskId)) return;
        // The dialog only exists once the loaded view has rendered.
        await this.updateComplete;
        this._editDialog?.open(taskId);
    }

    // --- Actions ---

    private _handleMove(e: CustomEvent) {
        const task = this.tasks.find((t) => t.id === e.detail.taskId);
        if (task) this._moveDialog?.open(task);
    }

    private _handleTaskAdded(e: CustomEvent) {
        showToast(this, localize(
            'card.add_task.added', this.hass!.language,
            '{title}', e.detail?.title ?? '',
        ));
    }

    private _handleTemplateSelected(e: CustomEvent) {
        const template: TaskTemplate = e.detail.template;
        this._addDialog?.open({
            title: template.title,
            description: template.description,
            trigger_type: "time",
            interval_value: template.interval_value,
            interval_type: template.interval_type,
            icon: template.icon,
        });
    }

    private _handleCsvImported(e: CustomEvent) {
        const { created, failures } = e.detail as { created: number; failures: string[] };
        showToast(this, localize(
            'panel.dialog.templates.imported', this.hass!.language,
            '{count}', created,
        ));
        if (failures.length) {
            showToast(this, localize(
                'panel.dialog.templates.import_failed', this.hass!.language,
                '{titles}', failures.join(', '),
            ));
        }
    }

    private _handleExportCsv() {
        const blob = new Blob([tasksToCsv(this.tasks)], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "tasks.csv";
        anchor.click();
        URL.revokeObjectURL(url);
    }

    private _handleGroupByChanged(e: CustomEvent) {
        this._groupBy = e.detail.groupBy;
        try {
            localStorage.setItem(GROUP_BY_STORAGE_KEY, this._groupBy);
        } catch {
            // Storage unavailable (private mode): the choice lasts this visit.
        }
    }

    private _toggleLabel(labelId: string) {
        this._selectedLabels = this._selectedLabels.includes(labelId)
            ? this._selectedLabels.filter((id) => id !== labelId)
            : [...this._selectedLabels, labelId];
    }

    // --- Derived data ---

    // hass updates on every HA state change, re-running render(); these
    // caches keep derived values stable (same references) unless their
    // inputs changed, so the task list's identity-keyed cache stays warm.
    private _visibleCache?: {
        tasks: Task[]; registry: EntityRegistryEntry[]; labels: string[]; result: Task[];
    };
    private _labelsInUseCache?: {
        tasks: Task[]; registry: EntityRegistryEntry[]; labelRegistry: Label[]; result: Label[];
    };
    private _labelsByTaskCache?: {
        registry: EntityRegistryEntry[]; labelRegistry: Label[]; result: Map<string, Label[]>;
    };

    /** Tasks passing the label filter (search lives in the task list). */
    private get _visibleTasks(): Task[] {
        const cache = this._visibleCache;
        if (
            cache &&
            cache.tasks === this.tasks &&
            cache.registry === this.registry &&
            cache.labels === this._selectedLabels
        ) {
            return cache.result;
        }
        const result = filterTasks(this.tasks, this.registry, "", this._selectedLabels);
        this._visibleCache = {
            tasks: this.tasks,
            registry: this.registry,
            labels: this._selectedLabels,
            result,
        };
        return result;
    }

    /** Label registry entries currently used by at least one task. */
    private get _labelsInUse(): Label[] {
        const cache = this._labelsInUseCache;
        if (
            cache &&
            cache.tasks === this.tasks &&
            cache.registry === this.registry &&
            cache.labelRegistry === this.labelRegistry
        ) {
            return cache.result;
        }
        const used = new Set<string>();
        const taskIds = new Set(this.tasks.map((task) => task.id));
        this.registry.forEach((entry) => {
            if (taskIds.has(entry.unique_id)) entry.labels.forEach((id) => used.add(id));
        });
        const result = this.labelRegistry.filter((label) => used.has(label.label_id));
        this._labelsInUseCache = {
            tasks: this.tasks,
            registry: this.registry,
            labelRegistry: this.labelRegistry,
            result,
        };
        return result;
    }

    /** Each task's labels (its entity's), for the task details. */
    private get _labelsByTask(): Map<string, Label[]> {
        const cache = this._labelsByTaskCache;
        if (cache && cache.registry === this.registry && cache.labelRegistry === this.labelRegistry) {
            return cache.result;
        }
        const byId = new Map(this.labelRegistry.map((label) => [label.label_id, label]));
        const result = new Map<string, Label[]>();
        this.registry.forEach((entry) => {
            if (entry.platform !== "tasks" || !entry.labels.length) return;
            const labels = entry.labels
                .map((id) => byId.get(id))
                .filter((label): label is Label => Boolean(label));
            if (labels.length) result.set(entry.unique_id, labels);
        });
        this._labelsByTaskCache = { registry: this.registry, labelRegistry: this.labelRegistry, result };
        return result;
    }

    /** Admins manage tasks and groups; everyone else can view and complete. */
    private get _canManage(): boolean {
        return !!this.hass?.user?.is_admin;
    }

    private get _dueSoonDays(): number {
        return this.config?.due_soon_days ?? 14;
    }

    private get _heading(): string {
        const lang = this.hass!.language;
        if (this._groupFilter === null) return localize('panel.nav.all_tasks', lang);
        if (this._groupFilter === "") return localize('common.ungrouped', lang);
        return this._groupFilter;
    }

    // --- Render ---

    render() {
        if (!this.hass) return html``;

        if (!this._loaded) {
            return html`<p class="loading">${localize('common.loading', this.hass.language)}</p>`;
        }

        const lang = this.hass.language;
        const wide = this._wide;
        const canManage = this._canManage;

        return html`
            <div class="header">
                <div class="toolbar ${wide ? "" : "compact"}">
                    <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
                    <div class="main-title">${this.config?.options.sidebar_title}</div>
                    ${canManage ? this._renderToolbarButton(
                        "mdi:book-open-variant-outline",
                        localize('panel.cards.current.filter.templates', lang),
                        () => this._templateDialog?.open(),
                    ) : nothing}
                    ${this._renderToolbarButton(
                        "mdi:tray-arrow-down",
                        localize('panel.cards.current.filter.export', lang),
                        this._handleExportCsv,
                    )}
                    ${wide || !canManage ? nothing : this._renderToolbarButton(
                        "mdi:folder-cog-outline",
                        localize('panel.toolbar.manage_groups', lang),
                        () => this._groupsDialogOpen = true,
                    )}
                </div>
            </div>

            <div class="view ${wide ? "wide" : ""}">
                <div class="layout">
                    ${wide ? html`
                        <ha-card class="nav-card">
                            <hm-group-nav
                                .hass=${this.hass}
                                .groups=${this.groups}
                                .tasks=${this.tasks}
                                .dueSoonDays=${this._dueSoonDays}
                                .selected=${this._groupFilter}
                                .readonly=${!canManage}
                                @group-selected=${(e: CustomEvent) => this._groupFilter = e.detail.group}
                            ></hm-group-nav>
                        </ha-card>
                    ` : nothing}
                    <ha-card class="list-card">
                        ${this.tasks.length ? this._renderList() : this._renderOnboarding()}
                    </ha-card>
                </div>
            </div>

            ${canManage ? this._renderManagement() : nothing}
        `;
    }

    /** The add-task button and the dialogs behind admin-only actions. */
    private _renderManagement(): TemplateResult {
        const lang = this.hass!.language;
        return html`
            <button class="fab" @click=${() => this._addDialog?.open()}>
                <ha-icon icon="mdi:plus"></ha-icon>
                <span>${localize('panel.toolbar.add_task', lang)}</span>
            </button>

            <hm-add-task-dialog
                .hass=${this.hass}
                .groups=${this.groups}
                @task-added=${this._handleTaskAdded}
                @browse-templates=${() => this._templateDialog?.open()}
            ></hm-add-task-dialog>
            <hm-edit-dialog
                .hass=${this.hass}
                .registry=${this.registry}
                .labelRegistry=${this.labelRegistry}
                .groups=${this.groups}
            ></hm-edit-dialog>
            <hm-move-dialog .hass=${this.hass} .groups=${this.groups}></hm-move-dialog>
            <hm-template-dialog
                .hass=${this.hass}
                @template-selected=${this._handleTemplateSelected}
                @csv-imported=${this._handleCsvImported}
            ></hm-template-dialog>
            ${this._groupsDialogOpen ? this._renderGroupsDialog() : nothing}
        `;
    }

    private _renderToolbarButton(icon: string, label: string, onClick: () => void): TemplateResult {
        // Labeled on wide layouts; icon-only (with a tooltip) when narrow.
        return html`
            <button
                class="toolbar-button ${this._wide ? "" : "icon-only"}"
                @click=${onClick}
                title=${label}
                aria-label=${label}
            >
                <ha-icon .icon=${icon}></ha-icon>
                ${this._wide ? html`<span>${label}</span>` : nothing}
            </button>
        `;
    }

    private _renderList(): TemplateResult {
        const lang = this.hass!.language;
        const labels = this._labelsInUse;
        return html`
            <hm-task-list
                .hass=${this.hass}
                .tasks=${this._visibleTasks}
                .groups=${this.groups}
                .heading=${this._heading}
                .dueSoonDays=${this._dueSoonDays}
                .searchMode=${this._wide ? "header" : "toggle"}
                .showGroupChips=${!this._wide}
                .readonly=${!this._canManage}
                .groupFilter=${this._groupFilter}
                .groupBy=${this._groupBy}
                .labelsByTask=${this._labelsByTask}
                @group-filter-changed=${(e: CustomEvent) => this._groupFilter = e.detail.group}
                @group-by-changed=${this._handleGroupByChanged}
                @task-edit=${(e: CustomEvent) => this._editDialog?.open(e.detail.taskId)}
                @task-move=${this._handleMove}
            >
                ${labels.length ? html`
                    <div slot="filters" class="label-filters">
                        ${labels.map((label) => {
                            const selected = this._selectedLabels.includes(label.label_id);
                            return html`
                                <button
                                    class="label-filter ${selected ? "selected" : ""}"
                                    style=${`--label-color: ${labelColor(label.color)}`}
                                    aria-pressed=${selected ? "true" : "false"}
                                    @click=${() => this._toggleLabel(label.label_id)}
                                >
                                    <ha-icon .icon=${label.icon || "mdi:label-outline"}></ha-icon>
                                    ${label.name}
                                </button>
                            `;
                        })}
                        ${this._selectedLabels.length ? html`
                            <button class="label-filter clear" @click=${() => this._selectedLabels = []}>
                                ${localize('panel.cards.current.filter.clear', lang)}
                            </button>
                        ` : nothing}
                    </div>
                ` : nothing}
            </hm-task-list>
        `;
    }

    private _renderOnboarding(): TemplateResult {
        const lang = this.hass!.language;
        return html`
            <div class="onboarding">
                <div class="onboarding-icon"><ha-icon icon="mdi:home-heart"></ha-icon></div>
                <h2>${localize('panel.empty.title', lang)}</h2>
                ${this._canManage ? html`
                    <p>${localize('panel.empty.message', lang)}</p>
                    <div class="onboarding-actions">
                        <button class="primary-button" @click=${() => this._addDialog?.open()}>
                            <ha-icon icon="mdi:plus"></ha-icon>
                            ${localize('panel.toolbar.add_task', lang)}
                        </button>
                        <button class="secondary-button" @click=${() => this._templateDialog?.open()}>
                            <ha-icon icon="mdi:book-open-variant-outline"></ha-icon>
                            ${localize('panel.cards.current.filter.templates', lang)}
                        </button>
                    </div>
                ` : html`
                    <p>${localize('panel.empty.message_readonly', lang)}</p>
                `}
            </div>
        `;
    }

    private _renderGroupsDialog(): TemplateResult {
        const lang = this.hass!.language;
        const close = () => this._groupsDialogOpen = false;
        return html`
            <ha-dialog
                open
                heading=${localize('panel.toolbar.manage_groups', lang)}
                header-title=${localize('panel.toolbar.manage_groups', lang)}
                @closed=${(e: Event) => { if (e.target === e.currentTarget) close(); }}
            >
                <hm-group-nav
                    .hass=${this.hass}
                    .groups=${this.groups}
                    .tasks=${this.tasks}
                    .dueSoonDays=${this._dueSoonDays}
                    manageOnly
                ></hm-group-nav>
                ${dialogFooter(html`
                    <ha-button slot="primaryAction" data-dialog="close" @click=${close}>
                        ${localize('panel.nav.done_editing', lang)}
                    </ha-button>
                `)}
            </ha-dialog>
        `;
    }

    static styles = [commonStyle, baseStyles, css`
        :host {
            display: block;
        }

        .loading {
            padding: 24px;
        }

        /* Toolbar */
        .toolbar {
            gap: 4px;
        }

        .main-title {
            min-width: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .toolbar.compact .main-title {
            margin-left: 12px;
        }

        .toolbar-button {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            height: 40px;
            padding: 0 14px 0 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            white-space: nowrap;
            transition: background-color 0.15s;
            --mdc-icon-size: 20px;
        }

        .toolbar-button.icon-only {
            justify-content: center;
            width: 40px;
            padding: 0;
        }

        .toolbar-button:hover {
            background: color-mix(in srgb, currentColor 10%, transparent);
        }

        /* Page layout: sidebar + list when wide, one column when narrow. */
        .view {
            display: block;
            padding: 8px 8px 96px;
            box-sizing: border-box;
        }

        .view.wide {
            padding: 24px 24px 104px;
        }

        .layout {
            display: grid;
            gap: 24px;
            max-width: 1280px;
            margin: 0 auto;
        }

        .view.wide .layout {
            grid-template-columns: 264px minmax(0, 1fr);
            align-items: start;
        }

        ha-card {
            margin: 0;
        }

        .nav-card {
            position: sticky;
            top: 0;
            padding: 8px;
        }

        .list-card {
            overflow: hidden;
            padding-bottom: 8px;
        }

        /* Label filters, slotted into the task list's toolbar row */
        .label-filters {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 6px;
        }

        .label-filter {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            height: 28px;
            padding: 0 10px 0 8px;
            border-radius: 14px;
            border: 1px solid var(--divider-color);
            font-size: 12.5px;
            font-weight: 500;
            color: var(--primary-text-color);
            transition: background-color 0.15s, border-color 0.15s;
            --mdc-icon-size: 16px;
        }

        .label-filter ha-icon {
            color: var(--label-color);
        }

        .label-filter:hover {
            background: var(--hm-subtle);
        }

        .label-filter.selected {
            background: color-mix(in srgb, var(--label-color) 18%, transparent);
            border-color: color-mix(in srgb, var(--label-color) 55%, transparent);
        }

        .label-filter.clear {
            padding: 0 10px;
            border-style: dashed;
            color: var(--secondary-text-color);
        }

        /* Add-task button, following Home Assistant's extended FAB pattern */
        .fab {
            position: fixed;
            right: 24px;
            bottom: calc(24px + env(safe-area-inset-bottom, 0px));
            z-index: 3;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            height: 56px;
            padding: 0 22px 0 18px;
            border-radius: 16px;
            background: var(--primary-color);
            color: var(--text-primary-color, #fff);
            font-size: 15px;
            font-weight: 500;
            box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 6px 10px rgba(0, 0, 0, 0.14), 0 1px 18px rgba(0, 0, 0, 0.12);
            transition: box-shadow 0.15s, transform 0.1s;
            --mdc-icon-size: 24px;
        }

        .fab:hover {
            box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
        }

        .fab:active {
            transform: scale(0.97);
        }

        /* First-run empty state */
        .onboarding {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            padding: 56px 24px 64px;
            text-align: center;
        }

        .onboarding-icon {
            display: grid;
            place-items: center;
            width: 72px;
            height: 72px;
            margin-bottom: 8px;
            border-radius: 22px;
            background: color-mix(in srgb, var(--primary-color) 14%, transparent);
            color: var(--primary-color);
            --mdc-icon-size: 40px;
        }

        .onboarding h2 {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
        }

        .onboarding p {
            max-width: 420px;
            margin: 0;
            line-height: 1.5;
            color: var(--secondary-text-color);
        }

        .onboarding-actions {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 12px;
            margin-top: 16px;
        }

        .primary-button,
        .secondary-button {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            height: 40px;
            padding: 0 20px 0 14px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            --mdc-icon-size: 20px;
        }

        .primary-button {
            background: var(--primary-color);
            color: var(--text-primary-color, #fff);
        }

        .secondary-button {
            border: 1px solid var(--divider-color);
            color: var(--primary-color);
        }

        .secondary-button:hover {
            background: color-mix(in srgb, var(--primary-color) 8%, transparent);
        }
    `];
}

customElements.define("tasks-panel", TasksPanel);
