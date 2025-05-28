import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import CameraIcon from '../../assets/icons/CameraIcon';

interface Props {
  onSend: (text: string) => void;
  onCameraToggle: () => void;
  cameraOn: boolean;
}

export default function ChatInput({ onSend, onCameraToggle, cameraOn }: Props) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText('');
    }
  };

  return (
    <View style={{ padding: 10, backgroundColor: '#FAEDFA' }}>
      <View style={styles.emotionRecognitionWrapper}>
        <Text style={styles.emotionRecognitionText}>사용자의 감정 인식중</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.inputWrapper}>
          <TouchableOpacity style={styles.iconButton} onPress={onCameraToggle}>
            <CameraIcon color={cameraOn ? 'purple' : '#666'} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="메시지를 입력하세요"
            value={text}
            onChangeText={setText}
          />
        </View>
        <TouchableOpacity onPress={handleSend} style={styles.button}>
          <Text style={styles.buttonText}>전송</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    alignItems: 'center',
    paddingHorizontal: 8,
    height: 40,
  },
  iconButton: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 8,
    height: 40,
  },
  button: {
    backgroundColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
  emotionRecognitionWrapper: {
    backgroundColor: '#eee',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  emotionRecognitionText: {
    fontSize: 16,
    color: '#666',
  },
});
