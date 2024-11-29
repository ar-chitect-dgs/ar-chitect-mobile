import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import FirstARScene from '../AR/FirstARScene';
import ProjectARScene from '../AR/ProjectARScene';
import { useDispatch } from 'react-redux';
import { setProject } from '../store/actions';
import { fetchProjects } from '../api/projectsApi';
import { type Project } from '../api/types';

const ARScreen: React.FC = () => {
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadProjectData = async (): Promise<void> => {
      const user = auth().currentUser;
      if (!user) {
        return;
      }
      try {
        const projects: Record<string, Project> = await fetchProjects(user.uid);
        const id = Object.keys(projects)[0];
        setProjectId(id);
        const project = projects[id];
        dispatch(setProject({ id, project }));
        setIsFirstTime(project.isFirstTime);
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };

    void loadProjectData();
  }, []);

  const handleCompleteFirstARScene = (): void => {
    setIsFirstTime(false);
  };

  return isFirstTime === null || projectId === null ? (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  ) : isFirstTime ? (
    <FirstARScene id={projectId} onComplete={handleCompleteFirstARScene} />
  ) : (
    <ProjectARScene />
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ARScreen;
