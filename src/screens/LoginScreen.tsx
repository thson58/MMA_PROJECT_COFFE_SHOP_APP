// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTSIZE, FONTFAMILY, SPACING } from '../theme/theme';

const LoginScreen: React.FC = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('admin@coffeeapp.com'); // Mặc định cho dễ kiểm tra
  const [password, setPassword] = useState('admin'); // Mặc định cho dễ kiểm tra
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (email === '' || password === '') {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    setLoading(true);
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        setLoading(false);
        // Điều hướng tới màn hình Home sau khi đăng nhập thành công
        navigation.navigate('Tab'); // Đảm bảo 'Tab' là tên của TabNavigator trong Navigation
      })
      .catch(error => {
        setLoading(false);
        if (error.code === 'auth/user-not-found') {
          Alert.alert('Lỗi', 'Không tìm thấy người dùng.');
        } else if (error.code === 'auth/wrong-password') {
          Alert.alert('Lỗi', 'Mật khẩu không đúng.');
        } else {
          Alert.alert('Lỗi', error.message);
        }
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Nhập</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={COLORS.primaryLightGreyHex}
        value={email}
        onChangeText={text => setEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        placeholderTextColor={COLORS.primaryLightGreyHex}
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color={COLORS.primaryWhiteHex} />
        ) : (
          <Text style={styles.buttonText}>Đăng Nhập</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.space_20,
  },
  title: {
    fontSize: FONTSIZE.size_24,
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryWhiteHex,
    marginBottom: SPACING.space_30,
  },
  input: {
    width: '100%',
    height: SPACING.space_12 * 3,
    borderColor: COLORS.primaryLightGreyHex,
    borderWidth: 1,
    borderRadius: SPACING.space_4,
    paddingHorizontal: SPACING.space_10,
    color: COLORS.primaryWhiteHex,
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_16,
    marginBottom: SPACING.space_20,
  },
  button: {
    width: '100%',
    height: SPACING.space_12 * 3,
    backgroundColor: COLORS.primaryOrangeHex,
    borderRadius: SPACING.space_4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.primaryWhiteHex,
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
  },
});

export default LoginScreen;