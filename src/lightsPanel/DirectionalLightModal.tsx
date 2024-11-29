import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  Switch,
  ScrollView,
} from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';
import { useDispatch, useSelector } from 'react-redux';
import { addDirectionalLight, updateDirectionalLight } from '../store/actions';
import { type DirectionalLightProps } from '../AR/LightInterfaces';
import { type Reducer } from '../store/reducers';
import LightSlider from './LightSlider';
import VectorInput from './VectorInput';

interface DirectionalLightModalProps {
  visible: boolean;
  isEditing: boolean;
  onClose: () => void;
  selectedLight: DirectionalLightProps;
}

const DirecionalLightModal: React.FC<DirectionalLightModalProps> = ({
  visible,
  isEditing,
  onClose,
  selectedLight,
}) => {
  const [directionalLight, setDirectionalLight] =
    useState<DirectionalLightProps>(selectedLight);

  const [directionInputs, setDirectionInputs] = useState<
    [string, string, string]
  >(() => {
    const direction = directionalLight.direction.map(String);
    return [direction[0] || '0', direction[1] || '0', direction[2] || '0'] as [
      string,
      string,
      string,
    ];
  });

  const [directionErrors, setDirectionErrors] = useState<boolean[]>([
    false,
    false,
    false,
  ]);

  const dispatch = useDispatch();
  const { directionalLights } = useSelector(
    (state: Reducer) => state.lightConfig,
  );
  const maxId =
    directionalLights.length > 0
      ? Math.max(
          ...directionalLights.map((directionalLight) => directionalLight.id),
        )
      : 0;

  const parseVector = (
    inputs: [string, string, string],
  ): [number, number, number] => {
    return inputs.map((input) => {
      const parsed = parseFloat(input);
      return isNaN(parsed) ? 0 : parsed;
    }) as [number, number, number];
  };

  const handleSave = (): void => {
    const parsedDirection = parseVector(directionInputs);

    const newDirectionErrors = directionInputs.map((input) =>
      isNaN(parseFloat(input)),
    );

    if (newDirectionErrors.some((error) => error)) {
      setDirectionErrors(newDirectionErrors);
      return;
    }
    dispatch(
      isEditing
        ? updateDirectionalLight(selectedLight.id, {
            ...directionalLight,
            direction: parsedDirection,
          })
        : addDirectionalLight({
            ...directionalLight,
            direction: parsedDirection,
            id: maxId + 1,
          }),
    );
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContent}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.label}>Pick a color for Directional Light</Text>
          <ColorPicker
            color={directionalLight.color}
            onColorChange={(color) => {
              setDirectionalLight({ ...directionalLight, color });
            }}
          />

          <VectorInput
            value={directionInputs}
            title="direction"
            setVectorInputs={setDirectionInputs}
          />

          <LightSlider
            title="Intensity"
            value={directionalLight.intensity}
            setValue={(intensity: number) => {
              setDirectionalLight({ ...directionalLight, intensity });
            }}
            minimumValue={0}
            maximumValue={2000}
            step={1}
          />

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Casts Shadow:</Text>
            <Switch
              value={directionalLight.castsShadow}
              onValueChange={(value) => {
                setDirectionalLight({
                  ...directionalLight,
                  castsShadow: value,
                });
              }}
            />
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

export default DirecionalLightModal;