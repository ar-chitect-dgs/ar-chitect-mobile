// navigation/AppRouter.tsx
import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import HomeScreen from '../screens/HomeScreen';
import ARScreen from '../screens/ARScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { ROUTES } from './routes';
import { Image, StyleSheet, View } from 'react-native';
import DrawerHeader from '../components/DrawerHeader';
import logo from '../assets/logo.png';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props: any): JSX.Element => {
  const { user } = useAuth();

  return (
    <DrawerContentScrollView {...props}>
      <DrawerHeader user={user} />
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const AppRouter = (): JSX.Element => {
  const { isLoggedIn } = useAuth();

  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerStyle: { backgroundColor: '#EFF1FF' },
          headerTitleAlign: 'center',
          headerTitle: () => (
            <View style={styles.logoContainer}>
              <Image source={logo} style={styles.logo} />
            </View>
          ),
          headerTintColor: '#5856D6',
          drawerActiveTintColor: '#7489FF',
          drawerInactiveTintColor: '#7489FF',
          drawerItemStyle: { borderRadius: 18, paddingLeft: 5 },
        }}
      >
        {isLoggedIn ? (
          <>
            <Drawer.Screen name={ROUTES.HOME} component={HomeScreen} />
            <Drawer.Screen name={ROUTES.AR} component={ARScreen} />
            <Drawer.Screen name={ROUTES.PROFILE} component={ProfileScreen} />
            <Drawer.Screen name={ROUTES.SETTINGS} component={SettingsScreen} />
          </>
        ) : (
          <>
            <Drawer.Screen name={ROUTES.LOGIN} component={LoginScreen} />
            <Drawer.Screen name={ROUTES.REGISTER} component={RegisterScreen} />
          </>
        )}
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
  },
});

export default AppRouter;
