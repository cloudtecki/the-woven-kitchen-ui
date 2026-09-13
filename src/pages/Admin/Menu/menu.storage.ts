import type { MenuItem } from 'core/base/type/menu';
import { MENU_MOCK_ITEMS } from 'pages/Admin/Menu/menu.mock';

const STORAGE_KEY = 'twk-menu-items-v1';

const readStored = (): MenuItem[] => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw) as MenuItem[];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

export const loadMenuItems = (): MenuItem[] => {
    const stored = readStored();
    const storedIds = new Set(stored.map((i) => i.id));
    // Stored (newly added/edited) items first so new cards slide into the grid top.
    return [...stored, ...MENU_MOCK_ITEMS.filter((m) => !storedIds.has(m.id))];
};

export const findMenuItem = (id: string): MenuItem | undefined =>
    loadMenuItems().find((i) => i.id === id);

export const upsertMenuItem = (item: MenuItem): MenuItem[] => {
    const current = loadMenuItems();
    const exists = current.some((i) => i.id === item.id);
    const next = exists
        ? current.map((i) => (i.id === item.id ? item : i))
        : [item, ...current];
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
        // UI-only: ignore persistence failures (private mode, quota).
    }
    return next;
};

export const removeMenuItem = (id: string): MenuItem[] => {
    const next = loadMenuItems().filter((i) => i.id !== id);
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
        // ignore
    }
    return next;
};
