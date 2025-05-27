// types.ts

export type PersonaType = 'D' | 'I' | 'S' | 'C';
export type GenderType = 'W' | 'M';

export type RootStackParamList = {
  Intro: undefined;
  Login: undefined;
  Signup: undefined;
  NewPersona: undefined;
  ChatList: undefined;
  ChatSummaryList: undefined;
  ChatSummary: { roomId: string };
  ChatRoom: { roomId: string; type: PersonaType; gender: GenderType};
  PersonaDetail: { type: PersonaType };
  profileSetting: undefined;
};