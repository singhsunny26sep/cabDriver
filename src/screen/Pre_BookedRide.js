import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { COLORS } from '../theme/Colors';
import { Fonts } from '../theme/Fonts';
import { verticalScale,scale,moderateScale } from '../utils/Scalling';
import MapView, {Marker, Polyline} from 'react-native-maps';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Container } from '../components/Container/Container';
import { AppBar } from '../components/AppBar/AppBar';
import { bookings } from '../utils/StaticDataBase';

export default function Pre_BookedRide ({navigation}) {

  const renderBookingCard = ({item}) => {
    return (
      <View style={styles.bookingCard}>
        <View style={styles.riderSection}>
          <View style={styles.avatarContainer}>
            {item.rider.avatar ? (
              <Image source={item.rider.avatar} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder} />
            )}
          </View>
          <View style={styles.riderInfo}>
            <Text style={styles.riderName}>{item.rider.name}</Text>
            <Text style={styles.riderCRN}>CRN: {item.rider.crn}</Text>
          </View>
        </View>

        <View style={styles.rideDetailsContainer}>
          <View style={styles.rideStats}>
            <View style={styles.statItem}>
              <MaterialIcons name="directions-car" size={25} color={COLORS.gray4} />
              <Text style={styles.statText}>{item.ride.distance}</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialIcons name="access-time" size={25} color={COLORS.gray4} />
              <Text style={styles.statText}>{item.ride.duration}</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialIcons name="attach-money" size={25} color={COLORS.gray4} />
              <Text style={styles.statText}>{item.ride.price}/mile</Text>
            </View>
          </View>

          <View style={styles.dateTimeContainer}>
            <Text style={styles.dateTime}>Date & Time</Text>
            <Text style={styles.dateTimeValue}>
              {`${item.ride.date} | ${item.ride.time}`}
            </Text>
          </View>

          <View style={styles.locationContainer}>
            <View style={styles.locationItem}>
              <MaterialIcons
                name="trip-origin"
                size={25}
                color={COLORS.Amber}
              />
              <Text style={styles.locationText}>{item.ride.pickup}</Text>
            </View>
            <View style={styles.locationItem}>
              <MaterialIcons
                name="location-on"
                size={25}
                color={COLORS.Amber}
              />
              <Text style={styles.locationText}>{item.ride.dropoff}</Text>
            </View>
          </View>

          <View style={styles.carTypeContainer}>
            <Text style={styles.carTypeLabel}>Booking Car Type</Text>
            <Text style={styles.carTypeValue}>{item.ride.carType}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
        <AppBar back title='Pre - Booked'/>
      <FlatList
        data={bookings}
        renderItem={renderBookingCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
};


const styles = StyleSheet.create({
  listContainer: {
    padding: scale(16),
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
    borderBottomWidth:0.7,
    paddingBottom:scale(10),
    borderBottomColor:COLORS.gray3
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
    color:COLORS.black,
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
    justifyContent: 'flex-start',
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
    paddingTop:scale(5)
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: scale(16),
    borderBottomWidth:0.7,
    paddingBottom:scale(10),
    borderBottomColor:COLORS.gray3  },
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
  trackButton: {
    flex: 1,
    backgroundColor: COLORS.gray,
    padding: scale(12),
    borderRadius: scale(8),
    marginLeft: scale(8),
  },
  cancelButtonText: {
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(14),
    color: COLORS.gray2,
    textAlign: 'center',
    paddingTop:scale(5)
  },
  trackButtonText: {
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(14),
    color: COLORS.white,
    textAlign: 'center',
    paddingTop:scale(5)
  },
});

