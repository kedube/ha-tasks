import { LitElement, html } from "lit";
import { property, query, state } from "lit/decorators.js";
import type { HomeAssistant } from "custom-card-helpers";

import { localize } from '../../localize/localize';
import { commonStyle } from '../styles';
import { dialogFooter } from '../util';
import { TaskFormData } from '../types';
import './task-form';

/**
 * The panel's add-task dialog: hm-task-form with its actions in the dialog
 * footer. Call open() (optionally with template values to prefill). A
 * successful add closes the dialog; the form's `task-added` event bubbles on
 * to the panel for the toast. "Browse templates" fires `browse-templates`.
 */
class HMAddTaskDialog extends LitElement {
    @property() hass?: HomeAssistant;
    @property({ attribute: false }) groups: string[] = [];

    @state() private _open = false;
    @state() private _submitting = false;

    @query('hm-task-form') private _form?: any;

    public async open(prefill?: Partial<TaskFormData>) {
        this._open = true;
        await this.updateComplete;
        if (prefill) this._form?.prefill(prefill);
    }

    private _close() {
        this._open = false;
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

    private _browseTemplates() {
        this._close();
        this.dispatchEvent(new CustomEvent('browse-templates', { bubbles: true, composed: true }));
    }

    render() {
        if (!this.hass || !this._open) return html``;
        const lang = this.hass.language;

        return html`
            <ha-dialog
                open
                heading=${localize('panel.cards.new.title', lang)}
                header-title=${localize('panel.cards.new.title', lang)}
                prevent-scrim-close
                @closed=${this._close}
            >
                <hm-task-form
                    .hass=${this.hass}
                    .groups=${this.groups}
                    @task-added=${this._close}
                ></hm-task-form>

                ${dialogFooter(html`
                    <ha-button appearance="plain" slot="secondaryAction" @click=${this._browseTemplates}>
                        ${localize('panel.cards.current.filter.templates', lang)}
                    </ha-button>
                    <ha-button
                        data-dialog="close"
                        appearance="plain"
                        slot="secondaryAction"
                        @click=${this._close}
                    >
                        ${localize('common.cancel', lang)}
                    </ha-button>
                    <ha-button
                        slot="primaryAction"
                        class="submit-button"
                        ?disabled=${this._submitting}
                        @click=${this._submit}
                    >
                        ${localize('panel.cards.new.actions.add_task', lang)}
                    </ha-button>
                `)}
            </ha-dialog>
        `;
    }

    static styles = commonStyle;
}

if (!customElements.get('hm-add-task-dialog')) customElements.define('hm-add-task-dialog', HMAddTaskDialog);

declare global {
    interface HTMLElementTagNameMap {
        'hm-add-task-dialog': HMAddTaskDialog;
    }
}

export type { HMAddTaskDialog };
