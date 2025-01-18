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

export const rotateAroundY = (
  position: Vector3D,
  angle: number,
  scale: number,
): Vector3D => {
  const angleInRadians = (angle * Math.PI) / 180;
  const cosAngle = Math.cos(angleInRadians);
  const sinAngle = Math.sin(angleInRadians);

  const rotatedX = (position.x * cosAngle - position.z * sinAngle) * scale;
  const rotatedZ = (position.x * sinAngle + position.z * cosAngle) * scale;

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
  scale: number,
): Vector3D => {
  const rotatedPosition = rotateAroundY(localPosition, orientation, scale);

  return {
    x: rotatedPosition.x + translation.x,
    y: rotatedPosition.y + translation.y,
    z: rotatedPosition.z + translation.z,
  };
};

export const calculateLocalPosition = (
  globalPosition: Vector3D,
  translation: Vector3D,
  orientation: number,
  scale: number,
): Vector3D => {
  const translatedPosition = {
    x: globalPosition.x - translation.x,
    y: globalPosition.y - translation.y,
    z: globalPosition.z - translation.z,
  };

  const angleInRadians = (-orientation * Math.PI) / 180;
  const cosAngle = Math.cos(angleInRadians);
  const sinAngle = Math.sin(angleInRadians);

  const localX =
    (translatedPosition.x * cosAngle + translatedPosition.z * sinAngle) / scale;
  const localZ =
    (-translatedPosition.x * sinAngle + translatedPosition.z * cosAngle) /
    scale;

  return {
    x: localX,
    y: translatedPosition.y,
    z: localZ,
  };
};
