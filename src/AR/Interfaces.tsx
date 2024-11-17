export interface Object3D {
  objectId: number;
  name: string;
  url: string;
  position: Vector3D;
  rotation: Vector3D;
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface ProjectsData {
  projects: ProjectData[];
}

export interface ProjectData {
  projectId: number;
  projectName: string;
  objects: ObjectData[];
  isFirstTime: boolean;
  latitude: number;
  longitude: number;
  orientation: number;
}

export interface ObjectData {
  objectId: number;
  position: Vector3D;
  rotation: Vector3D;
  color: string;
}

export interface ModelData {
  name: string;
  color_variants: Record<
    string,
    {
      thumb: string;
      url: string;
    }
  >;
}
