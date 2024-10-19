import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
// Import các thành phần cần thiết từ React và React Native

import { useStore } from '../store/store'; // Import hook để truy cập vào store toàn cục
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'; // Hook để lấy chiều cao của thanh tab bên dưới
import { COLORS, SPACING } from '../theme/theme'; // Import các biến định nghĩa về màu sắc và khoảng cách

import HeaderBar from '../components/HeaderBar'; // Thành phần hiển thị thanh tiêu đề
import EmptyListAnimation from '../components/EmptyListAnimation'; // Thành phần hiển thị animation khi danh sách trống
import FavoritesItemCard from '../components/FavoritesItemCard'; // Thành phần hiển thị thông tin chi tiết của mỗi sản phẩm yêu thích

// Component FavoritesScreen
const FavoritesScreen = ({ navigation }: any) => {
  // Lấy danh sách sản phẩm yêu thích từ store
  const FavoritesList = useStore((state: any) => state.FavoritesList);
  // Lấy chiều cao của thanh tab dưới cùng
  const tabBarHeight = useBottomTabBarHeight();

  // Các hàm để thêm và xóa sản phẩm khỏi danh sách yêu thích
  const addToFavoriteList = useStore((state: any) => state.addToFavoriteList);
  const deleteFromFavoriteList = useStore(
    (state: any) => state.deleteFromFavoriteList,
  );

  // Hàm chuyển đổi trạng thái yêu thích của sản phẩm
  const ToggleFavourite = (favourite: boolean, type: string, id: string) => {
    // Nếu sản phẩm đã yêu thích thì xóa khỏi danh sách yêu thích, ngược lại thì thêm vào
    favourite ? deleteFromFavoriteList(type, id) : addToFavoriteList(type, id);
  };

  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} /> {/* Thiết lập màu nền cho StatusBar */}

      <ScrollView
        showsVerticalScrollIndicator={false} // Ẩn thanh cuộn dọc
        contentContainerStyle={styles.ScrollViewFlex}>
        <View
          style={[styles.ScrollViewInnerView, { marginBottom: tabBarHeight }]}>
          <View style={styles.ItemContainer}>
            <HeaderBar title="Favourites" /> {/* Hiển thị tiêu đề "Favourites" */}

            {FavoritesList.length == 0 ? ( // Kiểm tra nếu danh sách yêu thích trống
              <EmptyListAnimation title={'No Favourites'} /> // Hiển thị thông báo nếu không có sản phẩm yêu thích
            ) : (
              <View style={styles.ListItemContainer}>
                {FavoritesList.map((data: any) => ( // Lặp qua danh sách yêu thích và tạo ra các thẻ cho mỗi sản phẩm
                  <TouchableOpacity
                    onPress={() => {
                      navigation.push('Details', { // Khi nhấn vào sản phẩm, điều hướng đến màn hình chi tiết
                        index: data.index,
                        id: data.id,
                        type: data.type,
                      });
                    }}
                    key={data.id}>
                    <FavoritesItemCard // Hiển thị thông tin sản phẩm yêu thích
                      id={data.id}
                      imagelink_portrait={data.imagelink_portrait}
                      name={data.name}
                      special_ingredient={data.special_ingredient}
                      type={data.type}
                      ingredients={data.ingredients}
                      average_rating={data.average_rating}
                      ratings_count={data.ratings_count}
                      roasted={data.roasted}
                      description={data.description}
                      favourite={data.favourite}
                      ToggleFavouriteItem={ToggleFavourite} // Truyền hàm ToggleFavouriteItem vào thẻ sản phẩm
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// Định nghĩa các style cho màn hình
const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex, // Thiết lập màu nền cho màn hình
  },
  ScrollViewFlex: {
    flexGrow: 1, // Thiết lập chiều cao cho ScrollView
  },
  ScrollViewInnerView: {
    flex: 1,
    justifyContent: 'space-between', // Căn giữa các thành phần trong ScrollView
  },
  ItemContainer: {
    flex: 1,
  },
  ListItemContainer: {
    paddingHorizontal: SPACING.space_20, // Thiết lập padding ngang cho danh sách sản phẩm
    gap: SPACING.space_20, // Thiết lập khoảng cách giữa các sản phẩm
  },
});

export default FavoritesScreen;
