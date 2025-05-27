import React, { useRef, useEffect, useState } from 'react';
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
import { GenderType, PersonaType, RootStackParamList } from '../types';
import LinearGradient from 'react-native-linear-gradient';
import { RNCamera } from 'react-native-camera';

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

  type AvatarKey = `${GenderType}${PersonaType}`;

  const { type, gender: routeGender } = route.params;
  const avatarKey = (routeGender + type) as AvatarKey;

  const { chatRooms, sendMessage, createRoomIfNotExists } = useChatStore();
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    if (!roomId) {
      navigation.goBack();
      return;
    }
    createRoomIfNotExists(roomId);
  }, [roomId]);

  const messages = chatRooms[roomId]?.messages || [];

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = (text: string) => {
    if (!roomId) return;

    const now = Date.now();

    const userMessage: Message = {
      id: now.toString(),
      text,
      isUser: true,
      timestamp: now,
    };

    const aiMessage: Message = {
      id: (now + 1).toString(),
      text: 'AI 응답입니다.',
      isUser: false,
      timestamp: now + 1,
    };

    sendMessage(roomId, userMessage);
    sendMessage(roomId, aiMessage);
  };

  const toggleCamera = () => {
    setShowCamera((prev) => !prev);
  };

  if (!roomId) {
    return (
      <View style={styles.errorContainer}>
        <Text>잘못된 접근입니다. (roomId 없음)</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#DEE5F6', '#FAEDFA']} style={styles.gradient}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 20}
          >
            <View style={styles.inner}>
              {showCamera && (
                <View style={styles.cameraContainer}>
                  <RNCamera
                    style={styles.camera}
                    type={RNCamera.Constants.Type.back}
                    captureAudio={false}
                  />
                </View>
              )}

              <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <ChatBubble
                    text={item.text}
                    isUser={item.isUser}
                    timestamp={item.timestamp}
                    discType={avatarKey.charAt(1) as PersonaType}
                    gender={avatarKey.charAt(0) as GenderType}
                  />
                )}
                contentContainerStyle={styles.list}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              />

              {/* 채팅 입력창 */}
              <ChatInput onSend={handleSend} />
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  container: { flex: 1 },
  inner: { flex: 1, justifyContent: 'flex-end' },
  list: { padding: 12, paddingBottom: 8 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cameraContainer: {
    height: '50%',
    width: '100%',
  },
  camera: {
    flex: 1,
  },
});
