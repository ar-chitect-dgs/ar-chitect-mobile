import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import {
  resetLightsState,
  setModels,
  setProject,
  setUnsavedChanges,
} from '../store/actions';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { type ARScreenRouteProp } from '../navigation/AppRouter';
import { ViroARScene, ViroARSceneNavigator } from '@reactvision/react-viro';
import { fetchObjectsWithModelUrls } from '../api/projectsApi';
import ARScene from '../AR/ARScene';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomPanel from '../AR/BottomPanel';
import { type Reducer } from '../store/reducers';
import ErrorPopup, { type ErrorPopupProps } from '../components/ErrorPopup';

const ARScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute<ARScreenRouteProp>();
  const { project } = route.params;
  const { saveLights, unsavedChanges } = useSelector(
    (state: Reducer) => state.settingsConfig,
  );

  const data = project;

  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState<ErrorPopupProps>({
    isVisible: false,
    title: '',
    message: '',
    closeText: '',
    confirmText: undefined,
    onClose: () => {},
    onConfirm: undefined,
  });

  useEffect(() => {
    const loadProjectData = async (): Promise<void> => {
      const user = auth().currentUser;
      if (!user) {
        return;
      }
      try {
        dispatch(setProject({ id: data.id, project: data }));
      } catch (error) {
        setAlert({
          isVisible: true,
          title: 'Error',
          message: 'Error fetching project data.',
          onClose: () => {
            setAlert((prev) => ({
              ...prev,
              isVisible: false,
            }));
          },
          closeText: 'OK',
          onConfirm: undefined,
          confirmText: undefined,
        });
      }
    };
    const loadModels = async (): Promise<void> => {
      setIsLoading(true);
      try {
        const modelsArray = await fetchObjectsWithModelUrls(project);
        dispatch(setModels(modelsArray));
      } catch (error) {
        setAlert({
          isVisible: true,
          title: 'Error',
          message: 'Error fetching model data.',
          onClose: () => {
            setAlert((prev) => ({
              ...prev,
              isVisible: false,
            }));
          },
          closeText: 'OK',
          onConfirm: undefined,
          confirmText: undefined,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (!saveLights) {
      dispatch(resetLightsState());
    }
    void loadProjectData();
    void loadModels();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const handleBeforeRemove = (e: any) => {
        e.preventDefault();
        if (unsavedChanges) {
          setAlert({
            isVisible: true,
            title: 'Unsaved changes.',
            message: 'Are you sure you want to exit without saving changes?',
            onClose: () => {
              setAlert((prev) => ({
                ...prev,
                isVisible: false,
              }));
              dispatch(setUnsavedChanges(false));
            },
            closeText: 'Cancel',
            onConfirm: () => {
              setAlert((prev) => ({
                ...prev,
                isVisible: false,
              }));
              dispatch(setUnsavedChanges(false));
              navigation.dispatch(e.data.action);
            },
            confirmText: 'Yes',
          });
        } else {
          navigation.dispatch(e.data.action);
        }
      };

      navigation.addListener('beforeRemove', handleBeforeRemove);

      return () => {
        navigation.removeListener('beforeRemove', handleBeforeRemove);
      };
    }, [navigation, unsavedChanges]),
  );

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
      <ErrorPopup
        isVisible={alert.isVisible}
        title={alert.title}
        message={alert.message}
        onClose={() => {
          setAlert((prev) => ({
            ...prev,
            isVisible: false,
          }));
        }}
        closeText={alert.closeText}
        onConfirm={alert.onConfirm}
        confirmText={alert.confirmText}
      />
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
