import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import FormattedText from '../../components/FormattedText';

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
      <FormattedText style={styles.label}>{title}:</FormattedText>
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
              placeholder={`${axis}`}
              placeholderTextColor="#999"
            />
            {error[index] && (
              <FormattedText style={styles.errorText}>
                Invalid {axis} value
              </FormattedText>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
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
    marginRight: 10,
  },
});

export default VectorInput;
