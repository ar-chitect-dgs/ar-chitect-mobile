import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Alert, View, ActivityIndicator } from 'react-native';
import { ViroARScene, ViroARSceneNavigator } from '@reactvision/react-viro';
import { SensorTypes, setUpdateIntervalForType } from 'react-native-sensors';
import { fetchObjectsWithModelUrls } from '../api/projectsApi';
import ARScene from './ARScene';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { setLocation, setModels, setOrientation } from '../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCurrentLocation,
  getCurrentOrientation,
  requestLocationPermission,
} from '../utils//LocationUtils';
import { type Reducer } from '../store/reducers';
import BottomPanel from './BottomPanel';

export type Location = {
  latitude: number;
  longitude: number;
} | null;

const ProjectARScene: React.FC = () => {
  const dispatch = useDispatch();
  const { project, models } = useSelector(
    (state: Reducer) => state.projectConfig,
  );

  if (project == null) {
    return <ViroARScene></ViroARScene>;
  }

  const [isLoading, setIsLoading] = useState(true);

  const referenceLocation = {
    latitude: project.latitude,
    longitude: project.longitude,
  };
  const referenceOrientation = project.orientation;

  useEffect(() => {
    const initializeData = async (): Promise<void> => {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Location access is required.');
        return;
      }

      await Promise.all([
        getCurrentLocation({
          setLocation: (location) => dispatch(setLocation(location)),
          setStep: () => {},
        }),
        getCurrentOrientation({
          setOrientation: (orientation) =>
            dispatch(setOrientation(orientation)),
          setStep: () => {},
        }),
      ]);
    };

    void initializeData();
    setUpdateIntervalForType(SensorTypes.magnetometer, 100);
  }, [dispatch]);

  useEffect(() => {
    const loadModels = async (): Promise<void> => {
      try {
        const modelsArray = await fetchObjectsWithModelUrls(project);
        dispatch(setModels(modelsArray));
      } catch (error) {
        console.error(
          'Error while downloading and loading project data',
          error,
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadModels();
  }, [project]);

  const SceneWithModels = useCallback(() => {
    return (
      <ViroARScene>
        <ARScene
          models={models}
          referenceLocation={referenceLocation}
          referenceOrientation={referenceOrientation}
        />
      </ViroARScene>
    );
  }, [models, referenceLocation, referenceOrientation]);

  return (
    <GestureHandlerRootView style={styles.container}>
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <ViroARSceneNavigator
          autofocus
          initialScene={{ scene: SceneWithModels }}
          style={styles.f1}
        />
      )}
      <BottomPanel />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  f1: { flex: 1 },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProjectARScene;
