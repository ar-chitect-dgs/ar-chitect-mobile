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
    const newModel: Object3D = {
      ...model,
      position: {
        ...model.position,
        [axis]: value,
      },
    };
    setModel(newModel);
    dispatch(updateModel(id, newModel));
  };

  const axes: Array<keyof Vector3D> = ['x', 'y', 'z'];

  return (
    <EditingModal isVisible={isVisible} snapPoint={snapPoint} onClose={onClose}>
      {axes.map((axis) => (
        <EditSlider
          key={axis}
          title={`${axis.toUpperCase()} Position`}
          value={model.position[axis]}
          setValue={(newValue: number) => {
            handlePositionChange(axis, newValue);
          }}
          minimumValue={-10}
          maximumValue={10}
          step={0.1}
        />
      ))}
    </EditingModal>
  );
};

export default ModelModal;
