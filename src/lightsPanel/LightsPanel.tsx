import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  hideSpotLight,
  removeAmbientLight,
  removeDirectionalLight,
  removeSpotLight,
} from '../store/actions';
import { type Reducer } from '../store/reducers';
import {
  type AmbientLightProps,
  type DirectionalLightProps,
  type SpotLightProps,
} from '../AR/LightInterfaces';
import AmbientLightModal from './AmbientLightModal';
import SpotLightModal from './SpotLightModal';
import DirectionalLightModal from './DirectionalLightModal';
import LightList from './LightList';

const sampleAmbientLight: AmbientLightProps = {
  id: -1,
  name: 'Ambient light',
  color: '#FFFFFF',
  intensity: 1000,
  isVisible: true,
};
const sampleDirectionalLight: DirectionalLightProps = {
  id: -1,
  name: 'Directional light',
  color: '#FFFFFF',
  intensity: 1000,
  direction: [-2, 0, -3],
  castsShadow: false,
  isVisible: true,
};
const sampleSpotLight: SpotLightProps = {
  id: -1,
  name: 'Spot light',
  color: '#FFFFFF',
  intensity: 1000,
  position: [0, 0, 0],
  direction: [-2, 0, -3],
  innerAngle: 0,
  outerAngle: 45,
  attenuationStartDistance: 10,
  attenuationEndDistance: 20,
  castsShadow: false,
  isVisible: true,
};

interface PanelProps {
  snapPoint: string;
}

const LightsPanel: React.FC<PanelProps> = ({ snapPoint }: PanelProps) => {
  const [selectedAmbientLight, setSelectedAmbientLight] =
    useState<AmbientLightProps>(sampleAmbientLight);
  const [selectedSpotLight, setSelectedSpotLight] =
    useState<SpotLightProps>(sampleSpotLight);
  const [selectedDirectionalLight, setSelectedDirectionalLight] =
    useState<DirectionalLightProps>(sampleDirectionalLight);
  const [isModalVisible, setIsModalVisible] = useState({
    ambientLightModal: false,
    directionalLightModal: false,
    spotlightModal: false,
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const dispatch = useDispatch();
  const { ambientLights, directionalLights, spotLights } = useSelector(
    (state: Reducer) => state.lightConfig,
  );

  const handleAddAmbientLight = (): void => {
    setSelectedAmbientLight(sampleAmbientLight);
    setIsModalVisible({ ...isModalVisible, ambientLightModal: true });
    setIsEditing(false);
  };

  const handleAddDirectionalLight = (): void => {
    setSelectedDirectionalLight(sampleDirectionalLight);
    setIsModalVisible({ ...isModalVisible, directionalLightModal: true });
    setIsEditing(false);
  };

  const handleAddSpotLight = (): void => {
    setSelectedSpotLight(sampleSpotLight);
    setIsModalVisible({ ...isModalVisible, spotlightModal: true });
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      <LightList
        lights={ambientLights}
        title="Ambient Lights"
        onAdd={handleAddAmbientLight}
        onEdit={(light) => {
          setSelectedAmbientLight(light);
          setIsModalVisible({ ...isModalVisible, ambientLightModal: true });
          setIsEditing(true);
        }}
        onDelete={(id) => dispatch(removeAmbientLight(id))}
      />
      <AmbientLightModal
        isVisible={isModalVisible.ambientLightModal}
        isEditing={isEditing}
        onClose={() => {
          setIsModalVisible({
            ambientLightModal: false,
            directionalLightModal: false,
            spotlightModal: false,
          });
        }}
        selectedLight={selectedAmbientLight}
        snapPoint={snapPoint}
      />

      <LightList
        lights={directionalLights}
        title="Directional Lights"
        onAdd={handleAddDirectionalLight}
        onEdit={(light) => {
          setSelectedDirectionalLight(light);
          setIsModalVisible({ ...isModalVisible, directionalLightModal: true });
          setIsEditing(true);
        }}
        onDelete={(id) => dispatch(removeDirectionalLight(id))}
      />
      <DirectionalLightModal
        isVisible={isModalVisible.directionalLightModal}
        isEditing={isEditing}
        onClose={() => {
          setIsModalVisible({
            ambientLightModal: false,
            directionalLightModal: false,
            spotlightModal: false,
          });
        }}
        selectedLight={selectedDirectionalLight}
        snapPoint={snapPoint}
      />

      <LightList
        lights={spotLights}
        title="Spot Lights"
        onAdd={handleAddSpotLight}
        onEdit={(light) => {
          setSelectedSpotLight(light);
          setIsModalVisible({ ...isModalVisible, spotlightModal: true });
          setIsEditing(true);
        }}
        onDelete={(id) => dispatch(removeSpotLight(id))}
        onHide={(id) => dispatch(hideSpotLight(id))}
      />
      <SpotLightModal
        isVisible={isModalVisible.spotlightModal}
        isEditing={isEditing}
        onClose={() => {
          setIsModalVisible({
            ambientLightModal: false,
            directionalLightModal: false,
            spotlightModal: false,
          });
        }}
        selectedLight={selectedSpotLight}
        snapPoint={snapPoint}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  lightItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LightsPanel;
