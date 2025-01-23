import Slider from '@react-native-community/slider';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { opaquePurple2, purple2 } from '../../styles/colors';
import FormattedText from '../../components/FormattedText';

interface EditSliderProps {
  title: string;
  value: number;
  setValue: (value: number) => void;
  onSlidingComplete?: () => void;
  minimumValue: number;
  maximumValue: number;
  step: number;
  sliderLength?: 'short' | 'long';
}

const EditSlider: React.FC<EditSliderProps> = ({
  title,
  value,
  setValue,
  onSlidingComplete,
  minimumValue,
  maximumValue,
  step,
  sliderLength = 'long',
}: EditSliderProps) => {
  const sliderWidth = sliderLength === 'short' ? '70%' : '75%';

  return (
    <>
      <View style={styles.inputContainer}>
        <FormattedText style={styles.label}>{title}:</FormattedText>
        <View style={styles.sliderContainer}>
          <Slider
            style={[styles.slider, { width: sliderWidth }]}
            minimumValue={minimumValue}
            maximumValue={maximumValue}
            step={step}
            value={value}
            onValueChange={(value) => {
              setValue(value);
            }}
            {...(onSlidingComplete && { onSlidingComplete })}
            minimumTrackTintColor={purple2}
            maximumTrackTintColor={opaquePurple2}
            thumbTintColor={purple2}
          />
          <FormattedText style={styles.value}>{value.toFixed(1)}</FormattedText>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
    justifyContent: 'space-between',
    color: '#000',
  },
  label: {
    color: '#000',
    marginRight: 10,
    fontSize: 16,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '70%',
    justifyContent: 'space-between',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    color: '#000',
    flex: 1,
    marginRight: 5,
  },
  slider: {
    height: 40,
  },
  value: {
    padding: 8,
    margin: 0,
    color: '#000',
    fontSize: 16,
  },
});

export default EditSlider;
