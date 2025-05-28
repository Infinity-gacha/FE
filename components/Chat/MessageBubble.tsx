import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { PersonaType } from '../../types';

// 기본 이미지 임포트
const defaultUserImage = require('../../assets/a.png');
const defaultNoneImage = require('../../assets/none.png');

interface Props {
  text: string;
  isUser: boolean;
  timestamp: number;
  discType?: PersonaType;
  personaName?: string;
  profileImageUrl?: string;
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
          isUser && styles.rowContainerUser, // 사용자 메시지일 때 오른쪽 정렬 (row-reverse)
        ]}
      >
        {isUser ? (
          <>
            <Text style={[styles.time, styles.timeUser]}>{formattedTime}</Text>
            <View style={[styles.bubble, styles.bubbleUser]}>
              <Text style={styles.text}>{text}</Text>
            </View>
            <Image
              source={profileImageUrl 
                ? { uri: profileImageUrl } 
                : defaultUserImage
              }
              style={styles.avatar}
            />
          </>
        ) : (
          <>
            <Image
              source={profileImageUrl 
                ? { uri: profileImageUrl } 
                : defaultNoneImage
              }
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
  rowContainerUser: {
    flexDirection: 'row-reverse', // 사용자 메시지 오른쪽 정렬 (역방향)
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
  timeUser: {
    // 사용자 메시지 시간은 오른쪽 마진 조금 더 줘서 이미지와 거리를 둠
    marginRight: 6,
    marginLeft: 0,
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
  },
});
