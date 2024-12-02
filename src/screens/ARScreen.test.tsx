import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import { useDispatch } from 'react-redux';
import ARScreen from './ARScreen';
import FirstARScene from '../AR/FirstARScene';
import ProjectARScene from '../AR/ProjectARScene';
import { fetchProjects } from '../api/projectsApi';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('react-native-gesture-handler', () => jest.fn(() => null));
jest.mock('../AR/FirstARScene', () => jest.fn(() => null));
jest.mock('../AR/ProjectARScene', () => jest.fn(() => null));
jest.mock('../api/projectsApi', () => ({
  fetchProjects: jest.fn(() =>
    Promise.resolve({
      mockProjectId: {
        id: 'mockProjectId',
        projectName: 'Test Project',
        corners: [{ x: 0, y: 0, z: 0 }],
        objects: [],
        isFirstTime: true,
        latitude: 0,
        longitude: 0,
        orientation: 0,
        thumb: '',
        createdAt: '2023-12-01T00:00:00.000Z',
        modifiedAt: '2023-12-02T00:00:00.000Z',
      },
    }),
  ),
}));

jest.mock('@react-native-firebase/auth', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    currentUser: { uid: 'mockUserId' },
  })),
}));

describe('ARScreen', () => {
  let dispatchMock: jest.Mock;

  beforeEach(() => {
    dispatchMock = jest.fn();
    (useDispatch as unknown as jest.Mock).mockReturnValue(dispatchMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders ActivityIndicator while loading', async () => {
    (fetchProjects as jest.Mock).mockResolvedValueOnce(undefined);
    const { getByTestId } = render(<ARScreen />);
    expect(getByTestId('ActivityIndicator')).toBeTruthy();
  });

  it('renders FirstARScene if isFirstTime is true', async () => {
    (fetchProjects as jest.Mock).mockResolvedValue({
      mockProjectId: {
        id: 'mockProjectId',
        projectName: 'Test Project',
        corners: [{ x: 0, y: 0, z: 0 }],
        objects: [],
        isFirstTime: true,
        latitude: 0,
        longitude: 0,
        orientation: 0,
        thumb: '',
        createdAt: '2023-12-01T00:00:00.000Z',
        modifiedAt: '2023-12-02T00:00:00.000Z',
      },
    });
    render(<ARScreen />);

    await waitFor(() => {
      expect(FirstARScene).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'mockProjectId',
          onComplete: expect.any(Function),
        }),
        {},
      );
    });
  });

  it('renders ProjectARScene if isFirstTime is false', async () => {
    (fetchProjects as jest.Mock).mockResolvedValue({
      mockProjectId: {
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
      },
    });
    render(<ARScreen />);

    await waitFor(() => {
      expect(ProjectARScene).toHaveBeenCalled();
    });
  });

  it('handles fetchProjects error gracefully', async () => {
    (fetchProjects as jest.Mock).mockRejectedValue(new Error('Network Error'));

    const { getByTestId } = render(<ARScreen />);

    await waitFor(() => {
      expect(getByTestId('ActivityIndicator')).toBeTruthy();
    });
  });
});
