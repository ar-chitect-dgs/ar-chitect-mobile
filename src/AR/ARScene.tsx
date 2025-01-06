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
import {
  type LightState,
  type Reducer,
  type ProjectState,
} from '../store/reducers';
import { type AmbientLightProps } from './LightInterfaces';
import { updateModel, updateSpotLight } from '../store/actions';
import {
  calculateGlobalPosition,
  calculateLocalPosition,
  calculateRotation,
} from '../utils/utils';

const ARScene: React.FC = () => {
  const dispatch = useDispatch();
  const { ambientLights, directionalLights, spotLights }: LightState =
    useSelector((state: Reducer) => state.lightConfig);

  const { models, translation, orientation }: ProjectState = useSelector(
    (state: Reducer) => state.projectConfig,
  );

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
      {directionalLights?.map((light) => {
        const newDirection = calculateGlobalPosition(
          {
            x: light.direction[0],
            y: light.direction[1],
            z: light.direction[2],
          },
          translation,
          orientation,
        );
        return (
          <ViroDirectionalLight
            key={light.id}
            color={light.color}
            direction={[newDirection.x, newDirection.y, newDirection.z]}
            intensity={light.intensity}
            castsShadow={light.castsShadow}
          />
        );
      })}
      {spotLights?.map((light) => {
        const newPosition = calculateGlobalPosition(
          { x: light.position[0], y: light.position[1], z: light.position[2] },
          translation,
          orientation,
        );
        const newDirection = calculateGlobalPosition(
          {
            x: light.direction[0],
            y: light.direction[1],
            z: light.direction[2],
          },
          translation,
          orientation,
        );
        return (
          <>
            <ViroSpotLight
              key={light.id}
              color={light.color}
              position={[newPosition.x, newPosition.y, newPosition.z]}
              direction={[newDirection.x, newDirection.y, newDirection.z]}
              intensity={light.intensity}
              innerAngle={light.innerAngle}
              outerAngle={light.outerAngle}
              attenuationStartDistance={light.attenuationStartDistance}
              attenuationEndDistance={light.attenuationEndDistance}
              castsShadow={light.castsShadow}
            />
            {light.isVisible && (
              <ViroBox
                key={light.id + spotLights.length}
                position={[newPosition.x, newPosition.y, newPosition.z]}
                height={0.2}
                length={0.2}
                width={0.2}
                materials={[light.color]}
                onDrag={(dragToPos) => {
                  const dragPosition = calculateLocalPosition(
                    { x: dragToPos[0], y: dragToPos[1], z: dragToPos[2] },
                    translation,
                    orientation,
                  );
                  dispatch(
                    updateSpotLight(light.id, {
                      ...light,
                      position: [
                        dragPosition.x,
                        dragPosition.y,
                        dragPosition.z,
                      ],
                    }),
                  );
                }}
              />
            )}
          </>
        );
      })}
      {Object.entries(models)
        .filter(([_, model]) => model.isVisible)
        .map(([key, model]) => (
          <ARModel
            key={key}
            url={model.url}
            position={calculateGlobalPosition(
              model.position,
              translation,
              orientation,
            )}
            rotation={calculateRotation(model.rotation, orientation)}
            selected={model.isSelected}
            onDrag={(dragToPos: number[]) => {
              dispatch(
                updateModel(Number(key), {
                  ...model,
                  position: calculateLocalPosition(
                    { x: dragToPos[0], y: dragToPos[1], z: dragToPos[2] },
                    translation,
                    orientation,
                  ),
                }),
              );
            }}
          />
        ))}
    </>
  );
};

export default ARScene;
