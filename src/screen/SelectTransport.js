import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {Container} from '../components/Container/Container';
import {COLORS} from '../theme/Colors';
import {AppBar} from '../components/AppBar/AppBar';
import {moderateScale, scale, screenWidth} from '../utils/Scalling';
import images from '../assets/Icons';
import {useNavigation} from '@react-navigation/native';
import PrimaryButton from '../components/Button/PrimaryButton';
import { showToast } from '../components/CustomToast/CustomToast';
import { transportOptions } from '../utils/StaticDataBase';

const SelectTransport = () => {
  const navigation = useNavigation();
  const [selectedTransport, setSelectedTransport] = useState(null);

  const handleTransportSelect = transport => {
    setSelectedTransport(transport);
  };

  const handleVehicleSelect = () => {
    if(!selectedTransport){
      showToast('error', 'Selection Error', 'Please select vehicle type first!');
      return;
    }
    navigation.navigate('TransportLists', {transportType: selectedTransport});
  }

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
      <AppBar title="Select transport" back />
      <View style={styles.container}>
        <View style={styles.gridContainer}>
        {transportOptions.map((transport) => (
            <TouchableOpacity
              key={transport.id}
              style={[
                styles.transportCard,
                {width: screenWidth * 0.42},
                selectedTransport === transport.name && styles.selectedCard,
              ]}
              onPress={() => handleTransportSelect(transport.name)}
              activeOpacity={0.7}>
              <View style={styles.imageContainer}>
                <Image 
                  source={transport.icon} 
                  style={styles.transportImage}
                  resizeMode='contain' 
                />
              </View>
              <Text style={styles.transportName}>{transport.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <PrimaryButton
        buttonText="See Vehicles"
        style={styles.primaryButton}
        onPress={handleVehicleSelect}
      />
      </View>
    </Container>
  );
};

export default SelectTransport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(16),
  },
  gridContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  primaryButton: {
    borderRadius: moderateScale(30),
    marginTop: scale(20),
  },
  transportCard: {
    aspectRatio: 1,
    backgroundColor: COLORS.blueGray,
    borderRadius: scale(12),
    padding: scale(12),
    marginBottom: scale(16),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: COLORS.Amber, // Add your primary color here
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  transportImage: {
    width: '80%',
    height: '80%',
    alignSelf: 'center',
  },
  transportName: {
    textAlign: 'center',
    fontSize: scale(16),
    fontWeight: '600',
    marginTop: scale(8),
    color: COLORS.textPrimary, // Add your text color
  },
});
