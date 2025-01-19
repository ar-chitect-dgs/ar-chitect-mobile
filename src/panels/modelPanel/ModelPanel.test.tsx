import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { useSelector, useDispatch } from 'react-redux';
import ModelPanel from './ModelPanel';
import ModelModal from './ModelModal';

const testProject = {
  id: 'mockProjectId',
  projectName: 'Test Project',
  corners: [{ x: 0, y: 0, z: 0 }],
  objects: [],
  orientation: 0,
  thumb: '',
  createdAt: '2023-12-01T00:00:00.000Z',
  modifiedAt: '2023-12-02T00:00:00.000Z',
};

const testModels = [
  {
    name: 'model1',
    modelName: 'model1',
    url: 'model1.glb',
    position: { x: 1, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
  },
  {
    name: 'model2',
    modelName: 'model2',
    url: 'model2.glb',
    position: { x: 1, y: 1, z: 1 },
    rotation: { x: 2, y: 2, z: 2 },
  },
];

const testUser = {
  id: '123',
  name: 'John Doe',
  email: 'john.doe@example.com',
};

jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn(() => testUser),
}));

jest.mock('../../api/projectsApi', () => ({
  saveProject: jest.fn(),
}));

jest.mock('react-native-vector-icons/FontAwesome', () => jest.fn());

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('./ModelModal', () => jest.fn());

describe('ModelPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const projectConfig = {
      project: testProject,
      models: testModels,
    };
    const settingsConfig = {
      autoSave: false,
    };

    const mockDispatch = jest.fn();

    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);

    (useSelector as unknown as jest.Mock).mockImplementation((callback) =>
      callback({
        projectConfig,
        settingsConfig,
      }),
    );
  });

  it('Models are present', () => {
    const { getByText } = render(<ModelPanel snapPoint="20%" />);

    testModels.map((model) => {
      const modelTextRegex = new RegExp(`${model.modelName}.*`);
      expect(getByText(modelTextRegex)).toBeTruthy();
      return {};
    });
  });

  it('Model modal is present after click on any model', () => {
    const { getByText } = render(<ModelPanel snapPoint="10%" />);

    const modelTextRegex = new RegExp(`${testModels[0].modelName}.*`);

    fireEvent.press(getByText(modelTextRegex));
    expect(ModelModal).toHaveBeenCalledWith(
      expect.objectContaining({
        isVisible: true,
      }),
      {},
    );
  });
});
