import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFont } from '../../context/FontContext';

// DISC 유형별 아이콘 매핑
const DISC_ICONS = {
  'D': 'alpha-d-circle',
  'I': 'alpha-i-circle',
  'S': 'alpha-s-circle',
  'C': 'alpha-c-circle',
};

// DISC 유형별 설명
const DISC_DESCRIPTIONS = {
  'D': '주도형',
  'I': '사교형',
  'S': '안정형',
  'C': '신중형',
};
type DISCType = 'D' | 'I' | 'S' | 'C';

type Props = {
  type: DISCType;
  color: string;
  onPress: (type: DISCType) => void;
};

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const PersonaTypeButton = ({ type, color, onPress }: Props) => {
  const { fontStyle, fontsLoaded } = useFont();
  const scale = useSharedValue(1);
  
  // 애니메이션 스타일
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  
  // 터치 이벤트 핸들러
  const handlePressIn = () => {
    scale.value = withSpring(0.75);
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1);
  };
  
  // 폰트 스타일 적용
  const textStyle = fontsLoaded ? [
    styles.buttonText,
    { fontFamily: fontStyle.bold }
  ] : styles.buttonText;
  
  const descriptionStyle = fontsLoaded ? [
    styles.description,
    { fontFamily: fontStyle.regular }
  ] : styles.description;
  
  return (
    <AnimatedTouchable
      style={[styles.button, { backgroundColor: color }, animatedStyle]}
      onPress={() => onPress(type)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.7}
    >
      <View style={styles.contentContainer}>
        <Icon name={DISC_ICONS[type]} size={32} color="#333" style={styles.icon} />
        <Text style={textStyle}>{type} 형</Text>
        <Text style={descriptionStyle}>{DISC_DESCRIPTIONS[type]}</Text>
      </View>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentContainer: {
    alignItems: 'center',
  },
  icon: {
    marginBottom: 8,
  },
  buttonText: {
    color: '#333',
    fontSize: 22,
    marginBottom: 4,
  },
  description: {
    color: '#555',
    fontSize: 14,
  },
});

export default PersonaTypeButton;
