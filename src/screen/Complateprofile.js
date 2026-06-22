import React, {useEffect, useState} from 'react';
import {KeyboardAvoidingView, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Container} from '../components/Container/Container';
import {COLORS} from '../theme/Colors';
import {moderateScale, scale, verticalScale} from '../utils/Scalling';
import {AppBar} from '../components/AppBar/AppBar';
import {Fonts} from '../theme/Fonts';
import CustomInput from '../components/CustomTextInput/CustomInput';
import CustomCheckbox from '../components/CustomCheckbox/CustomCheckbox';
import PrimaryButton from '../components/Button/PrimaryButton';
import ElementDropdown from '../components/ElementDropdown/ElementDropdown';
import {GenderData, CityData} from '../utils/StaticDataBase';
import {loadUserLocalMethod, saveUserLocalMethod, selectUserData, setUserData, updateUserData} from '../redux/slice/UserSlice';
import CustomInputField from '../components/CustomTextInput/CustomInputField';
import {Country, State, City} from 'country-state-city';
import { showToast } from '../components/CustomToast/CustomToast';
import { isStringNullBlank, isValidNumeric } from '../utils/validations';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

export default function Complateprofile() {
  const dispatch = useDispatch();
  const userData = useSelector(selectUserData);
  const navigation = useNavigation();

  const [selectedGender, setSelectedGender] = useState(null);
  const [userLocalData, setUserLocalData] = useState(null);
  const [number, setNumber] = useState('');

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [country, setCountry] = useState(null);
  const [statee, setStatee] = useState(null);
  const [city, setCity] = useState(null);
  const [locality, setLocality] = useState(null);
  const [pincode, setPincode] = useState('');

  const [loading, setLoading] = useState(false);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    loadLocalData();
  }, []);

  const loadLocalData = async () => {
    setLoadingCountries(true);
    const userLData = await loadUserLocalMethod();
    console.log('user Local data from complete profile--- ', userLData);
    console.log('user Redux data from complete profile--- ', userData);
    const allCountries = Country.getAllCountries().map(country => ({
      value: country.isoCode,
      label: country.name,
      flag: country.flag,
    }));
    setCountries(allCountries);
    setUserLocalData(userLData);
    setLoadingCountries(false);
  };

  const handleCountrySelect = country => {
    setLoadingStates(true);
    setCountry(country);
    setStatee(null);
    setCity(null);
    const countryStates = State.getStatesOfCountry(country.value).map(
      state => ({
        value: state.isoCode,
        label: state.name,
      }),
    );
    setLoadingStates(false);

    setStates(countryStates);
    setCities([]);
  };
  const handleStateSelect = state => {
    setLoadingCities(true);
    setStatee(state);
    setCity(null);
    const stateCities = City.getCitiesOfState(
      country?.value,
      state?.value,
    ).map(city => ({
      value: city.name,
      label: city.name,
    }));
    setLoadingCities(false);
    setCities(stateCities);
  };
  const handleCitySelect = city => {
    setCity(city?.value);
  };

  const handleCompleteProfile = async () => {
    setLoading(true);
    try {
      // Validate all fields
      if (isStringNullBlank(number, 'Phone Number')) {return;}
      if (!isValidNumeric(number, 'Phone Number', true, 10)) {return;}

      if(!selectedGender){
        showToast('error', 'Validation Error', 'Please select gender!');
        return;
      }

      if(!country){
        showToast('error', 'Validation Error', 'Please select country!');
        return;
      }
      if(!statee){
        showToast('error', 'Validation Error', 'Please select state!');
        return;
      }
      if(!city){
        showToast('error', 'Validation Error', 'Please select city!');
        return;
      }

      if (isStringNullBlank(pincode, 'Pin-Code')) {return;}
      if (!isValidNumeric(pincode, 'Pin-Code', false, 6)) {return;}

      if (isStringNullBlank(locality, 'Locality')) {return;}

      dispatch(setUserData({
        ...userLocalData,
        contact: number?.trim(),
        country: country?.label,
        state: statee?.label,
        city: city,
        pincode: pincode?.trim(),
        locality: locality?.trim(),
        gender: selectedGender,
        isLoggedIn: false,
        isSignupCompleted: false,
      }));
      await saveUserLocalMethod({
        ...userLocalData,
        contact: number?.trim(),
        country: country?.label,
        state: statee?.label,
        city: city,
        pincode: pincode?.trim(),
        locality: locality?.trim(),
        gender: selectedGender,
        isLoggedIn: false,
        isSignupCompleted: false,
      });

      navigation.navigate('Welcome');

    } catch (error) {
      setLoading(true);
      showToast('error', 'Complete Profile Failed', error.message || 'Failed to updating details!');
    }
  };

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
      <ScrollView contentContainerStyle={{paddingBottom: scale(20)}} showsVerticalScrollIndicator={false}>
        <AppBar back />

        <View style={styles.headingContainer}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subTitle}>
            Dont worry, only you can see your personal{'\n'}
            data. No else will be able to see it.
          </Text>
        </View>

        <View style={styles.formContainer}>
          <CustomInputField
            label={'Contact Number'}
            value={number}
            onChangeText={setNumber}
            keyboardType="number-pad"
            secureTextEntry={false}
            placeholder={'Please Enter Your Contact Number'}
          />

          <Text style={[styles.label]}>Gender</Text>
          <ElementDropdown
            data={GenderData}
            value={selectedGender}
            onChange={item => {
              setSelectedGender(item.value);
            }}
            placeholder="Select Gender"
            style={styles.inputBox}
            valueField="value" // Explicitly tell it to use 'value' field
            labelField="name" // Explicitly tell it to use 'name' for display
          />

          <Text style={[styles.label, styles.marginTop]}>Country</Text>
          <ElementDropdown
            data={countries}
            value={country}
            onChange={handleCountrySelect}
            placeholder="Select Country"
            style={styles.inputBox}
            type="country"
            search
            searchPlaceholder="Search countries..."
            renderLeftIcon={() => (
              <Text style={{marginRight: 10, fontSize: 20}}>
                {country?.flag || '🌎'}
              </Text>
            )}
            emptyMessage="No countries available"
            loading={loadingCountries}
          />

          <Text style={[styles.label, styles.marginTop]}>State</Text>
          <ElementDropdown
            data={states}
            value={statee}
            onChange={handleStateSelect}
            placeholder="Select State"
            style={styles.inputBox}
            disabled={!country}
            loading={loadingStates}
            emptyMessage={country ? 'No states available' : 'Select country first'}
            search
            searchPlaceholder="Search states..."
          />

          <Text style={[styles.label, styles.marginTop]}>City</Text>
          <ElementDropdown
            data={cities}
            value={city}
            onChange={handleCitySelect}
            placeholder="Select City"
            style={styles.inputBox}
            disabled={!statee}
            // search
            // searchPlaceholder="Search cities..."
            loading={loadingCities}
            emptyMessage={'No cities available OR Select state first'}
          />

          <CustomInputField
            label={'Locality'}
            value={locality}
            onChangeText={setLocality}
            keyboardType="default"
            secureTextEntry={false}
            placeholder={'Please Enter Your Locality'}
            inputContainerStyle={{marginTop: scale(10)}}
          />

          <CustomInputField
            label={'Pin Code'}
            value={pincode}
            onChangeText={setPincode}
            keyboardType="number-pad"
            secureTextEntry={false}
            placeholder={'Please Enter Your Pin-Code'}
            inputContainerStyle={{marginTop: scale(10)}}
          />

          {/* <Text style={[styles.label, styles.marginTop]}>
            State
          </Text>
          <ElementDropdown
            data={CityData}
            value={selectedCity}
            onChange={setSelectedCity}
            placeholder="Select City"
            style={styles.inputBox}
          />

          <Text style={[styles.label, styles.marginTop]}>
            City
          </Text>
          <ElementDropdown
            data={CityData}
            value={selectedCity}
            onChange={setSelectedCity}
            placeholder="Select City"
            style={styles.inputBox}
          /> */}
        </View>

        {/* <View style={styles.termsContainer}>
          <CustomCheckbox
            checked={isChecked}
            onPress={() => setIsChecked(!isChecked)}
          />
          <Text style={styles.termsText}>
            By Accept, you agree to Company
            <Text style={styles.termsLink}>Terms & Conditions</Text>
          </Text>
        </View> */}

        <PrimaryButton
          buttonText="Continue"
          style={styles.primaryButton}
          onPress={handleCompleteProfile}
        />
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  headingContainer: {
    alignItems: 'center',
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
  title: {
    textAlign: 'center',
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(22),
    color: COLORS.black,
  },
  subTitle: {
    textAlign: 'center',
    fontFamily: Fonts.Regular,
    fontSize: moderateScale(14),
    color: COLORS.gray,
  },
  formContainer: {
    marginTop: scale(16),
    marginHorizontal: scale(15),
    flex:1,
  },
  label: {
    marginVertical: verticalScale(3),
    color: COLORS.black,
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(15),
  },
  marginTop: {
    marginTop: scale(10),
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: scale(15),
    marginTop: scale(15),
    gap: scale(10),
  },
  termsText: {
    fontFamily: Fonts.Regular,
    fontSize: moderateScale(14),
    color: COLORS.black,
  },
  termsLink: {
    textDecorationLine: 'underline',
    color: COLORS.Amber,
  },
  primaryButton: {
    borderRadius: moderateScale(30),
    marginHorizontal: scale(15),
    marginTop: scale(20),
  },
});
