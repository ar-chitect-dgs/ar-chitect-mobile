import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';
import { useDispatch, useSelector } from 'react-redux';
import { addSpotLight, updateSpotLight } from '../store/actions';
import { type SpotLightProps } from '../AR/LightInterfaces';
import { type Reducer } from '../store/reducers';
import LightSlider from './LightSlider';
import VectorInput from './VectorInput';

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

  const handleSave = (): void => {
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
            onColorChange={(color) => {
              setSpotLight({ ...spotLight, color });
            }}
          />

          <VectorInput
            value={positionInputs}
            title="position"
            setVectorInputs={setPositionInputs}
          />

          <VectorInput
            value={directionInputs}
            title="direction"
            setVectorInputs={setDirectionInputs}
          />

          <LightSlider
            title="Intensity"
            value={spotLight.intensity}
            setValue={(intensity: number) => {
              setSpotLight({ ...spotLight, intensity });
            }}
            minimumValue={0}
            maximumValue={2000}
            step={1}
          />

          <LightSlider
            title="Inner angle"
            value={spotLight.innerAngle}
            setValue={(innerAngle: number) => {
              setSpotLight({ ...spotLight, innerAngle });
            }}
            minimumValue={0}
            maximumValue={90}
            step={1}
          />

          <LightSlider
            title="Outer angle"
            value={spotLight.outerAngle}
            setValue={(outerAngle: number) => {
              setSpotLight({ ...spotLight, outerAngle });
            }}
            minimumValue={0}
            maximumValue={90}
            step={1}
          />

          <LightSlider
            title="Attentuation Start Distance"
            value={spotLight.attenuationStartDistance}
            setValue={(attenuationStartDistance: number) => {
              setSpotLight({ ...spotLight, attenuationStartDistance });
            }}
            minimumValue={0}
            maximumValue={100}
            step={1}
          />

          <LightSlider
            title="Attentuation End Distance"
            value={spotLight.attenuationEndDistance}
            setValue={(attenuationEndDistance: number) => {
              setSpotLight({ ...spotLight, attenuationEndDistance });
            }}
            minimumValue={0}
            maximumValue={100}
            step={1}
          />

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Casts Shadow:</Text>
            <Switch
              value={spotLight.castsShadow}
              onValueChange={(value) => {
                setSpotLight({ ...spotLight, castsShadow: value });
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

export default SpotLightModal;
