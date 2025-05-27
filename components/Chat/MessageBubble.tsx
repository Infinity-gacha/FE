import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { GenderType, PersonaType } from '../../types';

interface Props {
  text: string;
  isUser: boolean;
  timestamp: number;
  discType?: PersonaType;
  gender?: GenderType;
  userImage?: string; // 외부 이미지 URL 또는 경로
}

type AvatarKey = 'WD' | 'WI' | 'WS' | 'WC' | 'MD' | 'MI' | 'MS' | 'MC';

export default function ChatBubble({
  text,
  isUser,
  timestamp,
  discType = 'D',
  gender = 'W',
  userImage,
}: Props) {
  const formattedTime = new Date(timestamp).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const avatarImages: Record<AvatarKey, any> = {
    WD: require('../../assets/DISC_IMG/D_Woman_IMG.png'),
    WI: require('../../assets/DISC_IMG/I_Woman_IMG.png'),
    WS: require('../../assets/DISC_IMG/S_Woman_IMG.png'),
    WC: require('../../assets/DISC_IMG/C_Woman_IMG.png'),
    MD: require('../../assets/DISC_IMG/D_Man_IMG.png'),
    MI: require('../../assets/DISC_IMG/I_Man_IMG.png'),
    MS: require('../../assets/DISC_IMG/S_Man_IMG.png'),
    MC: require('../../assets/DISC_IMG/C_Man_IMG.png'),
  };

  const getAvatarImage = (discType: PersonaType, gender: GenderType): any => {
    const key = (gender + discType) as AvatarKey;
    return avatarImages[key] || avatarImages['WD'];
  };

  return (
    <>
      {!isUser && (
        <View style={styles.aiNameContainer}>
          <Text style={styles.aiName}>AI</Text>
        </View>
      )}
      <View
        style={[
          styles.rowContainer,
          isUser ? styles.rowReverse : styles.row,
        ]}
      >
        {isUser ? (
          <>
            <Text style={styles.time}>{formattedTime}</Text>
            <View style={[styles.bubble, styles.bubbleUser]}>
              <Text style={styles.text}>{text}</Text>
            </View>
            <Image
              source={
                userImage
                  ? { uri: userImage }
                  : require('../../assets/none.png')
              }
              style={[styles.avatar, { marginRight: 0, marginLeft: 8 }]}
            />
          </>
        ) : (
          <>
            <Image
              source={getAvatarImage(discType, gender)}
              style={styles.avatar}
            />
            <View style={[styles.bubble, styles.bubbleAI]}>
              <Text style={styles.text}>{text}</Text>
            </View>
            <Text style={styles.time}>{formattedTime}</Text>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 4,
    paddingHorizontal: 12,
  },
  row: {
    justifyContent: 'flex-start',
  },
  rowReverse: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bubbleUser: {
    backgroundColor: '#DCF8C6',
  },
  bubbleAI: {
    backgroundColor: '#FFF5C6',
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
  time: {
    fontSize: 10,
    color: '#666',
    marginHorizontal: 6,
    marginBottom: 2,
  },
  aiNameContainer: {
    paddingHorizontal: 20,
    marginBottom: 2,
  },
  aiName: {
    fontSize: 20,
    color: '#888',
    fontWeight: '600',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 14,
    marginRight: 8,
  },
});
