import {
  ViroAmbientLight,
  ViroBox,
  ViroDirectionalLight,
  ViroMaterials,
  ViroSpotLight,
} from '@reactvision/react-viro';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ARModel from '../AR/ARModel';
import { type Vector3D } from './Interfaces';
import {
  type LightState,
  type Reducer,
  type ProjectState,
} from '../store/reducers';
import { type AmbientLightProps } from './LightInterfaces';
import { updateSpotLight } from '../store/actions';

const ARScene: React.FC = () => {
  const dispatch = useDispatch();
  const lightConfig: LightState = useSelector(
    (state: Reducer) => state.lightConfig,
  );
  const { ambientLights, directionalLights, spotLights } = lightConfig;

  const projectConfig: ProjectState = useSelector(
    (state: Reducer) => state.projectConfig,
  );
  const { models, translation, orientation } = projectConfig;

  const calculatePosition = (modelPosition: Vector3D): Vector3D => {
    return {
      x: modelPosition.x + translation.x,
      y: modelPosition.y + translation.y,
      z: modelPosition.z + translation.z,
    };
  };

  const calculateRotation = (modelRotation: Vector3D): Vector3D => {
    return {
      x: modelRotation.x,
      y: modelRotation.y + orientation,
      z: modelRotation.z,
    };
  };

  const createMaterials = (): void => {
    if (spotLights) {
      const materials: Record<
        string,
        {
          diffuseColor: string;
        }
      > = {};

      spotLights.forEach((light) => {
        materials[light.color] = {
          diffuseColor: light.color,
        };
      });

      ViroMaterials.createMaterials(materials);
    }
  };

  createMaterials();

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
        <>
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
          <ViroBox
            key={light.id + spotLights.length}
            position={light.position}
            height={0.2}
            length={0.2}
            width={0.2}
            materials={[light.color]}
            onDrag={(dragToPos) => {
              dispatch(
                updateSpotLight(light.id, {
                  ...light,
                  position: [dragToPos[0], dragToPos[1], dragToPos[2]],
                }),
              );
            }}
          />
        </>
      ))}
      {models
        .filter((model) => model.isVisible)
        .map((model, index) => (
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
