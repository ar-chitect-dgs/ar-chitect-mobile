import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import { headerColor, pinkAccent, textColor, purple2 } from '../styles/colors';
import ErrorPopup from '../components/ErrorPopup';
import FilledButton from '../components/FilledButton';
import { useTranslation } from 'react-i18next';
import FormattedText from '../components/FormattedText';

const ProfileScreen: React.FC = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [alert, setAlert] = useState({
    isVisible: false,
    message: '',
  });

  useEffect(() => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogout = async (): Promise<void> => {
    try {
      await auth().signOut();
    } catch (error: any) {
      setAlert({
        isVisible: true,
        message: t('profileScreen.logoutError'),
      });
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <FormattedText style={styles.message}>
          {t('profileScreen.loading')}
        </FormattedText>
      </View>
    );
  }

  return (
    <LinearGradient colors={[headerColor, '#FFFFFF']} style={styles.gradient}>
      <View style={styles.container}>
        <FormattedText style={styles.title}>
          {t('profileScreen.title')}
        </FormattedText>

        <View style={styles.profileContainer}>
          {user.photoURL ? (
            <Image
              source={{ uri: user.photoURL }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.placeholderImage}>
              <FormattedText style={styles.placeholderText}>
                {user.displayName?.[0] || t('profileScreen.defaultInitial')}
              </FormattedText>
            </View>
          )}

          <FormattedText style={styles.name}>
            {user.displayName || t('profileScreen.guest')}
          </FormattedText>
          <FormattedText style={styles.email}>{user.email}</FormattedText>
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
        <FilledButton
          title={t('profileScreen.logout')}
          onPress={handleLogout}
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
