// ChatSummaryListScreen.tsx - 무한 새로고침 문제 해결 버전
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useChatStore } from '../store/useChatStore';
import { PersonaService } from '../api-service';
import LinearGradient from 'react-native-linear-gradient';
import ScreenWrapper from '../layouts/ScreenWrapper';

type NavigationProp = StackNavigationProp<RootStackParamList, 'ChatSummaryList'>;

export default function ChatSummaryListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { chatRooms, isLoading: storeLoading } = useChatStore();
  const [isPersonaLoading, setIsPersonaLoading] = useState(false);
  const [displayRooms, setDisplayRooms] = useState<Record<string, any>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // 화면 진입 시 데이터 초기화 (한 번만 실행)
  useEffect(() => {
    // 이미 초기화되었으면 실행하지 않음
    if (isInitialized) return;
    
    console.log('초기화 시작: 첫 번째 useEffect');
    
    // 초기 상태 설정 (한 번만 실행)
    setDisplayRooms(chatRooms);
    
    // 데이터 초기화 함수 호출
    initData();
    
    // 초기화 완료 표시
    setIsInitialized(true);
  }, [isInitialized, chatRooms]);

  // 데이터 초기화 함수 - API 호출 순서 제어
  const initData = async () => {
    try {
      setIsPersonaLoading(true);
      console.log('데이터 초기화 시작');
      
      // 1. 페르소나 이름 조회
      const updatedRoomsWithNames = await fetchPersonaNames(chatRooms);
      console.log('페르소나 이름 조회 완료');
      
      // 2. 요약 데이터 조회
      const finalRooms = await fetchChatSummaries(updatedRoomsWithNames);
      console.log('요약 데이터 조회 완료');
      
      // 3. 최종 상태 한 번에 업데이트
      setDisplayRooms(finalRooms);
      setIsPersonaLoading(false);
      console.log('데이터 초기화 완료');
    } catch (error) {
      console.error('데이터 초기화 실패:', error);
      setIsPersonaLoading(false);
    }
  };

  // 페르소나 이름 조회 함수 - 상태 업데이트 없이 결과 반환
  const fetchPersonaNames = async (inputRooms: Record<string, any>) => {
    try {
      const updatedRoomsData = { ...inputRooms };
      let hasUpdates = false;
      
      for (const roomId in updatedRoomsData) {
        const room = updatedRoomsData[roomId];
        
        // 이미 personaName이 있고 '페르소나'가 아니면 건너뛰기
        if (room.personaName && room.personaName !== '페르소나') {
          console.log(`룸 ${roomId}의 페르소나 이름이 이미 설정됨:`, room.personaName);
          continue;
        }
        
        const personaId = parseInt(room.personaId);
        
        if (!isNaN(personaId)) {
          console.log(`페르소나 ${personaId} 정보 조회 중...`);
          
          try {
            const result = await PersonaService.getPersonaById(personaId);
            
            if (result.success && result.data && result.data.name) {
              console.log(`페르소나 ${personaId} 이름:`, result.data.name);
              
              updatedRoomsData[roomId] = {
                ...room,
                personaName: result.data.name
              };
              
              hasUpdates = true;
            }
          } catch (error) {
            console.error(`페르소나 ${personaId} 정보 조회 실패:`, error);
          }
        }
      }
      
      if (hasUpdates) {
        console.log('페르소나 이름 업데이트됨');
      }
      
      // 상태 업데이트 없이 업데이트된 객체 반환
      return updatedRoomsData;
    } catch (error) {
      console.error('페르소나 이름 조회 실패:', error);
      return inputRooms; // 오류 시 원본 반환
    }
  };

  // 요약 데이터 조회 함수 - 상태 업데이트 없이 결과 반환
  const fetchChatSummaries = async (inputRooms: Record<string, any>) => {
    const { fetchChatSummaries } = useChatStore.getState();
    
    try {
      // 요약 데이터 조회 함수 호출
      await fetchChatSummaries();
      
      // 요약 데이터가 업데이트된 후 chatRooms 가져오기
      const updatedChatRooms = useChatStore.getState().chatRooms;
      
      // 기존 personaName 유지하면서 요약 데이터 업데이트
      const mergedRooms = { ...updatedChatRooms };
      
      for (const roomId in mergedRooms) {
        // inputRooms에 저장된 personaName이 있으면 유지
        if (inputRooms[roomId] && inputRooms[roomId].personaName) {
          mergedRooms[roomId] = {
            ...mergedRooms[roomId],
            personaName: inputRooms[roomId].personaName
          };
        }
      }
      
      console.log('요약 데이터와 페르소나 이름 병합 완료');
      
      // 상태 업데이트 없이 병합된 객체 반환
      return mergedRooms;
    } catch (error) {
      console.error('요약 데이터 조회 실패:', error);
      return inputRooms; // 오류 시 원본 반환
    }
  };

  // 요약 생성 함수
  const handleGenerateSummary = async (personaId: string) => {
    if (!personaId) {
      Alert.alert('오류', '페르소나 ID가 유효하지 않습니다.');
      return;
    }
    
    try {
      setIsPersonaLoading(true);
      
      const { generateChatSummary } = useChatStore.getState();
      await generateChatSummary(personaId);
      
      // 요약 데이터 다시 조회하여 업데이트된 객체 가져오기
      const updatedRooms = await fetchChatSummaries(displayRooms);
      
      // 상태 한 번에 업데이트
      setDisplayRooms(updatedRooms);
      setIsPersonaLoading(false);
      
      Alert.alert('성공', '채팅 요약이 생성되었습니다.');
    } catch (error) {
      console.error('요약 생성 실패:', error);
      setIsPersonaLoading(false);
      Alert.alert('오류', '채팅 요약 생성 중 오류가 발생했습니다.');
    }
  };

  const renderItem = ({ item }: { item: [string, any] }) => {
    const [roomId, room] = item;
    // 페르소나 이름 사용 (기본값 대신)
    const personaName = room.personaName || '페르소나';
    // 요약 데이터에서 점수 가져오기
    const score = room.summary?.score || 0;
    const hasSummary = !!room.summary;

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('ChatSummary', { roomId })}
      >
        <View style={styles.row}>
          <Text style={styles.roomTitle}>{personaName}와의 채팅 요약</Text>
          {hasSummary ? (
            <Text style={styles.score}>{score}/10</Text>
          ) : (
            <TouchableOpacity
              style={styles.generateButton}
              onPress={() => handleGenerateSummary(room.personaId)}
            >
              <Text style={styles.generateButtonText}>요약 생성</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // 로딩 상태 통합
  const isLoading = isPersonaLoading || storeLoading;

  return (
    <ScreenWrapper>
      <LinearGradient colors={['#DEE5F6', '#FAEDFA']} style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <Text style={styles.header}>채팅 요약</Text>
            <Text style={styles.headerRight}>대화 총점</Text>
          </View>
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#000" />
              <Text style={styles.loadingText}>
                {isPersonaLoading ? '페르소나 정보를 불러오는 중...' : '요약 데이터를 불러오는 중...'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={Object.entries(displayRooms)}
              renderItem={renderItem}
              keyExtractor={([roomId]) => roomId}
              contentContainerStyle={styles.list}
              ListEmptyComponent={
                <Text style={styles.empty}>저장된 요약이 없습니다.</Text>
              }
            />
          )}
        </View>
      </LinearGradient>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerRight: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  item: {
    padding: 16,
    backgroundColor: '#d6e4ff',
    borderRadius: 12,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  score: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  list: {
    paddingBottom: 20,
  },
  empty: {
    fontSize: 16,
    textAlign: 'center',
    color: '#999',
    marginTop: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  generateButton: {
    backgroundColor: '#6c7ee4',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
