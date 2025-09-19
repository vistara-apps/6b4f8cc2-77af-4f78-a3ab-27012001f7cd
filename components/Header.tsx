'use client';

import { User, Bell, Settings } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-white">ChainDraw Duel</h1>
          <span className="text-white/60 text-sm">Fair draws, instant wins</span>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200">
            <Bell size={20} />
          </button>

          <button className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200">
            <Settings size={20} />
          </button>

          <div className="flex items-center space-x-3 bg-white/10 rounded-lg px-3 py-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div className="text-sm">
              <div className="text-white font-medium">
                Player
              </div>
              <div className="text-white/60">
                Connect Wallet
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
