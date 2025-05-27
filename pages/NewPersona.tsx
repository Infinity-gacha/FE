import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, PersonaType } from '../types';
import ScreenWrapper from '../layouts/ScreenWrapper';

import PersonaTypeButton from '../components/newPersona/PersonaTypeButton';
import TextSection from '../components/newPersona/TextSection';  // 추가된 부분

const CentralTextButtonsScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'NewPersona'>>();

  const handlePress = (type: string) => {
    navigation.navigate('PersonaDetail', { type: type as PersonaType });
  };

  return (
    <ScreenWrapper>
    <LinearGradient colors={['#DEE5F6', '#FAEDFA']} style={styles.container}>
      <View style={styles.container}>
        {/* 텍스트 섹션 컴포넌트 사용 */}
        <TextSection 
          title="페르소나톡"
          subtitle="당신만의 성격을 선택하고,"
          description="맞춤형 AI와 대화 시작하기."
        />

        <View style={styles.buttonContainer}>
          <PersonaTypeButton type="D" color="#FFD2D2" onPress={handlePress} />
          <PersonaTypeButton type="I" color="#F7F6BC" onPress={handlePress} />
          <PersonaTypeButton type="S" color="#CEF4D6" onPress={handlePress} />
          <PersonaTypeButton type="C" color="#CCD2F6" onPress={handlePress} />
        </View>
      </View>
    </LinearGradient>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 15,
  },
});

export default CentralTextButtonsScreen;
