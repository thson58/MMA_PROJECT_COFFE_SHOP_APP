import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  ActivityIndicator, 
  Alert, 
  TouchableOpacity, 
  Text, 
  StatusBar,
  Platform 
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import GradientBGIcon from '../components/GradientBGIcon';
import MapViewDirections from 'react-native-maps-directions';

const GOOGLE_MAPS_APIKEY = 'AIzaSyBN6Wyx8WwwtFkb3gW11dMJf64bktu2hX8'; // Thay thế bằng API Key của bạn

const MapScreen = ({ navigation, route }: any) => {
  const [region, setRegion] = useState<any>(null);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<MapView>(null);

  // Vị trí cửa hàng ở Việt Nam
  const storeLocation = {
    latitude: 13.80465540226516,
    longitude: 109.2191454,
  };

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        let permission;
        if (Platform.OS === 'android') {
          permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
        } else {
          permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
        }

        const result = await check(permission);
        if (result === RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          const requestResult = await request(permission);
          if (requestResult === RESULTS.GRANTED) {
            getCurrentLocation();
          } else {
            Alert.alert('Quyền truy cập vị trí bị từ chối');
            setLoading(false);
          }
        }
      } catch (error) {
        console.warn(error);
        setLoading(false);
      }
    };

    const getCurrentLocation = () => {
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({
            latitude,
            longitude,
            latitudeDelta: 20, // Để hiển thị cả San Jose và cửa hàng ở Việt Nam
            longitudeDelta: 20,
          });
          setRegion({
            latitude,
            longitude,
            latitudeDelta: 20,
            longitudeDelta: 20,
          });
          setLoading(false);

          // Điều chỉnh vùng nhìn để bao gồm cả hai điểm
          if (mapRef.current) {
            mapRef.current.fitToCoordinates([ 
              { latitude, longitude },
              storeLocation
            ], {
              edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
              animated: true,
            });
          }
        },
        error => {
          console.log(error);
          Alert.alert('Không thể lấy vị trí hiện tại');
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    };

    requestLocationPermission();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primaryOrangeHex} />
      </View>
    );
  }

  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
      <View style={styles.HeaderContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.pop();
          }}>
          <GradientBGIcon
            name="left"
            color={COLORS.primaryLightGreyHex}
            size={FONTSIZE.size_16}
          />
        </TouchableOpacity>
        <Text style={styles.HeaderText}>Store Location</Text>
        <View style={styles.EmptyView} />
      </View>
      
      <View style={styles.MapContainer}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={region}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {/* Marker cho vị trí hiện tại */}
          {currentLocation && (
            <Marker
              coordinate={currentLocation}
              title="Vị trí hiện tại của bạn"
              description="San Jose, Bắc Mỹ"
              pinColor="blue"
            />
          )}
          {/* Marker cho vị trí cửa hàng */}
          <Marker
            coordinate={storeLocation}
            title="Cửa Hàng"
            description="Đây là vị trí của cửa hàng ở Việt Nam."
            pinColor="red"
          />

          {/* Đường đi từ vị trí hiện tại đến cửa hàng */}
          {currentLocation && (
            <MapViewDirections
              origin={currentLocation}
              destination={storeLocation}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={4}
              strokeColor="hotpink"
              onError={(errorMessage) => {
                console.log('Gặp lỗi khi lấy đường đi: ', errorMessage);
                Alert.alert('Lỗi', 'Không thể lấy đường đi.');
              }}
            />
          )}
        </MapView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
  },
  HeaderContainer: {
    paddingHorizontal: SPACING.space_24,
    paddingVertical: SPACING.space_15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  HeaderText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_20,
    color: COLORS.primaryWhiteHex,
  },
  EmptyView: {
    height: SPACING.space_36,
    width: SPACING.space_36,
  },
  MapContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
  },
  map: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primaryBlackHex,
  },
});

export default MapScreen;
