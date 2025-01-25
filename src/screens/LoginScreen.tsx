import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import { headerColor, pinkAccent, purple2, textColor } from '../styles/colors';
import InputField from '../components/InputField';
import ErrorPopup from '../components/ErrorPopup';
import FilledButton from '../components/FilledButton';
import { useTranslation } from 'react-i18next';
import FormattedText from '../components/FormattedText';

const LoginScreen: React.FC = ({ navigation }: any) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState({
    isVisible: false,
    message: '',
  });

  const handleLogin = async (): Promise<void> => {
    if (email === '' || password === '') {
      setAlert({
        isVisible: true,
        message: t('loginScreen.fillFieldsMessage'),
      });
      return;
    }

    setLoading(true);

    try {
      await auth().signInWithEmailAndPassword(email, password);
      navigation.navigate('Home');
    } catch (error: any) {
      setAlert({
        isVisible: true,
        message: t('loginScreen.errorMessage'),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={[headerColor, '#FFFFFF']} style={styles.gradient}>
      <View style={styles.container}>
        <FormattedText style={styles.title}>
          {t('loginScreen.title')}
        </FormattedText>

        <InputField
          placeholder={t('loginScreen.emailPlaceholder')}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <InputField
          placeholder={t('loginScreen.passwordPlaceholder')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <FilledButton
          title={loading ? t('loginScreen.loggingIn') : t('loginScreen.login')}
          onPress={handleLogin}
          disabled={loading}
          style={loading ? styles.disabledButton : undefined}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          style={styles.linkContainer}
        >
          <FormattedText style={styles.prelinkText}>
            {t('loginScreen.noAccount')}
          </FormattedText>
          <FormattedText style={styles.linkText}>
            {t('loginScreen.signup')}
          </FormattedText>
        </TouchableOpacity>
      </View>
      <ErrorPopup
        isVisible={alert.isVisible}
        title={t('error.title')}
        message={alert.message}
        onClose={() => {
          setAlert((prev) => ({
            ...prev,
            isVisible: false,
          }));
        }}
        closeText={t('error.okButton')}
      />
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
