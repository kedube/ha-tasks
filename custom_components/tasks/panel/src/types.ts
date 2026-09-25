import { localize } from '../localize/localize'

export type IntervalType = "days" | "weeks" | "months" | "years";

export const INTERVAL_TYPES: IntervalType[] = ["days", "weeks", "months", "years"];

// Approximate day length of one interval unit, for sort keys. A Record over
// IntervalType so adding a unit without an entry is a compile error instead
// of a silently wrong sort.
export const INTERVAL_TYPE_DAYS: Record<IntervalType, number> = {
    days: 1,
    weeks: 7,
    months: 30,
    years: 365,
};

// Mirror of the backend's MAX_STRING_LENGTH cap on free-text fields
// (const.py). Applied where the panel renders a plain input (the complete
// dialog's note field); ha-selector text fields rely on the API's own cap.
export const MAX_TEXT_LENGTH = 500;

export function getIntervalTypeLabels(lang: string): Record<IntervalType, string> {
    return {
        days: localize("intervals.days", lang),
        weeks: localize("intervals.weeks", lang),
        months: localize("intervals.months", lang),
        years: localize("intervals.years", lang),
    };
}

export interface IntegrationConfig {
    data: Record<string, any>;
    options: Record<string, any>;
    version?: string;
    /** The "Due soon" window in days (the due_soon_days option or its default). */
    due_soon_days: number;
}

export interface Label {
    label_id: string;
    name: string;
    color?: string;
    icon?: string;
}

export interface EntityRegistryEntry {
    entity_id: string;
    unique_id: string;
    platform: string;
    device_id?: string;
    disabled_by?: string | null;
    area_id?: string | null;
    original_name?: string;
    icon?: string;
    labels: string[];
}

export type TriggerType = "time" | "date" | "count" | "runtime";

export type NotifyWhen = "due" | "overdue" | "due_and_overdue";

export interface HistoryEntry {
    performed: string;
    recorded_at?: string | null;
    note?: string | null;
}

export interface Task {
    id: string;
    title: string;
    interval_value: number;
    interval_type: IntervalType;
    last_performed: string;
    anchor_date?: string | null;
    // Seasonal restriction for time-based tasks: months (1-12) the task is
    // active in. Empty/absent means year-round.
    active_months?: number[];
    tag_id?: string;
    icon?: string;
    trigger_type?: TriggerType;
    count_entity_id?: string;
    count_threshold?: number;
    current_count?: number;
    runtime_entity_id?: string;
    runtime_threshold?: number;
    runtime_baseline?: number;
    area_id?: string | null;
    description?: string | null;
    group_id?: string | null;
    notifications_enabled?: boolean;
    notification_target?: string | null;
    notification_time?: string | null;
    notification_url?: string | null;
    notify_when?: NotifyWhen;
    notify_days_before_due?: number | null;
    snooze_until?: string | null;
    // Completion history, newest last. Integration-managed (read-only).
    history?: HistoryEntry[];
    // Computed by the backend (store.serialize) so the panel renders trigger
    // state without reimplementing trigger semantics.
    due?: boolean;
    next_due?: string | null;
    progress_current?: number | null;
    progress_target?: number | null;
}

export interface TaskFormData {
    title: string;
    trigger_type: TriggerType;
    interval_value: number | "";
    interval_type: string;
    last_performed: string;
    anchor_date: string;
    // Month numbers as strings — the HA select selector round-trips string
    // values; the websocket payload converts back to numbers.
    active_months: string[];
    icon: string;
    label: string[];
    tag: string;
    count_entity_id: string;
    count_threshold: number | "";
    runtime_entity_id: string;
    runtime_threshold: number | "";
    area: string;
    description: string;
    group_id: string;
    notifications_enabled: boolean;
    notification_target: string;
    notification_time: string;
    notification_url: string;
    notify_when: NotifyWhen;
    notify_days_before_due: number | "";
}
