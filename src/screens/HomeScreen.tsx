import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import ProjectTile from '../components/ProjectTile';
import { fetchProjects } from '../api/projectsApi';
import { type Project } from '../api/types';
import FormattedText from '../components/FormattedText';
import { headerColor, purple1 } from '../styles/colors';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../navigation/routes';
import { type StackNavigationProp } from '@react-navigation/stack';
import { type RootStackParamList } from '../navigation/AppRouter';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const Projects = (): JSX.Element => {
  const [projects, setProjects] = useState<Record<string, Project>>();
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  useEffect(() => {
    const fetchallProjects = async (): Promise<void> => {
      if (user) {
        try {
          const data = await fetchProjects(user.uid);
          console.log(data);
          setProjects(data);
        } catch (error) {
          console.error('Error fetching projects:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchallProjects().catch((error) => {
      console.error('Error fetching projects:', error);
      setLoading(false);
    });
  }, [user]);

  const handleProjectClick = (project: Project): void => {
    console.log(`Navigating to project with ID: ${project.id}`);
    navigation.navigate('AR', { project });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={purple1} style={styles.loader} />
      ) : !projects || Object.keys(projects).length === 0 ? (
        <FormattedText style={styles.message}>
          No projects found. You can create one in the editor!
        </FormattedText>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {Object.entries(projects).map(([id, project]) => (
            <View style={{ padding: 10 }} key={id}>
              <TouchableOpacity onPress={() => {}}>
                <ProjectTile
                  project={project}
                  onClick={() => {
                    handleProjectClick(project);
                  }}
                />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: headerColor,
  },
  loader: {
    marginTop: 20,
  },
  message: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  scrollContainer: {
    paddingVertical: 20,
  },
});

export default Projects;
