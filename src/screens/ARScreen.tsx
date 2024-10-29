import {
  ViroAmbientLight,
  ViroARScene,
  ViroARSceneNavigator,
  ViroTrackingStateConstants,
} from '@reactvision/react-viro';
import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { type ProjectsData, type Object3D } from '../AR/Interfaces';
import { fetchProjectData, fetchAndLoadModels } from '../AR/DataLoader';
import ARModel from '../AR/ARModel';

const SampleARScene = (): JSX.Element => {
  const [trackingInitialized, setTrackingInitialized] = useState(false);
  const [models, setModels] = useState<Object3D[]>([]);

  useEffect(() => {
    const loadProjectData = async (): Promise<void> => {
      try {
        const projectJson: ProjectsData = await fetchProjectData();
        const sampleProject = projectJson.projects[0];
        const modelsArray = await fetchAndLoadModels(sampleProject);
        setModels(modelsArray);
      } catch (error) {
        console.error(
          'Error while downloading and loading project data',
          error,
        );
      }
    };

    void loadProjectData();
  }, []);

  const onTrackingUpdated = (state: any): void => {
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      setTrackingInitialized(true);
    } else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
      setTrackingInitialized(false);
    }
  };

  const render3DModels = (): JSX.Element[] =>
    models.map((model, index) => (
      <ARModel
        key={index}
        url={model.url}
        position={model.position}
        scale={model.scale}
        rotation={model.rotation}
      />
    ));

  return (
    <ViroARScene onTrackingUpdated={onTrackingUpdated}>
      <ViroAmbientLight color="#FFFFFF" />
      {trackingInitialized && render3DModels()}
    </ViroARScene>
  );
};

export default (): JSX.Element => {
  return (
    <ViroARSceneNavigator
      autofocus={true}
      initialScene={{
        scene: SampleARScene,
      }}
      style={styles.f1}
    />
  );
};

const styles = StyleSheet.create({
  f1: { flex: 1 },
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});
