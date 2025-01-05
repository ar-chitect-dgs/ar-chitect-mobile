import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';
import { useDispatch, useSelector } from 'react-redux';
import { addAmbientLight, updateAmbientLight } from '../store/actions';
import { type AmbientLightProps } from '../AR/LightInterfaces';
import { type Reducer } from '../store/reducers';
import EditSlider from './EditSlider';
import EditingModal from '../components/EditingModal';
import NameInput from './NameInput';
import FilledButton from '../components/FilledButton';

interface AmbientLightModalProps {
  isVisible: boolean;
  isEditing: boolean;
  onClose: () => void;
  selectedLight: AmbientLightProps;
  snapPoint: string;
}

const AmbientLightModal: React.FC<AmbientLightModalProps> = ({
  isVisible,
  isEditing,
  onClose,
  selectedLight,
  snapPoint,
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
    <EditingModal isVisible={isVisible} snapPoint={snapPoint} onClose={onClose}>
      <NameInput
        title="Name: "
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
          title="Intensity"
          value={ambientLight.intensity}
          setValue={(intensity: number) => {
            setAmbientLight({ ...ambientLight, intensity });
          }}
          minimumValue={0}
          maximumValue={2000}
          step={1}
        />
      </View>
      <FilledButton title="Save" onPress={handleSave} />
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
