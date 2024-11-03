import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { type Project, type ProjectsData, type Object3D } from './Interfaces';

const MODELS_DIRECTORY = '/models/';

export const fetchProjectData = async (): Promise<ProjectsData> => {
  const project = await firestore().collection('projects').doc('1').get();
  return project.data();
};

export const fetchGLBUrl = async (path: string): Promise<string> => {
  const reference = storage().ref(MODELS_DIRECTORY + path);
  const url = await reference.getDownloadURL();
  return url;
};

export const fetchAndLoadModels = async (
  project: Project,
): Promise<Object3D[]> => {
  const updatedObjects = await Promise.all(
    project.objects.map(async (object: Object3D) => {
      const glbUrl = await fetchGLBUrl(object.url);
      return {
        ...object,
        url: glbUrl,
      };
    }),
  );

  return updatedObjects;
};
