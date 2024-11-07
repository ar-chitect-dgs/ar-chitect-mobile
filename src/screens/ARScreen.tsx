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
import { ProjectsData, Object3D } from '../AR/Interfaces';
import { fetchProjectData, fetchAndLoadModels } from '../AR/DataLoader';
import ARScene from '../AR/ARScene';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import LightsPanel from '../AR/LightsPanel';

const SampleARScene = (): JSX.Element => {
  const [trackingInitialized, setTrackingInitialized] = useState(false);
  const [models, setModels] = useState<Object3D[]>([]);

  useEffect(() => {
    const loadProjectData = async (): Promise<void> => {
      try {
        const projectJson: ProjectsData = await fetchProjectData();
        const sampleProject = projectJson.projects[0];
        const modelsArray = await fetchAndLoadModels(sampleProject);
        setModels(modelsArray);
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
      <ARScene models={models} />
    </ViroARScene>
  );
};

const ARScreen: React.FC = ({ navigation }: any) => {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

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
