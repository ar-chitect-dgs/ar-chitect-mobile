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
import { type AmbientLightProps } from './LightInterfaces';
import Slider from '@react-native-community/slider';
import { type Reducer } from '../store/reducers';

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

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Intensity:</Text>
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={10000}
                step={1}
                value={ambientLight.intensity}
                onValueChange={(value) => {
                  setAmbientLight({ ...ambientLight, intensity: value });
                }}
              />
              <Text style={styles.label}>
                {ambientLight.intensity.toFixed(0)}
              </Text>
            </View>
          </View>

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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
    justifyContent: 'space-between',
    color: '#000',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 10,
    width: '30%',
    color: '#000',
    marginHorizontal: 5,
    flexShrink: 1,
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
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    justifyContent: 'space-between',
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 5,
    color: '#000',
  },
  slider: {
    width: '70%',
    height: 40,
  },
  sliderValue: {
    width: '30%',
    textAlign: 'right',
  },
});

export default AmbientLightModal;
