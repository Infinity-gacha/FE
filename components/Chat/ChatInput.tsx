import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, ActivityIndicator, Alert } from 'react-native';
import MicrophoneIcon from '../../assets/icons/MicrophoneIcon';
import VoiceRecognition, { VoiceRecognitionState } from '../../utils/VoiceRecognition';


interface Props {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: Props) {
  const [text, setText] = useState('');
  const [voiceState, setVoiceState] = useState<VoiceRecognitionState>({
    isRecognizing: false,
    results: [],
    partialResults: [],
  });

  // 음성인식 상태 리스너 등록
  useEffect(() => {
    const removeListener = VoiceRecognition.addListener(setVoiceState);
    
    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      removeListener();
    };
  }, []);

  // 음성인식 결과가 변경될 때마다 텍스트 업데이트
  useEffect(() => {
    if (voiceState.results.length > 0) {
      setText(voiceState.results[0]);
    } else if (voiceState.partialResults.length > 0) {
      setText(voiceState.partialResults[0]);
    }
  }, [voiceState.results, voiceState.partialResults]);

  const handleSend = () => {
    if (text.trim()) {
      onSend(text);
      setText('');
    }
  };

  // ChatInput.tsx의 handleVoiceToggle 함수 수정
const handleVoiceToggle = async () => {
 
  
  // 권한이 확인된 후 음성인식 토글
  await VoiceRecognition.toggleRecognizing();
};
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TouchableOpacity 
          style={[
            styles.iconButton, 
            voiceState.isRecognizing && styles.activeIconButton
          ]} 
          onPress={handleVoiceToggle}
        >
          {voiceState.isRecognizing ? (
            <ActivityIndicator size="small" color="#ff4040" />
          ) : (
            <MicrophoneIcon 
              color="#666" 
              active={voiceState.isRecognizing} 
            />
          )}
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="메시지를 입력하세요"
          value={text}
          onChangeText={setText}
          editable={!disabled}
        />
      </View>
      <TouchableOpacity 
        onPress={handleSend} 
        style={[styles.button, (!text.trim() || disabled) && styles.disabledButton]}
        disabled={!text.trim() || disabled}
      >
        <Text style={styles.buttonText}>전송</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#FAEDFA',
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
    height: 32,
    width: 32,
    borderRadius: 16,
  },
  activeIconButton: {
    backgroundColor: 'rgba(255, 64, 64, 0.1)',
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
  disabledButton: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
});
