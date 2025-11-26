import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Container} from '../components/Container/Container';
import {COLORS} from '../theme/Colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import {moderateScale, scale} from '../utils/Scalling';
import {Fonts} from '../theme/Fonts';
import PrimaryButton from '../components/Button/PrimaryButton';
import {useNavigation} from '@react-navigation/native';

export default function SecondSplashScreen() {
  const navigation = useNavigation();

  const handleGetStarted = () => {
    navigation.navigate('OnBoarding');
  };

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={COLORS.Amber}
      backgroundColor={COLORS.white}>
      <View style={styles.topSection}>
        <View style={styles.iconRowTop}>
          <View style={styles.iconContainer}>
            <Icon name="google-maps" size={scale(22)} color={COLORS.black} />
          </View>
          <View style={styles.iconContainer}>
            <Icon2 name="user-alt" size={scale(22)} color={COLORS.black} />
          </View>
        </View>

        <View style={styles.iconRowBottom}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="message" size={scale(22)} color={COLORS.black} />
          </View>
          <View style={styles.iconContainer}>
            <Feather name="phone-call" size={scale(22)} color={COLORS.black} />
          </View>
        </View>
      </View>

      <View>
        <Text style={styles.titleText}>
          Earn Money With This {'\n'}Driver App
        </Text>
        <Text style={styles.subtitleText}>
          Lorem ipsum dolor sit amet, consectetur{'\n'}adipiscing elit,sed do
          eiusmod tempor incididunt
        </Text>
        <PrimaryButton
          buttonText="Lets Get Started"
          style={styles.primaryButton}
          onPress={handleGetStarted}
        />
        <Text style={styles.footerText}>
          Already have an account?{' '}
          <Text
            onPress={() => navigation.navigate('SignIn')}
            style={styles.signInText}>
            Sign In
          </Text>
        </Text>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  topSection: {
    backgroundColor: COLORS.Amber,
    height: scale(400),
    borderBottomLeftRadius: moderateScale(30),
    borderBottomRightRadius: moderateScale(30),
  },
  iconRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: scale(50),
    marginHorizontal: scale(15),
  },
  iconRowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: scale(50),
    marginHorizontal: scale(20),
  },
  iconContainer: {
    backgroundColor: COLORS.white,
    width: scale(40),
    height: scale(40),
    borderRadius: moderateScale(25),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(20),
  },
  titleText: {
    textAlign: 'center',
    fontFamily: Fonts.Bold,
    color: COLORS.black,
    fontSize: moderateScale(18),
    marginTop: scale(20),
  },
  subtitleText: {
    textAlign: 'center',
    fontFamily: Fonts.Regular,
    color: COLORS.black,
    fontSize: moderateScale(13),
    marginTop: scale(10),
  },
  primaryButton: {
    borderRadius: moderateScale(30),
    marginHorizontal: scale(15),
    marginTop: scale(20),
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
