import firestore from '@react-native-firebase/firestore';
import { type ModelObject, type Project } from './types';
import storage from '@react-native-firebase/storage';
import { type ModelData, type Object3D } from '../AR/Interfaces';

const MODELS_DIRECTORY = '/models/';
const MODELS_FIRESTORE_DIRECTORY = 'models2';

export const fetchProjects = async (
  userId: string,
): Promise<Record<string, Project>> => {
  try {
    const snapshot = await firestore()
      .collection('users')
      .doc(userId)
      .collection('projects')
      .get();

    const projects: Record<string, Project> = {};

    snapshot.forEach((doc) => {
      const projectData = doc.data();
      const id = doc.id;
      const newProject = { ...projectData, id };
      projects[id] = newProject as Project;
    });

    return projects;
  } catch (error) {
    console.error('Error fetching project data:', error);
    throw error;
  }
};

export async function fetchObjectsWithModelUrls(
  projectData: Project,
): Promise<Record<number, Object3D>> {
  const results = await Promise.all(
    projectData.objects.map(async (object) => {
      const modelDoc = await firestore()
        .collection(MODELS_FIRESTORE_DIRECTORY)
        .doc(object.id)
        .get();

      if (!modelDoc.exists) {
        console.error(`Model with id ${object.id} not found in Firestore`);
        throw new Error(`Model with id ${object.id} not found in Firestore`);
      }

      const modelData = modelDoc.data() as ModelData;

      const colorData = modelData.color_variants[object.color];
      if (!colorData) {
        console.error(`Color ${object.color} not found for model ${object.id}`);
        throw new Error(
          `Color ${object.color} not found for model ${object.id}`,
        );
      }

      return {
        id: object.id,
        name: modelData.name,
        modelName: object.modelName ?? modelData.name,
        position: object.position,
        rotation: object.rotation,
        url: colorData.url,
        isVisible: true,
        isSelected: false,
      };
    }),
  );

  const updatedObjectsArray = await Promise.all(
    results.map(async (object: Object3D) => {
      const glbUrl = await fetchGLBUrl(object.url);
      return {
        ...object,
        url: glbUrl,
      };
    }),
  );

  const updatedObjects = updatedObjectsArray.reduce<Record<number, Object3D>>(
    (acc, object, index) => {
      acc[index] = object;
      return acc;
    },
    {},
  );

  return updatedObjects;
}

export const fetchGLBUrl = async (path: string): Promise<string> => {
  const reference = storage().ref(MODELS_DIRECTORY + path);
  const url = await reference.getDownloadURL();
  return url;
};

export const saveProject = async (
  userId: string,
  projectId: string,
  oldObjects: ModelObject[],
  newObjects: Record<number, Object3D>,
): Promise<void> => {
  try {
    const projectRef = firestore()
      .collection('users')
      .doc(userId)
      .collection('projects')
      .doc(projectId);

    const updatedObjects = oldObjects.map((modelObject, index) => {
      const correspondingObject3D = newObjects[index];

      if (correspondingObject3D) {
        return {
          ...modelObject,
          modelName: correspondingObject3D.modelName,
          position: {
            x: correspondingObject3D.position.x,
            y: correspondingObject3D.position.y,
            z: correspondingObject3D.position.z,
          },
          rotation: {
            x: correspondingObject3D.rotation.x,
            y: correspondingObject3D.rotation.y,
            z: correspondingObject3D.rotation.z,
          },
        };
      }
      return modelObject;
    });

    await projectRef.update({
      objects: updatedObjects,
      modifiedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`Error updating objects for project ${projectId}:`, error);
    throw error;
  }
};
