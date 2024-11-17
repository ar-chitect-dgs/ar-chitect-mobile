import {
  ViroAmbientLight,
  ViroDirectionalLight,
  ViroSpotLight,
} from '@reactvision/react-viro';
import React from 'react';
import { useSelector } from 'react-redux';
import ARModel from '../AR/ARModel';
import { type Vector3D, type Object3D } from './Interfaces';
import {
  type LocationState,
  type LightState,
  type Reducer,
} from '../store/reducers';
import { type AmbientLightProps } from './LightInterfaces';
import { type Location } from './ProjectARScene';

interface ARSceneProps {
  models: Object3D[];
  referenceLocation: Location;
}

const ARScene: React.FC<ARSceneProps> = ({ models, referenceLocation }) => {
  const lightConfig: LightState = useSelector(
    (state: Reducer) => state.lightConfig,
  );
  const { ambientLights, directionalLights, spotLights } = lightConfig;

  const locationConfig: LocationState = useSelector(
    (state: Reducer) => state.locationConfig,
  );
  const { latitude, longitude, orientation } = locationConfig;

  const rotatePosition = (
    x: number,
    z: number,
    angle: number,
  ): { x: number; z: number } => {
    const radians = (angle * Math.PI) / 180;
    const rotatedX = x * Math.cos(radians) - z * Math.sin(radians);
    const rotatedZ = x * Math.sin(radians) + z * Math.cos(radians);
    return { x: rotatedX, z: rotatedZ };
  };

  const calculatePosition = (modelPosition: Vector3D): Vector3D => {
    if (!latitude || !longitude || !referenceLocation) {
      console.log('null');
      return modelPosition;
    }
    const deltaLatitude = latitude - referenceLocation.latitude;
    const deltaLongitude = longitude - referenceLocation.longitude;

    const metersPerDegreeLat = 111000;
    const metersPerDegreeLong =
      111000 *
      Math.cos((((latitude + referenceLocation.latitude) / 2) * Math.PI) / 180);

    const offsetX = deltaLongitude * metersPerDegreeLong;
    const offsetZ = deltaLatitude * metersPerDegreeLat;

    const rotatedOffset = rotatePosition(offsetX, offsetZ, orientation ?? 0);

    return {
      x: modelPosition.x + rotatedOffset.x,
      y: modelPosition.y,
      z: modelPosition.z + rotatedOffset.z,
    };
  };

  const calculateRotation = (modelRotation: Vector3D): Vector3D => {
    return {
      x: modelRotation.x,
      y: modelRotation.y + orientation,
      z: modelRotation.z,
    };
  };

  return (
    <>
      {ambientLights.map((light: AmbientLightProps) => (
        <ViroAmbientLight key={light.id} color={light.color} />
      ))}
      {directionalLights?.map((light) => (
        <ViroDirectionalLight
          key={light.id}
          color={light.color}
          direction={light.direction}
          intensity={light.intensity}
          castsShadow={light.castsShadow}
        />
      ))}
      {spotLights?.map((light) => (
        <ViroSpotLight
          key={light.id}
          color={light.color}
          position={light.position}
          direction={light.direction}
          intensity={light.intensity}
          innerAngle={light.innerAngle}
          outerAngle={light.outerAngle}
          attenuationStartDistance={light.attenuationStartDistance}
          attenuationEndDistance={light.attenuationEndDistance}
          castsShadow={light.castsShadow}
        />
      ))}
      {models.map((model, index) => (
        <ARModel
          key={index}
          url={model.url}
          position={calculatePosition(model.position)}
          rotation={calculateRotation(model.rotation)}
        />
      ))}
    </>
  );
};

export default ARScene;
