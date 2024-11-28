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
  referenceOrientation: number;
}

const ARScene: React.FC<ARSceneProps> = ({
  models,
  referenceLocation,
  referenceOrientation,
}) => {
  const lightConfig: LightState = useSelector(
    (state: Reducer) => state.lightConfig,
  );
  const { ambientLights, directionalLights, spotLights } = lightConfig;

  const locationConfig: LocationState = useSelector(
    (state: Reducer) => state.locationConfig,
  );
  const { latitude, longitude, orientation } = locationConfig;
  console.log('Rotation: ', orientation);
  console.log('Reference: ', referenceOrientation);
  console.log('Local: ', latitude);

  const calculatePosition = (modelPosition: Vector3D): Vector3D => {
    if (!latitude || !longitude || !referenceLocation) {
      return modelPosition;
    }

    const earthRadius = 6371e3;

    const toRadians = (degrees: number): number =>
      degrees ? (degrees * Math.PI) / 180 : 0;

    const deltaLat = toRadians(latitude - referenceLocation.latitude);
    const deltaLon = toRadians(longitude - referenceLocation.longitude);
    const lat1 = toRadians(referenceLocation.latitude);

    const xOffset = earthRadius * deltaLon * Math.cos(lat1);
    const zOffset = earthRadius * deltaLat;

    if (isNaN(xOffset) || isNaN(zOffset)) {
      console.error('Calculation error: xOffset or zOffset is NaN');
      return modelPosition;
    }

    const angle = toRadians(orientation);
    const rotatedOffset = {
      x: xOffset * Math.cos(angle) - zOffset * Math.sin(angle),
      z: xOffset * Math.sin(angle) + zOffset * Math.cos(angle),
    };

    if (isNaN(rotatedOffset.x) || isNaN(rotatedOffset.z)) {
      console.error('Calculation error: rotatedOffset contains NaN values');
      return modelPosition;
    }

    return {
      x: modelPosition.x + rotatedOffset.x,
      y: modelPosition.y,
      z: modelPosition.z + rotatedOffset.z,
    };
  };

  const calculateRotation = (modelRotation: Vector3D): Vector3D => {
    return {
      x: modelRotation.x,
      y: modelRotation.y + (orientation ?? 0) - referenceOrientation,
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
