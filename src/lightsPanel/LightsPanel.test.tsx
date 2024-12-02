import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { useSelector } from 'react-redux';
import LightsPanel from './LightsPanel';
import AmbientLightModal from './AmbientLightModal';
import DirecionalLightModal from './DirectionalLightModal';
import SpotLightModal from './SpotLightModal';

const ambientLightModal = 'Ambient light modal';
const directionalLightModal = 'Directional light modal';
const spotLightModal = 'Spot light modal';

const ambientLightList = 'Ambient Lights';
const directionalLightList = 'Directional Lights';
const spotLightList = 'Spot Lights';

const testAmbientLights = [
  { id: 1, color: '#FFFFFF', intensity: 500 },
  { id: 2, color: '#FF0000', intensity: 1000 },
];
const testDirectionalLights = [
  {
    id: 3,
    color: '#00FF00',
    intensity: 1000,
    direction: [0, -1, 0],
    castsShadow: true,
  },
];
const testSpotLights = [
  {
    id: 4,
    color: '#0000FF',
    intensity: 800,
    position: [1, 1, 1],
    direction: [0, -1, 0],
    innerAngle: 30,
    outerAngle: 45,
    castsShadow: false,
  },
];

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('../store/actions', () => ({
  removeAmbientLight: jest.fn(),
  removeDirectionalLight: jest.fn(),
  removeSpotLight: jest.fn(),
}));

jest.mock('./AmbientLightModal', () =>
  jest.fn(({ isVisible }) =>
    isVisible ? <div>{ambientLightModal}</div> : null,
  ),
);

jest.mock('./DirectionalLightModal', () =>
  jest.fn(({ isVisible }) =>
    isVisible ? <div>{directionalLightModal}</div> : null,
  ),
);

jest.mock('./SpotLightModal', () =>
  jest.fn(({ isVisible }) => (isVisible ? <div>{spotLightModal}</div> : null)),
);

describe('LightsPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const lightConfig = {
      ambientLights: testAmbientLights,
      directionalLights: testDirectionalLights,
      spotLights: testSpotLights,
    };

    (useSelector as unknown as jest.Mock).mockImplementation((callback) =>
      callback({
        lightConfig,
      }),
    );
  });

  it('Lights lists are present', () => {
    const { getByText } = render(<LightsPanel snapPoint="10%" />);

    expect(getByText(ambientLightList)).toBeTruthy();
    expect(getByText(directionalLightList)).toBeTruthy();
    expect(getByText(spotLightList)).toBeTruthy();
  });

  it('Ambient light modal is present after "Add ambient light" click', () => {
    const { getByText } = render(<LightsPanel snapPoint="10%" />);

    expect(AmbientLightModal).toHaveBeenCalledWith(
      expect.objectContaining({
        isVisible: false,
        isEditing: false,
      }),
      {},
    );
    fireEvent.press(getByText('Add Ambient Light'));
    expect(AmbientLightModal).toHaveBeenCalledWith(
      expect.objectContaining({
        isVisible: true,
        isEditing: false,
      }),
      {},
    );
  });

  it('Directional light is present after "Add directional light" click', () => {
    const { getByText } = render(<LightsPanel snapPoint="10%" />);

    expect(AmbientLightModal).toHaveBeenCalledWith(
      expect.objectContaining({
        isVisible: false,
        isEditing: false,
      }),
      {},
    );
    fireEvent.press(getByText('Add Directional Light'));
    expect(DirecionalLightModal).toHaveBeenCalledWith(
      expect.objectContaining({
        isVisible: true,
        isEditing: false,
      }),
      {},
    );
  });

  it('Spot light modal is present after "Add spot light" click', () => {
    const { getByText } = render(<LightsPanel snapPoint="10%" />);

    expect(SpotLightModal).toHaveBeenCalledWith(
      expect.objectContaining({
        isVisible: false,
        isEditing: false,
      }),
      {},
    );
    fireEvent.press(getByText('Add Spot Light'));
    expect(SpotLightModal).toHaveBeenCalledWith(
      expect.objectContaining({
        isVisible: true,
        isEditing: false,
      }),
      {},
    );
  });
});
