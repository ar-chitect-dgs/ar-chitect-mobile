// AmbientLightModal.tsx
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
} from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';
import { useDispatch, useSelector } from 'react-redux';
import { addAmbientLight, updateAmbientLight } from '../store/actions';
import { type AmbientLightProps } from '../AR/LightInterfaces';
import { type Reducer } from '../store/reducers';
import LightSlider from './LightSlider';

interface AmbientLightModalProps {
  visible: boolean;
  isEditing: boolean;
  onClose: () => void;
  selectedLight: AmbientLightProps;
}

const AmbientLightModal: React.FC<AmbientLightModalProps> = ({
  visible,
  isEditing,
  onClose,
  selectedLight,
}) => {
  const [ambientLight, setAmbientLight] =
    useState<AmbientLightProps>(selectedLight);

  const dispatch = useDispatch();
  const { ambientLights } = useSelector((state: Reducer) => state.lightConfig);
  const maxId =
    ambientLights.length > 0
      ? Math.max(...ambientLights.map((ambientLight) => ambientLight.id))
      : 0;

  const handleSave = (): void => {
    if (isEditing) {
      dispatch(updateAmbientLight(selectedLight.id, ambientLight));
    } else {
      dispatch(addAmbientLight({ ...ambientLight, id: maxId + 1 }));
    }
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContent}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.label}>Pick a color for Directional Light</Text>
          <ColorPicker
            color={ambientLight.color}
            onColorChange={(color) => {
              setAmbientLight({ ...ambientLight, color });
            }}
          />

          <LightSlider
            title="Intensity"
            value={ambientLight.intensity}
            setValue={(intensity: number) => {
              setAmbientLight({ ...ambientLight, intensity });
            }}
            minimumValue={0}
            maximumValue={2000}
            step={1}
          />

          <Button title="Save" onPress={handleSave} />
          <Button title="Close" onPress={onClose} />
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
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

export default AmbientLightModal;
