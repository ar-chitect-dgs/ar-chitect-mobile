import Slider from '@react-native-community/slider';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface LightSliderProps {
  title: string;
  value: number;
  setValue: (value: number) => void;
  minimumValue: number;
  maximumValue: number;
  step: number;
}

const LightSlider: React.FC<LightSliderProps> = ({
  title,
  value,
  setValue,
  minimumValue,
  maximumValue,
  step,
}: LightSliderProps) => {
  return (
    <>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{title} :</Text>
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={minimumValue}
            maximumValue={maximumValue}
            step={step}
            value={value}
            onValueChange={(value) => {
              setValue(value);
            }}
          />
          <Text style={styles.label}>{value.toFixed(0)}</Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
    justifyContent: 'space-between',
    color: '#000',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 10,
    width: '30%',
    color: '#000',
    marginHorizontal: 5,
    flexShrink: 1,
  },
  label: {
    color: '#000',
    marginRight: 10,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    justifyContent: 'space-between',
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 5,
    color: '#000',
  },
  slider: {
    width: '70%',
    height: 40,
  },
});

export default LightSlider;
