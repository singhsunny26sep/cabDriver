import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../theme/Colors';
import Profile from '../screen/Profile';
import FindingJob from '../screen/FindingJob';
import Booking from '../screen/Booking/Booking';
import { moderateScale, scale, verticalScale } from '../utils/Scalling';
import { Fonts } from '../theme/Fonts';
import Earning from '../screen/Earning';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

// Animated tab bar component
function AnimatedTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const tabRoutes = [
    { name: 'FindingJob', label: 'Find Jobs', icon: 'search' },
    { name: 'Booking', label: 'Bookings', icon: 'calendar-today' },
    { name: 'Earning', label: 'Earnings', icon: 'account-balance-wallet' },
    { name: 'Profile', label: 'Profile', icon: 'person' },
  ];

  // Animated values for each tab (scale and color)
  const scaleValues = useRef(tabRoutes.map(() => new Animated.Value(1))).current;
  const colorValues = useRef(tabRoutes.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Update animations when focused tab changes
    tabRoutes.forEach((_, index) => {
      const isFocused = state.index === index;
      Animated.parallel([
        Animated.spring(scaleValues[index], {
          toValue: isFocused ? 1.1 : 1,
          friction: 4,
          tension: 200,
          useNativeDriver: true,
        }),
        Animated.timing(colorValues[index], {
          toValue: isFocused ? 1 : 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    });
  }, [state.index]);

  const getIconColor = (index) => {
    return colorValues[index].interpolate({
      inputRange: [0, 1],
      outputRange: [COLORS.gray, '#4c32e1'],
    });
  };

  const getLabelColor = (index) => {
    return colorValues[index].interpolate({
      inputRange: [0, 1],
      outputRange: [COLORS.gray, '#4c32e1'],
    });
  };

  const onPress = (routeName, index) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: routeName,
      canPreventDefault: true,
    });
    if (state.index !== index && !event.defaultPrevented) {
      navigation.navigate(routeName);
    }
  };

  return (
    <View
      style={[
        styles.tabBarContainer,
        { paddingBottom: Platform.OS === 'ios' ? insets.bottom + 8 : insets.bottom + 10 },
      ]}>
      <View style={styles.tabBarInner}>
        {tabRoutes.map((route, index) => {
          const isFocused = state.index === index;
          return (
            <TouchableOpacity
              key={route.name}
              activeOpacity={0.7}
              onPress={() => onPress(route.name, index)}
              style={styles.tabItem}>
              <Animated.View
                style={[
                  styles.iconWrapper,
                  { transform: [{ scale: scaleValues[index] }] },
                ]}>
                <AnimatedIcon
                  name={route.icon}
                  size={moderateScale(24)}
                  color={getIconColor(index)}
                />
              </Animated.View>
              <Animated.Text
                style={[
                  styles.tabLabel,
                  { color: getLabelColor(index) },
                ]}>
                {route.label}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// Helper component for animated icon (since Animated.createAnimatedComponent works with Icon)
const AnimatedIcon = Animated.createAnimatedComponent(Icon);

export default function BottomTab() {
  return (
    <Tab.Navigator
      tabBar={(props) => <AnimatedTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}>
      <Tab.Screen name="FindingJob" component={FindingJob} />
      <Tab.Screen name="Booking" component={Booking} />
      <Tab.Screen name="Earning" component={Earning} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },
  tabBarInner: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginHorizontal: scale(16),
    marginBottom: Platform.OS === 'ios' ? 10 : 8,
    borderRadius: moderateScale(30),
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(12),
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 1,
    borderColor: COLORS.gray2 + '30',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(6),
  },
  iconWrapper: {
    marginBottom: verticalScale(4),
  },
  tabLabel: {
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(10),
    textAlign: 'center',
    includeFontPadding: false,
  },
});
