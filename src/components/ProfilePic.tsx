// src/components/ProfilePic.tsx
import React from 'react';
import { StyleSheet, Image, View, Alert } from 'react-native';
import { COLORS, SPACING } from '../theme/theme';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';
import auth from '@react-native-firebase/auth';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Tab'>;

const ProfilePic = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => {
        Alert.alert('Thông báo', 'Đã đăng xuất thành công.');
      })
      .catch(error => {
        Alert.alert('Lỗi', error.message);
      });
  };

  return (
    <Menu>
      <MenuTrigger>
        <View style={styles.ImageContainer}>
          <Image
            source={require('../assets/app_images/avatar.png')}
            style={styles.Image}
          />
        </View>
      </MenuTrigger>
      <MenuOptions>
        <MenuOption onSelect={() => navigation.navigate('Profile')} text="Thông tin cá nhân" />
        <MenuOption onSelect={handleLogout} text="Đăng Xuất" />
      </MenuOptions>
    </Menu>
  );
};

const styles = StyleSheet.create({
  ImageContainer: {
    height: SPACING.space_36,
    width: SPACING.space_36,
    borderRadius: SPACING.space_12,
    borderWidth: 2,
    borderColor: COLORS.secondaryDarkGreyHex,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  Image: {
    height: SPACING.space_36,
    width: SPACING.space_36,
  },
});

export default ProfilePic;