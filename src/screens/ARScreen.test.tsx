import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { useDispatch, useSelector } from 'react-redux';
import ARScreen from './ARScreen';
import { fetchObjectsWithModelUrls, fetchProjects } from '../api/projectsApi';
import { setModels, setProject } from '../store/actions';
import { ViroARSceneNavigator } from '@reactvision/react-viro';
import { useNavigation, useRoute } from '@react-navigation/native';

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

const testProjects = {
  mockProjectId: testProject,
};

const testModels = [
  { id: '1', url: 'model1.glb', position: { x: 0, y: 0, z: 0 } },
];

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useRoute: jest.fn(),
  useNavigation: jest.fn(() => ({
    addListener: jest.fn((_, callback) => {
      callback()
    }),
  })),
}));

jest.mock('@reactvision/react-viro', () => ({
  ViroARScene: jest.fn(() => <div>Viro AR Scene</div>),
  ViroARSceneNavigator: jest.fn(() => <div>Viro AR Scene Navigator</div>),
}));

jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: jest.fn(({ children }) => <>{children}</>),
}));

jest.mock('../api/projectsApi', () => ({
  fetchProjects: jest.fn(async () => await Promise.resolve(testProjects)),
  fetchObjectsWithModelUrls: jest.fn(
    async () => await Promise.resolve(testModels),
  ),
}));

jest.mock('../store/actions', () => ({
  setModels: jest.fn(),
  setProject: jest.fn(),
}));

jest.mock('@react-native-firebase/auth', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    currentUser: { uid: 'mockUserId' },
  })),
}));

jest.mock('../AR/BottomPanel', () => jest.fn());

describe('ARScreen', () => {
  let dispatchMock: jest.Mock;

  beforeEach(() => {
    dispatchMock = jest.fn();
    (useDispatch as unknown as jest.Mock).mockReturnValue(dispatchMock);

    const settingsConfig = {
      saveLights: true,
    };

    (useSelector as unknown as jest.Mock).mockImplementation((callback) =>
      callback({
        settingsConfig,
      }),
    );

    (useRoute as unknown as jest.Mock).mockReturnValue({
      params: { project: testProject },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders ActivityIndicator while loading', async () => {
    const { getByTestId } = render(<ARScreen />);
    await waitFor(() => {
      expect(getByTestId('activity-indicator')).toBeTruthy();
    });
  });

  it('dispatches actions after data loading and displays ViroARSceneNavigator', async () => {
    (fetchObjectsWithModelUrls as jest.Mock).mockResolvedValue(testModels);

    render(<ARScreen />);

    await waitFor(() => {
      expect(setProject).toHaveBeenCalledWith(
        expect.objectContaining({ id: testProject.id, project: testProject }),
      );
      expect(setModels).toHaveBeenCalledWith(
        expect.objectContaining(testModels),
      );
      expect(ViroARSceneNavigator).toHaveBeenCalledWith(
        expect.objectContaining({}),
        {},
      );
    });
  });

  it('handles fetchProjects error gracefully', async () => {
    (fetchProjects as jest.Mock).mockRejectedValue(new Error('Network Error'));

    const { getByTestId } = render(<ARScreen />);

    await waitFor(() => {
      expect(getByTestId('activity-indicator')).toBeTruthy();
    });
  });
});
