// redux/actions.js

import { type AnyAction } from 'redux';
import {
  type AmbientLightProps,
  type DirectionalLightProps,
  type SpotLightProps,
} from '../AR/LightInterfaces';

export const ADD_AMBIENT_LIGHT = 'ADD_AMBIENT_LIGHT';
export const UPDATE_AMBIENT_LIGHT = 'UPDATE_AMBIENT_LIGHT';
export const REMOVE_AMBIENT_LIGHT = 'REMOVE_AMBIENT_LIGHT';

export const ADD_DIRECTIONAL_LIGHT = 'ADD_DIRECTIONAL_LIGHT';
export const UPDATE_DIRECTIONAL_LIGHT = 'UPDATE_DIRECTIONAL_LIGHT';
export const REMOVE_DIRECTIONAL_LIGHT = 'REMOVE_DIRECTIONAL_LIGHT';

export const ADD_SPOT_LIGHT = 'ADD_SPOT_LIGHT';
export const UPDATE_SPOT_LIGHT = 'UPDATE_SPOT_LIGHT';
export const REMOVE_SPOT_LIGHT = 'REMOVE_SPOT_LIGHT';

export const addAmbientLight = (light: AmbientLightProps): AnyAction => {
  return {
    type: ADD_AMBIENT_LIGHT,
    payload: { id: light.id, properties: light },
  };
};

export const updateAmbientLight = (
  id: number,
  properties: AmbientLightProps,
): AnyAction => ({
  type: UPDATE_AMBIENT_LIGHT,
  payload: { id, properties },
});

export const removeAmbientLight = (id: number): AnyAction => ({
  type: REMOVE_AMBIENT_LIGHT,
  payload: { id, properties: null },
});

export const addDirectionalLight = (
  light: DirectionalLightProps,
): AnyAction => ({
  type: ADD_DIRECTIONAL_LIGHT,
  payload: { id: light.id, properties: light },
});

export const updateDirectionalLight = (
  id: number,
  properties: DirectionalLightProps,
): AnyAction => ({
  type: UPDATE_DIRECTIONAL_LIGHT,
  payload: { id, properties },
});

export const removeDirectionalLight = (id: number): AnyAction => ({
  type: REMOVE_DIRECTIONAL_LIGHT,
  payload: { id, properties: null },
});

export const addSpotLight = (light: SpotLightProps): AnyAction => ({
  type: ADD_SPOT_LIGHT,
  payload: { id: light.id, properties: light },
});

export const updateSpotLight = (
  id: number,
  properties: SpotLightProps,
): AnyAction => ({
  type: UPDATE_SPOT_LIGHT,
  payload: { id, properties },
});

export const removeSpotLight = (id: number): AnyAction => ({
  type: REMOVE_SPOT_LIGHT,
  payload: { id, properties: null },
});
