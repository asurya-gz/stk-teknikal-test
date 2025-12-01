import { create } from 'zustand';
import { Menu, CreateMenuDto, UpdateMenuDto } from '@/types/menu';
import { menuApi } from '@/lib/api';

interface MenuState {
  menus: Menu[];
  selectedMenu: Menu | null;
  isLoading: boolean;
  error: string | null;
  expandedIds: Set<string>;
  searchQuery: string;

  // Actions
  fetchMenus: () => Promise<void>;
  createMenu: (data: CreateMenuDto) => Promise<void>;
  updateMenu: (id: string, data: UpdateMenuDto) => Promise<void>;
  deleteMenu: (id: string) => Promise<void>;
  moveMenu: (menuId: string, newParentId: string | null) => Promise<void>;
  selectMenu: (menu: Menu | null) => void;
  toggleExpand: (id: string) => void;
  ensureExpanded: (id: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
  setSearchQuery: (query: string) => void;
  setError: (error: string | null) => void;
}

export const useMenuStore = create<MenuState>((set, get) => ({
  menus: [],
  selectedMenu: null,
  isLoading: false,
  error: null,
  expandedIds: new Set(),
  searchQuery: '',

  fetchMenus: async () => {
    set({ isLoading: true, error: null });
    try {
      const menus = await menuApi.getAll();
      set({ menus, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch menus',
        isLoading: false
      });
    }
  },

  createMenu: async (data: CreateMenuDto) => {
    set({ isLoading: true, error: null });
    try {
      await menuApi.create(data);
      await get().fetchMenus();
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create menu',
        isLoading: false
      });
      throw error;
    }
  },

  updateMenu: async (id: string, data: UpdateMenuDto) => {
    set({ isLoading: true, error: null });
    try {
      await menuApi.update(id, data);
      await get().fetchMenus();
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update menu',
        isLoading: false
      });
      throw error;
    }
  },

  deleteMenu: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await menuApi.delete(id);
      await get().fetchMenus();
      set({ selectedMenu: null, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete menu',
        isLoading: false
      });
      throw error;
    }
  },

  moveMenu: async (menuId: string, newParentId: string | null) => {
    try {
      await menuApi.move(menuId, { newParentId: newParentId || undefined });
      await get().fetchMenus();
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to move menu',
        isLoading: false
      });
      throw error;
    }
  },

  selectMenu: (menu: Menu | null) => {
    set({ selectedMenu: menu });
  },

  toggleExpand: (id: string) => {
    const expandedIds = new Set(get().expandedIds);
    if (expandedIds.has(id)) {
      expandedIds.delete(id);
    } else {
      expandedIds.add(id);
    }
    set({ expandedIds });
  },

  ensureExpanded: (id: string) => {
    const expandedIds = new Set(get().expandedIds);
    expandedIds.add(id);
    set({ expandedIds });
  },

  expandAll: () => {
    const getAllIds = (menus: Menu[]): string[] => {
      return menus.flatMap(menu => [
        menu.id,
        ...(menu.children ? getAllIds(menu.children) : [])
      ]);
    };
    const allIds = getAllIds(get().menus);
    set({ expandedIds: new Set(allIds) });
  },

  collapseAll: () => {
    set({ expandedIds: new Set() });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));
