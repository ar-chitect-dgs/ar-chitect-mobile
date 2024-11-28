import React from 'react';
import { Text, type TextProps, StyleSheet, type TextStyle } from 'react-native';

interface FormattedTextProps extends TextProps {
  style?: TextStyle | TextStyle[];
}

const FormattedText: React.FC<FormattedTextProps> = ({
  style,
  children,
  ...rest
}) => {
  return (
    <Text style={[styles.defaultText, style]} {...rest}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  defaultText: {
    fontFamily: 'Lexend-Regular',
    color: 'black',
  },
});

export default FormattedText;
