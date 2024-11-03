// src/navigators/StackNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import TabNavigator from './TabNavigator';

// Define the type for your stack's routes
export type RootStackParamList = {
  Login: undefined;
  Tab: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Tab" 
        component={TabNavigator} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
