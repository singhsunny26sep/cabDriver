import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Container} from '../../components/Container/Container';
import {COLORS} from '../../theme/Colors';
import {moderateScale, scale, verticalScale} from '../../utils/Scalling';
import {Fonts} from '../../theme/Fonts';
import CustomInput from '../../components/CustomTextInput/CustomInput';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomCheckbox from '../../components/CustomCheckbox/CustomCheckbox';
import PrimaryButton from '../../components/Button/PrimaryButton';
import Icon2 from 'react-native-vector-icons/AntDesign';
import CustomInputField from '../../components/CustomTextInput/CustomInputField';
import CustomPasswordInputField from '../../components/CustomTextInput/CustomPasswordInputField';
import {useDispatch, useSelector} from 'react-redux';
import {setUserData, setLoading, setError} from '../../redux/slice/UserSlice';
import {saveUserLocalMethod, removeUserLocalMethod} from '../../redux/slice/UserSlice';
import { isStringNullBlank, isValidEmail, isValidPassword, doPasswordsMatch  } from '../../utils/validations';
import { showToast } from '../../components/CustomToast/CustomToast';

export default function SignUp({navigation}) {
  const dispatch = useDispatch();

  const [isChecked, setIsChecked] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    // navigation.navigate('VerifyOtp');
    setLoading(true);
    try {
      // Validate all fields
      if (isStringNullBlank(name, 'Name')) {return;}

      if (isStringNullBlank(email, 'Email')) {return;}
      if (!isValidEmail(email)) {return;}

      if (isStringNullBlank(password, 'Password')) {return;}
      if (!isValidPassword(password)) {return;}

      if (isStringNullBlank(confirmPassword, 'Confirm Password')) {return;}
      if (!doPasswordsMatch(password, confirmPassword)) {return;}

      if (!isChecked) {
        showToast('error', 'Validation Error', 'Please agree to terms & conditions');
        return;
      }

      // Prepare user data
      const userData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        signupType: 'email',
        isLoggedIn: false,
        isSignupCompleted: false,
        isRidePopupVisible: false,
      };

      // Save to Redux
      dispatch(setUserData(userData));

      // Save to local storage
      await saveUserLocalMethod(userData);

      // Show success
      // showToast('success', 'Account Created', 'Your account has been created successfully');

      // Clear form
      setLoading(false);
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setIsChecked(false);

      // Navigate
      navigation.navigate('Complateprofile'); // Or your next screen

    } catch (error) {
      setLoading(false);
      showToast('error', 'Signup Failed', error.message || 'Failed to create account');
    }
  };

  return (
    <Container
      fullScreen
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Create Account</Text>
        <Text style={styles.subHeaderText}>
          Fill your information below or register{'\n'}with your social account
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <CustomInputField
          label={'Name'}
          value={name}
          onChangeText={setName}
          keyboardType="default"
          secureTextEntry={false}
          placeholder={'Please Enter Your Name'}
        />
        <CustomInputField
          label={'Email'}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          secureTextEntry={false}
          placeholder={'Please Enter Your Email'}
        />
        <CustomPasswordInputField
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
        />
        <CustomPasswordInputField
          label="Confirm Password"
          placeholder="Enter your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      <View style={styles.termsContainer}>
        <CustomCheckbox
          checked={isChecked}
          onPress={() => setIsChecked(!isChecked)}
        />
        <Text style={styles.termsText}>
          Agree with <Text style={styles.termsLink}>Terms & Conditions</Text>
        </Text>
      </View>

      <PrimaryButton buttonText="Sign Up" style={styles.primaryButton} onPress={handleSignup} loading={loading} />

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
        Already have an account?{' '}
          <Text onPress={()=>navigation.navigate('SignIn')} style={styles.signInText}>Sign In</Text>
      </Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    marginTop: scale(40),
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
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: scale(15),
    gap: scale(10),
  },
  termsText: {
    fontFamily: Fonts.Regular,
    fontSize: moderateScale(14),
    color: COLORS.black,
  },
  termsLink: {
    textDecorationLine: 'underline',
    color: COLORS.Amber,
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
  signInText: {
    color: COLORS.Amber,
    fontFamily: Fonts.Bold,
    textDecorationLine: 'underline',
  },
});
