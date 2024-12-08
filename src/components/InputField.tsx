import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { textColor } from '../styles/colors';

interface InputFieldProps extends TextInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  placeholder,
  value,
  onChangeText,
  ...props
}) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor="#aaa"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
    color: textColor,
    borderRadius: 25,
    paddingHorizontal: 16,
    marginBottom: 28,
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
  },
});

export default InputField;
