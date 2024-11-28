import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import FirstARScene from '../AR/FirstARScene';
import ProjectARScene from '../AR/ProjectARScene';
import { type ProjectData } from '../AR/Interfaces';
import { fetchProjects } from '../api/projectsApi';

const ARScreen: React.FC = () => {
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);

  useEffect(() => {
    const loadProjectData = async (): Promise<void> => {
      const user = auth().currentUser;
      if (!user) {
        return;
      }
      try {
        const projectData = await fetchProjects(user.uid);
        const firstProject = projectData[0] as ProjectData;
        setIsFirstTime(firstProject.isFirstTime);
        setProjectData(firstProject);
      } catch (error) {
        console.error('Error fetching project data:', error);
      }
    };

    void loadProjectData();
  }, []);

  const handleCompleteFirstARScene = (): void => {
    setIsFirstTime(false);
  };

  if (isFirstTime === null || projectData === null) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return isFirstTime ? (
    <FirstARScene onComplete={handleCompleteFirstARScene} />
  ) : (
    <ProjectARScene projectData={projectData} />
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
