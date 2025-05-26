// 수정된 ChatListScreen.tsx - personaName 파라미터 추가

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, PersonaType } from '../types';
import { useChatStore } from '../store/useChatStore';
import LinearGradient from 'react-native-linear-gradient';
import ScreenWrapper from '../layouts/ScreenWrapper';
import { PersonaService } from '../api-service';

type ChatListNavigationProp = StackNavigationProp<RootStackParamList, 'ChatList'>;

export default function ChatListScreen() {
  const navigation = useNavigation<ChatListNavigationProp>();
  const chatRooms = useChatStore(state => state.chatRooms);
  const syncPersonasAndChats = useChatStore(state => state.syncPersonasAndChats);
  const isLoading = useChatStore(state => state.isLoading);
  const [refreshing, setRefreshing] = useState(false);
  
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
          <Text style={styles.header}>채팅 내역</Text>
          
          {isLoading || refreshing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#000" />
              <Text style={styles.loadingText}>채팅 내역을 불러오는 중...</Text>
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
                  <TouchableOpacity
                    style={styles.item}
                    onPress={() => navigation.navigate('ChatRoom', { 
                      roomId, 
                      personaId: room.personaId,
                      type: toPersonaType(room.discType),
                      personaName: personaName // personaName 파라미터 추가
                    })}
                  >
                    <Text style={styles.aiName}>{personaName}</Text>
                    <Text style={styles.message}>{lastMessage}</Text>
                  </TouchableOpacity>
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
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    padding: 16,
    backgroundColor: '#d6e4ff',
    borderRadius: 12,
    marginBottom: 12,
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
