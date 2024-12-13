import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface EditingModalProps {
  isVisible: boolean;
  snapPoint: string;
  children: React.ReactNode;
  onClose: () => void;
}

const EditingModal = ({
  snapPoint,
  isVisible,
  children,
  onClose,
}: EditingModalProps): JSX.Element => {
  const screenHeight = Dimensions.get('window').height;
  const snapPointHeight = (parseInt(snapPoint) * screenHeight) / 100 - 100;

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { height: snapPointHeight }]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="window-close" size={30} color="black" />
          </TouchableOpacity>
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
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
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
