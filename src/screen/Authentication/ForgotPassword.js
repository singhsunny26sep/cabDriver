import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Container} from '../../components/Container/Container';
import {COLORS} from '../../theme/Colors';
import {AppBar} from '../../components/AppBar/AppBar';
import {Fonts} from '../../theme/Fonts';
import {moderateScale, scale, verticalScale} from '../../utils/Scalling';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomInput from '../../components/CustomTextInput/CustomInput';
import PrimaryButton from '../../components/Button/PrimaryButton';
import {OtpInput} from 'react-native-otp-entry';
import axios from 'axios';
import {showToast} from '../../components/CustomToast/CustomToast';
import {useNavigation} from '@react-navigation/native';
import {
  SENT_EMAIL_OTP_FORGOT_PASSWORD,
  VERIFY_EMAIL_OTP_FORGOT_PASSWORD,
  CREATE_EMAIL_PASSWORD,
} from '../../api/Endpoints';
import {BASE_URL} from '../../api/BaseUrl';
import {
  doPasswordsMatch,
  isStringNullBlank,
  isValidEmail,
  isValidPassword,
} from '../../utils/validations';

export default function ForgotPassword() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpToken, setOtpToken] = useState('');

  const handleVerifyEmail = async () => {
    if (isStringNullBlank(email, 'Email')) {return;}
    if (!isValidEmail(email)) {return;}

    try {
      setLoading(true);
      const response = await axios({
        method: SENT_EMAIL_OTP_FORGOT_PASSWORD.method,
        url: `${BASE_URL}${SENT_EMAIL_OTP_FORGOT_PASSWORD.url}`,
        data: {email},
      });

      if (response.data.success) {
        setStep(2);
        showToast('success', 'Success', 'OTP sent to your email address.');
      } else {
        showToast(
          'error',
          'Error',
          response.data.message || 'Failed to send OTP',
        );
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      showToast(
        'error',
        'Error',
        error.response?.data?.message || 'Failed to send OTP',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (isStringNullBlank(otpInput, 'OTP')) {return;}
    if (otpInput.length !== 6) {
      showToast('error', 'Error', 'Please enter a valid 6-digit OTP.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios({
        method: VERIFY_EMAIL_OTP_FORGOT_PASSWORD.method,
        url: `${BASE_URL}${VERIFY_EMAIL_OTP_FORGOT_PASSWORD.url}`,
        data: {email, otp: otpInput},
      });

      if (response.data.success) {
        setOtpToken(response.data.token);
        setStep(3);
        showToast('success', 'Success', 'OTP verified successfully.');
      } else {
        showToast(
          'error',
          'Error',
          response.data.message || 'OTP verification failed',
        );
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      showToast(
        'error',
        'Error',
        error.response?.data?.message || 'OTP verification failed',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSetNewPassword = async () => {
    if (isStringNullBlank(newPassword, 'Password')) {return;}
    if (!isValidPassword(newPassword)) {return;}

    if (isStringNullBlank(confirmPassword, 'Confirm Password')) {return;}
    if (!doPasswordsMatch(newPassword, confirmPassword)) {return;}

    try {
      setLoading(true);
      const response = await axios({
        method: CREATE_EMAIL_PASSWORD.method,
        url: `${BASE_URL}${CREATE_EMAIL_PASSWORD.url}`,
        headers: {
          Authorization: `${otpToken}`,
        },
        data: {password: newPassword},
      });
      console.log('response for new pass - > ', response);
      if (response.data.message === 'Password successfully updated') {
        showToast('success', 'Success', 'Password reset successfully!');
        navigation.navigate('SignIn');
      } else {
        showToast('error', 'Error', 'Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      showToast(
        'error',
        'Error',
        error.response?.data?.message || 'Failed to update password',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
      <AppBar back />

      <View style={styles.formContainer}>
        {step === 1 && (
          <>
            <Text style={styles.title}>Reset Your Password</Text>
            <Text style={styles.subtitle}>
              Please enter your email address to receive a verification code
              (OTP)
            </Text>
            <Text style={styles.label}>Email Address</Text>
            <CustomInput
              textInputProps={{
                placeholder: 'Enter your email',
                value: email,
                onChangeText: setEmail,
                keyboardType: 'email-address',
                autoCapitalize: 'none',
              }}
            />
            <PrimaryButton
              buttonText={'Verify Email'}
              style={styles.BTN}
              onPress={handleVerifyEmail}
              loading={loading}
              disabled={loading}
            />
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.subtitle}>Enter the OTP sent to {email}</Text>
            <Text style={styles.label}>Enter OTP</Text>
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
                  marginTop: 30,
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
            <PrimaryButton
              buttonText={'Submit OTP'}
              style={styles.BTN}
              onPress={handleVerifyOTP}
              loading={loading}
              disabled={loading || otpInput.length !== 6}
            />
          </>
        )}

        {step === 3 && (
          <>
            <Text style={styles.subtitle}>
              Set a new password for your account
            </Text>
            <Text style={styles.label}>New Password</Text>
            <CustomInput
              textInputProps={{
                placeholder: 'Enter new password (min 6 characters)',
                value: newPassword,
                onChangeText: setNewPassword,
                secureTextEntry: !showPassword,
              }}
              right={
                <Icon
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={COLORS.gray}
                  style={styles.icon}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />
            <Text style={styles.label}>Confirm New Password</Text>
            <CustomInput
              textInputProps={{
                placeholder: 'Confirm your new password',
                value: confirmPassword,
                onChangeText: setConfirmPassword,
                secureTextEntry: !showConfirmPassword,
              }}
              right={
                <Icon
                  name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={COLORS.gray}
                  style={styles.icon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
            />
            <PrimaryButton
              buttonText={'Set New Password'}
              style={styles.BTN}
              onPress={handleSetNewPassword}
              loading={loading}
              disabled={loading || !newPassword || !confirmPassword}
            />
          </>
        )}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: scale(35),
    marginBottom: scale(20),
    paddingHorizontal: scale(20),
  },
  title: {
    fontFamily: Fonts.Medium,
    textAlign: 'center',
    fontSize: moderateScale(22),
    marginBottom: scale(10),
    color: COLORS.black,
  },
  subtitle: {
    textAlign: 'center',
    fontFamily: Fonts.Regular,
    fontSize: moderateScale(16),
    color: COLORS.gray,
    paddingHorizontal: scale(30),
    marginBottom: verticalScale(20),
  },
  formContainer: {
    paddingHorizontal: scale(20),
    marginTop: scale(20),
  },
  label: {
    marginVertical: verticalScale(10),
    color: COLORS.black,
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(16),
  },
  BTN: {
    marginTop: scale(30),
    borderRadius: moderateScale(30),
  },
  icon: {
    marginRight: scale(15),
  },
});
