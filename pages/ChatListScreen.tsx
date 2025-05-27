import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useChatStore } from '../store/useChatStore';
import LinearGradient from 'react-native-linear-gradient';
import ScreenWrapper from '../layouts/ScreenWrapper';
import Toast from 'react-native-toast-message'; // ✅ Toast 메시지

type ChatListNavigationProp = StackNavigationProp<RootStackParamList, 'ChatList'>;

export default function ChatListScreen() {
  const navigation = useNavigation<ChatListNavigationProp>();
  const chatRooms = useChatStore((state) => state.chatRooms);
  const removeChatRoom = useChatStore((state) => state.removeChatRoom);
  const roomIds = Object.keys(chatRooms);

  const [isEditing, setIsEditing] = useState(false);

  const handleDeleteRoom = (roomId: string) => {
    Alert.alert(
      '삭제 확인',
      '채팅을 삭제하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '확인',
          style: 'destructive',
          onPress: () => {
            removeChatRoom(roomId);
            Toast.show({
              type: 'success',
              text1: '채팅이 삭제되었습니다.',
            });
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScreenWrapper>
      <LinearGradient colors={['#DEE5F6', '#FAEDFA']} style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <Text style={styles.header}>채팅 내역</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(!isEditing)}
            >
              <Text style={styles.editButtonText}>{isEditing ? '완료' : '편집'}</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={roomIds}
            keyExtractor={(roomId) => roomId}
            renderItem={({ item: roomId }) => {
              const room = chatRooms[roomId];
              const aiName = 'AI';
              const type = 'D';
              const genderCode = 'W';
              const lastMessage = room?.messages[room.messages.length - 1]?.text || '(대화 없음)';

              return (
                <View style={styles.itemRow}>
                  <TouchableOpacity
                    style={styles.item}
                    onPress={() =>
                      navigation.navigate('ChatRoom', {
                        roomId,
                        type,
                        gender: genderCode,
                      })
                    }
                    disabled={isEditing}
                  >
                    <Text style={styles.aiName}>{aiName}</Text>
                    <Text style={styles.message}>{lastMessage}</Text>
                  </TouchableOpacity>

                  {isEditing && (
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteRoom(roomId)}
                    >
                      <Text style={styles.deleteButtonText}>삭제</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            }}
            ListEmptyComponent={
              <Text style={styles.empty}>대화 내역이 없습니다.</Text>
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
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#6a5acd',
    borderRadius: 6,
  },
  editButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  item: {
    flex: 1,
    padding: 16,
    backgroundColor: '#d6e4ff',
    borderRadius: 12,
  },
  aiName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
  },
  message: {
    fontSize: 16,
  },
  deleteButton: {
    marginLeft: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#ff5c5c',
    borderRadius: 12,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  empty: {
    fontSize: 16,
    textAlign: 'center',
    color: '#999',
    marginTop: 32,
  },
});
