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

const testAmbientLights = [{ id: '1', color: 'white' }];
const testDirectionalLights = [
  {
    id: '1',
    color: 'blue',
    direction: { x: 0, y: 1, z: 0 },
    intensity: 1,
    castsShadow: true,
  },
];
const testSpotLights = [
  {
    id: '1',
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
  },
];

const testLocation = {
  latitude: 50.1234,
  longitude: 40.4321,
  orientation: 90,
};

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('@reactvision/react-viro', () => ({
  ViroAmbientLight: jest.fn(),
  ViroDirectionalLight: jest.fn(),
  ViroSpotLight: jest.fn(),
}));

jest.mock('../AR/ARModel', () => jest.fn(() => null));

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
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
    };
    const locationConfig = testLocation;

    (useSelector as unknown as jest.Mock).mockImplementation((callback) =>
      callback({
        lightConfig,
        projectConfig,
        locationConfig,
      }),
    );
  });

  it('Test rendering lights and models basen on config', () => {
    render(<ARScene referenceLocation={null} referenceOrientation={90} />);

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
      expect.objectContaining(ambientLight),
      {},
    );
    expect(ViroDirectionalLight).toHaveBeenCalledWith(
      expect.objectContaining(directionalLight),
      {},
    );
    expect(ViroSpotLight).toHaveBeenCalledWith(
      expect.objectContaining(spotLight),
      {},
    );
    expect(ARModel).toHaveBeenCalledWith(
      expect.objectContaining(testModels[0]),
      {},
    );
  });
});
