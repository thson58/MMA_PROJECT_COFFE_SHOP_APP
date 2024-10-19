import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { useStore } from '../store/store';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import HeaderBar from '../components/HeaderBar';
import EmptyListAnimation from '../components/EmptyListAnimation';
import PopUpAnimation from '../components/PopUpAnimation';
import OrderHistoryCard from '../components/OrderHistoryCard';
const OrderHistoryScreen = ({ navigation }: any) => {
  // Lấy danh sách lịch sử đặt hàng từ store
  const OrderHistoryList = useStore((state: any) => state.OrderHistoryList);
  // Lấy chiều cao của thanh tab dưới cùng
  const tabBarHeight = useBottomTabBarHeight();
  // Trạng thái để điều khiển việc hiển thị animation
  const [showAnimation, setShowAnimation] = useState(false);

  // Hàm điều hướng đến màn hình chi tiết của đơn hàng
  const navigationHandler = ({ index, id, type }: any) => {
    navigation.push('Details', {
      index,
      id,
      type,
    });
  };

  // Hàm xử lý sự kiện nhấn nút tải về
  const buttonPressHandler = () => {
    setShowAnimation(true); // Hiển thị animation
    // Sau 2 giây, ẩn animation
    setTimeout(() => {
      setShowAnimation(false);
    }, 2000);
  };

  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} /> {/* Thiết lập màu nền cho StatusBar */}

      {showAnimation ? ( // Kiểm tra xem có cần hiển thị animation không
        <PopUpAnimation
          style={styles.LottieAnimation}
          source={require('../lottie/download.json')} // Tải animation từ file
        />
      ) : (
        <></>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false} // Ẩn thanh cuộn dọc
        contentContainerStyle={styles.ScrollViewFlex}>
        <View
          style={[styles.ScrollViewInnerView, { marginBottom: tabBarHeight }]}>
          <View style={styles.ItemContainer}>
            <HeaderBar title="Order History" /> {/* Hiển thị tiêu đề "Order History" */}

            {OrderHistoryList.length == 0 ? ( // Kiểm tra nếu danh sách lịch sử đơn hàng trống
              <EmptyListAnimation title={'No Order History'} /> // Hiển thị thông báo nếu không có đơn hàng
            ) : (
              <View style={styles.ListItemContainer}>
                {OrderHistoryList.map((data: any, index: any) => ( // Lặp qua danh sách lịch sử đơn hàng
                  <OrderHistoryCard
                    key={index.toString()} // Khóa duy nhất cho mỗi đơn hàng
                    navigationHandler={navigationHandler} // Hàm điều hướng khi nhấn vào đơn hàng
                    CartList={data.CartList} // Danh sách sản phẩm trong đơn hàng
                    CartListPrice={data.CartListPrice} // Tổng giá của đơn hàng
                    OrderDate={data.OrderDate} // Ngày đặt hàng
                  />
                ))}
              </View>
            )}
          </View>
          {OrderHistoryList.length > 0 ? ( // Nếu có đơn hàng trong danh sách
            <TouchableOpacity
              style={styles.DownloadButton} // Nút tải về
              onPress={() => {
                buttonPressHandler(); // Gọi hàm xử lý khi nhấn nút
              }}>
              <Text style={styles.ButtonText}>Download</Text> {/* Văn bản trên nút */}
            </TouchableOpacity>
          ) : (
            <></>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
  },
  LottieAnimation: {
    height: 250,
  },
  ScrollViewFlex: {
    flexGrow: 1,
  },
  ScrollViewInnerView: {
    flex: 1,
    justifyContent: 'space-between',
  },
  ItemContainer: {
    flex: 1,
  },
  ListItemContainer: {
    paddingHorizontal: SPACING.space_20,
    gap: SPACING.space_30,
  },
  DownloadButton: {
    margin: SPACING.space_20,
    backgroundColor: COLORS.primaryOrangeHex,
    alignItems: 'center',
    justifyContent: 'center',
    height: SPACING.space_36 * 2,
    borderRadius: BORDERRADIUS.radius_20,
  },
  ButtonText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_18,
    color: COLORS.primaryWhiteHex,
  },
});

export default OrderHistoryScreen;
