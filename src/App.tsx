import 'react-native-gesture-handler';
import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './store/reducers';
import AppRouter from './navigation/AppRouter';
import './locales/i18n';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { headerColor } from './styles/colors';

const store = createStore(rootReducer);

export default function App(): JSX.Element {
  return (
    <Provider store={store}>
      <Suspense fallback={<LoadingFallback />}>
        <AppRouter />
      </Suspense>
    </Provider>
  );
}

const LoadingFallback = (): JSX.Element => (
  <View style={styles.loaderContainer}>
    <ActivityIndicator size="large" color="#5856D6" />
  </View>
);

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: headerColor,
  },
});
