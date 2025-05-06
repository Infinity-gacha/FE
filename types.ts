// types.ts

export type PersonaType = 'D' | 'I' | 'S' | 'C';

export type RootStackParamList = {
  Intro: undefined;
  Login: undefined;
  Signup: undefined;
  NewPersona: undefined;
  PersonaDetail: { type: PersonaType };
};