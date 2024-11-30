import React, { useState } from 'react';
import { Button } from 'react-native';
import { useDispatch } from 'react-redux';
import { updateModel } from '../store/actions';
import { type Vector3D, type Object3D } from '../AR/Interfaces';
import EditSlider from '../lightsPanel/EditSlider';
import EditingModal from '../components/EditingModal';

interface ModelModalProps {
  isVisible: boolean;
  onClose: () => void;
  id: number;
  selectedModel: Object3D;
  snapPoint: string;
}

const ModelModal: React.FC<ModelModalProps> = ({
  isVisible,
  onClose,
  id,
  selectedModel,
  snapPoint,
}) => {
  const [model, setModel] = useState<Object3D>(selectedModel);
  const dispatch = useDispatch();

  const handleSave = (): void => {
    dispatch(updateModel(id, model));
    onClose();
  };

  const handlePositionChange = (axis: keyof Vector3D, value: number) => {
    setModel((prev) => ({
      ...prev,
      position: {
        ...prev.position,
        [axis]: value,
      },
    }));
  };

  const axes: Array<keyof Vector3D> = ['x', 'y', 'z'];

  return (
    <EditingModal isVisible={isVisible} snapPoint={snapPoint}>
      {axes.map((axis) => (
        <EditSlider
          key={axis}
          title={`${axis.toUpperCase()} Position`}
          value={model.position[axis]}
          setValue={(value: number) => {
            handlePositionChange(axis, value);
          }}
          minimumValue={-10}
          maximumValue={10}
          step={1}
        />
      ))}
      <Button title="Save" onPress={handleSave} />
      <Button title="Close" onPress={onClose} />
    </EditingModal>
  );
};

export default ModelModal;
