import React, { useLayoutEffect } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, PersonaType } from '../types';
import ScreenWrapper from '../layouts/ScreenWrapper';
import PersonaTypeButton from '../components/newPersona/PersonaTypeButton';
import TextSection from '../components/newPersona/TextSection';
import LogoutButton from '../components/login/LogoutButton';

const CentralTextButtonsScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'NewPersona'>>();

  const handlePress = (type: string) => {
    navigation.navigate('PersonaDetail', { type: type as PersonaType });
  };

  // 로그아웃 처리 함수
  const handleLogout = () => {
    Alert.alert(
      '로그아웃 확인',
      '로그아웃 하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '확인',
          onPress: () => {
            Alert.alert(
              '알림',
              '로그아웃 되었습니다',
              [
                {
                  text: '확인',
                  onPress: () => {
                    navigation.navigate('Login', { expired: false });
                  },
                },
              ],
              { cancelable: false }
            );
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScreenWrapper>
      <LinearGradient colors={['#DEE5F6', '#FAEDFA']} style={styles.container}>
        <View style={styles.container}>
          <LogoutButton />
          <TextSection
            title="페르소나톡"
            subtitle="DISC 유형을 선택하여,"
            description="다양한 성격을 가진 AI와 대화해보세요."
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
