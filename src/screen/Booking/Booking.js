import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Container} from '../../components/Container/Container';
import {COLORS} from '../../theme/Colors';
import {Fonts} from '../../theme/Fonts';
import {moderateScale, scale} from '../../utils/Scalling';
import ActiveBooking from './ActiveBooking';
import CompletedBookings from './CompletedBookings';
import CancelledBookings from './CancelledBookings';
import Ongoing from './Ongoing';

const Tab = createMaterialTopTabNavigator();


export default function Booking() {
  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
      <Text style={styles.headerText}>Bookings</Text>

      <Tab.Navigator
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarIndicatorStyle: {
            backgroundColor: COLORS.Amber,
            height: 3,
          },
          tabBarLabelStyle: styles.tabLabel,
          tabBarActiveTintColor: COLORS.Amber,
          tabBarInactiveTintColor: '#666666',
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
  headerText: {
    fontFamily: Fonts.Medium,
    color: '#2A2A2A',
    lineHeight: scale(20),
    fontSize: moderateScale(18),
    textAlign: 'center',
    marginTop: scale(5),
    marginBottom: scale(10),
  },
  tabBar: {
    backgroundColor: COLORS.white,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 2,
    borderBottomColor: '#EEEEEE',
  },
  tabLabel: {
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(12),
    textTransform: 'none',
  },
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
