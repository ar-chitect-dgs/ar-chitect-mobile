import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { updateModel } from '../store/actions';
import { type Vector3D, type Object3D } from '../AR/Interfaces';
import EditSlider from '../lightsPanel/EditSlider';
import EditingModal from '../components/EditingModal';

interface ModelModalProps {
  isVisible: boolean;
  onClose: () => void;
  id: number;
  selectedModel: Object3D;
  snapPoint: string;
}

const ModelModal: React.FC<ModelModalProps> = ({
  isVisible,
  onClose,
  id,
  selectedModel,
  snapPoint,
}) => {
  const [model, setModel] = useState<Object3D>(selectedModel);
  const dispatch = useDispatch();

  // Funkcja do zmiany pozycji modelu
  const handlePositionChange = (axis: keyof Vector3D, value: number): void => {
    const newModel: Object3D = {
      ...model,
      position: {
        ...model.position,
        [axis]: value,
      },
    };
    setModel(newModel);
    dispatch(updateModel(id, newModel));
  };

  // Funkcja do zmiany nazwy modelu
  const handleNameChange = (newName: string): void => {
    const newModel: Object3D = {
      ...model,
      modelName: newName,
    };
    setModel(newModel);
    dispatch(updateModel(id, newModel));
  };

  const axes: Array<keyof Vector3D> = ['x', 'y', 'z'];

  return (
    <EditingModal isVisible={isVisible} snapPoint={snapPoint} onClose={onClose}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Model Name: </Text>
        <TextInput
          style={styles.textInput}
          value={model.modelName}
          onChangeText={handleNameChange}
        />
      </View>
      {axes.map((axis) => (
        <EditSlider
          key={axis}
          title={`${axis.toUpperCase()} Position`}
          value={model.position[axis]}
          setValue={(newValue: number) => {
            handlePositionChange(axis, newValue);
          }}
          minimumValue={-10}
          maximumValue={10}
          step={0.1}
        />
      ))}
    </EditingModal>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    width: '50%',
    justifyContent: 'space-between',
    color: '#000',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000',
  },
  textInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#000',
  },
});

export default ModelModal;
