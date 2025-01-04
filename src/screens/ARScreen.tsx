import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { resetLightsState, setModels, setProject } from '../store/actions';
import { useRoute } from '@react-navigation/native';
import { type ARScreenRouteProp } from '../navigation/AppRouter';
import { ViroARScene, ViroARSceneNavigator } from '@reactvision/react-viro';
import { fetchObjectsWithModelUrls } from '../api/projectsApi';
import ARScene from '../AR/ARScene';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomPanel from '../AR/BottomPanel';
import { type LightState, type Reducer } from '../store/reducers';

const ARScreen: React.FC = () => {
  const dispatch = useDispatch();
  const route = useRoute<ARScreenRouteProp>();
  const { project } = route.params;
  const lightConfig: LightState = useSelector(
    (state: Reducer) => state.lightConfig,
  );
  const { saveLights } = lightConfig;

  const data = project;

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProjectData = async (): Promise<void> => {
      const user = auth().currentUser;
      if (!user) {
        return;
      }
      try {
        dispatch(setProject({ id: data.id, project: data }));
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };
    const loadModels = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const modelsArray = await fetchObjectsWithModelUrls(project);
        dispatch(setModels(modelsArray));
      } catch (error) {
        console.error(
          'Error while downloading and loading project data',
          error,
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (!saveLights) {
      console.log('reset');
      dispatch(resetLightsState());
    }
    void loadProjectData();
    void loadModels();
  }, []);

  const SceneWithModels = (): JSX.Element => {
    return (
      <ViroARScene>
        <ARScene />
      </ViroARScene>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <GestureHandlerRootView style={styles.container}>
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator
              testID="activity-indicator"
              size="large"
              color="#0000ff"
            />
          </View>
        ) : (
          <ViroARSceneNavigator
            autofocus
            initialScene={{ scene: SceneWithModels }}
            style={styles.f1}
          />
        )}
        <BottomPanel />
      </GestureHandlerRootView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  f1: { flex: 1 },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ARScreen;
