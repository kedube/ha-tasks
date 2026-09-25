import { LitElement, html, css, nothing } from "lit";
import { query, state } from "lit/decorators.js";

import { commonStyle } from '../styles';
import { MAX_TEXT_LENGTH } from '../types';
import { dialogFooter } from '../util';

export interface ConfirmOptions {
    heading: string;
    message: string;
    confirmLabel: string;
    cancelLabel: string;
    /** Style the confirm button as a destructive action. */
    destructive?: boolean;
    /** Optional free-text input (e.g. a completion note); its value is
     *  passed to onConfirm. */
    input?: { label: string; placeholder?: string };
    onConfirm: (inputValue?: string) => void;
}

/**
 * Generic confirmation dialog replacing the browser-native confirm(),
 * which looks foreign in Home Assistant and can be silently suppressed by
 * the companion apps. Call open({...}) with pre-localized strings.
 */
class HMConfirmDialog extends LitElement {
    @state() private _opts: ConfirmOptions | null = null;

    @query('.confirm-input') private _input?: HTMLInputElement;

    public open(opts: ConfirmOptions) {
        this._opts = opts;
    }

    private _close() {
        this._opts = null;
    }

    private _handleConfirm() {
        const onConfirm = this._opts?.onConfirm;
        const value = this._input?.value.trim() || undefined;
        this._close();
        onConfirm?.(value);
    }

    private _renderButtons() {
        return html`
            <ha-button
                data-dialog="close"
                appearance="plain"
                slot="secondaryAction"
                @click=${this._close}
            >
                ${this._opts!.cancelLabel}
            </ha-button>
            <ha-button
                slot="primaryAction"
                class="${this._opts!.destructive ? "warning" : ""}"
                @click=${this._handleConfirm}
            >
                ${this._opts!.confirmLabel}
            </ha-button>
        `;
    }

    render() {
        if (!this._opts) return html``;

        return html`
            <ha-dialog
                open
                heading="${this._opts.heading}"
                header-title="${this._opts.heading}"
                @closed=${this._close}
            >
                <p>${this._opts.message}</p>

                ${this._opts.input ? html`
                    <label class="confirm-input-label">
                        ${this._opts.input.label}
                        <input
                            class="confirm-input"
                            type="text"
                            maxlength=${MAX_TEXT_LENGTH}
                            placeholder=${this._opts.input.placeholder ?? ""}
                        />
                    </label>
                ` : nothing}

                ${dialogFooter(this._renderButtons())}
            </ha-dialog>
        `;
    }

    static styles = [commonStyle, css`
        .confirm-input-label {
            display: block;
            font-size: 12px;
            font-weight: 500;
            color: var(--secondary-text-color);
        }

        .confirm-input {
            display: block;
            width: 100%;
            box-sizing: border-box;
            margin-top: 4px;
            padding: 8px 10px;
            font-size: 14px;
            color: var(--primary-text-color);
            background: var(--secondary-background-color);
            border: 1px solid var(--divider-color);
            border-radius: 8px;
            outline: none;
        }
    `];
}

if (!customElements.get('hm-confirm-dialog')) customElements.define('hm-confirm-dialog', HMConfirmDialog)

declare global {
    interface HTMLElementTagNameMap {
        'hm-confirm-dialog': HMConfirmDialog;
    }
}

export type { HMConfirmDialog };
