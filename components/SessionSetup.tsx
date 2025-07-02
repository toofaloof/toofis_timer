
import React from 'react';

interface SessionSetupProps {
  learnDuration: number;
  setLearnDuration: (duration: number) => void;
  breakDuration: number;
  setBreakDuration: (duration: number) => void;
  currentLabel: string;
  setCurrentLabel: (label: string) => void;
  currentNote: string;
  setCurrentNote: (note: string) => void;
  timerIsActive: boolean;
  nextModeIsLearn: boolean;
}

const InputField: React.FC<{ label: string; value: number; onChange: (val: number) => void; disabled: boolean }> = ({ label, value, onChange, disabled }) => (
    <div className="flex-1">
        <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        <input
            type="number"
            value={value}
            onChange={(e) => onChange(Math.max(1, parseInt(e.target.value, 10)))}
            disabled={disabled}
            className="w-full bg-gray-700 border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
        />
    </div>
);


const SessionSetup: React.FC<SessionSetupProps> = ({
  learnDuration,
  setLearnDuration,
  breakDuration,
  setBreakDuration,
  currentLabel,
  setCurrentLabel,
  currentNote,
  setCurrentNote,
  timerIsActive,
  nextModeIsLearn
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-gray-800/50 rounded-xl p-6 space-y-4">
        <div className="flex space-x-4">
            <InputField label="Learn (mins)" value={learnDuration} onChange={setLearnDuration} disabled={timerIsActive} />
            <InputField label="Break (mins)" value={breakDuration} onChange={setBreakDuration} disabled={timerIsActive} />
        </div>
        {nextModeIsLearn && (
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Session Label</label>
                    <input
                        type="text"
                        placeholder="e.g., React Hooks deep dive"
                        value={currentLabel}
                        onChange={(e) => setCurrentLabel(e.target.value)}
                        disabled={timerIsActive}
                        className="w-full bg-gray-700 border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                    />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Session Note</label>
                    <textarea
                        placeholder="e.g., Focused on useEffect cleanup."
                        value={currentNote}
                        onChange={(e) => setCurrentNote(e.target.value)}
                        disabled={timerIsActive}
                        rows={2}
                        className="w-full bg-gray-700 border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 resize-none"
                    />
                </div>
            </div>
        )}
    </div>
  );
};

export default SessionSetup;
