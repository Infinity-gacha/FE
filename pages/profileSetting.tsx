import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

import ProfileImage from '../components/profileSetting/ProfileImage';
import ProfileButtons from '../components/profileSetting/ProfileButtons';

const ProfileImageSection: React.FC = () => {
  const [imageUri, setImageUri] = useState<string>(
    'https://via.placeholder.com/160'
  );

  const onChangeImage = () => {
    setImageUri('https://via.placeholder.com/160/0000FF/FFFFFF');
  };

  const onDeleteImage = () => {
    setImageUri('');
  };

  return (
    <View style={styles.container}>
      <ProfileImage imageUri={imageUri} />
      <ProfileButtons onChangeImage={onChangeImage} onDeleteImage={onDeleteImage} />
    </View>
  );
};

export default ProfileImageSection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',  // 세로 중앙
    alignItems: 'center',      // 가로 중앙
    paddingVertical: 40,
  },
});