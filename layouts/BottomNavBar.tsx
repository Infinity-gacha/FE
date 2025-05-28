import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

import PlusIcon from '../assets/icons/PlusIcon.tsx';
import UserIcon from '../assets/icons/UserIcon.tsx';
import BookmarkIcon from '../assets/icons/BookmarkIcon.tsx';

type BottomNavBarProps = {
  roomId: string;
  activeTab: string;
};

const BottomNavBar: React.FC<BottomNavBarProps> = ({ roomId }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('NewPersona')}>
        <PlusIcon size={28} color="#ffffff" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('ChatList')}>
        <UserIcon size={28} color="#ffffff" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('ChatSummaryList', { roomId })}>
        <BookmarkIcon size={28} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 100,
  },
});

export default BottomNavBar;
