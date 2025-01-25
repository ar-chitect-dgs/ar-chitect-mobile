import {
  Viro3DObject,
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
  settingsState,
} from '../store/reducers';
import { type AmbientLightProps } from './LightInterfaces';
import { updateModel, updateSpotLight } from '../store/actions';
import {
  calculateGlobalDirection,
  calculateGlobalPosition,
  calculateLocalPosition,
  calculateRotation,
} from '../utils/utils';

const sphereUrl =
  'https://firebasestorage.googleapis.com/v0/b/ar-chitect-a0b25.appspot.com/o/models%2Fsphere.glb?alt=media&token=fcf089d2-01ce-4703-808f-e68d36977d1f';

const ARScene: React.FC = () => {
  const dispatch = useDispatch();
  const { ambientLights, directionalLights, spotLights }: LightState =
    useSelector((state: Reducer) => state.lightConfig);

  const { project, models, translation, orientation, scale }: ProjectState =
    useSelector((state: Reducer) => state.projectConfig);

  const { cornersVisible }: settingsState = useSelector(
    (state: Reducer) => state.settingsConfig,
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
        const newDirection = calculateGlobalDirection(
          {
            x: light.direction[0],
            y: light.direction[1],
            z: light.direction[2],
          },
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
          scale,
        );
        const newDirection = calculateGlobalDirection(
          {
            x: light.direction[0],
            y: light.direction[1],
            z: light.direction[2],
          },
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
                    scale,
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
      {cornersVisible &&
        project?.corners.map((corner) => {
          const newPosition = calculateGlobalPosition(
            { x: corner.x, y: 0, z: corner.y },
            translation,
            orientation,
            scale,
          );
          return (
            <Viro3DObject
              source={{ uri: sphereUrl }}
              position={[newPosition.x, newPosition.y, newPosition.z]}
              scale={[0.5, 0.5, 0.5]}
              type="GLB"
            />
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
              scale,
            )}
            rotation={calculateRotation(model.rotation, orientation)}
            scale={scale}
            selected={model.isSelected}
            onSelect={(isSelected: boolean) => {
              dispatch(
                updateModel(Number(key), {
                  ...model,
                  isSelected,
                }),
              );
            }}
            onDrag={(dragToPos: number[], height: number) => {
              dispatch(
                updateModel(Number(key), {
                  ...model,
                  position: calculateLocalPosition(
                    {
                      x: dragToPos[0],
                      y: dragToPos[1] - scale - height,
                      z: dragToPos[2],
                    },
                    translation,
                    orientation,
                    scale,
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
