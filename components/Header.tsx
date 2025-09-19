'use client';

// import { useMiniKit } from '@coinbase/minikit';
// import { useAuthenticate } from '@coinbase/onchainkit/minikit';
import { User, Bell, Settings } from 'lucide-react';
import { shortenAddress } from '@/lib/utils';

export function Header() {
  // Mock data for now - will be replaced with actual wallet integration
  const context = { user: { displayName: 'Player' } };
  const user = { address: '0x1234567890123456789012345678901234567890' };

  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/20 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white truncate">ChainDraw Duel</h1>
          <span className="text-white/60 text-xs sm:text-sm hidden sm:block">Fair draws, instant wins</span>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200 hidden sm:block">
            <Bell size={18} />
          </button>
          
          <button className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200 hidden sm:block">
            <Settings size={18} />
          </button>
          
          <div className="flex items-center space-x-2 sm:space-x-3 bg-white/10 rounded-lg px-2 sm:px-3 py-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <User size={14} className="text-white sm:w-4 sm:h-4" />
            </div>
            <div className="text-xs sm:text-sm min-w-0">
              <div className="text-white font-medium truncate">
                {context?.user?.displayName || 'Player'}
              </div>
              <div className="text-white/60 truncate">
                {user?.address ? shortenAddress(user.address) : 'Connect Wallet'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
