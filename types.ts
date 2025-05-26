

export type PersonaType = 'D' | 'I' | 'S' | 'C';

export type RootStackParamList = {
  Intro: undefined;
  Login: { expired?: boolean }; // 토큰 만료 시 파라미터 추가
  Signup: undefined;
  NewPersona: undefined;
  ChatList: undefined;
  ChatSummaryList: undefined;
  ChatSummary: { roomId: string; personaId: number }; 
  ChatRoom: { roomId: string; personaId: string; type?: PersonaType; personaName?: string };
  PersonaDetail: { type: PersonaType };
};
