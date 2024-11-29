import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import auth from '@react-native-firebase/auth';

const ProfileScreen: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      const name = currentUser.displayName ?? currentUser.email;
      setUserName(name);
      setProfileImage(currentUser.photoURL);
    }
  }, []);

  const handleLogout = async (): Promise<void> => {
    try {
      await auth().signOut();
    } catch (error: any) {
      console.error('Logout Error:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {profileImage ? (
        <Image source={{ uri: profileImage }} style={styles.profileImage} />
      ) : (
        <Text style={styles.noImageText}>No Profile Picture</Text>
      )}
      <Text style={styles.greeting}>Hello, {userName}!</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  noImageText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
  greeting: {
    color: '#000',
    fontSize: 24,
    marginBottom: 20,
  },
});

export default ProfileScreen;
