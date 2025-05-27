import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ProfileButtonsProps {
  onChangeImage: () => void;
  onDeleteImage: () => void;
}

const ProfileButtons: React.FC<ProfileButtonsProps> = ({ onChangeImage, onDeleteImage }) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={onChangeImage}>
        <Text style={styles.buttonText}>이미지 변경하기</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={onDeleteImage}>
        <Text style={[styles.buttonText, { color: '#ff4d4d' }]}>삭제하기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileButtons;

const styles = StyleSheet.create({
  buttonContainer: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
    width: '100%',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#fff0f0',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});