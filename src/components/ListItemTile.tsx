import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { purple2 } from '../styles/colors';

interface ListItemTileProps {
  id: number;
  title: string;
  onEdit: () => void;
  onDelete?: () => void;
  onHide?: () => void;
  hideIconName?: string;
  color?: string;
}

const ListItemTile = ({
  title,
  onEdit,
  onDelete,
  onHide,
  hideIconName,
  color,
}: ListItemTileProps): JSX.Element => (
  <TouchableOpacity onPress={onEdit} style={styles.card}>
    <Text style={styles.title}>{title}</Text>
    {color && <View style={[styles.colorBox, { backgroundColor: color }]} />}
    <View style={styles.iconContainer}>
      <TouchableOpacity onPress={onEdit} style={styles.iconButton}>
        <Icon name="edit" size={20} color={purple2} />
      </TouchableOpacity>
      {onHide && (
        <TouchableOpacity onPress={onHide} style={styles.iconButton}>
          <Icon name={hideIconName} size={20} color={purple2} />
        </TouchableOpacity>
      )}
      {onDelete && (
        <TouchableOpacity onPress={onDelete} style={styles.iconButton}>
          <Icon name="trash" size={20} color={purple2} />
        </TouchableOpacity>
      )}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    marginVertical: 5,
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
  colorBox: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 4,
  },
});

export default ListItemTile;
