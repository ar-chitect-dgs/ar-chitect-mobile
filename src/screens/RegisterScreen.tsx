import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';
import InputField from '../components/InputField';
import FilledButton from '../components/FilledButton';
import { headerColor, pinkAccent, purple2, textColor } from '../styles/colors';
import ErrorPopup from '../components/ErrorPopup';
import { useTranslation } from 'react-i18next';
import FormattedText from '../components/FormattedText';

const RegisterScreen: React.FC = ({ navigation }: any) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [profileImage, setProfileImage] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState({
    isVisible: false,
    message: '',
  });

  const handleImagePicker = (): void => {
    void launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setProfileImage(response.assets[0]);
      }
    });
  };

  const uploadImage = async (userId: string): Promise<string | null> => {
    if (!profileImage) return null;
    const reference = storage().ref(`/profilePictures/${userId}`);
    await reference.putFile(profileImage.uri as string);
    return await reference.getDownloadURL();
  };

  const handleRegister = async (): Promise<void> => {
    if (email === '' || password === '' || displayName === '') {
      setAlert({
        isVisible: true,
        message: t('registerScreen.fillFieldsMessage'),
      });
      return;
    }

    setLoading(true);

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );

      if (userCredential.user) {
        const photoURL = await uploadImage(userCredential.user.uid);

        await userCredential.user.updateProfile({
          displayName,
          photoURL,
        });
        setAlert({
          isVisible: true,
          message: t('registerScreen.successMessage'),
        });
        navigation.navigate('Home');
      }
    } catch (error: any) {
      setAlert({
        isVisible: true,
        message: t('registerScreen.errorMessage'),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={[headerColor, '#FFFFFF']} style={styles.gradient}>
      <View style={styles.container}>
        <FormattedText style={styles.title}>
          {t('registerScreen.title')}
        </FormattedText>

        <TouchableOpacity
          onPress={handleImagePicker}
          style={styles.imagePicker}
        >
          {profileImage ? (
            <Image
              source={{ uri: profileImage.uri }}
              style={styles.profileImage}
            />
          ) : (
            <FormattedText style={styles.imageText}>
              {t('registerScreen.imagePickerText')}
            </FormattedText>
          )}
        </TouchableOpacity>

        <InputField
          placeholder={t('registerScreen.displayNamePlaceholder')}
          value={displayName}
          onChangeText={setDisplayName}
        />

        <InputField
          placeholder={t('registerScreen.emailPlaceholder')}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <InputField
          placeholder={t('registerScreen.passwordPlaceholder')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <FilledButton
          title={
            loading
              ? t('registerScreen.registering')
              : t('registerScreen.register')
          }
          onPress={handleRegister}
          disabled={loading}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.linkContainer}
        >
          <FormattedText style={styles.prelinkText}>
            {t('registerScreen.alreadyHaveAccount')}
          </FormattedText>
          <FormattedText style={styles.linkText}>
            {t('registerScreen.login')}
          </FormattedText>
        </TouchableOpacity>
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
    marginBottom: 24,
    alignSelf: 'flex-start',
    marginLeft: 5,
  },
  imagePicker: {
    alignSelf: 'flex-start',
    marginLeft: 5,
    marginBottom: 34,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imageText: {
    color: pinkAccent,
    fontSize: 16,
    textDecorationLine: 'underline',
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
});

export default RegisterScreen;
