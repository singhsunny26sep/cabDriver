import React from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import {Image, Pressable, Text, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {COLORS} from '../theme/Colors';
import {Container} from '../components/Container/Container';
import {deviceHeight, deviceWidth} from '../constants/contants';
import images from '../assets/images';
import Icons from '../assets/Icons';
import {scale, verticalScale, moderateScale} from '../utils/Scalling';

const NextButton = ({...props}) => {
  return (
    <Pressable style={{paddingRight: moderateScale(15)}} {...props}>
      <Image
        source={Icons.Arrowleft}
        resizeMode="contain"
        style={{width: moderateScale(22), height: moderateScale(22)}}
      />
    </Pressable>
  );
};

const DoneButton = ({...props}) => {
  return (
    <Pressable
      {...props}
      style={{
        backgroundColor: COLORS.themePrimary,
        alignItems: 'center',
        justifyContent: 'center',
        width: moderateScale(42),
        height: moderateScale(42),
        borderRadius: moderateScale(25),
        marginRight: moderateScale(15),
      }}>
      <Text
        style={{
          fontFamily: 'Poppins-Medium',
          fontSize: 20,
          lineHeight: 22,
          color: '#5A5A5A',
          numberOfLines: 1,
          paddingTop: scale(6),
        }}>
        Go
      </Text>
    </Pressable>
  );
};

const OnBoarding = () => {
  const navigation = useNavigation();

  return (
    <Container statusBarBackgroundColor={COLORS.white}>
      <Onboarding
        onDone={() => navigation.navigate('SignUp')}
        onSkip={() => navigation.navigate('SignUp')}
        NextButtonComponent={NextButton}
        DoneButtonComponent={DoneButton}
        bottomBarColor="#fff"
        pages={[
          {
            backgroundColor: '#fff',
            image: (
              <Image
                source={images.onBoarding1}
                resizeMode="contain"
                style={{height: moderateScale(190)}}
              />
            ),
            title: 'Be Your Own Boss',
            subtitle:
              'Set your own schedule and earn on your terms. Drive when you want, as much as you want.',
          },
          {
            backgroundColor: '#fff',
            image: (
              <Image
                source={images.onBoarding2}
                resizeMode="contain"
                style={{height: moderateScale(190)}}
              />
            ),
            title: 'Maximize Your Earnings',
            subtitle:
              'Get paid for every ride with competitive rates, bonuses, and tips. The more you drive, the more you earn.',
          },
          {
            backgroundColor: '#fff',
            image: (
              <Image
                source={images.onBoarding3}
                resizeMode="contain"
                style={{height: moderateScale(190)}}
              />
            ),
            title: 'Safe & Reliable',
            subtitle:
              'Your safety is our priority. Enjoy 24/7 support and in-app safety features for worry-free driving.',
          },
        ]}
      />
    </Container>
  );
};

export default OnBoarding;
