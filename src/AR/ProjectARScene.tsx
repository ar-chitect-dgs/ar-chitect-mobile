import React, { useState, useEffect, useRef, useMemo, useReducer } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroTrackingStateConstants,
} from '@reactvision/react-viro';
import Geolocation, {
  type GeoPosition,
} from 'react-native-geolocation-service';
import {
  magnetometer,
  SensorTypes,
  setUpdateIntervalForType,
  type SensorData,
} from 'react-native-sensors';
import { type Object3D, type ProjectsData } from './Interfaces';
import { fetchObjectsWithModelUrls, fetchProjectData } from './DataLoader';
import ARScene from './ARScene';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from '@gorhom/bottom-sheet';
import { setLocation, setOrientation } from '../store/actions';
import { useDispatch } from 'react-redux';
import LightsPanel from './LightsPanel';

export type Location = {
  latitude: number;
  longitude: number;
} | null;

const referenceLocation = { latitude: 52.2051982, longitude: 20.9665666 }; // Referencyjna lokalizacja

const SampleARScene = (): JSX.Element => {
  const [trackingInitialized, setTrackingInitialized] = useState(false);
  const [models, setModels] = useState<Object3D[]>([]);
  const [referenceLocation, setReferenceLocation] = useState<Location>(null);

  useEffect(() => {
    const loadProjectData = async (): Promise<void> => {
      try {
        const projectJson: ProjectsData = await fetchProjectData();
        const sampleProject = projectJson.projects[0];
        const modelsArray = await fetchObjectsWithModelUrls(sampleProject);
        setModels(modelsArray);
        setReferenceLocation({
          latitude: sampleProject.latitude,
          longitude: sampleProject.longitude,
        });
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

  return (
    <ViroARScene onTrackingUpdated={onTrackingUpdated}>
      <ARScene models={models} referenceLocation={referenceLocation} />
    </ViroARScene>
  );
};

const ProjectARScene: React.FC = () => {
  const [models, setModels] = useState<Object3D[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeData = async () => {
      await updateCurrentLocationAndOrientation(); // Czekamy na ustawienie lokalizacji i orientacji
    };
    initializeData();
    setUpdateIntervalForType(SensorTypes.magnetometer, 100);
  }, []);

  const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permission for location access',
            message: 'App needs access to your location.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const updateCurrentLocationAndOrientation = async (): Promise<void> => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Location access is required.');
      return;
    }

    // Pobranie lokalizacji użytkownika
    await new Promise<void>((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position: GeoPosition) => {
          const { latitude, longitude } = position.coords;
          dispatch(setLocation({ latitude, longitude }));
          resolve();
        },
        (error: any) => {
          console.error(error);
          Alert.alert('Location Error', 'Could not fetch location.');
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
      );
    });

    // Pobranie orientacji użytkownika (jednorazowo)
    await new Promise<void>((resolve) => {
      const subscription = magnetometer.subscribe(({ x, y }: SensorData) => {
        const angle = Math.atan2(y, x) * (180 / Math.PI);
        const adjustedAngle = (angle + 360) % 360;
        dispatch(setOrientation({ x, y }));
        subscription.unsubscribe();
        resolve();
      });
    });
  };

  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['10%', '25%', '50%', '90%'], []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: SampleARScene,
        }}
        style={styles.f1}
      />
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
    justifyContent: 'center',
  },
  f1: { flex: 1 },
  info: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
});

export default ProjectARScene;
