import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { useSelector } from 'react-redux';
import ModelPanel from './ModelPanel';
import ListItemTile from '../components/ListItemTile';
import ModelModal from './ModelModal';

const testProject = {
  id: 'mockProjectId',
  projectName: 'Test Project',
  corners: [{ x: 0, y: 0, z: 0 }],
  objects: [],
  isFirstTime: false,
  latitude: 0,
  longitude: 0,
  orientation: 0,
  thumb: '',
  createdAt: '2023-12-01T00:00:00.000Z',
  modifiedAt: '2023-12-02T00:00:00.000Z',
};

const testModels = [
  {
    name: 'model1',
    url: 'model1.glb',
    position: { x: 1, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
  },
  {
    name: 'model2',
    url: 'model2.glb',
    position: { x: 1, y: 1, z: 1 },
    rotation: { x: 2, y: 2, z: 2 },
  },
];

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('./ModelModal', () => jest.fn());

describe('ModelPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const projectConfig = {
      project: testProject,
      models: testModels,
    };

    (useSelector as unknown as jest.Mock).mockImplementation((callback) =>
      callback({
        projectConfig,
      }),
    );
  });

  it('Models are present', () => {
    const { getByText } = render(<ModelPanel snapPoint="10%" />);

    testModels.map((model) => {
      expect(getByText(model.name)).toBeTruthy();
    });
  });

  it('Model modal is present after click on any model', () => {
    const { getByText } = render(<ModelPanel snapPoint="10%" />);

    fireEvent.press(getByText(testModels[0].name));
    expect(ModelModal).toHaveBeenCalledWith(
      expect.objectContaining({
        isVisible: true,
      }),
      {},
    );
  });
});
