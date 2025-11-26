import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {AppBar} from '../components/AppBar/AppBar';
import {Container} from '../components/Container/Container';
import {COLORS} from '../theme/Colors';
import {Fonts} from '../theme/Fonts';
import {moderateScale, scale} from '../utils/Scalling';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icons from '../assets/Icons';
import images from '../assets/images';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import CustomModal from '../components/Modal/CustomModal';
import {clearUserData, loadUserLocalMethod, removeUserLocalMethod} from '../redux/slice/UserSlice';
import {useDispatch} from 'react-redux';
import {purgeStoredState} from 'redux-persist';
import {persistConfig} from '../redux/store/ReduxStore';

const MenuItem = ({icon, title, onPress}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuLeft}>
      <Icon name={icon} size={24} color={COLORS.gray7} />
      <Text style={styles.menuText}>{title}</Text>
    </View>
    <Icon name="chevron-right" size={24} color={COLORS.gray7} />
  </TouchableOpacity>
);

export default function Profile() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [profileImage, setProfileImage] = useState(
    'https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png',
  );
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userLocalData, setUserLocalData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLocalData();
  }, []);

  const loadLocalData = async () => {
    setLoading(true);
    const userData = await loadUserLocalMethod();
    console.log('local data at AddVehicle - ', userData);
    setUserLocalData(userData);
    setLoading(false);
  };

  const openGallery = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.assets && response.assets[0]) {
        setProfileImage(response.assets[0].uri);
      }
    });
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const closeLogoutModal = () => {
    setShowLogoutModal(false);
  };

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    await removeUserLocalMethod();
    dispatch(clearUserData());
    await purgeStoredState(persistConfig);
    navigation.reset({
      index: 0,
      routes: [{name: 'SignIn'}],
    });
  };

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
      <AppBar title="Profile" back />
      {loading ? (
        <View style={styles.loaderBox}>
          <ActivityIndicator size={scale(40)} color={COLORS.Amber} />
        </View>
      ) : (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            <View style={styles.container}>
              <View style={[styles.profileHeader, {borderBottomWidth: 0}]}>
                <View style={styles.profileImageContainer}>
                  <Image
                    source={{
                      uri: userLocalData?.profileImgUrl
                        ? userLocalData?.profileImgUrl
                        : images.userImage,
                    }}
                    style={styles.profileImage}
                  />
                  {/* <TouchableOpacity style={styles.editIconContainer} onPress={openGallery}>
                <Icon name="edit" size={16} color={COLORS.white} />
              </TouchableOpacity> */}
                </View>
                <Text style={styles.profileName}>{userLocalData?.name}</Text>
              </View>
              <MenuItem
                icon="person"
                title="Your Profile"
                onPress={() => navigation.navigate('YourProfile')}
              />
              <MenuItem
                icon="notifications"
                title="Notification"
                onPress={() => navigation.navigate('Notification')}
              />
              <MenuItem icon="directions-car" title="Your Rides" />
              <MenuItem
                icon="calendar-today"
                title="Pre-Booked Rides"
                onPress={() => navigation.navigate('Pre_BookedRide')}
              />
              <MenuItem icon="settings" title="Settings" onPress={() => {}} />
              <MenuItem
                icon="directions-car"
                title="Vehicles"
                // onPress={() => navigation.navigate('Cars')}
                onPress={() => navigation.navigate('SelectTransport')}
              />
              {/* <MenuItem icon="add-circle" title="Add Cars" onPress={() => navigation.navigate('AddNewCar')} /> */}
              <MenuItem
                icon="add-circle"
                title="Add Vehicles"
                onPress={() => navigation.navigate('AddVehicle')}
              />
              <MenuItem
                icon="help"
                title="Help Center"
                onPress={() => navigation.navigate('HelpCenter')}
              />
              <MenuItem
                icon="privacy-tip"
                title="Privacy Policy"
                onPress={() => navigation.navigate('PrivacyPolicy')}
              />
              <MenuItem
                icon="attach-money"
                title="Collect Cash"
                onPress={() => navigation.navigate('CollectCash')}
              />
              <MenuItem
                icon="star"
                title="Rate Rider"
                onPress={() => navigation.navigate('RateRider')}
              />
              <MenuItem
                icon="lock"
                title="Password Manager"
                onPress={() => navigation.navigate('PasswordManager')}
              />
              <MenuItem icon="logout" title="Log out" onPress={handleLogout} />
            </View>
          </ScrollView>

          <CustomModal
            visible={showLogoutModal}
            onClose={closeLogoutModal}
            title="Logout"
            message="Are you sure you want to log out?"
            cancelText="Cancel"
            confirmText="Yes, Logout"
            onConfirm={confirmLogout}
            confirmButtonColor={COLORS.Amber}
          />
        </>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  loaderBox: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: scale(20),
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.lightGrey,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: scale(10),
    borderRadius: scale(40),
    borderWidth: 1,
    borderColor:  COLORS.Amber,
  },
  profileImage: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    backgroundColor: COLORS.Amber,
    borderColor:  COLORS.Amber,
  },
  editIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
    padding: scale(5),
    borderRadius: scale(12),
  },
  profileName: {
    fontSize: moderateScale(18),
    fontFamily: Fonts.Medium,
    color: COLORS.black,
    marginBottom: scale(4),
  },
  profileLabel: {
    fontSize: moderateScale(14),
    fontFamily: Fonts.Regular,
    color: COLORS.grey,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scale(15),
    paddingHorizontal: scale(20),
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.lightGrey,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: moderateScale(16),
    fontFamily: Fonts.Regular,
    color: COLORS.gray7,
    marginLeft: scale(15),
  },
});
