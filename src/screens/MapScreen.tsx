// src/screens/MapScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, PermissionsAndroid, Platform, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { COLORS } from '../theme/theme';

const MapScreen = () => {
  const [region, setRegion] = useState(null);
  const [storeLocation, setStoreLocation] = useState({
    latitude: 21.028511, // Vĩ độ cửa hàng (ví dụ: Hà Nội)
    longitude: 105.804817, // Kinh độ cửa hàng
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Yêu cầu quyền truy cập vị trí',
              message: 'Ứng dụng cần truy cập vị trí của bạn để hiển thị bản đồ.',
              buttonNeutral: 'Hỏi lại sau',
              buttonNegative: 'Hủy',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            getCurrentLocation();
          } else {
            Alert.alert('Quyền truy cập vị trí bị từ chối');
            setLoading(false);
          }
        } catch (err) {
          console.warn(err);
          setLoading(false);
        }
      } else {
        getCurrentLocation();
      }
    };

    const getCurrentLocation = () => {
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setRegion({
            latitude,
            longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          });
          setLoading(false);
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
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        <Marker
          coordinate={storeLocation}
          title="Cửa Hàng"
          description="Đây là vị trí của cửa hàng."
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapScreen;
