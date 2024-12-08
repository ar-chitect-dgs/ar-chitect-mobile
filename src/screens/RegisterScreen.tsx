import React, { useState } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';
import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';
import { headerColor, pinkAccent, purple2, textColor } from '../styles/colors';

const RegisterScreen: React.FC = ({ navigation }: any) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [profileImage, setProfileImage] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

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
    await reference.putFile(profileImage.uri);
    return await reference.getDownloadURL();
  };

  const handleRegister = async (): Promise<void> => {
    if (email === '' || password === '' || displayName === '') {
      Alert.alert('Error', 'Please fill in all fields');
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

        Alert.alert('Success', 'Account created successfully!');
        navigation.navigate('Home');
      }
    } catch (error: any) {
      Alert.alert('Registration Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={[headerColor, '#FFFFFF']} style={styles.gradient}>
      <View style={styles.container}>
        <Text style={styles.title}>Create a new account</Text>

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
            <Text style={styles.imageText}>Pick a profile picture...</Text>
          )}
        </TouchableOpacity>

        <InputField
          placeholder="Display Name"
          value={displayName}
          onChangeText={setDisplayName}
        />

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
          title={loading ? 'Registering...' : 'Register'}
          onPress={handleRegister}
          disabled={loading}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.linkContainer}
        >
          <Text style={styles.prelinkText}>Already have an account? </Text>
          <Text style={styles.linkText}>Log-in</Text>
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
