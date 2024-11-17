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
} from './actions';
import {
  type AmbientLightProps,
  type DirectionalLightProps,
  type SpotLightProps,
} from '../AR/LightInterfaces';

export interface Reducer {
  lightConfig: LightState;
  locationConfig: LocationState;
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

const initialLightState = {
  ambientLights: [
    {
      id: 1,
      color: '#FFFF00',
      intensity: 1000,
    },
  ],
  directionalLights: [],
  spotLights: [],
};

const initialLocationState = {
  latitude: null,
  longitude: null,
  orientationX: null,
  orientationY: null,
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
      console.log('setting location');
      return {
        ...state,
        latitude: action.payload.latitude,
        longitude: action.payload.longitude,
      };
    case SET_ORIENTATION:
      console.log('setting orientation');
      return {
        ...state,
        orientationX: action.payload.x,
        orientationY: action.payload.y,
      };
    default:
      return state;
  }
};

export default combineReducers({
  lightConfig: lightReducer,
  locationConfig: locationReducer,
});
