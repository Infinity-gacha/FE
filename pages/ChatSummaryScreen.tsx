// ChatSummaryScreen.tsx - 요약 재생성 버튼 추가 (최종 버전)
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { useChatStore } from '../store/useChatStore';
import BottomNavBar from '../layouts/BottomNavBar';
import LinearGradient from 'react-native-linear-gradient';

type ChatSummaryRouteProp = RouteProp<RootStackParamList, 'ChatSummary'>;

export default function ChatSummaryScreen() {
  const route = useRoute<ChatSummaryRouteProp>();
  const roomId = route?.params?.roomId;
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [localSummary, setLocalSummary] = useState<any>(null);

  // Zustand 스토어에서 채팅방 정보 가져오기
  const { chatRooms } = useChatStore();
  const chatRoom = roomId ? chatRooms[roomId] : undefined;

  // 페르소나 이름과 요약 데이터 가져오기
  const personaName = chatRoom?.personaName || '페르소나';
  const personaId = chatRoom?.personaId;
  
  // 스토어의 요약 데이터와 로컬 요약 데이터 중 최신 것 사용
  const summary = localSummary || chatRoom?.summary;

  // 채팅방 정보가 변경될 때마다 로컬 요약 데이터 업데이트
  useEffect(() => {
    if (chatRoom?.summary) {
      setLocalSummary(chatRoom.summary);
    }
  }, [chatRoom?.summary]);

  // 요약 재생성 함수
  const handleRegenerateSummary = async () => {
    if (!personaId) {
      Alert.alert('오류', '페르소나 ID가 유효하지 않습니다.');
      return;
    }

    try {
      setIsRegenerating(true);
      
      const { generateChatSummary } = useChatStore.getState();
      const result = await generateChatSummary(personaId);
      
      if (result && result.success) {
        // 최신 채팅방 정보 가져오기
        const updatedChatRooms = useChatStore.getState().chatRooms;
        const updatedRoom = updatedChatRooms[roomId || ''];
        
        if (updatedRoom && updatedRoom.summary) {
          // 로컬 상태 업데이트로 화면 즉시 갱신
          setLocalSummary(updatedRoom.summary);
          Alert.alert('성공', '채팅 요약이 재생성되었습니다.');
        } else {
          Alert.alert('알림', '요약이 생성되었지만 데이터를 불러오지 못했습니다. 화면을 새로고침해주세요.');
        }
      } else {
        Alert.alert('오류', '채팅 요약 재생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('요약 재생성 실패:', error);
      Alert.alert('오류', '채팅 요약 재생성 중 오류가 발생했습니다.');
    } finally {
      setIsRegenerating(false);
    }
  };

  if (!chatRoom) {
    return (
      <LinearGradient colors={['#DEE5F6', '#FAEDFA']} style={{ flex: 1 }}>
        <View style={styles.wrapper}>
          <View style={styles.container}>
            <Text style={styles.errorText}>채팅방 정보를 찾을 수 없습니다.</Text>
          </View>
          <BottomNavBar roomId={roomId || ''} />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#DEE5F6', '#FAEDFA']} style={{ flex: 1 }}>
      <View style={styles.wrapper}>
        <ScrollView style={styles.container}>
          {/* 페르소나 이름과 점수 표시 */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{personaName}와의 대화</Text>
            <Text style={styles.score}>총점: {summary?.score || 0}/10</Text>
          </View>

          {/* 이번 대화의 핵심 */}
          <Text style={styles.title}>이번 대화의 핵심</Text>
          <View style={styles.box}>
            <Text style={styles.boxText}>
              {summary?.corePoints || '아직 대화 요약이 생성되지 않았습니다.'}
            </Text>
          </View>

          {/* 개선점 */}
          <Text style={styles.title}>개선점</Text>
          <View style={styles.box}>
            <Text style={styles.boxText}>
              {summary?.improvements || '아직 개선점이 생성되지 않았습니다.'}
            </Text>
          </View>

          {/* 대화 Tip */}
          <Text style={styles.title}>대화 Tip</Text>
          <View style={styles.box}>
            <Text style={styles.boxText}>
              {summary?.tips || '아직 대화 팁이 생성되지 않았습니다.'}
            </Text>
          </View>
          
          {/* 요약 생성 시간 및 재생성 버튼 */}
          <View style={styles.timestampContainer}>
            {summary?.timestamp && (
              <Text style={styles.timestamp}>
                생성 시간: {new Date(summary.timestamp).toLocaleString()}
              </Text>
            )}
            
            {/* 요약 재생성 버튼 */}
            <TouchableOpacity 
              style={[
                styles.regenerateButton,
                isRegenerating && styles.regenerateButtonDisabled
              ]}
              onPress={handleRegenerateSummary}
              disabled={isRegenerating}
            >
              {isRegenerating ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.regenerateButtonText}>요약 재생성</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
        <BottomNavBar roomId={roomId || ''} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a6da7',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 12,
  },
  box: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  boxText: {
    fontSize: 16,
    color: '#222',
    lineHeight: 24,
  },
  timestampContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginTop: 8,
    marginBottom: 20,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  regenerateButton: {
    backgroundColor: '#6c7ee4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
    minHeight: 36,
  },
  regenerateButtonDisabled: {
    backgroundColor: '#a0b0c7',
  },
  regenerateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: '#ff6b6b',
    textAlign: 'center',
    marginTop: 32,
  },
});
