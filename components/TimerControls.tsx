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
          <Ionicons name="play" size={32} color="white" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[styles.button, styles.pauseButton]} onPress={onPause}>
          <Ionicons name="pause" size={32} color="white" />
        </TouchableOpacity>
      )}
      
      <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={onReset}>
         <Ionicons name="refresh" size={24} color={Colors.textSecondary} />
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
    marginTop: 30,
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    elevation: 8,
  },
  startButton: {
    backgroundColor: Colors.primary,
  },
  pauseButton: {
    backgroundColor: Colors.warning,
  },
  resetButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.surface,
    elevation: 4,
  },
});
