import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface VectorInputProps {
  title: string;
  value: [string, string, string];
  setVectorInputs: (value: [string, string, string]) => void;
}

const VectorInput = ({
  title,
  value,
  setVectorInputs,
}: VectorInputProps): JSX.Element => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{title} :</Text>
      {['X', 'Y', 'Z'].map((axis, index) => (
        <TextInput
          key={index}
          style={styles.input}
          keyboardType="numeric"
          value={value[index]}
          onChangeText={(text: string) => {
            const newInputs = [...value] as [string, string, string];
            newInputs[index] = text;
            setVectorInputs(newInputs);
          }}
          placeholder={`Enter ${axis} ${title}`}
          placeholderTextColor="#999"
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
    justifyContent: 'space-between',
    color: '#000',
  },
  input: {
    height: 30,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    width: '30%',
    color: '#000',
    marginHorizontal: 5,
    flexShrink: 1,
    fontSize: 12,
  },
  label: {
    color: '#000',
    marginRight: 10,
  },
});

export default VectorInput;
