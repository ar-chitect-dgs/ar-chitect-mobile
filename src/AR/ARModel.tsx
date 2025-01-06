import React, { useState } from 'react';
import { Viro3DObject } from '@reactvision/react-viro';
import { type Vector3D } from './Interfaces';
import { ViroClickState } from '@reactvision/react-viro/dist/components/Types/ViroEvents';

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

  const handleTouch = (
    state: ViroClickState,
    touchPos: [number, number, number],
  ): void => {
    console.log('touch');
    if (state === 1) {
      setIsDragging(true);
      console.log('yes');
    } else if (state === 3) {
      setIsDragging(false);
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
