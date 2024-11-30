import React from 'react';
import { View, StyleSheet, TouchableOpacity, Button, Text } from 'react-native';

interface ListItemTileProps {
  id: number;
  title: string;
  onEdit: () => void;
  onDelete: () => void;
}

const ListItemTile = ({
  id,
  title,
  onEdit,
  onDelete,
}: ListItemTileProps): JSX.Element => (
  <TouchableOpacity style={styles.card} onPress={onEdit}>
    <Text style={styles.title}>{title.slice(0, -1)}</Text>
    <Button title="Delete" onPress={onDelete} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    margin: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    shadowColor: '#ccc',
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    color: 'black',
  },
});

export default ListItemTile;
