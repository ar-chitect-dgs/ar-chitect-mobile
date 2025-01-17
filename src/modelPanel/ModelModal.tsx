import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUnsavedChanges, updateModel } from '../store/actions';
import { type Vector3D, type Object3D } from '../AR/Interfaces';
import EditSlider from '../lightsPanel/EditSlider';
import EditingModal from '../components/EditingModal';
import NameInput from '../lightsPanel/NameInput';

interface ModelModalProps {
  isVisible: boolean;
  stepSize: number;
  onClose: () => void;
  id: number;
  selectedModel: Object3D;
  snapPoint: string;
}

const ModelModal: React.FC<ModelModalProps> = ({
  isVisible,
  stepSize,
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
    dispatch(updateModel(id, newModel));
    setModel(newModel);
  };

  const handleNameChange = (newName: string): void => {
    const newModel: Object3D = {
      ...model,
      modelName: newName,
    };
    setModel(newModel);
    dispatch(updateModel(id, newModel));
  };

  const axes: Array<keyof Vector3D> = ['x', 'y', 'z'];

  return (
    <EditingModal
      isVisible={isVisible}
      snapPoint={snapPoint}
      onClose={() => {
        dispatch(
          updateModel(id, {
            ...model,
            isSelected: false,
          }),
        );
        onClose();
      }}
    >
      <NameInput
        title="Name: "
        value={model.modelName}
        setName={handleNameChange}
      />
      {axes.map((axis) => (
        <EditSlider
          key={axis}
          title={`${axis.toUpperCase()} Position`}
          value={model.position[axis]}
          setValue={(newValue: number) => {
            handlePositionChange(axis, newValue);
          }}
          onSlidingComplete={() => dispatch(setUnsavedChanges(true))}
          minimumValue={-10}
          maximumValue={10}
          step={stepSize}
        />
      ))}
    </EditingModal>
  );
};

export default ModelModal;
