'use client';

import { useState } from 'react';
import { Home, Trophy, BarChart3, History, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', icon: Home, current: true },
  { name: 'Active Draws', icon: Trophy, current: false },
  { name: 'Analytics', icon: BarChart3, current: false },
  { name: 'History', icon: History, current: false },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 text-white bg-white/10 backdrop-blur-md rounded-lg focus:ring-2 focus:ring-white/50 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isOpen}
        aria-controls="sidebar-navigation"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div 
        id="sidebar-navigation"
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white/5 backdrop-blur-md border-r border-white/20 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 px-4 border-b border-white/20">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <Trophy size={16} className="text-white" />
              </div>
              <span className="text-white font-bold text-lg">ChainDraw</span>
            </div>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2" role="menubar">
            {navigation.map((item) => (
              <button
                key={item.name}
                className={cn(
                  "w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-white/50 focus:outline-none",
                  item.current
                    ? "bg-white/20 text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                )}
                role="menuitem"
                aria-current={item.current ? 'page' : undefined}
              >
                <item.icon size={18} className="mr-3" aria-hidden="true" />
                {item.name}
              </button>
            ))}
          </nav>
          
          <div className="p-4 border-t border-white/20">
            <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-lg p-3 border border-white/20">
              <div className="text-white/80 text-sm font-medium mb-1">Total Balance</div>
              <div className="text-white text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                2.458 ETH
              </div>
              <div className="text-green-400 text-xs font-medium">+0.271 ETH this week</div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
