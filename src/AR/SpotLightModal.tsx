import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  ScrollView,
  Switch,
} from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';
import Slider from '@react-native-community/slider';
import { useDispatch, useSelector } from 'react-redux';
import { addSpotLight, updateSpotLight } from '../store/actions';
import { SpotLightProps } from './LightInterfaces';
import { Reducer } from '../store/reducers';

interface SpotLightModalProps {
  visible: boolean;
  isEditing: boolean;
  onClose: () => void;
  selectedLight: SpotLightProps;
}

const SpotLightModal: React.FC<SpotLightModalProps> = ({
  visible,
  isEditing,
  onClose,
  selectedLight,
}) => {
  const [spotLight, setSpotLight] = useState<SpotLightProps>(selectedLight);

  const [positionInputs, setPositionInputs] = useState<
    [string, string, string]
  >(() => {
    const position = spotLight.position.map(String);
    return [position[0] || '0', position[1] || '0', position[2] || '0'] as [
      string,
      string,
      string,
    ];
  });

  const [directionInputs, setDirectionInputs] = useState<
    [string, string, string]
  >(() => {
    const direction = spotLight.direction.map(String);
    return [direction[0] || '0', direction[1] || '0', direction[2] || '0'] as [
      string,
      string,
      string,
    ];
  });

  const [inputErrors, setInputErrors] = useState<boolean[]>([
    false,
    false,
    false,
  ]);
  const [directionErrors, setDirectionErrors] = useState<boolean[]>([
    false,
    false,
    false,
  ]);

  const dispatch = useDispatch();
  const { spotLights } = useSelector((state: Reducer) => state.lightConfig);
  const maxId =
    spotLights.length > 0
      ? Math.max(...spotLights.map((spotLight) => spotLight.id))
      : 0;

  const parseVector = (
    inputs: [string, string, string],
  ): [number, number, number] => {
    return inputs.map((input) => {
      const parsed = parseFloat(input);
      return isNaN(parsed) ? 0 : parsed;
    }) as [number, number, number];
  };

  const handleSave = () => {
    const parsedPosition = parseVector(positionInputs);
    const parsedDirection = parseVector(directionInputs);

    const newInputErrors = positionInputs.map((input) =>
      isNaN(parseFloat(input)),
    );
    const newDirectionErrors = directionInputs.map((input) =>
      isNaN(parseFloat(input)),
    );

    if (
      newInputErrors.some((error) => error) ||
      newDirectionErrors.some((error) => error)
    ) {
      setInputErrors(newInputErrors);
      setDirectionErrors(newDirectionErrors);
      return;
    }

    dispatch(
      isEditing
        ? updateSpotLight(selectedLight.id, {
            ...spotLight,
            position: parsedPosition,
            direction: parsedDirection,
          })
        : addSpotLight({
            ...spotLight,
            position: parsedPosition,
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
          <Text style={styles.label}>Pick a color for Spot Light</Text>
          <ColorPicker
            color={spotLight.color}
            onColorChange={(color) => setSpotLight({ ...spotLight, color })}
          />

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Position:</Text>
            {['X', 'Y', 'Z'].map((axis, index) => (
              <TextInput
                key={index}
                style={styles.input}
                keyboardType="numeric" // Accepting only numeric input
                value={positionInputs[index]}
                onChangeText={(text) => {
                  const newInputs = [...positionInputs] as [
                    string,
                    string,
                    string,
                  ];
                  newInputs[index] = text;
                  setPositionInputs(newInputs);
                }}
                placeholder={`Enter ${axis} position`}
                placeholderTextColor="#999"
              />
            ))}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Direction:</Text>
            {['X', 'Y', 'Z'].map((axis, index) => (
              <TextInput
                key={index}
                style={styles.input}
                keyboardType="numeric"
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
                maximumValue={10000}
                step={1}
                value={spotLight.intensity}
                onValueChange={(value) =>
                  setSpotLight({ ...spotLight, intensity: value })
                }
              />
              <Text style={styles.label}>{spotLight.intensity.toFixed(0)}</Text>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Inner Angle:</Text>
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={90}
                step={1}
                value={spotLight.innerAngle}
                onValueChange={(value) =>
                  setSpotLight({ ...spotLight, innerAngle: value })
                }
              />
              <Text style={styles.label}>
                {spotLight.innerAngle.toFixed(0)}°
              </Text>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Outer Angle:</Text>
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={90}
                step={1}
                value={spotLight.outerAngle}
                onValueChange={(value) =>
                  setSpotLight({ ...spotLight, outerAngle: value })
                }
              />
              <Text style={styles.label}>
                {spotLight.outerAngle.toFixed(0)}°
              </Text>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Attenuation Start Distance:</Text>
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                step={1}
                value={spotLight.attenuationStartDistance}
                onValueChange={(value) =>
                  setSpotLight({
                    ...spotLight,
                    attenuationStartDistance: value,
                  })
                }
              />
              <Text style={styles.label}>
                {spotLight.attenuationStartDistance.toFixed(0)}
              </Text>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Attenuation End Distance:</Text>
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={100}
                step={1}
                value={spotLight.attenuationEndDistance}
                onValueChange={(value) =>
                  setSpotLight({ ...spotLight, attenuationEndDistance: value })
                }
              />
              <Text style={styles.label}>
                {spotLight.attenuationEndDistance.toFixed(0)}
              </Text>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Casts Shadow:</Text>
            <Switch
              value={spotLight.castsShadow}
              onValueChange={(value) =>
                setSpotLight({ ...spotLight, castsShadow: value })
              }
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
    height: 30,
  },
  sliderValue: {
    width: '30%',
    textAlign: 'right',
  },
});

export default SpotLightModal;
