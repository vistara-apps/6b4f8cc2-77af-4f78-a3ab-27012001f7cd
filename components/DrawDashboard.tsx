'use client';

import { useState, useEffect } from 'react';
import { DrawCard } from './DrawCard';
import { DrawTimer } from './DrawTimer';
import { ParticipantsList } from './ParticipantsList';
import { AnalyticsPanel } from './AnalyticsPanel';
import { PurchaseTicketModal } from './PurchaseTicketModal';
import { MOCK_DRAWS, MOCK_USER } from '@/lib/constants';
import { Draw, User } from '@/lib/types';

export function DrawDashboard() {
  const [draws, setDraws] = useState<Draw[]>(MOCK_DRAWS);
  const [selectedDraw, setSelectedDraw] = useState<Draw | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [user] = useState<User>(MOCK_USER);

  const activeDraw = draws.find(draw => draw.status === 'active');
  const upcomingDraws = draws.filter(draw => draw.status === 'pending');

  const handlePurchaseTicket = (drawId: string, ticketCount: number) => {
    setDraws(prevDraws =>
      prevDraws.map(draw =>
        draw.drawId === drawId
          ? {
              ...draw,
              soldTickets: draw.soldTickets + ticketCount,
              prizePool: draw.prizePool + (draw.ticketPrice * ticketCount)
            }
          : draw
      )
    );
    setShowPurchaseModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="text-center py-6 sm:py-8 px-4 animate-fade-in">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 animate-slide-up">
          Blockchain-Verified Fair Draw
        </h1>
        <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
          Participate in transparent, blockchain-verified lottery draws with instant payouts
        </p>
      </div>

      {/* Active Draw Section */}
      {activeDraw && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <DrawCard
              draw={activeDraw}
              onPurchaseTicket={() => {
                setSelectedDraw(activeDraw);
                setShowPurchaseModal(true);
              }}
            />
            
            <div className="card">
              <h3 className="text-xl font-semibold text-white mb-4">Draw Progress</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-white/80">
                  <span>Tickets Sold</span>
                  <span>{activeDraw.soldTickets} / {activeDraw.maxTickets}</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(activeDraw.soldTickets / activeDraw.maxTickets) * 100}%`
                    }}
                  />
                </div>
                <DrawTimer endTime={activeDraw.endTime} />
              </div>
            </div>
          </div>
          
          <div className="space-y-4 sm:space-y-6 order-first lg:order-last">
            <AnalyticsPanel draws={draws} />
            <ParticipantsList drawId={activeDraw.drawId} />
          </div>
        </div>
      )}

      {/* Upcoming Draws */}
      {upcomingDraws.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-white px-4 sm:px-0">Upcoming Draws</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingDraws.map(draw => (
              <DrawCard
                key={draw.drawId}
                draw={draw}
                onPurchaseTicket={() => {
                  setSelectedDraw(draw);
                  setShowPurchaseModal(true);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Purchase Ticket Modal */}
      {showPurchaseModal && selectedDraw && (
        <PurchaseTicketModal
          draw={selectedDraw}
          user={user}
          onClose={() => setShowPurchaseModal(false)}
          onPurchase={handlePurchaseTicket}
        />
      )}
    </div>
  );
}
