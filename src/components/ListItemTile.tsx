import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

interface ListItemTileProps {
  id: number;
  title: string;
  onEdit: () => void;
  onDelete: () => void;
  deleteIconName: string;
}

const ListItemTile = ({
  title,
  onEdit,
  onDelete,
  deleteIconName,
}: ListItemTileProps): JSX.Element => (
  <TouchableOpacity onPress={onEdit} style={styles.card}>
    <Text style={styles.title}>{title}</Text>
    <View style={styles.iconContainer}>
      <TouchableOpacity onPress={onEdit} style={styles.iconButton}>
        <Icon name="edit" size={20} color="blue" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onDelete} style={styles.iconButton}>
        <Icon name={deleteIconName} size={20} color="blue" />
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    margin: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    flex: 1,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
  },
});

export default ListItemTile;
