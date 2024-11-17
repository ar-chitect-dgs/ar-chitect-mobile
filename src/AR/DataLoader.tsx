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

export const updateProjectLocationInArray = async (
  userId: string,
  projectId: number,
  latitude: number,
  longitude: number,
  orientation: number,
): Promise<void> => {
  try {
    const projectRef = firestore().collection('projects').doc(userId);

    const projectDoc = await projectRef.get();
    const projectData = projectDoc.data();

    if (!projectData || !Array.isArray(projectData.projects)) {
      throw new Error(`Projects array not found for user ${userId}`);
    }

    const updatedProjects = projectData.projects.map((project: ProjectData) => {
      if (project.projectId === projectId) {
        return {
          ...project,
          latitude,
          longitude,
          orientation,
        };
      }
      return project;
    });

    await projectRef.update({
      projects: updatedProjects,
    });

    console.log(
      `Location updated for project ${projectId} to: ${latitude}, ${longitude}`,
    );
  } catch (error) {
    console.error('Error updating project location:', error);
    throw error;
  }
};
