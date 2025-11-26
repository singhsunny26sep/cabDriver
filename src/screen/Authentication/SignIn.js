import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Container} from '../../components/Container/Container';
import {COLORS} from '../../theme/Colors';
import {moderateScale, scale, verticalScale} from '../../utils/Scalling';
import {Fonts} from '../../theme/Fonts';
import CustomInput from '../../components/CustomTextInput/CustomInput';
import Icon from 'react-native-vector-icons/Ionicons';
import PrimaryButton from '../../components/Button/PrimaryButton';
import Icon2 from 'react-native-vector-icons/AntDesign';
import CustomInputField from '../../components/CustomTextInput/CustomInputField';
import CustomPasswordInputField from '../../components/CustomTextInput/CustomPasswordInputField';
import { showToast } from '../../components/CustomToast/CustomToast';
import { isStringNullBlank, isValidEmail, isValidPassword } from '../../utils/validations';
import axios from 'axios';
import { GET_PROFILE, SIGN_IN } from '../../api/Endpoints';
import { BASE_URL } from '../../api/BaseUrl';
import messaging from '@react-native-firebase/messaging';
// import { getFCMToken } from '../../utils/notifications';
import { getFCMToken } from '../../utils/NotificationHelper';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { loadUserLocalMethod, saveUserLocalMethod, setUserData } from '../../redux/slice/UserSlice';

export default function SignIn() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [fcmToken, setFcmToken] = useState('');
  const [userLocalData, setUserLocalData] = useState(null);

  useEffect(()=> {
    askFCMToken();
  },[]);

  const askFCMToken = async () => {
    const userLData = await loadUserLocalMethod();
    const token = await getFCMToken();
    // console.log("fcm token....",token)
    console.log('user Local data from Login --- ', userLData);
    setFcmToken(token);
  }

  const handleLogin = async () => {
    setLoading(true);
    try {
      if (isStringNullBlank(email, "Email")) return;
      if (!isValidEmail(email)) return;
      
      if (isStringNullBlank(password, "Password")) return;
      if (!isValidPassword(password)) return;

      const response = await axios({
        method: SIGN_IN.method,
        url: `${BASE_URL}${SIGN_IN.url}`,
        data: {
          email,
          password,
          fcmToken
        }
      });
      setLoading(false);
      console.warn("Response for Login -> ", response);
      
      if(response.status === 200 && Boolean(response?.data?.token)) {
        const userData = await fetchUserProfile(response?.data?.token);
        // console.log("userData profile data -> ", userData);

        dispatch(setUserData({
          ...userData,
          token: response?.data?.token,
          isLoggedIn: true,
          isSignupCompleted: true,
          signupType: "email",
          isRidePopupVisible: false
        }));
        await saveUserLocalMethod({
          ...userData,
          token: response?.data?.token,
          isLoggedIn: true,
          isSignupCompleted: true,
          signupType: "email",
        });
        navigation.reset({
          index: 0,
          routes: [{ name: 'BottomTab' }],
        });
      }
      else if(response?.data?.status === "adminVerification") {
      showToast('error', 'Oops!', response?.data?.msg);
      }
      else{
        showToast('error', 'Oops!', response?.data?.msg || "Server error");
      }

    } catch (error) {
      console.log("error -> ", error)
      setLoading(false);
      showToast('error', 'Login Failed', error.message || 'Failed to Login, please try again later.');
    }
  }

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios({
        method: GET_PROFILE.method,
        url: `${BASE_URL}${GET_PROFILE.url}`,
        headers: {Authorization: `${token}`},
      });

      console.log("response for fetch profile ->>>>>>", response?.data?.data)
      return response?.data?.data;
    } catch (error) {
      console.log("error for fetch profile -> ", error)
      setLoading(false);
      showToast('error', 'Login Failed', error.message || 'Failed to Login, please try again later.');
    }
  }

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Sign In</Text>
        <Text style={styles.subHeaderText}>
          Hi! Welcome back, you've been missed
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <CustomInputField 
          label={"Email"}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          secureTextEntry={false}
          placeholder={"Please Enter Your Email"}
        />
        <CustomPasswordInputField
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
        />
        
        {/* <Text style={[styles.label, styles.marginTop]}>Email</Text>
        <CustomInput textInputProps={{placeholder: 'example@gmail.com'}} />

        <Text style={[styles.label, styles.marginTop]}>Password</Text>
        <CustomInput
          textInputProps={{
            placeholder: 'Password',
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
        /> */}
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotPasswordText}>Forgot Password</Text>
      </TouchableOpacity>

      <PrimaryButton
        buttonText="Sign In"
        style={styles.primaryButton}
        onPress={handleLogin}
        loading={loading}
      />

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>Or Sign up with</Text>
        <View style={styles.divider} />
      </View>

      <View style={styles.socialIconsContainer}>
        <TouchableOpacity style={styles.socialIconButton}>
          <Icon2 name="apple1" size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialIconButton}>
          <Icon2 name="google" size={24} color="#DB4437" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.socialIconButton}>
          <Icon2 name="facebook-square" size={24} color="#4267B2" />
        </TouchableOpacity>
      </View>

      <Text style={styles.footerText}>
        Don't have an account? <Text style={styles.signUpText}  onPress={() => navigation.navigate('SignUp')}>Sign Up</Text>
      </Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    marginTop: scale(30),
  },
  headerText: {
    textAlign: 'center',
    color: COLORS.black,
    fontSize: moderateScale(22),
    fontFamily: Fonts.Medium,
  },
  subHeaderText: {
    textAlign: 'center',
    color: COLORS.gray,
    fontSize: moderateScale(15),
    fontFamily: Fonts.Regular,
    marginTop: scale(10),
  },
  inputContainer: {
    marginHorizontal: scale(15),
    marginTop: scale(10),
  },
  label: {
    marginVertical: verticalScale(3),
    color: COLORS.black,
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(15),
  },
  marginTop: {
    marginTop: scale(15),
  },
  icon: {
    marginRight: scale(15),
  },
  forgotPasswordText: {
    textAlign: 'right',
    marginRight: scale(15),
    marginTop: scale(10),
    fontFamily: Fonts.Medium,
    textDecorationLine: 'underline',
  },
  primaryButton: {
    borderRadius: moderateScale(30),
    marginHorizontal: scale(15),
    marginTop: scale(20),
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: scale(15),
    marginVertical: scale(20),
  },
  divider: {
    flex: 1,
    height: 0.5,
    backgroundColor: COLORS.gray,
  },
  dividerText: {
    paddingHorizontal: scale(10),
    color: COLORS.gray,
    fontFamily: Fonts.Regular,
    fontSize: moderateScale(14),
  },
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginVertical: 15,
  },
  socialIconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  footerText: {
    color: COLORS.black,
    textAlign: 'center',
    fontSize: moderateScale(16),
    fontFamily: Fonts.Medium,
    marginTop: scale(20),
  },
  signUpText: {
    color: COLORS.Amber,
    fontFamily: Fonts.Bold,
    textDecorationLine: 'underline',
  },
});
