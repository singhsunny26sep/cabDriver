import React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Container} from '../components/Container/Container';
import {verticalScale, scale, moderateScale} from '../utils/Scalling';
import {COLORS} from '../theme/Colors';
import {AppBar} from '../components/AppBar/AppBar';
import Icons from '../assets/Icons';
import {Fonts} from '../theme/Fonts';
import PrimaryButton from '../components/Button/PrimaryButton';
import { useNavigation } from '@react-navigation/native';
import { locationPermission } from '../utils/helperFunctions';

export default function EnableLocationAccess() {
  const navigation = useNavigation();


  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
      <AppBar back />
      <View style={styles.mainContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={Icons.placeIndicate}
            resizeMode="contain"
            style={styles.image}
          />
          <View style={styles.textContainer}>
            <Text style={styles.title}>
              Enable Location Access
            </Text>
            <Text style={styles.description}>
              To ensure a seamless and efficient experience, allow us access to
              your location
            </Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.buttonWrapper}>
            <PrimaryButton 
              buttonText="Allow Location Access" 
              onPress={()=>  navigation.navigate('FindingJob')}
            />
            <TouchableOpacity>
              <Text style={styles.laterText}>
                Maybe later
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  imageContainer: {
    marginTop: scale(50),
  },
  image: {
    height: scale(200),
    width: scale(200),
    alignSelf: 'center',
  },
  textContainer: {
    marginTop: scale(30),
  },
  title: {
    fontFamily: Fonts.Bold,
    textAlign: 'center',
    fontSize: moderateScale(20),
    color: COLORS.black,
  },
  description: {
    textAlign: 'center',
    color: COLORS.gray,
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(13),
    marginHorizontal: scale(15),
    marginTop: scale(10),
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: scale(0),
    width: '100%',
  },
  buttonWrapper: {
    backgroundColor: COLORS.white3,
    padding: scale(15),
    borderRadius: scale(10),
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  laterText: {
    textAlign: 'center',
    color: COLORS.gray,
    fontFamily: Fonts.Medium,
    marginTop: scale(10),
    fontSize: moderateScale(18),
  },
});
