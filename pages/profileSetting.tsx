import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';  // 추가
import { RootStackParamList } from '../types';

import ProfileImage from '../components/profileSetting/ProfileImage';
import ProfileButtons from '../components/profileSetting/ProfileButtons';
import LinearGradient from 'react-native-linear-gradient';

// navigation 타입 지정 (이 컴포넌트가 profileSetting 스크린 내라 가정)
type ProfileImageSectionNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'profileSetting'
>;

const ProfileImageSection: React.FC = () => {
  const [imageUri, setImageUri] = useState<string>(
    'https://via.placeholder.com/160'
  );

  // useNavigation에 타입 명시
  const navigation = useNavigation<ProfileImageSectionNavigationProp>();

  const onChangeImage = () => {
    setImageUri('https://via.placeholder.com/160/0000FF/FFFFFF');
  };

  const onDeleteImage = () => {
    setImageUri('');
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
            // 로그인 화면으로 이동 전에 "로그아웃 되었습니다" 알림창 띄우기
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
      <LinearGradient colors={['#DEE5F6', '#FAEDFA']} style={styles.container}>
      <ProfileImage imageUri={imageUri} />
      <ProfileButtons onChangeImage={onChangeImage} onDeleteImage={onDeleteImage} />

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>로그아웃하기</Text>
      </TouchableOpacity>
      </LinearGradient>
  );
};

export default ProfileImageSection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',  // 세로 중앙
    alignItems: 'center',      // 가로 중앙
   // paddingVertical: 40,
  },
  logoutButton: {
    marginTop: 10, 
  },
  logoutText: {
    fontSize: 12,
    color: '#888',
    textDecorationLine: 'underline',
  },
});
