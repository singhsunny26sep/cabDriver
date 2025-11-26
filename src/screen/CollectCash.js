import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {COLORS} from '../theme/Colors';
import {Container} from '../components/Container/Container';
import {AppBar} from '../components/AppBar/AppBar';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {moderateScale, scale, verticalScale} from '../utils/Scalling';
import {Fonts} from '../theme/Fonts';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function CollectCash({}) {
  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
      <AppBar back title="Collect Cash" />
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <View style={styles.iconWrapper}>
            <Fontisto name="wallet" color={COLORS.white} size={40} />
          </View>
          <Text style={styles.collectCashText}>Collect Cash</Text>
        </View>
        <View style={styles.locationContainer}>
          <View style={styles.locationItem}>
            <MaterialIcons name="trip-origin" size={25} color={COLORS.Amber} />
            <Text style={styles.locationText}>1691 Elgin st. lal darwaja</Text>
          </View>
          <View style={styles.locationItem}>
            <MaterialIcons name="location-on" size={25} color={COLORS.Amber} />
            <Text style={styles.locationText}>1901 junagadh kalwa chowk</Text>
          </View>
        </View>
        <View style={styles.separator}>
          <View style={styles.riderSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarPlaceholder} />
            </View>
            <View style={styles.riderInfo}>
              <Text style={styles.riderName}>Esther Howard</Text>
              <Text style={styles.riderCRN}>Cash Payment</Text>
            </View>
          </View>
          <View style={styles.totalAmountContainer}>
            <Text style={styles.totalAmountText}>Total Amount</Text>
            <Text style={styles.totalAmount}>₹2000</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Cash Collected</Text>
      </TouchableOpacity>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 0.5,
    marginHorizontal: scale(15),
    marginTop: scale(20),
    borderRadius: moderateScale(8),
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    backgroundColor: COLORS.Amber,
    borderRadius: moderateScale(50),
    padding: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: scale(30),
  },
  collectCashText: {
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(20),
    marginTop: scale(10),
  },
  locationContainer: {
    marginBottom: scale(16),
    marginHorizontal: scale(25),
    marginTop: scale(30),
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
  separator: {
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.gray,
    paddingTop: scale(15),
    marginTop: scale(30),
  },
  riderSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(16),
    marginHorizontal: scale(25),
  },
  avatarContainer: {
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
  totalAmountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: scale(0),
    backgroundColor: COLORS.gray3,
    borderBottomLeftRadius: moderateScale(8),
    borderBottomRightRadius: moderateScale(8),
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(8),
    marginTop: scale(10),
  },
  totalAmountText: {
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(15),
  },
  totalAmount: {
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(15),
  },
  button: {
    backgroundColor: COLORS.Amber,
    borderRadius: moderateScale(8),
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(20),
    marginTop: verticalScale(20),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: scale(25),
    position: 'absolute',
    bottom: verticalScale(20),
    left: 0,
    right: 0,
  },
  buttonText: {
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(15),
    color: COLORS.white,
  },
});
