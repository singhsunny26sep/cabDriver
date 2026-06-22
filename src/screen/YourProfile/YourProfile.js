import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {AppBar} from '../../components/AppBar/AppBar';
import {Container} from '../../components/Container/Container';
import {COLORS} from '../../theme/Colors';
import {Fonts} from '../../theme/Fonts';
import {moderateScale, scale, verticalScale} from '../../utils/Scalling';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Feather';
import CustomInputField from '../../components/CustomTextInput/CustomInputField';
import ElementDropdown from '../../components/ElementDropdown/ElementDropdown';
import PrimaryButton from '../../components/Button/PrimaryButton';
import {useNavigation} from '@react-navigation/native';
import {GenderData} from '../../utils/StaticDataBase';
import {
  loadUserLocalMethod,
  saveUserLocalMethod,
  updateUserData,
} from '../../redux/slice/UserSlice';
import axios from 'axios';
import {GET_PROFILE, UPDATE_PROFILE} from '../../api/Endpoints';
import {BASE_URL} from '../../api/BaseUrl';
import {
  isStringNullBlank,
  isValidNumeric,
} from '../../utils/validations';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from 'react-native-modal';
import {CLOUDINARY_PRESET, CLOUDINARY_CLOUD_NAME} from '../../utils/contants';
import {useDispatch} from 'react-redux';
import {showToast} from '../../components/CustomToast/CustomToast';

