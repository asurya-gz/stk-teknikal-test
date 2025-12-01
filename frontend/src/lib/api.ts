import axios from 'axios';
import { Menu, CreateMenuDto, UpdateMenuDto, MoveMenuDto, ReorderMenuDto } from '@/types/menu';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const menuApi = {
  // Get all menus in tree structure
  getAll: async (): Promise<Menu[]> => {
    const response = await api.get<Menu[]>('/api/menus');
    return response.data;
  },

  // Get single menu by ID
  getOne: async (id: string): Promise<Menu> => {
    const response = await api.get<Menu>(`/api/menus/${id}`);
    return response.data;
  },

  // Create new menu
  create: async (data: CreateMenuDto): Promise<Menu> => {
    const response = await api.post<Menu>('/api/menus', data);
    return response.data;
  },

  // Update menu
  update: async (id: string, data: UpdateMenuDto): Promise<Menu> => {
    const response = await api.put<Menu>(`/api/menus/${id}`, data);
    return response.data;
  },

  // Delete menu
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/menus/${id}`);
  },

  // Move menu to different parent
  move: async (id: string, data: MoveMenuDto): Promise<Menu> => {
    const response = await api.patch<Menu>(`/api/menus/${id}/move`, data);
    return response.data;
  },

  // Reorder menu within same level
  reorder: async (id: string, data: ReorderMenuDto): Promise<Menu> => {
    const response = await api.patch<Menu>(`/api/menus/${id}/reorder`, data);
    return response.data;
  },
};
