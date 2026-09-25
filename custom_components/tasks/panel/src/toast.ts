import { fireEvent } from "custom-card-helpers";

/**
 * Show a Home Assistant toast notification. Bubbles (composed) from the
 * given element up to the <home-assistant> root, which renders the toast —
 * works from both the sidebar panel and Lovelace cards, unlike the native
 * alert()/confirm() dialogs that companion apps may suppress entirely.
 */
export const showToast = (el: HTMLElement, message: string): void => {
    fireEvent(el, "hass-notification" as any, { message });
};
