'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Minus, Wallet, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { Draw, User } from '@/lib/types';
import { formatUSDC, formatBalance } from '@/lib/utils';
import { usePayment } from '@/lib/usePayment';
import { useAccount } from 'wagmi';

interface PurchaseTicketModalProps {
  draw: Draw;
  user: User;
  onClose: () => void;
  onPurchase: (drawId: string, ticketCount: number) => void;
}

export function PurchaseTicketModal({ draw, user, onClose, onPurchase }: PurchaseTicketModalProps) {
  const [ticketCount, setTicketCount] = useState(1);
  const { address, isConnected } = useAccount();
  const { paymentState, balance, processPayment, checkBalance, resetPaymentState } = usePayment();

  const totalCost = ticketCount * draw.ticketPrice;
  const remainingTickets = draw.maxTickets - draw.soldTickets;
  const maxPurchase = Math.min(remainingTickets, 10); // Limit to 10 tickets per purchase

  // Load balance on mount and when wallet connects
  useEffect(() => {
    if (isConnected) {
      checkBalance();
    }
  }, [isConnected, checkBalance]);

  const handlePurchase = async () => {
    if (!isConnected || !address) {
      alert('Please connect your wallet first');
      return;
    }

    if (balance && balance < totalCost) {
      alert(`Insufficient USDC balance. You need ${formatUSDC(totalCost)} but only have ${formatBalance(balance)}`);
      return;
    }

    try {
      const result = await processPayment({
        drawId: draw.drawId,
        ticketCount,
        ticketPrice: draw.ticketPrice,
        recipientAddress: '0x742d35Cc6635C0532925a3b8D4A4e6b75C5b8888', // Platform address
      });

      if (result.success) {
        // Call the parent callback to update the UI
        onPurchase(draw.drawId, ticketCount);
        
        // Show success message
        setTimeout(() => {
          onClose();
          resetPaymentState();
        }, 3000); // Close modal after 3 seconds
      }
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

  const adjustTicketCount = (delta: number) => {
    const newCount = Math.max(1, Math.min(maxPurchase, ticketCount + delta));
    setTicketCount(newCount);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="card max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Purchase Tickets</h2>
          <button
            onClick={onClose}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
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
              <span className="text-white font-semibold">{formatUSDC(draw.prizePool)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/80">Price per Ticket</span>
              <span className="text-white font-semibold">{formatUSDC(draw.ticketPrice)}</span>
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

          {/* Wallet Balance */}
          {isConnected && (
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-white/80">Your USDC Balance</span>
                <span className="text-white font-semibold">
                  {balance !== null ? formatBalance(balance) : 'Loading...'}
                </span>
              </div>
            </div>
          )}

          {/* Total Cost */}
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-blue-400 font-medium">Total Cost</span>
              <span className="text-blue-400 text-xl font-bold">{formatUSDC(totalCost)}</span>
            </div>
          </div>

          {/* Payment Status */}
          {paymentState.error && (
            <div className="flex items-start space-x-3 bg-red-500/20 border border-red-500/30 rounded-lg p-3">
              <AlertCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
              <div className="text-red-400 text-sm">
                <div className="font-medium mb-1">Payment Failed</div>
                <div>{paymentState.error}</div>
              </div>
            </div>
          )}

          {paymentState.transactionHash && (
            <div className="flex items-start space-x-3 bg-green-500/20 border border-green-500/30 rounded-lg p-3">
              <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
              <div className="text-green-400 text-sm">
                <div className="font-medium mb-1">Payment Successful!</div>
                <div className="flex items-center space-x-2">
                  <span>Transaction: {paymentState.transactionHash.slice(0, 10)}...</span>
                  <a
                    href={`https://basescan.org/tx/${paymentState.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-green-300"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Warning */}
          <div className="flex items-start space-x-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3">
            <AlertCircle size={16} className="text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-yellow-400 text-sm">
              <div className="font-medium mb-1">Payment Notice</div>
              <div>Payment will be processed in USDC on Base network. Make sure you have sufficient ETH for gas fees.</div>
            </div>
          </div>

          {/* Purchase Button */}
          <button
            onClick={handlePurchase}
            disabled={
              paymentState.isProcessing || 
              remainingTickets === 0 || 
              !isConnected ||
              (balance !== null && balance < totalCost) ||
              paymentState.transactionHash !== null
            }
            className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {paymentState.isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing Payment...</span>
              </>
            ) : paymentState.transactionHash ? (
              <>
                <CheckCircle size={18} />
                <span>Payment Complete!</span>
              </>
            ) : !isConnected ? (
              <>
                <Wallet size={18} />
                <span>Connect Wallet</span>
              </>
            ) : (balance !== null && balance < totalCost) ? (
              <>
                <AlertCircle size={18} />
                <span>Insufficient Balance</span>
              </>
            ) : (
              <>
                <Wallet size={18} />
                <span>Pay {formatUSDC(totalCost)} for {ticketCount} Ticket{ticketCount > 1 ? 's' : ''}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
