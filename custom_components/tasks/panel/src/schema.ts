import { localize } from '../localize/localize';
import { INTERVAL_TYPES, getIntervalTypeLabels, Task, TaskFormData, EntityRegistryEntry, Label } from './types';

export const emptyTaskFormData = (): TaskFormData => ({
    title: "",
    trigger_type: "time",
    interval_value: "",
    interval_type: "days",
    last_performed: "",
    anchor_date: "",
    active_months: [],
    icon: "",
    label: [],
    tag: "",
    count_entity_id: "",
    count_threshold: "",
    runtime_entity_id: "",
    runtime_threshold: "",
    area: "",
    description: "",
    group_id: "",
    notifications_enabled: false,
    notification_target: "",
    notification_time: "09:00",
    notification_url: "",
    notify_when: "due_and_overdue",
    notify_days_before_due: "",
});

export const taskToFormData = (
    task: Task,
    entity: EntityRegistryEntry | undefined,
    labels: Label[],
): TaskFormData => ({
    title: task.title,
    trigger_type: task.trigger_type ?? "time",
    interval_value: task.interval_value,
    interval_type: task.interval_type,
    last_performed: task.last_performed ?? "",
    anchor_date: task.anchor_date ?? "",
    active_months: (task.active_months ?? []).map(String),
    icon: task.icon ?? "",
    label: labels.map((l) => l.label_id),
    tag: task.tag_id ?? "",
    count_entity_id: task.count_entity_id ?? "",
    count_threshold: task.count_threshold ?? "",
    runtime_entity_id: task.runtime_entity_id ?? "",
    runtime_threshold: task.runtime_threshold ?? "",
    area: entity?.area_id ?? "",
    description: task.description ?? "",
    group_id: task.group_id ?? "",
    notifications_enabled: task.notifications_enabled ?? false,
    notification_target: task.notification_target ?? "",
    notification_time: task.notification_time ?? "09:00",
    notification_url: task.notification_url ?? "",
    notify_when: task.notify_when ?? "due_and_overdue",
    notify_days_before_due: task.notify_days_before_due ?? "",
});

const triggerTypeSelector = (lang: string) => ({
    name: "trigger_type",
    required: true,
    selector: {
        select: {
            options: [
                { value: "time", label: localize("trigger_types.time", lang) },
                { value: "date", label: localize("trigger_types.date", lang) },
                { value: "count", label: localize("trigger_types.count", lang) },
                { value: "runtime", label: localize("trigger_types.runtime", lang) },
            ],
            mode: "dropdown",
        },
    },
});

/** Localized month names (1-12) from Intl, so no per-language keys needed. */
export const monthOptions = (lang: string): { value: string; label: string }[] => {
    let formatter: Intl.DateTimeFormat;
    try {
        formatter = new Intl.DateTimeFormat(lang, { month: "long" });
    } catch {
        formatter = new Intl.DateTimeFormat("en", { month: "long" });
    }
    return Array.from({ length: 12 }, (_, index) => ({
        value: String(index + 1),
        // Noon dodges timezone edge cases around the month boundary.
        label: formatter.format(new Date(2026, index, 1, 12)),
    }));
};

/** Seasonal month multi-select, shown for time-based tasks. */
const activeMonthsField = (lang: string) => ({
    name: "active_months",
    selector: {
        select: {
            options: monthOptions(lang),
            multiple: true,
            mode: "dropdown",
        },
    },
});

const intervalTypeField = (lang: string) => ({
    name: "interval_type",
    required: true,
    selector: {
        select: {
            options: INTERVAL_TYPES.map((type) => ({
                value: type,
                label: getIntervalTypeLabels(lang)[type],
            })),
            mode: "dropdown",
        },
    },
});

const triggerFields = (formData: TaskFormData, lang: string): any[] => {
    if (formData.trigger_type === "date") {
        return [
            { name: "anchor_date", required: true, selector: { date: {} }, },
            { name: "interval_value", required: true, selector: { number: { min: 1, mode: "box" } }, },
            intervalTypeField(lang),
        ];
    }
    if (formData.trigger_type === "count") {
        return [
            { name: "count_entity_id", required: true, selector: { entity: {} }, },
            { name: "count_threshold", required: true, selector: { number: { min: 1, mode: "box" } }, },
        ];
    }
    if (formData.trigger_type === "runtime") {
        return [
            { name: "runtime_entity_id", required: true, selector: { entity: { filter: { domain: "sensor" } } }, },
            { name: "runtime_threshold", required: true, selector: { number: { min: 0.1, step: 0.1, mode: "box" } }, },
        ];
    }
    return [
        { name: "interval_value", required: true, selector: { number: { min: 1, mode: "box" } }, },
        intervalTypeField(lang),
        activeMonthsField(lang),
    ];
};

