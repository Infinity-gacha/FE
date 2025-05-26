// 수정된 PersonaDetail.tsx

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Alert, ActivityIndicator } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, PersonaType } from '../types';
import LinearGradient from 'react-native-linear-gradient';
import { useIsFocused } from '@react-navigation/native';

import InputField from '../components/newDetail/InputFieldDetail';
import GenderSelector from '../components/newDetail/GenderSelector';
import SubmitButton from '../components/newDetail/SubmitButton';
import MenuText from '../components/newDetail/MenuText';
import MenuTextName from '../components/newDetail/MenuTextName.tsx';
import { useChatStore } from '../store/useChatStore';
import { PersonaService, AuthService } from '../api-service';

type Props = {
  route: RouteProp<RootStackParamList, 'PersonaDetail'>;
};

const PersonaDetail = ({ route }: Props) => {
  const { type } = route.params;
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { createRoomIfNotExists } = useChatStore();
  const [isLoading, setIsLoading] = useState(false);

  const colorMap: Record<PersonaType, string> = {
    D: '#FFD2D2',
    I: '#F7F6BC',
    S: '#CEF4D6',
    C: '#CCD2F6',
  };

  const colorMapSelecd = {
    D: '#fc8282',
    I: '#e7e544',
    S: '#73dd88',
    C: '#6c7ee4',
  } as const;

  const backgroundColor = colorMap[type];
  const selectedColor = colorMapSelecd[type];

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  // 현재 로그인한 사용자 정보 가져오기
  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const userResult = await AuthService.getCurrentUser();
        if (!userResult || !userResult.success) {
          console.error('사용자 정보를 가져오는데 실패했습니다.');
          Alert.alert('오류', '사용자 정보를 가져오는데 실패했습니다. 다시 로그인해주세요.');
          // 안전한 네비게이션 호출
          navigation.navigate('Login' as never);
        }
      } catch (error) {
        console.error('사용자 정보 조회 오류:', error);
        Alert.alert('오류', '사용자 정보를 가져오는데 실패했습니다. 다시 로그인해주세요.');
        // 안전한 네비게이션 호출
        navigation.navigate('Login' as never);
      }
    };

    checkUserAuth();
  }, []);

  const handleAgeChange = (input: string) => {
    const numericInput = input.replace(/[^0-9]/g, '');
    setAge(numericInput);
  };

  const isButtonEnabled = name && age && selectedGender && !isLoading;

  const handlePressSubmit = async () => {
    if (!isButtonEnabled) return;
    
    setIsLoading(true);
    
    try {
      // 페르소나 생성 API 호출 
      const personaData = {
        name: name,
        age: parseInt(age),
        gender: selectedGender === 'male' ? 'MALE' : 'FEMALE',
        discType: type
      };
      
      console.log('페르소나 생성 요청:', personaData);
      
      const result = await PersonaService.createPersona(personaData);
      
      if (result && result.success && result.data && result.data.id) {
        const personaId = result.data.id.toString();
        console.log('페르소나 생성 성공:', personaId);
        
        // 채팅방 ID 생성 및 저장 - personaName 추가
        const roomId = `persona-${personaId}`;
        createRoomIfNotExists(roomId, personaId, type, name);
        
        // 채팅방으로 이동 (personaId, type, personaName 함께 전달)
        navigation.navigate('ChatRoom', { 
          roomId, 
          personaId,
          type,
          personaName: name // personaName 파라미터 추가
        });
      } else {
        console.error('페르소나 생성 실패:', result?.error || '알 수 없는 오류');
        Alert.alert('오류', '페르소나 생성에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('페르소나 생성 오류:', error);
      Alert.alert('오류', '페르소나 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateRandomName = (length: number = 3) => {
    const lastName = ['김', '이', '박', '최', '정'];
    const firstName = ['민', '서', '지', '우', '하'];

    const randomFrom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    const last = randomFrom(lastName);
    let first = '';
    while (first.length < length - 1) {
      const char = randomFrom(firstName);
      if (!first.includes(char)) first += char;
    }
    return `${last}${first}`;
  };

  const handleRandomName = () => {
    const randomName = generateRandomName();
    setName(randomName);
  };

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) handleRandomName();
  }, [isFocused]);

  return (
    <LinearGradient colors={['#FFFFFF', backgroundColor]} style={styles.container}>
      <View style={styles.middleContent}>
        <MenuTextName>{'내 이름은 ' + name + ' 입니다.'}</MenuTextName>
        <MenuText>나이</MenuText>
        <InputField value={age} onChangeText={handleAgeChange} placeholder="나이 입력" keyboardType="numeric" />
        <MenuText>성별</MenuText>
        <GenderSelector selectedGender={selectedGender} onSelect={setSelectedGender} activeColor={selectedColor} />
      </View>
      <View style={styles.bottomButton}>
        <SubmitButton onPress={handlePressSubmit} enabled={!!isButtonEnabled} backgroundColor={selectedColor} />
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={selectedColor} />
            <Text style={styles.loadingText}>페르소나 생성 중...</Text>
          </View>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between' },
  middleContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  bottomButton: { alignItems: 'center', paddingBottom: 40, position: 'relative' },
  loadingOverlay: {
    position: 'absolute',
    top: -80,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  }
});

export default PersonaDetail;
