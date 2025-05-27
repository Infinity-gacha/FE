// useChatStore.ts - 완성된 코드
import { create } from 'zustand';
import { PersonaService, ChatService } from '../api-service';

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
  profileImageUrl?: string;
}

interface ChatRoom {
  id: string;
  personaId: string;
  discType: string;
  personaName: string;
  messages: Message[];
  // 요약 관련 필드 추가
  summary?: {
    summaryText?: string;
    score?: number;
    corePoints?: string;
    improvements?: string;
    tips?: string;
    timestamp?: number;
  };
}

interface ChatStore {
  chatRooms: Record<string, ChatRoom>;
  sendMessage: (roomId: string, message: Message) => void;
  createRoomIfNotExists: (roomId: string, personaId?: string, discType?: string, personaName?: string) => void;
  clearMessages: (roomId: string) => void;
  updateMessage: (roomId: string, messageId: string, updatedMessage: Message) => void;
  removeMessage: (roomId: string, messageId: string) => void;
  syncPersonasAndChats: () => Promise<void>;
  fetchChatSummaries: () => Promise<void>; 
  generateChatSummary: (personaId: string) => Promise<any>; 
  deletePersona: (personaId: string) => Promise<any>; // 페르소나 삭제 함수 추가
  removeChatRoom: (roomId: string) => void; // 채팅방 삭제 함수 추가
  isLoading: boolean;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chatRooms: {},
  isLoading: false,

  sendMessage: (roomId, message) =>
    set((state) => {
      const existingRoom = state.chatRooms[roomId];
      const existingMessages = existingRoom?.messages || [];
      const personaId = existingRoom?.personaId || '';
      const discType = existingRoom?.discType || 'D';
      // 기존 personaName을 유지하고, 없을 때만 기본값 사용
      const personaName = existingRoom?.personaName;
      
      return {
        chatRooms: {
          ...state.chatRooms,
          [roomId]: {
            id: roomId,
            personaId,
            discType,
            personaName,
            messages: [...existingMessages, message],
            summary: existingRoom?.summary,
          },
        },
      };
    }),

  createRoomIfNotExists: (roomId, personaId = '', discType = 'D', personaName) =>
    set((state) => {
      if (state.chatRooms[roomId]) {
        // 방이 이미 존재하면 personaId, discType만 업데이트하고 personaName은 제공된 경우에만 업데이트
        return {
          chatRooms: {
            ...state.chatRooms,
            [roomId]: {
              ...state.chatRooms[roomId],
              personaId: personaId || state.chatRooms[roomId].personaId,
              discType: discType || state.chatRooms[roomId].discType,
              // personaName이 제공된 경우에만 업데이트, 아니면 기존 값 유지
              personaName: personaName !== undefined ? personaName : state.chatRooms[roomId].personaName,
            },
          },
        };
      }
      
      // 방이 없으면 새로 생성
      return {
        chatRooms: {
          ...state.chatRooms,
          [roomId]: {
            id: roomId,
            personaId,
            discType,
            // personaName이 제공되지 않은 경우에만 기본값 사용
            personaName: personaName !== undefined ? personaName : '페르소나',
            messages: [],
          },
        },
      };
    }),

  clearMessages: (roomId) =>
    set((state) => {
      if (!state.chatRooms[roomId]) return state;
      
      return {
        chatRooms: {
          ...state.chatRooms,
          [roomId]: {
            ...state.chatRooms[roomId],
            messages: [],
          },
        },
      };
    }),

  updateMessage: (roomId, messageId, updatedMessage) =>
    set((state) => {
      if (!state.chatRooms[roomId]) return state;
      
      const updatedMessages = state.chatRooms[roomId].messages.map((msg) =>
        msg.id === messageId ? updatedMessage : msg
      );
      
      return {
        chatRooms: {
          ...state.chatRooms,
          [roomId]: {
            ...state.chatRooms[roomId],
            messages: updatedMessages,
          },
        },
      };
    }),

