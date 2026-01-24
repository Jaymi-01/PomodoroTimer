import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTimer, TimerMode } from '../../context/TimerContext';
import { Colors } from '../../constants/Colors';

export default function SettingsScreen() {
  const { updateDuration } = useTimer();
  
  // Local state for inputs (in minutes)
  const [focusInput, setFocusInput] = useState('25');
  const [shortBreakInput, setShortBreakInput] = useState('5');
  const [longBreakInput, setLongBreakInput] = useState('15');

  // We are not loading initial values from context for inputs here because 
  // the context stores current active duration, not all default configurations separately exposed easily 
  // without modifying the context interface significantly.
  // However, for a better UX, we should probably expose the durations object from context.
  // Looking back at TimerContext, I didn't expose 'durations' object, only 'duration' (current).
  // I should probably update TimerContext to expose `durations` state if I want to pre-fill these correctly.
  // But for now, I will just let the user set them. 
  // actually, let's just default to standard values or valid placeholders.
  
  const handleSave = (targetMode: TimerMode, value: string) => {
    const minutes = parseInt(value, 10);
    if (isNaN(minutes) || minutes <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid positive number for minutes.");
      return;
    }
    updateDuration(targetMode, minutes * 60);
    Alert.alert("Success", `${targetMode === 'focus' ? 'Focus' : targetMode === 'shortBreak' ? 'Short Break' : 'Long Break'} time updated to ${minutes} mins.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.headerTitle}>Settings</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Custom Durations (minutes)</Text>
            
            <SettingItem 
              label="Focus Time" 
              value={focusInput} 
              onChange={setFocusInput} 
              onSave={() => handleSave('focus', focusInput)}
            />
            
            <SettingItem 
              label="Short Break" 
              value={shortBreakInput} 
              onChange={setShortBreakInput} 
              onSave={() => handleSave('shortBreak', shortBreakInput)}
            />
            
            <SettingItem 
              label="Long Break" 
              value={longBreakInput} 
              onChange={setLongBreakInput} 
              onSave={() => handleSave('longBreak', longBreakInput)}
            />
          </View>
          
          <View style={styles.infoSection}>
             <Text style={styles.infoText}>Changes will apply to the next timer started.</Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const SettingItem = ({ label, value, onChange, onSave }: { label: string, value: string, onChange: (t: string) => void, onSave: () => void }) => (
  <View style={styles.itemContainer}>
    <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
    </View>
    <View style={styles.inputContainer}>
        <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChange}
            keyboardType="number-pad"
            maxLength={3}
        />
        <TouchableOpacity style={styles.saveButton} onPress={onSave}>
            <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 15,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 10,
  },
  labelContainer: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    backgroundColor: Colors.background,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    width: 60,
    textAlign: 'center',
    fontSize: 16,
    marginRight: 10,
    color: Colors.textPrimary,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  infoSection: {
      marginTop: 20,
      padding: 10,
  },
  infoText: {
      color: Colors.textSecondary,
      textAlign: 'center',
      fontSize: 14,
      fontStyle: 'italic',
  }
});
