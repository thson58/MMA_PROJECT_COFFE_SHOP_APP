// src/navigators/StackNavigator.tsx
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen'; // Import RegisterScreen
import TabNavigator from './TabNavigator';
import {RootStackParamList} from '../types/types'; // Import từ types.ts

const Stack = createStackNavigator<RootStackParamList>();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Tab" component={TabNavigator} />
      {/* Thêm các màn hình khác nếu cần */}
    </Stack.Navigator>
  );
};

export default StackNavigator;
