import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import {scale} from '../../utils/Scalling';
import {COLORS} from '../../theme/Colors';
import socketServices from '../../utils/socketServices';
import { loadUserLocalMethod } from '../../redux/slice/UserSlice';

const rideTypes = ['Car', 'Bike', 'Taxi', 'Parcel'];

const rideData = {
  Car: [
    {
      id: '1',
      pickup: '08, Rajendar Nagar, Banswara Road, Indore, MP, 45001',
      drop: '112, Anup Nagar, Palaciya, Indore, MP, 45001',
      distance: '12 Km',
      time: '25 min',
      fare: '₹ 155',
      callerName: 'John Doe',
    },
    {
      id: '2',
      pickup: '15, MG Road, Indore, MP, 45001',
      drop: '22, Vijay Nagar, Indore, MP, 45001',
      distance: '8 Km',
      time: '15 min',
      fare: '₹ 120',
      callerName: 'Jane Smith',
    },
  ],
  Bike: [
    {
      id: '1',
      pickup: '10, Saket Nagar, Indore, MP, 45001',
      drop: '45, Scheme 54, Indore, MP, 45001',
      distance: '5 Km',
      time: '10 min',
      fare: '₹ 60',
      callerName: 'Mike Johnson',
    },
  ],
  Taxi: [],
  Parcel: [
    {
      id: '1',
      pickup: '33, Palasia, Indore, MP, 45001',
      drop: '78, Silicon City, Indore, MP, 45001',
      distance: '18 Km',
      time: '35 min',
      fare: '₹ 220',
      callerName: 'Amazon Delivery',
    },
    {
      id: '2',
      pickup: '12, Bhawarkua, Indore, MP, 45001',
      drop: '90, Rau, Indore, MP, 45001',
      distance: '15 Km',
      time: '30 min',
      fare: '₹ 200',
      callerName: 'Flipkart Delivery',
    },
    {
      id: '3',
      pickup: '25, Sudama Nagar, Indore, MP, 45001',
      drop: '67, MR 10, Indore, MP, 45001',
      distance: '7 Km',
      time: '12 min',
      fare: '₹ 90',
      callerName: 'Local Merchant',
    },
  ],
};

const NotificationPopup = ({visible, onAccept, onCancel}) => {
  const [activeTab, setActiveTab] = useState('Car');
  const [isLoading, setIsLoading] = useState(false);
  const [userLocalData, setUserLocalData] = useState(null);

  const flatListRef = useRef(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await loadLocalData();
      } catch (error) {
        console.error('Initialization error:', error);
      }
    };
    initializeApp();

    return () => {
      socketServices.disconnectSocket();
    };
  }, []);
  useEffect(() => {
    if (!userLocalData?._id || !userLocalData?.token) return;

    initializeSockets();

    return () => {
      socketServices.disconnectSocket();
    };
  }, [userLocalData]);

  const initializeSockets = async () => {
    try {
      // await socketServices.initializeSocket(userLocalData.token);
      
      console.log("object socketServices.isConnected()----------------------",socketServices.isConnected())
      // if(socketServices.isConnected()){
        console.log("object----------------------")

        socketServices.emit('car_booking', {});
        socketServices.on('car_booking_list', (car_booking_list) => {
          console.log(
            'car_booking_list =================>>>>',
            // JSON.stringify(car_booking_list),
            car_booking_list
          );
        });
      // }
    } catch (error) {
      console.error('Socket initialization failed:', error);
    }
  };
  const loadLocalData = async () => {
    try {
      setIsLoading(true);
      const userData = await loadUserLocalMethod();
      console.log('load user data in ride notifications :---------', userData);
      setUserLocalData(userData);
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderRideCard = ({item}) => (
    <View style={styles.rideCard}>
      <View style={styles.locationContainer}>
        <Text style={styles.pickupText}>Pickup Location:</Text>
        <Text style={styles.locationAddress}>{item.pickup}</Text>

        <Text style={styles.dropText}>Drop Location:</Text>
        <Text style={styles.locationAddress}>{item.drop}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Distance:</Text>
          <Text style={styles.detailValue}>{item.distance}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Estimate Time:</Text>
          <Text style={styles.detailValue}>{item.time}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Fare:</Text>
          <Text style={styles.detailValue}>{item.fare}</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => onAccept(item)}>
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rejectButton} onPress={onCancel}>
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleTabChange = type => {
    setActiveTab(type);
    flatListRef.current?.scrollToOffset({animated: true, offset: 0});
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onCancel}
      onBackButtonPress={onCancel}
      style={styles.modal}
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown">
      <View style={styles.container}>
        {/* Header with stats */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Rides</Text>
          {/* <Text style={styles.headerSubtitle}>Temporarily closed</Text> */}

          {/* <View style={styles.earningsContainer}>
            <Text style={styles.earningsLabel}>Today Earnings</Text>
            <Text style={styles.earningsValue}>$500</Text>
          </View> */}
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          {rideTypes.map(type => (
            <TouchableOpacity
              key={type}
              style={[styles.tab, activeTab === type && styles.activeTab]}
              onPress={() => handleTabChange(type)}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === type && styles.activeTabText,
                ]}>
                {type}
              </Text>
              {rideData[type]?.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{rideData[type].length}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Ride List */}
        <View style={styles.listContainer}>
          {rideData[activeTab]?.length > 0 ? (
            <FlatList
              ref={flatListRef}
              data={rideData[activeTab]}
              renderItem={renderRideCard}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              scrollEventThrottle={16}
              nestedScrollEnabled={true}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No {activeTab} rides available
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const {height} = Dimensions.get('window');
const modalHeight = height * 0.7;

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: modalHeight,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: scale(18),
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: scale(14),
    color: '#888',
    marginTop: 4,
  },
  earningsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  earningsLabel: {
    fontSize: scale(14),
    color: '#555',
  },
  earningsValue: {
    fontSize: scale(16),
    fontWeight: 'bold',
    color: COLORS.Amber,
  },
  rideStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  rideStat: {
    fontSize: scale(14),
    color: '#555',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.Amber,
  },
  tabText: {
    fontSize: scale(14),
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: COLORS.Amber,
    fontWeight: 'bold',
  },
  badge: {
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  listContainer: {
    height: modalHeight * 0.6, // Fixed height for smooth scrolling
  },
  listContent: {
    paddingBottom: 30,
  },
  rideCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    margin: 10,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  locationContainer: {
    marginBottom: 10,
  },
  pickupText: {
    fontSize: scale(14),
    fontWeight: 'bold',
    color: COLORS.Amber,
    marginBottom: 5,
  },
  dropText: {
    fontSize: scale(14),
    fontWeight: 'bold',
    color: COLORS.emeraldGreen,
    marginTop: 10,
    marginBottom: 5,
  },
  locationAddress: {
    fontSize: scale(13),
    color: '#555',
  },
  detailsContainer: {
    marginVertical: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: scale(13),
    color: '#555',
  },
  detailValue: {
    fontSize: scale(13),
    fontWeight: '500',
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  acceptButton: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  rejectButton: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: scale(14),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: scale(16),
    color: '#666',
  },
});

export default NotificationPopup;
