
import React, { useMemo } from 'react';
import { Session, TimerMode } from '../types';

interface ProgressSummaryProps {
  sessions: Session[];
}

const ProgressSummary: React.FC<ProgressSummaryProps> = ({ sessions }) => {
  const totalLearnTime = useMemo(() => {
    const today = new Date().toDateString();
    return sessions.reduce((total, session) => {
      const sessionDate = new Date(session.completedAt).toDateString();
      if (session.type === TimerMode.LEARN && sessionDate === today) {
        return total + session.duration;
      }
      return total;
    }, 0);
  }, [sessions]);

  const formatTotalTime = (seconds: number): string => {
    if (seconds === 0) return '0m';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    let result = '';
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0 || hours === 0) result += `${minutes}m`;
    return result.trim();
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-gray-800/50 rounded-xl p-4 text-center">
      <p className="text-gray-400 text-sm font-medium">Total Learn Time Today</p>
      <p className="text-3xl font-bold text-white mt-1">{formatTotalTime(totalLearnTime)}</p>
    </div>
  );
};

export default ProgressSummary;
