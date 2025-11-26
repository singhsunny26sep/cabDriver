import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {AppBar} from '../../components/AppBar/AppBar';
import {Container} from '../../components/Container/Container';
import {COLORS} from '../../theme/Colors';
import {Fonts} from '../../theme/Fonts';
import {moderateScale, scale, verticalScale} from '../../utils/Scalling';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomInput from '../../components/CustomTextInput/CustomInput';
import ElementDropdown from '../../components/ElementDropdown/ElementDropdown';
import PrimaryButton from '../../components/Button/PrimaryButton';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import {CityData, GenderData} from '../../utils/StaticDataBase';
import {
  loadUserLocalMethod,
  saveUserLocalMethod,
  setUserData,
  updateUserData,
} from '../../redux/slice/UserSlice';
import axios from 'axios';
import {GET_PROFILE, UPDATE_PROFILE} from '../../api/Endpoints';
import {BASE_URL} from '../../api/BaseUrl';
import Icon2 from 'react-native-vector-icons/Feather';
import CustomInputField from '../../components/CustomTextInput/CustomInputField';
import {
  isStringNullBlank,
  isValidEmail,
  isValidNumeric,
} from '../../utils/validations';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import {CLOUDINARY_PRESET, CLOUDINARY_CLOUD_NAME} from '../../utils/contants';
import {useDispatch} from 'react-redux';

