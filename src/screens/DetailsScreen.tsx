import React, { useState } from 'react'; // Import React và useState để sử dụng state
import {
  ScrollView, // Component cho phép cuộn nội dung
  StatusBar, // Component để tùy chỉnh thanh trạng thái trên cùng
  StyleSheet, // Công cụ để tạo các style trong React Native
  Text, // Component để hiển thị văn bản
  View, // Component để bao bọc các phần tử khác
  TouchableWithoutFeedback, // Component cho phép tạo các khu vực nhấn không có phản hồi
  TouchableOpacity, // Component cho phép tạo các nút có thể nhấn với hiệu ứng mờ
} from 'react-native'; // Import các component từ React Native
import { useStore } from '../store/store'; // Hook để lấy state từ store (có thể là Zustand hoặc một state manager khác)
import {
  BORDERRADIUS, // Hằng số cho bán kính góc
  COLORS, // Hằng số cho màu sắc
  FONTFAMILY, // Hằng số cho font chữ
  FONTSIZE, // Hằng số cho kích thước chữ
  SPACING, // Hằng số cho khoảng cách
} from '../theme/theme'; // Import các hằng số từ file theme
import ImageBackgroundInfo from '../components/ImageBackgroundInfo'; // Component hiển thị thông tin trên nền hình ảnh
import PaymentFooter from '../components/PaymentFooter'; // Component chân trang cho thanh toán

const DetailsScreen = ({ navigation, route }: any) => {
  // Lấy thông tin sản phẩm dựa trên index và type từ route params
  const ItemOfIndex = useStore((state: any) =>
    route.params.type == 'Coffee' ? state.CoffeeList : state.BeanList,
  )[route.params.index];

  // Lấy các hàm từ store để quản lý danh sách yêu thích và giỏ hàng
  const addToFavoriteList = useStore((state: any) => state.addToFavoriteList);
  const deleteFromFavoriteList = useStore(
    (state: any) => state.deleteFromFavoriteList,
  );
  const addToCart = useStore((state: any) => state.addToCart);
  const calculateCartPrice = useStore((state: any) => state.calculateCartPrice);

  // State để quản lý giá và mô tả đầy đủ
  const [price, setPrice] = useState(ItemOfIndex.prices[0]); // Giá mặc định là giá đầu tiên của sản phẩm
  const [fullDesc, setFullDesc] = useState(false); // Quản lý trạng thái hiển thị mô tả đầy đủ

  // Hàm để chuyển đổi giữa trạng thái yêu thích và không yêu thích
  const ToggleFavourite = (favourite: boolean, type: string, id: string) => {
    favourite ? deleteFromFavoriteList(type, id) : addToFavoriteList(type, id);
  };

  // Hàm xử lý quay lại trang trước
  const BackHandler = () => {
    navigation.pop();
  };

  // Hàm xử lý khi thêm sản phẩm vào giỏ hàng
  const addToCarthandler = ({
    id,
    index,
    name,
    roasted,
    imagelink_square,
    special_ingredient,
    type,
    price,
  }: any) => {
    // Thêm sản phẩm vào giỏ hàng với thông tin cần thiết
    addToCart({
      id,
      index,
      name,
      roasted,
      imagelink_square,
      special_ingredient,
      type,
      prices: [{ ...price, quantity: 1 }], // Thêm số lượng là 1 cho sản phẩm
    });
    calculateCartPrice(); // Tính toán lại tổng giá của giỏ hàng
    navigation.navigate('Cart'); // Điều hướng đến trang giỏ hàng
  };
  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ScrollViewFlex}>
        <ImageBackgroundInfo
          EnableBackHandler={true}
          imagelink_portrait={ItemOfIndex.imagelink_portrait}
          type={ItemOfIndex.type}
          id={ItemOfIndex.id}
          favourite={ItemOfIndex.favourite}
          name={ItemOfIndex.name}
          special_ingredient={ItemOfIndex.special_ingredient}
          ingredients={ItemOfIndex.ingredients}
          average_rating={ItemOfIndex.average_rating}
          ratings_count={ItemOfIndex.ratings_count}
          roasted={ItemOfIndex.roasted}
          BackHandler={BackHandler}
          ToggleFavourite={ToggleFavourite}
        />

        <View style={styles.FooterInfoArea}>
          <Text style={styles.InfoTitle}>Description</Text>
          {fullDesc ? (
            <TouchableWithoutFeedback
              onPress={() => {
                setFullDesc(prev => !prev);
              }}>
              <Text style={styles.DescriptionText}>
                {ItemOfIndex.description}
              </Text>
            </TouchableWithoutFeedback>
          ) : (
            <TouchableWithoutFeedback
              onPress={() => {
                setFullDesc(prev => !prev);
              }}>
              <Text numberOfLines={3} style={styles.DescriptionText}>
                {ItemOfIndex.description}
              </Text>
            </TouchableWithoutFeedback>
          )}
          <Text style={styles.InfoTitle}>Size</Text>
          <View style={styles.SizeOuterContainer}>
            {ItemOfIndex.prices.map((data: any) => (
              <TouchableOpacity
                key={data.size}
                onPress={() => {
                  setPrice(data);
                }}
                style={[
                  styles.SizeBox,
                  {
                    borderColor:
                      data.size == price.size
                        ? COLORS.primaryOrangeHex
                        : COLORS.primaryDarkGreyHex,
                  },
                ]}>
                <Text
                  style={[
                    styles.SizeText,
                    {
                      fontSize:
                        ItemOfIndex.type == 'Bean'
                          ? FONTSIZE.size_14
                          : FONTSIZE.size_16,
                      color:
                        data.size == price.size
                          ? COLORS.primaryOrangeHex
                          : COLORS.secondaryLightGreyHex,
                    },
                  ]}>
                  {data.size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <PaymentFooter
          price={price}
          buttonTitle="Add to Cart"
          buttonPressHandler={() => {
            addToCarthandler({
              id: ItemOfIndex.id,
              index: ItemOfIndex.index,
              name: ItemOfIndex.name,
              roasted: ItemOfIndex.roasted,
              imagelink_square: ItemOfIndex.imagelink_square,
              special_ingredient: ItemOfIndex.special_ingredient,
              type: ItemOfIndex.type,
              price: price,
            });
          }}
        />
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
    justifyContent: 'space-between',
  },
  FooterInfoArea: {
    padding: SPACING.space_20,
  },
  InfoTitle: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryWhiteHex,
    marginBottom: SPACING.space_10,
  },
  DescriptionText: {
    letterSpacing: 0.5,
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryWhiteHex,
    marginBottom: SPACING.space_30,
  },
  SizeOuterContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.space_20,
  },
  SizeBox: {
    flex: 1,
    backgroundColor: COLORS.primaryDarkGreyHex,
    alignItems: 'center',
    justifyContent: 'center',
    height: SPACING.space_24 * 2,
    borderRadius: BORDERRADIUS.radius_10,
    borderWidth: 2,
  },
  SizeText: {
    fontFamily: FONTFAMILY.poppins_medium,
  },
});

export default DetailsScreen;
