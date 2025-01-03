import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  type GestureResponderEvent,
} from 'react-native';
import { purple2 } from '../styles/colors';

interface MenuButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
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
