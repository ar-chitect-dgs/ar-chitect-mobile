import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Button, StyleSheet } from 'react-native';
import FormattedText from '../../components/FormattedText';

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
  const { t } = useTranslation();

  return (
    <View style={styles.lightItem} key={id.toString()}>
      <FormattedText>{title.slice(0, -1)}</FormattedText>
      <Button title={t('panels.edit')} onPress={onEdit} />
      <Button title={t('panels.delete')} onPress={onDelete} />
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
