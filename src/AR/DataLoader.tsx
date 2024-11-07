import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {
  type ProjectsData,
  type Object3D,
  type ProjectData,
  type ModelData,
} from './Interfaces';

const MODELS_DIRECTORY = '/models/';

export const fetchProjectData = async (): Promise<ProjectsData> => {
  const project = await firestore().collection('projects').doc('1').get();
  const projectData = project.data() as ProjectsData;
  return projectData;
};

export async function fetchObjectsWithModelUrls(
  projectData: ProjectData,
): Promise<Object3D[]> {
  console.log(projectData);
  const results = await Promise.all(
    projectData.objects.map(async (object) => {
      const modelDoc = await firestore()
        .collection('models')
        .doc(object.objectId.toString())
        .get();

      if (!modelDoc.exists) {
        throw new Error(
          `Model with id ${object.objectId} not found in Firestore`,
        );
      }

      const modelData = modelDoc.data() as ModelData;

      const colorData = modelData.color_variants[object.color];
      if (!colorData) {
        throw new Error(
          `Color ${object.color} not found for model ${object.objectId}`,
        );
      }

      return {
        objectId: object.objectId,
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

// export const fetchAndLoadModels = async (
//   models: Object3D[],
// ): Promise<Object3D[]> => {
//   const updatedObjects = await Promise.all(
//     models.map(async (object: Object3D) => {
//       const glbUrl = await fetchGLBUrl(object.url);
//       return {
//         ...object,
//         url: glbUrl,
//       };
//     }),
//   );

//   return updatedObjects;
// };
