// types.ts

export type PersonaType = 'D' | 'I' | 'S' | 'C';

export type RootStackParamList = {
  Intro: undefined;
  Login: { expired?: boolean };
  Signup: undefined;
  NewPersona: undefined;
  ChatList: undefined;
  ChatSummaryList: { roomId: string };
  ChatSummary: { roomId: string , personaId: number };
  ChatRoom: { roomId: string; name?: string; 
    type?: PersonaType; 
    personaName?: string;
    profileImageUrl?: string;};
  PersonaDetail: { type: PersonaType };
};