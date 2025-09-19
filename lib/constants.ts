export const DRAW_DURATION = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
export const MIN_TICKET_PRICE = 0.001; // ETH
export const MAX_TICKET_PRICE = 1.0; // ETH
export const PLATFORM_FEE_PERCENTAGE = 5; // 5% platform fee
export const MAX_TICKETS_PER_DRAW = 1000;

// USDC Token Configuration on Base
export const USDC_TOKEN_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
export const USDC_DECIMALS = 6; // USDC has 6 decimal places

// Payment Configuration
export const PAYMENT_TIMEOUT = 30000; // 30 seconds
export const CONFIRMATION_BLOCKS = 1; // Number of blocks to wait for confirmation

export const MOCK_DRAWS = [
  {
    drawId: '1',
    startTime: new Date(Date.now() - 6 * 60 * 60 * 1000), // Started 6 hours ago
    endTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // Ends in 6 hours
    status: 'active' as const,
    prizePool: 759, // USDC amount (759 USDC)
    ticketPrice: 1, // 1 USDC per ticket
    maxTickets: 1000,
    soldTickets: 759,
  },
  {
    drawId: '2',
    startTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // Starts in 6 hours
    endTime: new Date(Date.now() + 18 * 60 * 60 * 1000), // Ends in 18 hours
    status: 'pending' as const,
    prizePool: 0,
    ticketPrice: 0.5, // 0.5 USDC per ticket
    maxTickets: 500,
    soldTickets: 0,
  },
];

export const MOCK_USER = {
  userId: '1',
  walletAddress: '0x1234567890123456789012345678901234567890',
  totalWinnings: 2.45,
  totalSpent: 0.87,
  displayName: 'CryptoPlayer',
  avatar: '/avatar-placeholder.png',
};
