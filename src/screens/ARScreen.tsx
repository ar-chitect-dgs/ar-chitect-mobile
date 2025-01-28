import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import {
  resetLightsState,
  resetSceneState,
  setModels,
  setProject,
  setUnsavedChanges,
} from '../store/actions';
import {
  type EventArg,
  type NavigationAction,
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
import { useTranslation } from 'react-i18next';

const ARScreen: React.FC = () => {
  const { t } = useTranslation();
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
          title: t('error.title'),
          message: t('arScreen.errorFetchingProject'),
          onClose: () => {
            setAlert((prev) => ({
              ...prev,
              isVisible: false,
            }));
          },
          closeText: t('error.okButton'),
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
          title: t('error.title'),
          message: t('arScreen.errorFetchingModels'),
          onClose: () => {
            setAlert((prev) => ({
              ...prev,
              isVisible: false,
            }));
          },
          closeText: t('error.okButton'),
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
    dispatch(resetSceneState());
    void loadProjectData();
    void loadModels();
  }, []);

  useEffect(
    useCallback(() => {
      const handleBeforeRemove = (
        e: EventArg<'beforeRemove', true, { action: NavigationAction }>,
      ): void => {
        if (!unsavedChanges) {
          return;
        }
        e.preventDefault();
        setAlert({
          isVisible: true,
          title: t('arScreen.unsavedChangesTitle'),
          message: t('arScreen.unsavedChangesMessage'),
          onClose: () => {
            setAlert((prev) => ({
              ...prev,
              isVisible: false,
            }));
            dispatch(setUnsavedChanges(false));
          },
          closeText: t('arScreen.cancelButton'),
          onConfirm: () => {
            setAlert((prev) => ({
              ...prev,
              isVisible: false,
            }));
            dispatch(setUnsavedChanges(false));
            navigation.dispatch(e.data.action);
          },
          confirmText: t('arScreen.confirmExitButton'),
        });
      };

      navigation.addListener('beforeRemove', handleBeforeRemove);
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
  trackingMessageContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackingMessageBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
});

export default ARScreen;
