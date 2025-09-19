export interface Draw {
  drawId: string;
  startTime: Date;
  endTime: Date;
  winningTicketId?: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  randomNumber?: number;
  prizePool: number;
  ticketPrice: number;
  maxTickets: number;
  soldTickets: number;
}

export interface Ticket {
  ticketId: string;
  drawId: string;
  userId: string;
  entryCost: number;
  timestamp: Date;
  ticketNumber: number;
}

export interface User {
  userId: string;
  walletAddress: string;
  totalWinnings: number;
  totalSpent: number;
  displayName?: string;
  avatar?: string;
}

export interface DrawAnalytics {
  totalParticipants: number;
  totalPrizePool: number;
  averageTicketPrice: number;
  completedDraws: number;
  activeDraws: number;
}

export interface ParticipantEntry {
  user: User;
  ticketCount: number;
  totalSpent: number;
  winChance: number;
}
