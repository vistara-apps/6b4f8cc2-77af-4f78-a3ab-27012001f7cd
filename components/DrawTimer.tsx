'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { formatTimeRemaining } from '@/lib/utils';

interface DrawTimerProps {
  endTime: Date;
  variant?: 'active' | 'ended';
}

export function DrawTimer({ endTime, variant = 'active' }: DrawTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const diff = endTime.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeRemaining('Draw ended');
        setIsEnded(true);
      } else {
        setTimeRemaining(formatTimeRemaining(endTime));
        setIsEnded(false);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <div className={`flex items-center justify-center space-x-2 p-4 rounded-lg ${
      isEnded 
        ? 'bg-red-500/20 border border-red-500/30' 
        : 'bg-blue-500/20 border border-blue-500/30'
    }`}>
      <Clock size={20} className={isEnded ? 'text-red-400' : 'text-blue-400'} />
      <span className={`font-mono text-lg font-semibold ${
        isEnded ? 'text-red-400' : 'text-blue-400'
      }`}>
        {timeRemaining}
      </span>
    </div>
  );
}
