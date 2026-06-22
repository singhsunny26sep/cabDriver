import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {AppBar} from '../components/AppBar/AppBar';
import {Container} from '../components/Container/Container';
import {COLORS} from '../theme/Colors';
import {Fonts} from '../theme/Fonts';
import {moderateScale, scale, verticalScale} from '../utils/Scalling';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icons from '../assets/Icons';
import images from '../assets/images';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import CustomModal from '../components/Modal/CustomModal';
import {
  clearUserData,
  loadUserLocalMethod,
  removeUserLocalMethod,
} from '../redux/slice/UserSlice';
import {useDispatch} from 'react-redux';
import {purgeStoredState} from 'redux-persist';
import {persistConfig} from '../redux/store/ReduxStore';

const {width} = Dimensions.get('window');

const MenuItem = ({icon, title, onPress, isLast = false}) => {
  return (
    <TouchableOpacity
      style={[styles.menuItem, isLast && styles.lastMenuItem]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.menuLeft}>
        <View style={styles.iconBg}>
          <Icon name={icon} size={scale(22)} color={COLORS.themePrimary} />
        </View>
        <Text style={styles.menuText}>{title}</Text>
      </View>
      <Icon name="chevron-right" size={scale(22)} color={COLORS.gray} />
    </TouchableOpacity>
  );
};

export default function Profile() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [profileImage, setProfileImage] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userLocalData, setUserLocalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadLocalData();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadLocalData = async () => {
    setLoading(true);
    const userData = await loadUserLocalMethod();
    console.log('local data at Profile - ', userData);
    setUserLocalData(userData);
    if (userData?.profileImgUrl) {
      setProfileImage(userData.profileImgUrl);
    }
    setLoading(false);
  };

  const openGallery = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
      includeBase64: false,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.assets && response.assets[0]) {
        const imageUri = response.assets[0].uri;
        setProfileImage(imageUri);
        // You can also upload to server here if needed
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

  if (loading) {
    return (
      <Container
        statusBarStyle={'dark-content'}
        statusBarBackgroundColor={COLORS.white}
        backgroundColor={COLORS.white}>
        <View style={styles.loaderBox}>
          <ActivityIndicator size={scale(50)} color={COLORS.themePrimary} />
        </View>
      </Container>
    );
  }

  return (
    <Container
      statusBarStyle={'light-content'}
      statusBarBackgroundColor={COLORS.themePrimary}
      backgroundColor={COLORS.background}>
      {/* Gradient Header */}
      <LinearGradient
        colors={[COLORS.themePrimary, COLORS.themePrimary + 'DD']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.headerGradient}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Icon name="arrow-back" size={scale(24)} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
          <View style={{width: scale(40)}} />
        </View>
      </LinearGradient>

      <Animated.ScrollView
        style={{flex: 1}}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <TouchableOpacity onPress={openGallery} activeOpacity={0.8}>
            <View style={styles.avatarWrapper}>
              <Image
                source={{
                  uri: profileImage
                    ? profileImage
                    : userLocalData?.profileImgUrl
                    ? userLocalData?.profileImgUrl
                    : 'https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png',
                }}
                style={styles.profileImage}
              />
              <View style={styles.editIconBadge}>
                <Icon name="edit" size={scale(14)} color={COLORS.white} />
              </View>
            </View>
          </TouchableOpacity>
          <Text style={styles.profileName}>{userLocalData?.name || 'Driver'}</Text>
          <Text style={styles.profileEmail}>
            {userLocalData?.email || 'driver@example.com'}
          </Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Rides</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>₹2,450</Text>
              <Text style={styles.statLabel}>Earned</Text>
            </View>
          </View>
        </View>

        {/* Menu Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account</Text>
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
          <MenuItem
            icon="directions-car"
            title="Your Rides"
            onPress={() => navigation.navigate('YourRides')}
          />
          <MenuItem
            icon="calendar-today"
            title="Pre-Booked Rides"
            onPress={() => navigation.navigate('Pre_BookedRide')}
          />
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Vehicles</Text>
          <MenuItem
            icon="directions-car"
            title="My Vehicles"
            onPress={() => navigation.navigate('SelectTransport')}
          />
          <MenuItem
            icon="add-circle"
            title="Add Vehicle"
            onPress={() => navigation.navigate('AddVehicle')}
          />
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Support & Legal</Text>
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
        </View>

        <View style={styles.menuSection}>
          <MenuItem
            icon="logout"
            title="Log out"
            onPress={handleLogout}
            isLast={true}
          />
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </Animated.ScrollView>

      <CustomModal
        visible={showLogoutModal}
        onClose={closeLogoutModal}
        title="Logout"
        message="Are you sure you want to log out?"
        cancelText="Cancel"
        confirmText="Yes, Logout"
        onConfirm={confirmLogout}
        confirmButtonColor={COLORS.themePrimary}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  loaderBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  headerGradient: {
    height: verticalScale(110),
    borderBottomLeftRadius: moderateScale(30),
    borderBottomRightRadius: moderateScale(30),
    paddingTop: Platform.OS === 'ios' ? verticalScale(50) : verticalScale(40),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(20),

  },
  backButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: Fonts.Bold,
    fontSize: moderateScale(20),
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingBottom: verticalScale(30),

  },
  profileCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: scale(20),
    marginTop: verticalScale(-40),
    borderRadius: moderateScale(24),
    paddingVertical: verticalScale(24),
    paddingHorizontal: scale(20),
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: COLORS.gray2 + '30',
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: verticalScale(12),
  },
  profileImage: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    borderWidth: 3,
    borderColor: COLORS.themePrimary,
    backgroundColor: COLORS.gray1,
  },
  editIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.themePrimary,
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  profileName: {
    fontFamily: Fonts.SemiBold,
    fontSize: moderateScale(20),
    color: COLORS.black,
    marginBottom: verticalScale(4),
  },
  profileEmail: {
    fontFamily: Fonts.Regular,
    fontSize: moderateScale(14),
    color: COLORS.gray,
    marginBottom: verticalScale(16),
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: verticalScale(8),
    paddingHorizontal: scale(10),
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontFamily: Fonts.Bold,
    fontSize: moderateScale(18),
    color: COLORS.black,
    marginBottom: verticalScale(2),
  },
  statLabel: {
    fontFamily: Fonts.Regular,
    fontSize: moderateScale(12),
    color: COLORS.gray,
  },
  statDivider: {
    width: 1,
    height: scale(30),
    backgroundColor: COLORS.gray2,
  },
  menuSection: {
    marginTop: verticalScale(20),
    marginHorizontal: scale(16),
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(20),
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: Fonts.SemiBold,
    fontSize: moderateScale(14),
    color: COLORS.gray,
    marginLeft: scale(16),
    marginTop: verticalScale(12),
    marginBottom: verticalScale(4),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray2 + '30',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBg: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    backgroundColor: COLORS.themePrimary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(14),
  },
  menuText: {
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(15),
    color: COLORS.black,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: verticalScale(20),
    marginBottom: verticalScale(10),
  },
  versionText: {
    fontFamily: Fonts.Regular,
    fontSize: moderateScale(12),
    color: COLORS.gray,
  },
});
