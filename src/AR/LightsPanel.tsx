import React, { useState } from 'react';
import { View, Text, Button, Modal, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeAmbientLight,
  removeDirectionalLight,
  removeSpotLight,
} from '../store/actions';
import { Reducer } from '../store/reducers';
import {
  AmbientLightProps,
  DirectionalLightProps,
  SpotLightProps,
} from './LightInterfaces';
import AmbientLightModal from './AmbientLightModal';
import SpotLightModal from './SpotLightModal';
import DirectionalLightModal from './DirectionalLightModal';
import LightList from './LightList';

const sampleAmbientLight: AmbientLightProps = {
  id: -1,
  color: '#FFFFFF',
  intensity: 1000,
};
const sampleDirectionalLight: DirectionalLightProps = {
  id: -1,
  color: '#FFFFFF',
  intensity: 1000,
  direction: [-2, 0, -3],
  castsShadow: false,
};
const sampleSpotLight: SpotLightProps = {
  id: -1,
  color: '#FFFFFF',
  intensity: 1000,
  position: [0, 0, 0],
  direction: [-2, 0, -3],
  innerAngle: 0,
  outerAngle: 45,
  attenuationStartDistance: 10,
  attenuationEndDistance: 20,
  castsShadow: false,
};

const LightsPanel = () => {
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
  const [currentLightId, setCurrentLightId] = useState<number>(0);

  const dispatch = useDispatch();
  const { ambientLights, directionalLights, spotLights } = useSelector(
    (state: Reducer) => state.lightConfig,
  );

  const handleAddAmbientLight = () => {
    setSelectedAmbientLight(sampleAmbientLight);
    setIsModalVisible({ ...isModalVisible, ambientLightModal: true });
    setIsEditing(false);
  };

  const handleAddDirectionalLight = () => {
    setSelectedDirectionalLight(sampleDirectionalLight);
    setIsModalVisible({ ...isModalVisible, directionalLightModal: true });
    setIsEditing(false);
  };

  const handleAddSpotLight = () => {
    setSelectedSpotLight(sampleSpotLight);
    setIsModalVisible({ ...isModalVisible, spotlightModal: true });
    setIsEditing(false);
  };

  const handleDeleteAmbientLight = (id: number) => {
    dispatch(removeAmbientLight(id));
  };

  const handleDeleteSpotLight = (id: number) => {
    dispatch(removeSpotLight(id));
  };

  const handleDeleteDirectionalLight = (id: number) => {
    dispatch(removeDirectionalLight(id));
  };

  const handleEditAmbientLight = (light: AmbientLightProps) => {
    setSelectedAmbientLight(light);
    setIsModalVisible({ ...isModalVisible, ambientLightModal: true });
    setIsEditing(true);
  };

  const handleEditDirectionalLight = (light: DirectionalLightProps) => {
    setSelectedDirectionalLight(light);
    setIsModalVisible({ ...isModalVisible, directionalLightModal: true });
    setIsEditing(true);
  };

  const handleEditSpotLight = (light: SpotLightProps) => {
    setSelectedSpotLight(light);
    setIsModalVisible({ ...isModalVisible, spotlightModal: true });
    setIsEditing(true);
  };

  const renderAmbientLightItem = (item: AmbientLightProps) => (
    <View style={styles.lightItem} key={item.id.toString()}>
      <Text style={{ color: item.color }}>Ambient light</Text>
      <Button
        title="Edit"
        onPress={() => {
          setCurrentLightId(item.id);
          setSelectedAmbientLight(item);
          setIsModalVisible({ ...isModalVisible, ambientLightModal: true });
          setIsEditing(true);
        }}
      />
      <Button
        title="Delete"
        onPress={() => handleDeleteAmbientLight(item.id)}
      />
    </View>
  );

  const renderDirectionalLightItem = (item: DirectionalLightProps) => (
    <View style={styles.lightItem} key={item.id.toString()}>
      <Text style={{ color: item.color }}>Directional light</Text>
      <Button
        title="Edit"
        onPress={() => {
          setCurrentLightId(item.id);
          setSelectedDirectionalLight(item);
          setIsModalVisible({ ...isModalVisible, directionalLightModal: true });
          setIsEditing(true);
        }}
      />
      <Button
        title="Delete"
        onPress={() => handleDeleteDirectionalLight(item.id)}
      />
    </View>
  );

  const renderSpotLightItem = (item: SpotLightProps) => (
    <View style={styles.lightItem} key={item.id.toString()}>
      <Text style={{ color: item.color }}>Spot light</Text>
      <Button
        title="Edit"
        onPress={() => {
          setCurrentLightId(item.id);
          setSelectedSpotLight(item);
          setIsModalVisible({ ...isModalVisible, spotlightModal: true });
          setIsEditing(true);
        }}
      />
      <Button title="Delete" onPress={() => handleDeleteSpotLight(item.id)} />
    </View>
  );

  return (
    <View style={styles.container}>
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
        visible={isModalVisible.directionalLightModal}
        isEditing={isEditing}
        onClose={() =>
          setIsModalVisible({
            ambientLightModal: false,
            directionalLightModal: false,
            spotlightModal: false,
          })
        }
        selectedLight={selectedDirectionalLight}
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
      />
      <SpotLightModal
        visible={isModalVisible.spotlightModal}
        isEditing={isEditing}
        onClose={() =>
          setIsModalVisible({
            ambientLightModal: false,
            directionalLightModal: false,
            spotlightModal: false,
          })
        }
        selectedLight={selectedSpotLight}
      />

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
        visible={isModalVisible.ambientLightModal}
        isEditing={isEditing}
        onClose={() =>
          setIsModalVisible({
            ambientLightModal: false,
            directionalLightModal: false,
            spotlightModal: false,
          })
        }
        selectedLight={selectedAmbientLight}
      />
      {/* <View>
        <Button
          title="Add ambient light"
          onPress={() => {
            setIsModalVisible({ ...isModalVisible, ambientLightModal: true });
          }}
        />
        <Text>Ambient Lights</Text>
        {ambientLights.map((light) => renderAmbientLightItem(light))}
        <AmbientLightModal
          visible={isModalVisible.ambientLightModal}
          isEditing={isEditing}
          onClose={() => {
            setIsEditing(false);
            setIsModalVisible({
              ambientLightModal: false,
              directionalLightModal: false,
              spotlightModal: false,
            });
          }}
          selectedLight={selectedAmbientLight}
        />
      </View>
      <View>
        <Button
          title="Add directional light"
          onPress={() => {
            setIsModalVisible({
              ...isModalVisible,
              directionalLightModal: true,
            });
          }}
        />
        <Text>Directional Lights</Text>
        {directionalLights.map((light) => renderDirectionalLightItem(light))}
        <DirectionalLightModal
          visible={isModalVisible.directionalLightModal}
          isEditing={isEditing}
          onClose={() => {
            setIsModalVisible({
              ambientLightModal: false,
              directionalLightModal: false,
              spotlightModal: false,
            });
          }}
          selectedLight={selectedDirectionalLight}
        />
      </View>
      <View>
        <Button
          title="Add spot light"
          onPress={() => {
            setIsModalVisible({ ...isModalVisible, spotlightModal: true });
          }}
        />
        <Text>Spot Lights</Text>
        {spotLights.map((light) => renderSpotLightItem(light))}
        <SpotLightModal
          visible={isModalVisible.spotlightModal}
          isEditing={isEditing}
          onClose={() => {
            setIsEditing(false);
            setIsModalVisible({
              ambientLightModal: false,
              directionalLightModal: false,
              spotlightModal: false,
            });
          }}
          selectedLight={selectedSpotLight}
        />
      </View> */}
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
