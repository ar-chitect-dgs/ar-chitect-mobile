import React, { useState } from 'react';
import { Text, View, StyleSheet, Switch } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import {
  setSaveLights,
  setAutoSave,
  setStepSize,
  setAngleStepSize,
} from '../store/actions';
import { type Reducer } from '../store/reducers';

const SettingsScreen: React.FC = () => {
  const { autoSave, saveLights, stepSize, angleStepSize } = useSelector(
    (state: Reducer) => state.settingsConfig,
  );

  const dispatch = useDispatch();
  const [saveLightsEnabled, setSaveLightsEnabled] = useState(saveLights);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(autoSave);
  const [newStepSize, setNewStepSize] = useState(stepSize);
  const [newAngleStepSize, setNewAngleStepSize] = useState(angleStepSize);

  const handleSaveLightsToggle = (value: boolean): void => {
    setSaveLightsEnabled(value);
    dispatch(setSaveLights(value));
  };

  const handleAutoSaveToggle = (value: boolean): void => {
    setAutoSaveEnabled(value);
    dispatch(setAutoSave(value));
  };

  const handleSaveStepSize = (value: number): void => {
    setNewStepSize(value);
    dispatch(setStepSize(value));
  };

  const handleSaveAngleStepSize = (value: number): void => {
    setNewAngleStepSize(value);
    dispatch(setAngleStepSize(value));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      <View style={styles.settingRow}>
        <Text style={styles.label}>Save lights between scenes:</Text>
        <Switch
          value={saveLightsEnabled}
          onValueChange={handleSaveLightsToggle}
        />
      </View>

      <View style={styles.settingRow}>
        <Text style={styles.label}>Auto-save project (every 30s):</Text>
        <Switch value={autoSaveEnabled} onValueChange={handleAutoSaveToggle} />
      </View>

      <View style={styles.settingRow}>
        <Text style={styles.label}>Step size:</Text>
        <Picker
          selectedValue={newStepSize}
          style={styles.picker}
          itemStyle={styles.pickerItem}
          onValueChange={handleSaveStepSize}
        >
          <Picker.Item label="0.1m" value={0.1} />
          <Picker.Item label="0.5m" value={0.5} />
          <Picker.Item label="1m" value={1} />
          <Picker.Item label="5m" value={5} />
        </Picker>
      </View>
      <View style={styles.settingRow}>
        <Text style={styles.label}>Angle step size:</Text>
        <Picker
          selectedValue={newAngleStepSize}
          style={styles.picker}
          itemStyle={styles.pickerItem}
          onValueChange={handleSaveAngleStepSize}
        >
          <Picker.Item label="0.1" value={0.1} />
          <Picker.Item label="0.5" value={0.5} />
          <Picker.Item label="1" value={1} />
          <Picker.Item label="5" value={5} />
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  label: {
    fontSize: 18,
    color: '#333',
  },
  picker: {
    width: 150,
    height: 40,
    color: '#000',
  },
  pickerItem: {
    fontSize: 18,
    color: '#000',
  },
});

export default SettingsScreen;
