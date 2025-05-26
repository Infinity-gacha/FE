import axios from 'axios';

// API 기본 URL 설정
const API_BASE_URL = 'http://10.0.2.2:8080';

// 인증 토큰을 저장할 변수
let authToken: string | null = null;

// API 오류 타입 정의
interface ApiError {
  message: string;
  response?: {
    status: number;
    data?: any;
  };
}

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
   timeout: 10000,
});

// 요청 인터셉터 설정 - 모든 요청에 인증 토큰 추가
apiClient.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers['Authorization'] = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정 - 401 오류 처리
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 토큰 만료 또는 인증 오류 처리
      authToken = null;
      // 로그인 화면으로 리다이렉트 등의 처리
    }
    return Promise.reject(error);
  }
);

// 인증 관련 API
export const AuthService = {
  // 로그인
  login: async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/users/login', { email, password });
      const { accessToken, userId } = response.data.result;
      
      // 토큰 저장
      authToken = accessToken;
      
      return { success: true, data: response.data.result };
    } catch (error) {
      const apiError = error as ApiError;
      console.error('로그인 실패:', apiError.message);
      return { success: false, error: apiError };
    }
  },
  
  // 회원가입
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    gender: number;
    role: string;
  }) => {
    try {
      const response = await apiClient.post('/users/join', userData);
      return { success: true, data: response.data.result };
    } catch (error) {
      const apiError = error as ApiError;
      console.error('회원가입 실패:', apiError.message);
      return { success: false, error: apiError };
    }
  },
  
  // 현재 사용자 정보 조회
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/users/me');
      return { success: true, data: response.data.result };
    } catch (error) {
      const apiError = error as ApiError;
      console.error('사용자 정보 조회 실패:', apiError.message);
      return { success: false, error: apiError };
    }
  },
};

// 페르소나 관련 API
export const PersonaService = {
  // 페르소나 목록 조회
  getPersonas: async () => {
    try {
      const response = await apiClient.get('/api/personas');
      return { success: true, data: response.data };
    } catch (error) {
      const apiError = error as ApiError;
      console.error('페르소나 목록 조회 실패:', apiError.message);
      return { success: false, error: apiError };
    }
  },
  
  // 페르소나 생성
  createPersona: async (personaData: {
    discType: string;
    name: string;
    age?: number;
    gender?: string;
  }) => {
    try {
      const response = await apiClient.post('/api/personas', personaData);
      return { success: true, data: response.data };
    } catch (error) {
      const apiError = error as ApiError;
      console.error('페르소나 생성 실패:', apiError.message);
      return { success: false, error: apiError };
    }
  },
  
  // 페르소나 상세 조회
  getPersonaById: async (personaId: number) => {
    try {
      const response = await apiClient.get(`/api/personas/${personaId}`);
      return { success: true, data: response.data };
    } catch (error) {
      const apiError = error as ApiError;
      console.error('페르소나 상세 조회 실패:', apiError.message);
      return { success: false, error: apiError };
    }
  },
};

// 채팅 관련 API
export const ChatService = {
  // 채팅 메시지 전송
  sendMessage: async (personaId: number, message: string) => {
    try {
      const response = await apiClient.post(`/api/personas/${personaId}/chat`, {
        message: message
      });
      return { success: true, data: response.data };
    } catch (error) {
      const apiError = error as ApiError;
      console.error('메시지 전송 실패:', apiError.message);
      return { success: false, error: apiError };
    }
  },
  
  // 채팅 기록 조회
  getChatHistory: async (personaId: number) => {
    try {
      const response = await apiClient.get(`/api/personas/${personaId}/chat`);
      return { success: true, data: response.data };
    } catch (error) {
      const apiError = error as ApiError;
      console.error('채팅 기록 조회 실패:', apiError.message);
      return { success: false, error: apiError };
    }
  },
  
  // 채팅 요약 생성
  generateSummary: async (personaId: number) => {
    try {
      const response = await apiClient.post(`/api/personas/${personaId}/summary`);
      return { success: true, data: response.data };
    } catch (error) {
      const apiError = error as ApiError;
      console.error('채팅 요약 생성 실패:', apiError.message);
      return { success: false, error: apiError };
    }
  },
  
  // 최신 채팅 요약 조회
  getLatestSummary: async (personaId: number) => {
    try {
      const response = await apiClient.get(`/api/personas/${personaId}/summary`);
      return { success: true, data: response.data };
    } catch (error) {
      // 타입 단언 전에 타입 가드 패턴 사용
      const apiError = error as ApiError;
      
      // response 속성이 있는지 먼저 확인 (타입 가드)
      if (apiError.response && apiError.response.status === 404) {
        // 요약이 없는 경우
        return { success: true, data: null };
      }
      
      console.error('채팅 요약 조회 실패:', apiError.message);
      return { success: false, error: apiError };
    }
  },
};

export default {
  AuthService,
  PersonaService,
  ChatService,
};
