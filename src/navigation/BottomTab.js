import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../theme/Colors';
import Profile from '../screen/Profile';
import FindingJob from '../screen/FindingJob';
import Booking from '../screen/Booking/Booking';
import { moderateScale, scale } from '../utils/Scalling';
import { Fonts } from '../theme/Fonts';
import Earning from '../screen/Earning';

const Tab = createBottomTabNavigator();

export default function BottomTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.Amber,
        tabBarInactiveTintColor: COLORS.gray,
        tabBarHideOnKeyboard:true,
        headerShown: false,
        tabBarStyle: {
          height: scale(52),
          paddingBottom: 10,
          paddingTop: 5,
          
        },
        tabBarLabelStyle: {
          fontSize: moderateScale(13),
          fontFamily:Fonts.Medium,
          paddingBottom: 5
        },
      }}
    >
      <Tab.Screen
        name="FindingJob"
        component={FindingJob}
        options={{
          tabBarLabel: 'Find Jobs',
          tabBarIcon: ({ color }) => (
            <Icon name="search" size={moderateScale(25)} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Booking"
        component={Booking}
        options={{
          tabBarLabel: 'Bookings',
          tabBarIcon: ({ color }) => (
            <Icon name="calendar-today" size={moderateScale(23)} color={color} />
          ),
        }}
      />
       <Tab.Screen
        name="Earning"
        component={Earning}
        options={{
          tabBarLabel: 'Earnings',
          tabBarIcon: ({ color }) => (
            <Icon name="account-balance-wallet" size={moderateScale(23)} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <Icon name="person" size={moderateScale(25)} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
