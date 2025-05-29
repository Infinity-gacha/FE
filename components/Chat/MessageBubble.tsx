// 통합된 스타일의 MessageBubble.tsx (emotion 지원 추가)
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { PersonaType } from '../../types';

interface Props {
  text: string;
  isUser: boolean;
  timestamp: number;
  discType?: PersonaType; // DISC 유형
  personaName?: string; // 페르소나 이름 속성
  profileImageUrl?: string; // 프로필 이미지 URL
  emotion?: string; // 감정 태그 속성
}

export default function MessageBubble({ 
  text, 
  isUser, 
  timestamp, 
  discType = 'D',
  personaName = '페르소나',
  profileImageUrl,
  emotion
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

  // 감정 태그에 따른 색상 결정
  const getEmotionColor = () => {
    if (!emotion) return '#888';
    
    switch(emotion.toLowerCase()) {
      case '기쁨':
      case '행복':
      case '즐거움':
      case '친근':
        return '#FF9500'; // 주황색
      case '슬픔':
      case '우울':
      case '실망':
        return '#007AFF'; // 파란색
      case '화남':
      case '분노':
      case '짜증':
        return '#FF3B30'; // 빨간색
      case '놀람':
      case '당황':
        return '#5856D6'; // 보라색
      case '걱정':
      case '불안':
      case '공포':
        return '#34C759'; // 초록색
      case '중립':
      case '평온':
      case '차분':
        return '#8E8E93'; // 회색
      default:
        return '#888'; // 기본 회색
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
  
  // AI 메시지: 왼쪽 상단에 프로필과 이름 고정 + emotion 표시 추가
  return (
    <View style={styles.aiContainer}>
      <View style={styles.aiHeader}>
        <Image source={getAvatarSource()} style={styles.avatar} />
        <Text style={styles.aiName}>{personaName}</Text>
        {/* emotion이 있으면 이름 옆에 표시 */}
        {emotion && (
          <View style={styles.emotionBadge}>
            <Text style={[styles.emotionText, { color: getEmotionColor() }]}>
              {emotion}
            </Text>
          </View>
        )}
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
  rowReverse: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 4,
    paddingHorizontal: 9,
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
  emotionBadge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  emotionText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
