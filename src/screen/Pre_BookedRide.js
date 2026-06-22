import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { COLORS } from '../theme/Colors';
import { Fonts } from '../theme/Fonts';
import { verticalScale, scale, moderateScale } from '../utils/Scalling';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Container } from '../components/Container/Container';
import { AppBar } from '../components/AppBar/AppBar';
import { bookings } from '../utils/StaticDataBase';

const { width } = Dimensions.get('window');

export default function Pre_BookedRide({ navigation }) {
  const renderBookingCard = ({ item }) => {
    return (
      <View style={styles.card}>
        {/* Header: Avatar + Info + Status */}
        <View style={styles.cardHeader}>
          <View style={styles.avatarWrapper}>
            {item.rider.avatar ? (
              <Image source={item.rider.avatar} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={scale(32)} color={COLORS.themePrimary} />
              </View>
            )}
            <View style={styles.onlineBadge} />
          </View>
          <View style={styles.riderInfo}>
            <Text style={styles.riderName}>{item.rider.name}</Text>
            <Text style={styles.riderId}>CRN: {item.rider.crn}</Text>
          </View>
          <View style={styles.statusChip}>
            <Text style={styles.statusText}>📅 Upcoming</Text>
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <MaterialIcons name="directions-car" size={scale(20)} color={COLORS.themePrimary} />
            <Text style={styles.statValue}>{item.ride.distance}</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialIcons name="access-time" size={scale(20)} color={COLORS.themePrimary} />
            <Text style={styles.statValue}>{item.ride.duration}</Text>
          </View>
          <View style={[styles.statItem, styles.priceStat]}>
            <MaterialIcons name="attach-money" size={scale(20)} color={COLORS.white} />
            <Text style={[styles.statValue, { color: COLORS.white }]}>
              ₹{item.ride.price}/km
            </Text>
          </View>
        </View>

        {/* Date & Time */}
        <View style={styles.dateTimeGroup}>
          <Ionicons name="calendar-outline" size={scale(16)} color={COLORS.gray} />
          <Text style={styles.dateTimeText}>{item.ride.date}</Text>
          <View style={styles.dot} />
          <Ionicons name="time-outline" size={scale(16)} color={COLORS.gray} />
          <Text style={styles.dateTimeText}>{item.ride.time}</Text>
        </View>

        {/* Timeline: Pickup → Dropoff */}
        <View style={styles.timeline}>
          <View style={styles.timelineLeft}>
            <View style={styles.pickupDot} />
            <View style={styles.timelineLine} />
            <View style={styles.dropoffDot} />
          </View>
          <View style={styles.timelineRight}>
            <View style={styles.locationRow}>
              <Text style={styles.locationLabel}>Pickup</Text>
              <Text style={styles.locationAddress} numberOfLines={2}>{item.ride.pickup}</Text>
            </View>
            <View style={styles.locationRow}>
              <Text style={styles.locationLabel}>Dropoff</Text>
              <Text style={styles.locationAddress} numberOfLines={2}>{item.ride.dropoff}</Text>
            </View>
          </View>
        </View>

        {/* Car type */}
        <View style={styles.carTypeRow}>
          <Ionicons name="car-sport-outline" size={scale(20)} color={COLORS.themePrimary} />
          <Text style={styles.carTypeLabel}>Car Type</Text>
          <View style={styles.carTypeBadge}>
            <Text style={styles.carTypeText}>{item.ride.carType}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelBtn} activeOpacity={0.7}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.trackBtn} activeOpacity={0.7}>
            <Text style={styles.trackBtnText}>Track Ride →</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <Container
      statusBarStyle={'light-content'}
      statusBarBackgroundColor={COLORS.themePrimary}
      backgroundColor={'#F8F9FC'}>
      <View style={styles.header}>
        <AppBar
          back
          title="Pre-Booked Rides"
          titleStyle={styles.headerTitle}
          backIconColor={COLORS.white}
          containerStyle={styles.appBar}
        />
      </View>
      <FlatList
        data={bookings}
        renderItem={renderBookingCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.themePrimary,
    borderBottomLeftRadius: moderateScale(28),
    borderBottomRightRadius: moderateScale(28),
    paddingBottom: verticalScale(8),
    shadowColor: COLORS.themePrimary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  appBar: {
    backgroundColor: 'transparent',
  },
  headerTitle: {
    color: COLORS.white,
    fontFamily: Fonts.Bold,
    fontSize: moderateScale(20),
  },
  list: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(24),
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(28),
    marginBottom: scale(18),
    padding: scale(18),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 6,
    borderWidth: 1,
    borderColor: COLORS.gray2 + '30',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(14),
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: scale(12),
  },
  avatar: {
    width: scale(56),
    height: scale(56),
    borderRadius: scale(28),
    borderWidth: 2,
    borderColor: COLORS.themePrimary,
  },
  avatarPlaceholder: {
    width: scale(56),
    height: scale(56),
    borderRadius: scale(28),
    backgroundColor: COLORS.gray1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.themePrimary,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: scale(14),
    height: scale(14),
    borderRadius: scale(7),
    backgroundColor: '#4CD964',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  riderInfo: {
    flex: 1,
  },
  riderName: {
    fontFamily: Fonts.Bold,
    fontSize: moderateScale(17),
    color: COLORS.black,
  },
  riderId: {
    fontFamily: Fonts.Regular,
    fontSize: moderateScale(12),
    color: COLORS.gray,
    marginTop: verticalScale(2),
  },
  statusChip: {
    backgroundColor: COLORS.themePrimary + '12',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(5),
    borderRadius: moderateScale(30),
  },
  statusText: {
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(11),
    color: COLORS.themePrimary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(16),
    gap: scale(8),
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F4F8',
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(40),
    gap: scale(4),
  },
  priceStat: {
    backgroundColor: COLORS.themePrimary,
  },
  statValue: {
    fontFamily: Fonts.SemiBold,
    fontSize: moderateScale(13),
    color: COLORS.black,
  },
  dateTimeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F4F8',
    alignSelf: 'flex-start',
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(40),
    marginBottom: verticalScale(16),
    gap: scale(6),
  },
  dot: {
    width: scale(4),
    height: scale(4),
    borderRadius: scale(2),
    backgroundColor: COLORS.gray,
  },
  dateTimeText: {
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(12),
    color: COLORS.black,
  },
  timeline: {
    flexDirection: 'row',
    marginBottom: verticalScale(16),
  },
  timelineLeft: {
    width: scale(24),
    alignItems: 'center',
  },
  pickupDot: {
    width: scale(12),
    height: scale(12),
    borderRadius: scale(6),
    backgroundColor: '#4CD964',
    shadowColor: '#4CD964',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 2,
  },
  timelineLine: {
    width: 2,
    height: scale(40),
    backgroundColor: COLORS.gray2,
    marginVertical: verticalScale(4),
  },
  dropoffDot: {
    width: scale(12),
    height: scale(12),
    borderRadius: scale(6),
    backgroundColor: '#FF3B30',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 2,
  },
  timelineRight: {
    flex: 1,
    paddingLeft: scale(8),
  },
  locationRow: {
    marginBottom: verticalScale(8),
  },
  locationLabel: {
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(12),
    color: COLORS.gray,
    marginBottom: verticalScale(2),
  },
  locationAddress: {
    fontFamily: Fonts.Regular,
    fontSize: moderateScale(13),
    color: COLORS.black,
  },
  carTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(18),
    paddingTop: verticalScale(8),
    borderTopWidth: 1,
    borderTopColor: COLORS.gray2 + '40',
  },
  carTypeLabel: {
    fontFamily: Fonts.Regular,
    fontSize: moderateScale(14),
    color: COLORS.gray,
    marginLeft: scale(8),
    flex: 1,
  },
  carTypeBadge: {
    backgroundColor: COLORS.themePrimary + '10',
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(5),
    borderRadius: moderateScale(30),
  },
  carTypeText: {
    fontFamily: Fonts.SemiBold,
    fontSize: moderateScale(14),
    color: COLORS.themePrimary,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: scale(12),
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#F2F4F8',
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(40),
    alignItems: 'center',
  },
  cancelBtnText: {
    fontFamily: Fonts.SemiBold,
    fontSize: moderateScale(14),
    color: COLORS.gray,
  },
  trackBtn: {
    flex: 1,
    backgroundColor: COLORS.themePrimary,
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(40),
    alignItems: 'center',
    shadowColor: COLORS.themePrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  trackBtnText: {
    fontFamily: Fonts.SemiBold,
    fontSize: moderateScale(14),
    color: COLORS.white,
  },
});