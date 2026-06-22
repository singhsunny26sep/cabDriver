import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {AppBar} from '../components/AppBar/AppBar';
import PrimaryButton from '../components/Button/PrimaryButton';
import {moderateScale, scale} from '../utils/Scalling';
import {Container} from '../components/Container/Container';
import {COLORS} from '../theme/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import {Fonts} from '../theme/Fonts';
import {
  loadUserLocalMethod,
  saveUserLocalMethod,
  setUserData,
} from '../redux/slice/UserSlice';
import CustomInputField from '../components/CustomTextInput/CustomInputField';
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-crop-picker';
import {showToast} from '../components/CustomToast/CustomToast';
import {CLOUDINARY_CLOUD_NAME, CLOUDINARY_PRESET} from '../utils/contants';
import {
  isStringNullBlank,
  isValidLicense,
  isValidRCNumber,
} from '../utils/validations';
import {useDispatch} from 'react-redux';
import {SIGN_UP} from '../api/Endpoints';
import {BASE_URL} from '../api/BaseUrl';
import axios from 'axios';
import { getFCMToken } from '../utils/NotificationHelper';

const Welcome = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [userLocalData, setUserLocalData] = useState(null);
  const [licenseNum, setLicenseNum] = useState('');
  const [rcNumber, setRcNumber] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [pickerModalVisible, setPickerModalVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fcmToken, setFcmToken] = useState('');

  useEffect(() => {
    loadLocalData();
  }, []);

  const loadLocalData = async () => {
    const userData = await loadUserLocalMethod();
    const fcmToken = await getFCMToken();
    console.log('local data at WELCOME - ', userData);
    setFcmToken(fcmToken);
    setUserLocalData(userData);
  };

  const toggleImagePickerModal = () => {
    setPickerModalVisible(!pickerModalVisible);
  };

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
        showToast('error', 'Upload Error', 'Server Issue, try after sometime');
        return;
      }
      // console.log("Response for uploading--->",response);

      const data = await response.json();
      setImageUri(data.secure_url);
      // showToast('success', 'Success', 'Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      showToast('error', 'Image Upload Failed', 'Please try again');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    // navigation.navigate('BottomTab')
    if (isStringNullBlank(imageUri, 'Profile Image')) {return;}

    if (isStringNullBlank(licenseNum, 'Driving License Number')) {return;}
    // if (isValidLicense(licenseNum)) return;

    // if (isStringNullBlank(rcNumber, 'Vehicle Registration Number')) return;
    // if (isValidRCNumber(rcNumber)) return;

    await registerDriver();
  };

  const registerDriver = async () => {
    setLoading(true);
    const data = {
      name: userLocalData?.name,
      email: userLocalData?.email,
      gender: userLocalData?.gender,
      password: userLocalData?.password,
      contact: userLocalData?.contact,
      locality: userLocalData?.locality,
      state: userLocalData?.state,
      city: userLocalData?.city,
      country: userLocalData?.country,
      pincode: userLocalData?.pincode,
      drivingLicenseNo: licenseNum.trim(),
      // vehicleRegistrationNo: rcNumber.trim(),
      profileImgUrl: imageUri,
      lat: 0.333,
      long: 0.222,
      fcmToken: fcmToken,
      signupType: userLocalData?.signupType,
    };
    // console.log("data passing in api - ", data);
    try {
      const response = await axios({
        method: SIGN_UP.method,
        url: `${BASE_URL}${SIGN_UP.url}`,
        data,
      });
      setLoading(false);
      console.warn('Response for signup -> ', response);
      if (response.status === 200 && response?.data?.success) {
        dispatch(
          setUserData({
            ...userLocalData,
            ...response?.data?.data,
            token: response?.data?.token,
            isLoggedIn: true,
            isSignupCompleted: true,
          }),
        );
        await saveUserLocalMethod({
          ...userLocalData,
          ...response?.data?.data,
          token: response?.data?.token,
          isLoggedIn: true,
          isSignupCompleted: true,
        });
        navigation.reset({
          index: 0,
          routes: [{ name: 'AddVehicle' }],
        });
      }
      else {
        const errorMessage = response?.data?.msg;
        showToast('error', 'Signup Error', errorMessage);
      }
    } catch (error) {
      // console.log("error -> ", error)
      const errorMessage =
        error?.response?.data?.message ||
        'Network error. Please check your connection';
      showToast('error', 'Signup Error', errorMessage);
    }
  };

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
      <AppBar back />
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome! {userLocalData?.name}</Text>
        <Text style={styles.subText}>Complete your profile</Text>
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.imageContainer}>
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

          {!isUploading && (
            <TouchableOpacity
              onPress={toggleImagePickerModal}
              style={styles.pickerBtn}>
              <Icon2 name="camera" size={18} color={COLORS.themePrimary} />
            </TouchableOpacity>
          )}
        </View>

        <CustomInputField
          label={'Driving License Number'}
          value={licenseNum}
          onChangeText={setLicenseNum}
          placeholder={'Please Enter Your Driving License Number'}
        />
        {/* <CustomInputField
          label={'Vehicle Registration Number (RC)'}
          value={rcNumber}
          onChangeText={setRcNumber}
          placeholder={'Please Enter Your Vehicle Registration Number'}
        /> */}
      </View>

      <PrimaryButton
        buttonText="Continue"
        style={styles.primaryButton}
        onPress={handleSubmit}
        disabled={isUploading}
        loading={loading}
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
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: scale(10),
  },
  inputContainer: {
    marginHorizontal: scale(10),
  },
  imageContainer: {
    height: scale(80),
    width: scale(80),
    alignSelf: 'center',
    borderRadius: scale(100),
    position: 'relative',
    borderWidth: scale(2),
    borderColor: COLORS.themePrimary,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: scale(100),
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    borderRadius: scale(100),
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadingContainer: {
    width: '100%',
    height: '100%',
    borderRadius: scale(100),
    // backgroundColor: COLORS.greyLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerBtn: {
    position: 'absolute',
    bottom: scale(0),
    right: scale(0),
    height: scale(24),
    width: scale(24),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.paleYellow,
    borderRadius: scale(50),
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
  welcomeText: {
    fontSize: moderateScale(24),
    fontFamily: Fonts.Bold,
    marginBottom: scale(8),
  },
  subText: {
    fontSize: moderateScale(18),
    color: COLORS.gray,
    marginBottom: scale(10),
    fontFamily: Fonts.Medium,
  },
  primaryButton: {
    borderRadius: moderateScale(30),
    marginHorizontal: scale(10),
    marginTop: scale(20),
    bottom: scale(15),
  },
});

export default Welcome;
