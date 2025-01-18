import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';
import { useDispatch, useSelector } from 'react-redux';
import { addSpotLight, updateSpotLight } from '../store/actions';
import { type SpotLightProps } from '../AR/LightInterfaces';
import { type Reducer } from '../store/reducers';
import EditSlider from './EditSlider';
import VectorInput from './VectorInput';
import EditingModal from '../components/EditingModal';
import NameInput from './NameInput';
import { opaquePurple2, purple2 } from '../styles/colors';
import FilledButton from '../components/FilledButton';

interface SpotLightModalProps {
  isVisible: boolean;
  isEditing: boolean;
  stepSize: number;
  angleStepSize: number;
  onClose: () => void;
  selectedLight: SpotLightProps;
  snapPoint: string;
}

const SpotLightModal: React.FC<SpotLightModalProps> = ({
  isVisible,
  isEditing,
  stepSize,
  angleStepSize,
  onClose,
  selectedLight,
  snapPoint,
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

  const [positionErrors, setPositionErrors] = useState<boolean[]>([
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
      setPositionErrors(newInputErrors);
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
    <EditingModal isVisible={isVisible} snapPoint={snapPoint} onClose={onClose}>
      <NameInput
        title="Name: "
        value={spotLight.name}
        setName={(name: string) => {
          setSpotLight({ ...spotLight, name });
        }}
      />
      <ColorPicker
        color={spotLight.color}
        onColorChange={(color) => {
          setSpotLight({ ...spotLight, color });
        }}
      />

      <VectorInput
        value={positionInputs}
        title="Position"
        setVectorInputs={setPositionInputs}
        error={positionErrors}
      />

      <VectorInput
        value={directionInputs}
        title="Direction"
        setVectorInputs={setDirectionInputs}
        error={directionErrors}
      />

      <EditSlider
        title="Intensity"
        value={spotLight.intensity}
        setValue={(intensity: number) => {
          setSpotLight({ ...spotLight, intensity });
        }}
        minimumValue={0}
        maximumValue={2000}
        step={stepSize}
      />

      <EditSlider
        title="Inner angle"
        value={spotLight.innerAngle}
        setValue={(innerAngle: number) => {
          setSpotLight({ ...spotLight, innerAngle });
        }}
        minimumValue={0}
        maximumValue={90}
        step={angleStepSize}
      />

      <EditSlider
        title="Outer angle"
        value={spotLight.outerAngle}
        setValue={(outerAngle: number) => {
          setSpotLight({ ...spotLight, outerAngle });
        }}
        minimumValue={0}
        maximumValue={90}
        step={angleStepSize}
      />

      <EditSlider
        title="Attentuation start"
        value={spotLight.attenuationStartDistance}
        setValue={(attenuationStartDistance: number) => {
          setSpotLight({ ...spotLight, attenuationStartDistance });
        }}
        minimumValue={0}
        maximumValue={100}
        step={stepSize}
        sliderLength="short"
      />

      <EditSlider
        title="Attentuation end"
        value={spotLight.attenuationEndDistance}
        setValue={(attenuationEndDistance: number) => {
          setSpotLight({ ...spotLight, attenuationEndDistance });
        }}
        minimumValue={0}
        maximumValue={100}
        step={stepSize}
        sliderLength="short"
      />

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Casts Shadow:</Text>
        <Switch
          value={spotLight.castsShadow}
          onValueChange={(value) => {
            setSpotLight({ ...spotLight, castsShadow: value });
          }}
          thumbColor={spotLight.castsShadow ? opaquePurple2 : '#f4f3f4'}
          trackColor={{ false: '#989898', true: purple2 }}
        />
      </View>

      <FilledButton title="Save" onPress={handleSave} />
    </EditingModal>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
    justifyContent: 'space-between',
    color: '#000',
    marginBottom: 10,
  },
  label: {
    color: '#000',
    marginRight: 10,
    fontSize: 16,
  },
});

export default SpotLightModal;