  removeMessage: (roomId, messageId) =>
    set((state) => {
      if (!state.chatRooms[roomId]) return state;
      
      const filteredMessages = state.chatRooms[roomId].messages.filter(
        (msg) => msg.id !== messageId
      );
      
      return {
        chatRooms: {
          ...state.chatRooms,
          [roomId]: {
            ...state.chatRooms[roomId],
            messages: filteredMessages,
          },
        },
      };
    }),

  // 로그인 후 사용자의 페르소나 및 채팅 내역을 동기화하는 함수
  syncPersonasAndChats: async () => {
    set({ isLoading: true });
    
    try {
      // 기존 채팅방 정보 가져오기
      const currentChatRooms = get().chatRooms;
      
      // 1. 사용자의 모든 페르소나 목록 조회
      const personasResult = await PersonaService.getPersonas();
      
      if (!personasResult.success || !personasResult.data) {
        console.error('페르소나 목록 조회 실패:', personasResult.error);
        set({ isLoading: false });
        return;
      }
      
      const personas = personasResult.data;
      const newChatRooms: Record<string, ChatRoom> = {};
      
      // 2. 각 페르소나에 대한 채팅방 생성 및 채팅 기록 조회
      for (const persona of personas) {
        const personaId = persona.id.toString();
        const roomId = `persona-${personaId}`;
        const discType = persona.discType || 'D';
        
        // 기존 채팅방에서 personaName을 가져오거나, 없으면 API에서 받은 이름 사용
        const existingRoom = currentChatRooms[roomId];
        const personaName = existingRoom?.personaName || persona.name || '페르소나';
        
        // 채팅방 기본 구조 생성
        newChatRooms[roomId] = {
          id: roomId,
          personaId,
          discType,
          personaName, // 기존 이름 또는 API에서 받은 이름 사용
          messages: [],
          summary: existingRoom?.summary, // 기존 요약 정보 유지
        };
        
        // 채팅 기록 조회
        try {
          const chatHistoryResult = await ChatService.getChatHistory(parseInt(personaId));
          
          if (chatHistoryResult.success && chatHistoryResult.data) {
            const messages: Message[] = chatHistoryResult.data.map((msg: any) => ({
              id: msg.id.toString(),
              text: msg.content,
              isUser: msg.senderType === 'USER',
              timestamp: msg.timestamp ? new Date(msg.timestamp).getTime() : Date.now(),
              profileImageUrl: msg.profileImageUrl,
            }));
            
            newChatRooms[roomId].messages = messages;
          }
        } catch (error) {
          console.error(`페르소나 ${personaId}의 채팅 기록 조회 실패:`, error);
          // 오류가 발생해도 다른 페르소나의 채팅 기록은 계속 조회
        }
      }
      
      // 3. 모든 채팅방 정보를 store에 저장
      set({ chatRooms: newChatRooms, isLoading: false });
      console.log('페르소나 및 채팅 내역 동기화 완료');
      
    } catch (error) {
      console.error('페르소나 및 채팅 내역 동기화 실패:', error);
      set({ isLoading: false });
    }
  },
  
