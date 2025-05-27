import { create } from 'zustand';

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

interface ChatRoom {
  id: string;
  name?: string;        // ✅ 이름 필드
  score?: number;       // ✅ 점수 필드 (백엔드에서 부여)
  messages: Message[];
}

interface ChatStore {
  chatRooms: Record<string, ChatRoom>;
  sendMessage: (roomId: string, message: Message) => void;
  createRoomIfNotExists: (roomId: string, name?: string) => void;
  updateScore: (roomId: string, score: number) => void; // ✅ 점수 업데이트 함수
}

export const useChatStore = create<ChatStore>((set) => ({
  chatRooms: {},

  sendMessage: (roomId, message) =>
    set((state) => {
      const existingMessages = state.chatRooms[roomId]?.messages || [];
      return {
        chatRooms: {
          ...state.chatRooms,
          [roomId]: {
            ...state.chatRooms[roomId],
            id: roomId,
            messages: [...existingMessages, message],
          },
        },
      };
    }),

  createRoomIfNotExists: (roomId, name) =>
    set((state) => {
      if (state.chatRooms[roomId]) return state;
      return {
        chatRooms: {
          ...state.chatRooms,
          [roomId]: {
            id: roomId,
            name: name || '이름 없음',
            messages: [],
            score: undefined, // ✅ 백엔드에서 점수 받아오기 전까진 undefined
          },
        },
      };
    }),

  updateScore: (roomId, score) =>
    set((state) => {
      const room = state.chatRooms[roomId];
      if (!room) return state;
      return {
        chatRooms: {
          ...state.chatRooms,
          [roomId]: {
            ...room,
            score,
          },
        },
      };
    }),
}));
