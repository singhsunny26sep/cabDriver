import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {loadUserLocalMethod} from '../redux/slice/UserSlice';
import {scale, screenHeight} from '../utils/Scalling';
import {COLORS} from '../theme/Colors';
import Modal from 'react-native-modal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Dropdown} from 'react-native-element-dropdown';
import {driverCancelRideReasons} from '../utils/StaticDataBase';
import {showToast} from '../components/CustomToast/CustomToast';
import axios from 'axios';
import {BASE_URL} from '../api/BaseUrl';
import {UPDATE_RIDE_STATUS, UPDATE_RIDE_BOOKING} from '../api/Endpoints';
import ElementDropdown from '../components/ElementDropdown/ElementDropdown';
import { Fonts } from '../theme/Fonts';
import socketServices from '../utils/socketServices';

const OngoingRideModals = ({
  visible,
  onClose,
  rideData,
  currentLocation,
  remainingDuration,
  remainingDistance,
  isRideStarted,
}) => {
  const navigation = useNavigation();
  const [showCancelAlert, setShowCancelAlert] = useState(false);
  const [selectedCancelReason, setSelectedCancelReason] = useState(null);
  const [userLocalData, setUserLocalData] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      const data = await loadUserLocalMethod();
      setUserLocalData(data);
    };
    loadUserData();
  }, []);

  const toggleCancelRide = () => {
    setShowCancelAlert(!showCancelAlert);
  };

  const cancelRide = async (reason) => {
    console.log('selectedCancelReason--->', selectedCancelReason);
    if (!reason) {
      showToast(
        'error',
        'Selection Failed',
        'Please select a cancellation reason',
      );
      return;
    }

    try {
      const response = await axios({
        url: `${BASE_URL}${UPDATE_RIDE_BOOKING.url}${rideData?._id}`,
        method: UPDATE_RIDE_BOOKING.method,
        headers: {
          Authorization: userLocalData?.token,
        },
        data: {
          status: 'cancelled',
          rejectMessage: reason,
          cancelledBy: 'customer',
        },
      });
      console.log('response  --->>>>', response);

      if (response.status === 200 && response.data) {
        // socketServices.emit(`${activeTab}_booking`, {});
        setShowCancelAlert(false);
        showToast('error', 'Ride Cancelled', 'Ride cancelled successfully');
        navigation.navigate('FindingJob');
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || 'Failed to cancel ride';
      showToast('error', 'Ride Cancelled', errorMessage);
    } finally {
      setShowCancelAlert(false);
    }
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modal}
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropTransitionInTiming={500}
      backdropTransitionOutTiming={500}>
      <View style={[styles.modalContent, {backgroundColor: COLORS?.white}]}>
        <View style={{padding: scale(15)}}>
{/* Customer basic details */}
          {rideData?.clientInfo && rideData.clientInfo.length > 0 && (
            <View style={[styles.row, {marginBottom: scale(10)}]}>
              <Image
                source={{uri: rideData.clientInfo[0]?.imgUrl}}
                style={styles.customerProfile}
              />
              <View style={styles.box}>
                <Text
                  style={[styles.text, {fontSize: scale(16), fontWeight: '600'}]}>
                  {rideData.clientInfo[0]?.name}
                </Text>
                <Text
                  style={[styles.text, {fontSize: scale(14), fontWeight: '500'}]}>
                  {rideData.clientInfo[0]?.email}
                </Text>
                <View style={[styles.row, {marginTop: 5}]}>
                  <MaterialIcons
                    name="star"
                    size={16}
                    color={COLORS?.themePrimary}
                  />
                  <Text
                    style={[
                      styles.text,
                      {
                        marginLeft: scale(5),
                        fontSize: scale(12),
                        fontWeight: '500',
                      },
                    ]}>
                    4.9 (25 reviews)
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Ride basic details */}
          <View
            style={[
              styles.row,
              {
                justifyContent: 'space-between',
                marginTop: scale(10),
              },
            ]}>
            <View>
              <Text
                style={[styles.text, {fontSize: scale(16), fontWeight: '500'}]}>
                Ride Details - Ongoing
              </Text>
              <View style={[styles.row, {marginTop: scale(5)}]}>
                <Text
                  style={[
                    styles.text,
                    {
                      marginLeft: scale(5),
                      fontSize: scale(12),
                      fontWeight: '400',
                    },
                  ]}>
📌 {remainingDistance != null ? remainingDistance.toFixed(2) : '--'} km •{' '}
                   {remainingDuration != null ? remainingDuration.toFixed(2) : '--'} min
                </Text>
              </View>
              <Text
                style={[
                  styles.text,
                  {
                    marginTop: 5,
                    fontSize: 12,
                    fontWeight: '400',
                  },
                ]}>
                {rideData?.rideCategory === 'car' ||
                rideData?.rideCategory === 'taxi'
                  ? '  🚗'
                  : '   🚲'}
                {'  '}
                {rideData?.rideCategory?.toUpperCase()} • {rideData?.type}
              </Text>
            </View>

            <View style={{alignItems: 'flex-end'}}>
              <Text style={[styles.text, {fontSize: 14, fontWeight: '500'}]}>
                Amount
              </Text>
              <Text style={[styles.text, {fontSize: 18, fontWeight: '600'}]}>
                ₹{rideData?.payableAmount?.toFixed(2) || '--'}
              </Text>
            </View>
          </View>

          {/* Pickup and Destination Address */}
          <View style={{marginTop: scale(15)}}>
            <View style={styles.row}>
              <MaterialIcons
                name="location-on"
                size={scale(16)}
                color={COLORS?.red}
              />
              <View style={{marginLeft: scale(10), flex: 1}}>
                <Text
                  style={[
                    styles.text,
                    {fontSize: scale(14), fontWeight: '500'},
                  ]}>
                  Pickup
                </Text>
                <Text
                  style={[
                    styles.text,
                    {fontSize: scale(12), fontWeight: '400'},
                  ]}>
                  {rideData?.pickupLocation?.address}
                </Text>
              </View>
            </View>

            <View style={[styles.row, {marginTop: scale(10)}]}>
              <MaterialIcons
                name="location-on"
                size={scale(16)}
                color={COLORS?.green}
              />
              <View style={{marginLeft: scale(10), flex: 1}}>
                <Text
                  style={[
                    styles.text,
                    {fontSize: scale(14), fontWeight: '500'},
                  ]}>
                  Destination
                </Text>
                <Text
                  style={[
                    styles.text,
                    {fontSize: scale(12), fontWeight: '400'},
                  ]}>
                  {rideData?.destinationLocation?.address}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          {/* <View
            style={[
              styles.row,
              {
                justifyContent: 'space-between',
                marginTop: scale(20),
              },
            ]}>
            <TouchableOpacity onPress={toggleCancelRide}>
              <View
                style={[
                  styles.row,
                  {
                    backgroundColor: COLORS?.white,
                    borderColor: COLORS?.red,
                    borderWidth: scale(1),
                    padding: scale(10),
                    borderRadius: scale(5),
                  },
                ]}>
                <MaterialIcons
                  name="cancel"
                  size={scale(20)}
                  color={COLORS?.red}
                />
                <Text
                  style={[
                    styles.text,
                    {
                      marginLeft: scale(5),
                      fontSize: scale(12),
                      fontWeight: '500',
                    },
                  ]}>
                  Cancel Ride
                </Text>
              </View>
            </TouchableOpacity>
          </View> */}

          {/* Cancel Ride Reason Dropdown */}
          {showCancelAlert ? (
            <View style={{marginTop: scale(15)}}>
              <ElementDropdown
                data={driverCancelRideReasons}
                value={selectedCancelReason}
                onChange={dropdownItem => {
                  setSelectedCancelReason(dropdownItem.name);
                  Alert.alert(
                    'Confirm Cancellation',
                    `Are you sure you want to cancel the ride? Reason:\n\n${dropdownItem?.name}`,
                    [
                      {
                        text: 'Cancel',
                        onPress: () => {
                          setSelectedCancelReason('');
                          toggleCancelRide();
                        },
                        style: 'cancel',
                      },
                      {
                        text: 'OK',
                        onPress: () => {
                          cancelRide(dropdownItem.name);
                        },
                      },
                    ],
                  );
                }}
                placeholder="Select Reason for Cancel Ride"
                style={styles.inputBox}
                valueField="value"
                labelField="name"
              />
            </View>
          ) : <View />}
        </View>
      </View>
    </Modal>
  );
};

export default OngoingRideModals;

const styles = StyleSheet.create({
  box: {flex: 1},
  modal: {
    justifyContent: 'flex-end',
    margin: scale(0),
  },
  modalContent: {
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: screenHeight * 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerProfile: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(30),
    marginRight: scale(10),
  },
  text: {
    color: COLORS?.black,
    fontFamily: 'Poppins',
  },
  dropdown: {
    height: scale(50),
    borderColor: COLORS?.gray,
    borderWidth: scale(1),
    borderRadius: scale(8),
    paddingHorizontal: scale(8),
  },
  placeholderStyle: {
    fontSize: scale(14),
    fontFamily: 'Poppins-Medium',
  },
  selectedTextStyle: {
    fontSize: scale(14),
    fontFamily: 'Poppins-Medium',
  },
  inputBox: {
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: scale(5),
    paddingHorizontal: scale(10),
    paddingVertical: scale(5),
    fontSize: scale(14),
    color: COLORS.black,
    fontFamily: Fonts.Regular,
  },
});
