import React from 'react';
import { Viro3DObject } from '@reactvision/react-viro';

interface ARModelProps {
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
}

const ARModel: React.FC<ARModelProps> = ({ url, position, rotation }) => {
  return (
    <Viro3DObject
      source={{ uri: url }}
      position={position}
      rotation={rotation}
      type="GLB"
    />
  );
};

export default ARModel;
