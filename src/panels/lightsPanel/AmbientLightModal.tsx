import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';
import { useDispatch } from 'react-redux';
import { addAmbientLight, updateAmbientLight } from '../../store/actions';
import { type AmbientLightProps } from '../../AR/LightInterfaces';
import EditSlider from './EditSlider';
import EditingModal from '../../components/EditingModal';
import NameInput from './NameInput';
import FilledButton from '../../components/FilledButton';
import { useTranslation } from 'react-i18next';
import { generateRandomId } from '../../utils/utils';

interface AmbientLightModalProps {
  isVisible: boolean;
  isEditing: boolean;
  stepSize: number;
  onClose: () => void;
  selectedLight: AmbientLightProps;
  snapPoint: string;
}

const AmbientLightModal: React.FC<AmbientLightModalProps> = ({
  isVisible,
  isEditing,
  stepSize,
  onClose,
  selectedLight,
  snapPoint,
}) => {
  const { t } = useTranslation();

  const [ambientLight, setAmbientLight] =
    useState<AmbientLightProps>(selectedLight);

  const dispatch = useDispatch();

  useEffect(() => {
    setAmbientLight(selectedLight);
  }, [selectedLight]);

  const handleSave = (): void => {
    if (isEditing) {
      dispatch(updateAmbientLight(selectedLight.id, ambientLight));
    } else {
      dispatch(addAmbientLight({ ...ambientLight, id: generateRandomId() }));
    }
    onClose();
  };

  return (
    <EditingModal isVisible={isVisible} snapPoint={snapPoint} onClose={onClose}>
      <NameInput
        title={`${t('panels.name')}: `}
        value={ambientLight.name}
        setName={(name: string) => {
          setAmbientLight({ ...ambientLight, name });
        }}
      />
      <ColorPicker
        color={ambientLight.color}
        onColorChange={(color) => {
          setAmbientLight({ ...ambientLight, color });
        }}
      />
      <View style={styles.container}>
        <EditSlider
          title={`${t('lightModal.intensity')}`}
          value={ambientLight.intensity}
          setValue={(intensity: number) => {
            setAmbientLight({ ...ambientLight, intensity });
          }}
          minimumValue={0}
          maximumValue={2000}
          step={stepSize}
        />
      </View>
      <FilledButton title={t('panels.save')} onPress={handleSave} />
    </EditingModal>
  );
};

const styles = StyleSheet.create({
  label: {
    color: '#000',
    marginRight: 10,
  },
  container: {
    marginBottom: 10,
    flex: 1,
  },
});

export default AmbientLightModal;
