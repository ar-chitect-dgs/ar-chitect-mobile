import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { type Reducer } from '../../store/reducers';
import ListItemTile from '../../components/ListItemTile';
import ModelModal from './ModelModal';
import { type Object3D } from '../../AR/Interfaces';
import { setUnsavedChanges, updateModel } from '../../store/actions';
import { saveProject } from '../../api/projectsApi';
import { useAuth } from '../../hooks/useAuth';
import ErrorPopup from '../../components/ErrorPopup';
import FilledButton from '../../components/FilledButton';
import { useTranslation } from 'react-i18next';
import FormattedText from '../../components/FormattedText';
import { ScrollView } from 'react-native-gesture-handler';

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
  const { autoSave, stepSize } = useSelector(
    (state: Reducer) => state.settingsConfig,
  );
  const dispatch = useDispatch();
  const { t } = useTranslation();
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

  const handleSave = async (): Promise<void> => {
    if (!user || !project) {
      return;
    }
    try {
      await saveProject(user?.uid, project?.id, project?.objects, models);
      dispatch(setUnsavedChanges(false));
    } catch (error) {
      setAlert({
        isVisible: true,
        message: t('panels.errorSaving'),
      });
    }
  };

  useEffect(() => {
    let autoSaveInterval: NodeJS.Timeout | null = null;

    if (autoSave) {
      autoSaveInterval = setInterval(async () => {
        await handleSave();
      }, 30000);
    }

    return () => {
      if (autoSaveInterval !== null) {
        clearInterval(autoSaveInterval);
      }
    };
  }, [autoSave, dispatch, models]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FormattedText
          style={styles.title}
        >{`${t('panels.models')}`}</FormattedText>
      </View>
      <ScrollView>
        {Object.entries(models).map(([key, model]) => {
          const numericKey = Number(key);
          return (
            <ListItemTile
              key={numericKey}
              id={numericKey}
              title={`${model.modelName} (x: ${model.position.x.toFixed(1)}, y: ${model.position.y.toFixed(1)}, z: ${model.position.z.toFixed(1)})`}
              onHide={() => {
                handleToggleHideModel(numericKey, model);
              }}
              onEdit={() => {
                const selected = { ...model, isSelected: true };
                handleSelectModel(numericKey, selected, true);
                handleModelClick(numericKey, selected);
              }}
              hideIconName={model.isVisible ? 'eye' : 'eye-slash'}
            />
          );
        })}
        {selectedModel && (
          <ModelModal
            snapPoint={snapPoint}
            stepSize={stepSize}
            isVisible={isModalVisible}
            onClose={() => {
              setSelectedModel(null);
              setIsModalVisible(false);
            }}
            selectedModel={selectedModel.model}
            id={selectedModel.id}
          />
        )}
      </ScrollView>
      <View style={styles.save}>
        <FilledButton onPress={handleSave} title={t('panels.save')} />
      </View>
      <ErrorPopup
        isVisible={alert.isVisible}
        title={t('error.title')}
        message={alert.message}
        onClose={() => {
          setAlert((prev) => ({
            ...prev,
            isVisible: false,
          }));
        }}
        closeText="OK"
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
  save: {
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default ModelPanel;
