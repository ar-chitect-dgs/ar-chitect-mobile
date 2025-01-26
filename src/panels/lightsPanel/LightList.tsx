import React from 'react';
import { View, StyleSheet } from 'react-native';
import ListItemTile from '../../components/ListItemTile';
import MenuButton from '../../components/MenuButton';
import { useTranslation } from 'react-i18next';
import FormattedText from '../../components/FormattedText';

interface LightListProps<T> {
  lights: T[];
  title: string;
  lightName: string;
  onAdd: () => void;
  onEdit: (light: T) => void;
  onDelete: (id: number) => void;
  onHide?: (id: number) => void;
}

const LightList = <
  T extends { id: number; color: string; name: string; isVisible: boolean },
>({
  lights,
  title,
  lightName,
  onAdd,
  onEdit,
  onDelete,
  onHide,
}: LightListProps<T>): JSX.Element => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FormattedText style={styles.title}>{title}</FormattedText>
        <MenuButton title={`${t('panels.add')} ${lightName}`} onPress={onAdd} />
      </View>
      {lights.map((light) => (
        <ListItemTile
          key={light.id}
          id={light.id}
          title={light.name}
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
