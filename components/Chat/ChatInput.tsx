import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import CameraIcon from '../../assets/icons/CameraIcon';
import MicIcon from '../../assets/icons/MicIcon';

interface Props {
  onSend: (text: string) => void;
  onCameraToggle: () => void;
  cameraOn: boolean;
}

export default function ChatInput({ onSend, onCameraToggle, cameraOn }: Props) {
  const [text, setText] = useState('');
  const [micActive, setMicActive] = useState(false); // 추가: 마이크 활성 상태

  const handleSend = () => {
    if (cameraOn) {
      // 카메라 켜진 상태면 마이크 버튼 누른 것으로 간주해서 micActive 토글
      setMicActive(prev => !prev);
    } else {
      // 카메라 꺼진 상태면 그냥 전송
      if (text.trim()) {
        onSend(text);
        setText('');
      }
    }
  };

  // 카메라 버튼 눌렀을 때 micActive 초기화(꺼짐) - 마이크는 항상 카메라 켜져야 켜짐
  const handleCameraToggle = () => {
    onCameraToggle();
    setMicActive(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TouchableOpacity style={styles.iconButton} onPress={handleCameraToggle}>
          <CameraIcon color={cameraOn ? 'purple' : '#333'} />
        </TouchableOpacity>
        {cameraOn ? (
          <Text style={styles.input}>{text}</Text>
        ) : (
          <TextInput
            style={styles.input}
            placeholder="메시지를 입력하세요"
            value={text}
            onChangeText={setText}
          />
        )}
      </View>
      <TouchableOpacity
        onPress={handleSend}
        style={[
          styles.button,
          cameraOn && micActive ? styles.micActiveButton : null,
        ]}
      >
        {cameraOn ? (
          <MicIcon color={micActive ? '#000' : 'white'} />
        ) : (
          <Text style={styles.buttonText}>전송</Text>
        )}
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
  micActiveButton: {
    backgroundColor: '#fff',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
});
