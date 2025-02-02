import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { addSpotLight, updateSpotLight } from '../../store/actions';
import { type SpotLightProps } from '../../AR/LightInterfaces';
import EditSlider from './EditSlider';
import VectorInput from './VectorInput';
import EditingModal from '../../components/EditingModal';
import NameInput from './NameInput';
import { opaquePurple2, purple2 } from '../../styles/colors';
import FilledButton from '../../components/FilledButton';
import FormattedText from '../../components/FormattedText';
import { generateRandomId, mapVectorToStringArray } from '../../utils/utils';

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
  const { t } = useTranslation();

  useEffect(() => {
    setSpotLight(selectedLight);
    setDirectionInputs(() => {
      return mapVectorToStringArray(selectedLight.direction);
    });
    setPositionInputs(() => {
      return mapVectorToStringArray(selectedLight.position);
    });
  }, [selectedLight]);

  const [positionInputs, setPositionInputs] = useState<
    [string, string, string]
  >(() => {
    return mapVectorToStringArray(spotLight.position);
  });

  const [directionInputs, setDirectionInputs] = useState<
    [string, string, string]
  >(() => {
    return mapVectorToStringArray(spotLight.direction);
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
            id: generateRandomId(),
          }),
    );
    onClose();
  };

  return (
    <EditingModal isVisible={isVisible} snapPoint={snapPoint} onClose={onClose}>
      <NameInput
        title={`${t('panels.name')}: `}
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
        title={`${t('lightModal.position')}`}
        setVectorInputs={setPositionInputs}
        error={positionErrors}
      />

      <VectorInput
        value={directionInputs}
        title={`${t('lightModal.direction')}`}
        setVectorInputs={setDirectionInputs}
        error={directionErrors}
      />

      <EditSlider
        title={`${t('lightModal.intensity')}`}
        value={spotLight.intensity}
        setValue={(intensity: number) => {
          setSpotLight({ ...spotLight, intensity });
        }}
        minimumValue={0}
        maximumValue={2000}
        step={stepSize}
      />

      <EditSlider
        title={`${t('lightModal.innerAngle')}`}
        value={spotLight.innerAngle}
        setValue={(innerAngle: number) => {
          setSpotLight({ ...spotLight, innerAngle });
        }}
        minimumValue={0}
        maximumValue={90}
        step={angleStepSize}
      />

      <EditSlider
        title={`${t('lightModal.outerAngle')}`}
        value={spotLight.outerAngle}
        setValue={(outerAngle: number) => {
          setSpotLight({ ...spotLight, outerAngle });
        }}
        minimumValue={0}
        maximumValue={90}
        step={angleStepSize}
      />

      <EditSlider
        title={`${t('lightModal.attentuationStart')}`}
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
        title={`${t('lightModal.attentuationEnd')}`}
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
        <FormattedText
          style={styles.label}
        >{`${t('lightModal.castsShadows')}`}</FormattedText>
        <Switch
          value={spotLight.castsShadow}
          onValueChange={(value) => {
            setSpotLight({ ...spotLight, castsShadow: value });
          }}
          thumbColor={spotLight.castsShadow ? opaquePurple2 : '#f4f3f4'}
          trackColor={{ false: '#989898', true: purple2 }}
        />
      </View>

      <FilledButton title={t('panels.save')} onPress={handleSave} />
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
