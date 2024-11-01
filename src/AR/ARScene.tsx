import {
  ViroAmbientLight,
  ViroDirectionalLight,
  ViroSpotLight,
} from "@reactvision/react-viro";
import React from "react";
import { useSelector } from "react-redux";
import ARModel from "../AR/ARModel";
import { Object3D } from "./Interfaces";
import { LightState, Reducer } from "../store/reducers";
import { AmbientLightProps } from "./LightInterfaces";

interface ARSceneProps {
  models: Object3D[];
}

const ARScene: React.FC<ARSceneProps> = ({ models }) => {
  const lightConfig: LightState = useSelector(
    (state: Reducer) => state.lightConfig
  );
  const { ambientLights, directionalLights, spotLights } = lightConfig;

  return (
    <>
      {ambientLights.map((light: AmbientLightProps) => (
        <ViroAmbientLight key={light.id} color={light.color} />
      ))}
      {directionalLights &&
        directionalLights.map((light) => (
          <ViroDirectionalLight
            key={light.id}
            color={light.color}
            direction={light.direction}
            intensity={light.intensity}
            castsShadow={light.castsShadow}
          />
        ))}
      {spotLights &&
        spotLights.map((light) => (
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
          scale={model.scale}
          rotation={model.rotation}
        />
      ))}
    </>
  );
};

export default ARScene;
