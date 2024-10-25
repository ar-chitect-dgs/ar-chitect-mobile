import React from "react";
import { Viro3DObject } from "@reactvision/react-viro";

interface ModelProps {
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

const ARModel: React.FC<ModelProps> = ({ url, position, rotation, scale }) => {
  return (
    <Viro3DObject
      source={{ uri: url }}
      position={position}
      rotation={rotation}
      scale={scale}
      type="GLB"
    />
  );
};

export default ARModel;
