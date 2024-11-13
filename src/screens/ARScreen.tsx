import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroTrackingStateConstants,
} from '@reactvision/react-viro';
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { StyleSheet, Text } from 'react-native';
import { type ProjectsData, type Object3D } from '../AR/Interfaces';
import { fetchProjectData, fetchObjectsWithModelUrls } from '../AR/DataLoader';
import ARScene from '../AR/ARScene';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import LightsPanel from '../AR/LightsPanel';
import ProjectARScene from '../AR/ProjectARScene';
import FirstARScene from '../AR/FirstARScene';

const ARScreen: React.FC = ({ navigation }: any) => {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  return <ProjectARScene />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  f1: { flex: 1 },
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});

export default ARScreen;
