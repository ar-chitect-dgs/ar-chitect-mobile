import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { StyleSheet, Alert, View, ActivityIndicator } from 'react-native';
import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroTrackingStateConstants,
} from '@reactvision/react-viro';
import { SensorTypes, setUpdateIntervalForType } from 'react-native-sensors';
import { fetchObjectsWithModelUrls } from '../utils/DataLoader';
import ARScene from './ARScene';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from '@gorhom/bottom-sheet';
import { setLocation, setModels, setOrientation } from '../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import LightsPanel from '../lightsPanel/LightsPanel';
import {
  getCurrentLocation,
  getCurrentOrientation,
  requestLocationPermission,
} from '../utils//LocationUtils';
import { type Reducer } from '../store/reducers';

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

  const [trackingInitialized, setTrackingInitialized] = useState(false);
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

  const onTrackingUpdated = useCallback((state: ViroTrackingStateConstants) => {
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      setTrackingInitialized(true);
    } else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
      setTrackingInitialized(false);
    }
  }, []);

  const SceneWithModels = useCallback(() => {
    return (
      <ViroARScene onTrackingUpdated={onTrackingUpdated}>
        <ARScene
          models={models}
          referenceLocation={referenceLocation}
          referenceOrientation={referenceOrientation}
        />
      </ViroARScene>
    );
  }, [models, onTrackingUpdated, referenceLocation, referenceOrientation]);

  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['10%', '25%', '50%', '90%'], []);

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
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
      >
        <LightsPanel />
      </BottomSheet>
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
