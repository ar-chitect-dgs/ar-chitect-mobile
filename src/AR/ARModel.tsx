import React, { useState } from 'react';
import { Viro3DObject } from '@reactvision/react-viro';
import { type Vector3D } from './Interfaces';
import { type ViroClickState } from '@reactvision/react-viro/dist/components/Types/ViroEvents';
import { useDispatch } from 'react-redux';
import { setUnsavedChanges } from '../store/actions';

interface ARModelProps {
  url: string;
  position: Vector3D;
  rotation: Vector3D;
  selected: boolean;
  onDrag: (dragToPos: any) => void;
}

const ARModel: React.FC<ARModelProps> = ({
  url,
  position,
  rotation,
  selected,
  onDrag,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dispatch = useDispatch();

  const handleTouch = (state: ViroClickState): void => {
    if (state === 1) {
      setIsDragging(true);
    } else if (state === 3) {
      setIsDragging(false);
      dispatch(setUnsavedChanges(true));
    }
  };

  return (
    <Viro3DObject
      source={{ uri: url }}
      position={[position.x, position.y, position.z]}
      rotation={[rotation.x, rotation.y, rotation.z]}
      type="GLB"
      opacity={selected || isDragging ? 0.5 : 1}
      onClickState={handleTouch}
      onDrag={(dragToPos) => {
        onDrag(dragToPos);
      }}
    />
  );
};

export default ARModel;
