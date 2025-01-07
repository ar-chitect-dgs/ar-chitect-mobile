import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { purple2 } from '../styles/colors';

export interface ErrorPopupProps {
  isVisible: boolean;
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
  onClose: () => void;
  closeText: string;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({
  isVisible,
  title,
  message,
  onConfirm,
  confirmText,
  onClose,
  closeText,
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
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonContainer}>
            {onConfirm && confirmText && (
              <TouchableOpacity
                onPress={onConfirm}
                style={[styles.confirmButton, styles.marginRight]}
              >
                <Text style={styles.confirmButtonText}>{confirmText}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={onClose}
              style={[styles.button, styles.marginRight]}
            >
              <Text style={styles.buttonText}>{closeText}</Text>
            </TouchableOpacity>
          </View>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    borderColor: purple2,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderWidth: 1,
    borderRadius: 5,
  },
  confirmButton: {
    borderColor: purple2,
    backgroundColor: purple2,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderWidth: 1,
    borderRadius: 5,
  },
  marginRight: {
    marginRight: 10,
  },
  buttonText: {
    color: purple2,
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmButtonText: {
    color: '#ffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ErrorPopup;
