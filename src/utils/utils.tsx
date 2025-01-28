import { type Vector3D } from '../AR/Interfaces';

export const calculateRotation = (
  modelRotation: Vector3D,
  orientation: number,
): Vector3D => {
  return {
    x: (modelRotation.x * 180) / Math.PI,
    y: (modelRotation.y * 180) / Math.PI - orientation,
    z: (modelRotation.z * 180) / Math.PI,
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

export const calculateGlobalDirection = (
  localDirection: Vector3D,
  orientation: number,
): Vector3D => {
  const rotatedDirection = rotateAroundY(localDirection, orientation, 1);

  return {
    x: rotatedDirection.x,
    y: rotatedDirection.y,
    z: rotatedDirection.z,
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

export const generateRandomId = (): number =>
  Math.floor(Math.random() * 100000);

export const mapVectorToStringArray = (
  vector: [number, number, number],
): [string, string, string] => {
  const array = vector.map(String);
  return [array[0] || '0', array[1] || '0', array[2] || '0'] as [
    string,
    string,
    string,
  ];
};
