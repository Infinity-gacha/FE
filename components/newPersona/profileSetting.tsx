import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from '../../assets/icons/userProfile'; 

interface Props {
  onPress: () => void;
}

const ProfileSetting: React.FC<Props> = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ marginRight: 15 }}>
      <Icon size={24} color="#333" />
    </TouchableOpacity>
  );
};

export default ProfileSetting;