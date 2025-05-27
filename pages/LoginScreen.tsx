import React, { useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';

import InputField from '../components/login/InputField';
import RoundButton from '../components/login/RoundButton';
import SnsButton from '../components/login/SnsButton';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLogin = () => {
    if (!id || !password) {
      Alert.alert('입력 오류', '아이디와 비밀번호를 모두 입력해주세요.');
    } else {
      navigation.navigate('NewPersona');
    }
  };

  return (
    <LinearGradient colors={['#DEE5F6', '#FAEDFA']} style={styles.container}>
      <InputField label="ID :" value={id} onChangeText={setId} placeholder="아이디 입력" />
      <InputField label="PWD :" value={password} onChangeText={setPassword} placeholder="비밀번호 입력" secureTextEntry />

      <View style={styles.buttonRow}>
        <RoundButton title="로그인" onPress={handleLogin} />
        <RoundButton title="회원가입" onPress={() => navigation.navigate('Signup')} />
      </View>

      <View style={styles.snsRow}>
        <SnsButton title="kakao" color="#f6f669" onPress={() => Alert.alert('카카오톡 로그인')} />
        <SnsButton title="naver" color="#7dfc84" onPress={() => Alert.alert('네이버 로그인')} />
        <SnsButton title="google" color="#f6b2b2" onPress={() => Alert.alert('구글 로그인')} />
      </View>
    </LinearGradient>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  snsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