  // 모든 채팅방의 요약 데이터 조회
  fetchChatSummaries: async () => {
    set({ isLoading: true });
    
    try {
      const chatRooms = get().chatRooms;
      const updatedChatRooms = { ...chatRooms };
      
      // 각 채팅방에 대해 최신 요약 데이터 조회
      for (const roomId in chatRooms) {
        const room = chatRooms[roomId];
        const personaId = parseInt(room.personaId);
        
        if (!isNaN(personaId)) {
          console.log(`페르소나 ${personaId}의 요약 데이터 조회 중...`);
          const summaryResult = await ChatService.getLatestSummary(personaId);
          
          if (summaryResult.success && summaryResult.data) {
            console.log(`페르소나 ${personaId}의 요약 데이터:`, summaryResult.data);
            updatedChatRooms[roomId] = {
              ...room,
              summary: {
                summaryText: summaryResult.data.summaryText,
                score: summaryResult.data.score,
                corePoints: summaryResult.data.corePoints,
                improvements: summaryResult.data.improvements,
                tips: summaryResult.data.tips,
                timestamp: summaryResult.data.timestamp ? new Date(summaryResult.data.timestamp).getTime() : Date.now(),
              },
            };
          } else {
            console.log(`페르소나 ${personaId}의 요약 데이터가 없습니다.`);
          }
        }
      }
      
      set({ chatRooms: updatedChatRooms, isLoading: false });
      console.log('채팅 요약 데이터 동기화 완료');
      
    } catch (error) {
      console.error('채팅 요약 데이터 동기화 실패:', error);
      set({ isLoading: false });
    }
  },
    // 채팅방 삭제 함수 추가
  removeChatRoom: (roomId: string) =>
    set((state) => {
      const newChatRooms = { ...state.chatRooms };
      delete newChatRooms[roomId];
      
      return {
        chatRooms: newChatRooms,
      };
    }),

  // 페르소나 삭제 함수 추가
  deletePersona: async (personaId: string) => {
    set({ isLoading: true });
    
    try {
      const personaIdNum = parseInt(personaId);
      
      if (isNaN(personaIdNum)) {
        throw new Error('유효하지 않은 페르소나 ID');
      }
      
      console.log(`페르소나 ${personaIdNum} 삭제 중...`);
      
      // 페르소나 삭제 API 호출
      const result = await PersonaService.deletePersona(personaIdNum);
      
      if (result.success) {
        console.log(`페르소나 ${personaIdNum} 삭제 성공`);
        
        // 삭제된 페르소나의 채팅방 ID
        const roomId = `persona-${personaId}`;
        
        // 채팅방 삭제
        const chatRooms = get().chatRooms;
        if (chatRooms[roomId]) {
          const newChatRooms = { ...chatRooms };
          delete newChatRooms[roomId];
          set({ chatRooms: newChatRooms });
        }
      } else {
        console.error(`페르소나 ${personaIdNum} 삭제 실패:`, result?.error || '알 수 없는 오류');
      }
      
      set({ isLoading: false });
      return result;
      
    } catch (error) {
      console.error('페르소나 삭제 실패:', error);
      set({ isLoading: false });
      throw error;
    }
  },
  // 특정 페르소나와의 채팅 요약 생성
  generateChatSummary: async (personaId: string) => {
    set({ isLoading: true });
    
    try {
      const personaIdNum = parseInt(personaId);
      
      if (isNaN(personaIdNum)) {
        throw new Error('유효하지 않은 페르소나 ID');
      }
      
      console.log(`페르소나 ${personaIdNum}의 채팅 요약 생성 중...`);
      
      // 채팅 요약 생성 API 호출
      const result = await ChatService.generateSummary(personaIdNum);
      
      if (result.success && result.data) {
        console.log(`페르소나 ${personaIdNum}의 채팅 요약 생성 성공:`, result.data);
        
        // 생성된 요약 데이터로 채팅방 정보 업데이트
        const roomId = `persona-${personaId}`;
        const chatRooms = get().chatRooms;
        
        if (chatRooms[roomId]) {
          const updatedChatRooms = {
            ...chatRooms,
            [roomId]: {
              ...chatRooms[roomId],
              summary: {
                summaryText: result.data.summaryText,
                score: result.data.score,
                corePoints: result.data.corePoints,
                improvements: result.data.improvements,
                tips: result.data.tips,
                timestamp: result.data.timestamp ? new Date(result.data.timestamp).getTime() : Date.now(),
              },
            },
          };
          
          set({ chatRooms: updatedChatRooms });
        }
      } else {
        console.error(`페르소나 ${personaIdNum}의 채팅 요약 생성 실패:`, result?.error || '알 수 없는 오류');
      }
      
      set({ isLoading: false });
      return result;
      
    } catch (error) {
      console.error('채팅 요약 생성 실패:', error);
      set({ isLoading: false });
      throw error;
    }
  },
}));
