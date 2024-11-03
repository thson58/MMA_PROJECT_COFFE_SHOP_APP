// src/screens/RegisterScreen.tsx
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
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types'; // Import từ types.ts
import { COLORS, FONTSIZE, FONTFAMILY, SPACING } from '../theme/theme';

// Định nghĩa kiểu cho navigation prop
type RegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Register'
>;

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleRegister = () => {
    if (email.trim() === '' || password.trim() === '' || confirmPassword.trim() === '') {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Lỗi', 'Email không hợp lệ.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu và xác nhận mật khẩu không khớp.');
      return;
    }

    if (password.length < 6) { // Kiểm tra độ mạnh của mật khẩu
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    setLoading(true);
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        setLoading(false);
        Alert.alert('Thành công', 'Đăng ký tài khoản thành công!');
        navigation.navigate('Login');
      })
      .catch(error => {
        setLoading(false);
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('Lỗi', 'Email đã được sử dụng.');
        } else if (error.code === 'auth/invalid-email') {
          Alert.alert('Lỗi', 'Email không hợp lệ.');
        } else if (error.code === 'auth/weak-password') {
          Alert.alert('Lỗi', 'Mật khẩu yếu. Vui lòng chọn mật khẩu khác.');
        } else {
          Alert.alert('Lỗi', error.message);
        }
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Ký</Text>
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
      <TextInput
        style={styles.input}
        placeholder="Xác nhận mật khẩu"
        placeholderTextColor={COLORS.primaryLightGreyHex}
        value={confirmPassword}
        onChangeText={text => setConfirmPassword(text)}
        secureTextEntry
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.primaryWhiteHex} />
        ) : (
          <Text style={styles.buttonText}>Đăng Ký</Text>
        )}
      </TouchableOpacity>

      {/* Nút Quay Lại Đăng Nhập */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate('Login')}
        disabled={loading}
      >
        <Text style={styles.loginButtonText}>Bạn đã có tài khoản? Đăng Nhập</Text>
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
    height: SPACING.space_16 * 3,
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
  loginButton: {
    marginTop: SPACING.space_10,
  },
  loginButtonText: {
    color: COLORS.primaryOrangeHex,
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
  },
});

export default RegisterScreen;
