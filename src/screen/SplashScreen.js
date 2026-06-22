import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
  StatusBar,
  Image,
  Easing,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Container } from '../components/Container/Container';
import { COLORS } from '../theme/Colors';
import { moderateScale, scale, verticalScale } from '../utils/Scalling';
import { Fonts } from '../theme/Fonts';
import { useNavigation } from '@react-navigation/native';
import { loadUserLocalMethod } from '../redux/slice/UserSlice';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const navigation = useNavigation();
  
  // Animation values for entrance
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  
  // Riding animations
  const wheelRotateLeft = useRef(new Animated.Value(0)).current;
  const wheelRotateRight = useRef(new Animated.Value(0)).current;
  const roadTranslateX = useRef(new Animated.Value(0)).current;
  const carBounce = useRef(new Animated.Value(0)).current;
  const speedLinesAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous wheel rotation
    const rotateWheels = () => {
      const rotate = (value) => {
        Animated.loop(
          Animated.timing(value, {
            toValue: 1,
            duration: 800,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        ).start();
      };
      rotate(wheelRotateLeft);
      rotate(wheelRotateRight);
    };
    rotateWheels();

    // Continuous road movement (scrolling stripes)
    Animated.loop(
      Animated.timing(roadTranslateX, {
        toValue: -width,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Car suspension bounce effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(carBounce, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(carBounce, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Speed lines animation
    Animated.loop(
      Animated.timing(speedLinesAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    const checkLoginStatus = async () => {
      try {
        const userData = await loadUserLocalMethod();
        setTimeout(() => {
          if (userData?.isLoggedIn) {
            navigation.reset({
              index: 0,
              routes: [{ name: 'BottomTab' }],
            });
          } else {
            navigation.replace('SignIn');
          }
        }, 3000);
      } catch (error) {
        console.error('Error checking login status:', error);
        setTimeout(() => {
          navigation.replace('SignIn');
        }, 3000);
      }
    };

    checkLoginStatus();

    // Cleanup not strictly necessary but good practice for animation loops
    return () => {
      wheelRotateLeft.stopAnimation();
      wheelRotateRight.stopAnimation();
      roadTranslateX.stopAnimation();
      carBounce.stopAnimation();
      speedLinesAnim.stopAnimation();
    };
  }, [navigation, fadeAnim, scaleAnim, slideAnim, wheelRotateLeft, wheelRotateRight, roadTranslateX, carBounce, speedLinesAnim]);

  // Interpolations for wheel rotation (0 to 1 -> 0 to 360 degrees)
  const leftWheelSpin = wheelRotateLeft.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const rightWheelSpin = wheelRotateRight.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Car bounce interpolation
  const bounceTranslate = carBounce.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -verticalScale(8)],
  });

  // Speed lines interpolation
  const speedLines1 = speedLinesAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [width, width * 0.3, -width * 0.5],
  });
  const speedLines2 = speedLinesAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [width * 0.8, width * 0.1, -width * 0.7],
  });
  const speedLines3 = speedLinesAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [width * 1.2, width * 0.5, -width * 0.3],
  });

  // Road stripes need to be duplicated for seamless loop
  const roadTranslate = roadTranslateX.interpolate({
    inputRange: [-width, 0],
    outputRange: [-width, 0],
  });

  return (
    <Container
      statusBarStyle="light-content"
      statusBarBackgroundColor={COLORS.Amber}
      backgroundColor={COLORS.Amber}>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={[styles.container, { backgroundColor: COLORS.Amber }]}>
        
        {/* Speed lines (motion effect) */}
        <Animated.View style={[styles.speedLine, { transform: [{ translateX: speedLines1 }] }]} />
        <Animated.View style={[styles.speedLine, styles.speedLine2, { transform: [{ translateX: speedLines2 }] }]} />
        <Animated.View style={[styles.speedLine, styles.speedLine3, { transform: [{ translateX: speedLines3 }] }]} />

        {/* Animated Car & Logo Section */}
        <Animated.View
          style={[
            styles.carContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }, { translateY: bounceTranslate }],
            },
          ]}>
          {/* Glowing effect behind car */}
          <View style={styles.glowRing}>
            <View style={styles.glowRingInner} />
          </View>
          
          {/* Car Body (Logo as emblem on car) */}
          <View style={styles.carBody}>
            <Image
              resizeMode="contain"
              source={require('../assets/images/logo.png')}
              style={styles.logo}
            />
            {/* Hood ornament */}
            <View style={styles.hoodOrnament}>
              <FontAwesome5 name="star" size={scale(12)} color="#FFD700" solid />
            </View>
          </View>

          {/* Wheels Row */}
          <View style={styles.wheelsRow}>
            {/* Left Wheel */}
            <Animated.View
              style={[
                styles.wheel,
                { transform: [{ rotate: leftWheelSpin }] },
              ]}>
              <View style={styles.wheelInner} />
              <View style={styles.wheelSpoke} />
              <View style={[styles.wheelSpoke, styles.wheelSpoke2]} />
            </Animated.View>
            
            {/* Right Wheel */}
            <Animated.View
              style={[
                styles.wheel,
                { transform: [{ rotate: rightWheelSpin }] },
              ]}>
              <View style={styles.wheelInner} />
              <View style={styles.wheelSpoke} />
              <View style={[styles.wheelSpoke, styles.wheelSpoke2]} />
            </Animated.View>
          </View>
        </Animated.View>

        {/* Animated Text */}
        

        {/* Moving Road Stripes */}
        <View style={styles.roadContainer}>
          <Animated.View style={[styles.roadStripesRow, { transform: [{ translateX: roadTranslate }] }]}>
            {[...Array(8)].map((_, i) => (
              <View key={i} style={styles.roadStripe} />
            ))}
          </Animated.View>
          <Animated.View style={[styles.roadStripesRow, { transform: [{ translateX: roadTranslate }] }]}>
            {[...Array(8)].map((_, i) => (
              <View key={i + 8} style={styles.roadStripe} />
            ))}
          </Animated.View>
        </View>

        {/* Loading indicator */}
        <Animated.View style={[styles.loaderContainer, { opacity: fadeAnim }]}>
          <View style={styles.loaderDot} />
          <View style={[styles.loaderDot, styles.loaderDotDelay]} />
          <View style={[styles.loaderDot, styles.loaderDotDelay2]} />
        </Animated.View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  glowRing: {
    position: 'absolute',
    width: scale(160),
    height: scale(160),
    borderRadius: scale(80),
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 15,
  },
  glowRingInner: {
    width: scale(140),
    height: scale(140),
    borderRadius: scale(70),
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  carBody: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: moderateScale(40),
    paddingHorizontal: scale(20),
    paddingVertical: scale(15),
    marginBottom: verticalScale(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  logo: {
    height: scale(70),
    width: scale(70),
    marginRight: scale(5),
  },
  hoodOrnament: {
    position: 'absolute',
    top: -scale(12),
    right: scale(15),
  },
  wheelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: scale(170),
    marginTop: verticalScale(5),
  },
  wheel: {
    width: scale(45),
    height: scale(45),
    borderRadius: scale(22.5),
    backgroundColor: '#2C2C2E',
    borderWidth: 3,
    borderColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  wheelInner: {
    width: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    backgroundColor: '#888',
  },
  wheelSpoke: {
    position: 'absolute',
    width: scale(35),
    height: 3,
    backgroundColor: '#AAA',
    borderRadius: 1.5,
  },
  wheelSpoke2: {
    transform: [{ rotate: '90deg' }],
  },
  text: {
    fontSize: moderateScale(36),
    textAlign: 'center',
    fontFamily: Fonts.Medium,
    color: '#fff',
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  driverText: {
    fontFamily: Fonts.Bold,
    fontWeight: '700',
  },
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(12),
  },
  dot: {
    width: scale(5),
    height: scale(5),
    borderRadius: scale(2.5),
    backgroundColor: '#fff',
    marginHorizontal: scale(8),
    opacity: 0.8,
  },
  tagline: {
    fontSize: moderateScale(12),
    fontFamily: Fonts.Regular,
    color: '#fff',
    letterSpacing: 0.5,
    opacity: 0.9,
  },
  loaderContainer: {
    position: 'absolute',
    bottom: verticalScale(60),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: '#fff',
    marginHorizontal: scale(6),
    opacity: 0.6,
  },
  loaderDotDelay: {
    opacity: 0.3,
  },
  loaderDotDelay2: {
    opacity: 0.1,
  },
  speedLine: {
    position: 'absolute',
    width: scale(60),
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 1,
    top: height * 0.35,
  },
  speedLine2: {
    top: height * 0.4,
    width: scale(40),
    height: 1.5,
  },
  speedLine3: {
    top: height * 0.45,
    width: scale(50),
    height: 2,
  },
  roadContainer: {
    position: 'absolute',
    bottom: verticalScale(100),
    width: width,
    overflow: 'hidden',
    height: verticalScale(30),
  },
  roadStripesRow: {
    flexDirection: 'row',
    position: 'absolute',
    width: width * 2,
    height: verticalScale(30),
    alignItems: 'center',
  },
  roadStripe: {
    width: scale(40),
    height: verticalScale(4),
    backgroundColor: 'rgba(255,255,255,0.7)',
    marginHorizontal: scale(15),
    borderRadius: scale(2),
  },
});