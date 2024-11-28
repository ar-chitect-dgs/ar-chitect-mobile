import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { type Object3D, type ProjectData, type ModelData } from './Interfaces';

const MODELS_DIRECTORY = '/models/';
const MODELS_FIRESTORE_DIRECTORY = 'models2';

export async function fetchObjectsWithModelUrls(
  projectData: ProjectData,
): Promise<Object3D[]> {
  console.log(projectData);
  const results = await Promise.all(
    projectData.objects.map(async (object) => {
      const modelDoc = await firestore()
        .collection(MODELS_FIRESTORE_DIRECTORY)
        .doc(object.id.toString())
        .get();

      if (!modelDoc.exists) {
        throw new Error(`Model with id ${object.id} not found in Firestore`);
      }

      const modelData = modelDoc.data() as ModelData;

      const colorData = modelData.color_variants[object.color];
      if (!colorData) {
        throw new Error(
          `Color ${object.color} not found for model ${object.id}`,
        );
      }

      return {
        id: object.id,
        name: modelData.name,
        position: object.position,
        rotation: object.rotation,
        url: colorData.url,
      };
    }),
  );

  const updatedObjects = await Promise.all(
    results.map(async (object: Object3D) => {
      const glbUrl = await fetchGLBUrl(object.url);
      return {
        ...object,
        url: glbUrl,
      };
    }),
  );

  return updatedObjects;
}

export const fetchGLBUrl = async (path: string): Promise<string> => {
  const reference = storage().ref(MODELS_DIRECTORY + path);
  const url = await reference.getDownloadURL();
  return url;
};

export const updateProjectLocationInArray = async (
  userId: string,
  projectId: string,
  latitude: number,
  longitude: number,
  orientation: number,
): Promise<void> => {
  try {
    const projectRef = firestore()
      .collection('users')
      .doc(userId)
      .collection('projects')
      .doc(projectId);

    await projectRef.update({
      latitude,
      longitude,
      orientation,
      isFirstTime: false,
    });

    console.log(`Project ${projectId} updated successfully.`);
  } catch (error) {
    console.error(`Error updating project ${projectId}:`, error);
    throw error;
  }
};
