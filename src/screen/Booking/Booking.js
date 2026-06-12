import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  Animated,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Container } from '../../components/Container/Container';
import { COLORS } from '../../theme/Colors';
import { Fonts } from '../../theme/Fonts';
import { moderateScale, scale, verticalScale } from '../../utils/Scalling';
import ActiveBooking from './ActiveBooking';
import CompletedBookings from './CompletedBookings';
import CancelledBookings from './CancelledBookings';
import Ongoing from './Ongoing';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createMaterialTopTabNavigator();
const { width, height } = Dimensions.get('window');

// Animated Tab Bar with spring effect
function AnimatedTabBar({ state, descriptors, navigation, position }) {
  const tabRoutes = [
    { key: 'Waiting', label: 'Waiting', icon: 'time-outline' },
    { key: 'Ongoing', label: 'Ongoing', icon: 'car-sport-outline' },
    { key: 'Completed', label: 'Completed', icon: 'checkmark-done-circle-outline' },
    { key: 'Cancelled', label: 'Cancelled', icon: 'close-circle-outline' },
  ];

  // Animated values for each tab icon scale
  const scaleAnims = useRef(tabRoutes.map(() => new Animated.Value(1))).current;

  useEffect(() => {
    // Animate the active tab icon scale
    tabRoutes.forEach((_, index) => {
      const isFocused = state.index === index;
      Animated.spring(scaleAnims[index], {
        toValue: isFocused ? 1.1 : 1,
        friction: 6,
        tension: 200,
        useNativeDriver: true,
      }).start();
    });
  }, [state.index]);

  const onTabPress = (route, index) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });
    if (state.index !== index && !event.defaultPrevented) {
      navigation.navigate(route.key);
    }
  };

  return (
    <View style={styles.tabBarContainer}>
      {tabRoutes.map((route, index) => {
        const isFocused = state.index === index;
        const opacity = position.interpolate({
          inputRange: state.routes.map((_, i) => i),
          outputRange: state.routes.map((_, i) => (i === index ? 1 : 0.6)),
        });
        return (
          <TouchableOpacity
            key={route.key}
            activeOpacity={0.7}
            onPress={() => onTabPress(route, index)}
            style={styles.tabItem}>
            <Animated.View style={{ opacity, alignItems: 'center', transform: [{ scale: scaleAnims[index] }] }}>
              <Ionicons
                name={route.icon}
                size={scale(isFocused ? 26 : 22)}
                color={isFocused ? COLORS.Amber : COLORS.gray}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: isFocused ? COLORS.Amber : COLORS.gray },
                ]}>
                {route.label}
              </Text>
              {isFocused && <Animated.View style={[styles.tabIndicator, { width: scale(30) }]} />}
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function Booking() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.95],
    extrapolate: 'clamp',
  });

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}
      edges={['top', 'left', 'right']}>
      <Animated.View style={[styles.headerWrapper, { transform: [{ scale: headerScale }] }]}>
        <View style={styles.headerContainer}>
          <View style={styles.iconWrapper}>
            <Ionicons name="car-sport" size={scale(34)} color={COLORS.Amber} />
          </View>
          <Text style={styles.headerText}>My Bookings</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.headerSubtitle}>
          <Text style={styles.subtitleText}>All your rides, neatly organised</Text>
        </View>
        {/* Decorative wave line */}
        <View style={styles.waveLine} />
      </Animated.View>

      <Tab.Navigator
        tabBar={(props) => <AnimatedTabBar {...props} />}
        screenOptions={{
          swipeEnabled: true,
          animationEnabled: true,
          lazy: true,
          lazyPreloadDistance: 1,
          tabBarStyle: { backgroundColor: 'transparent', elevation: 0 },
        }}>
        <Tab.Screen name="Waiting" component={ActiveBooking} />
        <Tab.Screen name="Ongoing" component={Ongoing} />
        <Tab.Screen name="Completed" component={CompletedBookings} />
        <Tab.Screen name="Cancelled" component={CancelledBookings} />
      </Tab.Navigator>
    </Container>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: COLORS.white,
    paddingTop: Platform.OS === 'ios' ? verticalScale(12) : verticalScale(20),
    paddingBottom: verticalScale(12),
    borderBottomLeftRadius: moderateScale(32),
    borderBottomRightRadius: moderateScale(32),
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 6,
    marginBottom: verticalScale(4),
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(8),
  },
  iconWrapper: {
    width: scale(52),
    height: scale(52),
    borderRadius: scale(26),
    backgroundColor: COLORS.Amber + '12',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.Amber,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerText: {
    fontFamily: Fonts.Bold,
    fontSize: moderateScale(26),
    color: COLORS.black,
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  headerSpacer: {
    width: scale(52),
  },
  headerSubtitle: {
    alignItems: 'center',
    marginBottom: verticalScale(6),
    paddingHorizontal: scale(16),
  },
  subtitleText: {
    fontFamily: Fonts.Regular,
    fontSize: moderateScale(13),
    color: COLORS.gray + 'BB',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  waveLine: {
    height: 3,
    width: scale(60),
    backgroundColor: COLORS.Amber + '40',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: verticalScale(4),
  },
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginHorizontal: scale(16),
    marginVertical: verticalScale(8),
    borderRadius: moderateScale(40),
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(8),
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.gray2 + '30',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(30),
  },
  tabLabel: {
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(12),
    marginTop: verticalScale(4),
    textTransform: 'none',
    letterSpacing: 0.3,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -verticalScale(8),
    width: scale(30),
    height: 3,
    borderRadius: moderateScale(2),
    backgroundColor: COLORS.Amber,
    alignSelf: 'center',
  },
});