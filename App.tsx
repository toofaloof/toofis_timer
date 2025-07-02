import React, { useState, useEffect, useCallback } from 'react';
import { TimerMode, Session } from './types';
import TimerDisplay from './components/TimerDisplay';
import SessionSetup from './components/SessionSetup';
import SessionLog from './components/SessionLog';
import ProgressSummary from './components/ProgressSummary';
import { PlayIcon, PauseIcon, StopIcon } from './components/icons';

const App: React.FC = () => {
    const [mode, setMode] = useState<TimerMode>(TimerMode.IDLE);
    const [nextMode, setNextMode] = useState<TimerMode>(TimerMode.LEARN);
    const [timerIsActive, setTimerIsActive] = useState<boolean>(false);

    const [learnDuration, setLearnDuration] = useState<number>(() => {
        const saved = localStorage.getItem('learnDuration');
        return saved ? parseInt(saved, 10) : 25;
    });

    const [breakDuration, setBreakDuration] = useState<number>(() => {
        const saved = localStorage.getItem('breakDuration');
        return saved ? parseInt(saved, 10) : 5;
    });

    const [timeLeft, setTimeLeft] = useState<number>(learnDuration * 60);

    const [sessions, setSessions] = useState<Session[]>(() => {
        const saved = localStorage.getItem('sessions');
        return saved ? JSON.parse(saved) : [];
    });
    
    const [currentLabel, setCurrentLabel] = useState<string>('');
    const [currentNote, setCurrentNote] = useState<string>('');

    // Persist settings to localStorage
    useEffect(() => {
        localStorage.setItem('learnDuration', String(learnDuration));
        if (mode === TimerMode.IDLE && nextMode === TimerMode.LEARN) {
            setTimeLeft(learnDuration * 60);
        }
    }, [learnDuration, mode, nextMode]);

    useEffect(() => {
        localStorage.setItem('breakDuration', String(breakDuration));
        if (mode === TimerMode.IDLE && nextMode === TimerMode.BREAK) {
            setTimeLeft(breakDuration * 60);
        }
    }, [breakDuration, mode, nextMode]);

    useEffect(() => {
        localStorage.setItem('sessions', JSON.stringify(sessions));
    }, [sessions]);

    const handleSessionEnd = useCallback(() => {
        const completedSession: Session = {
            id: new Date().toISOString(),
            type: mode as TimerMode.LEARN | TimerMode.BREAK,
            duration: mode === TimerMode.LEARN ? learnDuration * 60 : breakDuration * 60,
            label: mode === TimerMode.LEARN ? currentLabel : undefined,
            note: mode === TimerMode.LEARN ? currentNote : undefined,
            completedAt: new Date().toISOString(),
        };

        setSessions(prev => [...prev, completedSession]);

        if (mode === TimerMode.LEARN) {
            setNextMode(TimerMode.BREAK);
            setTimeLeft(breakDuration * 60);
        } else {
            setNextMode(TimerMode.LEARN);
            setTimeLeft(learnDuration * 60);
            setCurrentLabel('');
            setCurrentNote('');
        }
        
        setMode(TimerMode.IDLE);
        setTimerIsActive(false);

        // Notification for session end
        new Audio('https://www.soundjay.com/buttons/sounds/button-16.mp3').play().catch(e => console.error("Audio playback failed", e));

    }, [mode, learnDuration, breakDuration, currentLabel, currentNote]);


    // Timer countdown effect
    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;
        if (timerIsActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timerIsActive && timeLeft === 0) {
            handleSessionEnd();
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [timerIsActive, timeLeft, handleSessionEnd]);


    const handleStartPause = () => {
        if (mode === TimerMode.IDLE) {
            setMode(nextMode);
        }
        setTimerIsActive(prev => !prev);
    };

    const handleStop = useCallback(() => {
        const initialDuration = mode === TimerMode.LEARN ? learnDuration * 60 : breakDuration * 60;
        const elapsedTime = initialDuration - timeLeft;

        if (elapsedTime > 0) {
            const partialSession: Session = {
                id: new Date().toISOString(),
                type: mode as TimerMode.LEARN | TimerMode.BREAK,
                duration: elapsedTime,
                label: mode === TimerMode.LEARN ? currentLabel : undefined,
                note: mode === TimerMode.LEARN ? currentNote : undefined,
                completedAt: new Date().toISOString(),
            };
            setSessions(prev => [...prev, partialSession]);
        }

        setTimerIsActive(false);
        setMode(TimerMode.IDLE);

        // After stopping, transition to the next state, as if the session ended.
        if (mode === TimerMode.LEARN) {
            setNextMode(TimerMode.BREAK);
            setTimeLeft(breakDuration * 60);
        } else {
            setNextMode(TimerMode.LEARN);
            setTimeLeft(learnDuration * 60);
            setCurrentLabel('');
            setCurrentNote('');
        }
    }, [mode, learnDuration, breakDuration, timeLeft, currentLabel, currentNote]);
    
    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 space-y-8">
            <header className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold">FocusFlow</h1>
                <p className="text-gray-400 mt-2">Your dedicated space for productive sessions.</p>
            </header>

            <TimerDisplay timeLeft={timeLeft} mode={mode} nextMode={nextMode} />

            <div className="flex items-center justify-center space-x-4">
                <button 
                    onClick={handleStartPause} 
                    className={`px-8 py-4 rounded-full text-white font-bold text-xl flex items-center space-x-2 transition-all duration-300 shadow-lg
                        ${timerIsActive ? 'bg-yellow-500 hover:bg-yellow-600' : 
                          (nextMode === TimerMode.LEARN ? 'bg-blue-600 hover:bg-blue-700' : 'bg-purple-600 hover:bg-purple-700')}`}
                >
                    {timerIsActive ? <PauseIcon /> : <PlayIcon />}
                    <span>{timerIsActive ? 'Pause' : (mode === TimerMode.IDLE ? `Start ${nextMode}` : 'Resume')}</span>
                </button>
                {timerIsActive && (
                    <button onClick={handleStop} className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold transition-all duration-300 shadow-lg">
                        <StopIcon className="w-8 h-8"/>
                    </button>
                )}
            </div>

            <SessionSetup
                learnDuration={learnDuration}
                setLearnDuration={setLearnDuration}
                breakDuration={breakDuration}
                setBreakDuration={setBreakDuration}
                currentLabel={currentLabel}
                setCurrentLabel={setCurrentLabel}
                currentNote={currentNote}
                setCurrentNote={setCurrentNote}
                timerIsActive={timerIsActive}
                nextModeIsLearn={mode === TimerMode.IDLE && nextMode === TimerMode.LEARN}
            />

            <ProgressSummary sessions={sessions} />
            <SessionLog sessions={sessions} />

            <footer className="text-center text-gray-500 py-4">
                <p>Crafted for focus.</p>
            </footer>
        </div>
    );
};

export default App;
