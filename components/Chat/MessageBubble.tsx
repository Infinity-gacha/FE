// 통합된 스타일의 MessageBubble.tsx
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import {  PersonaType } from '../../types';

interface Props {
  text: string;
  isUser: boolean;
  timestamp: number;
  discType?: PersonaType; // DISC 유형
  personaName?: string; // 페르소나 이름 속성
  profileImageUrl?: string; // 프로필 이미지 URL
}

export default function MessageBubble({ 
  text, 
  isUser, 
  timestamp, 
  personaName = '페르소나',
  profileImageUrl
}: Props) {
  const formattedTime = new Date(timestamp).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });


  // 프로필 이미지 소스 로직
  const getAvatarSource = () => {
    if (profileImageUrl) {
      return { uri: profileImageUrl };
    }
  };
  if (isUser) {
    // 유저 메시지: 기존대로
    return (
      <View style={[styles.rowContainer, styles.rowReverse]}>
        <Text style={styles.time}>{formattedTime}</Text>
        <View style={[styles.bubble, styles.bubbleUser]}>
          <Text style={styles.text}>{text}</Text>
        </View>
      </View>
    );
  }
  // AI 메시지: 왼쪽 상단에 프로필과 이름 고정
  return (
    <View style={styles.aiContainer}>
      <View style={styles.aiHeader}>
        <Image source={getAvatarSource()} style={styles.avatar} />
        <Text style={styles.aiName}>{personaName}</Text>
      </View>

      <View style={styles.rowContainer}>
        <View style={[styles.bubble, styles.bubbleAI]}>
          <Text style={styles.text}>{text}</Text>
        </View>
        <Text style={styles.time}>{formattedTime}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  aiContainer: {
    paddingHorizontal: 9,
    marginVertical: 6,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  aiName: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bubbleUser: {
    backgroundColor: '#DCF8C6',
  },
  bubbleAI: {
    backgroundColor: '#FFF5C6',
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
  time: {
    fontSize: 10,
    color: '#666',
    marginLeft: 8,
    marginBottom: 2,
  },
  rowReverse: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 4,
    paddingHorizontal: 9,
  },
});
