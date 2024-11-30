import React from 'react';
import { View, StyleSheet, Modal, ScrollView, Dimensions } from 'react-native';

interface EditingModalProps {
  isVisible: boolean;
  snapPoint: string;
  children: React.ReactNode;
}

const EditingModal = ({
  snapPoint,
  isVisible,
  children,
}: EditingModalProps): JSX.Element => {
  const screenHeight = Dimensions.get('window').height;
  const snapPointHeight = (parseInt(snapPoint) * screenHeight) / 100;

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { height: snapPointHeight }]}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
    justifyContent: 'space-between',
    color: '#000',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  label: {
    color: '#000',
    marginRight: 10,
  },
});

export default EditingModal;
