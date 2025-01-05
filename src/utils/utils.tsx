import { type Vector3D } from '../AR/Interfaces';

export const calculateRotation = (
  modelRotation: Vector3D,
  orientation: number,
): Vector3D => {
  return {
    x: modelRotation.x,
    y: modelRotation.y - orientation,
    z: modelRotation.z,
  };
};

export const rotateAroundY = (position: Vector3D, angle: number): Vector3D => {
  const angleInRadians = (angle * Math.PI) / 180;
  const cosAngle = Math.cos(angleInRadians);
  const sinAngle = Math.sin(angleInRadians);

  const rotatedX = position.x * cosAngle - position.z * sinAngle;
  const rotatedZ = position.x * sinAngle + position.z * cosAngle;

  return {
    x: rotatedX,
    y: position.y,
    z: rotatedZ,
  };
};

export const calculateGlobalPosition = (
  localPosition: Vector3D,
  translation: Vector3D,
  orientation: number,
): Vector3D => {
  const rotatedPosition = rotateAroundY(localPosition, orientation);

  return {
    x: rotatedPosition.x + translation.x,
    y: rotatedPosition.y + translation.y,
    z: rotatedPosition.z + translation.z,
  };
};
