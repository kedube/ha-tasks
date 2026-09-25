import { LitElement, html } from "lit";
import { property, state } from "lit/decorators.js";
import type { HomeAssistant } from "custom-card-helpers";

import { localize } from '../../localize/localize';
import { commonStyle } from '../styles';
import { dialogFooter } from '../util';
import { updateTask } from '../data/websockets';
import { groupSelector } from '../schema';
import { Task } from '../types';

/** Quick "move to group" dialog. Call open(task) to show it. */
class HMMoveDialog extends LitElement {
    @property() hass?: HomeAssistant;
    @property({ attribute: false }) groups: string[] = [];

    @state() private _task: Task | null = null;
    @state() private _groupId = "";

    public open(task: Task) {
        this._task = task;
        this._groupId = task.group_id ?? "";
    }

    private _close() {
        this._task = null;
    }

    private async _handleMove() {
        if (!this._task) return;
        try {
            await updateTask(this.hass!, {
                task_id: this._task.id,
                updates: { group_id: this._groupId?.trim() || null },
            });
            this._close();
        } catch (e) {
            console.error("Failed to move task:", e);
        }
    }

    render() {
        if (!this.hass || !this._task) return html``;
        const lang = this.hass.language;

        return html`
            <ha-dialog
                open
                heading="${localize('panel.dialog.move_task.title', lang)}: ${this._task.title}"
                header-title="${localize('panel.dialog.move_task.title', lang)}: ${this._task.title}"
                @closed=${this._close}
            >
                <ha-form
                    .hass=${this.hass}
                    .schema=${[groupSelector(this.groups, lang)]}
                    .computeLabel=${() => localize('panel.dialog.move_task.fields.group_id.heading', lang)}
                    .data=${{ group_id: this._groupId }}
                    @value-changed=${(e: CustomEvent) => (this._groupId = e.detail.value.group_id ?? "")}
                ></ha-form>

                ${dialogFooter(html`
                    <ha-button
                        data-dialog="close"
                        appearance="plain"
                        slot="secondaryAction"
                        @click=${this._close}
                    >
                        ${localize('panel.dialog.move_task.actions.cancel', lang)}
                    </ha-button>
                    <ha-button slot="primaryAction" @click=${this._handleMove}>
                        ${localize('panel.dialog.move_task.actions.move', lang)}
                    </ha-button>
                `)}
            </ha-dialog>
        `;
    }

    static styles = commonStyle;
}

if (!customElements.get('hm-move-dialog')) customElements.define('hm-move-dialog', HMMoveDialog)

declare global {
    interface HTMLElementTagNameMap {
        'hm-move-dialog': HMMoveDialog;
    }
}

export type { HMMoveDialog };
