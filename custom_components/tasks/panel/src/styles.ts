import { css } from 'lit';

export const commonStyle = css`
    :host {
        color: var(--primary-text-color);
        background: var(--lovelace-background, var(--primary-background-color));
    }

    .header {
        background-color: var(--app-header-background-color);
        color: var(--app-header-text-color, white);
        border-bottom: var(--app-header-border-bottom, none);
    }

    .toolbar {
        height: var(--header-height);
        display: flex;
        align-items: center;
        font-size: 20px;
        padding: 0 16px;
        font-weight: 400;
        box-sizing: border-box;
    }

    .main-title {
        margin: 0 0 0 24px;
        line-height: 20px;
        flex-grow: 1;
    }

    .view {
        height: calc(100vh - 65px);
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 8px 16px;
        box-sizing: border-box;
    }

    ha-card {
        display: block;
        margin: 5px;
    }

    ha-expansion-panel {
        --input-fill-color: none;
    }

    .extras-panel{
        margin-bottom: 14px;
    }

    .warning {
        --mdc-theme-primary: var(--error-color);
        color: var(--primary-text-color);
    }

    ha-dialog {
        --mdc-dialog-min-width: 600px;
    }

    @media (max-width: 600px) {
        ha-dialog {
        --mdc-dialog-min-width: auto;
        }
    }
`;
/**
 * Shared look of the task list, group nav, and panel chrome: the status
 * palette, a reset for the native buttons they build on, icon buttons, and
 * count badges. Status colors (--todo-*) follow the theme's error,
 * warning, primary, and success colors.
 */
export const baseStyles = css`
        :host {
            /* Status colors, from the theme. */
            --todo-overdue: var(--error-color, #db4437);
            --todo-due-soon: var(--warning-color, #ffa726);
            --todo-upcoming: var(--primary-color, #03a9f4);
            --todo-done: var(--success-color, #43a047);

            --hm-subtle: color-mix(in srgb, var(--primary-text-color) 5%, transparent);
            --hm-hover: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
            --hm-c: var(--todo-upcoming);
        }

        /* Status scopes: --hm-c is the raw status color, --hm-ink the same
           hue pulled toward the text color so it stays legible as text on
           both light and dark themes (plain amber on white is not). */
        .overdue { --hm-c: var(--todo-overdue); }
        .due_soon { --hm-c: var(--todo-due-soon); }
        .upcoming { --hm-c: var(--todo-upcoming); }
        .done { --hm-c: var(--todo-done); }
        .overdue, .due_soon, .upcoming, .done, :host {
            --hm-ink: color-mix(in srgb, var(--hm-c) 78%, var(--primary-text-color));
        }

        button {
            font: inherit;
            color: inherit;
            background: none;
            border: none;
            margin: 0;
            padding: 0;
            cursor: pointer;
            -webkit-tap-highlight-color: transparent;
        }

        button:focus-visible {
            outline: 2px solid var(--primary-color);
            outline-offset: 2px;
        }

        .icon-button {
            flex-shrink: 0;
            display: grid;
            place-items: center;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            color: var(--secondary-text-color);
            transition: background-color 0.15s, color 0.15s;
            --mdc-icon-size: 20px;
        }

        .icon-button:hover {
            background: var(--hm-subtle);
            color: var(--primary-text-color);
        }

        .icon-button.active {
            color: var(--primary-color);
            background: color-mix(in srgb, var(--primary-color) 12%, transparent);
        }

        .icon-button.small {
            width: 28px;
            height: 28px;
            --mdc-icon-size: 18px;
        }

        .chip-badge {
            display: inline-grid;
            place-items: center;
            min-width: 20px;
            height: 20px;
            padding: 0 6px;
            box-sizing: border-box;
            border-radius: 10px;
            font-size: 11px;
            font-weight: 700;
            background: color-mix(in srgb, var(--hm-c) 22%, transparent);
            color: var(--hm-ink);
        }
`;
