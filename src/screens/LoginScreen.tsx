import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import { headerColor, pinkAccent, purple2, textColor } from '../styles/colors';
import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';

const LoginScreen: React.FC = ({ navigation }: any) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (): Promise<void> => {
    if (email === '' || password === '') {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      await auth().signInWithEmailAndPassword(email, password);
      Alert.alert('Success', 'Logged in successfully!');
      navigation.navigate('Home');
    } catch (error: any) {
      Alert.alert('Login Error', error.message as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={[headerColor, '#FFFFFF']} style={styles.gradient}>
      <View style={styles.container}>
        <Text style={styles.title}>Login to your existing account</Text>

        <InputField
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <InputField
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <CustomButton
          title={loading ? 'Logging in...' : 'Login'}
          onPress={handleLogin}
          disabled={loading}
          style={loading ? styles.disabledButton : undefined}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          style={styles.linkContainer}
        >
          <Text style={styles.prelinkText}>Don't have an account? </Text>
          <Text style={styles.linkText}>Sign-up</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    color: textColor,
    fontSize: 28,
    marginBottom: 44,
    alignSelf: 'flex-start',
    marginLeft: 5,
  },
  linkContainer: {
    marginTop: 20,
    alignSelf: 'flex-start',
    marginLeft: 5,
  },
  prelinkText: {
    color: purple2,
    fontSize: 18,
  },
  linkText: {
    color: pinkAccent,
    fontSize: 18,
    textDecorationLine: 'underline',
  },
  disabledButton: {
    backgroundColor: '#999',
  },
});

export default LoginScreen;
