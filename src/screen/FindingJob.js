import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Switch,
  Modal,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
  Alert,
  Linking,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import MapView, {
  AnimatedRegion,
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
  Circle,
} from 'react-native-maps';
import { Container } from '../components/Container/Container';
import { COLORS } from '../theme/Colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { moderateScale, scale, verticalScale } from '../utils/Scalling';
import { Fonts } from '../theme/Fonts';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Icons from '../assets/Icons';
import MapViewDirections from 'react-native-maps-directions';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useFocusEffect } from '@react-navigation/native';
import images from '../assets/images';
import { loadUserLocalMethod, setUserData } from '../redux/slice/UserSlice';
import { UPDATE_RIDE_BOOKING } from '../api/Endpoints';
import { BASE_URL } from '../api/BaseUrl';
import axios from 'axios';
import {
  requestLocationPermissions,
  watchLocationContinuously,
  stopWatchingLocation,
  checkDeviceLocationServices,
  openLocationSettings,
} from '../utils/helperFunctions';
import socketServices from '../utils/socketServices';
import debounce from '../utils/debounce';
import { useNotification } from '../utils/notificationHook';
import { useDispatch, useSelector } from 'react-redux';
import { deviceHeight, deviceWidth } from '../utils/contants';
import OngoingRideModals from './OngoingRideModals';
import DriverRatingModal from '../components/DriverRatingModal/DriverRatingModal';

// Tighter zoom level for better driver view
const LATITUDE_DELTA = 0.002;
const LONGITUDE_DELTA = 0.002;

const { width, height } = Dimensions.get('window');

