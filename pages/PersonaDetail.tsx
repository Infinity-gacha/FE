import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
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

type Props = {
  route: RouteProp<RootStackParamList, 'PersonaDetail'>;
};

const PersonaDetail = ({ route }: Props) => {
  const { type } = route.params;
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { createRoomIfNotExists } = useChatStore();

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

  const handleAgeChange = (input: string) => {
    const numericInput = input.replace(/[^0-9]/g, '');
    setAge(numericInput);
  };

  const isButtonEnabled = name && age && selectedGender;

  const handlePressSubmit = () => {
    const roomId = `persona-${type}-${Date.now()}`;
    createRoomIfNotExists(roomId, name, name);
    navigation.navigate('ChatRoom', { roomId });
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
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between' },
  middleContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  bottomButton: { alignItems: 'center', paddingBottom: 40 },
});

export default PersonaDetail;
