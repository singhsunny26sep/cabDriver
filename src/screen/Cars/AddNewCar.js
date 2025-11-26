import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, Button} from 'react-native';
import {COLORS} from '../../theme/Colors';
import {verticalScale, scale, moderateScale} from '../../utils/Scalling';
import {Container} from '../../components/Container/Container';
import {AppBar} from '../../components/AppBar/AppBar';
import CustomInput from '../../components/CustomTextInput/CustomInput';
import {Fonts} from '../../theme/Fonts';
import ElementDropdown from '../../components/ElementDropdown/ElementDropdown';
import {carTypes, seatOptions, fuelTypes} from '../../utils/StaticDataBase';
import PrimaryButton from '../../components/Button/PrimaryButton';

export default function AddNewCar({navigation}) {
  const [carType, setCarType] = useState(null);
  const [seats, setSeats] = useState(null);
  const [fuelType, setFuelType] = useState(null);
  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
      <AppBar back title="Add New Car" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={styles.label}>Car Name</Text>
          <CustomInput
            textInputProps={{
              placeholder: 'Ex. Maruti Suzuki Swift (VXI)',
            }}
          />
          <Text style={styles.label}>Car Type</Text>
          <ElementDropdown
            data={carTypes.map(item => item.label)}
            value={carType}
            onChange={setCarType}
            placeholder="Select Type"
          />

          <Text style={styles.label}>No. of Seats</Text>
          <ElementDropdown
            data={seatOptions.map(item => item.label)}
            value={seats}
            onChange={setSeats}
            placeholder="Select No. of Seats"
          />

          <Text style={styles.label}>Car Number</Text>
          <CustomInput
            textInputProps={{
              placeholder: 'Enter Car Number',
            }}
          />

          <Text style={styles.label}>Car Fuel Type</Text>
          <ElementDropdown
            data={fuelTypes.map(item => item.label)}
            value={fuelType}
            onChange={setFuelType}
            placeholder="Select Fuel Type"
          />
          <Text style={styles.label}>Car Document</Text>
          <TouchableOpacity style={styles.documentButton} onPress={()=>navigation.navigate('CarDocument')} >
            <Text style={styles.documentButtonText}>Add Document Details</Text>
          </TouchableOpacity>
          <Text style={styles.label}>Car Image</Text>

          <TouchableOpacity style={[styles.documentButton]} onPress={()=>navigation.navigate('CarImage')}>
            <Text style={styles.documentButtonText}>Add Car Images</Text>
          </TouchableOpacity>
        </View>
        <PrimaryButton 
          buttonText='Add New Car' 
          style={styles.Button} 
        />
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: scale(15),
  },
  label: {
    marginTop: verticalScale(8),
    marginBottom: verticalScale(5),
    color: COLORS.black,
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(15),
  },
  documentButton: {
    height: verticalScale(50),
    borderColor: COLORS.gray,
    borderWidth: 0.5,
    borderRadius: moderateScale(8),
    paddingHorizontal: scale(15),
    justifyContent: 'center',
  },
  documentButtonText: {
    color: COLORS.gray,
    fontSize: moderateScale(14),
    fontFamily: Fonts.Medium,
  },
  addButton: {
    height: verticalScale(50),
    backgroundColor: COLORS.primary,
    borderRadius: moderateScale(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(15),
    marginBottom: verticalScale(15),
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: moderateScale(16),
    fontFamily: Fonts.Medium,
  },
  Button:{
    marginHorizontal:scale(15), marginBottom: scale(20),marginTop:scale(25)
  }
});
