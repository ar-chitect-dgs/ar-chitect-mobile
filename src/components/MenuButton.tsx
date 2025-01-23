import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  type GestureResponderEvent,
} from 'react-native';
import { purple2 } from '../styles/colors';
import FormattedText from './FormattedText';

interface MenuButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <FormattedText style={styles.buttonText}>{title}</FormattedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: purple2,
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});

export default MenuButton;
