import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  // Format as ETH with appropriate decimal places
  if (amount >= 1) {
    return `${amount.toFixed(2)} ETH`;
  } else if (amount >= 0.01) {
    return `${amount.toFixed(3)} ETH`;
  } else if (amount >= 0.001) {
    return `${amount.toFixed(4)} ETH`;
  } else {
    return `${amount.toFixed(6)} ETH`;
  }
}

export function formatCurrencyCompact(amount: number): string {
  // More compact formatting for smaller displays
  if (amount >= 1) {
    return `${amount.toFixed(1)}Ξ`;
  } else {
    return `${amount.toFixed(3)}Ξ`;
  }
}

export function formatTimeRemaining(endTime: Date): string {
  const now = new Date();
  const diff = endTime.getTime() - now.getTime();
  
  if (diff <= 0) return 'Draw ended';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

export function generateRandomNumber(): number {
  return Math.floor(Math.random() * 1000000) + 1;
}

export function calculateWinChance(userTickets: number, totalTickets: number): number {
  if (totalTickets === 0) return 0;
  return (userTickets / totalTickets) * 100;
}

export function shortenAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
