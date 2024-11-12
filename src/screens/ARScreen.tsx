import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { ViroARScene, Viro3DObject } from '@reactvision/react-viro';

const savedCorners = [
  [0.0, 0.0],
  [0.0, 10.0],
  [10.0, 10.0],
  [10.0, 0.0],
];

// Funkcja pomocnicza do przeliczania współrzędnych
const metersToLatitudeLongitude = (dx, dy, referenceLocation) => {
  const earthRadius = 6378137; // Promień Ziemi w metrach

  const dLat = (dy / earthRadius) * (180 / Math.PI);
  const dLon =
    (dx /
      (earthRadius * Math.cos((Math.PI * referenceLocation.latitude) / 180))) *
    (180 / Math.PI);

  return {
    latitude: referenceLocation.latitude + dLat,
    longitude: referenceLocation.longitude + dLon,
  };
};

// Funkcja do rotacji współrzędnych o dany kąt
const rotatePoint = (x, y, angle) => {
  const radians = (angle * Math.PI) / 180;
  const rotatedX = x * Math.cos(radians) - y * Math.sin(radians);
  const rotatedY = x * Math.sin(radians) + y * Math.cos(radians);
  return [rotatedX, rotatedY];
};

const SampleARScene = ({ referenceLocation, referenceAngle, models }) => {
  const [arModels, setARModels] = useState([]);

  useEffect(() => {
    // Przetwarzanie lokalnych współrzędnych modeli na globalne dla AR
    const processedModels = models.map((model) => {
      // Translacja lokalnej pozycji modelu względem punktu odniesienia
      const [xLocal, yLocal] = model.position;

      // Rotacja względem kąta ściany
      const [xRotated, yRotated] = rotatePoint(xLocal, yLocal, referenceAngle);

      // Przeliczenie na globalne współrzędne
      const globalPosition = metersToLatitudeLongitude(
        xRotated,
        yRotated,
        referenceLocation,
      );

      // Zwracamy model z nową pozycją i orientacją
      return {
        ...model,
        globalPosition: globalPosition,
        rotation: model.rotation + referenceAngle, // Dodajemy kąt odniesienia do oryginalnej rotacji
      };
    });

    setARModels(processedModels);
  }, [referenceLocation, referenceAngle, models]);

  return (
    <ViroARScene>
      {arModels.map((model, index) => (
        <Viro3DObject
          key={index}
          source={model.source} // Ścieżka do modelu 3D
          position={[
            model.globalPosition.latitude,
            0,
            model.globalPosition.longitude,
          ]} // Ustaw pozycję w scenie AR
          rotation={[0, model.rotation, 0]} // Obrót o kąt
          scale={[0.1, 0.1, 0.1]} // Skalowanie modelu (dopasuj według potrzeb)
          type="OBJ" // Typ modelu, np. OBJ
        />
      ))}
    </ViroARScene>
  );
};

const ARScreen = () => {
  const referenceLocation = { latitude: 52.2297, longitude: 21.0122 }; // Przykładowy punkt odniesienia
  const referenceAngle = 30; // Przykładowy kąt pierwszej ściany względem północy
  const models = [
    { position: [2, 3], rotation: 0, source: require('./model1.obj') },
    { position: [5, 5], rotation: 90, source: require('./model2.obj') },
    // Dodaj inne modele w lokalnych współrzędnych pokoju
  ];

  return (
    <View style={styles.container}>
      <SampleARScene
        referenceLocation={referenceLocation}
        referenceAngle={referenceAngle}
        models={models}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ARScreen;
