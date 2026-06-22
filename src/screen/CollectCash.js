import React, { useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../theme/Colors';
import { Container } from '../components/Container/Container';
import { AppBar } from '../components/AppBar/AppBar';
import { moderateScale, scale, verticalScale } from '../utils/Scalling';
import { Fonts } from '../theme/Fonts';

const { width, height } = Dimensions.get('window');

export default function CollectCash({}) {
  const buttonScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.96,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Container
      statusBarStyle="dark-content"
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
      <LinearGradient
        colors={['#FFFFFF', '#FFF9F0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBg}>
        <AppBar back title="Collect Cash" />

        <View style={styles.content}>
          {/* Main Card */}
          <View style={styles.card}>
            {/* Icon + Title */}
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={[COLORS.Amber, '#FF8C42']}
                style={styles.iconWrapper}>
                <Fontisto name="wallet" color={COLORS.white} size={moderateScale(36)} />
              </LinearGradient>
              <Text style={styles.collectCashText}>Collect Cash</Text>
              <Text style={styles.subtitle}>Please collect the exact amount from rider</Text>
            </View>

            {/* Trip Locations */}
            <View style={styles.locationContainer}>
              <View style={styles.locationItem}>
                <MaterialIcons name="trip-origin" size={22} color={COLORS.Amber} />
                <Text style={styles.locationText} numberOfLines={1}>
                  1691 Elgin St, Lal Darwaja
                </Text>
              </View>
              <View style={styles.locationDivider} />
              <View style={styles.locationItem}>
                <MaterialIcons name="location-on" size={22} color={COLORS.Amber} />
                <Text style={styles.locationText} numberOfLines={1}>
                  1901 Junagadh, Kalwa Chowk
                </Text>
              </View>
            </View>

            {/* Rider & Amount Section */}
            <View style={styles.separator}>
              <View style={styles.riderSection}>
                <View style={styles.avatarContainer}>
                  <LinearGradient
                    colors={['#FFD194', '#70E1F5']}
                    style={styles.avatarGradient}>
                    <Text style={styles.avatarInitials}>EH</Text>
                  </LinearGradient>
                </View>
                <View style={styles.riderInfo}>
                  <Text style={styles.riderName}>Esther Howard</Text>
                  <Text style={styles.riderCRN}>Cash Payment • ID: #RID8765</Text>
                </View>
              </View>

              <View style={styles.totalAmountContainer}>
                <Text style={styles.totalAmountLabel}>Total Amount</Text>
                <Text style={styles.totalAmount}>₹2,000</Text>
              </View>
            </View>
          </View>

          {/* CTA Button with Animation */}
          <Animated.View style={[styles.buttonWrapper, { transform: [{ scale: buttonScale }] }]}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={() => {
                // Add your cash collection logic here
                console.log('Cash collected');
              }}
              style={styles.button}>
              <LinearGradient
                colors={[COLORS.Amber, '#FF8C42', '#FF6B4A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}>
                <Text style={styles.buttonText}>Cash Collected</Text>
                <MaterialIcons name="done" size={20} color="#FFF" style={styles.buttonIcon} />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </LinearGradient>
    </Container>
  );
}

const styles = StyleSheet.create({
  gradientBg: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(20),
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(28),
    marginTop: verticalScale(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 10,
    overflow: 'hidden',
  },
  iconContainer: {
    alignItems: 'center',
    paddingTop: verticalScale(32),
    paddingBottom: verticalScale(16),
  },
  iconWrapper: {
    borderRadius: moderateScale(60),
    padding: scale(18),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.Amber,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  collectCashText: {
    fontFamily: Fonts.SemiBold,
    fontSize: moderateScale(24),
    marginTop: verticalScale(16),
    color: '#1A2C3E',
  },
  subtitle: {
    fontFamily: Fonts.Regular,
    fontSize: moderateScale(13),
    color: '#8E9AAB',
    marginTop: verticalScale(4),
    textAlign: 'center',
  },
  locationContainer: {
    marginHorizontal: scale(24),
    marginVertical: verticalScale(20),
    paddingVertical: verticalScale(12),
    backgroundColor: '#F8FAFE',
    borderRadius: moderateScale(20),
    paddingHorizontal: scale(16),
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(6),
  },
  locationDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: verticalScale(8),
    marginLeft: scale(28),
  },
  locationText: {
    marginLeft: scale(12),
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(14),
    color: '#1E2A3A',
    flex: 1,
  },
  separator: {
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#E2E8F0',
    marginTop: verticalScale(8),
  },
  riderSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(16),
  },
  avatarContainer: {
    marginRight: scale(14),
  },
  avatarGradient: {
    width: scale(56),
    height: scale(56),
    borderRadius: scale(28),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    fontSize: moderateScale(20),
    fontFamily: Fonts.SemiBold,
    color: '#FFFFFF',
  },
  riderInfo: {
    flex: 1,
  },
  riderName: {
    fontFamily: Fonts.SemiBold,
    fontSize: moderateScale(16),
    color: '#1A2C3E',
  },
  riderCRN: {
    fontFamily: Fonts.Regular,
    fontSize: moderateScale(12),
    color: '#8E9AAB',
    marginTop: verticalScale(2),
  },
  totalAmountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF5EC',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(14),
    marginTop: verticalScale(4),
  },
  totalAmountLabel: {
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(15),
    color: '#6C7A8E',
  },
  totalAmount: {
    fontFamily: Fonts.Bold,
    fontSize: moderateScale(22),
    color: COLORS.Amber,
  },
  buttonWrapper: {
    marginTop: 'auto',
    marginBottom: verticalScale(16),
    borderRadius: moderateScale(40),
    overflow: 'hidden',
    shadowColor: COLORS.Amber,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  button: {
    width: '100%',
  },
  buttonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(16),
    borderRadius: moderateScale(40),
  },
  buttonText: {
    fontFamily: Fonts.SemiBold,
    fontSize: moderateScale(18),
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: scale(10),
  },
});