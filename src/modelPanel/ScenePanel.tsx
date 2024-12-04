import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { type Reducer, type LocationState } from '../store/reducers';
import { setTranslation } from '../store/actions';
import { type Vector3D } from '../AR/Interfaces';
import EditSlider from '../lightsPanel/EditSlider';

const ScenePanel: React.FC = () => {
  const locationConfig: LocationState = useSelector(
    (state: Reducer) => state.locationConfig,
  );
  const { translation, orientation } = locationConfig;

  const dispatch = useDispatch();

  const handlePositionChange = (axis: keyof Vector3D, value: number): void => {
    dispatch(
      setTranslation({
        ...translation,
        [axis]: value,
      }),
    );
  };

  const axes: Array<keyof Vector3D> = ['x', 'y', 'z'];
  return (
    <View style={styles.container}>
      {axes.map((axis) => (
        <EditSlider
          key={axis}
          title={`${axis.toUpperCase()} translation`}
          value={translation[axis]}
          setValue={(value: number) => {
            handlePositionChange(axis, value);
          }}
          minimumValue={-10}
          maximumValue={10}
          step={0.5}
        />
      ))}
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
