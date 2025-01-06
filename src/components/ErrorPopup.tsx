import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { purple2 } from '../styles/colors';

export interface ErrorPopupProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({
  isVisible,
  message,
  onClose,
}) => {
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.alertBox, styles.errorBox]}>
          <Text style={styles.title}>Error</Text>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity onPress={onClose} style={styles.button}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    width: 300,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  errorBox: {
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: purple2,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  button: {
    alignSelf: 'center',
    borderColor: purple2,
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderWidth: 1,
    borderRadius: 5,
  },
  buttonText: {
    color: purple2,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ErrorPopup;
