'use client';

import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { useMenuStore } from '@/store/menuStore';
import { Menu, UpdateMenuDto } from '@/types/menu';

const findMenuById = (menuList: Menu[], id: string): Menu | null => {
  for (const menu of menuList) {
    if (menu.id === id) return menu;
    if (menu.children) {
      const found = findMenuById(menu.children, id);
      if (found) return found;
    }
  }
  return null;
};

export default function MenuDetail() {
  const { selectedMenu, updateMenu, deleteMenu, menus, selectMenu } = useMenuStore();
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    icon: '',
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (selectedMenu) {
      setFormData({
        name: selectedMenu.name,
        url: selectedMenu.url || '',
        icon: selectedMenu.icon || '',
      });
    } else {
      setFormData({ name: '', url: '', icon: '' });
    }
  }, [selectedMenu]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      if (!selectedMenu) return;
      const updateData: UpdateMenuDto = {
        name: formData.name,
        url: formData.url || undefined,
        icon: formData.icon || undefined,
      };
      const nameChanged =
        formData.name !== selectedMenu.name ||
        formData.url !== (selectedMenu.url || '') ||
        formData.icon !== (selectedMenu.icon || '');

      if (nameChanged) {
        await updateMenu(selectedMenu.id, updateData);
      } else {
        return;
      }
      const refreshed = findMenuById(useMenuStore.getState().menus, selectedMenu.id);
      if (refreshed) {
        selectMenu(refreshed);
      }
    } catch (error) {
      console.error('Failed to save menu:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsSaving(true);
      if (!selectedMenu) return;
      await deleteMenu(selectedMenu.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Failed to delete menu:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Find parent menu name
  const getParentName = (parentId: string | null): string => {
    if (!parentId) return 'Root Level';
    const parent = findMenuById(menus, parentId);
    return parent ? parent.name : '-';
  };

  if (!selectedMenu) {
    return (
      <div className="flex h-full items-center justify-center text-center text-gray-400 text-sm">
        Select a menu from the tree to see its details.
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-[28px] bg-white p-8 shadow-sm border border-white/40">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gray-400">
          Menu Detail
        </p>
        <h3 className="mt-3 text-2xl font-semibold text-gray-900">{selectedMenu.name}</h3>
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto pr-2">
        <div>
          <label className="detail-label">Menu ID</label>
          <div className="detail-pill">{selectedMenu.id}</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="detail-label">Depth</label>
            <div className="detail-input" data-disabled>
              {selectedMenu.depth}
            </div>
          </div>
          <div>
            <label className="detail-label">Parent Menu</label>
            <div className="detail-input" data-disabled>
              {getParentName(selectedMenu.parentId)}
            </div>
          </div>
        </div>

        <div>
          <label className="detail-label">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="detail-field"
            placeholder="Enter menu name"
          />
        </div>
      </div>

      <div className="mt-10 space-y-4 border-t border-gray-100 pt-6">
        <button
          onClick={handleSave}
          disabled={isSaving || !formData.name}
          className="primary-save disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center justify-center gap-2 text-sm font-medium text-red-500 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
            Delete Menu
          </button>
        ) : (
          <div className="space-y-3 text-center text-sm text-gray-500">
            <p>This will delete this menu and all of its children.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                type="button"
                className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isSaving}
                className="flex-1 rounded-full bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600 disabled:opacity-50"
              >
                {isSaving ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
