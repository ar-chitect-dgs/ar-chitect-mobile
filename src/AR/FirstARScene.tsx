import React, { useState, useMemo, useRef } from 'react';
import { View, Text, Alert, StyleSheet, Button } from 'react-native';
import { SensorTypes, setUpdateIntervalForType } from 'react-native-sensors';
import BottomSheet from '@gorhom/bottom-sheet';
import {
  getCurrentLocation,
  getCurrentOrientation,
  type Location,
  requestLocationPermission,
} from '../utils/LocationUtils';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ViroARScene, ViroARSceneNavigator } from '@reactvision/react-viro';
import { updateProjectLocationInArray } from '../api/projectsApi';
import auth from '@react-native-firebase/auth';

interface FirstARSceneProps {
  id: string;
  onComplete: () => void;
}

const FirstARScene: React.FC<FirstARSceneProps> = ({ id, onComplete }) => {
  const [location, setLocation] = useState<Location | null>(null);
  const [orientation, setOrientation] = useState<number | null>(null);
  const [step, setStep] = useState<number>(1);
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['10%', '30%', '50%'], []);

  setUpdateIntervalForType(SensorTypes.magnetometer, 100);

  const saveLocation = async (): Promise<void> => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Location access is required.');
      return;
    }
    await getCurrentLocation({ setLocation, setStep });
  };

  const saveOrientation = async (): Promise<void> => {
    await getCurrentOrientation({ setOrientation, setStep });
  };

  const saveAll = async (): Promise<void> => {
    if (location && orientation !== null) {
      const user = auth().currentUser;
      if (!user) {
        return;
      }
      try {
        Alert.alert('Success', 'Location and orientation saved.');
        void updateProjectLocationInArray(
          user.uid,
          id,
          location.latitude,
          location.longitude,
          orientation,
        );
        onComplete();
      } catch (error) {
        Alert.alert('Error', 'Failed to save location and orientation.');
        console.error(error);
      }
    }
  };

  const FirstScene = (): JSX.Element => {
    return <ViroARScene />;
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: FirstScene,
        }}
        style={styles.f1}
      />
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
      >
        <View style={styles.panelContainer}>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Location:</Text>
            {location ? (
              <Text style={styles.infoValue}>
                {`${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`}
              </Text>
            ) : (
              <Text style={styles.infoPlaceholder}>Not saved yet</Text>
            )}
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Orientation:</Text>
            {orientation !== null ? (
              <Text style={styles.infoValue}>
                {`${orientation.toFixed(2)}°`}
              </Text>
            ) : (
              <Text style={styles.infoPlaceholder}>Not saved yet</Text>
            )}
          </View>
          <View style={styles.bottomSheetContent}>
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
        </View>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  f1: { flex: 1 },
  bottomSheetContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  info: {
    fontSize: 16,
    color: '#333',
    marginVertical: 10,
    flex: 1,
  },
  panelContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },

  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginRight: 10,
    width: 100,
  },

  infoValue: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },

  infoPlaceholder: {
    fontSize: 16,
    fontWeight: '400',
    color: '#aaa',
    flex: 1,
    textAlign: 'right',
  },
});

export default FirstARScene;
