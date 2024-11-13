import {
  ViroAmbientLight,
  ViroDirectionalLight,
  ViroSpotLight,
} from '@reactvision/react-viro';
import React from 'react';
import { useSelector } from 'react-redux';
import ARModel from '../AR/ARModel';
import { type Object3D } from './Interfaces';
import {
  LocationState,
  type LightState,
  type Reducer,
} from '../store/reducers';
import { type AmbientLightProps } from './LightInterfaces';

interface ARSceneProps {
  models: Object3D[];
}

const ARScene: React.FC<ARSceneProps> = ({ models }) => {
  const lightConfig: LightState = useSelector(
    (state: Reducer) => state.lightConfig,
  );
  const { ambientLights, directionalLights, spotLights } = lightConfig;

  const locationConfig: LocationState = useSelector(
    (state: Reducer) => state.locationConfig,
  );
  const { latitude, longitude } = locationConfig;
  console.log(latitude, longitude);

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
          position={model.position}
          rotation={model.rotation}
        />
      ))}
    </>
  );
};

export default ARScene;
