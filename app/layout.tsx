import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'ChainDraw Duel',
  description: 'Fair draws, instant wins, powered by Base.',
  openGraph: {
    title: 'ChainDraw Duel',
    description: 'Fair draws, instant wins, powered by Base.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="gradient-bg">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
