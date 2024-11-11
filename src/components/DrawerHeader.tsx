// components/DrawerHeader.tsx
import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { type FirebaseAuthTypes } from '@react-native-firebase/auth';
import profilePlaceholder from '../assets/profile.png';

interface DrawerHeaderProps {
  user: FirebaseAuthTypes.User | null;
}

const DrawerHeader = ({ user }: DrawerHeaderProps): JSX.Element => {
  const userName = user?.displayName ?? 'Guest';
  const profileImage = user?.photoURL
    ? { uri: user.photoURL }
    : profilePlaceholder;

  return (
    <View style={styles.profileContainer}>
      <Image source={profileImage} style={styles.profileImage} />
      <Text style={styles.greetingText}>Hi, {userName}!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 10,
  },
  greetingText: {
    fontSize: 18,
    color: '#2C2D76',
    fontWeight: 'bold',
  },
});

export default DrawerHeader;
