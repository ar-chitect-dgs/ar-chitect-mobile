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
import { fetchObjectsWithModelUrls } from './DataLoader';
import ARScene from './ARScene';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from '@gorhom/bottom-sheet';
import { setLocation, setOrientation } from '../store/actions';
import { useDispatch } from 'react-redux';
import LightsPanel from './LightsPanel';
import {
  getCurrentLocation,
  getCurrentOrientation,
  requestLocationPermission,
} from './LocationUtils';
import { type ProjectData, type Object3D } from './Interfaces';

export type Location = {
  latitude: number;
  longitude: number;
} | null;

interface ProjectARSceneProps {
  projectData: ProjectData;
}

const ProjectARScene: React.FC<ProjectARSceneProps> = ({ projectData }) => {
  const dispatch = useDispatch();

  const [trackingInitialized, setTrackingInitialized] = useState(false);
  const [models, setModels] = useState<Object3D[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const referenceLocation = {
    latitude: projectData.latitude,
    longitude: projectData.longitude,
  };
  const referenceOrientation = projectData.orientation;

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
        const modelsArray = await fetchObjectsWithModelUrls(projectData);
        setModels(modelsArray);
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
  }, [projectData]);

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

  const sheetRef = useRef(null);
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
      <BottomSheet ref={sheetRef} snapPoints={snapPoints}>
        <LightsPanel />
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  f1: { flex: 1 },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProjectARScene;
