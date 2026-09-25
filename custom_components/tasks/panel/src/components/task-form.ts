import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant } from "custom-card-helpers";

import { localize } from '../../localize/localize';
import { commonStyle } from '../styles';
import { showToast } from '../toast';
import { listNotifyServices } from '../util';
import { saveTask } from '../data/websockets';
import { renderTaskField, taskFieldStyles } from './task-fields';
import {
    basicFields,
    computeISODate,
    descriptionField,
    emptyTaskFormData,
    lastPerformedField,
    notificationFieldList,
    optionalFieldList,
    taskFormToAddPayload,
    validateTaskForm,
} from '../schema';
import { TaskFormData } from '../types';

/**
 * The add-task form: basic + optional field rows, rendered through the shared
 * task-field renderer. The host supplies the submit button and calls
 * submit(); a successful add fires `task-added` ({ title }) and resets the
 * form. Used by the panel's add-task dialog and the Add Task dashboard card.
 */
class HMTaskForm extends LitElement {
    @property() hass?: HomeAssistant;
    @property({ attribute: false }) groups: string[] = [];

    @state() private _formData: TaskFormData = emptyTaskFormData();
    private _advancedOpen = false;

    /** Prefill the form (used by the template library); keeps other fields. */
    public prefill(values: Partial<TaskFormData>) {
        this._formData = { ...this._formData, ...values };
    }

    /** Validate and create the task. */
    public async submit(): Promise<void> {
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
            const title = this._formData.title.trim();
            await saveTask(this.hass!, taskFormToAddPayload(this._formData, lastPerformedISO));
            this._formData = emptyTaskFormData();
            this.dispatchEvent(new CustomEvent('task-added', {
                detail: { title },
                bubbles: true,
                composed: true,
            }));
        } catch (error) {
            console.error("Failed to add task:", error);
            showToast(this, localize('panel.cards.new.alerts.error', this.hass!.language));
        }
    }

    private _handleFieldChanged = (name: string, ev: CustomEvent) => {
        ev.stopPropagation();
        this._formData = { ...this._formData, [name]: ev.detail.value };
    }

    private _renderField = (field: any) => renderTaskField({
        hass: this.hass!,
        keyPrefix: 'panel.cards.new.fields',
        data: this._formData,
        onChange: this._handleFieldChanged,
    }, field);

    render() {
        if (!this.hass) return html``;

        return html`
            <div class="fields-grid">
                ${basicFields(this._formData, this.hass.language).map(this._renderField)}
            </div>

            <ha-expansion-panel
                header="${localize('panel.cards.new.sections.optional', this.hass.language)}"
                .opened=${this._advancedOpen}
                @opened-changed=${(e: CustomEvent) => (this._advancedOpen = e.detail.value)}
                class="extras-panel"
            >
                <div class="fields-grid">
                    ${this._renderField(lastPerformedField)}
                    ${optionalFieldList(this.groups, this.hass.language).map(this._renderField)}
                    ${this._renderField(descriptionField(false))}
                </div>

                <div class="section-label">
                    ${localize('panel.cards.new.sections.notifications', this.hass.language)}
                </div>
                <div class="fields-grid">
                    ${notificationFieldList(this._formData, listNotifyServices(this.hass), this.hass.language).map(this._renderField)}
                </div>
            </ha-expansion-panel>
        `;
    }

    static styles = [commonStyle, taskFieldStyles, css`
        .section-label {
            font-weight: 500;
            color: var(--secondary-text-color);
            margin: 20px 0 12px;
        }
    `];
}

if (!customElements.get('hm-task-form')) customElements.define('hm-task-form', HMTaskForm)
