import 'react-native-gesture-handler';
import React from 'react';
import { registerRootComponent } from 'expo';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LanguageProvider } from './contexts/LanguageContext';
import { PickupLocationProvider } from './contexts/PickupLocationContext';

import App from './App';

function Root() {
  return React.createElement(
    SafeAreaProvider,
    null,
    React.createElement(
      LanguageProvider,
      null,
      React.createElement(PickupLocationProvider, null, React.createElement(App, null))
    )
  );
}

registerRootComponent(Root);
