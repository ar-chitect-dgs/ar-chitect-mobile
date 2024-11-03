import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface LightListProps<T> {
  lights: T[];
  title: string;
  onAdd: () => void;
  onEdit: (light: T) => void;
  onDelete: (id: number) => void;
}

const LightList = <T extends { id: number; color: string }>({
  lights,
  title,
  onAdd,
  onEdit,
  onDelete,
}: LightListProps<T>) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Button title={`Add ${title.slice(0, -1)}`} onPress={onAdd} />
      </View>
      {lights.map((light) => (
        <View style={styles.lightItem} key={light.id.toString()}>
          <Text style={{ color: light.color }}>{title.slice(0, -1)}</Text>
          <Button title="Edit" onPress={() => onEdit(light)} />
          <Button title="Delete" onPress={() => onDelete(light.id)} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
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
  lightItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
  },
});

export default LightList;
