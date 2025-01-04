export interface Vector {
  x: number;
  y: number;
}

export interface ModelObject {
  id: string;
  name: string;
  modelName: string;
  url: string;
  color: string;
  position: Vector;
  rotation: Vector;
}

export interface Project {
  id: string;
  projectName: string;
  corners: Vector[];
  objects: ModelObject[];
  isFirstTime: boolean;
  latitude: number;
  longitude: number;
  orientation: number;
  thumb: string;
  createdAt: string;
  modifiedAt: string;
}
