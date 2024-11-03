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
  Register: undefined; // Thêm Register vào đây
  Tab: undefined;
  Details: undefined;
  Payment: undefined;
  // Thêm các màn hình khác nếu cần
};

// Define screen props for individual screens if needed
export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
export type RegisterScreenProps = NativeStackScreenProps<RootStackParamList, 'Register'>; // Thêm RegisterScreenProps
export type TabNavigatorProps = NativeStackScreenProps<RootStackParamList, 'Tab'>;
export type DetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'Details'>;
export type PaymentScreenProps = NativeStackScreenProps<RootStackParamList, 'Payment'>;
