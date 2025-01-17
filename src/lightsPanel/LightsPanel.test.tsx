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

jest.mock('../components/ListItemTile', () => jest.fn());

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
    const settingsConfig = {
      stepSize: 1,
      angleStepSize: 1,
    };
    (useSelector as unknown as jest.Mock).mockImplementation((callback) =>
      callback({
        lightConfig,
        settingsConfig,
      }),
    );
  });

  it('shows Lights lists', () => {
    const { queryAllByText } = render(<LightsPanel snapPoint="10%" />);

    const ambientList = queryAllByText(ambientLightList);
    expect(ambientList.length).toBeGreaterThanOrEqual(1);

    const directionalList = queryAllByText(directionalLightList);
    expect(directionalList.length).toBeGreaterThanOrEqual(1);

    const spotList = queryAllByText(spotLightList);
    expect(spotList.length).toBeGreaterThanOrEqual(1);
  });

  it('shows Ambient light modal after "Add ambient light" click', () => {
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

  it('shows Directional light after "Add directional light" click', () => {
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

  it('shows Spot light modal after "Add spot light" click', () => {
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
