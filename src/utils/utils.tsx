import { type Vector3D } from '../AR/Interfaces';

export const shiftToOrigin = (
  objectPosition: Vector3D,
  origin: Vector3D,
): Vector3D => {
  return {
    x: objectPosition.x - origin.x,
    y: objectPosition.y,
    z: objectPosition.z - origin.z,
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

export const shiftBackToOriginalPosition = (
  rotatedPosition: Vector3D,
  origin: Vector3D,
): Vector3D => {
  console.log(rotatedPosition.y);
  console.log(origin.y);
  return {
    x: rotatedPosition.x + origin.x,
    y: rotatedPosition.y + origin.y,
    z: rotatedPosition.z + origin.z,
  };
};

export const rotateObjectAroundOrigin = (
  objectPosition: Vector3D,
  origin: Vector3D,
  rotationAngle: number,
): Vector3D => {
  const shiftedPosition = shiftToOrigin(objectPosition, origin);

  const rotatedPosition = rotateAroundY(shiftedPosition, rotationAngle);

  return shiftBackToOriginalPosition(rotatedPosition, origin);
};
