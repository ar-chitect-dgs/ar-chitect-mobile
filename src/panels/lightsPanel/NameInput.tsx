import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import FormattedText from '../../components/FormattedText';

interface NameInputProps {
  title: string;
  value: string;
  setName: (value: string) => void;
}

const NameInput = ({ title, value, setName }: NameInputProps): JSX.Element => {
  return (
    <View style={styles.inputContainer}>
      <FormattedText style={styles.label}>{title}</FormattedText>
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={(name) => {
          setName(name);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    width: '50%',
    color: '#000',
  },
  textInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#000',
  },
  label: {
    color: '#000',
    marginRight: 10,
  },
});

export default NameInput;
