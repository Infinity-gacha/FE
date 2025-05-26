// 수정된 useChatStore.ts

import { create } from 'zustand';
import { PersonaService, ChatService } from '../api-service';

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
}

interface ChatRoom {
  id: string;
  personaId: string;
  discType: string;
  personaName: string; // 페르소나 이름 추가
  messages: Message[];
}

interface ChatStore {
  chatRooms: Record<string, ChatRoom>;
  sendMessage: (roomId: string, message: Message) => void;
  createRoomIfNotExists: (roomId: string, personaId?: string, discType?: string, personaName?: string) => void;
  clearMessages: (roomId: string) => void;
  updateMessage: (roomId: string, messageId: string, updatedMessage: Message) => void;
  removeMessage: (roomId: string, messageId: string) => void;
  syncPersonasAndChats: () => Promise<void>;
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
      const personaName = existingRoom?.personaName || '페르소나';
      
      return {
        chatRooms: {
          ...state.chatRooms,
          [roomId]: {
            id: roomId,
            personaId,
            discType,
            personaName,
            messages: [...existingMessages, message],
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
}));
