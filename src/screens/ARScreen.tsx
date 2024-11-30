import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import FirstARScene from '../AR/FirstARScene';
import ProjectARScene from '../AR/ProjectARScene';
import { useDispatch } from 'react-redux';
import { setProject } from '../store/actions';
import { useRoute } from '@react-navigation/native';
import { type ARScreenRouteProp } from '../navigation/AppRouter';

const ARScreen: React.FC = () => {
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);
  const dispatch = useDispatch();
  const route = useRoute<ARScreenRouteProp>();
  const { project } = route.params;

  const data = project;

  useEffect(() => {
    const loadProjectData = async (): Promise<void> => {
      const user = auth().currentUser;
      if (!user) {
        return;
      }
      try {
        dispatch(setProject({ id: data.id, project: data }));
        setIsFirstTime(data.isFirstTime);
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };

    void loadProjectData();
  }, []);

  const handleCompleteFirstARScene = (): void => {
    setIsFirstTime(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {isFirstTime === null || data.id === null ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : isFirstTime ? (
        <FirstARScene id={data.id} onComplete={handleCompleteFirstARScene} />
      ) : (
        <ProjectARScene />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
