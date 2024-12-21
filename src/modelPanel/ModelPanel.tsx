import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { type Reducer } from '../store/reducers';
import ListItemTile from '../components/ListItemTile';
import ModelModal from './ModelModal';
import { type Object3D } from '../AR/Interfaces';
import { updateModel } from '../store/actions';

interface PanelProps {
  snapPoint: string;
}

const ModelPanel: React.FC<PanelProps> = ({ snapPoint }: PanelProps) => {
  const { models } = useSelector((state: Reducer) => state.projectConfig);
  const dispatch = useDispatch();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Object3D | null>(null);
  const [selectedId, setSelectedId] = useState(0);

  const handleModelClick = (id: number, model: Object3D): void => {
    setSelectedId(id);
    setSelectedModel(model);
    setIsModalVisible(true);
  };

  const handleToggleHideModel = (id: number, model: Object3D): void => {
    const visible = model.isVisible;
    dispatch(
      updateModel(id, {
        ...model,
        isVisible: !visible,
      }),
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Models:</Text>
      </View>
      {models.map((model, index) => (
        <ListItemTile
          key={index}
          id={index}
          title={`${model.name} (x: ${model.position.x}, y: ${model.position.y}, z: ${model.position.z})`}
          onDelete={() => {
            handleToggleHideModel(index, model);
          }}
          onEdit={() => {
            handleModelClick(index, model);
          }}
          deleteIconName={model.isVisible ? 'eye' : 'eye-slash'}
        />
      ))}
      {selectedModel && (
        <ModelModal
          snapPoint={snapPoint}
          isVisible={isModalVisible}
          onClose={() => {
            setIsModalVisible(false);
          }}
          selectedModel={selectedModel}
          id={selectedId}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default ModelPanel;
