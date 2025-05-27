import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

const UserProfileIcon = ({ color = '#000000', size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* 머리 */}
    <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth={2} />
    {/* 몸통 */}
    <Path
      d="M4 20c0-4 4-6 8-6s8 2 8 6"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default UserProfileIcon;