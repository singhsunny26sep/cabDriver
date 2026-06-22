import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Container} from '../components/Container/Container';
import {COLORS} from '../theme/Colors';
import {AppBar} from '../components/AppBar/AppBar';
import {moderateScale, scale, verticalScale} from '../utils/Scalling';
import CustomInputField from '../components/CustomTextInput/CustomInputField';
import ElementDropdown from '../components/ElementDropdown/ElementDropdown';
import {
  fuelTypes,
  luggageOptions,
  seatOptions,
  vehicleTransmissionTypeData,
  vehicleTypeData,
} from '../utils/StaticDataBase';
import {Fonts} from '../theme/Fonts';
import {
  loadUserLocalMethod,
  saveUserLocalMethod,
  setUserData,
} from '../redux/slice/UserSlice';
import Modal from 'react-native-modal';
import PrimaryButton from '../components/Button/PrimaryButton';
import Icons from '../assets/Icons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker';
import {showToast} from '../components/CustomToast/CustomToast';
import {CLOUDINARY_PRESET, CLOUDINARY_CLOUD_NAME} from '../utils/contants';
import {isStringNullBlank} from '../utils/validations';
import {ADD_VEHICLE} from '../api/Endpoints';
import {BASE_URL} from '../api/BaseUrl';
import axios from 'axios';
import {useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {getCurrentLocationOnce} from '../utils/helperFunctions';

const AddVehicle = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [vehicleType, setVehicleType] = useState('');
  const [vehicleBrand, setVehicleBrand] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleFuelType, setVehicleFuelType] = useState('');
  const [vehicleTransmissionType, setVehicleTransmissionType] = useState('');
  const [vehicleDescription, setVehicleDescription] = useState('');
  const [seatingCapacity, setSeatingCapacity] = useState('');
  const [luggageCapacity, setLuggageCapacity] = useState('');
  const [maxPorwer, setMaxPorwer] = useState('');
  const [fuelCostAverage, setFuelCostAverage] = useState('');
  const [maxSpeed, setMaxSpeed] = useState('');
  const [zeroToSixtySpeedTime, setZeroToSixtySpeedTime] = useState('');
  const [rcNumber, setRcNumber] = useState('');
  const [pucNumber, setPucNumber] = useState('');
  const [insuranceNumber, setInsuranceNumber] = useState('');
  const [permitNumber, setPermitNumber] = useState('');

  const [userLocalData, setUserLocalData] = useState(null);
  const [vehicleImages, setVehicleImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [pickerModalVisible, setPickerModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    loadLocalData();
  }, []);

  const loadLocalData = async () => {
    setLoading(true);
    const userData = await loadUserLocalMethod();
    const location = await getCurrentLocationOnce();
    console.log('local data at AddVehicle - ', userData);
    console.log('Got location:', location);
    setUserLocalData(userData);
    setLocation(location);
    setLoading(false);
  };

  const toggleImagePickerModal = () => {
    setPickerModalVisible(!pickerModalVisible);
  };

  const handleImageSelection = async (pickerMethod, multiple = false) => {
    try {
      const options = {
        width: 800,
        height: 800,
        cropping: true,
        mediaType: 'photo',
        includeBase64: true,
        multiple,
      };

      const selectedImages = await pickerMethod(options);

      if (multiple) {
        if (selectedImages && selectedImages.length > 0) {
          setPickerModalVisible(false);
          const urls = await uploadMultipleImagesToCloudinary(selectedImages);
          setVehicleImages(prev => [...prev, ...urls]);
        }
      } else {
        if (selectedImages.data) {
          setPickerModalVisible(false);
          const url = await uploadSingleImageToCloudinary(selectedImages.data);
          setVehicleImages(prev => [...prev, url]);
        }
      }
    } catch (error) {
      console.log('Image Error: ', error);
      showToast('error', 'Image Error', 'Failed to select image');
      setPickerModalVisible(false);
    }
  };

  const uploadSingleImageToCloudinary = async base64Image => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', `data:image/jpeg;base64,${base64Image}`);
      formData.append('upload_preset', CLOUDINARY_PRESET);

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
        throw new Error('Server Issue, try after sometime');
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Upload error:', error);
      showToast('error', 'Upload Failed', error.message || 'Please try again');
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const uploadMultipleImagesToCloudinary = async images => {
    setIsUploading(true);
    try {
      const uploadPromises = images.map(async image => {
        if (image.data) {
          return await uploadSingleImageToCloudinary(image.data);
        }
        return null;
      });
      const urls = await Promise.all(uploadPromises);
      return urls.filter(url => url !== null);
    } catch (error) {
      console.error('Multiple upload error:', error);
      showToast('error', 'Upload Failed', 'Some images failed to upload');
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  const renderUploadedImages = () => {
    if (vehicleImages.length === 0) return null;

    return (
      <View style={styles.imagesPreviewContainer}>
        <Text style={styles.sectionSubtitle}>Uploaded Images ({vehicleImages.length}/6)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.imageScrollContent}>
          {vehicleImages.map((uri, index) => (
            <View key={index} style={styles.imagePreviewWrapper}>
              <Image source={{uri}} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => {
                  const updatedImages = [...vehicleImages];
                  updatedImages.splice(index, 1);
                  setVehicleImages(updatedImages);
                }}>
                <Icon name="close" size={14} color="#FFF" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  const validateFields = () => {
    if (!vehicleType) {
      showToast('error', 'Validation Error', 'Please select Vehicle Type!');
      return false;
    }
    if (isStringNullBlank(vehicleBrand, "Vehicle's Brand")) return false;
    if (isStringNullBlank(vehicleModel, "Vehicle's Model")) return false;
    if (isStringNullBlank(vehicleNumber, "Vehicle's Number")) return false;
    if (!vehicleFuelType) {
      showToast('error', 'Validation Error', 'Please select Vehicle Fuel Type!');
      return false;
    }
    if (!vehicleTransmissionType) {
      showToast('error', 'Validation Error', 'Please select Vehicle Transmission Type!');
      return false;
    }
    if (isStringNullBlank(vehicleDescription, "Vehicle's Description")) return false;
    if (!seatingCapacity) {
      showToast('error', 'Validation Error', "Please select Vehicle's Seating Capacity!");
      return false;
    }
    if (!luggageCapacity) {
      showToast('error', 'Validation Error', "Please select Vehicle's Luggage Capacity!");
      return false;
    }
    if (isStringNullBlank(maxPorwer, "Vehicle's Max Power")) return false;
    if (isStringNullBlank(fuelCostAverage, "Vehicle's Fuel Cost Average")) return false;
    if (isStringNullBlank(maxSpeed, "Vehicle's Max Speed")) return false;
    if (isStringNullBlank(zeroToSixtySpeedTime, "Vehicle's zero-Sixty Speed Time")) return false;
    if (isStringNullBlank(rcNumber, "Vehicle's RC")) return false;
    if (isStringNullBlank(pucNumber, "Vehicle's PUC")) return false;
    if (isStringNullBlank(insuranceNumber, "Vehicle's Insurance Number")) return false;
    if (isStringNullBlank(permitNumber, "Vehicle's Permit Number")) return false;
    if (vehicleImages?.length < 3) {
      showToast('error', 'Validation Error', 'Please select at least 3 images of vehicle!');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;
    await addVehicle();
  };

  const addVehicle = async () => {
    setLoading(true);
    try {
      const response = await axios({
        url: `${BASE_URL}${ADD_VEHICLE.url}`,
        method: ADD_VEHICLE.method,
        data: {
          type: vehicleType,
          vehicleData: {
            manufacturer: vehicleBrand,
            model: vehicleModel,
            fuelType: vehicleFuelType,
            transmissionType: vehicleTransmissionType,
            description: vehicleDescription,
            imgUrl: vehicleImages[0],
            seatingCapacity: seatingCapacity,
            luggageCapacity: luggageCapacity,
            maxpower: maxPorwer,
            fuelCostAverage: fuelCostAverage,
            maxSpeed: maxSpeed,
            zeroToSixtySpeedTime: zeroToSixtySpeedTime,
            imagesList: vehicleImages,
            availability: 'Available',
            vehicleNo: vehicleNumber,
            location: {
              type: 'Point',
              coordinates: [26.71, 81.43],
            },
            puc: pucNumber,
            vehicleRegistrationNo: rcNumber,
            vehicleInsurance: insuranceNumber,
            vehiclePermit: permitNumber,
          },
        },
        headers: {
          Authorization: `${userLocalData?.token}`,
        },
      });
      console.warn('Response for Add Vehicle -.....> ', response);
      setLoading(false);
      if (response.status === 201 && response?.data?.data) {
        navigation.reset({
          index: 0,
          routes: [{name: 'BottomTab'}],
        });
        showToast('success', '🎉 Congratulations', 'Vehicle Added successfully.');
      } else {
        setLoading(false);
        const errorMessage = response?.data?.msg;
        showToast('error', 'Signup Error', errorMessage);
      }
    } catch (error) {
      setLoading(false);
      console.log('error api for add vehicle ->', error.response?.data);
      const errorMessage = error?.response?.data?.message || 'Network error. Please check your connection';
      showToast('error', 'Vehicle Adding Error', errorMessage);
    }
  };

  const renderSectionHeader = (title, icon) => (
    <View style={styles.sectionHeader}>
      <MaterialCommunityIcons name={icon} size={22} color={COLORS.Amber} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <Container
      statusBarStyle="dark-content"
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
      <AppBar back title="Add New Vehicle" />
      {loading ? (
        <View style={styles.loaderBox}>
          <ActivityIndicator size={scale(40)} color={COLORS.Amber} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
          {/* Basic Info Card */}
          <View style={styles.card}>
            {renderSectionHeader('Basic Information', 'car-info')}
            
            <ElementDropdown
              data={vehicleTypeData}
              value={vehicleType}
              onChange={item => setVehicleType(item.value)}
              placeholder="Select Vehicle Type"
              style={styles.dropdown}
              valueField="value"
              labelField="name"
            />

            <CustomInputField
              label="Vehicle Brand"
              value={vehicleBrand}
              onChangeText={setVehicleBrand}
              placeholder="e.g., Honda, Toyota"
              leftIcon={<FontAwesome5 name="car" size={16} color={COLORS.gray} />}
            />

            <CustomInputField
              label="Vehicle Number"
              value={vehicleNumber}
              onChangeText={setVehicleNumber}
              placeholder="AB12CD3456"
              leftIcon={<MaterialCommunityIcons name="identifier" size={16} color={COLORS.gray} />}
            />

            <CustomInputField
              label="Vehicle Model"
              value={vehicleModel}
              onChangeText={setVehicleModel}
              placeholder="e.g., Civic ZX MT"
              leftIcon={<MaterialCommunityIcons name="car-model" size={16} color={COLORS.gray} />}
            />

            <ElementDropdown
              data={fuelTypes}
              value={vehicleFuelType}
              onChange={item => setVehicleFuelType(item.value)}
              placeholder="Select Fuel Type"
              style={styles.dropdown}
              valueField="value"
              labelField="name"
            />

            <ElementDropdown
              data={vehicleTransmissionTypeData}
              value={vehicleTransmissionType}
              onChange={item => setVehicleTransmissionType(item.value)}
              placeholder="Select Transmission Type"
              style={styles.dropdown}
              valueField="value"
              labelField="name"
            />

            <CustomInputField
              label="Description"
              value={vehicleDescription}
              onChangeText={setVehicleDescription}
              placeholder="Brief description of your vehicle"
              multiline
              inputStyles={styles.textArea}
              leftIcon={<MaterialCommunityIcons name="text-short" size={16} color={COLORS.gray} />}
            />
          </View>

          {/* Capacity & Performance Card */}
          <View style={styles.card}>
            {renderSectionHeader('Capacity & Performance', 'speedometer')}

            <ElementDropdown
              data={seatOptions}
              value={seatingCapacity}
              onChange={item => setSeatingCapacity(item.value)}
              placeholder="Seating Capacity"
              style={styles.dropdown}
            />

            <ElementDropdown
              data={luggageOptions}
              value={luggageCapacity}
              onChange={item => setLuggageCapacity(item.value)}
              placeholder="Luggage Capacity"
              style={styles.dropdown}
            />

            <CustomInputField
              label="Max Power (BHP)"
              value={maxPorwer}
              onChangeText={setMaxPorwer}
              placeholder="e.g., 120 BHP"
              keyboardType="numeric"
              leftIcon={<MaterialCommunityIcons name="engine" size={16} color={COLORS.gray} />}
            />

            <CustomInputField
              label="Max Speed (km/h)"
              value={maxSpeed}
              onChangeText={setMaxSpeed}
              placeholder="e.g., 180 km/h"
              keyboardType="numeric"
              leftIcon={<MaterialCommunityIcons name="speedometer" size={16} color={COLORS.gray} />}
            />

            <CustomInputField
              label="Fuel Average (km/ltr)"
              value={fuelCostAverage}
              onChangeText={setFuelCostAverage}
              placeholder="e.g., 18 km/l"
              keyboardType="numeric"
              leftIcon={<MaterialCommunityIcons name="fuel" size={16} color={COLORS.gray} />}
            />

            <CustomInputField
              label="0-60 km/h (seconds)"
              value={zeroToSixtySpeedTime}
              onChangeText={setZeroToSixtySpeedTime}
              placeholder="e.g., 8.5 sec"
              keyboardType="numeric"
              leftIcon={<MaterialCommunityIcons name="timer" size={16} color={COLORS.gray} />}
            />
          </View>

          {/* Documents Card */}
          <View style={styles.card}>
            {renderSectionHeader('Documents', 'file-document')}

            <CustomInputField
              label="RC Number"
              value={rcNumber}
              onChangeText={setRcNumber}
              placeholder="Registration Certificate Number"
              leftIcon={<MaterialCommunityIcons name="card-bulleted" size={16} color={COLORS.gray} />}
            />

            <CustomInputField
              label="PUC Number"
              value={pucNumber}
              onChangeText={setPucNumber}
              placeholder="Pollution Under Control Number"
              leftIcon={<MaterialCommunityIcons name="leaf" size={16} color={COLORS.gray} />}
            />

            <CustomInputField
              label="Insurance Number"
              value={insuranceNumber}
              onChangeText={setInsuranceNumber}
              placeholder="Insurance Policy Number"
              leftIcon={<MaterialCommunityIcons name="shield-check" size={16} color={COLORS.gray} />}
            />

            <CustomInputField
              label="Permit Number"
              value={permitNumber}
              onChangeText={setPermitNumber}
              placeholder="Vehicle Permit Number"
              leftIcon={<MaterialCommunityIcons name="file-check" size={16} color={COLORS.gray} />}
            />
          </View>

          {/* Images Card */}
          <View style={styles.card}>
            {renderSectionHeader('Vehicle Images', 'image-multiple')}
            <Text style={styles.helperText}>Upload at least 3 clear images of your vehicle (front, back, sides)</Text>

            <TouchableOpacity
              disabled={isUploading}
              style={styles.uploadArea}
              onPress={toggleImagePickerModal}>
              <View style={styles.uploadContent}>
                {isUploading ? (
                  <ActivityIndicator size={scale(32)} color={COLORS.Amber} />
                ) : (
                  <>
                    <Icon name="cloud-upload" size={40} color={COLORS.Amber} />
                    <Text style={styles.uploadText}>Tap to upload images</Text>
                    <Text style={styles.uploadSubtext}>JPEG, PNG, JPG (max 6 images)</Text>
                  </>
                )}
              </View>
            </TouchableOpacity>

            {renderUploadedImages()}
          </View>

          {/* Submit Button */}
          <PrimaryButton
            buttonText="Continue"
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isUploading}
            loading={loading}
          />

          {/* Image Picker Modal */}
          <Modal
            isVisible={pickerModalVisible}
            onBackdropPress={() => setPickerModalVisible(false)}
            style={styles.modal}
            backdropOpacity={0.5}
            animationIn="slideInUp"
            animationOut="slideOutDown">
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleImageSelection(ImagePicker.openCamera)}>
                <Icon name="camera-alt" size={24} color={COLORS.Amber} />
                <Text style={styles.modalOptionText}>Open Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => handleImageSelection(ImagePicker.openPicker, true)}>
                <Icon name="photo-library" size={24} color={COLORS.Amber} />
                <Text style={styles.modalOptionText}>Open Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalOption, styles.cancelOption]}
                onPress={() => setPickerModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </ScrollView>
      )}
    </Container>
  );
};

export default AddVehicle;

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(30),
    paddingTop: verticalScale(8),
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(24),
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(16),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
    paddingBottom: verticalScale(10),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontFamily: Fonts.SemiBold,
    color: '#1A2C3E',
    marginLeft: scale(10),
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
  textArea: {
    height: scale(90),
    textAlignVertical: 'top',
    backgroundColor: '#F9FAFB',
    borderRadius: moderateScale(14),
    paddingHorizontal: scale(14),
    paddingTop: verticalScale(12),
    fontFamily: Fonts.Regular,
    fontSize: moderateScale(14),
    color: '#1F2937',
  },
  helperText: {
    fontSize: moderateScale(12),
    fontFamily: Fonts.Regular,
    color: '#6C7A8E',
    marginBottom: verticalScale(12),
  },
  uploadArea: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.Amber,
    borderRadius: moderateScale(20),
    paddingVertical: verticalScale(24),
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  uploadContent: {
    alignItems: 'center',
  },
  uploadText: {
    fontSize: moderateScale(15),
    fontFamily: Fonts.Medium,
    color: COLORS.Amber,
    marginTop: verticalScale(8),
  },
  uploadSubtext: {
    fontSize: moderateScale(11),
    fontFamily: Fonts.Regular,
    color: '#9CA3AF',
    marginTop: verticalScale(4),
  },
  imagesPreviewContainer: {
    marginTop: verticalScale(8),
  },
  sectionSubtitle: {
    fontSize: moderateScale(14),
    fontFamily: Fonts.Medium,
    color: '#374151',
    marginBottom: verticalScale(8),
  },
  imageScrollContent: {
    paddingRight: scale(8),
  },
  imagePreviewWrapper: {
    position: 'relative',
    marginRight: scale(12),
  },
  imagePreview: {
    width: scale(90),
    height: scale(90),
    borderRadius: moderateScale(16),
    borderWidth: 2,
    borderColor: COLORS.Amber,
  },
  removeImageButton: {
    position: 'absolute',
    top: scale(6),
    right: scale(6),
    backgroundColor: COLORS.red,
    borderRadius: scale(15),
    width: scale(24),
    height: scale(24),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFF',
  },
  submitButton: {
    borderRadius: moderateScale(40),
    marginTop: verticalScale(8),
    marginBottom: verticalScale(12),
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: COLORS.white,
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
    color: COLORS.red,
    textAlign: 'center',
    flex: 1,
  },
  loaderBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});