

// App.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './src/navigators/TabNavigator';
import DetailsScreen from './src/screens/DetailsScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import SplashScreen from 'react-native-splash-screen';
import MapScreen from './src/screens/MapScreen';
import LoginScreen from './src/screens/LoginScreen'; // Import LoginScreen
import auth from '@react-native-firebase/auth';
import { MenuProvider } from 'react-native-popup-menu'; // Import MenuProvider

const Stack = createNativeStackNavigator();

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Hàm để xử lý khi auth state thay đổi
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
            // Nếu đã đăng nhập, hiển thị TabNavigator và các màn hình chính
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
              <Stack.Screen
                name="Map"
                component={MapScreen}
                options={{ animation: 'slide_from_bottom' }}
              />
            </>
          ) : (
            // Nếu chưa đăng nhập, hiển thị LoginScreen
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ animation: 'fade' }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
};

export default App;
