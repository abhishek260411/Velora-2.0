import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { LogBox } from 'react-native';

const originalConsoleError = console.error;
const reportError = (...args) => {
  // Placeholder for crash reporting service like Sentry or Firebase Crashlytics
  // console.log('Forwarding error to reporting service:', ...args);
};

if (!__DEV__) {
  console.log = () => { };
  console.warn = () => { };
  console.error = (...args) => {
    reportError(...args);
    originalConsoleError(...args);
  };
} else {
  LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);
}

import AppNavigator from './src/navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { CartProvider } from './src/context/CartContext';
import { AuthProvider } from './src/context/AuthContext';
import { RewardsProvider } from './src/context/RewardsContext';
import { NotificationProvider } from './src/context/NotificationContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RewardsProvider>
          <NotificationProvider>
            <CartProvider>
              <NavigationContainer>
                <StatusBar style="dark" backgroundColor="transparent" translucent={true} />
                <AppNavigator />
              </NavigationContainer>
            </CartProvider>
          </NotificationProvider>
        </RewardsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
