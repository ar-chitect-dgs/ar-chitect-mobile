import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import ListItemTile from '../components/ListItemTile';

interface LightListProps<T> {
  lights: T[];
  title: string;
  itemName: string;
  onAdd: () => void;
  onEdit: (light: T) => void;
  onDelete: (id: number) => void;
  onHide?: (id: number) => void;
}

const LightList = <
  T extends { id: number; color: string; isVisible: boolean },
>({
  lights,
  title,
  itemName,
  onAdd,
  onEdit,
  onDelete,
  onHide,
}: LightListProps<T>): JSX.Element => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Button title={`Add ${title.slice(0, -1)}`} onPress={onAdd} />
      </View>
      {lights.map((light, index) => (
        <ListItemTile
          key={index}
          id={light.id}
          title={itemName}
          onEdit={() => {
            onEdit(light);
          }}
          onHide={
            onHide
              ? () => {
                  onHide(light.id);
                }
              : undefined
          }
          hideIconName={light.isVisible ? 'eye' : 'eye-slash'}
          onDelete={() => {
            onDelete(light.id);
          }}
          color={light.color}
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
