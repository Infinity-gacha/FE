

export type PersonaType = 'D' | 'I' | 'S' | 'C';
export type RootStackParamList = {
  Intro: undefined;
  Login: { expired?: boolean }; // 토큰 만료 시 파라미터 추가
  Signup: undefined;
  NewPersona: undefined;
  ChatList: undefined;
  ChatSummaryList:{ roomId: string };
  ChatSummary: { roomId: string; personaId?: number }; 
  ChatRoom: { 
    roomId: string; 
    personaId: string; 
    type?: PersonaType; 
    personaName?: string;
    profileImageUrl?: string; // 프로필 이미지 URL 파라미터 추가
  };
  PersonaDetail: { type: PersonaType };
  profileSetting: undefined;
};
