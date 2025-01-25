export interface AmbientLightProps {
  id: number;
  name: string;
  color: string;
  intensity: number;
  isVisible: boolean;
}

export interface DirectionalLightProps {
  id: number;
  name: string;
  color: string;
  direction: [number, number, number];
  intensity: number;
  castsShadow: boolean;
  isVisible: boolean;
}

export interface SpotLightProps {
  id: number;
  name: string;
  color: string;
  position: [number, number, number];
  direction: [number, number, number];
  intensity: number;
  innerAngle: number;
  outerAngle: number;
  attenuationStartDistance: number;
  attenuationEndDistance: number;
  castsShadow: boolean;
  isVisible: boolean;
}
