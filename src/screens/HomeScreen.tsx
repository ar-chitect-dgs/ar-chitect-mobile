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

const Projects = (): JSX.Element => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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
    // navigate to AR
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={purple1} style={styles.loader} />
      ) : projects.length === 0 ? (
        <FormattedText style={styles.message}>
          No projects found. You can create one in the editor!
        </FormattedText>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {projects.map((project) => (
            <View style={{ padding: 10 }}>
              <TouchableOpacity
                key={project.id}
                onPress={() => {
                  handleProjectClick(project);
                }}
              >
                <ProjectTile project={project} />
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
