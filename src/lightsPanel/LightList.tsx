import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ListItemTile from '../components/ListItemTile';
import MenuButton from '../components/MenuButton';

interface LightListProps<T> {
  lights: T[];
  title: string;
  itemName: string;
  onAdd: () => void;
  onEdit: (light: T) => void;
  onDelete: (id: number) => void;
}

const LightList = <T extends { id: number; color: string }>({
  lights,
  title,
  itemName,
  onAdd,
  onEdit,
  onDelete,
}: LightListProps<T>): JSX.Element => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <MenuButton title={`Add ${title.slice(0, -1)}`} onPress={onAdd} />
      </View>
      {lights.map((light, index) => (
        <ListItemTile
          key={index}
          id={light.id}
          title={itemName}
          onEdit={() => {
            onEdit(light);
          }}
          onDelete={() => {
            onDelete(light.id);
          }}
          deleteIconName="trash"
        />
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
});

export default LightList;
