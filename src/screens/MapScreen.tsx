import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Text,
  StatusBar,
  Platform,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import GradientBGIcon from '../components/GradientBGIcon';

const MapScreen = ({navigation}: any) => {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [storeLocation] = useState({
    latitude: 13.804187863448892,
    longitude: 109.21916488080214,
  });

  const [loading, setLoading] = useState(true);
  const [isMapReady, setIsMapReady] = useState(false);
  const mapRef = useRef<MapView>(null);

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
          const {latitude, longitude} = position.coords;
          setUserLocation({latitude, longitude});
          setLoading(false);
        },
        error => {
          console.log(error);
          Alert.alert('Không thể lấy vị trí hiện tại');
          setLoading(false);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    };

    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (isMapReady && userLocation && mapRef.current) {
      mapRef.current.fitToCoordinates([storeLocation, userLocation], {
        edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
        animated: true,
      });
    }
  }, [isMapReady, storeLocation, userLocation]);

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
            navigation.navigate('Home');
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
          showsUserLocation={true}
          showsMyLocationButton={true}
          onMapReady={() => setIsMapReady(true)}
          initialRegion={{
            latitude: storeLocation.latitude,
            longitude: storeLocation.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}>
          <Marker
            coordinate={storeLocation}
            title="Cửa Hàng Coffee"
            description="Đây là vị trí của cửa hàng."
          />
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
