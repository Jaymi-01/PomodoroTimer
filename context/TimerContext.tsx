import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AppState, AppStateStatus, Vibration } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';

export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export interface Session {
  id: string;
  date: string; // ISO string
  duration: number; // in seconds
  mode: TimerMode;
  tag: string;
}

interface TimerContextType {
  timer: number;
  isActive: boolean;
  mode: TimerMode;
  duration: number;
  selectedTag: string;
  sessions: Session[];
  setMode: (mode: TimerMode) => void;
  setSelectedTag: (tag: string) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  updateDuration: (mode: TimerMode, durationInSeconds: number) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

const DEFAULT_DURATIONS = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<TimerMode>('focus');
  const [durations, setDurations] = useState(DEFAULT_DURATIONS);
  const [timer, setTimer] = useState(DEFAULT_DURATIONS.focus);
  const [isActive, setIsActive] = useState(false);
  const [selectedTag, setSelectedTag] = useState('Work');
  const [sessions, setSessions] = useState<Session[]>([]);
  
  const appState = useRef(AppState.currentState);
  const backgroundTimestamp = useRef<number | null>(null);

  // Keep awake when timer is running
  useEffect(() => {
    if (isActive) {
      activateKeepAwakeAsync();
    } else {
      deactivateKeepAwake();
    }
  }, [isActive]);

  useEffect(() => {
    // Load sessions and custom durations from storage on mount
    const loadData = async () => {
      try {
        const storedSessions = await AsyncStorage.getItem('sessions');
        if (storedSessions) {
          setSessions(JSON.parse(storedSessions));
        }
        const storedDurations = await AsyncStorage.getItem('durations');
        if (storedDurations) {
          setDurations(JSON.parse(storedDurations));
          // If we are currently in a mode, update the timer if it wasn't running? 
          // Actually, let's just leave it for now to avoid complexity on load.
        }
      } catch (e) {
        console.error("Failed to load data", e);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && isActive) {
      // Timer finished
      handleTimerComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timer]);

  // AppState Handling
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/active/) &&
        (nextAppState === 'background' || nextAppState === 'inactive')
      ) {
        // Going to background
        if (isActive) {
            backgroundTimestamp.current = Date.now();
        }
      } else if (
        appState.current.match(/background|inactive/) &&
        nextAppState === 'active'
      ) {
        // Coming to foreground
        if (isActive && backgroundTimestamp.current) {
          const now = Date.now();
          const elapsed = Math.floor((now - backgroundTimestamp.current) / 1000);
          setTimer((prev) => Math.max(0, prev - elapsed));
          backgroundTimestamp.current = null;
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [isActive]);

  const handleTimerComplete = async () => {
    setIsActive(false);
    Vibration.vibrate([500, 500, 500]); // Vibrate pattern

    // Save session
    const newSession: Session = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      duration: durations[mode],
      mode: mode,
      tag: selectedTag,
    };

    const updatedSessions = [...sessions, newSession];
    setSessions(updatedSessions);
    try {
      await AsyncStorage.setItem('sessions', JSON.stringify(updatedSessions));
    } catch (e) {
      console.error("Failed to save session", e);
    }
  };

  const startTimer = () => setIsActive(true);
  const pauseTimer = () => setIsActive(false);
  const resetTimer = () => {
    setIsActive(false);
    setTimer(durations[mode]);
  };

  const setMode = (newMode: TimerMode) => {
    setModeState(newMode);
    setIsActive(false);
    setTimer(durations[newMode]);
  };

  const updateDuration = async (targetMode: TimerMode, durationInSeconds: number) => {
    const newDurations = { ...durations, [targetMode]: durationInSeconds };
    setDurations(newDurations);
    if (mode === targetMode) {
      setTimer(durationInSeconds);
      setIsActive(false);
    }
    try {
        await AsyncStorage.setItem('durations', JSON.stringify(newDurations));
    } catch (e) {
        console.error("Failed to save durations", e);
    }
  };

  return (
    <TimerContext.Provider
      value={{
        timer,
        isActive,
        mode,
        duration: durations[mode],
        selectedTag,
        sessions,
        setMode,
        setSelectedTag,
        startTimer,
        pauseTimer,
        resetTimer,
        updateDuration,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};
