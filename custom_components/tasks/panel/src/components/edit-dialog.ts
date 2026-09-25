import { LitElement, html, css, nothing } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant } from "custom-card-helpers";

import { localize } from '../../localize/localize';
import { commonStyle } from '../styles';
import { showToast } from '../toast';
import { dialogFooter, historyStyles, listNotifyServices, renderHistoryList } from '../util';
import { loadTask, updateTask } from '../data/websockets';
import { renderTaskField, taskFieldStyles } from './task-fields';
import {
    basicFields,
    computeISODate,
    descriptionField,
    emptyTaskFormData,
    lastPerformedField,
    notificationFieldList,
    optionalFieldList,
    taskFormToUpdates,
    taskToFormData,
    validateTaskForm,
} from '../schema';
import { EntityRegistryEntry, HistoryEntry, Label, TaskFormData } from '../types';

/**
 * The edit-task dialog. Call open(taskId) to load a task and show it.
 * Fields render through the shared task-field renderer (matching
 * hm-task-form), so inputs line up regardless of selector style.
 */
class HMEditDialog extends LitElement {
    @property() hass?: HomeAssistant;
    @property({ attribute: false }) registry: EntityRegistryEntry[] = [];
    @property({ attribute: false }) labelRegistry: Label[] = [];
    @property({ attribute: false }) groups: string[] = [];

    @state() private _taskId: string | null = null;
    @state() private _formData: TaskFormData = emptyTaskFormData();
    @state() private _history: HistoryEntry[] = [];

    public async open(taskId: string) {
        try {
            const task = await loadTask(this.hass!, taskId);
            const entity = this.registry.find((entry) => entry.unique_id === task.id);
            const labels = entity
                ? this.labelRegistry.filter((lr) => entity.labels.includes(lr.label_id))
                : [];
            this._formData = taskToFormData(task, entity, labels);
            this._history = task.history ?? [];
            this._taskId = task.id;
        } catch (e) {
            console.error("Failed to fetch task for edit:", e);
        }
    }

    private async _handleSaveClick() {
        if (!this._taskId) return;

        if (!validateTaskForm(this._formData)) {
            showToast(this, localize("panel.cards.new.alerts.required", this.hass!.language));
            return;
        }

        const lastPerformedISO = computeISODate(this._formData.last_performed);
        if (lastPerformedISO === null) {
            showToast(this, localize("common.invalid_date", this.hass!.language));
            return;
        }

        try {
            await updateTask(this.hass!, {
                task_id: this._taskId,
                updates: taskFormToUpdates(this._formData, lastPerformedISO),
            });
            this._close();
        } catch (e) {
            console.error("Failed to update task:", e);
            showToast(this, localize('panel.dialog.edit_task.alerts.error', this.hass!.language));
        }
    }

    private _close() {
        this._taskId = null;
        this._formData = emptyTaskFormData();
        this._history = [];
    }

    /** Send the task's notification now (uses the last saved settings). */
    private async _handleTestNotification() {
        const entity = this.registry.find((entry) => entry.unique_id === this._taskId);
        if (!entity) return;

        try {
            await this.hass!.callService("tasks", "send_task_notification", {
                entity_id: entity.entity_id,
            });
        } catch (e) {
            console.error("Failed to send test notification:", e);
            showToast(this, localize('panel.dialog.edit_task.alerts.test_error', this.hass!.language));
        }
    }

    private _handleFieldChanged = (name: string, ev: CustomEvent) => {
        ev.stopPropagation();
        this._formData = { ...this._formData, [name]: ev.detail.value };
    }

    private _renderField = (field: any) => renderTaskField({
        hass: this.hass!,
        keyPrefix: 'panel.dialog.edit_task.fields',
        data: this._formData,
        onChange: this._handleFieldChanged,
    }, field);

    render() {
        if (!this.hass || !this._taskId) return html``;
        const lang = this.hass.language;

        return html`
            <ha-dialog
                open
                heading="${localize('panel.dialog.edit_task.title', lang)}: ${this._formData.title}"
                header-title="${localize('panel.dialog.edit_task.title', lang)}: ${this._formData.title}"
                prevent-scrim-close
                @closed=${this._close}
            >
                <div class="fields-grid">
                    ${basicFields(this._formData, lang).map(this._renderField)}
                    ${this._renderField(lastPerformedField)}
                </div>

                <div class="section-label">
                    ${localize('panel.dialog.edit_task.sections.optional', lang)}
                </div>

                <div class="fields-grid">
                    ${optionalFieldList(this.groups, lang).map(this._renderField)}
                    ${this._renderField(descriptionField(true))}
                </div>

                <div class="section-label">
                    ${localize('panel.dialog.edit_task.sections.notifications', lang)}
                </div>

                <div class="fields-grid">
                    ${notificationFieldList(this._formData, listNotifyServices(this.hass), lang).map(this._renderField)}
                </div>
                ${this._formData.notifications_enabled ? html`
                    <ha-button
                        appearance="plain"
                        size="small"
                        class="test-notification"
                        @click=${this._handleTestNotification}
                    >
                        ${localize('panel.dialog.edit_task.actions.test_notification', lang)}
                    </ha-button>
                ` : ""}

                ${this._history.length ? html`
                    <div class="section-label">
                        ${localize('panel.dialog.edit_task.sections.history', lang)}
                    </div>
                    <div class="history-scroll">
                        ${renderHistoryList(this._history, this._history.length, this.hass.locale)}
                    </div>
                ` : nothing}

                ${dialogFooter(html`
                    <ha-button
                        data-dialog="close"
                        appearance="plain"
                        slot="secondaryAction"
                        @click=${this._close}
                    >
                        ${localize('panel.dialog.edit_task.actions.cancel', lang)}
                    </ha-button>
                    <ha-button slot="primaryAction" @click=${this._handleSaveClick}>
                        ${localize('panel.dialog.edit_task.actions.save', lang)}
                    </ha-button>
                `)}
            </ha-dialog>
        `;
    }

    static styles = [commonStyle, taskFieldStyles, historyStyles, css`
        .section-label {
            font-weight: 500;
            color: var(--secondary-text-color);
            margin: 20px 0 12px;
        }

        .test-notification {
            margin-top: 12px;
        }
    `];
}

if (!customElements.get('hm-edit-dialog')) customElements.define('hm-edit-dialog', HMEditDialog)

declare global {
    interface HTMLElementTagNameMap {
        'hm-edit-dialog': HMEditDialog;
    }
}

export type { HMEditDialog };
