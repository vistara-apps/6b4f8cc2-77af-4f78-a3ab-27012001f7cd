'use client';

import { Bell, Settings } from 'lucide-react';
import { WalletConnect } from './WalletConnect';

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
          
          <WalletConnect />
        </div>
      </div>
    </header>
  );
}
