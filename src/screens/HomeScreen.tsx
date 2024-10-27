import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';

const HomeScreen: React.FC = ({ navigation }: any) => {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      const name = currentUser.displayName ?? currentUser.email; // Use displayName if available, otherwise use email
      setUserName(name);
    }
  }, []);

  const handleLogout = async (): Promise<void> => {
    try {
      await auth().signOut();
      navigation.navigate('Login');
    } catch (error: any) {
      console.error('Logout Error:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hello, {userName}!</Text>
      <Button title="Logout" onPress={() => handleLogout} />
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
  greeting: {
    color: '#000',
    fontSize: 24,
    marginBottom: 20,
  },
});

export default HomeScreen;
