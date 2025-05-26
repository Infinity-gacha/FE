// 수정된 ChatRoomScreen.tsx - personaName 파라미터 기반 처리

import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';
import ChatBubble from '../components/Chat/MessageBubble';
import ChatInput from '../components/Chat/ChatInput';
import { useChatStore } from '../store/useChatStore';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import LinearGradient from 'react-native-linear-gradient';
import { ChatService } from '../api-service';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
}

interface ApiError {
  message: string;
  response?: {
    status: number;
    data?: any;
  };
}

// RootStackParamList 타입 확장 (types.ts에도 추가 필요)
type ExtendedChatRoomScreenRouteProp = RouteProp<
  RootStackParamList & { 
    ChatRoom: { 
      roomId: string; 
      personaId: string; 
      type?: 'D' | 'I' | 'S' | 'C';
      personaName: string; // personaName 파라미터 추가
    } 
  }, 
  'ChatRoom'
>;

export default function ChatRoomScreen() {
  const flatListRef = useRef<FlatList>(null);
  const route = useRoute<ExtendedChatRoomScreenRouteProp>();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [loadingMessageId, setLoadingMessageId] = useState<string | null>(null);
  const [historyFetched, setHistoryFetched] = useState(false);

  const roomId = route?.params?.roomId;
  const personaId = route?.params?.personaId;
  const discType = route?.params?.type || 'D';
  // 네비게이션 파라미터에서 personaName 직접 사용
  const personaName = route?.params?.personaName || '페르소나';

  const { chatRooms, sendMessage, createRoomIfNotExists, clearMessages } = useChatStore();

  // 초기 설정 및 채팅 기록 로드
  useEffect(() => {
    if (!roomId) {
      navigation.goBack();
      return;
    }
    
    if (personaId && !historyFetched) {
      createRoomIfNotExists(roomId, personaId, discType);
      fetchChatHistory();
    } else {
      createRoomIfNotExists(roomId);
    }
    
    // 헤더 타이틀 설정 - 파라미터에서 직접 가져온 personaName 사용
    navigation.setOptions({
      title: personaName,
    });
  }, [roomId, personaId, historyFetched, personaName]);

  const messages = chatRooms[roomId]?.messages || [];

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // 채팅 기록 불러오기
  const fetchChatHistory = async () => {
    if (!personaId) {
      console.log('personaId가 없어 채팅 기록을 불러올 수 없습니다.');
      return;
    }
    
    setIsHistoryLoading(true);
    
    try {
      const personaIdNum = parseInt(personaId);
      
      console.log(`채팅 기록 불러오기 시작: personaId=${personaIdNum}`);
      
      const result = await ChatService.getChatHistory(personaIdNum);
      
      console.log('채팅 기록 응답:', result);
      
      if (result && result.success && result.data) {
        clearMessages(roomId);
        
        if (Array.isArray(result.data) && result.data.length > 0) {
          result.data.forEach((msg: any) => {
            if (msg && msg.id && msg.content) {
              const message: Message = {
                id: msg.id.toString(),
                text: msg.content,
                isUser: msg.senderType === 'USER',
                timestamp: msg.timestamp ? new Date(msg.timestamp).getTime() : Date.now()
              };
              sendMessage(roomId, message);
            }
          });
          console.log(`${result.data.length}개의 메시지를 로드했습니다.`);
        } else {
          console.log('채팅 기록이 비어있습니다.');
        }
      } else {
        console.log('채팅 기록이 없거나 불러오기 실패:', result?.error || '알 수 없는 오류');
        
        setIsHistoryLoading(false);
        
        const welcomeMessage: Message = {
          id: Date.now().toString(),
          text: '새로운 대화를 시작해보세요!',
          isUser: false,
          timestamp: Date.now()
        };
        sendMessage(roomId, welcomeMessage);
      }
    } catch (error) {
      const apiError = error as ApiError;
      console.error('채팅 기록 조회 오류:', apiError.message);
      
      Alert.alert('오류 발생', '채팅 기록을 불러오는 중 오류가 발생했습니다.');
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: '채팅 기록을 불러오지 못했습니다. 새로운 대화를 시작해보세요.',
        isUser: false,
        timestamp: Date.now()
      };
      sendMessage(roomId, errorMessage);
    } finally {
      setIsHistoryLoading(false);
      setHistoryFetched(true);
      console.log('채팅 기록 로딩 완료');
    }
  };

  const handleSend = async (text: string) => {
    if (!roomId || !personaId) return;
    
    const now = Date.now();
    
    const userMessage: Message = {
      id: now.toString(),
      text,
      isUser: true,
      timestamp: now,
    };
    sendMessage(roomId, userMessage);
    
    const loadingId = (now + 1).toString();
    setLoadingMessageId(loadingId);
    const loadingMessage: Message = {
      id: loadingId,
      text: '응답 생성 중...',
      isUser: false,
      timestamp: now + 1,
    };
    sendMessage(roomId, loadingMessage);
    
    setIsLoading(true);
    
    try {
      const personaIdNum = parseInt(personaId);
      
      const result = await ChatService.sendMessage(personaIdNum, text);
      
      if (result && result.success && result.data) {
        const aiMessage: Message = {
          id: loadingId,
          text: result.data.content || '응답입니다.',
          isUser: false,
          timestamp: now + 2,
        };
        sendMessage(roomId, aiMessage);
      } else {
        const errorMessage: Message = {
          id: loadingId,
          text: '메시지 전송 중 오류가 발생했습니다.',
          isUser: false,
          timestamp: now + 2,
        };
        sendMessage(roomId, errorMessage);
        console.error('메시지 전송 실패:', result?.error || '알 수 없는 오류');
      }
    } catch (error) {
      const errorMessage: Message = {
        id: loadingId,
        text: '메시지 전송 중 오류가 발생했습니다.',
        isUser: false,
        timestamp: now + 2,
      };
      sendMessage(roomId, errorMessage);
      
      const apiError = error as ApiError;
      console.error('메시지 전송 오류:', apiError.message);
    } finally {
      setIsLoading(false);
      setLoadingMessageId(null);
    }
  };

  if (!roomId) {
    return (
      <View style={styles.errorContainer}>
        <Text>잘못된 접근입니다. (roomId 없음)</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#DEE5F6', '#FAEDFA']} style={styles.gradient}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 20}
          >
            <View style={styles.inner}>
              {isHistoryLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#000" />
                  <Text style={styles.loadingText}>채팅 기록을 불러오는 중...</Text>
                </View>
              ) : (
                <FlatList
                  ref={flatListRef}
                  data={messages}
                  keyExtractor={(item, index) => `${item.id}-${index}`} // 고유한 키 생성을 위해 id와 index 조합
                  renderItem={({ item }) => (
                    <ChatBubble
                      text={item.text}
                      isUser={item.isUser}
                      timestamp={item.timestamp}
                      discType={discType}
                      personaName={personaName}
                    />
                  )}
                  contentContainerStyle={styles.list}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                  ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                      <Text style={styles.emptyText}>대화를 시작해보세요!</Text>
                    </View>
                  }
                />
              )}
              <ChatInput onSend={handleSend} />
              
              {isLoading && (
                <View style={styles.sendingIndicator}>
                  <ActivityIndicator size="small" color="#000" />
                </View>
              )}
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  list: {
    padding: 12,
    paddingBottom: 8,
    flexGrow: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  sendingIndicator: {
    position: 'absolute',
    right: 20,
    bottom: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 15,
    padding: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