export default function YourProfile() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // State
  const [profileImage, setProfileImage] = useState(null);
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
  const [pincode, setPincode] = useState('');
  const [licenseNum, setLicenseNum] = useState('');
  const [isEditable, setIsEditable] = useState(false);
  const [pickerModalVisible, setPickerModalVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Helper functions
  const toggleEditable = () => setIsEditable(!isEditable);

  const headerRight = () => (
    <TouchableOpacity onPress={!isEditable ? toggleEditable : handleUpdateProfile} style={styles.headerButton}>
      <Icon2 name={isEditable ? 'check' : 'edit'} size={scale(20)} color={COLORS.Amber} />
    </TouchableOpacity>
  );

  // Load local user data
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
        const profile = response.data.data;
        setName(profile.name || '');
        setEmail(profile.email || '');
        setNumber(profile.contact?.toString() || '');
        setStatee(profile.state || '');
        setCity(profile.city || '');
        setLocality(profile.locality || '');
        setPincode(profile.pincode?.toString() || '');
        setLicenseNum(profile.drivingLicenseNo || '');
        setGender(profile.gender || '');
        setRiderId(profile.riderId || '');
        setProfileImage(profile.profileImgUrl || null);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error getting profile:', error);
      showToast('error', 'Error', 'Failed to load profile');
    }
  };

  // Image handling
  const handleImageSelection = async (pickerMethod) => {
    try {
      const image = await pickerMethod({
        width: 500,
        height: 500,
        cropping: true,
        mediaType: 'photo',
        includeBase64: true,
      });
      if (image.data) {
        setPickerModalVisible(false);
        await uploadImageToCloudinary(image.data);
      }
    } catch (error) {
      console.log('Image picker error:', error);
      showToast('error', 'Image Error', 'Failed to select image');
      setPickerModalVisible(false);
    }
  };

  const uploadImageToCloudinary = async (base64Image) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', `data:image/jpeg;base64,${base64Image}`);
    formData.append('upload_preset', CLOUDINARY_PRESET);
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData, headers: { 'Content-Type': 'multipart/form-data' } }
      );
      if (!response.ok) throw new Error('Upload failed');
      const data = await response.json();
      setProfileImage(data.secure_url);
      showToast('success', 'Success', 'Profile picture updated');
    } catch (error) {
      console.error('Upload error:', error);
      showToast('error', 'Upload Failed', 'Please try again');
    } finally {
      setIsUploading(false);
    }
  };

  const toggleImagePickerModal = () => setPickerModalVisible(!pickerModalVisible);

  // Update profile
  const handleUpdateProfile = async () => {
    if (isStringNullBlank(name, 'Name')) return;
    if (isStringNullBlank(number, 'Phone Number')) return;
    if (!isValidNumeric(number, 'Phone Number', true, 10)) return;
    if (isStringNullBlank(city, 'City')) return;
    if (isStringNullBlank(locality, 'Locality')) return;
    if (isStringNullBlank(pincode, 'Pin Code')) return;
    if (!isValidNumeric(pincode, 'Pin Code', false, 6)) return;

    setLoading(true);
    try {
      const changedFields = {};
      if (name !== userLocalData?.name) changedFields.name = name;
      if (number !== userLocalData?.contact) changedFields.contact = number;
      if (gender !== userLocalData?.gender) changedFields.gender = gender;
      if (statee !== userLocalData?.state) changedFields.state = statee;
      if (city !== userLocalData?.city) changedFields.city = city;
      if (locality !== userLocalData?.locality) changedFields.locality = locality;
      if (pincode?.toString() !== userLocalData?.pincode?.toString()) changedFields.pincode = pincode;
      if (licenseNum !== userLocalData?.drivingLicenseNo) changedFields.drivingLicenseNo = licenseNum;
      if (profileImage !== userLocalData?.profileImgUrl) changedFields.profileImgUrl = profileImage;

      if (Object.keys(changedFields).length === 0) {
        toggleEditable();
        setLoading(false);
        return;
      }

      const response = await axios({
        method: UPDATE_PROFILE.method,
        url: `${BASE_URL}${UPDATE_PROFILE.url}`,
        headers: { Authorization: `${userLocalData?.token}` },
        data: changedFields,
      });
      setLoading(false);
      if (response.status === 200 && response.data?.success) {
        const updatedUserData = { ...userLocalData, ...changedFields };
        dispatch(updateUserData(changedFields));
        await saveUserLocalMethod(updatedUserData);
        await getProfileData();
        toggleEditable();
        showToast('success', '✅ Profile Updated', 'Your profile has been updated');
      } else {
        showToast('error', 'Update Failed', response.data?.msg || 'Something went wrong');
      }
    } catch (error) {
      setLoading(false);
      const errorMessage = error?.response?.data?.message || 'Network error';
      showToast('error', 'Profile Update Error', errorMessage);
    }
  };

  return (
    <Container
      statusBarStyle="dark-content"
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
      <AppBar title="Your Profile" back right={headerRight()} />
      {loading ? (
        <View style={styles.loaderBox}>
          <ActivityIndicator size={scale(40)} color={COLORS.Amber} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
          {/* Profile Picture Card */}
          <View style={styles.profileCard}>
            <View style={styles.profileImageContainer}>
              {isUploading ? (
                <View style={styles.uploadingOverlay}>
                  <ActivityIndicator size="large" color={COLORS.Amber} />
                </View>
              ) : profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.placeholderImage}>
                  <Icon name="person" size={scale(50)} color={COLORS.gray} />
                </View>
              )}
              {isEditable && !isUploading && (
                <TouchableOpacity style={styles.editIconContainer} onPress={toggleImagePickerModal}>
                  <Icon name="edit" size={16} color={COLORS.white} />
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.profileName}>{name || 'Your Name'}</Text>
            <Text style={styles.profileLabel}>Rider ID: {riderId || 'Not assigned'}</Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Rider ID (non-editable) */}
            <CustomInputField
              label="Rider ID"
              value={riderId}
              editable={false}
              placeholder="Your Rider ID"
              inputStyles={styles.disabledInput}
            />

            {/* Name */}
            <CustomInputField
              label="Full Name"
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              editable={isEditable}
              inputStyles={isEditable ? styles.editableInput : styles.disabledInput}
            />

            {/* Email (non-editable) */}
            <CustomInputField
              label="Email Address"
              value={email}
              editable={false}
              placeholder="Your email"
              inputStyles={styles.disabledInput}
            />

            {/* Phone */}
            <CustomInputField
              label="Phone Number"
              value={number}
              onChangeText={setNumber}
              keyboardType="phone-pad"
              placeholder="10-digit mobile number"
              editable={isEditable}
              inputStyles={isEditable ? styles.editableInput : styles.disabledInput}
            />

            {/* Gender - dropdown when editable, text when not */}
            {isEditable ? (
              <>
                <Text style={styles.label}>Gender</Text>
                <ElementDropdown
                  data={GenderData}
                  value={gender}
                  onChange={item => setGender(item.value)}
                  placeholder="Select Gender"
                  style={styles.dropdown}
                  valueField="value"
                  labelField="name"
                />
              </>
            ) : (
              <CustomInputField
                label="Gender"
                value={gender}
                editable={false}
                placeholder="Not specified"
                inputStyles={styles.disabledInput}
              />
            )}

            {/* City */}
            <CustomInputField
              label="City"
              value={city}
              onChangeText={setCity}
              placeholder="Your city"
              editable={isEditable}
              inputStyles={isEditable ? styles.editableInput : styles.disabledInput}
            />

            {/* Locality */}
            <CustomInputField
              label="Locality / Area"
              value={locality}
              onChangeText={setLocality}
              placeholder="Street, colony, etc."
              editable={isEditable}
              inputStyles={isEditable ? styles.editableInput : styles.disabledInput}
            />

            {/* Pincode */}
            <CustomInputField
              label="Pincode"
              value={pincode}
              onChangeText={setPincode}
              keyboardType="number-pad"
              placeholder="6-digit pincode"
              editable={isEditable}
              inputStyles={isEditable ? styles.editableInput : styles.disabledInput}
            />

            {/* Driving License (optional) */}
            <CustomInputField
              label="Driving License Number (Optional)"
              value={licenseNum}
              onChangeText={setLicenseNum}
              placeholder="Enter license number"
              editable={isEditable}
              inputStyles={isEditable ? styles.editableInput : styles.disabledInput}
            />
          </View>

          {/* Update Button (only when editing) */}
          {isEditable && (
            <PrimaryButton
              buttonText="Save Changes"
              onPress={handleUpdateProfile}
              style={styles.updateButton}
              loading={loading}
            />
          )}

          {/* Image Picker Modal */}
          <Modal
            isVisible={pickerModalVisible}
            onBackdropPress={() => setPickerModalVisible(false)}
            style={styles.modal}
            backdropOpacity={0.5}
            animationIn="slideInUp"
            animationOut="slideOutDown">
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.modalOption} onPress={() => handleImageSelection(ImagePicker.openCamera)}>
                <Icon name="photo-camera" size={24} color={COLORS.Amber} />
                <Text style={styles.modalOptionText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalOption} onPress={() => handleImageSelection(ImagePicker.openPicker)}>
                <Icon name="photo-library" size={24} color={COLORS.Amber} />
                <Text style={styles.modalOptionText}>Choose from Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalOption, styles.cancelOption]} onPress={() => setPickerModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </ScrollView>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(30),
  },
  loaderBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(28),
    paddingVertical: verticalScale(24),
    marginTop: verticalScale(16),
    marginBottom: verticalScale(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 6,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: verticalScale(12),
  },
  profileImage: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    borderWidth: 3,
    borderColor: COLORS.Amber,
    backgroundColor: '#F3F4F6',
  },
  placeholderImage: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.Amber,
    borderStyle: 'dashed',
  },
  editIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.Amber,
    padding: scale(6),
    borderRadius: scale(20),
    borderWidth: 2,
    borderColor: '#FFF',
  },
  uploadingOverlay: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: moderateScale(20),
    fontFamily: Fonts.SemiBold,
    color: '#1A2C3E',
    marginTop: verticalScale(4),
  },
  profileLabel: {
    fontSize: moderateScale(13),
    fontFamily: Fonts.Regular,
    color: '#6C7A8E',
    marginTop: verticalScale(2),
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(24),
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 4,
  },
  label: {
    fontSize: moderateScale(14),
    fontFamily: Fonts.Medium,
    color: '#374151',
    marginBottom: verticalScale(6),
    marginTop: verticalScale(8),
  },
  dropdown: {
    backgroundColor: '#F9FAFB',
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: verticalScale(12),
    paddingHorizontal: scale(14),
    paddingVertical: Platform.OS === 'ios' ? verticalScale(12) : verticalScale(8),
  },
  editableInput: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    color: '#1F2937',
  },
  disabledInput: {
    backgroundColor: '#F9FAFB',
    borderColor: '#F0F2F5',
    color: '#9CA3AF',
  },
  updateButton: {
    borderRadius: moderateScale(40),
    marginBottom: verticalScale(20),
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: moderateScale(28),
    borderTopRightRadius: moderateScale(28),
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(20),
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(14),
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E7EB',
  },
  modalOptionText: {
    fontSize: moderateScale(16),
    fontFamily: Fonts.Medium,
    color: '#1F2937',
    marginLeft: scale(16),
  },
  cancelOption: {
    justifyContent: 'center',
    borderBottomWidth: 0,
    marginTop: verticalScale(8),
  },
  cancelText: {
    fontSize: moderateScale(16),
    fontFamily: Fonts.SemiBold,
    color: '#EF4444',
    textAlign: 'center',
    flex: 1,
  },
  headerButton: {
    padding: scale(8),
  },
});