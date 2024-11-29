import firestore from '@react-native-firebase/firestore';
import { type Project } from './types';

export const fetchProjects = async (userId: string): Promise<Project[]> => {
  try {
    const snapshot = await firestore()
      .collection('users')
      .doc(userId)
      .collection('projects')
      .get();

    return snapshot.docs.map((doc) => {
      const projectData = doc.data() as Project;
      return { ...projectData, id: doc.id };
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};
