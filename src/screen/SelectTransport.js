import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import React, {useState, useRef} from 'react';
import {Container} from '../components/Container/Container';
import {COLORS} from '../theme/Colors';
import {AppBar} from '../components/AppBar/AppBar';
import {moderateScale, scale, verticalScale} from '../utils/Scalling';
import {useNavigation} from '@react-navigation/native';
import PrimaryButton from '../components/Button/PrimaryButton';
import {showToast} from '../components/CustomToast/CustomToast';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'; // for fallback icons

const {width, height} = Dimensions.get('window');

// Updated transport options with NEW icons and names
// Replace the icon source with your actual image paths
const transportOptions = [
  {
    id: 1,
    name: 'Cab',
    icon: require('../assets/images/cab.jpg'), // CHANGE THIS to your cab icon
    color: '#FF6B4A',
    bgGradient: ['#FF6B4A', '#FF8C42'],
  },
  {
    id: 2,
    name: 'Auto',
    icon: require('../assets/images/auto.png'), // CHANGE THIS to your auto icon
    color: '#4A90E2',
    bgGradient: ['#4A90E2', '#357ABD'],
  },
];

const SelectTransport = () => {
  const navigation = useNavigation();
  const [selectedTransport, setSelectedTransport] = useState(null);

  // Animation values for each card
  const animValues = useRef(transportOptions.map(() => new Animated.Value(1))).current;

  const handleTransportSelect = (transport, index) => {
    setSelectedTransport(transport.name);
    Animated.sequence([
      Animated.spring(animValues[index], {
        toValue: 0.94,
        friction: 4,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.spring(animValues[index], {
        toValue: 1,
        friction: 4,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleVehicleSelect = () => {
    if (!selectedTransport) {
      showToast('error', 'Selection Error', 'Please select a vehicle type first!');
      return;
    }
    navigation.navigate('TransportLists', {transportType: selectedTransport});
  };

  // Calculate card width for exactly 2 cards with gap
  const gap = scale(16);
  const cardWidth = (width - scale(32) - gap) / 2; // 32 = horizontal padding (16 left + 16 right)

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
      <LinearGradient
        colors={['#F8FAFF', '#FFFFFF', '#FFF5EC']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.gradientBg}>
        <AppBar title="Select Transport" back />

        <View style={styles.container}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>Choose Your Ride</Text>
            <Text style={styles.subtitle}>
              Pick the perfect vehicle for your trip
            </Text>
          </View>

          {/* Exactly 2 cards in one row */}
          <View style={styles.rowContainer}>
            {transportOptions.map((transport, index) => (
              <TouchableOpacity
                key={transport.id}
                onPress={() => handleTransportSelect(transport, index)}
                activeOpacity={0.85}
                style={{width: cardWidth}}>
                <Animated.View
                  style={[
                    styles.transportCard,
                    {
                      transform: [{scale: animValues[index]}],
                      borderColor: selectedTransport === transport.name ? transport.color : 'transparent',
                    },
                    selectedTransport === transport.name && styles.selectedCard,
                  ]}>
                  <LinearGradient
                    colors={
                      selectedTransport === transport.name
                        ? ['#FFFFFF', '#FFF8F0']
                        : ['#FFFFFF', '#F5F7FC']
                    }
                    style={styles.cardGradient}
                  />

                  {/* Icon with dynamic gradient background */}
                  <View style={[styles.iconCircle]}>
                    <LinearGradient
                      colors={
                        selectedTransport === transport.name
                          ? transport.bgGradient
                          : ['#ffffff', '#fafbfd']
                      }
                      style={styles.iconGradient}>
                      {/* Use your custom image or fallback to FontAwesome5 */}
                      {transport.icon ? (
                        <Image
                          source={transport.icon}
                          style={[
                            styles.transportImage,
                            selectedTransport === transport.name && {tintColor: '#FFFFFF'},
                          ]}
                          resizeMode="contain"
                        />
                      ) : (
                        <FontAwesome5
                          name={transport.name === 'Cab' ? 'taxi' : 'motorcycle'}
                          size={scale(40)}
                          color={selectedTransport === transport.name ? '#FFF' : '#6C7A8E'}
                          solid
                        />
                      )}
                    </LinearGradient>
                  </View>

                  <Text style={styles.transportName}>{transport.name}</Text>
                  <Text style={styles.transportDesc}>
                    {transport.name === 'Cab' ? 'Comfortable & AC' : 'Quick & Economical'}
                  </Text>

                  {selectedTransport === transport.name && (
                    <Animated.View style={styles.checkBadge}>
                      <Text style={styles.checkText}>✓</Text>
                    </Animated.View>
                  )}
                </Animated.View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Bottom CTA Button */}
          <View style={styles.buttonWrapper}>
            <LinearGradient
              colors={[COLORS.Amber, '#FF8C42']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.buttonGradient}>
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.floatingButton}
                onPress={handleVehicleSelect}>
                <Text style={styles.buttonText}>Continue</Text>
                <FontAwesome5 name="arrow-right" size={scale(16)} color="#FFF" style={styles.buttonIcon} />
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* Decorative elements */}
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />
        </View>
      </LinearGradient>
    </Container>
  );
};

export default SelectTransport;

const styles = StyleSheet.create({
  gradientBg: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(20),
  },
  headerSection: {
    marginTop: verticalScale(12),
    marginBottom: verticalScale(32),
    alignItems: 'center',
  },
  title: {
    fontSize: moderateScale(28),
    fontWeight: 'bold',
    color: '#1A2C3E',
    letterSpacing: -0.3,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'sans-serif-medium',
  },
  subtitle: {
    fontSize: moderateScale(14),
    color: '#6C7A8E',
    marginTop: verticalScale(6),
    textAlign: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(40),
  },
  transportCard: {
    borderRadius: scale(28),
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
    borderWidth: 2,
  },
  selectedCard: {
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 15,
  },
  cardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  iconCircle: {
    width: scale(90),
    height: scale(90),
    borderRadius: scale(45),
    alignSelf: 'center',
    marginTop: verticalScale(28),
    marginBottom: verticalScale(16),
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  iconGradient: {
    width: '100%',
    height: '100%',
    borderRadius: scale(45),
    justifyContent: 'center',
    alignItems: 'center',
  },
  transportImage: {
    width: scale(100),
    height: scale(100),
  },
  transportName: {
    textAlign: 'center',
    fontSize: moderateScale(20),
    fontWeight: '700',
    color: '#1A2C3E',
    letterSpacing: 0.5,
  },
  transportDesc: {
    textAlign: 'center',
    fontSize: moderateScale(12),
    color: '#8E9AAB',
    marginTop: verticalScale(4),
    marginBottom: verticalScale(24),
    paddingHorizontal: scale(12),
  },
  checkBadge: {
    position: 'absolute',
    top: scale(14),
    right: scale(14),
    width: scale(28),
    height: scale(28),
    borderRadius: scale(14),
    backgroundColor: COLORS.Amber,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.Amber,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  checkText: {
    color: '#FFF',
    fontSize: scale(16),
    fontWeight: 'bold',
  },
  buttonWrapper: {
    marginTop: 'auto',
    borderRadius: moderateScale(40),
    overflow: 'hidden',
    shadowColor: COLORS.Amber,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  buttonGradient: {
    borderRadius: moderateScale(40),
  },
  floatingButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(18),
    borderRadius: moderateScale(40),
  },
  buttonText: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.8,
  },
  buttonIcon: {
    marginLeft: scale(10),
  },
  decorCircle1: {
    position: 'absolute',
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: 'rgba(255,140,66,0.04)',
    bottom: -width * 0.2,
    right: -width * 0.3,
    zIndex: -1,
  },
  decorCircle2: {
    position: 'absolute',
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    backgroundColor: 'rgba(74,144,226,0.03)',
    top: -width * 0.1,
    left: -width * 0.2,
    zIndex: -1,
  },
});