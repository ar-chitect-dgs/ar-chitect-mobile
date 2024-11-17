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
import { updateProjectLocationInArray } from './DataLoader';

type Location = {
  latitude: number;
  longitude: number;
} | null;

const FirstARScene: React.FC = () => {
  const [location, setLocation] = useState<Location>(null);
  const [orientation, setOrientation] = useState<number | null>(null);
  const [step, setStep] = useState<number>(1); // Kontroluje widoczność przycisków

  setUpdateIntervalForType(SensorTypes.magnetometer, 100);

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
        setStep(2); // Przechodzimy do następnego kroku (przycisk orientacji)
      },
      (error) => {
        console.error(error);
        Alert.alert('Location Error', 'Could not fetch location.');
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  };

  const saveOrientation = async (): Promise<void> => {
    const subscription = magnetometer.subscribe(({ x, y }: SensorData) => {
      const angle = Math.atan2(y, x) * (180 / Math.PI); // kąt w stopniach
      const adjustedAngle = (angle + 360) % 360; // zakres 0-360
      setOrientation(adjustedAngle);
      setStep(3); // Przechodzimy do kolejnego kroku (przycisk zapisu wszystkiego)
      subscription.unsubscribe(); // Odłączamy się po uzyskaniu wartości
    });
  };

  const saveAll = async (): Promise<void> => {
    if (location && orientation) {
      try {
        await updateProjectLocationInArray(
          '1',
          1, // Przykładowy ID projektu
          location.latitude,
          location.longitude,
          orientation,
        );
        Alert.alert('Success', 'Location and orientation saved.');
      } catch (error) {
        Alert.alert('Error', 'Failed to save location and orientation.');
        console.error(error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ViroARSceneNavigator
        initialScene={{ scene: ARScene }}
        style={styles.arView}
      />
      <View style={styles.buttons}>
        {step === 1 && (
          <Button
            title="Save location"
            onPress={() => {
              void saveLocation();
            }}
          />
        )}
        {step === 2 && (
          <Button
            title="Save orientation"
            onPress={() => {
              void saveOrientation();
            }}
          />
        )}
        {step === 3 && (
          <Button
            title="Save all"
            onPress={() => {
              void saveAll();
            }}
          />
        )}
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
