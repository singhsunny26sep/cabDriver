import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Container } from '../components/Container/Container';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { COLORS } from '../theme/Colors';
import { moderateScale, scale } from '../utils/Scalling';
import { Fonts } from '../theme/Fonts';
import { useNavigation } from '@react-navigation/native'; 
import { loadUserLocalMethod } from '../redux/slice/UserSlice';

export default function SplashScreen() {
  const navigation = useNavigation();

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     navigation.replace('SecondSplashScreen');
  //   }, 3000); 

  //   return () => clearTimeout(timer);
  // }, [navigation]);
  useEffect(() => {
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
  }, [navigation]);

  return (
    <Container statusBarStyle={'dark-content'} statusBarBackgroundColor={COLORS.Amber} backgroundColor={COLORS.Amber}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <FontAwesome5 name='car' size={50} color="#fff" />
        </View>
        <Text style={styles.text}>RioDrive Driver</Text>
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
  iconContainer: {
    backgroundColor: '#ffc107',
    width: scale(100),
    height: scale(100),
    borderRadius: moderateScale(55),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(20),
  },
  text: {
    fontSize: moderateScale(22),
    textAlign: 'center',
    fontFamily: Fonts.Medium
  }
});

