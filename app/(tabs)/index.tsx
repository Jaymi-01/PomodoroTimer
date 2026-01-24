import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { useTimer } from '../../context/TimerContext';
import { CircularProgress } from '../../components/CircularProgress';
import { TimerControls } from '../../components/TimerControls';
import { ModeSelector } from '../../components/ModeSelector';
import { TagSelector } from '../../components/TagSelector';
import { Colors } from '../../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export default function TimerScreen() {
  const {
    timer,
    isActive,
    mode,
    duration,
    selectedTag,
    setMode,
    setSelectedTag,
    startTimer,
    pauseTimer,
    resetTimer,
  } = useTimer();

  const progress = duration > 0 ? timer / duration : 0;
  
  // Determine color based on mode
  let progressColor = Colors.primary;
  if (mode === 'shortBreak') progressColor = Colors.secondary;
  if (mode === 'longBreak') progressColor = Colors.longBreak;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pomodoro</Text>
      </View>

      <View style={styles.content}>
        <ModeSelector currentMode={mode} onChangeMode={setMode} />

        <View style={styles.timerContainer}>
          <CircularProgress
            progress={progress}
            size={width * 0.7}
            strokeWidth={12}
            color={progressColor}
          >
            <View style={styles.timeWrapper}>
               <Text style={styles.timeText}>{formatTime(timer)}</Text>
               <Text style={styles.modeText}>
                 {mode === 'focus' ? 'Focus' : mode === 'shortBreak' ? 'Short Break' : 'Long Break'}
               </Text>
            </View>
          </CircularProgress>
        </View>

        <TagSelector 
          selectedTag={selectedTag} 
          onSelectTag={setSelectedTag} 
          disabled={isActive}
        />

        <TimerControls
          isActive={isActive}
          onStart={startTimer}
          onPause={pauseTimer}
          onReset={resetTimer}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 0,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  timerContainer: {
    marginVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 48,
    fontWeight: '200',
    color: Colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  modeText: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginTop: 5,
  },
});
