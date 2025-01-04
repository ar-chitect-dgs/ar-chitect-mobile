import React, { useState } from 'react';
import { Text, View, StyleSheet, Switch } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setSaveLights, setAutoSave } from '../store/actions';
import { type Reducer } from '../store/reducers';

const SettingsScreen: React.FC = () => {
  const { autoSave } = useSelector((state: Reducer) => state.projectConfig);
  const { saveLights } = useSelector((state: Reducer) => state.lightConfig);

  const dispatch = useDispatch();
  const [saveLightsEnabled, setSaveLightsEnabled] = useState(saveLights);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(autoSave);

  const handleSaveLightsToggle = (value: boolean): void => {
    setSaveLightsEnabled(value);
    dispatch(setSaveLights(value));
  };

  const handleAutoSaveToggle = (value: boolean): void => {
    setAutoSaveEnabled(value);
    dispatch(setAutoSave(value));
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
});

export default SettingsScreen;
