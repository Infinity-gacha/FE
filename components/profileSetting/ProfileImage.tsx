import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';

interface ProfileImageProps {
  imageUri: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ imageUri }) => {
  return (
    <View style={styles.imageWrapper}>
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.image, styles.emptyImage]}>
          <Text>이미지 없음</Text>
        </View>
      )}
    </View>
  );
};

export default ProfileImage;

const styles = StyleSheet.create({
  imageWrapper: {
    width: 300,
    height: 300 ,
    borderRadius: 100,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#ccc',
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  emptyImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});