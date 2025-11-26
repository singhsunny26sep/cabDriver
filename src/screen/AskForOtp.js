import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Container } from '../components/Container/Container';
import { COLORS } from '../theme/Colors';
import { AppBar } from '../components/AppBar/AppBar';
import { moderateScale, scale, verticalScale } from '../utils/Scalling';
import { Fonts } from '../theme/Fonts';
import { OtpInput } from 'react-native-otp-entry';

export default function AskForOtp() {
  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
      <AppBar back title="OTP Verification" />
      <View style={styles.titleContainer}>
        <Text style={styles.mainTitle}>Enter Estger's OTP</Text>
        <Text style={styles.subTitle}>We sent a PIN to your Customer's{'\n'}email address</Text>
      </View>
      <View style={styles.otpInputContainer}>
        <OtpInput
          numberOfDigits={4}
          focusColor={COLORS.Amber}
          focusStickBlinkingDuration={1000}
          theme={{
            pinCodeContainerStyle: styles.pinCodeContainer,
            containerStyle: styles.otpInputWrapper,
            filledPinCodeContainerStyle: styles.filledPinCodeContainer,
            pinCodeTextStyle: styles.pinCodeText,
          }}
        />
      </View>
      <View style={styles.resendContainer}>
        <Text style={styles.didntReceive}>Didn’t receive OTP?</Text>
        <TouchableOpacity>
          <Text style={styles.resendText}>Resend Code</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.verifyButton}>
        <Text style={styles.verifyButtonText}>Verify & End Ride</Text>
      </TouchableOpacity>
    </Container>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    marginTop: scale(20),
  },
  mainTitle: {
    textAlign: 'center',
    color: COLORS.black,
    fontFamily: Fonts.Bold,
    fontSize: moderateScale(20),
  },
  subTitle: {
    textAlign: 'center',
    color: COLORS.gray,
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(15),
  },
  otpInputContainer: {
    marginHorizontal: scale(30),
  },
  pinCodeContainer: {
    backgroundColor: '#FFFFFF',
    width: 60,
    height: 60,
  },
  otpInputWrapper: {
    alignSelf: 'center',
    marginTop: 50,
  },
  filledPinCodeContainer: {
    backgroundColor: COLORS.Amber,
    borderColor: COLORS.Amber,
  },
  pinCodeText: {
    color: '#000000',
    fontSize: moderateScale(25),
  },
  resendContainer: {
    marginTop: scale(30),
  },
  didntReceive: {
    textAlign: 'center',
    fontFamily: Fonts.Medium,
    color: COLORS.gray,
    fontSize: moderateScale(15),
  },
  resendText: {
    textAlign: 'center',
    fontFamily: Fonts.Medium,
    color: COLORS.black,
    fontSize: moderateScale(15),
    textDecorationLine: 'underline',
  },
  verifyButton: {
    backgroundColor: COLORS.Amber,
    marginHorizontal: scale(15),
    borderRadius: moderateScale(25),
    paddingVertical: verticalScale(10),
    marginTop: scale(40),
  },
  verifyButtonText: {
    textAlign: 'center',
    color: COLORS.black,
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(15),
  },
});
