'use client';

import { TrendingUp, DollarSign, Target, Activity } from 'lucide-react';
import { Draw } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface AnalyticsPanelProps {
  draws: Draw[];
}

export function AnalyticsPanel({ draws }: AnalyticsPanelProps) {
  const totalPrizePool = draws.reduce((sum, draw) => sum + draw.prizePool, 0);
  const activeDraws = draws.filter(draw => draw.status === 'active').length;
  const completedDraws = draws.filter(draw => draw.status === 'completed').length;
  const totalTicketsSold = draws.reduce((sum, draw) => sum + draw.soldTickets, 0);

  const stats = [
    {
      name: 'Total Prize Pool',
      value: formatCurrency(totalPrizePool),
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
    },
    {
      name: 'Active Draws',
      value: activeDraws.toString(),
      icon: Activity,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
    },
    {
      name: 'Completed Draws',
      value: completedDraws.toString(),
      icon: Target,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
    },
    {
      name: 'Tickets Sold',
      value: totalTicketsSold.toString(),
      icon: TrendingUp,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
    },
  ];

  return (
    <div className="card">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
        <TrendingUp size={20} className="mr-2" />
        Analytics
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="text-center">
            <div className={`flex items-center justify-center w-12 h-12 ${stat.bgColor} rounded-lg mb-2 mx-auto`}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <div className="text-white font-bold text-lg">{stat.value}</div>
            <div className="text-white/60 text-xs">{stat.name}</div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-white/20">
        <div className="text-center">
          <div className="text-white/60 text-sm mb-1">Platform Performance</div>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">All systems operational</span>
          </div>
        </div>
      </div>
    </div>
  );
}
