// src/types/types.ts

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Define the type for your Tab Navigator
export type TabParamList = {
  Home: undefined;
  Map: undefined;
  Cart: undefined;
  Favorite: undefined;
  History: undefined;
};

// Define the type for your Stack Navigator
export type RootStackParamList = {
  Login: undefined;
  Tab: undefined;
  Details: undefined;
  Payment: undefined;
  // If 'Map' is only within the Tab Navigator, remove it here to avoid conflicts
};

// Define screen props for individual screens if needed
export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
export type TabNavigatorProps = NativeStackScreenProps<RootStackParamList, 'Tab'>;
export type DetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'Details'>;
export type PaymentScreenProps = NativeStackScreenProps<RootStackParamList, 'Payment'>;