/** Group dropdown that also accepts a typed-in (new) group name. */
export const groupSelector = (groups: string[], lang: string) => ({
    name: "group_id",
    selector: {
        select: {
            options: [
                { value: "", label: localize("common.ungrouped", lang) },
                ...groups.map((group) => ({ value: group, label: group })),
            ],
            mode: "dropdown",
            custom_value: true,
        },
    },
});

/**
 * Main task fields, rendered on one line in the add form (wraps on narrow
 * screens): title | trigger type | the trigger's two fields.
 */
export const basicFields = (formData: TaskFormData, lang: string): any[] => [
    { name: "title", required: true, selector: { text: {} }, },
    triggerTypeSelector(lang),
    ...triggerFields(formData, lang),
];

/**
 * Last performed is optional on creation (blank = today, or anchor-pending
 * for fixed-date tasks), so the add form tucks it into Optional settings;
 * the edit dialog keeps it on the main row, where adjusting the last
 * completion date is a primary action.
 */
export const lastPerformedField = { name: "last_performed", selector: { date: {} } };

/** Optional fields, rendered left-to-right on the expansion panel's line. */
export const optionalFieldList = (groups: string[], lang: string): any[] => [
    groupSelector(groups, lang),
    { name: "icon", selector: { icon: {} }, },
    { name: "tag", selector: { entity: { filter: { domain: "tag" } } }, },
    { name: "area", selector: { area: {} }, },
    { name: "label", selector: { label: { multiple: true } }, },
];

export const descriptionField = (multiline: boolean) => (
    { name: "description", selector: { text: multiline ? { multiline: true } : {} } }
);

/**
 * Notification settings fields. Collapsed to just the enable toggle until
 * notifications are turned on; the due-soon offset only applies to
 * time-based tasks (count/runtime tasks have no due date to count down to).
 */
export const notificationFieldList = (
    formData: TaskFormData,
    notifyServices: string[],
    lang: string,
): any[] => {
    const toggle = { name: "notifications_enabled", selector: { boolean: {} } };
    if (!formData.notifications_enabled) return [toggle];

    return [
        toggle,
        {
            name: "notification_target",
            selector: {
                select: {
                    options: [
                        { value: "", label: localize("common.none", lang) },
                        ...notifyServices.map((service) => ({ value: service, label: service })),
                    ],
                    mode: "dropdown",
                    custom_value: true,
                },
            },
        },
        {
            name: "notify_when",
            selector: {
                select: {
                    options: [
                        { value: "due", label: localize("notifications.when.due", lang) },
                        { value: "overdue", label: localize("notifications.when.overdue", lang) },
                        { value: "due_and_overdue", label: localize("notifications.when.due_and_overdue", lang) },
                    ],
                    mode: "dropdown",
                },
            },
        },
        ...(formData.trigger_type === "time" || formData.trigger_type === "date"
            ? [{ name: "notify_days_before_due", selector: { number: { min: 1, mode: "box" } } }]
            : []),
        { name: "notification_time", selector: { time: { no_second: true } } },
        { name: "notification_url", selector: { text: {} } },
    ];
};

/** Validate required fields per trigger type. Returns true when valid. */
export const validateTaskForm = (data: TaskFormData): boolean => {
    if (!data.title?.trim()) return false;
    if (data.trigger_type === "count") {
        return Boolean(data.count_entity_id?.trim() && data.count_threshold);
    }
    if (data.trigger_type === "runtime") {
        return Boolean(data.runtime_entity_id?.trim() && data.runtime_threshold);
    }
    if (data.trigger_type === "date") {
        return Boolean(data.anchor_date?.trim() && data.interval_value && data.interval_type);
    }
    return Boolean(data.interval_value && data.interval_type);
};

