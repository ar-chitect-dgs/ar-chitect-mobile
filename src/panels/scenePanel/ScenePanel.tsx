import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import {
  type settingsState,
  type ProjectState,
  type Reducer,
} from '../../store/reducers';
import SceneEditor from './SceneEditor';
import FilledButton from '../../components/FilledButton';
import { useTranslation } from 'react-i18next';

interface PanelProps {
  snapPoint: string;
}

const ScenePanel: React.FC<PanelProps> = ({ snapPoint }) => {
  const { translation, orientation, scale }: ProjectState = useSelector(
    (state: Reducer) => state.projectConfig,
  );
  const { stepSize }: settingsState = useSelector(
    (state: Reducer) => state.settingsConfig,
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { t } = useTranslation();

  const handleClick = (): void => {
    setIsModalVisible(true);
  };
  return (
    <View style={styles.container}>
      <FilledButton title={t('panels.editScene')} onPress={handleClick} />
      <SceneEditor
        orientation={orientation}
        translation={translation}
        scale={scale}
        stepSize={stepSize}
        snapPoint={snapPoint}
        isVisible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
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

export default ScenePanel;
