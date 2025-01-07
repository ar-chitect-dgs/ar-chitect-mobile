import { combineReducers } from 'redux';
import {
  ADD_AMBIENT_LIGHT,
  UPDATE_AMBIENT_LIGHT,
  REMOVE_AMBIENT_LIGHT,
  ADD_DIRECTIONAL_LIGHT,
  UPDATE_DIRECTIONAL_LIGHT,
  REMOVE_DIRECTIONAL_LIGHT,
  ADD_SPOT_LIGHT,
  UPDATE_SPOT_LIGHT,
  REMOVE_SPOT_LIGHT,
  SET_ORIENTATION,
  SET_PROJECT,
  SET_MODELS,
  UPDATE_MODEL,
  SET_TRANSLATION,
  HIDE_SPOT_LIGHT,
  RESET_LIGHTS,
  SET_SAVE_LIGHTS,
  SET_AUTO_SAVE,
  SET_UNSAVED_CHANGES,
} from './actions';
import {
  type AmbientLightProps,
  type DirectionalLightProps,
  type SpotLightProps,
} from '../AR/LightInterfaces';
import { type Vector3D, type Object3D } from '../AR/Interfaces';
import { type Project } from '../api/types';

export interface Reducer {
  lightConfig: LightState;
  projectConfig: ProjectState;
  settingsConfig: settingsState;
}

export interface LightState {
  ambientLights: AmbientLightProps[];
  directionalLights: DirectionalLightProps[];
  spotLights: SpotLightProps[];
}

export interface ProjectState {
  id: string;
  project: Project | null;
  models: Record<number, Object3D>;
  orientation: number;
  translation: Vector3D;
}

export interface settingsState {
  autoSave: boolean;
  unsavedChanges: boolean;
  saveLights: boolean;
}

const initialLightState = {
  ambientLights: [
    {
      id: 1,
      name: 'Ambient light',
      color: '#FFFFFF',
      intensity: 1000,
    },
  ],
  directionalLights: [
    {
      id: 1,
      name: 'Directional light',
      color: '#FFFFFF',
      intensity: 1000,
      direction: [0.0, 0.0, -1.0],
      castsShadows: true,
    },
  ],
  spotLights: [
    {
      id: 1,
      name: 'Spot light light',
      color: '#FFFFFF',
      intensity: 1000,
      position: [0.0, 0.0, -2.0],
      direction: [0.0, 0.0, -1.0],
      castsShadows: true,
      innerAngle: 0,
      outerAngle: 45,
      attenuationStartDistance: 0,
      attenuationEndDistance: 50,
      castsShadow: true,
      isVisible: true,
    },
  ],
};

const initialProjectState: ProjectState = {
  project: null,
  id: '',
  models: [],
  orientation: 0,
  translation: {
    x: 0,
    y: 0,
    z: 0,
  },
};

const initialSettingsState: settingsState = {
  autoSave: false,
  unsavedChanges: false,
  saveLights: false,
};

const lightReducer = (
  state = initialLightState,
  action: { type: any; payload: { id: any; properties: any } },
): typeof initialLightState => {
  switch (action.type) {
    case ADD_AMBIENT_LIGHT:
      return {
        ...state,
        ambientLights: [...state.ambientLights, action.payload.properties],
      };
    case UPDATE_AMBIENT_LIGHT:
      return {
        ...state,
        ambientLights: state.ambientLights.map((light: AmbientLightProps) =>
          light.id === action.payload.id
            ? { ...light, ...action.payload.properties }
            : light,
        ),
      };
    case REMOVE_AMBIENT_LIGHT:
      return {
        ...state,
        ambientLights: state.ambientLights.filter(
          (light: AmbientLightProps) => light.id !== action.payload.id,
        ),
      };

    case ADD_DIRECTIONAL_LIGHT:
      return {
        ...state,
        directionalLights: [
          ...state.directionalLights,
          action.payload.properties,
        ],
      };
    case UPDATE_DIRECTIONAL_LIGHT:
      return {
        ...state,
        directionalLights: state.directionalLights.map(
          (light: DirectionalLightProps) =>
            light.id === action.payload.id
              ? { ...light, ...action.payload.properties }
              : light,
        ),
      };
    case REMOVE_DIRECTIONAL_LIGHT:
      return {
        ...state,
        directionalLights: state.directionalLights.filter(
          (light: DirectionalLightProps) => light.id !== action.payload.id,
        ),
      };

    case ADD_SPOT_LIGHT:
      return {
        ...state,
        spotLights: [...state.spotLights, action.payload.properties],
      };
    case UPDATE_SPOT_LIGHT:
      return {
        ...state,
        spotLights: state.spotLights.map((light: SpotLightProps) =>
          light.id === action.payload.id
            ? { ...light, ...action.payload.properties }
            : light,
        ),
      };
    case REMOVE_SPOT_LIGHT:
      return {
        ...state,
        spotLights: state.spotLights.filter(
          (light: SpotLightProps) => light.id !== action.payload.id,
        ),
      };
    case HIDE_SPOT_LIGHT:
      return {
        ...state,
        spotLights: state.spotLights.map((light: SpotLightProps) =>
          light.id === action.payload.id
            ? { ...light, isVisible: !light.isVisible }
            : light,
        ),
      };
    case RESET_LIGHTS:
      return initialLightState;
    default:
      return state;
  }
};

const projectReducer = (
  state: ProjectState = initialProjectState,
  action: any,
): ProjectState => {
  switch (action.type) {
    case SET_PROJECT:
      return {
        ...state,
        id: action.payload.id,
        project: action.payload.project,
      };
    case SET_MODELS:
      return {
        ...state,
        models: action.payload,
      };
    case UPDATE_MODEL:
      return {
        ...state,
        models: Object.entries(state.models).reduce(
          (acc, [key, model]) => {
            if (key === action.payload.index.toString()) {
              acc[key] = {
                ...model,
                ...action.payload.newModel,
              };
            } else {
              acc[key] = model;
            }
            return acc;
          },
          {} satisfies Record<number, Object3D>,
        ),
      };

    case SET_ORIENTATION:
      return {
        ...state,
        orientation: action.payload,
      };
    case SET_TRANSLATION:
      return {
        ...state,
        translation: action.payload,
      };
    default:
      return state;
  }
};

const settingsReducer = (
  state: settingsState = initialSettingsState,
  action: any,
): settingsState => {
  switch (action.type) {
    case SET_AUTO_SAVE:
      return {
        ...state,
        autoSave: action.payload,
      };
    case SET_UNSAVED_CHANGES:
      return {
        ...state,
        unsavedChanges: action.payload,
      };
    case SET_SAVE_LIGHTS:
      return {
        ...state,
        saveLights: action.payload.properties,
      };
    default:
      return state;
  }
};

export default combineReducers({
  lightConfig: lightReducer,
  projectConfig: projectReducer,
  settingsConfig: settingsReducer,
});
