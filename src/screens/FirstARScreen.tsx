import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroTrackingStateConstants,
} from '@reactvision/react-viro';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import {
  SensorTypes,
  setUpdateIntervalForType,
  magnetometer,
} from 'react-native-sensors';
import Geolocation from 'react-native-geolocation-service';

const savedCorners = [
  [0.0, 0.0],
  [0.0, 10.0],
  [10.0, 10.0],
  [10.0, 0.0],
];

// Funkcja do obliczenia kąta w stopniach na podstawie danych z magnetometru
const calculateAngle = ({ x, y, z }) => {
  let angle = Math.atan2(y, x) * (180 / Math.PI);
  angle = angle >= 0 ? angle : 360 + angle; // Konwersja do 0-360 stopni
  return angle;
};

const FirstARScene = (): JSX.Element => {
  const [direction, setDirection] = useState(0); // Bieżący kąt kierunku
  const [referenceLocation, setReferenceLocation] = useState(null); // Punkt odniesienia
  const [referenceAngle, setReferenceAngle] = useState(null); // Kąt odniesienia ściany

  useEffect(() => {
    // Ustawienie częstotliwości aktualizacji magnetometru
    setUpdateIntervalForType(SensorTypes.magnetometer, 500);

    // Subskrypcja na dane magnetometru
    const magnetometerSubscription = magnetometer.subscribe(({ x, y, z }) => {
      const angle = calculateAngle({ x, y, z });
      setDirection(angle);
    });

    return () => {
      magnetometerSubscription && magnetometerSubscription.unsubscribe();
    };
  }, []);

  const onSaveReferencePoint = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Oblicz kąt pierwszej ściany względem północy
        const dx = savedCorners[1][0] - savedCorners[0][0];
        const dy = savedCorners[1][1] - savedCorners[0][1];
        const wallAngle = Math.atan2(dy, dx) * (180 / Math.PI); // Kąt w stopniach względem osi X

        // Finalny kąt względem północy (bieżący kierunek urządzenia - kąt ściany)
        const angleRelativeToNorth = (direction - wallAngle + 360) % 360;

        // Zapisujemy punkt odniesienia i kąt
        setReferenceLocation({ latitude, longitude });
        setReferenceAngle(angleRelativeToNorth);

        Alert.alert(
          'Punkt odniesienia zapisany',
          `Lokalizacja: ${latitude}, ${longitude}\nKąt: ${angleRelativeToNorth.toFixed(2)}° względem północy`,
        );
      },
      (error) => {
        console.error(error);
        Alert.alert('Błąd', 'Nie udało się uzyskać lokalizacji');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  return (
    <View style={styles.directionContainer}>
      <Text style={styles.directionText}>Kąt: {direction.toFixed(2)}°</Text>
      <Button title="Zapisz punkt odniesienia" onPress={onSaveReferencePoint} />
      {referenceLocation && (
        <Text style={styles.directionText}>
          Zapisana lokalizacja: {referenceLocation.latitude},{' '}
          {referenceLocation.longitude}
        </Text>
      )}
      {referenceAngle !== null && (
        <Text style={styles.directionText}>
          Kąt ściany względem północy: {referenceAngle.toFixed(2)}°
        </Text>
      )}
    </View>
  );
};

const FirstARScreen: React.FC = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <FirstARScene />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  directionContainer: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 10,
  },
  directionText: {
    color: '#ffffff',
    fontSize: 18,
  },
});

export default ARScreen;
