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
  discType = 'D', 
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

  return (
    <>
      {!isUser && (
        <View style={styles.aiNameContainer}>
          <Text style={styles.aiName}>{personaName}</Text>
        </View>
      )}
      <View
        style={[
          styles.rowContainer,
          isUser ? styles.rowReverse : styles.row,
        ]}
      >
        {isUser ? (
          <>
            <Text style={styles.time}>{formattedTime}</Text>
            <View style={[styles.bubble, styles.bubbleUser]}>
              <Text style={styles.text}>{text}</Text>
            </View>
          </>
        ) : (
          <>
            <Image
              source={getAvatarSource()}
              style={styles.avatar}
            />
            <View style={[styles.bubble, styles.bubbleAI]}>
              <Text style={styles.text}>{text}</Text>
            </View>
            <Text style={styles.time}>{formattedTime}</Text>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 4,
    paddingHorizontal: 9,
  },
  row: {
    justifyContent: 'flex-start',
  },
  rowReverse: {
    justifyContent: 'flex-end',
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
    marginHorizontal: 6,
    marginBottom: 2,
  },
  aiNameContainer: {
    paddingHorizontal: 20,
    marginBottom: 2,
  },
  aiName: {
    fontSize: 15,
    color: '#888',
    fontWeight: '600',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 14,
    marginRight: 8,
  },
});
