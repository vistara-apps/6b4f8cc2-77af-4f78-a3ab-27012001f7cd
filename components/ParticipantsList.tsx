'use client';

import { useState, useEffect } from 'react';
import { Users, Trophy, Percent } from 'lucide-react';
import { ParticipantEntry } from '@/lib/types';
import { formatCurrency, calculateWinChance, shortenAddress } from '@/lib/utils';

interface ParticipantsListProps {
  drawId: string;
}

// Mock participants data
const MOCK_PARTICIPANTS: ParticipantEntry[] = [
  {
    user: {
      userId: '1',
      walletAddress: '0x1234567890123456789012345678901234567890',
      totalWinnings: 2.45,
      totalSpent: 0.87,
      displayName: 'CryptoWhale',
    },
    ticketCount: 25,
    totalSpent: 0.25,
    winChance: 3.3,
  },
  {
    user: {
      userId: '2',
      walletAddress: '0x2345678901234567890123456789012345678901',
      totalWinnings: 1.23,
      totalSpent: 1.45,
      displayName: 'LuckyPlayer',
    },
    ticketCount: 15,
    totalSpent: 0.15,
    winChance: 2.0,
  },
  {
    user: {
      userId: '3',
      walletAddress: '0x3456789012345678901234567890123456789012',
      totalWinnings: 0.89,
      totalSpent: 0.67,
      displayName: 'DrawMaster',
    },
    ticketCount: 10,
    totalSpent: 0.10,
    winChance: 1.3,
  },
];

export function ParticipantsList({ drawId }: ParticipantsListProps) {
  const [participants, setParticipants] = useState<ParticipantEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setParticipants(MOCK_PARTICIPANTS);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [drawId]);

  if (loading) {
    return (
      <div className="card">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
          <Users size={20} className="mr-2" />
          Participants
        </h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-white/20 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-white/20 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
        <Users size={20} className="mr-2" />
        Top Participants
      </h3>
      
      <div className="space-y-3">
        {participants.map((participant, index) => (
          <div
            key={participant.user.userId}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
              index === 0 ? 'bg-yellow-500/20 border border-yellow-500/30' : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {participant.user.displayName?.[0] || 'U'}
                </span>
              </div>
              {index === 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Trophy size={10} className="text-yellow-900" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="text-white font-medium truncate">
                  {participant.user.displayName || shortenAddress(participant.user.walletAddress)}
                </div>
                <div className="flex items-center text-green-400 text-sm">
                  <Percent size={12} className="mr-1" />
                  {participant.winChance.toFixed(1)}%
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-white/60">
                <span>{participant.ticketCount} tickets</span>
                <span>{formatCurrency(participant.totalSpent)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="text-center text-white/60 text-sm">
          {participants.length} participants • {participants.reduce((sum, p) => sum + p.ticketCount, 0)} total tickets
        </div>
      </div>
    </div>
  );
}
