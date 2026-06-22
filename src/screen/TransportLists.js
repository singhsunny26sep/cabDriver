import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Container} from '../components/Container/Container';
import {COLORS} from '../theme/Colors';
import {AppBar} from '../components/AppBar/AppBar';
import {useNavigation} from '@react-navigation/native';
import {loadUserLocalMethod} from '../redux/slice/UserSlice';
import {GET_RIDER_VEHICLES, DELETE_VEHICLE, UPDATE_VEHICLE_STATUS} from '../api/Endpoints';
import {BASE_URL} from '../api/BaseUrl';
import axios from 'axios';
import {showToast} from '../components/CustomToast/CustomToast';
import {moderateScale, scale, verticalScale} from '../utils/Scalling';
import {Fonts} from '../theme/Fonts';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomModal from '../components/Modal/CustomModal';

const TransportLists = ({route}) => {
  const navigation = useNavigation();
  const {transportType} = route?.params || {};
  const formattedTransportType = transportType
    ? transportType.toLowerCase()
    : '';
  console.log('formattedTransportType', formattedTransportType);

  const [userLocalData, setUserLocalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vehicleDeleteId, setVehicleDeleteId] = useState(null);

  useEffect(() => {
    loadLocalData();
  }, []);
  useEffect(() => {
    if (userLocalData?.token) {
      getVehiclesData();
    }
  }, [userLocalData, formattedTransportType]);

  const loadLocalData = async () => {
    setLoading(true);
    const userData = await loadUserLocalMethod();
    console.log('local data at AddVehicle - ', userData);
    setUserLocalData(userData);
    setLoading(false);
  };

  const getVehiclesData = async () => {
    setLoading(true);
    try {
      const response = await axios({
        method: GET_RIDER_VEHICLES.method,
        url: `${BASE_URL}${GET_RIDER_VEHICLES.url}${formattedTransportType}`,
        headers: {Authorization: `${userLocalData?.token}`},
      });

      console.log('response for Vehicles ->>>>>>', response.data.data);
      setLoading(false);
      if (response.status === 200 && response.data.success) {
        const vehiclesData = response.data.data;
        setVehicles(vehiclesData);
      }
    } catch (error) {
      setLoading(false);
      setVehicles([]);
      console.log('error for getting rider"s vehicles -> ', error?.response);
      showToast('error', 'Data Error', error?.response?.data?.message);
    }
  };
  const confirmToggleStatus = (id, currentStatus) => {
  Alert.alert(
    'Confirm Status Change',
    `Are you sure you want to ${currentStatus === 'Active' ? 'deactivate' : 'activate'} this vehicle?`,
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => toggleActiveStatus(id, currentStatus),
      },
    ],
    { cancelable: false }
  );
};
  const toggleActiveStatus = async (id, currentStatus) => {
    setLoading(true);
    try {
       const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';

      const response = await axios({
        method: UPDATE_VEHICLE_STATUS.method,
        url: `${BASE_URL}${UPDATE_VEHICLE_STATUS.url}${id}`,
        data: {
          type: formattedTransportType,
          status: newStatus,
        },
        headers: {Authorization: `${userLocalData?.token}`},
      });

      console.log('response for Vehicles status updates ->>>>>>', response);
      setLoading(false);
      if (response.status === 200 && response.data.message) {
        getVehiclesData();
        // Update the specific vehicle's status in the vehicles array
        setVehicles(prevVehicles =>
          prevVehicles.map(vehicle =>
            vehicle._id === id
              ? {...vehicle, status: newStatus}
              : vehicle
          )
        );
      }
      else{
        showToast('error', 'Updation Error', 'Something went wrong!');
      }
    } catch (error) {
      setLoading(false);
      console.log('error for updating rider"s vehicles status -> ', error);
      console.log('error for updating rider"s vehicles status -> ', error?.response);
      showToast('error', 'Updation Error', error?.response?.data?.message);
    }
  };

  const renderItem = ({item}) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.imageContainer}>
            <Image
              source={{uri: item?.imgUrl}}
              style={styles.carImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.verificationBadge}>
              {/* <Text style={styles.verificationText}>{item?.status}</Text> */}
              <Text style={styles.verificationText}>
                {'Under Verification'}
              </Text>
            </View>

            <Text
              style={
                styles.carName
              }>{`${item?.manufacturer} ${item?.model}`}</Text>
            <Text style={styles.carType}>{item?.vehicleNo}</Text>

            <View style={styles.detailsRow}>
              <View style={styles.detail}>
                <Icon name="account" size={20} color={COLORS.grey} />
                <Text style={styles.detailText}>{item?.seatingCapacity}</Text>
              </View>
              <View style={styles.detail}>
                <Icon name="gas-station" size={20} color={COLORS.grey} />
                <Text style={styles.detailText}>{item?.fuelType}</Text>
              </View>
            </View>
            <Text style={styles.lastUpdated}>
              {/* Last Updated {item?.lastUpdated} */}
              Last Updated 8 April 2025
            </Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <View style={[styles.detailsRow, {flex:1}]}>
            <View style={styles.detail}>
              {/* <Icon name="check" size={20} color={COLORS.grey} /> */}
              <Text style={styles.carName}>{' Use as primary vehicle'}</Text>
            </View>
          </View>
          <Switch
            value={item.status === 'Active'}
            onValueChange={()=>{confirmToggleStatus(item._id, item.status);}}
            thumbColor={item.status === 'Active' ? '#DFE0E4' : '#ccc'}
            trackColor={{false: COLORS.red, true: COLORS.green}}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => {
              handleEditVehicle(item);
            }}
            style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleDelete(item._id);
            }}
            style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const handleEditVehicle = vehicleData => {
    navigation.navigate('EditVehicleDetails', {vehicleData: vehicleData});
  };
  const handleDelete = id => {
    console.log('id got - ', id);
    setVehicleDeleteId(id);
    setShowDeleteModal(true);
  };
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
  };
  const confirmDelete = async () => {
    setLoading(true);
    try {
      const response = await axios({
        url: `${BASE_URL}${DELETE_VEHICLE.url}${vehicleDeleteId}`,
        method: DELETE_VEHICLE.method,
        data: {type: formattedTransportType},
        headers: {
          Authorization: `${userLocalData?.token}`,
        },
      });
      setLoading(false);
      if (response.status === 200 && response?.data?.data) {
        navigation.navigate('BottomTab');
        showToast(
          'success',
          '🎉 Congratulations',
          'Vehicle Deleted successfully.',
        );
      } else {
        setLoading(false);
        const errorMessage = response?.data?.msg;
        showToast('error', 'Vehicle Deleting Error', errorMessage);
      }
    } catch (error) {
      setLoading(false);
      console.log('error api for Deleting vehicle ->', error);
      const errorMessage =
        error?.response?.data?.message ||
        'Network error. Please check your connection';
      showToast('error', 'Vehicle Deleting Error', errorMessage);
    }
  };

  const listEmptyComponent = () => {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        <Text style={styles.warning}>⚠️</Text>
        <Text style={styles.carName}>
          No {formattedTransportType} Found, Please add atleast one vehicle for{' '}
          {formattedTransportType}.
        </Text>
      </View>
    );
  };

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
      <AppBar title={'Your Vehicle'} back />
      {loading ? (
        <View style={styles.loaderBox}>
          <ActivityIndicator size={scale(40)} color={COLORS.Amber} />
        </View>
      ) : (
        <View style={{height: '92%'}}>
          <FlatList
            data={vehicles}
            renderItem={renderItem}
            keyExtractor={(item, index) => item?._id || index.toString()}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={listEmptyComponent}
          />

          <CustomModal
            visible={showDeleteModal}
            onClose={closeDeleteModal}
            title="Delete Vehicle"
            message="Are you sure you want to delete this vehicle?"
            cancelText="Cancel"
            confirmText="Yes, Delete"
            onConfirm={confirmDelete}
            confirmButtonColor={COLORS.alertColor}
          />
        </View>
      )}
    </Container>
  );
};

