import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
} from 'react-native';
import { Container } from '../components/Container/Container';
import { COLORS } from '../theme/Colors';
import { AppBar } from '../components/AppBar/AppBar';
import { moderateScale, scale, verticalScale } from '../utils/Scalling';
import { Fonts } from '../theme/Fonts';
import { AirbnbRating } from 'react-native-ratings';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function RateRider() {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const buttonScale = useRef(new Animated.Value(1)).current;

  const getRatingEmoji = () => {
    if (rating >= 4.5) return '😍';
    if (rating >= 3.5) return '🙂';
    if (rating >= 2.5) return '😐';
    if (rating >= 1) return '😕';
    return '🤔';
  };

  const handleSubmit = () => {
    Animated.sequence([
      Animated.spring(buttonScale, { toValue: 0.96, friction: 5, useNativeDriver: true }),
      Animated.spring(buttonScale, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start(() => {
      console.log('Rating submitted:', { rating, review });
    });
  };

  return (
    <Container
      statusBarStyle="dark-content"
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
      <AppBar back title="Rate Rider" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        {/* Rider Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarInitials}>KP</Text>
          </View>
          <Text style={styles.nameText}>Kishan Patel</Text>
          <View style={styles.tripDetailsRow}>
            <MaterialIcons name="currency-rupee" size={14} color="#6C7A8E" />
            <Text style={styles.tripDetails}>1500</Text>
            <View style={styles.dot} />
            <MaterialIcons name="directions-car" size={14} color="#6C7A8E" />
            <Text style={styles.tripDetails}>12 Miles</Text>
          </View>
        </View>

        {/* Rating Prompt */}
        <View style={styles.promptContainer}>
          <Text style={styles.promptText}>
            How was your trip with Kishan?
          </Text>
          {rating > 0 && (
            <Text style={styles.emojiText}>{getRatingEmoji()}</Text>
          )}
        </View>

        {/* Rating Stars Card */}
        <View style={styles.ratingCard}>
          <Text style={styles.ratingLabel}>Your overall rating</Text>
          <AirbnbRating
            count={5}
            defaultRating={rating}
            size={30}
            showRating={false}
            starStyle={styles.starStyle}
            emptyStarColor="#D1D5DB"
            onFinishRating={(newRating) => setRating(newRating)}
          />
          {rating > 0 && (
            <Text style={styles.ratingValue}>
              {rating.toFixed(1)} / 5.0
            </Text>
          )}
        </View>

        {/* Detailed Review */}
        <View style={styles.reviewSection}>
          <Text style={styles.reviewText}>Add detailed review</Text>
          <TextInput
            placeholder="Share your experience..."
            placeholderTextColor="#9CA3AF"
            value={review}
            onChangeText={setReview}
            multiline
            numberOfLines={4}
            style={styles.textInput}
          />
        </View>

        {/* Submit Button */}
        <Animated.View style={{ transform: [{ scale: buttonScale }], marginTop: verticalScale(20) }}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleSubmit}
            style={styles.button}>
            <Text style={styles.buttonText}>Submit Review</Text>
            <MaterialIcons name="send" size={16} color="#FFF" style={styles.buttonIcon} />
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(30),
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(28),
    paddingVertical: verticalScale(20),
    marginTop: verticalScale(16),
    marginBottom: verticalScale(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 8,
  },
  avatarContainer: {
    width: scale(75),
    height: scale(75),
    borderRadius: scale(37.5),
    backgroundColor: COLORS.Amber,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(10),
    shadowColor: COLORS.Amber,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarInitials: {
    fontSize: moderateScale(26),
    fontFamily: Fonts.SemiBold,
    color: '#FFFFFF',
  },
  nameText: {
    fontFamily: Fonts.SemiBold,
    fontSize: moderateScale(18),
    color: '#1A2C3E',
    marginTop: verticalScale(4),
  },
  tripDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(6),
  },
  tripDetails: {
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(12),
    color: '#6C7A8E',
    marginHorizontal: scale(4),
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    marginHorizontal: scale(8),
  },
  promptContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  promptText: {
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(16),
    color: '#1A2C3E',
    textAlign: 'center',
  },
  emojiText: {
    fontSize: moderateScale(32),
    marginTop: verticalScale(6),
  },
  ratingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(24),
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 6,
  },
  ratingLabel: {
    textAlign: 'center',
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(14),
    color: '#4B5563',
    marginBottom: verticalScale(10),
  },
  starStyle: {
    marginHorizontal: scale(6),
    marginTop: verticalScale(6),
  },
  ratingValue: {
    textAlign: 'center',
    fontFamily: Fonts.SemiBold,
    fontSize: moderateScale(16),
    color: COLORS.Amber,
    marginTop: verticalScale(12),
  },
  reviewSection: {
    marginBottom: verticalScale(20),
  },
  reviewText: {
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(14),
    color: '#1A2C3E',
    marginBottom: verticalScale(6),
    marginLeft: scale(4),
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: moderateScale(18),
    paddingHorizontal: scale(14),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(10),
    height: scale(100),
    marginTop: verticalScale(4),
    textAlignVertical: 'top',
    fontSize: moderateScale(13),
    fontFamily: Fonts.Regular,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
  },
  button: {
    backgroundColor: COLORS.Amber,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(40),
    shadowColor: COLORS.Amber,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  buttonText: {
    fontFamily: Fonts.SemiBold,
    fontSize: moderateScale(16),
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: scale(8),
  },
});