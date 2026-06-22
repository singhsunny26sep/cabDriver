import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { COLORS } from '../../theme/Colors';
import { moderateScale, scale, verticalScale } from '../../utils/Scalling';
import { Fonts } from '../../theme/Fonts';
import axios from 'axios';
import { BASE_URL } from '../../api/BaseUrl';
import { CREATE_RATING } from '../../api/Endpoints';
import { loadUserLocalMethod } from '../../redux/slice/UserSlice';

const DriverRatingModal = ({visible, onClose, rideData, onSubmit}) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!rating || !rideData?._id) {return;}

    setIsSubmitting(true);
    try {
        const data = await loadUserLocalMethod();

      const response = await axios.post(
        `${BASE_URL}${CREATE_RATING.url}`,
        {
          bookingId: rideData._id,
          rating: rating,
          review: review,
          createdAt: new Date(),
        },
        {
          headers: {
            Authorization: data?.token,
          },
        },
      );

      if (response.data.success) {
        onSubmit?.();
        onClose();
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map(star => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.star,
                star <= rating && styles.selectedStar,
              ]}>
              {star <= rating ? '★' : '☆'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeIcon}>×</Text>
          </TouchableOpacity>

          <LottieView
            source={require('../../assets/lotties/thankss.json')}
            autoPlay
            loop={true}
            style={styles.lottie}
          />

          <Text style={styles.title}>Rate Your Passenger</Text>
          <Text style={styles.subtitle}>How was your ride experience?</Text>

          {renderStars()}

          <TextInput
            style={styles.reviewInput}
            placeholder="Write a review (optional)"
            placeholderTextColor={COLORS.gray}
            multiline
            numberOfLines={3}
            value={review}
            onChangeText={setReview}
          />

          <TouchableOpacity
            style={[styles.submitButton, !rating && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={!rating || isSubmitting}>
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Submitting...' : 'Submit Rating'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
    padding: moderateScale(20),
    paddingBottom: verticalScale(30),
    maxHeight: '80%',
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: moderateScale(5),
  },
  closeIcon: {
    fontSize: scale(30),
    color: COLORS.gray,
  },
  lottie: {
    width: moderateScale(150),
    height: moderateScale(150),
    alignSelf: 'center',
  },
  title: {
    fontSize: moderateScale(20),
    fontFamily: Fonts.Bold,
    textAlign: 'center',
    color: COLORS.black,
    marginTop: verticalScale(10),
  },
  subtitle: {
    fontSize: moderateScale(16),
    fontFamily: Fonts.Medium,
    textAlign: 'center',
    color: COLORS.black,
    marginBottom: verticalScale(15),
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: verticalScale(15),
  },
  star: {
    fontSize: scale(30),
    color: COLORS.gray3,
    marginHorizontal: moderateScale(5),
  },
  selectedStar: {
    color: COLORS.Amber,
  },
  reviewInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.gray2,
    borderRadius: moderateScale(8),
    padding: moderateScale(10),
    marginBottom: verticalScale(15),
    minHeight: verticalScale(80),
    textAlignVertical: 'top',
    fontFamily: Fonts.Regular,
    color: COLORS.black,
  },
  submitButton: {
    backgroundColor: COLORS.themePrimary,
    padding: verticalScale(12),
    borderRadius: moderateScale(8),
    width: '100%',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: COLORS.gray2,
  },
  submitButtonText: {
    color: COLORS.white,
    fontFamily: Fonts.Bold,
    fontSize: moderateScale(16),
  },
});

export default DriverRatingModal;
