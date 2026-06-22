import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
  Animated,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Container} from '../../components/Container/Container';
import {COLORS} from '../../theme/Colors';
import {moderateScale, scale, verticalScale} from '../../utils/Scalling';
import {Fonts} from '../../theme/Fonts';
import CustomInputField from '../../components/CustomTextInput/CustomInputField';
import CustomPasswordInputField from '../../components/CustomTextInput/CustomPasswordInputField';
import PrimaryButton from '../../components/Button/PrimaryButton';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/AntDesign';
import {showToast} from '../../components/CustomToast/CustomToast';
import {
  isStringNullBlank,
  isValidEmail,
  isValidPassword,
} from '../../utils/validations';
import axios from 'axios';
import {GET_PROFILE, SIGN_IN} from '../../api/Endpoints';
import {BASE_URL} from '../../api/BaseUrl';
import {getFCMToken} from '../../utils/NotificationHelper';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {
  loadUserLocalMethod,
  saveUserLocalMethod,
  setUserData,
} from '../../redux/slice/UserSlice';

const {width, height} = Dimensions.get('window');

export default function SignIn() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fcmToken, setFcmToken] = useState('');

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
    askFCMToken();
  }, []);

  const askFCMToken = async () => {
    const token = await getFCMToken();
    setFcmToken(token);
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      if (isStringNullBlank(email, 'Email')) {return;}
      if (!isValidEmail(email)) {return;}

      if (isStringNullBlank(password, 'Password')) {return;}
      if (!isValidPassword(password)) {return;}

      const response = await axios({
        method: SIGN_IN.method,
        url: `${BASE_URL}${SIGN_IN.url}`,
        data: {email, password, fcmToken},
      });
      setLoading(false);

      if (response.status === 200 && Boolean(response?.data?.token)) {
        const userData = await fetchUserProfile(response?.data?.token);
        dispatch(
          setUserData({
            ...userData,
            token: response?.data?.token,
            isLoggedIn: true,
            isSignupCompleted: true,
            signupType: 'email',
            isRidePopupVisible: false,
          }),
        );
        await saveUserLocalMethod({
          ...userData,
          token: response?.data?.token,
          isLoggedIn: true,
          isSignupCompleted: true,
          signupType: 'email',
        });
        navigation.reset({
          index: 0,
          routes: [{name: 'BottomTab'}],
        });
      } else if (response?.data?.status === 'adminVerification') {
        showToast('error', 'Oops!', response?.data?.msg);
      } else {
        showToast('error', 'Oops!', response?.data?.msg || 'Server error');
      }
    } catch (error) {
      console.log('error -> ', error);
      setLoading(false);
      showToast(
        'error',
        'Login Failed',
        error.message || 'Failed to Login, please try again later.',
      );
    }
  };

  const fetchUserProfile = async token => {
    try {
      const response = await axios({
        method: GET_PROFILE.method,
        url: `${BASE_URL}${GET_PROFILE.url}`,
        headers: {Authorization: `${token}`},
      });
      return response?.data?.data;
    } catch (error) {
      console.log('error for fetch profile -> ', error);
      setLoading(false);
      showToast(
        'error',
        'Login Failed',
        error.message || 'Failed to Login, please try again later.',
      );
    }
  };

  return (
    <Container
      statusBarStyle="dark-content"
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}>
            <Animated.View
              style={[
                styles.headerContainer,
                {opacity: fadeAnim, transform: [{translateY: slideAnim}]},
              ]}>
              <LinearGradient
                colors={['#FF6B4A', '#FF8C42']}
                style={styles.gradientCircle}>
                <Icon name="car-sport" size={scale(50)} color="#FFF" />
              </LinearGradient>
              <Text style={styles.headerText}>Welcome Back!</Text>
              <Text style={styles.subHeaderText}>
                Sign in to continue your journey
              </Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.formContainer,
                {opacity: fadeAnim, transform: [{translateY: slideAnim}]},
              ]}>
              <CustomInputField
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholder="hello@example.com"
                leftIcon={<Icon2 name="mail" size={20} color={COLORS.gray} />}
              />
              <CustomPasswordInputField
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                leftIcon={<Icon2 name="lock" size={20} color={COLORS.gray} />}
              />

              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}
                style={styles.forgotContainer}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <PrimaryButton
                buttonText="Sign In"
                style={styles.primaryButton}
                onPress={handleLogin}
                loading={loading}
              />

              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>Or continue with</Text>
                <View style={styles.divider} />
              </View>

              <View style={styles.socialIconsContainer}>
                <TouchableOpacity style={styles.socialIconButton}>
                  <LinearGradient
                    colors={['#000', '#333']}
                    style={styles.socialGradient}>
                    <Icon2 name="apple1" size={24} color="#FFF" />
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialIconButton}>
                  <LinearGradient
                    colors={['#DB4437', '#B33A2E']}
                    style={styles.socialGradient}>
                    <Icon2 name="google" size={24} color="#FFF" />
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialIconButton}>
                  <LinearGradient
                    colors={['#4267B2', '#2F477A']}
                    style={styles.socialGradient}>
                    <Icon2 name="facebook-square" size={24} color="#FFF" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              <Text style={styles.footerText}>
                Don't have an account?{' '}
                <Text
                  style={styles.signUpText}
                  onPress={() => navigation.navigate('SignUp')}>
                  Sign Up
                </Text>
              </Text>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>

    </Container>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: verticalScale(30),
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: scale(40),
    marginBottom: scale(20),
  },
  gradientCircle: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(20),
    shadowColor: '#FF8C42',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  headerText: {
    fontSize: moderateScale(28),
    fontFamily: Fonts.Bold,
    color: COLORS.black,
    letterSpacing: 0.5,
  },
  subHeaderText: {
    fontSize: moderateScale(15),
    fontFamily: Fonts.Regular,
    color: COLORS.gray,
    marginTop: scale(6),
  },
  formContainer: {
    marginHorizontal: scale(20),
    marginTop: scale(10),
  },
  forgotContainer: {
    alignSelf: 'flex-end',
    marginTop: verticalScale(8),
    marginBottom: verticalScale(8),
  },
  forgotPasswordText: {
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(14),
    color: COLORS.themePrimary,
    textDecorationLine: 'underline',
  },
  primaryButton: {
    borderRadius: moderateScale(40),
    marginTop: scale(15),
    height: verticalScale(50),
    shadowColor: COLORS.themePrimary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: verticalScale(25),
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    paddingHorizontal: scale(12),
    color: COLORS.gray,
    fontFamily: Fonts.Regular,
    fontSize: moderateScale(13),
  },
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: scale(20),
    marginBottom: verticalScale(25),
  },
  socialIconButton: {
    borderRadius: scale(30),
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  socialGradient: {
    width: scale(55),
    height: scale(55),
    borderRadius: scale(27.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    textAlign: 'center',
    fontSize: moderateScale(15),
    fontFamily: Fonts.Medium,
    color: COLORS.black,
    marginBottom: verticalScale(20),
  },
  signUpText: {
    color: COLORS.themePrimary,
    fontFamily: Fonts.Bold,
    textDecorationLine: 'underline',
  },
});
