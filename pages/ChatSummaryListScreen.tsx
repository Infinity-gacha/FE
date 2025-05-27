import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useChatStore } from '../store/useChatStore';
import LinearGradient from 'react-native-linear-gradient';
import ScreenWrapper from '../layouts/ScreenWrapper';

type NavigationProp = StackNavigationProp<RootStackParamList, 'ChatSummaryList'>;

export default function ChatSummaryListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const chatRooms = useChatStore((state) => state.chatRooms);

  const renderItem = ({ item }: { item: [string, any] }) => {
    const [roomId, room] = item;
    const displayName = room.name || '000';

    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('ChatSummary', { roomId })}
      >
        <View style={styles.row}>
          <Text style={styles.roomTitle}>{displayName}와의 채팅 요약</Text>
          {room.score !== undefined && (
            <Text style={styles.score}>{room.score}/100</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper>
      <LinearGradient colors={['#DEE5F6', '#FAEDFA']} style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <Text style={styles.header}>채팅 요약</Text>
            <Text style={styles.headerRight}>대화 총점</Text>
          </View>
          <FlatList
            data={Object.entries(chatRooms)}
            renderItem={renderItem}
            keyExtractor={([roomId]) => roomId}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <Text style={styles.empty}>저장된 요약이 없습니다.</Text>
            }
          />
        </View>
      </LinearGradient>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerRight: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  item: {
    padding: 16,
    backgroundColor: '#d6e4ff',
    borderRadius: 12,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  score: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  list: {
    paddingBottom: 20,
  },
  empty: {
    fontSize: 16,
    textAlign: 'center',
    color: '#999',
    marginTop: 32,
  },
});
