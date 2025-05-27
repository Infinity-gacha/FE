import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface RoundButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean; 
}

export default function RoundButton({ title, onPress, disabled = false }: RoundButtonProps) {
  return (
    <TouchableOpacity 
      style={[styles.button, disabled && styles.disabledButton]} 
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, disabled && styles.disabledText]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    margin: 15,
    width: 150,
  },
  disabledButton: {
    backgroundColor: '#999',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  disabledText: {
    color: '#ddd',
  },
});
