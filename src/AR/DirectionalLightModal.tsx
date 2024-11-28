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
import Slider from '@react-native-community/slider';
import { useDispatch, useSelector } from 'react-redux';
import { addDirectionalLight, updateDirectionalLight } from '../store/actions';
import { type DirectionalLightProps } from './LightInterfaces';
import { type Reducer } from '../store/reducers';

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

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Direction:</Text>
            {['X', 'Y', 'Z'].map((axis, index) => (
              <TextInput
                key={index}
                style={styles.input}
                keyboardType="numeric" // Accepting only numeric input
                value={directionInputs[index]}
                onChangeText={(text) => {
                  const newInputs = [...directionInputs] as [
                    string,
                    string,
                    string,
                  ];
                  newInputs[index] = text;
                  setDirectionInputs(newInputs);
                }}
                placeholder={`Enter ${axis} direction`}
                placeholderTextColor="#999"
              />
            ))}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Intensity:</Text>
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={2000}
                step={1}
                value={directionalLight.intensity}
                onValueChange={(value) => {
                  setDirectionalLight({
                    ...directionalLight,
                    intensity: value,
                  });
                }}
              />
              <Text style={styles.label}>
                {directionalLight.intensity.toFixed(0)}
              </Text>
            </View>
          </View>

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
  input: {
    height: 30,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: '30%',
    color: '#000',
    marginHorizontal: 5,
    flexShrink: 1,
    fontSize: 12,
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

export default DirecionalLightModal;
