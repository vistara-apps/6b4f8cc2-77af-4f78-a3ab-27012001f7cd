'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { Wallet, LogOut } from 'lucide-react';
import { shortenAddress, formatBalance } from '@/lib/utils';
import { usePayment } from '@/lib/usePayment';
import { useEffect } from 'react';

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { balance, checkBalance } = usePayment();

  useEffect(() => {
    if (isConnected) {
      checkBalance();
    }
  }, [isConnected, checkBalance]);

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-4">
        <div className="text-white/80 text-sm">
          <div>{shortenAddress(address)}</div>
          {balance !== null && (
            <div className="text-xs text-white/60">{formatBalance(balance)}</div>
          )}
        </div>
        <button
          onClick={() => disconnect()}
          className="flex items-center space-x-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors duration-200"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Disconnect</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: injected() })}
      className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
    >
      <Wallet size={18} />
      <span>Connect Wallet</span>
    </button>
  );
}