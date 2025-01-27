import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  hideSpotLight,
  removeAmbientLight,
  removeDirectionalLight,
  removeSpotLight,
} from '../../store/actions';
import { type Reducer } from '../../store/reducers';
import {
  type AmbientLightProps,
  type DirectionalLightProps,
  type SpotLightProps,
} from '../../AR/LightInterfaces';
import AmbientLightModal from './AmbientLightModal';
import SpotLightModal from './SpotLightModal';
import DirectionalLightModal from './DirectionalLightModal';
import LightList from './LightList';
import { useTranslation } from 'react-i18next';

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
  isVisible: false,
};

interface PanelProps {
  snapPoint: string;
}

const LightsPanel: React.FC<PanelProps> = ({ snapPoint }: PanelProps) => {
  const [isModalVisible, setIsModalVisible] = useState({
    selectedAmbientLight: sampleAmbientLight,
    ambientLightModal: false,
    selectedDirectionalLight: sampleDirectionalLight,
    directionalLightModal: false,
    selectedSpotLight: sampleSpotLight,
    spotlightModal: false,
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { ambientLights, directionalLights, spotLights } = useSelector(
    (state: Reducer) => state.lightConfig,
  );
  const { stepSize, angleStepSize } = useSelector(
    (state: Reducer) => state.settingsConfig,
  );

  const handleAddAmbientLight = (): void => {
    setIsModalVisible({
      ...isModalVisible,
      ambientLightModal: true,
      selectedAmbientLight: sampleAmbientLight,
    });
    setIsEditing(false);
  };

  const handleAddDirectionalLight = (): void => {
    setIsModalVisible({
      ...isModalVisible,
      directionalLightModal: true,
      selectedDirectionalLight: sampleDirectionalLight,
    });
    setIsEditing(false);
  };

  const handleAddSpotLight = (): void => {
    setIsModalVisible({
      ...isModalVisible,
      spotlightModal: true,
      selectedSpotLight: sampleSpotLight,
    });
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      <LightList
        lights={ambientLights}
        title={`${t('lightsPanel.ambientLights')}`}
        lightName={`${t('lightsPanel.ambientLight')}`}
        onAdd={handleAddAmbientLight}
        onEdit={(light) => {
          setIsEditing(true);
          setIsModalVisible({
            ...isModalVisible,
            ambientLightModal: true,
            selectedAmbientLight: light,
          });
        }}
        onDelete={(id) => dispatch(removeAmbientLight(id))}
      />
      <AmbientLightModal
        isVisible={isModalVisible.ambientLightModal}
        isEditing={isEditing}
        stepSize={stepSize}
        onClose={() => {
          setIsModalVisible({
            ...isModalVisible,
            ambientLightModal: false,
            directionalLightModal: false,
            spotlightModal: false,
          });
        }}
        selectedLight={isModalVisible.selectedAmbientLight}
        snapPoint={snapPoint}
      />

      <LightList
        lights={directionalLights}
        title={`${t('lightsPanel.directionalLights')}`}
        lightName={`${t('lightsPanel.directionalLight')}`}
        onAdd={handleAddDirectionalLight}
        onEdit={(light) => {
          setIsEditing(true);
          setIsModalVisible({
            ...isModalVisible,
            directionalLightModal: true,
            selectedDirectionalLight: light,
          });
        }}
        onDelete={(id) => dispatch(removeDirectionalLight(id))}
      />
      <DirectionalLightModal
        isVisible={isModalVisible.directionalLightModal}
        isEditing={isEditing}
        stepSize={stepSize}
        onClose={() => {
          setIsModalVisible({
            ...isModalVisible,
            ambientLightModal: false,
            directionalLightModal: false,
            spotlightModal: false,
          });
        }}
        selectedLight={isModalVisible.selectedDirectionalLight}
        snapPoint={snapPoint}
      />

      <LightList
        lights={spotLights}
        title={`${t('lightsPanel.spotLights')}`}
        lightName={`${t('lightsPanel.spotLight')}`}
        onAdd={handleAddSpotLight}
        onEdit={(light) => {
          setIsEditing(true);
          setIsModalVisible({
            ...isModalVisible,
            spotlightModal: true,
            selectedSpotLight: light,
          });
        }}
        onDelete={(id) => dispatch(removeSpotLight(id))}
        onHide={(id) => dispatch(hideSpotLight(id))}
      />
      <SpotLightModal
        isVisible={isModalVisible.spotlightModal}
        isEditing={isEditing}
        stepSize={stepSize}
        angleStepSize={angleStepSize}
        onClose={() => {
          setIsModalVisible({
            ...isModalVisible,
            ambientLightModal: false,
            directionalLightModal: false,
            spotlightModal: false,
          });
        }}
        selectedLight={isModalVisible.selectedSpotLight}
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
