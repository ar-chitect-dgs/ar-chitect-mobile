import React, { useState } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';
import { setOrientation, setScale, setTranslation } from '../../store/actions';
import { type Vector3D } from '../../AR/Interfaces';
import EditSlider from '../lightsPanel/EditSlider';
import EditingModal from '../../components/EditingModal';
import { useTranslation } from 'react-i18next';

interface SceneEditorProps {
  translation: Vector3D;
  orientation: number;
  scale: number;
  stepSize: number;
  angleStepSize: number;
  snapPoint: string;
  isVisible: boolean;
  onClose: () => void;
}

const SceneEditor: React.FC<SceneEditorProps> = ({
  translation,
  orientation,
  scale,
  stepSize,
  angleStepSize,
  snapPoint,
  isVisible,
  onClose,
}) => {
  const dispatch = useDispatch();
  const [newTranslation, setNewTranslation] = useState(translation);
  const [newOrientation, setNewOrientation] = useState(orientation);
  const [newScale, setNewScale] = useState(scale);

  const { t } = useTranslation();

  const handlePositionChange = (axis: keyof Vector3D, value: number): void => {
    const updatedTranslation = { ...translation, [axis]: value };
    setNewTranslation(updatedTranslation);
    dispatch(setTranslation(updatedTranslation));
  };

  const handleRotationChange = (value: number): void => {
    setNewOrientation(value);
    dispatch(setOrientation(value));
  };

  const handleScaleChange = (value: number): void => {
    setNewScale(value);
    dispatch(setScale(value));
  };

  const axes: Array<keyof Vector3D> = ['x', 'y', 'z'];
  return (
    <EditingModal isVisible={isVisible} snapPoint={snapPoint} onClose={onClose}>
      <View
        style={{
          paddingTop: 20,
        }}
      >
        {axes.map((axis) => (
          <EditSlider
            key={axis}
            title={`${axis.toUpperCase()} ${t('panels.translation')}`}
            value={newTranslation[axis]}
            setValue={(value: number) => {
              handlePositionChange(axis, value);
            }}
            minimumValue={-20}
            maximumValue={20}
            step={stepSize}
          />
        ))}
        <EditSlider
          title={`${t('panels.rotation')}`}
          value={newOrientation}
          setValue={(value: number) => {
            handleRotationChange(value);
          }}
          minimumValue={-180}
          maximumValue={180}
          step={angleStepSize}
        />
        <EditSlider
          title={`${t('panels.scale')}`}
          value={newScale}
          setValue={(value: number) => {
            handleScaleChange(value);
          }}
          minimumValue={0}
          maximumValue={10}
          step={stepSize}
        />
      </View>
    </EditingModal>
  );
};

export default SceneEditor;
