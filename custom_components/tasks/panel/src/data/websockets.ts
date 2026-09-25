import { EntityRegistryEntry, Task, IntegrationConfig, Label } from '../types';
import type { HomeAssistant } from "custom-card-helpers";

export const loadRegistryEntries = (hass: HomeAssistant): Promise<EntityRegistryEntry[]> =>
    hass.callWS({
        type: "config/entity_registry/list",
    });

export const loadLabelRegistry = (hass: HomeAssistant): Promise<Label[]> =>
    hass.callWS({
        type: "config/label_registry/list",
    });

export const loadTasks = (hass: HomeAssistant): Promise<Task[]> =>
    hass.callWS({
        type: 'tasks/get_tasks',
    });

export const loadTask = (hass: HomeAssistant, id: string): Promise<Task> =>
    hass.callWS({
        type: 'tasks/get_task',
        task_id: id,
    })

export const saveTask = (hass: HomeAssistant, payload: Record<string, any>): Promise<void> =>
    hass.callWS({
        type: 'tasks/add_task',
        ...payload,
    })

export const removeTask = (hass: HomeAssistant, id: string): Promise<void> =>
    hass.callWS({
        type: 'tasks/remove_task',
        task_id: id,
    });

export const completeTask = (hass: HomeAssistant, id: string, note?: string): Promise<void> =>
    hass.callWS({
        type: 'tasks/complete_task',
        task_id: id,
        ...(note ? { note } : {}),
    })

export const updateTask = (hass: HomeAssistant, payload: Record<string, any>): Promise<void> =>
    hass.callWS({
        type: 'tasks/update_task',
        ...payload,
    })

export const loadGroups = (hass: HomeAssistant): Promise<string[]> =>
    hass.callWS({
        type: 'tasks/get_groups',
    })

export const createGroup = (hass: HomeAssistant, groupId: string): Promise<void> =>
    hass.callWS({
        type: 'tasks/create_group',
        group_id: groupId,
    })

export const renameGroup = (hass: HomeAssistant, oldGroupId: string, newGroupId: string): Promise<void> =>
    hass.callWS({
        type: 'tasks/rename_group',
        old_group_id: oldGroupId,
        new_group_id: newGroupId,
    })

export const deleteGroup = (hass: HomeAssistant, groupId: string): Promise<void> =>
    hass.callWS({
        type: 'tasks/delete_group',
        group_id: groupId,
    })

export const getConfig = (hass: HomeAssistant): Promise<IntegrationConfig> =>
    hass.callWS({
        type: 'tasks/get_config',
    })
export const subscribeUpdates = (
    hass: HomeAssistant,
    onChange: () => void,
): Promise<() => Promise<void>> =>
    (hass.connection as any).subscribeMessage(onChange, {
        type: 'tasks/subscribe_updates',
    });
