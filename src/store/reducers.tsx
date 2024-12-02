// redux/reducer.js
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
  SET_LOCATION,
  SET_ORIENTATION,
  SET_PROJECT,
  SET_MODELS,
  UPDATE_MODEL,
} from './actions';
import {
  type AmbientLightProps,
  type DirectionalLightProps,
  type SpotLightProps,
} from '../AR/LightInterfaces';
import { type Object3D } from '../AR/Interfaces';
import { type Project } from '../api/types';

export interface Reducer {
  lightConfig: LightState;
  locationConfig: LocationState;
  projectConfig: ProjectState;
}

export interface LightState {
  ambientLights: AmbientLightProps[];
  directionalLights: DirectionalLightProps[];
  spotLights: SpotLightProps[];
}

export interface LocationState {
  latitude: number | null;
  longitude: number | null;
  orientation: number;
}

export interface ProjectState {
  id: string;
  project: Project | null;
  models: Object3D[];
}

const initialLightState = {
  ambientLights: [
    {
      id: 1,
      color: '#FFFFFF',
      intensity: 1000,
    },
  ],
  directionalLights: [
    {
      id: 1,
      color: '#FFFFFF',
      intensity: 1000,
      direction: [0.0, 0.0, -1.0],
      castsShadows: true,
    },
  ],
  spotLights: [],
};

const initialLocationState = {
  latitude: null,
  longitude: null,
  orientation: null,
};

const initialProjectState: ProjectState = {
  project: null,
  id: '',
  models: [],
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

    default:
      return state;
  }
};

const locationReducer = (
  state = initialLocationState,
  action: { type: any; payload: any },
): typeof initialLocationState => {
  switch (action.type) {
    case SET_LOCATION:
      return {
        ...state,
        latitude: action.payload.latitude,
        longitude: action.payload.longitude,
      };
    case SET_ORIENTATION:
      return {
        ...state,
        orientation: action.payload,
      };
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
        models: state.models.map((model, index) => {
          if (index === action.payload.index) {
            return {
              ...model,
              ...action.payload.newModel,
            };
          }
          return model;
        }),
      };
    default:
      return state;
  }
};

export default combineReducers({
  lightConfig: lightReducer,
  locationConfig: locationReducer,
  projectConfig: projectReducer,
});
