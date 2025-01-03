import React, { useState } from 'react';
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

  const handlePositionChange = (axis: keyof Vector3D, value: number): void => {
    setModel((prev) => ({
      ...prev,
      position: {
        ...prev.position,
        [axis]: value,
      },
    }));
    dispatch(updateModel(id, model));
  };

  const axes: Array<keyof Vector3D> = ['x', 'y', 'z'];

  return (
    <EditingModal isVisible={isVisible} snapPoint={snapPoint} onClose={onClose}>
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
          step={0.5}
        />
      ))}
    </EditingModal>
  );
};

export default ModelModal;
