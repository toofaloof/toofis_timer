
import React from 'react';
import { Session, TimerMode } from '../types';
import { BrainIcon, CoffeeIcon } from './icons';

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  return `${minutes} min`;
};

const SessionItem: React.FC<{ session: Session }> = ({ session }) => {
  const isLearn = session.type === TimerMode.LEARN;
  const config = {
    [TimerMode.LEARN]: {
      icon: <BrainIcon className="w-5 h-5 text-blue-400" />,
      bgColor: 'bg-blue-900/30',
      borderColor: 'border-blue-500/50',
      title: session.label || 'Learn Session',
    },
    [TimerMode.BREAK]: {
      icon: <CoffeeIcon className="w-5 h-5 text-purple-400" />,
      bgColor: 'bg-purple-900/30',
      borderColor: 'border-purple-500/50',
      title: 'Break',
    },
  };
  const sessionConfig = config[session.type];

  return (
    <div className={`p-4 rounded-lg border-l-4 ${sessionConfig.borderColor} ${sessionConfig.bgColor}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {sessionConfig.icon}
          <div className="flex-1">
            <p className="font-semibold text-white">{sessionConfig.title}</p>
            {isLearn && session.note && <p className="text-sm text-gray-400 mt-1">{session.note}</p>}
          </div>
        </div>
        <div className="text-right">
            <p className="font-bold text-gray-200">{formatDuration(session.duration)}</p>
            <p className="text-xs text-gray-500">{new Date(session.completedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
        </div>
      </div>
    </div>
  );
};

const SessionLog: React.FC<{ sessions: Session[] }> = ({ sessions }) => {
  const todaySessions = sessions.filter(s => {
      const today = new Date();
      const sessionDate = new Date(s.completedAt);
      return today.toDateString() === sessionDate.toDateString();
  });
  
  if (todaySessions.length === 0) {
      return (
          <div className="text-center py-10 px-4">
              <h3 className="text-xl font-bold mb-2">Session Log</h3>
              <p className="text-gray-400">Complete your first session to see it here.</p>
          </div>
      )
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-3">
      <h3 className="text-xl font-bold text-center mb-4">Today's Log</h3>
      {todaySessions.slice().reverse().map(session => (
        <SessionItem key={session.id} session={session} />
      ))}
    </div>
  );
};

export default SessionLog;
