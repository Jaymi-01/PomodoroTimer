import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import { Colors } from '../constants/Colors';

const TAGS = ["Work", "Study", "Workout", "Reading", "Coding", "Meditation"];

interface TagSelectorProps {
  selectedTag: string;
  onSelectTag: (tag: string) => void;
  disabled?: boolean;
}

export const TagSelector: React.FC<TagSelectorProps> = ({ selectedTag, onSelectTag, disabled }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tag</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {TAGS.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[
              styles.tag,
              selectedTag === tag && styles.selectedTag,
              disabled && styles.disabledTag
            ]}
            onPress={() => !disabled && onSelectTag(tag)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.tagText,
              selectedTag === tag && styles.selectedTagText,
              disabled && styles.disabledTagText
            ]}>{tag}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: '100%',
  },
  label: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 8,
    marginLeft: 20,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 15,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedTag: {
    backgroundColor: Colors.primary + '15', // 15% opacity
    borderColor: Colors.primary,
  },
  tagText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  selectedTagText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  disabledTag: {
    opacity: 0.5,
  },
  disabledTagText: {
    color: Colors.textSecondary,
  }
});
