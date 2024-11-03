// App.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import TabNavigator from './src/navigators/TabNavigator';
import DetailsScreen from './src/screens/DetailsScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import SplashScreen from 'react-native-splash-screen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen'; // Import RegisterScreen
import auth from '@react-native-firebase/auth';
import { MenuProvider } from 'react-native-popup-menu';
import { RootStackParamList } from './src/types/types'; // Import từ types.ts

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Function to handle auth state changes
  const onAuthStateChanged = (user: any) => {
    setUser(user);
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    SplashScreen.hide();
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  return (
    <MenuProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            // If authenticated, show TabNavigator and other main screens
            <>
              <Stack.Screen
                name="Tab"
                component={TabNavigator}
                options={{ animation: 'slide_from_bottom' }}
              />
              <Stack.Screen
                name="Details"
                component={DetailsScreen}
                options={{ animation: 'slide_from_bottom' }}
              />
              <Stack.Screen
                name="Payment"
                component={PaymentScreen}
                options={{ animation: 'slide_from_bottom' }}
              />
              {/* Remove 'Map' from Stack if it's handled within TabNavigator to avoid conflicts */}
            </>
          ) : (
            // If not authenticated, show Login and Register screens
            <>
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ animation: 'fade' }}
              />
              <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ animation: 'fade' }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
};

export default App;
