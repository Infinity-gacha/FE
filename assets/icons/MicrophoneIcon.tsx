import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { View, StyleSheet, Animated } from 'react-native';

interface MicrophoneIconProps {
  color: string;
  size?: number;
  active?: boolean;
  pulsing?: boolean;
}

const MicrophoneIcon: React.FC<MicrophoneIconProps> = ({ 
  color, 
  size = 24,
  active = false,
  pulsing = false
}) => {
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  
  React.useEffect(() => {
    if (pulsing) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [pulsing]);
  
  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"
            fill={active ? "#ff4040" : color}
          />
          <Path
            d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"
            fill={active ? "#ff4040" : color}
          />
          {active && (
            <Circle cx="12" cy="12" r="10" stroke="#ff4040" strokeWidth="1.5" fill="none" />
          )}
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MicrophoneIcon;
