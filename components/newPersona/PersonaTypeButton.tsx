import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type Props = {
  type: string;
  color: string;
  onPress: (type: string) => void;
};

const typeDescriptions: { [key: string]: string } = {
  D: '결단력 있는 리더,\n결과로 말해요.',
  I: '에너지 넘치는\n분위기 메이커!',
  S: '든든한 조력자,\n묵묵히 함께해요.',
  C: '꼼꼼한 전략가,\n실수는 없어요.',
};
const PersonaTypeButton = ({ type, color, onPress }: Props) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }]}
      onPress={() => onPress(type)}
    >
      <Text style={styles.buttonTitle}>{type} 형</Text>
      <Text style={styles.description}>
        {typeDescriptions[type]}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 15,
    width: '48%',
  },
  buttonTitle: {
    color: '#000',
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: '#333',
    fontSize: 15,
    textAlign: 'center',
  },
});

export default PersonaTypeButton;
