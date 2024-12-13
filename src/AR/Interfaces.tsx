export interface Object3D {
  id: string;
  name: string;
  url: string;
  position: Vector3D;
  rotation: Vector3D;
  isVisible: boolean;
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface ObjectData {
  id: string;
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
