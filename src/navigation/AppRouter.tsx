import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { NavigationContainer, type RouteProp } from '@react-navigation/native';
import {
  createStackNavigator,
  type StackNavigationProp,
} from '@react-navigation/stack';
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

import { headerColor } from '../styles/colors';
import { type Project } from '../api/types';
import { useTranslation } from 'react-i18next';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type RootStackParamList = {
  Home: undefined;
  AR: { project: Project };
};

export type ARScreenRouteProp = RouteProp<RootStackParamList, 'AR'>;

export type ARScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AR'
>;

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function HomeStack(): JSX.Element {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ROUTES.HOME}
        options={{ headerShown: false }}
        component={HomeScreen}
      />
      <Stack.Screen
        name={ROUTES.AR}
        options={{ headerShown: false }}
        component={ARScreen}
      />
    </Stack.Navigator>
  );
}

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
  const { t } = useTranslation();

  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerStyle: { backgroundColor: headerColor, shadowOpacity: 0 },
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
            <Drawer.Screen
              name={ROUTES.PROJECTS}
              component={HomeStack}
              options={{
                unmountOnBlur: true,
                title: t(ROUTES.HOME),
              }}
            />
            <Drawer.Screen name={t(ROUTES.PROFILE)} component={ProfileScreen} />
            <Drawer.Screen
              name={ROUTES.SETTINGS}
              component={SettingsScreen}
              options={{ title: t(ROUTES.SETTINGS) }}
            />
          </>
        ) : (
          <>
            <Drawer.Screen
              name={ROUTES.LOGIN}
              component={LoginScreen}
              options={{ title: t(ROUTES.LOGIN) }}
            />
            <Drawer.Screen
              name={ROUTES.REGISTER}
              component={RegisterScreen}
              options={{ title: t(ROUTES.REGISTER) }}
            />
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
