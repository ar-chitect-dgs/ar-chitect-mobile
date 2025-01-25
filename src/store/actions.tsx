// redux/actions.js

import { type AnyAction } from 'redux';
import {
  type AmbientLightProps,
  type DirectionalLightProps,
  type SpotLightProps,
} from '../AR/LightInterfaces';
import { type Project } from '../api/types';
import { type Object3D } from '../AR/Interfaces';

export const ADD_AMBIENT_LIGHT = 'ADD_AMBIENT_LIGHT';
export const UPDATE_AMBIENT_LIGHT = 'UPDATE_AMBIENT_LIGHT';
export const REMOVE_AMBIENT_LIGHT = 'REMOVE_AMBIENT_LIGHT';

export const ADD_DIRECTIONAL_LIGHT = 'ADD_DIRECTIONAL_LIGHT';
export const UPDATE_DIRECTIONAL_LIGHT = 'UPDATE_DIRECTIONAL_LIGHT';
export const REMOVE_DIRECTIONAL_LIGHT = 'REMOVE_DIRECTIONAL_LIGHT';

export const ADD_SPOT_LIGHT = 'ADD_SPOT_LIGHT';
export const UPDATE_SPOT_LIGHT = 'UPDATE_SPOT_LIGHT';
export const REMOVE_SPOT_LIGHT = 'REMOVE_SPOT_LIGHT';
export const HIDE_SPOT_LIGHT = 'HIDE_SPOT_LIGHT';

export const RESET_LIGHTS = 'RESET_LIGHTS';
export const SET_SAVE_LIGHTS = 'SET_SAVE_LIGHTS';

export const SET_ORIENTATION = 'SET_ORIENTATION';
export const SET_TRANSLATION = 'SET_TRANSLATION';
export const SET_SCALE = 'SET_SCALE';
export const RESET_SCENE_STATE = 'REDET_SCENE_STATE';

export const SET_PROJECT = 'SET_PROJECT';
export const SET_MODELS = 'SET_MODELS';
export const UPDATE_MODEL = 'UPDATE_MODEL';

export const SET_AUTO_SAVE = 'SET_AUTO_SAVE';
export const SET_UNSAVED_CHANGES = 'SET_UNSAVED_CHANGES';
export const SET_STEP_SIZE = 'SET_STEP_SIZE';
export const SET_ANGLE_STEP_SIZE = 'SET_ANGLE_STEP_SIZE';
export const SET_CORNERS_VISIBLE = 'SET_CORNERS_VISIBLE';

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

export const hideSpotLight = (id: number): AnyAction => ({
  type: HIDE_SPOT_LIGHT,
  payload: { id, properties: null },
});

export const resetLightsState = (): AnyAction => ({
  type: RESET_LIGHTS,
  payload: { id: 0, properties: null },
});

export const setSaveLights = (save: boolean): AnyAction => ({
  type: SET_SAVE_LIGHTS,
  payload: save,
});

export const setTranslation = (translation: any): AnyAction => ({
  type: SET_TRANSLATION,
  payload: translation,
});

export const setOrientation = (orientation: any): AnyAction => ({
  type: SET_ORIENTATION,
  payload: orientation,
});

export const setScale = (scale: any): AnyAction => ({
  type: SET_SCALE,
  payload: scale,
});

export const setProject = ({
  id,
  project,
}: {
  id: string;
  project: Project;
}): AnyAction => ({
  type: SET_PROJECT,
  payload: { id, project },
});

export const setModels = (models: any): AnyAction => ({
  type: SET_MODELS,
  payload: models,
});

export const updateModel = (index: number, newModel: Object3D): AnyAction => ({
  type: UPDATE_MODEL,
  payload: { index, newModel },
});

export const setAutoSave = (autoSave: boolean): AnyAction => ({
  type: SET_AUTO_SAVE,
  payload: autoSave,
});

export const setUnsavedChanges = (unsavedChanges: boolean): AnyAction => ({
  type: SET_UNSAVED_CHANGES,
  payload: unsavedChanges,
});

export const setCornersVisible = (visible: boolean): AnyAction => ({
  type: SET_CORNERS_VISIBLE,
  payload: visible,
});

export const setStepSize = (stepSize: number): AnyAction => ({
  type: SET_STEP_SIZE,
  payload: stepSize,
});

export const setAngleStepSize = (stepSize: number): AnyAction => ({
  type: SET_ANGLE_STEP_SIZE,
  payload: stepSize,
});

export const resetSceneState = (): AnyAction => ({
  type: RESET_SCENE_STATE,
  payload: null,
});
