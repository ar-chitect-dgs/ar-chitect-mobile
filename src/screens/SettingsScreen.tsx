import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  setSaveLights,
  setAutoSave,
  setStepSize,
  setAngleStepSize,
} from '../store/actions';
import i18n from '../locales/i18n';
import { headerColor, opaquePurple2, purple2 } from '../styles/colors';

// Define keys for AsyncStorage
const SAVE_LIGHTS_KEY = 'saveLights';
const AUTO_SAVE_KEY = 'autoSave';
const LANGUAGE_KEY = 'language';
const STEP_SIZE_KEY = 'stepSize';
const ANGLE_STEP_SIZE_KEY = 'angleStepSize';

const SettingsScreen: React.FC = () => {
  const { autoSave, saveLights, stepSize, angleStepSize } = useSelector(
    (state: any) => state.settingsConfig,
  );

  const dispatch = useDispatch();
  const [saveLightsEnabled, setSaveLightsEnabled] = useState(saveLights);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(autoSave);
  const [newStepSize, setNewStepSize] = useState(stepSize);
  const [newAngleStepSize, setNewAngleStepSize] = useState(angleStepSize);

  useEffect(() => {
    const loadSettings = async (): Promise<void> => {
      try {
        const savedStepSize = await AsyncStorage.getItem(STEP_SIZE_KEY);
        const savedAngleStepSize =
          await AsyncStorage.getItem(ANGLE_STEP_SIZE_KEY);

        if (savedStepSize !== null) {
          setNewStepSize(JSON.parse(savedStepSize));
          dispatch(setStepSize(JSON.parse(savedStepSize)));
        }

        if (savedAngleStepSize !== null) {
          setNewAngleStepSize(JSON.parse(savedAngleStepSize));
          dispatch(setAngleStepSize(JSON.parse(savedAngleStepSize)));
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };

    void loadSettings();
  }, [dispatch]);

  const handleSaveLightsToggle = async (value: boolean): Promise<void> => {
    try {
      setSaveLightsEnabled(value);
      dispatch(setSaveLights(value));
      await AsyncStorage.setItem(SAVE_LIGHTS_KEY, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save save lights setting:', error);
    }
  };

  const handleAutoSaveToggle = async (value: boolean): Promise<void> => {
    try {
      setAutoSaveEnabled(value);
      dispatch(setAutoSave(value));
      await AsyncStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save autoSave setting:', error);
    }
  };

  const handleLanguageChange = async (value: string): Promise<void> => {
    try {
      await i18n.changeLanguage(value);
      await AsyncStorage.setItem(LANGUAGE_KEY, value);
    } catch (error) {
      console.error('Failed to save language setting:', error);
    }
  };

  const handleSaveStepSize = async (value: number): Promise<void> => {
    try {
      setNewStepSize(value);
      dispatch(setStepSize(value));
      await AsyncStorage.setItem(STEP_SIZE_KEY, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save step size setting:', error);
    }
  };

  const handleSaveAngleStepSize = async (value: number): Promise<void> => {
    try {
      setNewAngleStepSize(value);
      dispatch(setAngleStepSize(value));
      await AsyncStorage.setItem(ANGLE_STEP_SIZE_KEY, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save angle step size setting:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{i18n.t('settings.header')}</Text>

      <View style={styles.settingRow}>
        <Text style={styles.label}>{i18n.t('settings.language')}</Text>
        <Picker
          selectedValue={i18n.language}
          style={styles.picker}
          onValueChange={handleLanguageChange}
        >
          <Picker.Item label="English" value="en" />
          <Picker.Item label="Polski" value="pl" />
        </Picker>
      </View>

      <View style={styles.settingRow}>
        <Text style={styles.label}>{i18n.t('settings.saveLights')}</Text>
        <Switch
          value={saveLightsEnabled}
          onValueChange={handleSaveLightsToggle}
          thumbColor={saveLightsEnabled ? opaquePurple2 : '#f4f3f4'}
          trackColor={{ false: '#989898', true: purple2 }}
        />
      </View>

      <View style={styles.settingRow}>
        <Text style={styles.label}>{i18n.t('settings.autoSave')}</Text>
        <Switch
          value={autoSaveEnabled}
          onValueChange={handleAutoSaveToggle}
          thumbColor={autoSaveEnabled ? opaquePurple2 : '#f4f3f4'}
          trackColor={{ false: '#989898', true: purple2 }}
        />
      </View>

      <View style={styles.settingRow}>
        <Text style={styles.label}>{i18n.t('settings.stepSize')}</Text>
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
        <Text style={styles.label}>{i18n.t('settings.angleStepSize')}</Text>
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
    backgroundColor: headerColor,
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
    marginBottom: 20,
    color: '#333',
  },
  label: {
    fontSize: 18,
    color: '#000',
  },
  picker: {
    height: 50,
    width: 150,
    backgroundColor: opaquePurple2,
    borderRadius: 20,
  },
  pickerItem: {
    fontSize: 18,
    color: '#000',
  },
});

export default SettingsScreen;
