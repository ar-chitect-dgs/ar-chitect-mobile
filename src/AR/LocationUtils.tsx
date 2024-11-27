import { Alert, PermissionsAndroid, Platform } from 'react-native';
import Geolocation, {
  type GeoPosition,
} from 'react-native-geolocation-service';
import { magnetometer, type SensorData } from 'react-native-sensors';

export interface Location {
  latitude: number;
  longitude: number;
}

interface LocationProps {
  setLocation: (location: Location) => void;
  setStep: (step: number) => void;
}

interface OrientationProps {
  setOrientation: (orientation: number) => void;
  setStep: (step: number) => void;
}

export const requestLocationPermission = async (): Promise<boolean> => {
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

export const getCurrentLocation = async ({
  setLocation,
  setStep,
}: LocationProps): Promise<void> => {
  Geolocation.getCurrentPosition(
    (position: GeoPosition) => {
      const { latitude, longitude } = position.coords;
      setLocation({ latitude, longitude });
      setStep(2);
    },
    (error) => {
      console.error(error);
      Alert.alert('Location Error', 'Could not fetch location.');
    },
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
  );
};

export const getCurrentOrientation = async ({
  setOrientation,
  setStep,
}: OrientationProps): Promise<void> => {
  const subscription = magnetometer.subscribe(({ x, y }: SensorData) => {
    const angle = Math.atan2(y, x) * (180 / Math.PI);
    const adjustedAngle = (angle + 360) % 360;
    setOrientation(adjustedAngle);
    setStep(3);
    subscription.unsubscribe();
  });
};
