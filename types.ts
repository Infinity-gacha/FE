// types.ts

export type PersonaType = 'D' | 'I' | 'S' | 'C';

export type RootStackParamList = {
  Intro: undefined;
  Login: undefined;
  Signup: undefined;
  NewPersona: undefined;
  ChatList: undefined;
  ChatSummaryList: undefined;
  ChatSummary: { roomId: string };
  ChatRoom: { roomId: string };
  PersonaDetail: { type: PersonaType };
};