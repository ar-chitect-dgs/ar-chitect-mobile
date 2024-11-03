export interface Object3D {
  objectId: string;
  name: string;
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

export interface Project {
  projectId: string;
  projectName: string;
  objects: Object3D[];
}

export interface ProjectsData {
  projects: Project[];
}
