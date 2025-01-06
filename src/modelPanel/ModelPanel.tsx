import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { type Reducer } from '../store/reducers';
import ListItemTile from '../components/ListItemTile';
import ModelModal from './ModelModal';
import { type Object3D } from '../AR/Interfaces';
import { updateModel } from '../store/actions';
import { saveProject } from '../api/projectsApi';
import { useAuth } from '../hooks/useAuth';
import ErrorPopup from '../components/ErrorPopup';
import FilledButton from '../components/FilledButton';

interface PanelProps {
  snapPoint: string;
}

interface SelectedModel {
  id: number;
  model: Object3D;
}

const ModelPanel: React.FC<PanelProps> = ({ snapPoint }: PanelProps) => {
  const { models, project } = useSelector(
    (state: Reducer) => state.projectConfig,
  );
  const dispatch = useDispatch();

  const { user } = useAuth();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [alert, setAlert] = useState({
    isVisible: false,
    message: '',
  });
  const [selectedModel, setSelectedModel] = useState<SelectedModel | null>(
    null,
  );

  const handleModelClick = (id: number, model: Object3D): void => {
    setSelectedModel({ id, model });
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

  const handleSelectModel = (
    id: number,
    model: Object3D,
    select: boolean,
  ): void => {
    dispatch(
      updateModel(id, {
        ...model,
        isSelected: select,
      }),
    );
  };

  const handleSave = (): void => {
    if (!user || !project) {
      return;
    }
    saveProject(user?.uid, project?.id, project?.objects, models).catch(() => {
      setAlert({
        isVisible: true,
        message: 'Error saving changes.',
      });
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Models:</Text>
      </View>
      {Object.entries(models).map(([key, model]) => {
        const numericKey = Number(key);
        return (
          <ListItemTile
            key={numericKey}
            id={numericKey}
            title={`${model.modelName} (x: ${model.position.x.toFixed(1)}, y: ${model.position.y.toFixed(1)}, z: ${model.position.z.toFixed(1)})`}
            onDelete={() => {
              handleToggleHideModel(numericKey, model);
            }}
            onEdit={() => {
              const selected = { ...model, isSelected: true };
              handleSelectModel(numericKey, selected, true);
              handleModelClick(numericKey, selected);
            }}
            deleteIconName={model.isVisible ? 'eye' : 'eye-slash'}
          />
        );
      })}

      {selectedModel && (
        <ModelModal
          snapPoint={snapPoint}
          isVisible={isModalVisible}
          onClose={() => {
            setSelectedModel(null);
            setIsModalVisible(false);
          }}
          selectedModel={selectedModel.model}
          id={selectedModel.id}
        />
      )}
      <View style={styles.header}>
        <FilledButton onPress={handleSave} title="Save" />
      </View>
      <ErrorPopup
        isVisible={alert.isVisible}
        message={alert.message}
        onClose={() => {
          setAlert((prev) => ({
            ...prev,
            isVisible: false,
          }));
        }}
      />
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
