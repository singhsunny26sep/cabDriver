import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {OtpInput} from 'react-native-otp-entry';
import PrimaryButton from '../../components/Button/PrimaryButton';
import {scale, verticalScale, moderateScale} from '../../utils/Scalling';
import {COLORS} from '../../theme/Colors';
import {Container} from '../../components/Container/Container';
import { AppBar } from '../../components/AppBar/AppBar';
import { Fonts } from '../../theme/Fonts';

const OtpVerify = ({}) => {
  const navigation = useNavigation();

  const [otpInput, setOtpInput] = useState('');

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
        <AppBar  back/>
      <View style={styles.header}>
        <Text style={styles.title}>Verify Code</Text>
        <Text style={styles.subTitle}>Please enter the code we just sent to email</Text>
        <Text style={styles.subTitle}>example@gmail.com</Text>
      </View>
      <View style={{marginHorizontal:scale(15)}}>
     <OtpInput
        numberOfDigits={6}
        onTextChange={text => setOtpInput(text)}
        focusColor={COLORS.Amber}
        focusStickBlinkingDuration={500}
        theme={{
          pinCodeContainerStyle: {
            backgroundColor: '#FFFFFF',
            width: 50,
            height: 50,
          },
          containerStyle: {
            alignSelf: 'center',
            marginTop: 50,
          },
          filledPinCodeContainerStyle: {
            backgroundColor: COLORS.Amber,
            borderColor: COLORS.Amber,
          },
          pinCodeTextStyle: {
            color: '#000000',
            fontSize: moderateScale(25),
          },
        }}
      />
    </View>
      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>Didn’t receive code?</Text>
        <TouchableOpacity>
          <Text style={styles.resendLink}>Resend again</Text>
        </TouchableOpacity>
      </View>
      <PrimaryButton
        buttonText="Verify"
        style={styles.primaryButton}
        onPress={() => navigation.navigate('Complateprofile')}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
 
  header: {
    alignItems: 'center',
    marginBottom:scale (15),
  },
  title: {
    fontSize:moderateScale (24),
    fontFamily:Fonts.ExtraBold,
    color:COLORS.black,
  },
  subTitle: {
    fontSize:moderateScale (15),
    color:COLORS.gray,
    fontFamily:Fonts.Regular
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:scale (40),
    alignSelf: 'center',
  },
  resendText: {
    fontSize:moderateScale(15),
    color:COLORS.black,
    fontFamily:Fonts.Medium,
  },
  resendLink: {
    fontSize:moderateScale(15),
    color:COLORS.Amber,
    fontFamily:Fonts.Medium
  },
  verifyButton: {
    marginTop:scale (30),
    paddingVertical:verticalScale (15),
    borderRadius:moderateScale (8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    borderRadius: moderateScale(30),
    marginHorizontal: scale(15),
    marginTop: scale(20),
  },
});

export default OtpVerify;
