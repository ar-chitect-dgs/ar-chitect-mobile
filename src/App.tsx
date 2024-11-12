// App.tsx
import 'react-native-gesture-handler';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './store/reducers';
import AppRouter from './navigation/AppRouter';

const store = createStore(rootReducer);

export default function App(): JSX.Element {
  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
}
