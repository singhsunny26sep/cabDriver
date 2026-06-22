import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Container } from '../components/Container/Container';
import { AppBar } from '../components/AppBar/AppBar';
import { earningData } from '../utils/StaticDataBase';
import { COLORS } from '../theme/Colors';
import { Fonts } from '../theme/Fonts';
import { verticalScale, scale, moderateScale } from '../utils/Scalling';

const { width } = Dimensions.get('window');

// Safe color defaults (in case your COLORS object is missing some keys)
const safeColors = {
  themePrimary: COLORS?.themePrimary || '#FF6B4A',
  success: COLORS?.success || '#4CAF50',
  Amber: COLORS?.Amber || '#FFC107',
  white: COLORS?.white || '#FFFFFF',
  black: COLORS?.black || '#000000',
  gray: COLORS?.gray || '#8E8E93',
  gray2: COLORS?.gray2 || '#C6C6C8',
  border: COLORS?.border || '#E5E5EA',
  background: COLORS?.background || '#F2F2F7',
  textPrimary: COLORS?.textPrimary || '#1C1C1E',
};

// Safe font defaults
const safeFonts = {
  regular: Fonts?.regular || 'System',
  medium: Fonts?.medium || 'System',
  semiBold: Fonts?.semiBold || 'System',
  bold: Fonts?.bold || 'System',
};

