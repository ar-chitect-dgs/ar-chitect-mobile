import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import { ViroARScene, ViroARSceneNavigator } from '@reactvision/react-viro';
import Geolocation, {
  type GeoPosition,
} from 'react-native-geolocation-service';
import {
  magnetometer,
  SensorTypes,
  setUpdateIntervalForType,
  type SensorData,
} from 'react-native-sensors';

type Location = {
  latitude: number;
  longitude: number;
} | null;

const FirstARScene: React.FC = () => {
  // Typy stanów lokalizacji i orientacji
  const [location, setLocation] = useState<Location>(null);
  const [orientation, setOrientation] = useState<number | null>(null);

  setUpdateIntervalForType(SensorTypes.magnetometer, 100);

  // Funkcja prosząca o uprawnienia do lokalizacji na Androidzie
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

  // Funkcja do zapisywania lokalizacji użytkownika
  const saveLocation = async (): Promise<void> => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Location access is required to save your position.',
      );
      return;
    }

    Geolocation.getCurrentPosition(
      (position: GeoPosition) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
      },
      (error) => {
        console.error(error);
        Alert.alert('Location Error', 'Could not fetch location.');
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  };

  // Funkcja do zapisywania orientacji względem północy
  const saveOrientation = async (): Promise<void> => {
    const subscription = magnetometer.subscribe(({ x, y }: SensorData) => {
      const angle = Math.atan2(y, x) * (180 / Math.PI); // kąt w stopniach
      const adjustedAngle = (angle + 360) % 360; // zakres 0-360
      setOrientation(adjustedAngle);
    });
  };

  return (
    <View style={styles.container}>
      <ViroARSceneNavigator
        initialScene={{ scene: ARScene }}
        style={styles.arView}
      />
      <View style={styles.buttons}>
        <Button
          title="Save location"
          onPress={() => {
            void saveLocation();
          }}
        />
        <Button
          title="Orientation"
          onPress={() => {
            void saveOrientation();
          }}
        />
      </View>
      <View style={styles.info}>
        {location && (
          <Text>
            Location: {location.latitude}, {location.longitude}
          </Text>
        )}
        {orientation !== null && (
          <Text>Orientation: {orientation.toFixed(2)}°</Text>
        )}
      </View>
    </View>
  );
};

// Prosta scena AR
const ARScene: React.FC = () => {
  return <ViroARScene />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  arView: {
    flex: 1,
  },
  buttons: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  info: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
});

export default FirstARScene;
