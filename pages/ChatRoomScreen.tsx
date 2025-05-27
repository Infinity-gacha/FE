import React, { useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
  Text,
} from 'react-native';
import ChatBubble from '../components/Chat/MessageBubble';
import ChatInput from '../components/Chat/ChatInput';
import { useChatStore } from '../store/useChatStore';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import ScreenWrapper from '../layouts/ScreenWrapper';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
}

type ChatRoomScreenRouteProp = RouteProp<RootStackParamList, 'ChatRoom'>;

export default function ChatRoomScreen() {
  const flatListRef = useRef<FlatList>(null);
  const route = useRoute<ChatRoomScreenRouteProp>();
  const navigation = useNavigation();

  const roomId = route?.params?.roomId;
  const { chatRooms, sendMessage, createRoomIfNotExists } = useChatStore();

  useEffect(() => {
    if (!roomId) {
      navigation.goBack();
      return;
    }
    createRoomIfNotExists(roomId);
  }, [roomId]);

  const chatRoom = chatRooms[roomId];
  const messages = chatRoom?.messages || [];
  const aiName = chatRoom?.name || 'AI';

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = (text: string) => {
    if (!roomId) return;

    const timestamp = Date.now();

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp,
    };

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: `${aiName}의 응답입니다.`,
      isUser: false,
      timestamp: timestamp + 1,
    };

    sendMessage(roomId, userMessage);
    sendMessage(roomId, aiMessage);
  };

  if (!roomId) {
    return (
      <View style={styles.errorContainer}>
        <Text>잘못된 접근입니다. (roomId 없음)</Text>
      </View>
    );
  }

  return (
    <ScreenWrapper>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 20}
          >
            <View style={styles.inner}>
              <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <ChatBubble text={item.text} isUser={item.isUser} personaName={aiName} timestamp={item.timestamp ?? Date.now()} />
                )}
                contentContainerStyle={styles.list}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              />
              <ChatInput onSend={handleSend} />
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  list: {
    padding: 12,
    paddingBottom: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
