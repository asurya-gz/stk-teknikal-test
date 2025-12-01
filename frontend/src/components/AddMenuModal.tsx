'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useMenuStore } from '@/store/menuStore';
import { CreateMenuDto } from '@/types/menu';

interface AddMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentId?: string | null;
}

export default function AddMenuModal({ isOpen, onClose, parentId }: AddMenuModalProps) {
  const { createMenu, menus } = useMenuStore();
  const [formData, setFormData] = useState<CreateMenuDto>({
    name: '',
    url: '',
    icon: '',
    parentId: parentId || null,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        url: '',
        icon: '',
        parentId: parentId || null,
      });
    }
  }, [isOpen, parentId]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const data: CreateMenuDto = {
        name: formData.name,
        url: formData.url || undefined,
        icon: formData.icon || undefined,
        parentId: formData.parentId,
      };
      await createMenu(data);
      onClose();
    } catch (error) {
      console.error('Failed to create menu:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Find parent menu name
  const findParentName = (id: string | null): string => {
    if (!id) return 'Root Level';
    const findMenu = (menus: any[], targetId: string): any => {
      for (const menu of menus) {
        if (menu.id === targetId) return menu;
        if (menu.children) {
          const found = findMenu(menu.children, targetId);
          if (found) return found;
        }
      }
      return null;
    };
    const parent = findMenu(menus, id);
    return parent?.name || 'Unknown';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add New Menu</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Parent Info */}
          {parentId && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Parent:</span> {findParentName(parentId)}
              </p>
            </div>
          )}

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Menu Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input-field"
              placeholder="Enter menu name"
              autoFocus
            />
          </div>

          {/* URL */}
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
              URL <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="input-field"
              placeholder="/path/to/page"
            />
          </div>

          {/* Icon */}
          <div>
            <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">
              Icon <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              id="icon"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              className="input-field"
              placeholder="icon-name"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || !formData.name}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Creating...' : 'Create Menu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
