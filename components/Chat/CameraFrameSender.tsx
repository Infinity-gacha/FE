import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Camera, CameraType } from 'expo-camera';  // CameraType 직접 import

import * as ImageManipulator from 'expo-image-manipulator';

export default function CameraFrameSender({ onResult }: { onResult: (res: any) => void }) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const cameraRef = useRef<any>(null);  // 타입 문제 간단 해결용 any

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const captureAndSend = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ skipProcessing: true });
      // 이후 코드 동일...
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      captureAndSend();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (hasPermission === null) return null;
  if (hasPermission === false) return <View><Text>카메라 권한이 없습니다</Text></View>;

  return (
    <View style={styles.cameraWrapper}>
      <Camera
        style={styles.camera}
        type="front"   // 문자열로 직접 넣기
        ref={cameraRef}
/>
    </View>
  );
}

const styles = StyleSheet.create({
  cameraWrapper: {
    height: '50%',
    width: '100%',
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
});
