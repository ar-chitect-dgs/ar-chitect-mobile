import React from 'react';
import { Viro3DObject } from '@reactvision/react-viro';
import { type Vector3D } from './Interfaces';

const HEIGHT = 2;

interface ARModelProps {
  url: string;
  position: Vector3D;
  rotation: Vector3D;
}

const ARModel: React.FC<ARModelProps> = ({ url, position, rotation }) => {
  return (
    <Viro3DObject
      source={{ uri: url }}
      position={[position.x, position.y - HEIGHT, position.z]}
      rotation={[rotation.x, rotation.y, rotation.z]}
      type="GLB"
    />
  );
};

export default ARModel;