export default function FindingJob({ navigation }) {
  // Hooks
  const dispatch = useDispatch();
  const { playRingtone, toggleRidePoup, setPopupVisible } = useNotification();
  const userData = useSelector(state => state.user);

  // States
  const [isOnline, setIsOnline] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userLocalData, setUserLocalData] = useState(null);
  const [socketInitialized, setSocketInitialized] = useState(false);
  const [heading, setHeading] = useState(0);
  const [showOngoingRideModal, setShowOngoingRideModal] = useState(false);
  const [ongoingPickedRide, setOngoingPickedRide] = useState(null);
  const [remainingDistance, setRemainingDistance] = useState(null);
  const [remainingDuration, setRemainingDuration] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const [state, setState] = useState({
    curLoc: { latitude: 23.0225, longitude: 72.5714 },
    destinationCords: { latitude: 0, longitude: 0 },
    isLoading: false,
    coordinate: new AnimatedRegion({
      latitude: 23.0225,
      longitude: 72.5714,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }),
    distance: 0,
  });
  const [locationUpdateCount, setLocationUpdateCount] = useState(0);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [completedRideData, setCompletedRideData] = useState(null);
  const [mapFocusKey, setMapFocusKey] = useState(0);

  // Refs
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const locationWatcherRef = useRef(null);
  const isMountedRef = useRef(true);
  const debouncedLocationUpdateRef = useRef(null);
  const socketInitializedRef = useRef(false);

  // Load user data and initialize on mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const userData = await loadUserLocalMethod();
        if (isMountedRef.current) {
          setUserLocalData(userData);
        }
        await requestLocationPermission();
        startLocationTracking(false);
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        if (isMountedRef.current) {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      }
    };

    initializeApp();

    return () => {
      isMountedRef.current = false;
      stopLocationTracking();
      removeSocketListeners();
      if (isOnline && socketServices.isConnected()) {
        socketServices.emit('offline_driver');
      }
    };
  }, []);

  // Handle online/offline state changes
  useEffect(() => {
    if (!userLocalData?._id || !userLocalData?.token) return;
    if (isOnline) {
      initializeSocketAndStartTracking();
    } else {
      goOffline();
    }
  }, [isOnline, userLocalData]);

  const handleRideStatusChange = ride => {
    if (!ride) return;
    if (
      ride.bookingStatus === 'ongoing' &&
      ride.rideStatus === 'rideNotPicked'
    ) {
      setOngoingPickedRide(ride);
      setCompletedRideData(null);
    } else if (
      ride.bookingStatus === 'ongoing' &&
      ride.rideStatus === 'ridePicked'
    ) {
      setOngoingPickedRide(ride);
      setCompletedRideData(null);
    } else if (ride.bookingStatus === 'completed') {
      setCompletedRideData(ride);
      setOngoingPickedRide(null);
      setShowOngoingRideModal(false);
      setShowRatingModal(true);
    } else {
      setOngoingPickedRide(null);
      setShowOngoingRideModal(false);
      setCompletedRideData(null);
    }
  };

  // Socket listeners
  useFocusEffect(
    useCallback(() => {
      if (!isOnline || !userLocalData?.token) return;
      debouncedLocationUpdateRef.current = debounce(location => {
        if (isOnline && socketServices.isConnected()) {
          console.log('sending location to server ===> ', location);
          socketServices.emit('updateDriverLocation', {
            latitude: location.latitude,
            longitude: location.longitude,
            heading: location.heading,
          });
          setLocationUpdateCount(prev => prev + 1);
        }
      }, 1000);

      const handleBookingList = onGoing_Booking => {
        if (!isMountedRef.current) return;
        if (onGoing_Booking?.data?.length > 0) {
          const ride = onGoing_Booking.data[0];
          handleRideStatusChange(ride);
          if (ride.destinationLocation && mapRef.current) {
            mapRef.current.fitToCoordinates(
              [
                state.curLoc,
                {
                  latitude: ride.destinationLocation.latitude,
                  longitude: ride.destinationLocation.longitude,
                },
              ],
              {
                edgePadding: {
                  top: deviceHeight / 4,
                  left: deviceWidth / 4,
                  right: deviceWidth / 4,
                  bottom: deviceHeight / 4,
                },
                animated: true,
              }
            );
          }
        } else {
          setOngoingPickedRide(null);
          setShowOngoingRideModal(false);
        }
      };

      socketServices.on('onGoing_Booking_List', handleBookingList);
      socketServices.on('driver_booking_response', handleBookingList);
      socketServices.emit('onGoing_booking_driver', {});

      return () => {
        socketServices.removeListener('onGoing_Booking_List', handleBookingList);
        socketServices.removeListener('driver_booking_response', handleBookingList);
      };
    }, [isOnline, state.curLoc, ongoingPickedRide])
  );

  // KEY FIX: Re-center map every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setMapReady(false);
      setMapFocusKey(prev => prev + 1);
      const timer = setTimeout(() => {
        if (mapRef.current && state.curLoc) {
          if (!ongoingPickedRide) {
            onCenter();
          }
        }
      }, 800);
      return () => {
        clearTimeout(timer);
        setMapReady(false);
      };
    }, [state.curLoc, ongoingPickedRide])
  );

  const goOffline = () => {
    if (socketServices.isConnected()) {
      socketServices.emit('offline_driver');
    }
    socketServices.removeListener('updateDriverLocation');
    startLocationTracking(false);
    if (ongoingPickedRide) {
      setOngoingPickedRide(null);
      setShowOngoingRideModal(false);
    }
  };

  const startLocationTracking = (sendToServer = false) => {
    stopLocationTracking();
    locationWatcherRef.current = watchLocationContinuously(
      location => {
        const { latitude, longitude, heading } = location;
        if (heading !== undefined) {
          setHeading(heading);
        }
        if (isMountedRef.current) {
          setState(prev => ({
            ...prev,
            curLoc: { latitude, longitude },
            coordinate: new AnimatedRegion({
              latitude,
              longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }),
          }));
        }
        if (mapReady && mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude,
              longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            },
            1000
          );
        }
        if (sendToServer && debouncedLocationUpdateRef.current) {
          debouncedLocationUpdateRef.current({ latitude, longitude, heading });
        }
      },
      error => {
        console.log('Location watch error:', error);
        handleLocationError(error);
      },
      { enableHighAccuracy: true, distanceFilter: 10 }
    );
  };

  const stopLocationTracking = () => {
    if (locationWatcherRef.current) {
      stopWatchingLocation(locationWatcherRef.current);
      locationWatcherRef.current = null;
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
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: openLocationSettings },
          ]
        );
        return false;
      }

      const isLocationEnabled = await checkDeviceLocationServices();
      if (!isLocationEnabled) {
        Alert.alert(
          'Location Services Disabled',
          'Please enable device location services to track your location',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: openLocationSettings },
          ]
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
      if (!socketServices.isConnected()) {
        socketInitializedRef.current = true;
      }
      socketServices.emit('online_driver', {});
      startLocationTracking(true);
    } catch (error) {
      console.error('Socket initialization failed:', error);
      Alert.alert('Connection Error', 'Failed to connect to server');
      if (isMountedRef.current) {
        setIsOnline(false);
      }
    }
  };

  const removeSocketListeners = () => {
    try {
      socketServices.removeListener('onGoing_Booking_List');
      socketServices.removeListener('driver_booking_response');
      socketServices.removeListener('updateDriverLocation');
    } catch (error) {
      console.error('Error removing socket listeners:', error);
    }
  };

  const handleLocationError = error => {
    console.error('Location error:', error);
    if (error.code === 2 || error.code === 3) {
      Alert.alert(
        'Location Error',
        'Unable to get your location. Please check your GPS and network connection.',
        [
          { text: 'OK', onPress: () => startLocationTracking(isOnline) },
          { text: 'Settings', onPress: openLocationSettings },
        ]
      );
    }
  };

  const handleSwitchChange = async value => {
    if (value) {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        return;
      }
    }
    setIsOnline(value);
    setPopupVisible(value);
    if (value) {
      if (socketServices.isConnected()) {
        socketServices.emit('online_driver', {
          driverId: userLocalData?._id,
          location: state.curLoc,
        });
      }
    } else {
      if (socketServices.isConnected()) {
        socketServices.emit('offline_driver');
      }
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
        500
      );
    }
  };

  const handleCompleteRide = async () => {
    if (!ongoingPickedRide?._id) return;
    try {
      socketServices.emit('update_booking_status', {
        bookingId: ongoingPickedRide?._id,
        bookingType: 'completed',
      });
      socketServices.emit('onGoing_booking_driver', {});
    } catch (error) {
      console.error('Error completing ride:', error);
    }
  };

  const renderCustomMarker = () => {
    return (
      <Marker.Animated
        ref={markerRef}
        coordinate={state.coordinate}
        anchor={{ x: 0.5, y: 0.5 }}
        flat={false}
        zIndex={1000}
        rotation={heading}>
        <View
          style={{
            transform: [{ rotate: `${heading}deg` }],
            backgroundColor: COLORS.markerCircle,
            borderRadius: scale(100),
            padding: scale(30),
          }}>
          <Fontisto name="car" size={scale(40)} color={COLORS.charcoalGray} />
        </View>
      </Marker.Animated>
    );
  };

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={COLORS.transparent}>
      <View style={styles.container}>
        <SafeAreaView style={styles.headerSafeArea}>
          <View style={styles.headerContainer}>
            <View style={styles.userInfoSection}>
              <View style={styles.avatarContainer}>
                <FontAwesome name="user-circle" size={scale(40)} color={COLORS.white} />
              </View>
              <View style={styles.userTextContainer}>
                <Text style={styles.userName}>Driver</Text>
                <Text style={styles.userStatus}>Ready to drive</Text>
              </View>
            </View>
            <View style={styles.statusCard}>
              <View style={styles.statusIndicator}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: isOnline ? COLORS.success : COLORS.error },
                  ]}
                />
                <Text style={styles.statusText}>
                  {isOnline ? 'Online' : 'Offline'}
                </Text>
              </View>
              <Switch
                value={isOnline}
                onValueChange={handleSwitchChange}
                trackColor={{ false: COLORS.gray2, true: COLORS.gray2 }}
                thumbColor={isOnline ? COLORS.success : COLORS.gray3}
              />
            </View>
          </View>
        </SafeAreaView>

        {state.isLoading ? (
          <View style={styles.loaderBox}>
            <ActivityIndicator size={scale(40)} color={COLORS.Amber} />
          </View>
        ) : (
          <MapView
            key={mapFocusKey}
            style={{ flex: 1 }}
            ref={mapRef}
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
            showsUserLocation={false}
            initialRegion={{
              ...state.curLoc,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}
            onMapReady={() => {
              setMapReady(true);
              // Force initial center
              if (state.curLoc) {
                onCenter();
              }
            }}>
            {renderCustomMarker()}

            {ongoingPickedRide?.destinationLocation && (
              <Marker
                coordinate={{
                  latitude: ongoingPickedRide.destinationLocation.latitude,
                  longitude: ongoingPickedRide.destinationLocation.longitude,
                }}>
                <Fontisto name="car" size={scale(30)} color={COLORS.red} />
              </Marker>
            )}

            {ongoingPickedRide?.pickupLocation &&
              ongoingPickedRide?.destinationLocation && (
                <MapViewDirections
                  origin={{
                    latitude: ongoingPickedRide.pickupLocation.latitude,
                    longitude: ongoingPickedRide.pickupLocation.longitude,
                  }}
                  destination={{
                    latitude: ongoingPickedRide.destinationLocation.latitude,
                    longitude: ongoingPickedRide.destinationLocation.longitude,
                  }}
                  apikey="AIzaSyD7u-bDQzuzqgRxHkT9fRd6xyMsRmtgLEY"
                  strokeWidth={4}
                  strokeColor={COLORS.themePrimary}
                  mode="DRIVING"
                  onReady={result => {
                    setRemainingDistance(result?.distance);
                    setRemainingDuration(result?.duration);
                    if (
                      mapRef.current &&
                      result.coordinates &&
                      result.coordinates.length > 0
                    ) {
                      mapRef.current.fitToCoordinates(result.coordinates, {
                        edgePadding: {
                          top: deviceHeight / 4,
                          left: deviceWidth / 4,
                          right: deviceWidth / 4,
                          bottom: deviceHeight / 4,
                        },
                        animated: true,
                      });
                    }
                  }}
                />
              )}
          </MapView>
        )}

        {!ongoingPickedRide && (
          <View style={styles.statsContainer}>
            <TouchableOpacity
              style={styles.statCard}
              onPress={() => toggleRidePoup()}
              activeOpacity={0.8}>
              <View style={styles.statIconContainer}>
                <AntDesign name="calendar" size={scale(24)} color={COLORS.themePrimary} />
              </View>
              <View style={styles.statInfo}>
                <Text style={styles.statLabel}>Pre-booked Rides</Text>
                <Text style={styles.statValue}>10</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.statDivider} />
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <FontAwesome name="money" size={scale(24)} color={COLORS.success} />
              </View>
              <View style={styles.statInfo}>
                <Text style={styles.statLabel}>Today's Earnings</Text>
                <Text style={styles.statValue}>₹500</Text>
              </View>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.centerButton,
            { bottom: ongoingPickedRide ? 120 : 90 },
          ]}
          onPress={onCenter}>
          <View style={styles.centerButtonInner}>
            <Image source={Icons.LocationTarget} style={styles.targetIcon} />
          </View>
        </TouchableOpacity>

        {ongoingPickedRide && (
          <>
            <TouchableOpacity
              style={styles.completeRideButton}
              onPress={handleCompleteRide}>
              <MaterialIcons name="done-all" size={scale(20)} color={COLORS.white} />
              <Text style={styles.completeRideText}>Complete Ride</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.infoButton}
              onPress={() => setShowOngoingRideModal(!showOngoingRideModal)}>
              <MaterialIcons name="info" size={scale(22)} color={COLORS.white} />
            </TouchableOpacity>
          </>
        )}

        {ongoingPickedRide && (
          <OngoingRideModals
            visible={showOngoingRideModal}
            onClose={() => setShowOngoingRideModal(false)}
            rideData={ongoingPickedRide}
            currentLocation={state.curLoc}
            remainingDuration={remainingDuration}
            remainingDistance={remainingDistance}
            isRideStarted={true}
          />
        )}

        <DriverRatingModal
          visible={showRatingModal}
          onClose={() => {
            setShowRatingModal(false);
            setCompletedRideData(null);
          }}
          rideData={{ ...completedRideData, token: userLocalData?.token }}
          onSubmit={() => {
            if (isOnline && socketServices.isConnected()) {
              socketServices.emit('onGoing_booking_driver', {});
            }
          }}
        />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerSafeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    backgroundColor: 'transparent',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingTop: Platform.OS === 'ios' ? scale(10) : scale(20),
    paddingBottom: scale(12),
    backgroundColor: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(10px)',
  },
  userInfoSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: scale(10),
  },
  userTextContainer: {
    justifyContent: 'center',
  },
  userName: {
    fontFamily: Fonts.Bold,
    fontSize: moderateScale(16),
    color: COLORS.white,
  },
  userStatus: {
    fontFamily: Fonts.Regular,
    fontSize: moderateScale(12),
    color: COLORS.white + 'CC',
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: moderateScale(30),
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: scale(8),
  },
  statusDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    marginRight: scale(4),
  },
  statusText: {
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(12),
    color: COLORS.black,
  },
  loaderBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary3,
  },
  statsContainer: {
    position: 'absolute',
    top: scale(100),
    left: scale(16),
    right: scale(16),
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(16),
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(12),
    paddingHorizontal: scale(12),
  },
  statIconContainer: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: COLORS.gray1 + '30',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(10),
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(12),
    color: COLORS.gray,
    marginBottom: scale(2),
  },
  statValue: {
    fontFamily: Fonts.Bold,
    fontSize: moderateScale(16),
    color: COLORS.black,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.gray2,
    marginVertical: scale(12),
  },
  centerButton: {
    position: 'absolute',
    right: 20,
    backgroundColor: COLORS.white,
    borderRadius: scale(40),
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 10,
  },
  centerButtonInner: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    backgroundColor: COLORS.themePrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  targetIcon: {
    height: scale(22),
    width: scale(22),
    resizeMode: 'contain',
    tintColor: COLORS.white,
  },
  completeRideButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: COLORS.success,
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(30),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 10,
  },
  completeRideText: {
    fontFamily: Fonts.Bold,
    fontSize: moderateScale(16),
    color: COLORS.white,
    marginLeft: scale(8),
  },
  infoButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: COLORS.themePrimary,
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 10,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  searchBarContainer: {
    position: 'absolute',
    top: scale(10),
    left: 10,
    right: 10,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(5),
    paddingHorizontal: scale(15),
    paddingVertical: scale(5),
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginHorizontal: scale(5),
  },
  searchBarInput: {
    flex: 1,
    marginLeft: 10,
    height: 40,
    fontSize: 16,
    borderRadius: 25,
    backgroundColor: COLORS.white,
    paddingLeft: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: scale(10),
    backgroundColor: COLORS.Amber,
    paddingVertical: verticalScale(5),
    paddingHorizontal: scale(5),
    borderRadius: moderateScale(5),
  },
  switchText: {
    fontFamily: Fonts.Medium,
    color: COLORS.white,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderTopLeftRadius: moderateScale(10),
    borderTopRightRadius: moderateScale(10),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: scale(15),
    marginVertical: verticalScale(15),
    borderBottomWidth: 0.5,
    paddingBottom: scale(15),
  },
  modalText: {
    fontSize: 18,
    fontFamily: Fonts.Medium,
    color: COLORS.black,
  },
  rideTimeText: {
    fontFamily: Fonts.Medium,
    textAlignVertical: 'center',
    fontSize: moderateScale(12),
  },
  riderSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(16),
    marginHorizontal: scale(15),
  },
  avatarContainer2: {
    marginRight: scale(12),
  },
  avatarPlaceholder: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    backgroundColor: '#E0E0E0',
  },
  riderInfo: {
    flex: 1,
  },
  riderName: {
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(16),
    color: COLORS.black,
  },
  riderCRN: {
    fontFamily: Fonts.Regular,
    fontSize: moderateScale(12),
    color: COLORS.gray,
  },
  locationContainer: {
    marginBottom: scale(16),
    marginHorizontal: scale(15),
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(8),
  },
  locationText: {
    marginLeft: scale(8),
    fontFamily: Fonts.Regular,
    fontSize: moderateScale(14),
    color: COLORS.black,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: scale(15),
    marginVertical: verticalScale(10),
  },
  declineButton: {
    backgroundColor: COLORS.gray3,
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(45),
    borderRadius: moderateScale(25),
    alignItems: 'center',
    marginRight: scale(10),
  },
  acceptButton: {
    backgroundColor: COLORS.Amber,
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(45),
    borderRadius: moderateScale(25),
    alignItems: 'center',
  },
  buttonText: {
    fontSize: moderateScale(14),
    fontFamily: Fonts.Bold,
    color: COLORS.black,
    textAlign: 'center',
  },
  acceptedContent: {
    marginVertical: verticalScale(20),
  },
  locationImage: {
    height: scale(80),
    width: scale(80),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  acceptedTitle: {
    textAlign: 'center',
    color: COLORS.black,
    fontFamily: Fonts.Bold,
    fontSize: moderateScale(17),
    marginTop: scale(10),
  },
  acceptedAddress: {
    textAlign: 'center',
    color: COLORS.black,
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(15),
    marginTop: scale(10),
  },
  askOtpButton: {
    backgroundColor: COLORS.Amber,
    marginTop: scale(20),
    marginHorizontal: scale(15),
    borderRadius: moderateScale(25),
    paddingVertical: verticalScale(8),
  },
  locationButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: COLORS.black,
    padding: 10,
    borderRadius: 50,
    elevation: 5,
    zIndex: 10,
  },
  locationButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  preBookedAndEarningsContainer: {
    position: 'absolute',
    top: scale(70),
    flexDirection: 'row',
    borderRadius: moderateScale(8),
    alignItems: 'center',
    left: scale(15),
    right: scale(15),
  },
  preBookedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: scale(30),
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    padding: scale(5),
    borderRadius: moderateScale(5),
  },
  calendarIconContainer: {
    backgroundColor: COLORS.gray2,
    width: scale(40),
    height: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(25),
    marginRight: scale(10),
  },
  preBookedTextContainer: {
    justifyContent: 'center',
  },
  preBookedTitle: {
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(14),
    color: COLORS.black,
  },
  preBookedCount: {
    fontFamily: Fonts.Bold,
    fontSize: moderateScale(15),
    color: COLORS.black,
  },
  todayEarningsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    padding: scale(5),
    borderRadius: moderateScale(5),
    right: scale(5),
  },
  earningsIconContainer: {
    backgroundColor: COLORS.gray2,
    width: scale(40),
    height: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(25),
    marginRight: scale(10),
  },
  todayEarningsTextContainer: {
    justifyContent: 'center',
  },
  LocationTargeticon: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    backgroundColor: COLORS.themePrimary,
    padding: 10,
    borderRadius: 50,
    elevation: 5,
    zIndex: 10,
  },
  RideDetailsIconButton: {
    position: 'absolute',
    bottom: 160,
    right: 20,
    backgroundColor: COLORS.themePrimary,
    padding: 10,
    borderRadius: 50,
    elevation: 5,
    zIndex: 10,
  },
  CompleteRideicon: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: COLORS.themePrimary,
    padding: 10,
    borderRadius: 10,
    elevation: 5,
    zIndex: 10,
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  TargetButton: {
    height: scale(20),
    width: scale(20),
    resizeMode: 'contain',
  },
});