'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { LayoutGrid, Code, Box, Menu, List, Users, Trophy, AlignLeft } from 'lucide-react';

const menuItems = [
  { icon: LayoutGrid, label: 'Systems', href: '#' },
  { icon: Code, label: 'System Code', href: '#' },
  { icon: Box, label: 'Properties', href: '#' },
  { icon: Menu, label: 'Menus', href: '#', active: true },
  { icon: List, label: 'API List', href: '#' },
  { icon: Users, label: 'Users & Group', href: '#' },
  { icon: Trophy, label: 'Competition', href: '#' },
];

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateViewport = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  useEffect(() => {
    setIsExpanded(!isMobile);
  }, [isMobile]);

  const widthClass = isExpanded ? 'w-[280px]' : isMobile ? 'w-0' : 'w-[88px]';

  const hideContent = isMobile && !isExpanded;

  return (
    <div className="relative">
      <aside
        className={`${widthClass} h-screen ${isMobile ? 'fixed top-0 left-0 z-40' : 'sticky top-0'} bg-gradient-to-b from-[#03318c] via-[#032b7a] to-[#021c4d] text-white flex flex-col py-8 ${hideContent ? 'px-0' : 'px-4 md:px-6'} rounded-r-[32px] shadow-xl transition-all duration-300 ${hideContent ? 'pointer-events-none -translate-x-full' : 'translate-x-0'}`}
      >
        {!hideContent && (
          <>
            <div className="pb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur p-2 flex-shrink-0">
                  <Image
                    src="/logo-stk.png"
                    alt="STK Logo"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                  />
                </div>
                {isExpanded && (
                  <div className="whitespace-nowrap flex flex-col justify-center h-12 overflow-hidden">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/70 leading-none">
                      Solusi
                    </p>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/70 leading-none mt-0.5">
                      Teknologi
                    </p>
                    <p className="text-sm font-semibold text-white/70 leading-none mt-0.5">Kreatif</p>
                  </div>
                )}
              </div>
            </div>

            {isExpanded && (
              <div className="text-xs uppercase tracking-[0.3em] text-white/40 px-1 mb-4">
                Menu
              </div>
            )}

            <nav className="flex-1 space-y-2">
              {menuItems.map(item => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`sidebar-item ${item.active ? 'active' : ''} ${!isExpanded ? 'justify-center' : ''}`}
                    title={!isExpanded ? item.label : ''}
                  >
                    <Icon className={`w-5 h-5 ${item.active ? 'text-blue-700' : 'text-white'} flex-shrink-0`} />
                    {isExpanded && (
                      <span className={`text-base ${item.active ? 'text-blue-800' : 'text-white/80'}`}>
                        {item.label}
                      </span>
                    )}
                  </a>
                );
              })}
            </nav>
          </>
        )}
      </aside>

      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className={`${isMobile ? 'fixed top-4 h-12 w-12 rounded-full' : 'fixed top-[60px] h-12 w-8 rounded-r-2xl'} bg-gradient-to-br from-[#0443b8] to-[#032b7a] text-white/90 shadow-lg shadow-black/20 flex items-center justify-center transition-all duration-300 group z-50 border border-blue-800/30 ${isMobile ? '' : 'border-l-0 border-y border-r'}`}
        style={
          isMobile
            ? { left: isExpanded ? 'calc(280px - 16px)' : '16px' }
            : { left: isExpanded ? 'calc(280px - 4px)' : 'calc(88px - 4px)' }
        }
        aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        <AlignLeft className="h-4 w-4 group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
}
