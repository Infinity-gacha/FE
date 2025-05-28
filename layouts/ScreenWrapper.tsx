import React from 'react';
import { View, StyleSheet } from 'react-native';
import BottomNavBar from './BottomNavBar';

export default function ScreenWrapper({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.content}>{children}</View>
      <BottomNavBar roomId={''} activeTab={''} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    paddingBottom: 70,
  },
});
