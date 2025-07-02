
import React from 'react';
import { TimerMode } from '../types';

interface TimerDisplayProps {
  timeLeft: number;
  mode: TimerMode;
  nextMode: TimerMode;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const modeConfig = {
  [TimerMode.IDLE]: {
    bgColor: 'from-gray-700 to-gray-800',
    textColor: 'text-white',
  },
  [TimerMode.LEARN]: {
    bgColor: 'from-blue-500 to-blue-600',
    textColor: 'text-white',
  },
  [TimerMode.BREAK]: {
    bgColor: 'from-purple-500 to-purple-600',
    textColor: 'text-white',
  },
};

const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeLeft, mode, nextMode }) => {
  const displayMode = mode === TimerMode.IDLE ? nextMode : mode;
  const config = modeConfig[displayMode] || modeConfig.idle;
  
  return (
    <div className={`w-full max-w-md mx-auto rounded-full aspect-square flex items-center justify-center p-4 shadow-2xl transition-all duration-500 bg-gradient-to-br ${config.bgColor}`}>
      <div className="w-full h-full rounded-full bg-gray-900/50 flex items-center justify-center flex-col">
        <h1 className={`text-8xl md:text-9xl font-black tabular-nums ${config.textColor} transition-colors duration-500`}>
          {formatTime(timeLeft)}
        </h1>
        <p className="mt-2 text-lg font-medium text-gray-300 uppercase tracking-widest">
            {mode === TimerMode.IDLE ? `Ready to ${nextMode}` : mode}
        </p>
      </div>
    </div>
  );
};

export default TimerDisplay;
