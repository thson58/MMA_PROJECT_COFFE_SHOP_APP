// src/types/types.ts
import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type TabParamList = {
  Home: undefined;
  Map: undefined;
  Cart: undefined;
  Favorite: undefined;
  History: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Tab: undefined;
  Details: undefined;
  Payment: undefined;
  Profile: undefined;
};

export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
export type RegisterScreenProps = NativeStackScreenProps<RootStackParamList, 'Register'>;
export type TabNavigatorProps = NativeStackScreenProps<RootStackParamList, 'Tab'>;
export type DetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'Details'>;
export type PaymentScreenProps = NativeStackScreenProps<RootStackParamList, 'Payment'>;
export type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'Profile'>;