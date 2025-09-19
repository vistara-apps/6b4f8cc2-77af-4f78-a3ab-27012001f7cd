# ChainDraw Duel

A decentralized lottery platform on Base where users can participate in fair, blockchain-verified draws with instant payouts.

## Features

- **Blockchain-Verified Draws**: Transparent and tamper-proof lottery system using Base blockchain
- **Secure Crypto Transactions**: Multi-factor authentication and secure wallet integration
- **Real-time Analytics**: Live dashboards with betting data and draw history
- **Automated Prize Distribution**: Instant payouts to winners
- **12-Hour Draw Cycles**: Frequent opportunities to participate and win

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base Network
- **Wallet Integration**: MiniKit + OnchainKit
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

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your OnchainKit API key to `.env.local`:
   ```
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Base Mini App Integration

This app is built as a Base Mini App using:

- **MiniKitProvider**: For Base App integration
- **OnchainKit**: For wallet connectivity and blockchain interactions
- **Base Network**: For all smart contract interactions

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
│   └── constants.ts       # App constants
└── public/                # Static assets
```

## Key Components

### DrawDashboard
Main dashboard showing active and upcoming draws with real-time updates.

### DrawCard
Individual draw display with status, prize pool, and participation options.

### PurchaseTicketModal
Modal for purchasing lottery tickets with Base wallet integration.

### AnalyticsPanel
Real-time analytics showing platform statistics and performance.

## Development

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting and formatting
- **Tailwind CSS**: Utility-first styling
- **Mobile-First**: Responsive design for all screen sizes

## Deployment

The app is optimized for deployment on Vercel or similar platforms that support Next.js 15.

## License

MIT License - see LICENSE file for details.
