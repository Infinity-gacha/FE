import Voice, {
  SpeechErrorEvent,
  SpeechResultsEvent,
  SpeechStartEvent,
  SpeechEndEvent,
} from '@react-native-voice/voice';
import { Platform, PermissionsAndroid } from 'react-native';

export interface VoiceRecognitionState {
  isRecognizing: boolean;
  results: string[];
  partialResults: string[];
  error?: string;
}

export class VoiceRecognition {
  private static instance: VoiceRecognition;
  private listeners: ((state: VoiceRecognitionState) => void)[] = [];
  private state: VoiceRecognitionState = {
    isRecognizing: false,
    results: [],
    partialResults: [],
  };

  private constructor() {
    this.setupVoiceListeners();
  }

  public static getInstance(): VoiceRecognition {
    if (!VoiceRecognition.instance) {
      VoiceRecognition.instance = new VoiceRecognition();
    }
    return VoiceRecognition.instance;
  }

  private setupVoiceListeners(): void {
    Voice.onSpeechStart = this.onSpeechStart.bind(this);
    Voice.onSpeechEnd = this.onSpeechEnd.bind(this);
    Voice.onSpeechResults = this.onSpeechResults.bind(this);
    Voice.onSpeechPartialResults = this.onSpeechPartialResults.bind(this);
    Voice.onSpeechError = this.onSpeechError.bind(this);
  }

  private onSpeechStart(e: SpeechStartEvent): void {
    this.updateState({
      ...this.state,
      isRecognizing: true,
    });
  }

  private onSpeechEnd(e: SpeechEndEvent): void {
    this.updateState({
      ...this.state,
      isRecognizing: false,
    });
  }

  private onSpeechResults(e: SpeechResultsEvent): void {
    if (e.value) {
      this.updateState({
        ...this.state,
        results: e.value,
      });
    }
  }

  private onSpeechPartialResults(e: SpeechResultsEvent): void {
    if (e.value) {
      this.updateState({
        ...this.state,
        partialResults: e.value,
      });
    }
  }

  private onSpeechError(e: SpeechErrorEvent): void {
    this.updateState({
      ...this.state,
      error: e.error?.message,
      isRecognizing: false,
    });
  }

  private updateState(newState: VoiceRecognitionState): void {
    this.state = newState;
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }

  public addListener(listener: (state: VoiceRecognitionState) => void): () => void {
    this.listeners.push(listener);
    // 초기 상태 전달
    listener(this.state);
    
    // 리스너 제거 함수 반환
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: '음성인식 권한',
            message: '음성인식을 위해 마이크 접근 권한이 필요합니다',
            buttonPositive: '확인',
            buttonNegative: '취소',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.error(err);
        return false;
      }
    } else {
      return true; // iOS는 Info.plist에서 처리
    }
  }

  public async startRecognizing(): Promise<void> {
  try {
    // Voice 객체가 null인지 확인
    if (!Voice) {
      console.error('Voice 객체가 null입니다.');
      this.updateState({
        ...this.state,
        error: 'Voice 모듈이 초기화되지 않았습니다.',
        isRecognizing: false,
      });
      return;
    }

    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      this.updateState({
        ...this.state,
        error: '마이크 권한이 없습니다',
      });
      return;
    }

    // 이미 인식 중이면 중지
    if (this.state.isRecognizing) {
      await this.stopRecognizing();
    }

    // 상태 초기화
    this.updateState({
      isRecognizing: false,
      results: [],
      partialResults: [],
    });

    // Voice 메서드 호출 전 확인
    if (typeof Voice.start !== 'function') {
      console.error('Voice.start is not a function');
      this.updateState({
        ...this.state,
        error: 'Voice API가 올바르게 로드되지 않았습니다.',
        isRecognizing: false,
      });
      return;
    }

    // 한국어로 음성인식 시작
    await Voice.start('ko-KR');
  } catch (e) {
    console.error('음성인식 시작 오류:', e);
    this.updateState({
      ...this.state,
      error: `음성인식 시작 오류: ${'알 수 없는 오류'}`,
      isRecognizing: false,
    });
  }
}

  public async stopRecognizing(): Promise<void> {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  }

  public async toggleRecognizing(): Promise<void> {
  console.log('토글 버튼 클릭됨');
  console.log('현재 인식 상태:', this.state.isRecognizing);
  
  if (this.state.isRecognizing) {
    console.log('음성인식 중지 시도');
    await this.stopRecognizing();
  } else {
    console.log('음성인식 시작 시도');
    await this.startRecognizing();
  }
}


  public getState(): VoiceRecognitionState {
    return this.state;
  }

  public destroy(): void {
    Voice.destroy().then(Voice.removeAllListeners);
  }
}

export default VoiceRecognition.getInstance();
