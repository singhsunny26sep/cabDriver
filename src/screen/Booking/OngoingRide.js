import {Image, Linking, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Container} from '../../components/Container/Container';
import {COLORS} from '../../theme/Colors';
import MapView, {
  AnimatedRegion,
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
  Circle,
  Callout,
} from 'react-native-maps';
import socketServices from '../../utils/socketServices';
import {
  checkDeviceLocationServices,
  openLocationSettings,
  requestLocationPermissions,
  stopWatchingLocation,
  watchLocationContinuously,
} from '../../utils/helperFunctions';
import {loadUserLocalMethod} from '../../redux/slice/UserSlice';
import Icons from '../../assets/Icons';
import {scale} from '../../utils/Scalling';
import {useNavigation, useRoute} from '@react-navigation/native';
import MapViewDirections from 'react-native-maps-directions';

const LATITUDE_DELTA = 0.003;
const LONGITUDE_DELTA = 0.003;

const OngoingRide = () => {
  const navigation = useNavigation();
  const routes = useRoute();
  const {bookingItem} = routes?.params || {};

  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const locationWatcherRef = useRef(null);
  const isMountedRef = useRef(true);

  const [userLocalData, setUserLocalData] = useState(null);
  const [socketInitialized, setSocketInitialized] = useState(false);
  const [heading, setHeading] = useState(0);
  const [state, setState] = useState({
    curLoc: {latitude: 23.0225, longitude: 72.5714},
    destinationCords: {latitude: 0, longitude: 0},
    isLoading: false,
    coordinate: new AnimatedRegion({
      latitude: 23.0225,
      longitude: 72.5714,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }),
    distance: 0,
  });

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await loadLocalData();
        await requestLocationPermission();
        startLocationTracking(false); // Start location tracking immediately (for offline mode)
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };

    initializeApp();

    return () => {
      isMountedRef.current = false;
      stopWatchingLocation(locationWatcherRef.current);
      // socketServices.disconnectSocket();
      socketServices?.removeListener('updateDriverLocation');
    };
  }, []);

  useEffect(() => {
    if (!userLocalData?._id || !userLocalData?.token) return;
    initializeSocketAndStartTracking();
    return () => {
      socketServices?.removeListener('updateDriverLocation');
      // socketServices.disconnectSocket();
    };
  }, [userLocalData]);

  const loadLocalData = async () => {
    try {
      const userData = await loadUserLocalMethod();
      console.log('load user data on ongoing rides :---------', userData);
      console.log('load bookingItem :---------', bookingItem);
      if (isMountedRef.current) {
        setUserLocalData(userData);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      if (isMountedRef.current) {
        setState(prev => ({...prev, isLoading: false}));
      }
    }
  };
  const requestLocationPermission = async () => {
    try {
      const hasPermission = await requestLocationPermissions();
      if (!hasPermission) {
        Alert.alert(
          'Location Permission Required',
          'Please enable location permissions to use this feature',
          [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Open Settings', onPress: openLocationSettings},
          ],
        );
        return false;
      }

      const isLocationEnabled = await checkDeviceLocationServices();
      if (!isLocationEnabled) {
        Alert.alert(
          'Location Services Disabled',
          'Please enable device location services to track your location',
          [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Open Settings', onPress: openLocationSettings},
          ],
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error('Permission request error:', error);
      return false;
    }
  };
  const initializeSocketAndStartTracking = async () => {
    try {
      // await socketServices.initializeSocket(userLocalData.token);
      if(socketServices.isConnected()){
        setSocketInitialized(true);
        startLocationTracking(true); // Start tracking with socket updates
      }
    } catch (error) {
      console.error('Socket initialization failed:', error);
      Alert.alert('Connection Error', 'Failed to connect to server');
    }
  };
  const startLocationTracking = (sendToServer = false) => {
    // Stop any existing watcher
    if (locationWatcherRef.current) {
      stopWatchingLocation(locationWatcherRef.current);
    }

    console.log('sendToServer', sendToServer);
    console.log('socketServices.isConnected()', socketServices.isConnected());

    locationWatcherRef.current = watchLocationContinuously(
      location => {
        const {latitude, longitude, heading} = location;

        console.log('RAW LOCATION UPDATE:', location);
        if (socketServices.isConnected()) {
          console.log('EMITTING LOCATION UPDATE::::::::::::', location);
          socketServices.emit('updateDriverLocation', {
            latitude: location.latitude,
            longitude: location.longitude,
            heading: location.heading,
          });
        }

        if (heading) {
          setHeading(heading);
        }

        // Update UI state
        if (isMountedRef.current) {
          setState(prev => ({
            ...prev,
            curLoc: {latitude, longitude},
            coordinate: new AnimatedRegion({
              latitude,
              longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }),
            destinationCords: {
              latitude: bookingItem.pickupLocation.latitude,
              longitude: bookingItem.pickupLocation.longitude,
            },
          }));
        }

        // Update map view
        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude,
              longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            },
            1000,
          );
        }

        // Send to server if online
        // if (sendToServer) {
        //   // debouncedServerUpdate({latitude, longitude, heading});
        // }
      },
      error => {
        console.log('Location watch error:', error);
        handleLocationError(error);
      },
    );
  };
  const handleLocationError = error => {
    if (error.code === 2) {
      Alert.alert('Device Location Lost', 'Please enable location.', [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Open Settings',
          onPress: () => {
            Linking.sendIntent(
              'android.settings.LOCATION_SOURCE_SETTINGS',
            ).catch(() => {
              Linking.openSettings();
            });
          },
        },
      ]);
    }
  };
  const onCenter = () => {
    if (mapRef.current && state.curLoc) {
      mapRef.current.animateToRegion(
        {
          latitude: state.curLoc.latitude,
          longitude: state.curLoc.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        },
        500,
      );
    }
  };

  // Custom marker with rotation based on heading
  const renderCustomMarker = () => {
    console.log(
      'Object.keys(state.destinationCords).length -----',
      Object.keys(state.destinationCords).length,
    );
    return (
      <Marker.Animated
        ref={markerRef}
        coordinate={state.coordinate}
        anchor={{x: 0.5, y: 0.5}}
        flat={true}
        initialRegion={{
          ...state.curLoc,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        rotation={heading}>
        <View style={{transform: [{rotate: `${heading}deg`}]}}>
          <Image
            resizeMode="contain"
            source={Icons.navigation}
            style={{
              width: scale(30),
              height: scale(30),
            }}
          />
        </View>
      </Marker.Animated>
    );
  };

  return (
    <Container
      // fullScreen={true}
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={COLORS.transparent}>
      <View style={styles.container}>
        <MapView
          style={{flex: 1}}
          ref={mapRef}
          showsTraffic={true}
          provider={
            Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
          }
          showsUserLocation={false}>
          {renderCustomMarker()}
          {Object.keys(state.destinationCords).length > 0 && (
            <Marker
              coordinate={state.destinationCords}
              anchor={{x: 0.5, y: 1}}
              // image={Icons.locationGreenMarker}
              >
              <Image
                source={Icons.locationGreenMarker}
                style={{ width: 32, height: 32 }}
              />
                  <Callout tooltip={true} style={styles.callout}>
                    <View style={styles.calloutContainer}>
                      <Text style={styles.calloutText}>
                        {bookingItem?.pickupLocation?.address}
                      </Text>
                    </View>
                    </Callout>
              {/* <Text style={{height: scale(16), width: '80%', backgroundColor: COLORS.white1, borderRadius: scale(10),}}>{bookingItem?.pickupLocation?.address}</Text>
              <Image
                resizeMode="contain"
                source={Icons.locationGreenMarker}
                style={{
                  width: scale(30),
                  height: scale(30),
                }}
              /> */}
            </Marker>
          )}
          {Object.keys(state.destinationCords).length > 0 && (
            <MapViewDirections
              origin={state.curLoc}
              destination={state.destinationCords}
              apikey="AIzaSyD7u-bDQzuzqgRxHkT9fRd6xyMsRmtgLEY"
              strokeWidth={3}
              strokeColor="#1a73e8"
              strokeColors={['#1a73e8', '#34a853', '#fbbc05', '#ea4335']}
              trafficMode={true}
              optimizeWaypoints={true}
              onReady={result => {
                mapRef?.current?.fitToCoordinates(result.coordinates, {
                  edgePadding: {top: 50, left: 50, right: 50, bottom: 50},
                });
              }}
              onError={errorMessage => {
                console.log('GOT AN ERROR', errorMessage);
              }}
            />
          )}
        </MapView>
        <TouchableOpacity style={styles.LocationTargeticon} onPress={onCenter}>
          <Image source={Icons.LocationTarget} style={styles.TargetButton} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.chatIcon} onPress={()=>{navigation.navigate("ChatScreen", {bookingId: bookingItem?._id})}}>
          <Image source={Icons.Message} style={styles.TargetButton} />
        </TouchableOpacity>
      </View>
    </Container>
  );
};

export default OngoingRide;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  LocationTargeticon: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 50,
    elevation: 5,
    zIndex: 10,
  },
  chatIcon: {
    position: 'absolute',
    bottom: 20,
    right: 80,
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 50,
    elevation: 5,
    zIndex: 10,
  },
    TargetButton: {
    height: scale(30),
    width: scale(30),
    resizeMode: 'contain',
  },
    callout: {
    width: 200,
  },
  calloutContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 6,
    elevation: 5,
  },
  calloutText: {
    fontSize: 14,
    color: '#333',
  },
});
