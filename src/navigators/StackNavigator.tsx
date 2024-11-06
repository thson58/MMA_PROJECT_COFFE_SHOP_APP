// src/navigators/StackNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import TabNavigator from './TabNavigator';
import ProfileScreen from '../screens/ProfileScreen'; // Import ProfileScreen
import { RootStackParamList } from '../types/types';

const Stack = createStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Tab" component={TabNavigator} />
      <Stack.Screen name="Profile" component={ProfileScreen} /> // Add Profile screen
      {/* Add other screens if needed */}
    </Stack.Navigator>
  );
};

export default StackNavigator;
