'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { Menu } from '@/types/menu';
import { useMenuStore } from '@/store/menuStore';

interface MenuTreeItemProps {
  menu: Menu;
  level?: number;
  onAddChild?: (parentId: string) => void;
}

const findMenuById = (nodes: Menu[], id: string): Menu | null => {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findMenuById(node.children, id);
      if (found) return found;
    }
  }
  return null;
};

const isDescendant = (nodes: Menu[], rootId: string, targetId: string): boolean => {
  const root = findMenuById(nodes, rootId);
  if (!root || !root.children) return false;
  const stack = [...root.children];
  while (stack.length) {
    const current = stack.pop()!;
    if (current.id === targetId) return true;
    if (current.children) stack.push(...current.children);
  }
  return false;
};

export default function MenuTreeItem({ menu, level = 0, onAddChild }: MenuTreeItemProps) {
  const {
    menus,
    selectedMenu,
    selectMenu,
    expandedIds,
    toggleExpand,
    ensureExpanded,
    searchQuery,
    moveMenu,
  } = useMenuStore();
  const hasChildren = menu.children && menu.children.length > 0;
  const isExpanded = expandedIds.has(menu.id);
  const isSelected = selectedMenu?.id === menu.id;
  const [isDragOver, setIsDragOver] = useState(false);

  // Filter logic for search
  const matchesSearch = (menuItem: Menu, query: string): boolean => {
    if (!query) return true;
    const lowerQuery = query.toLowerCase();
    const matches = menuItem.name.toLowerCase().includes(lowerQuery);
    const childrenMatch = menuItem.children?.some(child => matchesSearch(child, query));
    return matches || !!childrenMatch;
  };

  if (searchQuery && !matchesSearch(menu, searchQuery)) {
    return null;
  }

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      toggleExpand(menu.id);
    }
  };

  const handleSelect = () => {
    selectMenu(menu);
  };

  const handleAddChild = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddChild?.(menu.id);
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('application/x-menu-id', menu.id);
    e.dataTransfer.setData('text/plain', menu.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const draggedMenuId =
      e.dataTransfer.getData('application/x-menu-id') ||
      e.dataTransfer.getData('text/plain');

    if (draggedMenuId === menu.id) {
      return; // Can't drop on itself
    }

    if (!draggedMenuId) return;

    if (isDescendant(menus, draggedMenuId, menu.id)) {
      return;
    }

    try {
      await moveMenu(draggedMenuId, menu.id);
      ensureExpanded(menu.id);
    } catch (error) {
      console.error('Failed to move menu:', error);
    }
  };

  return (
    <div>
      <div
        className={`${level > 0 ? 'branch-line' : ''}`}
        style={{ paddingLeft: `${level * 28}px` }}
      >
        <div
          className={`tree-chip group ${isSelected ? 'tree-chip-active' : ''} ${isDragOver ? 'ring-2 ring-blue-500 bg-blue-50' : ''} hover:shadow-md transition-shadow`}
          onClick={handleSelect}
          draggable={true}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <button
            onClick={hasChildren ? handleToggle : undefined}
            onMouseDown={(e) => e.stopPropagation()}
            className={`expand-button ${!hasChildren ? 'opacity-0 pointer-events-none' : ''}`}
          >
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )
            ) : null}
          </button>
          <span className="flex-1 text-sm font-medium text-slate-700">
            {menu.name}
          </span>
          {onAddChild && (
            <button
              onClick={handleAddChild}
              onMouseDown={(e) => e.stopPropagation()}
              className="add-child-button opacity-0 group-hover:opacity-100"
              title="Add child menu"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div>
          {menu.children!.map(child => (
            <MenuTreeItem
              key={child.id}
              menu={child}
              level={level + 1}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      )}
    </div>
  );
}
