import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { useSelector } from 'react-redux';
import ScenePanel from './ScenePanel';
import SceneEditor from './SceneEditor';
import { type Vector3D } from '../../AR/Interfaces';

const testTranslation: Vector3D = {
  x: 0,
  y: 0,
  z: 0,
};

const testOrientation: number = 0;

const testScale: number = 1;

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('./SceneEditor', () => jest.fn());

describe('ScenePanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const projectConfig = {
      translation: testTranslation,
      orientation: testOrientation,
      scale: testScale,
    };
    const settingsConfig = {
      stepSize: 1,
    };

    (useSelector as unknown as jest.Mock).mockImplementation((callback) =>
      callback({
        projectConfig,
        settingsConfig,
      }),
    );
  });
  it('should show the SceneEditor modal when the button is clicked', () => {
    const { getByText } = render(<ScenePanel snapPoint="bottom" />);

    expect(SceneEditor).toHaveBeenCalledWith(
      expect.objectContaining({
        isVisible: false,
      }),
      {},
    );
    fireEvent.press(getByText('panels.editScene'));
    expect(SceneEditor).toHaveBeenCalledWith(
      expect.objectContaining({
        isVisible: true,
      }),
      {},
    );
  });
});
