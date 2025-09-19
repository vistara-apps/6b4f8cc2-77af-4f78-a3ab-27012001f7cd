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
    <div className={`flex items-center justify-center space-x-2 p-3 sm:p-4 rounded-lg transition-all duration-300 ${
      isEnded 
        ? 'bg-red-500/20 border border-red-500/30 animate-pulse' 
        : 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 shadow-lg'
    }`}>
      <Clock size={18} className={`${isEnded ? 'text-red-400' : 'text-blue-400'} ${!isEnded ? 'animate-pulse' : ''}`} />
      <span className={`font-mono text-base sm:text-lg font-semibold transition-colors duration-200 ${
        isEnded ? 'text-red-400' : 'text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text'
      }`}>
        {timeRemaining}
      </span>
      {!isEnded && (
        <div className="flex space-x-1">
          <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      )}
    </div>
  );
}
