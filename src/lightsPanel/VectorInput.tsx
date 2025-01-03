import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface VectorInputProps {
  title: string;
  value: [string, string, string];
  setVectorInputs: (value: [string, string, string]) => void;
  error: boolean[];
}

const VectorInput = ({
  title,
  value,
  setVectorInputs,
  error,
}: VectorInputProps): JSX.Element => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{title}:</Text>
      <View style={styles.inputRow}>
        {['X', 'Y', 'Z'].map((axis, index) => (
          <View key={index} style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, error[index] && styles.inputError]}
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
            {error[index] && (
              <Text style={styles.errorText}>Invalid {axis} value</Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: '100%',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 10,
    color: '#000',
    fontSize: 14,
    borderRadius: 5,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 2,
  },
  label: {
    color: '#000',
    fontSize: 16,
    marginBottom: 5,
  },
});

export default VectorInput;
