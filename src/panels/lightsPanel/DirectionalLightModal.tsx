import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';
import { useDispatch } from 'react-redux';
import {
  addDirectionalLight,
  updateDirectionalLight,
} from '../../store/actions';
import { type DirectionalLightProps } from '../../AR/LightInterfaces';
import EditSlider from './EditSlider';
import VectorInput from './VectorInput';
import EditingModal from '../../components/EditingModal';
import NameInput from './NameInput';
import { opaquePurple2, purple2 } from '../../styles/colors';
import FilledButton from '../../components/FilledButton';
import { useTranslation } from 'react-i18next';
import FormattedText from '../../components/FormattedText';
import { generateRandomId, mapVectorToStringArray } from '../../utils/utils';

interface DirectionalLightModalProps {
  isVisible: boolean;
  isEditing: boolean;
  stepSize: number;
  onClose: () => void;
  selectedLight: DirectionalLightProps;
  snapPoint: string;
}

const DirecionalLightModal: React.FC<DirectionalLightModalProps> = ({
  isVisible,
  isEditing,
  stepSize,
  onClose,
  selectedLight,
  snapPoint,
}) => {
  const { t } = useTranslation();

  const [directionalLight, setDirectionalLight] =
    useState<DirectionalLightProps>(selectedLight);

  useEffect(() => {
    setDirectionalLight(selectedLight);
    setDirectionInputs(() => {
      return mapVectorToStringArray(selectedLight.direction);
    });
  }, [selectedLight]);

  const [directionInputs, setDirectionInputs] = useState<
    [string, string, string]
  >(() => {
    return mapVectorToStringArray(directionalLight.direction);
  });

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
            id: generateRandomId(),
          }),
    );
    onClose();
  };

  return (
    <EditingModal isVisible={isVisible} snapPoint={snapPoint} onClose={onClose}>
      <NameInput
        title={`${t('panels.name')}: `}
        value={directionalLight.name}
        setName={(name: string) => {
          setDirectionalLight({ ...directionalLight, name });
        }}
      />
      <ColorPicker
        color={directionalLight.color}
        onColorChange={(color) => {
          setDirectionalLight({ ...directionalLight, color });
        }}
      />

      <VectorInput
        value={directionInputs}
        title={`${t('lightModal.direction')}`}
        setVectorInputs={setDirectionInputs}
        error={directionErrors}
      />

      <EditSlider
        title={`${t('lightModal.intensity')}`}
        value={directionalLight.intensity}
        setValue={(intensity: number) => {
          setDirectionalLight({ ...directionalLight, intensity });
        }}
        minimumValue={0}
        maximumValue={2000}
        step={stepSize}
      />

      <View style={styles.inputContainer}>
        <FormattedText
          style={styles.label}
        >{`${t('lightModal.castsShadows')}`}</FormattedText>
        <Switch
          value={directionalLight.castsShadow}
          onValueChange={(value) => {
            setDirectionalLight({
              ...directionalLight,
              castsShadow: value,
            });
          }}
          thumbColor={directionalLight.castsShadow ? opaquePurple2 : '#f4f3f4'}
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
    marginBottom: 20,
    paddingRight: 10,
  },
  label: {
    color: '#000',
    marginRight: 10,
    marginTop: 3,
    fontSize: 16,
  },
});

export default DirecionalLightModal;
