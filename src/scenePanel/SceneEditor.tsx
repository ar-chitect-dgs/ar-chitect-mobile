import React, { useState } from 'react';
import { Button } from 'react-native';
import { useDispatch } from 'react-redux';
import { setOrientation, setTranslation } from '../store/actions';
import { type Vector3D } from '../AR/Interfaces';
import EditSlider from '../lightsPanel/EditSlider';
import EditingModal from '../components/EditingModal';

interface SceneEditorProps {
  translation: Vector3D;
  orientation: number;
  snapPoint: string;
  isVisible: boolean;
  onClose: () => void;
}

const SceneEditor: React.FC<SceneEditorProps> = ({
  translation,
  orientation,
  snapPoint,
  isVisible,
  onClose,
}) => {
  const dispatch = useDispatch();
  const [newTranslation, setNewTranslation] = useState(translation);
  const [newOrientation, setNewOrientation] = useState(orientation);

  const handlePositionChange = (axis: keyof Vector3D, value: number): void => {
    const updatedTranslation = { ...translation, [axis]: value };
    setNewTranslation(updatedTranslation);
    dispatch(setTranslation(updatedTranslation));
  };

  const handleRotationChange = (value: number): void => {
    setNewOrientation(value);
    dispatch(setOrientation(value));
  };

  const axes: Array<keyof Vector3D> = ['x', 'y', 'z'];
  return (
    <EditingModal isVisible={isVisible} snapPoint={snapPoint}>
      {axes.map((axis) => (
        <EditSlider
          key={axis}
          title={`${axis.toUpperCase()} translation`}
          value={newTranslation[axis]}
          setValue={(value: number) => {
            handlePositionChange(axis, value);
          }}
          minimumValue={-10}
          maximumValue={10}
          step={0.5}
        />
      ))}
      <EditSlider
        title={'Rotation'}
        value={newOrientation}
        setValue={(value: number) => {
          handleRotationChange(value);
        }}
        minimumValue={-180}
        maximumValue={180}
        step={10}
      />
      <Button title="Close" onPress={onClose} />
    </EditingModal>
  );
};

export default SceneEditor;