/** Midnight-floored ISO date from a form date string; null when invalid. */
export const computeISODate = (dateStr: string): string | null => {
    if (!dateStr) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return today.toISOString();
    }
    // Only take the YYYY-MM-DD part to avoid time zone issues
    const [yearStr, monthStr, dayStr] = dateStr.split("T")[0].split("-");
    const year = Number(yearStr);
    const month = Number(monthStr);
    const day = Number(dayStr);
    if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
    const parsedDate = new Date(year, month - 1, day);
    parsedDate.setHours(0, 0, 0, 0);
    return parsedDate.toISOString();
};

const notificationPayloadFields = (data: TaskFormData): Record<string, any> => ({
    notifications_enabled: data.notifications_enabled ?? false,
    notification_target: data.notification_target?.trim() || null,
    notification_time: data.notification_time?.trim() || "09:00",
    notification_url: data.notification_url?.trim() || null,
    notify_when: data.notify_when || "due_and_overdue",
    notify_days_before_due:
        data.notify_days_before_due === "" || data.notify_days_before_due == null
            ? null
            : Number(data.notify_days_before_due),
});

const triggerPayloadFields = (data: TaskFormData): Record<string, any> => {
    const isCount = data.trigger_type === "count";
    const isRuntime = data.trigger_type === "runtime";
    const isDate = data.trigger_type === "date";
    const isTime = !isCount && !isRuntime && !isDate;
    return {
        trigger_type: data.trigger_type || "time",
        interval_value: (isCount || isRuntime) ? 1 : Number(data.interval_value),
        interval_type: (isCount || isRuntime) ? "days" : data.interval_type,
        // The selector emits YYYY-MM-DD; keep just the date part defensively.
        anchor_date: isDate ? (data.anchor_date?.trim().split("T")[0] || null) : null,
        // Seasonal months only apply to time-based schedules.
        active_months: isTime ? (data.active_months ?? []).map(Number) : [],
        count_entity_id: isCount ? (data.count_entity_id?.trim() || null) : null,
        count_threshold: isCount ? Number(data.count_threshold) : 0,
        runtime_entity_id: isRuntime ? (data.runtime_entity_id?.trim() || null) : null,
        runtime_threshold: isRuntime ? Number(data.runtime_threshold) : 0,
    };
};

export const taskFormToAddPayload = (data: TaskFormData, lastPerformedISO: string): Record<string, any> => {
    const trigger = triggerPayloadFields(data);
    // A blank "last performed" on a fixed-date task must reach the backend
    // as *absent* so its anchor-pending default applies (a past anchor is
    // immediately due); sending "today" would silently defer it a full
    // interval. For every other trigger blank means "performed today".
    const omitLastPerformed =
        data.trigger_type === "date" && !data.last_performed?.trim();
    return {
        title: data.title.trim(),
        interval_value: trigger.interval_value,
        interval_type: trigger.interval_type,
        trigger_type: trigger.trigger_type,
        ...(omitLastPerformed ? {} : { last_performed: lastPerformedISO }),
        tag_id: data.tag?.trim() || undefined,
        icon: data.icon?.trim() || "mdi:calendar-check",
        labels: data.label ?? [],
        area_id: data.area?.trim() || undefined,
        description: data.description || undefined,
        group_id: data.group_id?.trim() || undefined,
        ...(trigger.anchor_date ? { anchor_date: trigger.anchor_date } : {}),
        ...(trigger.active_months.length ? { active_months: trigger.active_months } : {}),
        ...(trigger.count_entity_id ? { count_entity_id: trigger.count_entity_id, count_threshold: trigger.count_threshold } : {}),
        ...(trigger.runtime_entity_id ? { runtime_entity_id: trigger.runtime_entity_id, runtime_threshold: trigger.runtime_threshold } : {}),
        ...notificationPayloadFields(data),
    };
};

export const taskFormToUpdates = (data: TaskFormData, lastPerformedISO: string): Record<string, any> => ({
    title: data.title.trim(),
    ...triggerPayloadFields(data),
    last_performed: lastPerformedISO,
    icon: data.icon?.trim() || "mdi:calendar-check",
    labels: data.label,
    tag_id: data.tag?.trim() || null,
    area_id: data.area?.trim() || null,
    description: data.description ?? "",
    group_id: data.group_id?.trim() || null,
    ...notificationPayloadFields(data),
});
