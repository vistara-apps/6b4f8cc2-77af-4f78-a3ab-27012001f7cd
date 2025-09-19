'use client';

import { Clock, Users, DollarSign, Ticket } from 'lucide-react';
import { Draw } from '@/lib/types';
import { formatCurrency, formatTimeRemaining } from '@/lib/utils';

interface DrawCardProps {
  draw: Draw;
  onPurchaseTicket: () => void;
}

export function DrawCard({ draw, onPurchaseTicket }: DrawCardProps) {
  const isActive = draw.status === 'active';
  const isPending = draw.status === 'pending';
  const isCompleted = draw.status === 'completed';

  return (
    <div 
      className="card hover:bg-white/15 transition-all duration-200"
      id={`draw-${draw.drawId}-details`}
      role="article"
      aria-label={`Draw #${draw.drawId} information`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">
            Draw #{draw.drawId}
          </h3>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${
              isActive ? 'status-active animate-pulse' :
              isPending ? 'status-pending' :
              'status-completed'
            }`}>
              {draw.status.toUpperCase()}
            </span>
            {isActive && (
              <div className="flex items-center text-white/60 text-sm">
                <Clock size={14} className="mr-1" />
                {formatTimeRemaining(draw.endTime)}
              </div>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            {formatCurrency(draw.prizePool)}
          </div>
          <div className="text-white/60 text-sm">Prize Pool</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/20 rounded-lg mb-2 mx-auto">
            <Ticket size={14} className="text-blue-400 sm:w-[18px] sm:h-[18px]" />
          </div>
          <div className="text-white font-semibold text-sm sm:text-base">{draw.soldTickets}</div>
          <div className="text-white/60 text-xs">Tickets Sold</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/20 rounded-lg mb-2 mx-auto">
            <DollarSign size={14} className="text-purple-400 sm:w-[18px] sm:h-[18px]" />
          </div>
          <div className="text-white font-semibold text-sm sm:text-base">{formatCurrency(draw.ticketPrice)}</div>
          <div className="text-white/60 text-xs">Per Ticket</div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-green-500/20 rounded-lg mb-2 mx-auto">
            <Users size={14} className="text-green-400 sm:w-[18px] sm:h-[18px]" />
          </div>
          <div className="text-white font-semibold text-sm sm:text-base">{draw.maxTickets}</div>
          <div className="text-white/60 text-xs">Max Tickets</div>
        </div>
      </div>

      {(isActive || isPending) && (
        <button
          onClick={onPurchaseTicket}
          className="btn-primary w-full"
          disabled={draw.soldTickets >= draw.maxTickets}
          aria-label={`Purchase tickets for Draw #${draw.drawId}${draw.soldTickets >= draw.maxTickets ? ' (Sold Out)' : ''}`}
          aria-describedby={`draw-${draw.drawId}-details`}
        >
          {draw.soldTickets >= draw.maxTickets ? 'Sold Out' : 'Buy Tickets'}
        </button>
      )}

      {isCompleted && draw.winningTicketId && (
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
          <div className="text-green-400 font-medium text-sm">
            Winning Ticket: #{draw.winningTicketId}
          </div>
        </div>
      )}
    </div>
  );
}
