// src/screens/MapScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, PermissionsAndroid, Platform, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { COLORS } from '../theme/theme';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const MapScreen: React.FC = () => {
  const [region, setRegion] = useState<any>(null);
  const [storeLocation] = useState({
    latitude: 21.028511, // Vĩ độ cửa hàng (ví dụ: Hà Nội)
    longitude: 105.804817, // Kinh độ cửa hàng
  });
  const [loading, setLoading] = useState(true);

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
        provider={PROVIDER_GOOGLE} // Sử dụng Google Maps
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
