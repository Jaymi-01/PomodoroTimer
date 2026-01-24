import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Colors } from '../constants/Colors';
import { TimerMode } from '../context/TimerContext';

interface ModeSelectorProps {
  currentMode: TimerMode;
  onChangeMode: (mode: TimerMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onChangeMode }) => {
  return (
    <View style={styles.container}>
      <ModeButton 
        title="Focus" 
        active={currentMode === 'focus'} 
        onPress={() => onChangeMode('focus')} 
        color={Colors.primary}
      />
      <ModeButton 
        title="Short Break" 
        active={currentMode === 'shortBreak'} 
        onPress={() => onChangeMode('shortBreak')} 
        color={Colors.secondary}
      />
      <ModeButton 
        title="Long Break" 
        active={currentMode === 'longBreak'} 
        onPress={() => onChangeMode('longBreak')} 
        color={Colors.longBreak}
      />
    </View>
  );
};

const ModeButton = ({ title, active, onPress, color }: { title: string, active: boolean, onPress: () => void, color: string }) => (
  <TouchableOpacity 
    style={[
      styles.button, 
      active && { backgroundColor: color + '20', borderColor: color }
    ]} 
    onPress={onPress}
  >
    <Text style={[styles.text, active && { color, fontWeight: 'bold' }]}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: Colors.surface,
    padding: 5,
    borderRadius: 25,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  text: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
});
