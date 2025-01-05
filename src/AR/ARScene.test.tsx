import React from 'react';
import { render } from '@testing-library/react-native';
import ARScene from './ARScene';
import { useSelector } from 'react-redux';
import {
  ViroAmbientLight,
  ViroDirectionalLight,
  ViroSpotLight,
} from '@reactvision/react-viro';
import ARModel from '../AR/ARModel';

const testAmbientLights = [{ id: '1', name: 'Ambient light', color: 'white' }];
const testDirectionalLights = [
  {
    id: '1',
    color: 'blue',
    name: 'Directional light',
    direction: { x: 0, y: 1, z: 0 },
    intensity: 1,
    castsShadow: true,
  },
];
const testSpotLights = [
  {
    id: '1',
    name: 'Spot light',
    color: 'red',
    position: { x: 0, y: 1, z: 0 },
    direction: { x: 0, y: -1, z: 0 },
    intensity: 1,
    innerAngle: 10,
    outerAngle: 45,
    attenuationStartDistance: 1,
    attenuationEndDistance: 5,
    castsShadow: true,
  },
];

const testModels = [
  {
    url: 'model1.glb',
    position: { x: 1, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    isVisible: true,
  },
];

const testTranslation = { x: 0, y: 0, z: 0 };
const testOrientation: number = 0;

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('@reactvision/react-viro', () => ({
  __esModule: true,
  ViroBox: jest.fn(),
  ViroAmbientLight: jest.fn(),
  ViroDirectionalLight: jest.fn(),
  ViroSpotLight: jest.fn(),
  ViroMaterials: {
    createMaterials: jest.fn(),
  },
}));

jest.mock('../AR/ARModel', () => jest.fn(() => null));

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

describe('ARScene', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const lightConfig = {
      ambientLights: testAmbientLights,
      directionalLights: testDirectionalLights,
      spotLights: testSpotLights,
    };
    const projectConfig = {
      models: testModels,
      translation: testTranslation,
      orientation: testOrientation,
    };

    (useSelector as unknown as jest.Mock).mockImplementation((callback) =>
      callback({
        lightConfig,
        projectConfig,
      }),
    );
  });

  it('Test rendering lights and models basen on config', () => {
    render(<ARScene />);

    function omitId(light: {
      [x: string]: any;
      id: any;
      color?: string;
      direction?:
        | { x: number; y: number; z: number }
        | { x: number; y: number; z: number };
      intensity?: number;
      castsShadow?: boolean;
      position?: { x: number; y: number; z: number };
      innerAngle?: number;
      outerAngle?: number;
      attenuationStartDistance?: number;
      attenuationEndDistance?: number;
    }): any {
      const { id, ...rest } = light;
      return rest;
    }

    const ambientLight = omitId(testAmbientLights[0]);
    const directionalLight = omitId(testDirectionalLights[0]);
    const spotLight = omitId(testSpotLights[0]);

    expect(ViroAmbientLight).toHaveBeenCalledWith(
      expect.objectContaining({ color: ambientLight.color }),
      {},
    );
    expect(ViroDirectionalLight).toHaveBeenCalledWith(
      expect.objectContaining({ color: directionalLight.color }),
      {},
    );
    expect(ViroSpotLight).toHaveBeenCalledWith(
      expect.objectContaining({ color: spotLight.color }),
      {},
    );
    expect(ARModel).toHaveBeenCalledWith(
      expect.objectContaining({
        url: testModels[0].url,
        position: {
          x: testModels[0].position.x + testTranslation.x,
          y: testModels[0].position.y + testTranslation.y,
          z: testModels[0].position.z + testTranslation.z,
        },
        rotation: {
          x: testModels[0].rotation.x,
          y: testModels[0].rotation.y + testOrientation,
          z: testModels[0].rotation.z,
        },
      }),
      {},
    );
  });
});