export default function YourProfile({}) {
  const navigation = useNavigation('');
  const dispatch = useDispatch();
  const genderData = ['Male', 'Female', 'Other'];
  const [profileImage, setProfileImage] = useState(
    'https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png',
  );
  const [loading, setLoading] = useState(false);
  const [userLocalData, setUserLocalData] = useState(null);
  const [riderId, setRiderId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [gender, setGender] = useState('');
  const [statee, setStatee] = useState('');
  const [city, setCity] = useState('');
  const [locality, setLocality] = useState('');
  const [pincode, setPincode] = useState(null);
  const [licenseNum, setLicenseNum] = useState('');
  const [isEditable, setIsEditable] = useState(false);

  const [imageUri, setImageUri] = useState('');
  const [pickerModalVisible, setPickerModalVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // const openImagePicker = async () => {
  //   const options = {
  //     mediaType: 'photo',
  //     quality: 1,
  //   };

  //   try {
  //     const result = await launchImageLibrary(options);
  //     if (result.assets && result.assets[0].uri) {
  //       setProfileImage(result.assets[0].uri);
  //     }
  //   } catch (error) {
  //     console.log('ImagePicker Error: ', error);
  //   }
  // };

  const handleImageSelection = async pickerMethod => {
    try {
      const image = await pickerMethod({
        width: 300,
        height: 400,
        cropping: true,
        mediaType: 'photo',
        includeBase64: true,
      });

      if (image.data) {
        setPickerModalVisible(false);
        await uploadImagesToCloudinary(image.data);
      }
    } catch (error) {
      console.log('Image Error: ', error);
      showToast('error', 'Image Error', 'Failed to select image');
      setPickerModalVisible(false);
    }
  };

  const uploadImagesToCloudinary = async base64Image => {
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', `data:image/jpeg;base64,${base64Image}`);
    formData.append('upload_preset', CLOUDINARY_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (!response.ok) {
        showToast(
          'error',
          'Image Upload Error',
          'Server Issue, try after sometime',
        );
        return;
      }
      // console.log("Response for uploading--->",response);

      const data = await response.json();
      setImageUri(data.secure_url);
    } catch (error) {
      console.error('Upload error:', error);
      showToast('error', 'Image Upload Failed', 'Please try again');
    } finally {
      setIsUploading(false);
    }
  };

  const toggleImagePickerModal = () => {
    setPickerModalVisible(!pickerModalVisible);
  };

  const toggleEditable = () => setIsEditable(!isEditable);

  const headerRight = () => {
    return (
      <TouchableOpacity
        onPress={!isEditable ? toggleEditable : handleUpdateProfile}>
        <Icon2
          name={isEditable ? 'check' : 'edit'}
          size={scale(20)}
          color={COLORS.black}
        />
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    loadLocalData();
  }, []);

  useEffect(() => {
    if (userLocalData?.token) {
      getProfileData();
    }
  }, [userLocalData]);

  const loadLocalData = async () => {
    setLoading(true);
    const userData = await loadUserLocalMethod();
    setUserLocalData(userData);
    // console.log('local data at Your Profile - ', userData);
    setLoading(false);
  };

  const getProfileData = async () => {
    try {
      setLoading(true);
      const response = await axios({
        method: GET_PROFILE.method,
        url: `${BASE_URL}${GET_PROFILE.url}`,
        headers: {Authorization: `${userLocalData?.token}`},
      });

      if (response.status === 200 && response.data.success) {
        console.log('response for fetch profile ->>>>>>', response);
        const profile = response.data.data;
        setName(profile.name);
        setEmail(profile.email);
        setNumber(profile.contact);
        setStatee(profile.state);
        setCity(profile.city);
        setLocality(profile.locality);
        setPincode(profile.pincode?.toString());
        setLicenseNum(profile.drivingLicenseNo);
        setGender(profile.gender);
        setRiderId(profile.riderId);
        setImageUri(profile.profileImgUrl);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error for getting profile -> ', error);
    }
  };

  const handleUpdateProfile = async () => {
    if (isStringNullBlank(name, 'Name')) return;

    if (isStringNullBlank(number, 'Phone Number')) return;
    if (!isValidNumeric(number, 'Phone Number', true, 10)) return;

    // Gender has some values, so no need to validation
    // if (!Boolean(gender)) {
    //   showToast('error', 'Validation Error', 'Please select gender!');
    //   return;
    // }

    if (isStringNullBlank(city, 'City')) return;
    if (isStringNullBlank(locality, 'Locality')) return;
    if (isStringNullBlank(pincode, 'Pin-Code')) return;
    if (!isValidNumeric(pincode, 'Pin-Code', false, 6)) return;
    
    setLoading(true);

    try {
      //current form values
      const currentFormValues = {
        name,
        email,
        contact: number,
        gender,
        state: statee,
        city,
        locality,
        pincode: pincode?.toString(),
        drivingLicenseNo: licenseNum,
        profileImgUrl: imageUri,
      };

      //the original values from userLocalData
      const originalValues = {
        name: userLocalData?.name,
        email: userLocalData?.email,
        contact: userLocalData?.contact,
        gender: userLocalData?.gender,
        state: userLocalData?.state,
        city: userLocalData?.city,
        locality: userLocalData?.locality,
        pincode: userLocalData?.pincode?.toString(),
        drivingLicenseNo: userLocalData?.drivingLicenseNo,
        profileImgUrl: userLocalData?.profileImgUrl,
      };

      // Find changed fields
      const changedFields = {};
      Object.keys(currentFormValues).forEach(key => {
        if (currentFormValues[key] !== originalValues[key]) {
          changedFields[key] = currentFormValues[key];
        }
      });

      // If nothing changed, just toggle edit mode
      if (Object.keys(changedFields).length === 0) {
      console.log('changed values 0- ', changedFields);
        toggleEditable();
        setLoading(false);
        return;
      }
      console.log('changed values 1- ', changedFields);
      console.log('url - ', `${BASE_URL}${UPDATE_PROFILE.url}`);
      console.log('token - ', userLocalData?.token);

      const response = await axios({
        method: UPDATE_PROFILE.method,
        url: `${BASE_URL}${UPDATE_PROFILE.url}`,
        headers: {Authorization: `${userLocalData?.token}`},
        data: changedFields,
      });
      console.log('changed values 2- ', changedFields);
      console.warn('Response for update profile ->', response);
      setLoading(false);

      if (response.status === 200 && response?.data?.success) {
        const updatedUserData = {
          ...userLocalData,
          ...changedFields,
        };

        dispatch(updateUserData(changedFields));
        await saveUserLocalMethod(updatedUserData);
        await getProfileData();
        toggleEditable();
        showToast(
          'success',
          '✅Profile Updated',
          'Your profile has been updated successfully',
        );
      } else {
        const errorMessage = response?.data?.msg;
        showToast('error', 'Profile Update Error', errorMessage);
      }
    } catch (error) {
      // console.log("error -> ", error)
      const errorMessage =
        error?.response?.data?.message ||
        'Network error. Please check your connection';
      showToast('error', 'Profile Update Error', errorMessage);
    }
  };

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
      <AppBar title="Your Profile" back right={headerRight()} />
      {loading ? (
        <View style={styles.loaderBox}>
          <ActivityIndicator size={scale(40)} color={COLORS.Amber} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[styles.profileHeader, {borderBottomWidth: 0}]}>
            <View style={styles.profileImageContainer}>
              {isUploading ? (
                <View style={styles.uploadingContainer}>
                  <ActivityIndicator size="large" color={COLORS.themePrimary} />
                </View>
              ) : imageUri ? (
                <Image source={{uri: imageUri}} style={styles.profileImage} />
              ) : (
                <View style={styles.placeholderImage}>
                  <Icon name="person" size={scale(40)} color={COLORS.grey} />
                </View>
              )}
              {isEditable && !isUploading && (
                <TouchableOpacity
                  style={styles.editIconContainer}
                  onPress={toggleImagePickerModal}>
                  <Icon name="edit" size={16} color={COLORS.white} />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={styles.container}>
            <CustomInputField
              label={'Rider Id'}
              value={riderId}
              onChangeText={setRiderId}
              keyboardType="default"
              secureTextEntry={false}
              placeholder={'Your Rider ID'}
              editable={false}
              inputStyles={{
                color: COLORS.gray4,
                borderColor: COLORS.gray3,
              }}
            />
            <CustomInputField
              label={'Name'}
              value={name}
              onChangeText={setName}
              keyboardType="default"
              secureTextEntry={false}
              placeholder={'Please Enter Your Name'}
              editable={isEditable}
              inputStyles={{
                color: isEditable ? COLORS.black : COLORS.gray4,
                borderColor: isEditable ? COLORS.borderColor : COLORS.gray3,
              }}
            />
            <CustomInputField
              label={'Email'}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              secureTextEntry={false}
              placeholder={'Please Enter Your Email'}
              editable={false}
              inputStyles={{
                color: COLORS.gray4,
                borderColor: COLORS.gray3,
              }}
            />
            <CustomInputField
              label={'Contact Number'}
              value={number}
              onChangeText={setNumber}
              keyboardType="number-pad"
              secureTextEntry={false}
              editable={isEditable}
              placeholder={'Please Enter Your Contact Number'}
              inputStyles={{
                color: isEditable ? COLORS.black : COLORS.gray4,
                borderColor: isEditable ? COLORS.borderColor : COLORS.gray3,
              }}
            />

            {!isEditable ? (
              <CustomInputField
                label={'Gender'}
                value={gender}
                onChangeText={setGender}
                keyboardType="default"
                secureTextEntry={false}
                editable={isEditable}
                placeholder={'Please Select Your Gender'}
                inputStyles={{
                  color: isEditable ? COLORS.black : COLORS.gray4,
                  borderColor: isEditable ? COLORS.borderColor : COLORS.gray3,
                }}
              />
            ) : (
              <>
                <Text style={[styles.label]}>Gender</Text>
                <ElementDropdown
                  data={GenderData}
                  value={gender}
                  onChange={item => {
                    setGender(item.value);
                  }}
                  placeholder="Select Gender"
                  style={styles.inputBox}
                  valueField="value"
                  labelField="name"
                />
              </>
            )}

            <CustomInputField
              label={'City'}
              value={city}
              onChangeText={setCity}
              keyboardType="default"
              secureTextEntry={false}
              editable={isEditable}
              placeholder={'Please Enter Your City'}
              inputStyles={{
                color: isEditable ? COLORS.black : COLORS.gray4,
                borderColor: isEditable ? COLORS.borderColor : COLORS.gray3,
              }}
            />
            <CustomInputField
              label={'Locality'}
              value={locality}
              onChangeText={setLocality}
              keyboardType="default"
              secureTextEntry={false}
              editable={isEditable}
              placeholder={'Please Enter Your Locality'}
              inputStyles={{
                color: isEditable ? COLORS.black : COLORS.gray4,
                borderColor: isEditable ? COLORS.borderColor : COLORS.gray3,
              }}
            />
            <CustomInputField
              label={'Pin Code'}
              value={pincode}
              onChangeText={setPincode}
              keyboardType="number-pad"
              secureTextEntry={false}
              placeholder={'Please Enter Your Pin-Code'}
              editable={isEditable}
              inputStyles={{
                color: isEditable ? COLORS.black : COLORS.gray4,
                borderColor: isEditable ? COLORS.borderColor : COLORS.gray3,
              }}
            />

            <Modal
              isVisible={pickerModalVisible}
              onBackdropPress={() => setPickerModalVisible(false)}
              style={styles.modal}
              backdropOpacity={0.5}
              animationIn="slideInUp"
              statusBarTranslucent
              animationOut="slideOutDown">
              <View style={styles.modalContent}>
                <PrimaryButton
                  buttonText="Open Camera"
                  style={styles.modalButton}
                  onPress={() => handleImageSelection(ImagePicker.openCamera)}
                  disabled={isUploading}
                />
                <PrimaryButton
                  buttonText="Open Gallery"
                  style={styles.modalButton}
                  onPress={() => handleImageSelection(ImagePicker.openPicker)}
                  disabled={isUploading}
                />
                <PrimaryButton
                  buttonText="Cancel"
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setPickerModalVisible(false)}
                />
              </View>
            </Modal>
          </View>
          {/* {isEditable && (
          <PrimaryButton
            onPress={handleUpdateProfile}
            buttonText="Update"
            style={styles.primaryButton}
          />
        )} */}
        </ScrollView>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: 'center',
    paddingVertical: scale(10),
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.lightGrey,
  },
  loaderBox: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadingContainer: {
    width: scale(80),
    height: scale(80),
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderImage: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(100),
    backgroundColor: 'transparent',
    justifyContent: 'center',
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
    height: scale(42),
    marginBottom: scale(10),
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    padding: scale(20),
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
  },
  modalButton: {
    marginBottom: scale(10),
    borderRadius: moderateScale(30),
  },
  cancelButton: {
    backgroundColor: COLORS.gray3,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: scale(10),
    borderRadius: scale(40),
    borderWidth: 1,
    borderColor: COLORS.Amber,
  },
  profileImage: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    backgroundColor: COLORS.lightGrey,
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
  container: {
    marginHorizontal: scale(15),
  },
  documentButton: {
    height: moderateScale(50),
    borderWidth: 0.5,
    borderRadius: moderateScale(10),
    borderColor: '#B8B8B8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(15),
  },
  documentButtonText: {
    fontSize: moderateScale(14),
    color: COLORS.gray3,
    fontFamily: Fonts.Medium,
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
  primaryButton: {
    borderRadius: moderateScale(30),
    marginHorizontal: scale(15),
    marginTop: scale(20),
    bottom: scale(15),
  },
});
