import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Platform,
  TextInput,
  Dimensions,
} from 'react-native';
import { Container } from '../components/Container/Container';
import { COLORS } from '../theme/Colors';
import Icon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import { earningData } from '../utils/StaticDataBase';
import { moderateScale, scale, verticalScale } from '../utils/Scalling';
import { Fonts } from '../theme/Fonts';
import useRazorpayPayment from '../utils/useRazorpayPayment';
import CustomInputField from '../components/CustomTextInput/CustomInputField';
import { ScrollView } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

export default function Earning({}) {
  const { initiatePayment, isProcessing } = useRazorpayPayment();

  const [amount, setAmount] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || selectedDate;
    setShowDatePicker(Platform.OS === 'ios' ? true : false);
    setSelectedDate(currentDate);
  };

  const renderRideItem = ({ item }) => (
    <View style={styles.rideCard}>
      <View style={styles.profileSection}>
        <View style={styles.avatarPlaceholder}>
          <FontAwesome name="user-circle" size={scale(40)} color={COLORS.gray2} />
        </View>
        <View style={styles.rideDetails}>
          <Text style={styles.riderName}>{item.name}</Text>
          <View style={styles.tripMeta}>
            <Ionicons name="location-outline" size={scale(12)} color={COLORS.gray} />
            <Text style={styles.tripInfo}>
              {item.miles} km • {item.duration}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.earningBadge}>
        <Text style={styles.earningText}>₹{item.earning}</Text>
      </View>
    </View>
  );

  const handleConfirmPayment = async () => {
    if (!amount) {return;}

    const result = await initiatePayment(
      {
        amount,
        description: 'Adding money to wallet',
        prefill: {
          email: 'user@example.com', // Replace with actual user data
          contact: '9876543210',
          name: 'User Name',
        },
      },
      () => console.log('Payment success:', result),
      (error) => console.log('Payment failed:', error)
    );

    if (result.success) {
      console.log('Payment result handled:', result);
      // Optionally clear input or show success message
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
      {/* Modern Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Earnings</Text>
        <TouchableOpacity
          style={styles.calendarButton}
          onPress={() => setShowDatePicker(true)}
          activeOpacity={0.7}>
          <Ionicons name="calendar-outline" size={scale(24)} color={COLORS.themePrimary} />
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={selectedDate}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onDateChange}
        />
      )}

      {/* Selected Date Indicator */}
      <View style={styles.dateContainer}>
        <Ionicons name="today-outline" size={scale(16)} color={COLORS.gray} />
        <Text style={styles.selectedDateText}>{formatDate(selectedDate)}</Text>
      </View>

      {/* Summary Cards Row */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconBg}>
            <Ionicons name="timer-outline" size={scale(22)} color={COLORS.themePrimary} />
          </View>
          <Text style={styles.summaryValue}>{earningData.totalHour} Hrs</Text>
          <Text style={styles.summaryLabel}>Total Hours</Text>
        </View>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconBg}>
            <Ionicons name="car-outline" size={scale(22)} color={COLORS.themePrimary} />
          </View>
          <Text style={styles.summaryValue}>{earningData.totalMiles} km</Text>
          <Text style={styles.summaryLabel}>Total Driven</Text>
        </View>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconBg}>
            <Ionicons name="wallet-outline" size={scale(22)} color={COLORS.themePrimary} />
          </View>
          <Text style={styles.summaryValue}>₹{earningData.totalEarning}</Text>
          <Text style={styles.summaryLabel}>Total Earnings</Text>
        </View>
      </View>

      {/* Add Money Section */}
      <View style={styles.addMoneyContainer}>
        <Text style={styles.sectionTitle}>Add Money to Wallet</Text>
        <View style={styles.inputWrapper}>
          <Text style={styles.currencySymbol}>₹</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="Enter amount"
            placeholderTextColor={COLORS.gray}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>
        <TouchableOpacity
          style={[styles.addMoneyButton, isProcessing && styles.disabledButton]}
          onPress={handleConfirmPayment}
          disabled={isProcessing}
          activeOpacity={0.8}>
          <Text style={styles.addMoneyButtonText}>
            {isProcessing ? 'Processing...' : 'Add Money'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Rides List Header */}
      <View style={styles.listHeader}>
        <Text style={styles.sectionTitle}>Recent Rides</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={earningData.rides}
        renderItem={renderRideItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingTop: Platform.OS === 'ios' ? verticalScale(12) : verticalScale(16),
    paddingBottom: verticalScale(8),
    backgroundColor: COLORS.white,
  },
  headerTitle: {
    fontSize: moderateScale(24),
    fontFamily: Fonts.Bold,
    color: COLORS.black,
    letterSpacing: -0.3,
  },
  calendarButton: {
    padding: scale(8),
    backgroundColor: COLORS.gray1 + '20',
    borderRadius: moderateScale(30),
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: scale(20),
    marginTop: verticalScale(4),
    marginBottom: verticalScale(12),
  },
  selectedDateText: {
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(14),
    color: COLORS.gray,
    marginLeft: scale(6),
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(20),
  },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(16),
    paddingVertical: verticalScale(14),
    alignItems: 'center',
    marginHorizontal: scale(6),
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.gray2 + '40',
  },
  summaryIconBg: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: COLORS.themePrimary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  summaryValue: {
    fontFamily: Fonts.Bold,
    fontSize: moderateScale(18),
    color: COLORS.black,
    marginBottom: verticalScale(2),
  },
  summaryLabel: {
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(12),
    color: COLORS.gray,
  },
  addMoneyContainer: {
    backgroundColor: COLORS.gray1 + '10',
    marginHorizontal: scale(16),
    marginBottom: verticalScale(20),
    padding: scale(16),
    borderRadius: moderateScale(20),
    borderWidth: 1,
    borderColor: COLORS.gray2 + '30',
  },
  sectionTitle: {
    fontFamily: Fonts.SemiBold,
    fontSize: moderateScale(16),
    color: COLORS.black,
    marginBottom: verticalScale(12),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: COLORS.gray2,
    paddingHorizontal: scale(12),
    marginBottom: verticalScale(16),
  },
  currencySymbol: {
    fontFamily: Fonts.Bold,
    fontSize: moderateScale(20),
    color: COLORS.black,
    marginRight: scale(8),
  },
  amountInput: {
    flex: 1,
    fontFamily: Fonts.Regular,
    fontSize: moderateScale(16),
    paddingVertical: verticalScale(12),
    color: COLORS.black,
  },
  addMoneyButton: {
    backgroundColor: COLORS.themePrimary,
    borderRadius: moderateScale(30),
    paddingVertical: verticalScale(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMoneyButtonText: {
    fontFamily: Fonts.Bold,
    fontSize: moderateScale(16),
    color: COLORS.white,
  },
  disabledButton: {
    opacity: 0.6,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    marginBottom: verticalScale(8),
  },
  viewAllText: {
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(12),
    color: COLORS.themePrimary,
  },
  listContent: {
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(20),
  },
  rideCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(16),
    padding: scale(12),
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarPlaceholder: {
    marginRight: scale(12),
  },
  rideDetails: {
    flex: 1,
  },
  riderName: {
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(16),
    color: COLORS.black,
    marginBottom: verticalScale(2),
  },
  tripMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripInfo: {
    fontFamily: Fonts.Regular,
    fontSize: moderateScale(12),
    color: COLORS.gray,
    marginLeft: scale(4),
  },
  earningBadge: {
    backgroundColor: COLORS.success + '10',
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(20),
  },
  earningText: {
    fontFamily: Fonts.Bold,
    fontSize: moderateScale(16),
    color: COLORS.success,
  },
  separator: {
    height: verticalScale(10),
  },
});