export default function YourRides({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [ridesData, setRidesData] = useState([]);

  useEffect(() => {
    // Debug: log the actual data structure
    console.log('earningData:', earningData);
    if (earningData && Array.isArray(earningData.rides)) {
      setRidesData(earningData.rides);
    } else {
      console.warn('earningData.rides is missing or not an array');
      setRidesData([]);
    }
  }, []);

  const totalRides = ridesData.length;
  const totalEarnings = ridesData.reduce((sum, ride) => sum + (ride.earning || 0), 0);
  const totalDistance = ridesData.reduce((sum, ride) => {
    const miles = parseFloat(ride.miles) || 0;
    return sum + miles;
  }, 0);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderRideItem = ({ item, index }) => (
    <TouchableOpacity style={styles.rideCard} activeOpacity={0.7}>
      <View style={styles.cardAccent} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.avatarContainer}>
            <FontAwesome name="user-circle" size={scale(44)} color={safeColors.themePrimary} />
          </View>
          <View style={styles.riderInfo}>
            <Text style={styles.riderName}>{item.name || 'Unknown Rider'}</Text>
            <View style={styles.rideBadge}>
              <MaterialIcons name="check-circle" size={scale(12)} color={safeColors.success} />
              <Text style={styles.rideStatus}>Completed</Text>
            </View>
          </View>
          <View style={styles.earningChip}>
            <Text style={styles.earningChipLabel}>₹</Text>
            <Text style={styles.earningChipValue}>{item.earning || 0}</Text>
          </View>
        </View>
        <View style={styles.rideDetailsRow}>
          <View style={styles.detailItem}>
            <MaterialIcons name="straighten" size={scale(16)} color={safeColors.gray} />
            <Text style={styles.detailText}>{item.miles || 0} km</Text>
          </View>
          <View style={styles.detailDot} />
          <View style={styles.detailItem}>
            <MaterialIcons name="access-time" size={scale(16)} color={safeColors.gray} />
            <Text style={styles.detailText}>{item.duration || 'N/A'}</Text>
          </View>
          <View style={styles.detailDot} />
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={scale(14)} color={safeColors.gray} />
            <Text style={styles.detailText}>Today</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Show loading indicator while data is being resolved (optional)
  if (ridesData === undefined) {
    return (
      <Container backgroundColor={safeColors.background}>
        <View style={styles.centerLoader}>
          <ActivityIndicator size="large" color={safeColors.themePrimary} />
        </View>
      </Container>
    );
  }

  return (
    <Container
      statusBarStyle={'light-content'}
      statusBarBackgroundColor={safeColors.themePrimary}
      backgroundColor={'#F5F7FB'}>
      {/* Header */}
      <View style={styles.headerCurve}>
        <AppBar
          back
          title="Your Rides"
          titleStyle={styles.appBarTitle}
          backIconColor={safeColors.white}
          containerStyle={styles.appBarContainer}
        />
        <Text style={styles.headerSubtitle}>Track your ride history & earnings</Text>
      </View>

      {/* Stats Cards */}
    

      {/* Filter Chips (UI only) */}
      <View style={styles.filterRow}>
        <TouchableOpacity style={[styles.filterChip, styles.filterChipActive]}>
          <Text style={styles.filterTextActive}>Today</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterChip}>
          <Text style={styles.filterText}>This Week</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterChip}>
          <Text style={styles.filterText}>This Month</Text>
        </TouchableOpacity>
      </View>

      {/* Ride List */}
      <FlatList
        data={ridesData}
        renderItem={renderRideItem}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={safeColors.themePrimary} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="history" size={scale(60)} color={safeColors.gray2} />
            <Text style={styles.emptyText}>No rides found</Text>
            <Text style={styles.emptySubText}>Check console for data errors</Text>
          </View>
        )}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  headerCurve: {
    backgroundColor: safeColors.themePrimary,
    borderBottomLeftRadius: moderateScale(28),
    borderBottomRightRadius: moderateScale(28),
    paddingBottom: verticalScale(28),
    paddingHorizontal: scale(20),
  },
  appBarContainer: {
    marginTop: verticalScale(8),
    marginBottom: verticalScale(4),
  },
  appBarTitle: {
    fontSize: moderateScale(22),
    fontFamily: safeFonts.bold,
    color: safeColors.white,
  },
  headerSubtitle: {
    fontSize: moderateScale(14),
    fontFamily: safeFonts.regular,
    color: safeColors.white + 'CC',
    marginLeft: scale(4),
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: scale(20),
    marginTop: verticalScale(-28),
    marginBottom: verticalScale(20),
  },
  statCard: {
    flex: 1,
    backgroundColor: safeColors.white,
    borderRadius: moderateScale(20),
    paddingVertical: verticalScale(14),
    alignItems: 'center',
    marginHorizontal: scale(5),
    shadowColor: safeColors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  statIcon: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  statNumber: {
    fontSize: moderateScale(20),
    fontFamily: safeFonts.bold,
    color: safeColors.textPrimary,
  },
  statLabel: {
    fontSize: moderateScale(11),
    fontFamily: safeFonts.regular,
    color: safeColors.gray,
  },
  filterRow: {
    flexDirection: 'row',
    marginHorizontal: scale(20),
    marginBottom: verticalScale(16),
    marginTop: verticalScale(8),
  },
  filterChip: {
    paddingHorizontal: scale(18),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(30),
    backgroundColor: safeColors.white,
    marginRight: scale(12),
    borderWidth: 1,
    borderColor: safeColors.border,
  },
  filterChipActive: {
    backgroundColor: safeColors.themePrimary,
    borderColor: safeColors.themePrimary,
  },
  filterText: {
    fontSize: moderateScale(13),
    fontFamily: safeFonts.medium,
    color: safeColors.gray,
  },
  filterTextActive: {
    color: safeColors.white,
  },
  listContent: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(100),
  },
  separator: {
    height: verticalScale(12),
  },
  rideCard: {
    backgroundColor: safeColors.white,
    borderRadius: moderateScale(24),
    overflow: 'hidden',
    shadowColor: safeColors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: scale(6),
    height: '100%',
    backgroundColor: safeColors.themePrimary,
  },
  cardContent: {
    padding: scale(16),
    paddingLeft: scale(20),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  avatarContainer: {
    marginRight: scale(12),
  },
  riderInfo: {
    flex: 1,
  },
  riderName: {
    fontSize: moderateScale(16),
    fontFamily: safeFonts.semiBold,
    color: safeColors.textPrimary,
  },
  rideBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rideStatus: {
    fontSize: moderateScale(11),
    fontFamily: safeFonts.regular,
    color: safeColors.success,
    marginLeft: scale(4),
  },
  earningChip: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: safeColors.themePrimary + '15',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(20),
  },
  earningChipLabel: {
    fontSize: moderateScale(12),
    fontFamily: safeFonts.bold,
    color: safeColors.themePrimary,
  },
  earningChipValue: {
    fontSize: moderateScale(16),
    fontFamily: safeFonts.bold,
    color: safeColors.themePrimary,
  },
  rideDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: scale(8),
  },
  detailText: {
    fontSize: moderateScale(12),
    fontFamily: safeFonts.regular,
    color: safeColors.gray,
    marginLeft: scale(4),
  },
  detailDot: {
    width: scale(4),
    height: scale(4),
    borderRadius: scale(2),
    backgroundColor: safeColors.gray2,
    marginHorizontal: scale(6),
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(60),
  },
  emptyText: {
    fontSize: moderateScale(18),
    fontFamily: safeFonts.semiBold,
    color: safeColors.gray,
    marginTop: verticalScale(16),
  },
  emptySubText: {
    fontSize: moderateScale(13),
    fontFamily: safeFonts.regular,
    color: safeColors.gray2,
    marginTop: verticalScale(6),
  },
  centerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});