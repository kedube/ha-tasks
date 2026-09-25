import type { HomeAssistant } from "custom-card-helpers";
import type { ReactiveControllerHost } from "lit";

import { localize } from '../../localize/localize';
import { Task } from '../types';
import { formatProgress, formatTriggerInterval, isDatedTrigger } from '../compute';
import { showToast } from '../toast';
import { completeTask, removeTask } from '../data/websockets';
import type { ConfirmOptions, HMConfirmDialog } from './confirm-dialog';

/**
 * Confirm-then-act flows for completing and removing a task, kept apart from
 * the task list so the confirmation wording, toasts, and error handling live
 * in one place.
 *
 * `host` anchors the toast; `dialog` is the caller's <hm-confirm-dialog>.
 * `run` wraps the network action so a caller (the task list) can manage its
 * own in-flight UI state around it; it defaults to running the action as-is.
 */

type ToastHost = ReactiveControllerHost & HTMLElement;
type RunWrapper = (action: () => Promise<void>) => Promise<void> | void;

const completeMessage = (hass: HomeAssistant, task: Task): ConfirmOptions => {
    const lang = hass.language;
    const isDated = isDatedTrigger(task);
    // formatTriggerInterval renders the time span for dated tasks; for
    // count/runtime tasks the progress-oriented message uses the target.
    const interval = isDated ? formatTriggerInterval(task, lang) : formatProgress(task);
    return {
        heading: localize('panel.dialog.confirm_complete.title', lang),
        message: localize(
            isDated
                ? 'panel.dialog.confirm_complete.message'
                : 'panel.dialog.confirm_complete.message_progress',
            lang, '{title}', task.title, '{interval}', interval,
        ),
        confirmLabel: localize('panel.dialog.confirm_complete.actions.confirm', lang),
        cancelLabel: localize('common.cancel', lang),
        input: { label: localize('panel.dialog.confirm_complete.note_label', lang) },
        onConfirm: () => { /* set per-caller below */ },
    };
};

export const confirmCompleteTask = (
    host: ToastHost,
    dialog: HMConfirmDialog | undefined,
    hass: HomeAssistant,
    task: Task,
    run: RunWrapper = (action) => action(),
): void => {
    const lang = hass.language;
    dialog?.open({
        ...completeMessage(hass, task),
        onConfirm: (note) => run(async () => {
            try {
                await completeTask(hass, task.id, note);
                showToast(host, localize(
                    'panel.cards.current.alerts.complete_success', lang, '{title}', task.title,
                ));
            } catch (e) {
                console.error("Failed to complete task:", e);
                showToast(host, localize('panel.cards.current.alerts.complete_error', lang));
            }
        }),
    });
};

export const confirmRemoveTask = (
    host: ToastHost,
    dialog: HMConfirmDialog | undefined,
    hass: HomeAssistant,
    task: Task | undefined,
    taskId: string,
): void => {
    const lang = hass.language;
    dialog?.open({
        heading: localize('panel.dialog.confirm_remove.title', lang),
        message: localize(
            'panel.dialog.confirm_remove.message', lang, '{title}', task?.title ?? '',
        ),
        confirmLabel: localize('panel.dialog.confirm_remove.actions.confirm', lang),
        cancelLabel: localize('common.cancel', lang),
        destructive: true,
        onConfirm: async () => {
            try {
                await removeTask(hass, taskId);
            } catch (e) {
                console.error("Failed to remove task:", e);
                showToast(host, localize('panel.cards.current.alerts.remove_error', lang));
            }
        },
    });
};
