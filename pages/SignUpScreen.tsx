import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import LinearGradient from 'react-native-linear-gradient';

import InputRow from '../components/register/InputRow';
import InputRowWithButton from '../components/register/InputRowWithButton';
import { AuthService } from '../api-service';
import { Image } from 'react-native';

type SignupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Signup'>;

const SignupScreen = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');

  const handleSignup = async () => {
    if (!id || !password || !confirmPassword || !nickname) {
      Alert.alert('입력 오류', '모든 필드를 채워주세요.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('비밀번호 오류', '비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }
  
    try {
      const userData = {
        name: nickname,
        email: id,
        password: password,
        gender: 0, // 성별 선택 UI가 없으므로 기본값 설정
        role: 'USER' // 기본 역할 설정
      };
    
      const result = await AuthService.register(userData);
    
      if (result.success) {
        // 회원가입 성공
        Alert.alert('회원가입 성공', '회원가입이 완료되었습니다. 로그인해주세요.', [
          { text: '확인', onPress: () => navigation.navigate('Login', { expired: true })
 }
        ]);
      } else {
        // 회원가입 실패
        Alert.alert('회원가입 실패', result.error?.message || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('회원가입 오류:', error);
      Alert.alert('오류 발생', '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
    
    }
  };

  return (
    <LinearGradient colors={['#DEE5F6', '#FAEDFA']} style={styles.container}>
      <Image
    source={require('../assets/logo.png')} // 경로에 맞게 수정
    style={styles.logo}
    resizeMode="contain"
  />
      <InputRowWithButton
        label="아이디 :"
        value={id}
        onChangeText={setId}
        placeholder="아이디 입력"
        buttonText="중복확인"
        onPress={() => Alert.alert('아이디 중복 체크')}
      />
      <InputRow
        label="비밀번호 :"
        value={password}
        onChangeText={setPassword}
        placeholder="비밀번호 입력"
        secureTextEntry
      />
      <InputRow
        label="비밀번호 확인 :"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="비밀번호 확인"
        secureTextEntry
      />
      <InputRowWithButton
        label="닉네임 :"
        value={nickname}
        onChangeText={setNickname}
        placeholder="닉네임 입력"
        buttonText="중복확인"
        onPress={() => Alert.alert('닉네임 중복 체크')}
      />
      <TouchableOpacity style={styles.roundButtonRegister} onPress={handleSignup}>
        <Text style={styles.buttonTextRegister}>회원가입</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  roundButtonRegister: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 100,
    borderRadius: 30,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonTextRegister: {
    color: '#fff',
    fontSize: 16,
  },
  logo: {
    width: 210,
    height: 210,
    marginBottom: 0,
    marginTop : 50,
    resizeMode: 'contain',
    alignItems: 'center',
  },
});
