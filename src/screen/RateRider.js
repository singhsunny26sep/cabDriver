import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';
import {Container} from '../components/Container/Container';
import {COLORS} from '../theme/Colors';
import {AppBar} from '../components/AppBar/AppBar';
import {moderateScale, scale} from '../utils/Scalling';
import {Fonts} from '../theme/Fonts';
import {Rating, AirbnbRating} from 'react-native-ratings';
import PrimaryButton from '../components/Button/PrimaryButton';

export default function RateRider(  ) {
  const [rating, setRating] = useState(0);
  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
      <AppBar back title="Rate Rider" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileContainer}>
          <View style={styles.avatarPlaceholder} />
          <Text style={styles.nameText}>Kishan Patel</Text>
          <Text style={styles.tripDetails}>₹1500 ⚫ 12Miles</Text>
        </View>
        <View>
          <Text style={styles.tripRatingText}>
            How was your trip with kishan patel
          </Text>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingLabel}>Your overall rating</Text>
          <AirbnbRating
            count={5}
            defaultRating={rating}
            size={35}
            showRating={false}
            starStyle={styles.starStyle}
            emptyStarColor={COLORS.black}
            onFinishRating={newRating => setRating(newRating)}
          />
        </View>
        <Text style={styles.reviewText}>Add detailed review</Text>
        <TextInput placeholder="Enter here" style={styles.textInput} />
        <PrimaryButton buttonText="Submit" style={styles.BTN} />
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: scale(20),
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: scale(15),
  },
  avatarPlaceholder: {
    width: scale(75),
    height: scale(75),
    borderRadius: scale(50),
    backgroundColor: '#E0E0E0',
  },
  nameText: {
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(15),
    marginTop: scale(5),
  },
  tripDetails: {
    fontFamily: Fonts.Light,
    fontSize: moderateScale(15),
  },
  tripRatingText: {
    fontFamily: Fonts.Medium,
    textAlign: 'center',
    fontSize: moderateScale(20),
    marginHorizontal: scale(50),
    marginTop: scale(10),
  },
  ratingContainer: {
    marginTop: scale(10),
    borderTopWidth: 0.3,
    borderBottomWidth: 0.3,
    marginHorizontal: scale(15),
    paddingBottom: scale(18),
    paddingTop: scale(15),
    borderTopColor: COLORS.gray4,
    borderBottomColor: COLORS.gray4,
  },
  ratingLabel: {
    textAlign: 'center',
    fontFamily: Fonts.Regular,
    fontSize: moderateScale(15),
  },
  starStyle: {
    marginHorizontal: scale(15),
    marginTop: scale(15),
  },
  reviewText: {
    marginHorizontal: scale(15),
    fontSize: moderateScale(15),
    marginTop: scale(15),
    fontFamily: Fonts.Medium,
  },
  textInput: {
    borderWidth: 0.5,
    borderColor: COLORS.black,
    borderRadius: moderateScale(5),
    marginHorizontal: scale(15),
    padding: scale(10),
    height: scale(100),
    marginTop: scale(10),
    textAlignVertical: 'top',
    fontSize: moderateScale(15),
    fontFamily: Fonts.Regular,
  },
  BTN: {
    marginHorizontal: scale(15),
    marginTop: scale(40),
  },
});
