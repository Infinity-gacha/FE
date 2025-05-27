import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { useChatStore } from '../store/useChatStore';
import BottomNavBar from '../layouts/BottomNavBar';
import LinearGradient from 'react-native-linear-gradient';

type ChatSummaryRouteProp = RouteProp<RootStackParamList, 'ChatSummary'>;

export default function ChatSummaryScreen() {
  const route = useRoute<ChatSummaryRouteProp>();
  const roomId = route?.params?.roomId;

  const chatRoom = useChatStore((state) =>
    roomId ? state.chatRooms[roomId] : undefined
  );

  return (
    <LinearGradient colors={['#DEE5F6', '#FAEDFA']} style={{ flex: 1 }}>
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <Text style={styles.title}>이번 대화의 핵심</Text>
          <View style={styles.box}><Text style={styles.boxText}></Text></View>

          <Text style={styles.title}>개선점</Text>
          <View style={styles.box}><Text style={styles.boxText}></Text></View>

          <Text style={styles.title}>대화 Tip</Text>
          <View style={styles.box}><Text style={styles.boxText}></Text></View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 12,
  },
  box: {
    backgroundColor: '#e5e5e5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  boxText: {
    fontSize: 16,
    color: '#222',
  },
});
