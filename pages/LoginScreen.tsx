import React, { useState } from 'react';
import { View, Alert, StyleSheet, Image, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';

import InputField from '../components/login/InputField';
import RoundButton from '../components/login/RoundButton';
import { AuthService } from '../api-service';
import { useChatStore } from '../store/useChatStore';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const syncPersonasAndChats = useChatStore(state => state.syncPersonasAndChats);

  const handleLogin = async () => {
    if (!id || !password) {
      Alert.alert('입력 오류', '아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await AuthService.login(id, password);
    
      if (result.success) {
        // 로그인 성공
        console.log('로그인 성공:', result.data);
        
        // 페르소나 및 채팅 내역 동기화
        await syncPersonasAndChats();
        
        navigation.navigate('NewPersona');
      } else {
        // 로그인 실패
        Alert.alert('로그인 실패', '아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      Alert.alert('오류 발생', '로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#DEE5F6', '#FAEDFA']} style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <InputField label="ID :" value={id} onChangeText={setId} placeholder="아이디 입력" />
      <InputField label="PWD :" value={password} onChangeText={setPassword} placeholder="비밀번호 입력" secureTextEntry />

      <View style={styles.buttonRow}>
        <RoundButton title={isLoading ? "로그인 중..." : "로그인"} onPress={handleLogin} disabled={isLoading} />
        <RoundButton title="회원가입" onPress={() => navigation.navigate('Signup')} disabled={isLoading} />
      </View>
      
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      )}
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
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
    resizeMode: 'contain',
    alignItems: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
});
