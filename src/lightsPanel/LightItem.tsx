import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface LightItemProps {
  id: number;
  title: string;
  onEdit: () => void;
  onDelete: () => void;
}

const LightItem = ({
  id,
  title,
  onEdit,
  onDelete,
}: LightItemProps): JSX.Element => {
  return (
    <View style={styles.lightItem} key={id.toString()}>
      <Text>{title.slice(0, -1)}</Text>
      <Button title="Edit" onPress={onEdit} />
      <Button title="Delete" onPress={onDelete} />
    </View>
  );
};

const styles = StyleSheet.create({
  lightItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
  },
});

export default LightItem;
