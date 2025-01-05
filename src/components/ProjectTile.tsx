import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import placeholder from '../assets/placeholder_project.png';
import { type Project } from '../api/types';
import FormattedText from './FormattedText';
import { purple1 } from '../styles/colors';

interface ProjectTileProps {
  project: Project;
  onClick: () => void;
}

const ProjectTile = ({ project, onClick }: ProjectTileProps): JSX.Element => (
  <TouchableOpacity style={styles.card} onPress={onClick}>
    <Image
      style={styles.thumbnail}
      source={{ uri: project.thumb }}
      resizeMode="cover"
    />
    <View style={styles.details}>
      <View style={styles.header}>
        <FormattedText style={styles.name}>{project.projectName}</FormattedText>
        <FormattedText style={styles.createdAt}>
          {new Date(project.createdAt).toLocaleDateString()}
        </FormattedText>
      </View>
      <FormattedText style={styles.modifiedAt}>
        Last edited: {new Date(project.modifiedAt).toLocaleDateString()}
      </FormattedText>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    margin: 0,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#ccc',
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 5,
  },
  thumbnail: {
    width: '100%',
    height: 170,
    borderRadius: 10,
  },
  details: {
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  createdAt: {
    fontSize: 12,
    color: purple1,
  },
  modifiedAt: {
    fontSize: 14,
    color: purple1,
  },
});

export default ProjectTile;
