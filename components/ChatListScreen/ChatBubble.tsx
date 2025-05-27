import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { PersonaType } from '../../types';

interface ChatBubbleProps {
  text: string;
  isUser: boolean;
  timestamp?: number;
  discType: PersonaType;
  personaName: string;
  profileImageUrl?: string;
}

const ChatBubble = ({
  text,
  isUser,
  timestamp,
  discType,
  personaName,
  profileImageUrl,
}: ChatBubbleProps) => {
  const [imageError, setImageError] = useState(false);

  const formatTime = (timestamp: number) => {
    if (!ts) return '';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '';
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const getBubbleColor = () => {
    if (isUser) return '#e6f7ff';
    switch (discType) {
      case 'D': return '#ffecb3';
      case 'I': return '#e8f5e9';
      case 'S': return '#e3f2fd';
      case 'C': return '#f3e5f5';
      default: return '#f5f5f5';
    }
  };

  const getImageSource = () => {
    if (imageError || !profileImageUrl) {
      return require('../../assets/default-profile.png');
    }
    return { uri: profileImageUrl };
  };

  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.aiContainer,
      ]}
    >
      {!isUser && (
        <View style={styles.profileImageContainer}>
          <Image
            source={getImageSource()}
            style={styles.profileImage}
            onError={() => setImageError(true)}
          />
          <Text style={styles.personaName}>{personaName}</Text>
        </View>
      )}

      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.aiBubble,
          { backgroundColor: getBubbleColor() },
        ]}
      >
        <Text style={styles.text}>{text}</Text>
      </View>

      <Text
        style={[
          styles.time,
          isUser ? styles.userTime : styles.aiTime,
        ]}
      >
        {formatTime(timestamp)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    maxWidth: '80%',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  aiContainer: {
    alignSelf: 'flex-start',
  },
  profileImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  profileImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 6,
  },
  personaName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  bubble: {
    padding: 12,
    borderRadius: 18,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  time: {
    fontSize: 12,
    marginTop: 4,
    color: '#999',
  },
  userTime: {
    alignSelf: 'flex-end',
  },
  aiTime: {
    alignSelf: 'flex-start',
  },
});

export default ChatBubble;
