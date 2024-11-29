import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { type FirebaseAuthTypes } from '@react-native-firebase/auth';
import FormattedText from './FormattedText';
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
      <FormattedText style={styles.greetingText}>Hi, {userName}!</FormattedText>
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
