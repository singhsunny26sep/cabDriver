import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {COLORS} from '../../theme/Colors';
import {Fonts} from '../../theme/Fonts';
import {moderateScale, scale, verticalScale} from '../../utils/Scalling';
import MapView, {Marker, Polyline} from 'react-native-maps';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Container} from '../../components/Container/Container';
import {
  bookings,
  driverCancelRideReasons,
  GenderData,
} from '../../utils/StaticDataBase';
import {loadUserLocalMethod} from '../../redux/slice/UserSlice';
import socketServices from '../../utils/socketServices';
import {rideTypes} from '../../utils/contants';
import moment from 'moment';
import Icons from '../../assets/Icons';
import axios from 'axios';
import {BASE_URL} from '../../api/BaseUrl';
import {UPDATE_RIDE_BOOKING} from '../../api/Endpoints';
import ElementDropdown from '../../components/ElementDropdown/ElementDropdown';
import {showToast} from '../../components/CustomToast/CustomToast';

let LATITUDE_DELTA = 0.585;
let LONGITUDE_DELTA = 0.585;

export default function CompletedBookings({navigation}) {
  const [userLocalData, setUserLocalData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(rideTypes[0].value);
  const [bookingsData, setBookingsData] = useState([]);

  const flatListRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await loadLocalData();
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };
    initializeApp();

    return () => {
      socketServices?.removeListener(`${activeTab}_booking`);
      socketServices?.removeListener(`${activeTab}_booking_list`);
    };
  }, []);

  useEffect(() => {
    if (!userLocalData?._id || !userLocalData?.token) {return;}

    initializeSockets();
    handleTabChange(activeTab);

    return () => {
      socketServices?.removeListener(`${activeTab}_booking`);
      socketServices?.removeListener(`${activeTab}_booking_list`);
    };
  }, [userLocalData]);

  const initializeSockets = async () => {
    try {

      // await socketServices.initializeSocket(userLocalData.token);

      if (socketServices.isConnected()) {
        socketServices.emit(`${activeTab}_booking`, {});

        socketServices.on(`${activeTab}_booking_list`, data => {
          console.log('data booking....', data);
          // Filter data to only show items with "completed" status
          const filteredData = data.filter(
            item => item.bookingStatus === 'completed',
          );
          setBookingsData(filteredData);
          setIsLoading(false);
        });
      }
    } catch (error) {
      console.error('Socket initialization failed:', error);
      setIsLoading(false);
    }
  };

  const loadLocalData = async () => {
    try {
      setIsLoading(true);
      const userData = await loadUserLocalMethod();
      setUserLocalData(userData);
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = typeValue => {
    // if (!socketServices.isConnected()) return;

    setActiveTab(typeValue);
    setIsLoading(true);

    // Emit event based on the selected type value
    const eventName = `${typeValue}_booking`;
    socketServices.emit(eventName, {});

    socketServices.on(`${typeValue}_booking_list`, data => {
      console.log('data booking....', data);
      // Filter data to only show items with "completed" status
      const filteredData = data.filter(
        item => item.bookingStatus === 'completed',
      );
      setBookingsData(filteredData);
      // setBookingsData(data);
      setIsLoading(false);
    });

    // Reset scroll position
    flatListRef.current?.scrollToOffset({animated: true, offset: 0});
  };

  const getTypeNameByValue = value => {
    const type = rideTypes.find(item => item.value === value);
    return type ? type.name : value;
  };

  const renderBookingCard = ({item}) => {
    const calculateDeltas = () => {
      if (!item?.pickupLocation || !item?.destinationLocation) {
        return {
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };
      }

      const pickupLat = item.pickupLocation.latitude;
      const pickupLng = item.pickupLocation.longitude;
      const destLat = item.destinationLocation.latitude;
      const destLng = item.destinationLocation.longitude;

      // Find the min and max coordinates
      const minLat = Math.min(pickupLat, destLat);
      const maxLat = Math.max(pickupLat, destLat);
      const minLng = Math.min(pickupLng, destLng);
      const maxLng = Math.max(pickupLng, destLng);

      // Calculate the deltas with some padding
      const latDelta = (maxLat - minLat) * 1.5; // 1.5x for padding
      const lngDelta = (maxLng - minLng) * 1.5; // 1.5x for padding

      // Ensure minimum delta values so the map isn't too zoomed out
      return {
        latitudeDelta: Math.max(latDelta, LATITUDE_DELTA),
        longitudeDelta: Math.max(lngDelta, LONGITUDE_DELTA),
      };
    };

    const {latitudeDelta, longitudeDelta} = calculateDeltas();

    // Calculate center point between the two locations
    const calculateCenter = () => {
      if (!item?.pickupLocation || !item?.destinationLocation) {
        return {
          latitude: item?.pickupLocation?.latitude,
          longitude: item?.pickupLocation?.longitude,
        };
      }

      return {
        latitude:
          (item.pickupLocation.latitude + item.destinationLocation.latitude) /
          2,
        longitude:
          (item.pickupLocation.longitude + item.destinationLocation.longitude) /
          2,
      };
    };

    const center = calculateCenter();

    const onCenter = () => {
      if (
        mapRef.current &&
        item?.pickupLocation?.latitude &&
        item?.pickupLocation?.longitude &&
        item?.destinationLocation?.latitude &&
        item?.destinationLocation?.longitude
      ) {
        mapRef.current.animateToRegion(
          {
            latitude: center.latitude,
            longitude: center.longitude,
            latitudeDelta,
            longitudeDelta,
          },
          500,
        );
      }
    };
    onCenter();

    return (
      <View style={styles.bookingCard}>
        <View style={styles.riderSection}>
          <View style={styles.avatarContainer}>
            {/* {item?.rider?.avatar ? (
              <Image source={item?.rider?.avatar} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder} />
            )} */}
          </View>
          <View style={styles.riderInfo}>
            {/* <Text style={styles.riderName}>{item?.rider?.name}</Text> */}
            <Text style={styles.riderCRN}>
              Ride ID: {item?._id?.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.rideDetailsContainer}>
          <View style={styles.rideStats}>
            <View style={styles.statItem}>
              <MaterialIcons
                name={
                  item?.rideCategory === 'taxi' || item?.rideCategory === 'car'
                    ? 'directions-car'
                    : 'directions-bike'
                }
                size={25}
                color={COLORS.gray4}
              />
              <Text style={styles.statText}>{item?.distance} Km</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialIcons
                name="access-time"
                size={25}
                color={COLORS.gray4}
              />
              <Text style={styles.statText}>
                {moment(item?.duration).format('hh:mm')}
              </Text>
            </View>
            <View style={styles.statItem}>
              <MaterialIcons
                name="currency-rupee"
                size={22}
                color={COLORS.gray4}
              />
              <Text style={styles.statText}>{item?.payableAmount?.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.dateTimeContainer}>
            <Text style={styles.dateTime}>Date & Time</Text>
            <Text style={styles.dateTimeValue}>
              {`${moment(item?.bookingDate).format('DD/MM/YYYY')} | ${
                item?.bookingTime
              }`}
            </Text>
          </View>

          <View style={styles.locationContainer}>
            <View style={styles.locationItem}>
              <MaterialIcons
                name="location-on"
                size={25}
                color={COLORS.Amber}
              />
              <Text style={styles.locationText}>
                {item?.pickupLocation?.address}
              </Text>
            </View>
            <View style={styles.locationItem}>
              <MaterialIcons
                name="location-on"
                size={25}
                color={COLORS.emeraldGreen}
              />
              <Text style={styles.locationText}>
                {item?.destinationLocation?.address}
              </Text>
            </View>
          </View>

          <View style={styles.carTypeContainer}>
            <Text style={styles.carTypeLabel}>
              Booking {getTypeNameByValue(activeTab)} Type
            </Text>
            <Text style={styles.carTypeValue}>{item?.type}</Text>
          </View>
        </View>

        {item?.pickupLocation?.latitude && item?.pickupLocation?.longitude && (
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={{
                latitude: center.latitude,
                longitude: center.longitude,
                latitudeDelta,
                longitudeDelta,
              }}>
              {item?.pickupLocation?.latitude &&
                item?.pickupLocation?.longitude && (
                  <Marker
                    coordinate={{
                      latitude: item.pickupLocation.latitude,
                      longitude: item.pickupLocation.longitude,
                    }}
                    // image={Icons.locationYellowMarker}
                  >
                    <MaterialIcons
                      name="location-on"
                      size={25}
                      color={COLORS.Amber}
                    />
                  </Marker>
                )}
              {item?.destinationLocation?.latitude &&
                item?.destinationLocation?.longitude && (
                  <Marker
                    coordinate={{
                      latitude: item.destinationLocation.latitude,
                      longitude: item.destinationLocation.longitude,
                    }}
                    // image={Icons.locationGreenMarker}
                  >
                    <MaterialIcons
                      name="location-on"
                      size={25}
                      color={COLORS.emeraldGreen}
                    />
                  </Marker>
                )}
            </MapView>
            <TouchableOpacity
              onPress={() => {
                onCenter();
              }}
              style={styles.centerBtn}>
              <Image
                source={Icons.LocationTarget}
                style={styles.TargetButton}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            // onPress={() => navigation.navigate('CancelRide')}>
            // onPress={() => handleRejectRide(item?._id)}>
            onPress={() => toggleRideCancelDropDown(item?._id)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onCenter();
            }}
            style={styles.acceptButton}>
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
        </View> */}

      </View>
    );
  };

  const renderEmptyComponent = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={COLORS.Amber} />
        </View>
      );
    }
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No {getTypeNameByValue(activeTab)} completed bookings available.
        </Text>
      </View>
    );
  };

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
      <View style={styles.tabContainer}>
        {rideTypes.map(type => (
          <TouchableOpacity
            key={type.value}
            style={[styles.tab, activeTab === type.value && styles.activeTab]}
            onPress={() => handleTabChange(type.value)}>
            <Text
              style={[
                styles.tabText,
                activeTab === type.value && styles.activeTabText,
              ]}>
              {type.name}
            </Text>
            {type.value === activeTab && bookingsData?.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{bookingsData.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={bookingsData}
        ref={flatListRef}
        renderItem={renderBookingCard}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyComponent}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    marginVertical: verticalScale(3),
    color: COLORS.black,
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(15),
  },
  inputBox: {
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: scale(5),
    paddingHorizontal: scale(10),
    paddingVertical: scale(5),
    fontSize: scale(14),
    color: COLORS.black,
    fontFamily: Fonts.Regular,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.Amber,
  },
  tabText: {
    fontSize: scale(14),
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: COLORS.Amber,
    fontWeight: 'bold',
  },
  badge: {
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: scale(16),
    flexGrow: 1,
  },
  bookingCard: {
    backgroundColor: COLORS.white,
    borderRadius: scale(12),
    padding: scale(16),
    marginBottom: scale(16),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  riderSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(16),
    borderBottomWidth: 0.7,
    paddingBottom: scale(10),
    borderBottomColor: COLORS.gray3,
  },
  avatarContainer: {
    marginRight: scale(12),
  },
  avatar: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
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
  rideDetailsContainer: {
    marginBottom: scale(16),
  },
  rideStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(16),
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: scale(20),
  },
  statText: {
    marginLeft: scale(3),
    fontFamily: Fonts.Regular,
    fontSize: moderateScale(14),
    color: COLORS.gray4,
    paddingTop: scale(5),
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: scale(16),
    borderBottomWidth: 0.7,
    paddingBottom: scale(10),
    borderBottomColor: COLORS.gray3,
  },
  dateTime: {
    fontFamily: Fonts.Regular,
    fontSize: moderateScale(14),
    color: COLORS.gray4,
  },
  dateTimeValue: {
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(14),
    color: COLORS.black,
  },
  locationContainer: {
    marginBottom: scale(16),
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
  carTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  carTypeLabel: {
    fontFamily: Fonts.Regular,
    fontSize: moderateScale(14),
    color: COLORS.black,
  },
  carTypeValue: {
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(14),
    color: COLORS.black,
  },
  mapContainer: {
    height: scale(150),
    borderRadius: scale(8),
    overflow: 'hidden',
    marginBottom: scale(16),
    position: 'relative',
  },
  TargetButton: {
    height: scale(24),
    width: scale(24),
    resizeMode: 'contain',
  },
  centerBtn: {
    width: scale(30),
    height: scale(30),
    backgroundColor: COLORS.white,
    position: 'absolute',
    bottom: 10,
    right: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(100),
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.gray5,
    padding: scale(12),
    borderRadius: scale(8),
    marginRight: scale(8),
  },
  acceptButton: {
    flex: 1,
    backgroundColor: COLORS.Amber,
    padding: scale(12),
    borderRadius: scale(8),
    marginLeft: scale(8),
  },
  cancelButtonText: {
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(14),
    color: COLORS.gray2,
    textAlign: 'center',
    paddingTop: scale(5),
  },
  acceptButtonText: {
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(14),
    color: COLORS.white,
    textAlign: 'center',
    paddingTop: scale(5),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(16),
    color: COLORS.gray4,
  },
});
