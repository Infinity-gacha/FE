import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { PersonaType } from '../../types';

// 기본 이미지 경로 상수 정의
const DEFAULT_PROFILE_IMAGE = 'https://personatalk-s3.s3.ap-northeast-2.amazonaws.com/profiles/default/default.jpg';

// ChatBubble 컴포넌트의 props 인터페이스 정의
interface ChatBubbleProps {
  text: string;
  isUser: boolean;
  timestamp: number;
  discType: PersonaType;
  personaName: string;
  profileImageUrl?: string; // 프로필 이미지 URL 추가
}

export default function ChatBubble({ 
  text, 
  isUser, 
  timestamp, 
  discType, 
  personaName,
  profileImageUrl 
}: ChatBubbleProps) {
  // 이미지 로딩 상태 관리
  const [imageError, setImageError] = useState(false);
  
  // 시간 포맷팅 함수
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // DISC 유형에 따른 색상 설정
  const getBubbleColor = () => {
    if (isUser) return '#e6f7ff';
    
    switch (discType) {
      case 'D': return '#ffecb3'; // 노란색 계열
      case 'I': return '#e8f5e9'; // 초록색 계열
      case 'S': return '#e3f2fd'; // 파란색 계열
      case 'C': return '#f3e5f5'; // 보라색 계열
      default: return '#f5f5f5'; // 기본 회색
    }
  };

  // 실제 사용할 이미지 URL 결정
  const getImageSource = () => {
    if (imageError || !profileImageUrl) {
      return require('../../assets/default-profile.png');
    }
    return { uri: profileImageUrl };
  };

  return (
    <View style={[
      styles.container,
      isUser ? styles.userContainer : styles.aiContainer
    ]}>
      {/* 페르소나 프로필 이미지 추가 (AI 메시지일 때만) */}
      {!isUser && (
        <View style={styles.profileImageContainer}>
          <Image 
            source={getImageSource()}
            style={styles.profileImage} 
            onError={(e) => {
              console.log('이미지 로딩 실패:', e.nativeEvent.error);
              setImageError(true);
            }}
          />
          <Text style={styles.personaName}>{personaName}</Text>
        </View>
      )}
      
      <View style={[
        styles.bubble,
        isUser ? styles.userBubble : styles.aiBubble,
        { backgroundColor: getBubbleColor() }
      ]}>
        <Text style={styles.text}>{text}</Text>
      </View>
      <Text style={[
        styles.time,
        isUser ? styles.userTime : styles.aiTime
      ]}>
        {formatTime(timestamp)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    maxWidth: '80%',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  aiContainer: {
    alignSelf: 'flex-start',
  },
  profileImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  profileImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 6,
  },
  personaName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  bubble: {
    padding: 12,
    borderRadius: 18,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  time: {
    fontSize: 12,
    marginTop: 4,
    color: '#999',
  },
  userTime: {
    alignSelf: 'flex-end',
  },
  aiTime: {
    alignSelf: 'flex-start',
  },
});
