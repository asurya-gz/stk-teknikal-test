'use client';

import { useEffect, useState } from 'react';
import { Plus, Menu as MenuIcon, Search } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import MenuTreeItem from '@/components/MenuTreeItem';
import MenuDetail from '@/components/MenuDetail';
import AddMenuModal from '@/components/AddMenuModal';
import { useMenuStore } from '@/store/menuStore';
import { Menu } from '@/types/menu';

export default function Home() {
  const {
    menus,
    selectedMenu,
    selectMenu,
    fetchMenus,
    expandAll,
    collapseAll,
    isLoading,
    error,
    moveMenu,
  } = useMenuStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addMenuParentId, setAddMenuParentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isDropZoneActive, setIsDropZoneActive] = useState(false);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  useEffect(() => {
    if (menus.length > 0) {
      expandAll();
    }
  }, [menus, expandAll]);

  const handleAddRoot = () => {
    setAddMenuParentId(null);
    setIsAddModalOpen(true);
  };

  const handleAddChild = (parentId: string) => {
    setAddMenuParentId(parentId);
    setIsAddModalOpen(true);
  };

  // Get all menu names for autocomplete
  const getAllMenuNames = (menuList: Menu[]): Array<{ name: string; id: string; path: string }> => {
    const result: Array<{ name: string; id: string; path: string }> = [];

    const traverse = (menus: Menu[], parentPath = '') => {
      menus.forEach(menu => {
        const currentPath = parentPath ? `${parentPath} > ${menu.name}` : menu.name;
        result.push({ name: menu.name, id: menu.id, path: currentPath });
        if (menu.children && menu.children.length > 0) {
          traverse(menu.children, currentPath);
        }
      });
    };

    traverse(menuList);
    return result;
  };

  // Get suggestions based on search query
  const getSuggestions = (query: string) => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    const allNames = getAllMenuNames(menus);
    return allNames
      .filter(item => item.name.toLowerCase().includes(lowerQuery))
      .slice(0, 5); // Limit to 5 suggestions
  };

  // Filter menus based on search query
  const filterMenus = (menuList: Menu[], query: string): Menu[] => {
    if (!query.trim()) return menuList;

    const lowerQuery = query.toLowerCase();

    return menuList.reduce((acc: Menu[], menu) => {
      const nameMatches = menu.name.toLowerCase().includes(lowerQuery);
      const filteredChildren = menu.children ? filterMenus(menu.children, query) : [];

      if (nameMatches || filteredChildren.length > 0) {
        acc.push({
          ...menu,
          children: filteredChildren.length > 0 ? filteredChildren : menu.children,
        });
      }

      return acc;
    }, []);
  };

  const filteredMenus = filterMenus(menus, searchQuery);
  const suggestions = getSuggestions(searchQuery);

  const handleSuggestionClick = (menuId: string) => {
    const findMenu = (menuList: Menu[]): Menu | null => {
      for (const menu of menuList) {
        if (menu.id === menuId) return menu;
        if (menu.children) {
          const found = findMenu(menu.children);
          if (found) return found;
        }
      }
      return null;
    };

    const menu = findMenu(menus);
    if (menu) {
      selectMenu(menu);
      setShowSuggestions(false);
    }
  };

  const handleDropToRoot = async (e: React.DragEvent) => {
    if (e.target !== e.currentTarget) return;
    e.preventDefault();
    setIsDropZoneActive(false);

    const draggedMenuId =
      e.dataTransfer.getData('application/x-menu-id') ||
      e.dataTransfer.getData('text/plain');
    if (!draggedMenuId) return;

    try {
      // Move to root by setting parent to null
      await moveMenu(draggedMenuId, null);
    } catch (error) {
      console.error('Failed to move menu to root:', error);
    }
  };

  const handleDragOverRoot = (e: React.DragEvent) => {
    if (e.target !== e.currentTarget) return;
    e.preventDefault();
    setIsDropZoneActive(true);
  };

  const handleDragLeaveRoot = (e: React.DragEvent) => {
    if (e.target !== e.currentTarget) return;
    e.preventDefault();
    setIsDropZoneActive(false);
  };

  return (
    <div className="flex min-h-screen bg-[#f4f7fb] overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-100 px-5 sm:px-8 lg:px-12 pt-6 sm:pt-10 pb-6 sm:pb-8">
          <div className="text-sm text-gray-400 flex items-center gap-2 mb-6">
            <span className="text-gray-300">/</span>
            <span className="font-medium text-gray-500">Menus</span>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
                <MenuIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Menus</h1>
                <p className="text-sm text-gray-500">Configure the system navigation tree</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden px-4 sm:px-6 lg:px-12 py-6 lg:py-10 bg-[#f4f7fb]">
          <div className="relative flex h-full rounded-[32px] bg-white shadow-sm border border-gray-100 overflow-hidden flex-col lg:flex-row">
            {isLoading && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
                <div className="h-12 w-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
                <p className="mt-4 text-sm font-semibold text-slate-600">Loading menus...</p>
              </div>
            )}
            {/* Tree Area */}
            <div className="w-full lg:w-3/5 border-b lg:border-b-0 lg:border-r border-gray-100 p-6 sm:p-8 lg:p-10 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Menu Tree</h2>
                  <p className="text-xs text-gray-500 mt-1">Manage your hierarchical menu structure</p>
                </div>
                <button
                  onClick={handleAddRoot}
                  className="h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md hover:bg-blue-700 transition-colors"
                  title="Add root menu"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Search Bar with Autocomplete */}
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  placeholder="Search menus..."
                  className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setShowSuggestions(false);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
                  >
                    ✕
                  </button>
                )}

                {/* Autocomplete Dropdown */}
                {showSuggestions && searchQuery && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-lg z-20 max-h-64 overflow-y-auto">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        onClick={() => {
                          setSearchQuery(suggestion.name);
                          handleSuggestionClick(suggestion.id);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 first:rounded-t-2xl last:rounded-b-2xl"
                      >
                        <div className="font-medium text-sm text-gray-900">{suggestion.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{suggestion.path}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 flex-wrap">
                <button onClick={expandAll} className="action-pill action-pill-dark">
                  Expand All
                </button>
                <button onClick={collapseAll} className="action-pill">
                  Collapse All
                </button>
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-800">
                  {error}
                </div>
              )}

              <div className="mt-6 flex-1 overflow-y-auto pr-0 lg:pr-4">
                {isLoading && menus.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="h-10 w-10 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin"></div>
                  </div>
                ) : menus.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center text-gray-500 h-full">
                    <p className="mb-4">No menu data available</p>
                    <button onClick={handleAddRoot} className="action-pill action-pill-dark">
                      Create Menu
                    </button>
                  </div>
                ) : filteredMenus.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center text-gray-500 h-full">
                    <p className="text-sm">No menus found for &quot;{searchQuery}&quot;</p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="mt-3 text-sm text-blue-600 hover:text-blue-700"
                    >
                      Clear search
                    </button>
                  </div>
                ) : (
                  <div
                    className={`space-y-4 min-h-[200px] ${isDropZoneActive ? 'bg-blue-50 border-2 border-dashed border-blue-400 rounded-2xl p-4' : ''}`}
                    onDrop={handleDropToRoot}
                    onDragOver={handleDragOverRoot}
                    onDragLeave={handleDragLeaveRoot}
                  >
                    {isDropZoneActive && (
                      <div className="text-center py-8 text-blue-600 font-medium">
                        Drop here to make this a root menu
                      </div>
                    )}
                    {filteredMenus.map((menu) => (
                      <MenuTreeItem
                        key={menu.id}
                        menu={menu}
                        onAddChild={handleAddChild}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Detail Area */}
            <div className="w-full lg:flex-1 bg-[#f8fbff] p-6 sm:p-8 lg:p-10 min-h-0">
              <div className="h-full">
                <MenuDetail />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Menu Modal */}
      <AddMenuModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        parentId={addMenuParentId}
      />
    </div>
  );
}
