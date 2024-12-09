import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import { headerColor, pinkAccent, textColor, purple2 } from '../styles/colors';
import CustomButton from '../components/CustomButton';

const ProfileScreen: React.FC = ({ navigation }: any) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogout = async (): Promise<void> => {
    try {
      await auth().signOut();
      Alert.alert('Success', 'You have been logged out.');
    } catch (error: any) {
      Alert.alert('Logout Error', error.message as string);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={[headerColor, '#FFFFFF']} style={styles.gradient}>
      <View style={styles.container}>
        <Text style={styles.title}>Your profile</Text>

        <View style={styles.profileContainer}>
          {user.photoURL ? (
            <Image
              source={{ uri: user.photoURL }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>
                {user.displayName?.[0] || 'U'}
              </Text>
            </View>
          )}

          <Text style={styles.name}>{user.displayName || 'Guest User'}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <CustomButton title="Logout" onPress={handleLogout} />
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
    marginBottom: 30,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: purple2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  placeholderText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  name: {
    color: textColor,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  email: {
    color: pinkAccent,
    fontSize: 18,
  },
  message: {
    fontSize: 18,
    color: textColor,
  },
});

export default ProfileScreen;
