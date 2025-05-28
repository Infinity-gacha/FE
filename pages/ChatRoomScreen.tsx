
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
import { RootStackParamList, PersonaType } from '../types';
import LinearGradient from 'react-native-linear-gradient';
import { ChatService, PersonaService } from '../api-service';
import VoiceIndicator from '../components/Chat/VoiceIndicator';
import VoiceRecognition from '../utils/VoiceRecognition';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
  profileImageUrl?: string; 
}

interface ApiError {
  message: string;
  response?: {
    status: number;
    data?: any;
  };
}

type ExtendedChatRoomScreenRouteProp = RouteProp<
  RootStackParamList & { 
    ChatRoom: { 
      roomId: string; 
      personaId: string; 
      type?: PersonaType;
      personaName: string;
      profileImageUrl?: string; 
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
  const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>(undefined);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const roomId = route?.params?.roomId;
  const personaId = route?.params?.personaId;
  const discType = route?.params?.type || 'D';
  const personaName = route?.params?.personaName || '페르소나';
  const profileImageUrlParam = route?.params?.profileImageUrl;

  const { chatRooms, sendMessage, createRoomIfNotExists, clearMessages } = useChatStore();

  // 초기 설정 및 채팅 기록 로드
  useEffect(() => {
    if (!roomId) {
      navigation.goBack();
      return;
    }
    
    if (personaId) {
      createRoomIfNotExists(roomId, personaId, discType, personaName);
      
      // 네비게이션 파라미터에 이미지 URL이 있으면 사용
      if (profileImageUrlParam) {
        setProfileImageUrl(profileImageUrlParam);
      } else {
        // 없으면 페르소나 상세 정보 API 호출하여 이미지 URL 가져오기
        fetchPersonaDetails();
      }
      
      if (!historyFetched) {
        fetchChatHistory();
      }
    } else {
      createRoomIfNotExists(roomId);
    }
    
    // 헤더 타이틀 설정 - 파라미터에서 직접 가져온 personaName 사용
    navigation.setOptions({
      title: personaName,
      headerTitleAlign: 'center'
    });
  }, [roomId, personaId, historyFetched, personaName, profileImageUrlParam]);

  const messages = chatRooms[roomId]?.messages || [];

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // 페르소나 상세 정보 가져오기 (프로필 이미지 URL 포함)
  const fetchPersonaDetails = async () => {
    if (!personaId) {
      console.log('personaId가 없어 페르소나 상세 정보를 가져올 수 없습니다.');
      return;
    }
    
    try {
      const personaIdNum = parseInt(personaId);
      console.log(`페르소나 상세 정보 API 호출: personaId=${personaIdNum}`);
      
      const result = await PersonaService.getPersonaById(personaIdNum);
      
      console.log('페르소나 상세 정보 API 응답:', result);
      
      if (result && result.success && result.data) {
        // 페르소나 상세 정보에서 프로필 이미지 URL 가져오기
        const profileImageUrl = result.data.profileImageUrl;
        console.log('API 응답에서 추출한 프로필 이미지 URL:', profileImageUrl);
        
        if (profileImageUrl) {
          setProfileImageUrl(profileImageUrl);
          console.log('페르소나 프로필 이미지 URL 상태 설정 완료:', profileImageUrl);
        } else {
          console.log('API 응답에 프로필 이미지 URL이 없습니다.');
        }
      } else {
        console.log('페르소나 상세 정보 API 호출 실패:', result?.error || '알 수 없는 오류');
      }
    } catch (error) {
      console.error('페르소나 상세 정보 조회 오류:', error);
    }
  };

  useEffect(() => {
  const removeListener = VoiceRecognition.addListener((state) => {
    setIsRecognizing(state.isRecognizing);
  });
  
  return () => {
    removeListener();
    VoiceRecognition.destroy();
  };
  }, []);

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
              // 디버깅: 각 메시지의 프로필 이미지 URL 확인
              console.log(`메시지 ID ${msg.id}의 프로필 이미지 URL:`, msg.profileImageUrl);
              
              const message: Message = {
                id: msg.id.toString(),
                text: msg.content,
                isUser: msg.senderType === 'USER',
                timestamp: msg.timestamp ? new Date(msg.timestamp).getTime() : Date.now(),
                profileImageUrl: msg.profileImageUrl // 백엔드에서 받은 프로필 이미지 URL 설정
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
          timestamp: Date.now(),
          profileImageUrl: profileImageUrl
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
        timestamp: Date.now(),
        profileImageUrl: profileImageUrl
      };
      sendMessage(roomId, errorMessage);
    } finally {
      setIsHistoryLoading(false);
      setHistoryFetched(true);
      console.log('채팅 기록 로딩 완료');
    }
  };

  const handleSend = async (text: string) => {
    if (!roomId) return;
    
    const now = Date.now();
    
    const userMessage: Message = {
      id: now.toString(),
      text,
      isUser: true,
      timestamp: now,
    };
    sendMessage(roomId, userMessage);
    
    if (personaId) {
      // API 연동 버전 (ChatRoomScreen.tsx)
      const loadingId = (now + 1).toString();
      setLoadingMessageId(loadingId);
      setIsLoading(true);
      
      try {
        const personaIdNum = parseInt(personaId);
        
        console.log(`메시지 전송 API 호출: personaId=${personaIdNum}, text=${text}`);
        const result = await ChatService.sendMessage(personaIdNum, text);
        
        console.log('메시지 전송 API 응답:', result);
        
        if (result && result.success && result.data) {
          // 디버깅: API 응답의 프로필 이미지 URL 확인
          console.log('API 응답의 프로필 이미지 URL:', result.data.profileImageUrl);
          
          const aiMessage: Message = {
            id: loadingId,
            text: result.data.content || '응답입니다.',
            isUser: false,
            timestamp: now + 2,
            profileImageUrl: result.data.profileImageUrl || profileImageUrl
          };
          sendMessage(roomId, aiMessage);
        } else {
          const errorMessage: Message = {
            id: loadingId,
            text: '메시지 전송 중 오류가 발생했습니다.',
            isUser: false,
            timestamp: now + 2,
            profileImageUrl: profileImageUrl
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
          profileImageUrl: profileImageUrl
        };
        sendMessage(roomId, errorMessage);
        
        const apiError = error as ApiError;
        console.error('메시지 전송 오류:', apiError.message);
      } finally {
        setIsLoading(false);
        setLoadingMessageId(null);
      }
    } else {
      // 간단한 하드코딩 버전 (pasted_content.txt)
      const aiMessage: Message = {
        id: (now + 1).toString(),
        text: 'AI 응답입니다.',
        isUser: false,
        timestamp: now + 1,
      };
      sendMessage(roomId, aiMessage);
    }
  };

  if (!roomId) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>잘못된 접근입니다. (roomId 없음)</Text>
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
                  keyExtractor={(item, index) => `${item.id}-${index}`}
                  renderItem={({ item }) => {
                    // 디버깅: 각 메시지 렌더링 시 프로필 이미지 URL 로깅
                    console.log(`메시지 ID ${item.id} 렌더링, 프로필 이미지 URL:`, 
                      item.isUser ? undefined : (item.profileImageUrl || profileImageUrl));
                    
                    return (
                      <ChatBubble
                        text={item.text}
                        isUser={item.isUser}
                        timestamp={item.timestamp}
                        discType={discType}
                        personaName={personaName}
                        profileImageUrl={item.isUser ? undefined : (item.profileImageUrl || profileImageUrl)}
                      />
                    );
                  }}
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

              {/* 채팅 입력창 */}
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
  errorText: {
    fontSize: 16,
    color: '#ff6b6b',
    textAlign: 'center',
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
