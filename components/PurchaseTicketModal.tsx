'use client';

import { useState } from 'react';
import { X, Plus, Minus, Wallet, AlertCircle } from 'lucide-react';
import { Draw, User } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface PurchaseTicketModalProps {
  draw: Draw;
  user: User;
  onClose: () => void;
  onPurchase: (drawId: string, ticketCount: number) => void;
}

export function PurchaseTicketModal({ draw, user, onClose, onPurchase }: PurchaseTicketModalProps) {
  const [ticketCount, setTicketCount] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const totalCost = ticketCount * draw.ticketPrice;
  const remainingTickets = draw.maxTickets - draw.soldTickets;
  const maxPurchase = Math.min(remainingTickets, 10); // Limit to 10 tickets per purchase

  const handlePurchase = async () => {
    setIsProcessing(true);
    
    // Simulate transaction processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onPurchase(draw.drawId, ticketCount);
    setIsProcessing(false);
  };

  const adjustTicketCount = (delta: number) => {
    const newCount = Math.max(1, Math.min(maxPurchase, ticketCount + delta));
    setTicketCount(newCount);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="card max-w-md w-full animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 id="modal-title" className="text-2xl font-bold text-white">Purchase Tickets</h2>
          <button
            onClick={onClose}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-white/50 focus:outline-none"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Draw Info */}
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/80">Draw #</span>
              <span className="text-white font-semibold">{draw.drawId}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/80">Prize Pool</span>
              <span className="text-white font-semibold">{formatCurrency(draw.prizePool)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/80">Price per Ticket</span>
              <span className="text-white font-semibold">{formatCurrency(draw.ticketPrice)}</span>
            </div>
          </div>

          {/* Ticket Selection */}
          <div>
            <label className="block text-white font-medium mb-3">Number of Tickets</label>
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => adjustTicketCount(-1)}
                disabled={ticketCount <= 1}
                className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200"
              >
                <Minus size={16} className="text-white" />
              </button>
              
              <div className="bg-white/10 rounded-lg px-6 py-3 min-w-[80px] text-center">
                <span className="text-white text-xl font-bold">{ticketCount}</span>
              </div>
              
              <button
                onClick={() => adjustTicketCount(1)}
                disabled={ticketCount >= maxPurchase}
                className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors duration-200"
              >
                <Plus size={16} className="text-white" />
              </button>
            </div>
            
            <div className="text-center text-white/60 text-sm mt-2">
              Max {maxPurchase} tickets • {remainingTickets} remaining
            </div>
          </div>

          {/* Total Cost */}
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-blue-400 font-medium">Total Cost</span>
              <span className="text-blue-400 text-xl font-bold">{formatCurrency(totalCost)}</span>
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start space-x-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3">
            <AlertCircle size={16} className="text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-yellow-400 text-sm">
              <div className="font-medium mb-1">Transaction Notice</div>
              <div>This transaction will be processed on the Base network. Make sure you have sufficient ETH for gas fees.</div>
            </div>
          </div>

          {/* Purchase Button */}
          <button
            onClick={handlePurchase}
            disabled={isProcessing || remainingTickets === 0}
            className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Wallet size={18} />
                <span>Purchase {ticketCount} Ticket{ticketCount > 1 ? 's' : ''}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
