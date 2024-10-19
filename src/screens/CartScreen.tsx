import React from 'react'; // Import React để sử dụng các component React
import {
  ScrollView, // Component ScrollView để cho phép cuộn nội dung
  StatusBar, // Component StatusBar để tùy chỉnh thanh trạng thái trên cùng
  StyleSheet, // Công cụ để tạo các style trong React Native
  Text, // Component Text để hiển thị văn bản
  View, // Component View dùng để bao bọc các phần tử khác
  TouchableOpacity, // Component TouchableOpacity để tạo các nút có thể nhấn được
} from 'react-native'; // Import các component từ React Native
import { useStore } from '../store/store'; // Hook để lấy state từ store (có thể là Zustand hoặc một state manager khác)
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'; // Hook để lấy chiều cao của tab bar
import { COLORS, SPACING } from '../theme/theme'; // Import các hằng số liên quan đến màu sắc và khoảng cách từ file theme
import HeaderBar from '../components/HeaderBar'; // Import component HeaderBar, có thể là phần tiêu đề
import EmptyListAnimation from '../components/EmptyListAnimation'; // Component hiển thị hoạt ảnh khi danh sách rỗng
import PaymentFooter from '../components/PaymentFooter'; // Component chân trang cho thanh toán
import CartItem from '../components/CartItem'; // Component hiển thị thông tin từng sản phẩm trong giỏ hàng

const CartScreen = ({ navigation, route }: any) => {
  // Lấy danh sách các sản phẩm trong giỏ hàng từ store
  const CartList = useStore((state: any) => state.CartList);
  // Lấy tổng giá tiền của giỏ hàng từ store
  const CartPrice = useStore((state: any) => state.CartPrice);
  // Lấy các hàm tăng, giảm số lượng sản phẩm trong giỏ hàng
  const incrementCartItemQuantity = useStore(
    (state: any) => state.incrementCartItemQuantity,
  );
  const decrementCartItemQuantity = useStore(
    (state: any) => state.decrementCartItemQuantity,
  );
  // Hàm tính lại giá giỏ hàng sau khi thay đổi số lượng sản phẩm
  const calculateCartPrice = useStore((state: any) => state.calculateCartPrice);
  // Lấy chiều cao của tab bar để bố trí khoảng trống
  const tabBarHeight = useBottomTabBarHeight();

  // Hàm xử lý sự kiện khi nhấn nút "Pay"
  const buttonPressHandler = () => {
    navigation.push('Payment', { amount: CartPrice }); // Điều hướng sang trang Payment với giá giỏ hàng
  };

  // Hàm xử lý khi tăng số lượng sản phẩm trong giỏ hàng
  const incrementCartItemQuantityHandler = (id: string, size: string) => {
    incrementCartItemQuantity(id, size); // Gọi hàm tăng số lượng
    calculateCartPrice(); // Tính lại tổng giá sau khi thay đổi
  };

  // Hàm xử lý khi giảm số lượng sản phẩm trong giỏ hàng
  const decrementCartItemQuantityHandler = (id: string, size: string) => {
    decrementCartItemQuantity(id, size); // Gọi hàm giảm số lượng
    calculateCartPrice(); // Tính lại tổng giá sau khi thay đổi
  };
  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ScrollViewFlex}>
        <View
          style={[styles.ScrollViewInnerView, { marginBottom: tabBarHeight }]}>
          <View style={styles.ItemContainer}>
            <HeaderBar title="Cart" />

            {CartList.length == 0 ? (
              <EmptyListAnimation title={'Cart is Empty'} />
            ) : (
              <View style={styles.ListItemContainer}>
                {CartList.map((data: any) => (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.push('Details', {
                        index: data.index,
                        id: data.id,
                        type: data.type,
                      });
                    }}
                    key={data.id}>
                    <CartItem
                      id={data.id}
                      name={data.name}
                      imagelink_square={data.imagelink_square}
                      special_ingredient={data.special_ingredient}
                      roasted={data.roasted}
                      prices={data.prices}
                      type={data.type}
                      incrementCartItemQuantityHandler={
                        incrementCartItemQuantityHandler
                      }
                      decrementCartItemQuantityHandler={
                        decrementCartItemQuantityHandler
                      }
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {CartList.length != 0 ? (
            <PaymentFooter
              buttonPressHandler={buttonPressHandler}
              buttonTitle="Pay"
              price={{ price: CartPrice, currency: '$' }}
            />
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
    gap: SPACING.space_20,
  },
});

export default CartScreen;
