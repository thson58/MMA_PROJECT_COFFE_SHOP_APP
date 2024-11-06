import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';
import { COLORS, FONTSIZE, FONTFAMILY, SPACING } from '../theme/theme';
import CustomIcon from '../components/CustomIcon';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Tab'>;

interface UserData {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
}

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const currentUser = auth().currentUser;
      if (currentUser) {
        const userDoc = await firestore()
          .collection('users')
          .doc(currentUser.uid)
          .get();

        if (userDoc.exists) {
          setUserData(userDoc.data() as UserData);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Lỗi', 'Không thể tải thông tin người dùng.');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đăng xuất',
          onPress: async () => {
            try {
              await auth().signOut();
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể đăng xuất. Vui lòng thử lại.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/app_images/avatar.png')}
            style={styles.profileImage}
          />
        </View>
        <Text style={styles.userName}>{userData?.fullName || 'Đang tải...'}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
        
        <View style={styles.infoItem}>
          <CustomIcon name="email" size={24} color={COLORS.primaryOrangeHex} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{userData?.email || 'Chưa có'}</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <CustomIcon name="phone" size={24} color={COLORS.primaryOrangeHex} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Số điện thoại</Text>
            <Text style={styles.infoValue}>
              {userData?.phoneNumber || 'Chưa có'}
            </Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <CustomIcon name="location" size={24} color={COLORS.primaryOrangeHex} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Địa chỉ</Text>
            <Text style={styles.infoValue}>{userData?.address || 'Chưa có'}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <CustomIcon name="logout" size={24} color={COLORS.primaryWhiteHex} />
        <Text style={styles.logoutButtonText}>Đăng xuất</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
  },
  header: {
    alignItems: 'center',
    paddingVertical: SPACING.space_30,
  },
  imageContainer: {
    width: SPACING.space_36 * 3,
    height: SPACING.space_36 * 3,
    borderRadius: (SPACING.space_36 * 3) / 2,
    borderWidth: 2,
    borderColor: COLORS.primaryOrangeHex,
    overflow: 'hidden',
    marginBottom: SPACING.space_16,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  userName: {
    fontSize: FONTSIZE.size_24,
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryWhiteHex,
  },
  infoContainer: {
    padding: SPACING.space_20,
  },
  sectionTitle: {
    fontSize: FONTSIZE.size_18,
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryWhiteHex,
    marginBottom: SPACING.space_20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.space_12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primaryGreyHex,
  },
 infoContent: {
    marginLeft: SPACING.space_12,
    flex: 1,
  },
  infoLabel: {
    fontSize: FONTSIZE.size_14,
    fontFamily: FONTFAMILY.poppins_regular,
    color: COLORS.secondaryLightGreyHex,
  },
  infoValue: {
    fontSize: FONTSIZE.size_16,
    fontFamily: FONTFAMILY.poppins_medium,
    color: COLORS.primaryWhiteHex,
    marginTop: SPACING.space_4,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryRedHex,
    marginHorizontal: SPACING.space_20,
    marginVertical: SPACING.space_20,
    padding: SPACING.space_16,
    borderRadius: SPACING.space_4,
  },
  logoutButtonText: {
    color: COLORS.primaryWhiteHex,
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    marginLeft: SPACING.space_8,
  },
});

export default ProfileScreen;