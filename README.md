# ChainDraw Duel

A decentralized lottery platform on Base where users can participate in fair, blockchain-verified draws with instant USDC payouts.

## Features

- **Blockchain-Verified Draws**: Transparent and tamper-proof lottery system using Base blockchain
- **USDC Payments**: Secure crypto transactions using native USDC on Base network
- **x402 Payment Protocol**: Advanced payment flow with transaction confirmations
- **Real-time Analytics**: Live dashboards with betting data and draw history
- **Automated Prize Distribution**: Instant payouts to winners
- **12-Hour Draw Cycles**: Frequent opportunities to participate and win

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base Network (Chain ID: 8453)
- **Payment Token**: USDC (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913)
- **Wallet Integration**: Wagmi v2 + viem
- **Payment Protocol**: x402 with axios integration
- **Styling**: Tailwind CSS
- **TypeScript**: Full type safety

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chaindraw-duel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional)
   ```bash
   cp .env.example .env.local
   ```
   
   Add configuration to `.env.local` if needed:
   ```
   # Optional: OnchainKit API key for enhanced features
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key_here
   
   # Optional: Custom Base RPC URL
   NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Payment Integration

This app implements a comprehensive x402 payment flow with:

- **USDC on Base**: Native USDC token support (no bridging required)
- **Wagmi Integration**: Modern wallet connection and transaction management
- **x402 Protocol**: Advanced payment handling with error recovery
- **Transaction Monitoring**: Real-time confirmation tracking
- **Balance Checking**: Live USDC balance updates

### Supported Wallets

- MetaMask
- Coinbase Wallet
- WalletConnect compatible wallets
- Any injected Ethereum wallet

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main dashboard page
│   ├── providers.tsx      # MiniKit and OnchainKit providers
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── AppShell.tsx       # Main app layout
│   ├── DrawDashboard.tsx  # Main dashboard
│   ├── DrawCard.tsx       # Individual draw display
│   ├── DrawTimer.tsx      # Countdown timer
│   ├── ParticipantsList.tsx # Participants display
│   ├── AnalyticsPanel.tsx # Analytics dashboard
│   └── PurchaseTicketModal.tsx # Ticket purchase modal
├── lib/                   # Utilities and types
│   ├── types.ts           # TypeScript interfaces
│   ├── utils.ts           # Utility functions
│   ├── constants.ts       # App constants and USDC config
│   ├── paymentService.ts  # x402 payment implementation
│   ├── usePayment.ts      # Payment hook for React components
│   └── __tests__/         # Test files
└── public/                # Static assets
```

## Key Components

### DrawDashboard
Main dashboard showing active and upcoming draws with real-time updates.

### DrawCard
Individual draw display with status, prize pool, and participation options.

### PurchaseTicketModal
Modal for purchasing lottery tickets with USDC payments, real-time balance checking, and transaction status updates.

### WalletConnect
Wallet connection component with balance display and connection management.

## Payment Flow Architecture

### 1. Payment Service (`lib/paymentService.ts`)
- **USDC Balance Checking**: Real-time balance verification
- **Transaction Processing**: Direct USDC transfers using viem
- **Confirmation Handling**: Transaction receipt monitoring
- **Error Recovery**: Comprehensive error handling and user feedback

### 2. Payment Hook (`lib/usePayment.ts`)
- **React Integration**: Hook for payment state management
- **Balance Updates**: Automatic balance refreshing
- **Transaction Status**: Real-time payment status tracking
- **Error Handling**: User-friendly error messages

### 3. Transaction Flow
1. User connects wallet (MetaMask, Coinbase Wallet, etc.)
2. App checks USDC balance on Base network
3. User selects tickets and confirms payment
4. Transaction is submitted to Base network
5. App monitors transaction confirmation
6. Success/failure feedback with transaction links

### AnalyticsPanel
Real-time analytics showing platform statistics and performance.

## Development

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MetaMask or compatible wallet for testing
- Base network access (mainnet or testnet)

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build production version
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

### Development Features
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting and formatting
- **Tailwind CSS**: Utility-first styling
- **Mobile-First**: Responsive design for all screen sizes
- **Hot Reload**: Fast development with instant updates

### Testing Payment Flow

1. **Connect Wallet**: Use MetaMask or Coinbase Wallet
2. **Switch to Base**: Ensure wallet is connected to Base network
3. **Get USDC**: Acquire USDC on Base network for testing
4. **Test Payments**: Try purchasing lottery tickets
5. **Monitor Transactions**: Check transaction status on BaseScan

### Network Configuration

- **Base Mainnet**
  - Chain ID: 8453
  - RPC URL: https://mainnet.base.org
  - USDC Address: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913

## Deployment

The app is optimized for deployment on Vercel or similar platforms that support Next.js 15.

### Environment Variables for Production
```bash
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_production_api_key
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
```

## Testing

Run the test suite:
```bash
npm test                    # Run all tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run tests with coverage
```

The test suite includes:
- Payment service unit tests
- Integration tests for USDC transactions
- Wallet connection tests
- Error handling verification

## License

MIT License - see LICENSE file for details.
