// 통합된 스타일의 ChatListScreen.tsx - 페르소나 삭제 기능 추가
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, PersonaType } from '../types';
import { useChatStore } from '../store/useChatStore';
import LinearGradient from 'react-native-linear-gradient';
import ScreenWrapper from '../layouts/ScreenWrapper';

type ChatListNavigationProp = StackNavigationProp<RootStackParamList, 'ChatList'>;

export default function ChatListScreen() {
  const navigation = useNavigation<ChatListNavigationProp>();
  const chatRooms = useChatStore(state => state.chatRooms);
  const syncPersonasAndChats = useChatStore(state => state.syncPersonasAndChats);
  const deletePersona = useChatStore(state => state.deletePersona); // 페르소나 삭제 함수 가져오기
  const isLoading = useChatStore(state => state.isLoading);
  const [refreshing, setRefreshing] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // 편집 모드 상태 추가
  const [isDeleting, setIsDeleting] = useState(false); // 삭제 진행 중 상태 추가
  
  // 화면 진입 시 페르소나 및 채팅 내역 동기화
  useEffect(() => {
    const loadPersonasAndChats = async () => {
      if (Object.keys(chatRooms).length === 0) {
        await syncPersonasAndChats();
      }
    };
    
    loadPersonasAndChats();
  }, []);
  
  // 수동 새로고침 처리
  const handleRefresh = async () => {
    setRefreshing(true);
    await syncPersonasAndChats();
    setRefreshing(false);
  };

  // 페르소나 삭제 처리 함수
  const handleDeletePersona = async (roomId: string, personaId: string, personaName: string) => {
    if (isDeleting) return; // 이미 삭제 중이면 중복 실행 방지
    
    Alert.alert(
      '삭제 확인',
      `"${personaName}" 페르소나를 삭제하시겠습니까?\n\n삭제 시 모든 대화 내용과 요약 정보가 영구적으로 제거됩니다.`,
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(true);
              
              // 페르소나 삭제 API 호출
              const result = await deletePersona(personaId);
              
              if (result.success) {
                // 삭제 성공 시 편집 모드 해제 및 알림
                setIsEditing(false);
                Alert.alert('알림', `"${personaName}" 페르소나가 삭제되었습니다.`);
                
                // 페르소나 및 채팅 내역 다시 동기화 (UI 갱신)
                await syncPersonasAndChats();
              } else {
                // 삭제 실패 시 오류 메시지 표시
                Alert.alert('오류', `페르소나 삭제에 실패했습니다: ${result.error?.message || '알 수 없는 오류'}`);
              }
            } catch (error) {
              console.error('페르소나 삭제 중 오류 발생:', error);
              Alert.alert('오류', '페르소나 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const roomIds = Object.keys(chatRooms);

  // PersonaType으로 안전하게 변환하는 함수
  const toPersonaType = (type: string): PersonaType => {
    if (type === 'D' || type === 'I' || type === 'S' || type === 'C') {
      return type as PersonaType;
    }
    return 'D'; // 기본값
  };

  return (
    <ScreenWrapper>
      <LinearGradient colors={['#DEE5F6', '#FAEDFA']} style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* 헤더 행 추가 (제목 + 편집 버튼) */}
          <View style={styles.headerRow}>
            <Text style={styles.header}>채팅 내역</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(!isEditing)}
              disabled={isLoading || refreshing || isDeleting}
            >
              <Text style={styles.editButtonText}>{isEditing ? '완료' : '편집'}</Text>
            </TouchableOpacity>
          </View>
          
          {isLoading || refreshing || isDeleting ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#000" />
              <Text style={styles.loadingText}>
                {isDeleting ? '페르소나 삭제 중...' : '채팅 내역을 불러오는 중...'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={roomIds}
              keyExtractor={(roomId, index) => `${roomId}-${index}`}
              renderItem={({ item: roomId }) => {
                const room = chatRooms[roomId];
                // personaName을 사용하여 실제 페르소나 이름 표시
                const personaName = room?.personaName || '페르소나';
                const lastMessage = room?.messages[room.messages.length - 1]?.text || '(대화 없음)';
                
                return (
                  <View style={styles.itemRow}>
                    <TouchableOpacity
                      style={[styles.item, isEditing && styles.itemEditing]}
                      onPress={() => navigation.navigate('ChatRoom', { 
                        roomId, 
                        personaId: room.personaId,
                        type: toPersonaType(room.discType),
                        personaName: personaName // personaName 파라미터 추가
                      })}
                      disabled={isEditing}
                    >
                      <Text style={styles.aiName}>{personaName}</Text>
                      <Text style={styles.message}>{lastMessage}</Text>
                    </TouchableOpacity>

                    {isEditing && (
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeletePersona(roomId, room.personaId, personaName)}
                        disabled={isDeleting}
                      >
                        <Text style={styles.deleteButtonText}>삭제</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              }}
              ListEmptyComponent={
                <Text style={styles.empty}>대화 내역이 없습니다.</Text>
              }
              onRefresh={handleRefresh}
              refreshing={refreshing}
            />
          )}
        </View>
      </LinearGradient>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60, // ChatListScreen.tsx의 상단 여백 유지
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#6a5acd',
    borderRadius: 6,
  },
  editButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  item: {
    flex: 1,
    padding: 16,
    backgroundColor: '#d6e4ff',
    borderRadius: 12,
  },
  itemEditing: {
    opacity: 0.7, // 편집 모드일 때 약간 흐리게 표시
  },
  aiName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
  },
  message: {
    fontSize: 16,
  },
  deleteButton: {
    marginLeft: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#ff5c5c',
    borderRadius: 12,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  empty: {
    fontSize: 16,
    textAlign: 'center',
    color: '#999',
    marginTop: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});
