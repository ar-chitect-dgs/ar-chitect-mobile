import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setSaveLights, setAutoSave } from '../store/actions';
import i18n from '../locales/i18n';
import { headerColor, opaquePurple2, purple2 } from '../styles/colors';

// Define keys for AsyncStorage
const SAVE_LIGHTS_KEY = 'saveLights';
const AUTO_SAVE_KEY = 'autoSave';
const LANGUAGE_KEY = 'language';

const SettingsScreen: React.FC = () => {
  const dispatch = useDispatch();

  const [saveLightsEnabled, setSaveLightsEnabled] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);
  const [language, setLanguage] = useState(i18n.language);

  useEffect(() => {
    const loadSettings = async (): Promise<void> => {
      try {
        // Load all settings from AsyncStorage
        const savedSaveLights = await AsyncStorage.getItem(SAVE_LIGHTS_KEY);
        const savedAutoSave = await AsyncStorage.getItem(AUTO_SAVE_KEY);
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);

        if (savedSaveLights !== null) {
          const saveLightsValue = JSON.parse(savedSaveLights);
          setSaveLightsEnabled(saveLightsValue);
          dispatch(setSaveLights(saveLightsValue));
        }

        if (savedAutoSave !== null) {
          const autoSaveValue = JSON.parse(savedAutoSave);
          setAutoSaveEnabled(autoSaveValue);
          dispatch(setAutoSave(autoSaveValue));
        }

        if (savedLanguage !== null) {
          setLanguage(savedLanguage);
          await i18n.changeLanguage(savedLanguage);
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
      setLanguage(value);
      await i18n.changeLanguage(value);
      await AsyncStorage.setItem(LANGUAGE_KEY, value);
    } catch (error) {
      console.error('Failed to save language setting:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{i18n.t('settings.header')}</Text>

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
        <Text style={styles.label}>{i18n.t('settings.language')}</Text>
        <Picker
          selectedValue={language}
          style={styles.picker}
          onValueChange={handleLanguageChange}
        >
          <Picker.Item label="English" value="en" />
          <Picker.Item label="Polski" value="pl" />
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
});

export default SettingsScreen;