export default TransportLists;

const styles = StyleSheet.create({
  listContainer: {
    flexGrow: 1,
    padding: scale(16),
  },
  loaderBox: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  warning: {
    textAlign: 'center',
    fontSize: scale(100),
    marginBottom: scale(20),
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: scale(16),
    padding: scale(16),
    marginBottom: scale(16),
    elevation: scale(4),
    shadowColor: COLORS.black,
    shadowOffset: {
      width: scale(0),
      height: scale(4),
    },
    shadowOpacity: scale(0.3),
    shadowRadius: scale(4.65),
    borderWidth: scale(1),
    borderColor: COLORS.Amber,
  },
  cardContent: {
    flexDirection: 'row',
  },
  imageContainer: {
    width: scale(140),
    height: scale(140),
    marginRight: scale(12),
    borderRadius: moderateScale(12),
    overflow: 'hidden',
    backgroundColor: COLORS.blueGray,
  },
  carImage: {
    width: '100%',
    height: '100%',
    borderRadius: moderateScale(12),
  },
  detailsContainer: {
    flex: 1,
  },
  verificationBadge: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(4),
    alignSelf: 'flex-start',
    marginBottom: scale(8),
  },
  verificationText: {
    color: COLORS.grey,
    fontSize: scale(12),
    fontWeight: '500',
  },
  carName: {
    fontSize: scale(16),
    fontWeight: '700',
    marginBottom: scale(4),
    color: COLORS.black2,
  },
  carType: {
    fontSize: scale(14),
    color: COLORS.grey,
    marginBottom: scale(12),
    fontWeight: '500',
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: scale(12),
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: scale(16),
  },
  detailText: {
    marginLeft: scale(4),
    color: COLORS.grey,
  },
  lastUpdated: {
    fontSize: scale(12),
    color: COLORS.grey,
    marginBottom: scale(16),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: scale(12),
    marginTop: scale(5),
  },
  editButton: {
    flex: 1,
    paddingVertical: verticalScale(5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: moderateScale(20),
    borderWidth: scale(1),
    borderColor: COLORS.grey,
    backgroundColor: COLORS.whiteOpacity0,
    minWidth: '45%',
  },
  deleteButton: {
    flex: 1,
    paddingVertical: verticalScale(5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: moderateScale(20),
    backgroundColor: COLORS.gray4,
    minWidth: '45%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: scale(0),
      height: scale(1),
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  editButtonText: {
    color: COLORS.black,
    fontSize: moderateScale(14),
    fontFamily: Fonts.Medium,
    paddingTop: scale(3),
  },
  deleteButtonText: {
    color: COLORS.white,
    fontSize: moderateScale(14),
    fontFamily: Fonts.Medium,
    paddingTop: scale(3),
  },
});
