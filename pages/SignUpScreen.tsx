import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import LinearGradient from 'react-native-linear-gradient';

import InputRow from '../components/register/InputRow';
import InputRowWithButton from '../components/register/InputRowWithButton';
import { AuthService } from '../api-service';

type SignupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Signup'>;

const SignupScreen = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  
  // 중복 체크 상태 관리
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);
  
  // 로딩 상태 관리
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isNicknameLoading, setIsNicknameLoading] = useState(false);
  
  // 회원가입 버튼 활성화 상태
  const [isSignupEnabled, setIsSignupEnabled] = useState(false);
  
  // 입력값 변경 시 중복 체크 상태 초기화
  useEffect(() => {
    setIsEmailChecked(false);
    setIsEmailAvailable(false);
  }, [id]);
  
  useEffect(() => {
    setIsNicknameChecked(false);
    setIsNicknameAvailable(false);
  }, [nickname]);
  
  // 회원가입 버튼 활성화 조건 확인
  useEffect(() => {
    setIsSignupEnabled(
      id !== '' && 
      password !== '' && 
      confirmPassword !== '' && 
      nickname !== '' && 
      password === confirmPassword && 
      isEmailChecked && 
      isNicknameChecked && 
      isEmailAvailable && 
      isNicknameAvailable
    );
  }, [id, password, confirmPassword, nickname, isEmailChecked, isNicknameChecked, isEmailAvailable, isNicknameAvailable]);

  // 이메일 중복 체크
  const handleEmailCheck = async () => {
    if (!id) {
      Alert.alert('입력 오류', '이메일을 입력해주세요.');
      return;
    }
    
    setIsEmailLoading(true);
    
    try {
      const result = await AuthService.checkEmailDuplicate(id);
      
      if (result.success) {
        setIsEmailChecked(true);
        setIsEmailAvailable(result.available);
        
        if (result.available) {
          Alert.alert('확인', '사용 가능한 이메일입니다.');
        } else {
          Alert.alert('중복 오류', '이미 사용 중인 이메일입니다.');
        }
      } else {
        Alert.alert('오류', '이메일 중복 확인 중 오류가 발생했습니다.');
        setIsEmailChecked(false);
        setIsEmailAvailable(false);
      }
    } catch (error) {
      console.error('이메일 중복 체크 오류:', error);
      Alert.alert('오류 발생', '이메일 중복 확인 중 오류가 발생했습니다.');
      setIsEmailChecked(false);
      setIsEmailAvailable(false);
    } finally {
      setIsEmailLoading(false);
    }
  };
  
  // 닉네임 중복 체크
  const handleNicknameCheck = async () => {
    if (!nickname) {
      Alert.alert('입력 오류', '닉네임을 입력해주세요.');
      return;
    }
    
    setIsNicknameLoading(true);
    
    try {
      const result = await AuthService.checkNicknameDuplicate(nickname);
      
      if (result.success) {
        setIsNicknameChecked(true);
        setIsNicknameAvailable(result.available);
        
        if (result.available) {
          Alert.alert('확인', '사용 가능한 닉네임입니다.');
        } else {
          Alert.alert('중복 오류', '이미 사용 중인 닉네임입니다.');
        }
      } else {
        Alert.alert('오류', '닉네임 중복 확인 중 오류가 발생했습니다.');
        setIsNicknameChecked(false);
        setIsNicknameAvailable(false);
      }
    } catch (error) {
      console.error('닉네임 중복 체크 오류:', error);
      Alert.alert('오류 발생', '닉네임 중복 확인 중 오류가 발생했습니다.');
      setIsNicknameChecked(false);
      setIsNicknameAvailable(false);
    } finally {
      setIsNicknameLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!isSignupEnabled) {
      Alert.alert('입력 오류', '모든 필드를 채우고 중복 확인을 완료해주세요.');
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
          { text: '확인', onPress: () => navigation.navigate('Login', { expired: true }) }
        ]);
      } else {
        // 회원가입 실패
        Alert.alert('회원가입 실패', result.error?.message || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('회원가입 오류:', error);
      Alert.alert('오류 발생', '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  // 입력 필드 스타일 계산 함수
  const getEmailInputStyle = () => {
    if (!isEmailChecked) return {};
    return isEmailAvailable ? styles.validInput : styles.invalidInput;
  };
  
  const getNicknameInputStyle = () => {
    if (!isNicknameChecked) return {};
    return isNicknameAvailable ? styles.validInput : styles.invalidInput;
  };

  return (
    <LinearGradient colors={['#DEE5F6', '#FAEDFA']} style={styles.container}>
      <InputRowWithButton
        label="아이디 :"
        value={id}
        onChangeText={setId}
        placeholder="이메일 입력"
        buttonText={isEmailLoading ? "확인 중..." : "중복확인"}
        onPress={handleEmailCheck}
        inputStyle={getEmailInputStyle()}
        disabled={isEmailLoading}
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
        buttonText={isNicknameLoading ? "확인 중..." : "중복확인"}
        onPress={handleNicknameCheck}
        inputStyle={getNicknameInputStyle()}
        disabled={isNicknameLoading}
      />
      <TouchableOpacity 
        style={[
          styles.roundButtonRegister, 
          !isSignupEnabled && styles.disabledButton
        ]} 
        onPress={handleSignup}
        disabled={!isSignupEnabled}
      >
        <Text style={styles.buttonTextRegister}>회원가입</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
  disabledButton: {
    backgroundColor: '#888',
  },
  buttonTextRegister: {
    color: '#fff',
    fontSize: 16,
  },
  validInput: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  invalidInput: {
    borderColor: '#F44336',
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
});
