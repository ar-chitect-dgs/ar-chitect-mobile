/* eslint-disable prettier/prettier */
// interfaces/LightInterfaces.ts

export interface AmbientLightProps {
  id: number;
  color: string; 
  intensity: number;
}

export interface DirectionalLightProps {
  id: number;
  color: string;
  direction: [number, number, number];
  intensity: number;
  castsShadow: boolean;
}

export interface SpotLightProps {
  id: number;
  color: string;
  position: [number, number, number];
  direction: [number, number, number];
  intensity: number;
  innerAngle: number;
  outerAngle: number;
  attenuationStartDistance: number;
  attenuationEndDistance: number;
  castsShadow: boolean;
}


