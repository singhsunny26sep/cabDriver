import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Container } from '../components/Container/Container';
import { COLORS } from '../theme/Colors';
import Icon from 'react-native-vector-icons/AntDesign';
import DateTimePicker from '@react-native-community/datetimepicker'; 
import { earningData } from '../utils/StaticDataBase';
import { moderateScale, scale, verticalScale } from '../utils/Scalling';
import { Fonts } from '../theme/Fonts';
import useRazorpayPayment from '../utils/useRazorpayPayment';
import CustomInputField from '../components/CustomTextInput/CustomInputField';

export default function Earning({}) {
  const { initiatePayment, isProcessing } = useRazorpayPayment();
  
  const [amount, setAmount] = useState('');

  const [showDatePicker, setShowDatePicker] = useState(false); 
  const [selectedDate, setSelectedDate] = useState(new Date()); 


  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios' ? true : false);
    setSelectedDate(currentDate);
  };

  const renderRideItem = ({ item }) => (
    <View style={styles.rideItem}>
      <View style={styles.profileSection}>
        <View style={styles.profileImage} />
        <View style={styles.rideDetails}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.tripInfo}>
            {item.miles} | {item.duration}
          </Text>
        </View>
      </View>
      <Text style={styles.earning}>₹{item.earning}</Text>
    </View>
  );
  const handleConfirmPayment = async () => {
    if (!amount) return;

    const result = await initiatePayment(
      {
        amount,
        description: 'Adding money to wallet',
        prefill: {
          email: 'user@example.com', // You can get this from user profile
          contact: '9876543210',    // You can get this from user profile
          name: 'User Name'         // You can get this from user profile
        }
      },
      () => {console.log(" success payment -> ", result)}, // onSuccess callback
      (error) => console.log('Payment failed:', error) // onFailure callback
    );

    // Alternative way to handle result
    if (result.success) {
      console.log("result handling ->", result)
    }
  };


  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <Text style={styles.headerTitle}>Today Earned</Text>
        <TouchableOpacity
          style={styles.calendarButton}
          onPress={() => setShowDatePicker(true)} // Show date picker when button is pressed
        >
          <Icon name="calendar" size={24} color="#2A2A2A" />
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

      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Hour</Text>
          <Text style={styles.summaryValue}>{earningData.totalHour} Hrs</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Driven</Text>
          <Text style={styles.summaryValue}>{earningData.totalMiles} kms</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Earning</Text>
          <Text style={styles.summaryValue}>₹ {earningData.totalEarning}</Text>
        </View>
      </View>
      <View style={{paddingHorizontal: scale(16)}}>
        <CustomInputField 
          label={"Add Amount"}
          value={amount}
          onChangeText={setAmount}
          keyboardType="default"
          secureTextEntry={false}
          placeholder={"Please Enter Amount want to add"}
        />
      </View>

      <TouchableOpacity 
        style={styles.CompleteRideicon} 
        onPress={()=>{handleConfirmPayment()}}>
        <Text style={styles.switchText}>Add Money</Text>
      </TouchableOpacity>
      <FlatList
        data={earningData.rides}
        renderItem={renderRideItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(5),
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  CompleteRideicon: {
    // position: 'absolute',
    // bottom: 10,
    backgroundColor: COLORS.themePrimary,
    padding: 10,
    borderRadius: 10,
    elevation: 5,
    zIndex: 10,
    width: '90%',
    alignSelf: 'center',
    justifyContent: "center",
    alignItems: 'center'
  },
  switchText: {
    fontFamily: Fonts.Medium,
    color: COLORS.white,
  },
  headerLeft: {
    width: scale(30),
  },
  headerTitle: {
    fontSize: scale(17),
    color: '#2A2A2A',
    flex: 1,
    textAlign: 'center',
    fontFamily: Fonts.Regular,
  },
  calendarButton: {
    padding: scale(3),
    width: scale(29),
  },
  summaryContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.grayish,
    margin: scale(16),
    borderRadius: moderateScale(10),
    padding: scale(16),
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  },
  summaryLabel: {
    color: COLORS.white,
    fontSize: moderateScale(15),
    marginBottom: scale(4),
    fontFamily: Fonts.Medium,
  },
  summaryValue: {
    color: COLORS.white,
    fontSize: moderateScale(16),
    fontFamily: Fonts.Regular,
  },
  divider: {
    width: 1,
    backgroundColor: COLORS.white,
    opacity: 0.3,
  },
  rideItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: scale(40),
    height: scale(40),
    borderRadius: moderateScale(30),
    backgroundColor: '#F0F0F0',
  },
  rideDetails: {
    marginLeft: scale(12),
  },
  name: {
    fontSize: moderateScale(16),
    fontFamily: Fonts.Medium,
    color: COLORS.black,
  },
  tripInfo: {
    fontSize: moderateScale(12),
    color: COLORS.gray,
    marginTop: scale(2),
    fontFamily: Fonts.Medium,
  },
  earning: {
    fontSize: moderateScale(16),
    fontFamily: Fonts.Medium,
    color: COLORS.black,
  },
});
