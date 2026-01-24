import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

interface TimerControlsProps {
  isActive: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  isActive,
  onStart,
  onPause,
  onReset,
}) => {
  return (
    <View style={styles.container}>
      {!isActive ? (
        <TouchableOpacity style={[styles.button, styles.startButton]} onPress={onStart}>
          <Ionicons name="play" size={24} color="white" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[styles.button, styles.pauseButton]} onPress={onPause}>
          <Ionicons name="pause" size={24} color="white" />
        </TouchableOpacity>
      )}
      
      <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={onReset}>
         <Ionicons name="refresh" size={20} color={Colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginTop: 20,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  startButton: {
    backgroundColor: Colors.primary,
  },
  pauseButton: {
    backgroundColor: Colors.warning,
  },
  resetButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    elevation: 3,
  },
});
