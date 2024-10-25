import storage from "@react-native-firebase/storage";
import { Project, ProjectsData, Object3D } from "./Interfaces";

const SAMPLE_PROJECT_PATH = "/projects/SampleProject.json";
const MODELS_DIRECTORY = "/models/;";

export const fetchProjectData = async (): Promise<ProjectsData> => {
  const reference = storage().ref(SAMPLE_PROJECT_PATH);
  const url = await reference.getDownloadURL();

  const response = await fetch(url);
  const json: ProjectsData = await response.json();

  return json;
};

export const fetchGLBUrl = async (path: string): Promise<string> => {
  const reference = storage().ref(MODELS_DIRECTORY + path);
  const url = await reference.getDownloadURL();
  return url;
};

export const fetchAndLoadModels = async (
  project: Project
): Promise<Object3D[]> => {
  const updatedObjects = await Promise.all(
    project.objects.map(async (object: Object3D) => {
      const glbUrl = await fetchGLBUrl(object.url);
      return {
        ...object,
        url: glbUrl,
      };
    })
  );

  return updatedObjects;
};
