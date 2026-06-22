import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Container} from '../components/Container/Container';
import {COLORS} from '../theme/Colors';
import {AppBar} from '../components/AppBar/AppBar';
import {moderateScale, scale, verticalScale} from '../utils/Scalling';
import {loadUserLocalMethod} from '../redux/slice/UserSlice';
import {getCurrentLocationOnce} from '../utils/helperFunctions';
import ElementDropdown from '../components/ElementDropdown/ElementDropdown';
import Modal from 'react-native-modal';
import {
  fuelTypes,
  luggageOptions,
  seatOptions,
  vehicleTransmissionTypeData,
  vehicleTypeData,
} from '../utils/StaticDataBase';
import {Fonts} from '../theme/Fonts';
import CustomInputField from '../components/CustomTextInput/CustomInputField';
import Icons from '../assets/Icons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-crop-picker';
import PrimaryButton from '../components/Button/PrimaryButton';
import {CLOUDINARY_PRESET, CLOUDINARY_CLOUD_NAME} from '../utils/contants';
import {showToast} from '../components/CustomToast/CustomToast';
import {isStringNullBlank} from '../utils/validations';
import {BASE_URL} from '../api/BaseUrl';
import {UPDATE_VEHICLE} from '../api/Endpoints';
import axios from 'axios';
const EditVehicleDetails = () => {
  const navigation = useNavigation();
  const routes = useRoute();
  const {vehicleData} = routes?.params || {};
  console.log('Vehicle data got - ', vehicleData);

  const [vehicleType, setVehicleType] = useState(''); // type [car | bike | taxi | cycle]
  const [vehicleBrand, setVehicleBrand] = useState(''); // brand
  const [vehicleModel, setVehicleModel] = useState(''); // model
  const [vehicleNumber, setVehicleNumber] = useState(''); // vehicle numbe
  const [vehicleFuelType, setVehicleFuelType] = useState(''); // fuel type
  const [vehicleTransmissionType, setVehicleTransmissionType] = useState(''); // transmission type
  const [vehicleDescription, setVehicleDescription] = useState(''); // description
  const [seatingCapacity, setSeatingCapacity] = useState(''); // seating capacity
  const [luggageCapacity, setLuggageCapacity] = useState(''); // luggage capacity
  const [maxPorwer, setMaxPorwer] = useState(''); // maximum power
  const [fuelCostAverage, setFuelCostAverage] = useState(''); // fuel cost average
  const [maxSpeed, setMaxSpeed] = useState(''); // max speed
  const [zeroToSixtySpeedTime, setZeroToSixtySpeedTime] = useState(''); // zero to sixty speed time

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

    // Initialize values for vehicle
    setVehicleType(vehicleData?.type?.toLowerCase());
    setVehicleBrand(vehicleData?.manufacturer);
    setVehicleModel(vehicleData?.model);
    setVehicleNumber(vehicleData?.vehicleNo);
    setVehicleFuelType(vehicleData?.fuelType?.toLowerCase());
    setVehicleTransmissionType(vehicleData?.transmissionType);
    setVehicleDescription(vehicleData?.description);
    setSeatingCapacity(vehicleData?.seatingCapacity?.toString());
    setLuggageCapacity(vehicleData?.luggageCapacity?.toString());
    setMaxPorwer(vehicleData?.maxpower);
    setFuelCostAverage(vehicleData?.fuelCostAverage);
    setMaxSpeed(vehicleData?.maxSpeed);
    setZeroToSixtySpeedTime(vehicleData?.zeroToSixtySpeedTime);
    setRcNumber(vehicleData?.vehicleRegistrationNo);
    setPucNumber(vehicleData?.puc);
    setInsuranceNumber(vehicleData?.vehicleInsurance);
    setPermitNumber(vehicleData?.vehiclePermit);
    setVehicleImages(vehicleData?.imagesList);

    setLoading(false);
  };
  const toggleImagePickerModal = () => {
    setPickerModalVisible(!pickerModalVisible);
  };
  const renderUploadedImages = () => {
    if (vehicleImages.length === 0) {return null;}

    return (
      <View style={styles.imagesPreviewContainer}>
        <Text style={styles.uploadedImagesLabel}>Uploaded Images:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
                <Icon name="close" size={16} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    );
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
        // Handle multiple images
        if (selectedImages && selectedImages.length > 0) {
          setPickerModalVisible(false);
          const urls = await uploadMultipleImagesToCloudinary(selectedImages);
          setVehicleImages(prev => [...prev, ...urls]);
        }
      } else {
        // Handle single image
        if (selectedImages.data) {
          setPickerModalVisible(false);
          const url = await uploadSingleImageToCloudinary(selectedImages.data);
          // For single image uploads, you might want to handle differently
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
      return urls.filter(url => url !== null); // Filter out any failed uploads
    } catch (error) {
      console.error('Multiple upload error:', error);
      showToast('error', 'Upload Failed', 'Some images failed to upload');
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  const validateFields = () => {
    if (!vehicleType) {
      showToast('error', 'Validation Error', 'Please select Vehicle Type!');
      return false;
    }
    if (isStringNullBlank(vehicleBrand, "Vehicle's Brand")) {return false;}
    if (isStringNullBlank(vehicleModel, "Vehicle's Model")) {return false;}
    if (isStringNullBlank(vehicleNumber, "Vehicle's Number")) {return false;}
    if (!vehicleFuelType) {
      showToast(
        'error',
        'Validation Error',
        'Please select Vehicle Fuel Type!',
      );
      return false;
    }
    if (!vehicleTransmissionType) {
      showToast(
        'error',
        'Validation Error',
        'Please select Vehicle Transmission Type!',
      );
      return false;
    }
    if (isStringNullBlank(vehicleDescription, "Vehicle's Description"))
      {return false;}
    if (!seatingCapacity) {
      showToast(
        'error',
        'Validation Error',
        "Please select Vehicle's Seating Capacity!",
      );
      return false;
    }
    if (!luggageCapacity) {
      showToast(
        'error',
        'Validation Error',
        "Please select Vehicle's Luggage Capacity!",
      );
      return false;
    }
    if (isStringNullBlank(maxPorwer, "Vehicle's Max Power")) {return false;}
    if (isStringNullBlank(fuelCostAverage, "Vehicle's Fuel Cost Average"))
      {return false;}
    if (isStringNullBlank(maxSpeed, "Vehicle's Max Speed")) {return false;}
    if (
      isStringNullBlank(zeroToSixtySpeedTime, "Vehicle's zero-Sixty Speed Time")
    )
      {return false;}

    if (isStringNullBlank(rcNumber, "Vehicle's RC")) {return false;}
    if (isStringNullBlank(pucNumber, "Vehicle's PUC")) {return false;}
    if (isStringNullBlank(insuranceNumber, "Vehicle's Insurance Number"))
      {return false;}
    if (isStringNullBlank(permitNumber, "Vehicle's Permit Number"))
      {return false;}

    if (vehicleImages?.length < 3) {
      showToast(
        'error',
        'Validation Error',
        'Please select atleast 3 images of vehicle!',
      );
      return false;
    }

    return true;
  };
  const handleUpdate = async () => {
    if (!validateFields()) {return;}
    await updateVehicle();
  };
  const updateVehicle = async () => {
    setLoading(true);
    try {
      const response = await axios({
        url: `${BASE_URL}${UPDATE_VEHICLE.url}${vehicleData?._id}`,
        method: UPDATE_VEHICLE.method,
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
              coordinates: [location?.latitude, location?.longitude],
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
      if (response.status === 200 && response?.data?.data) {
        navigation.navigate('BottomTab');
        showToast(
          'success',
          '🎉 Congratulations',
          'Vehicle Updated successfully.',
        );
      } else {
        setLoading(false);
        const errorMessage = response?.data?.msg;
        showToast('error', 'Vehicle Updating Error', errorMessage);
      }
    } catch (error) {
      setLoading(false);
      console.log('error api for updating vehicle ->', error);
      const errorMessage =
        error?.response?.data?.message ||
        'Network error. Please check your connection';
      showToast('error', 'Vehicle Updating Error', errorMessage);
    }
  };

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
      <AppBar back title="Edit Vehicle Details" />
      {loading ? (
        <View style={styles.loaderBox}>
          <ActivityIndicator size={scale(40)} color={COLORS.Amber} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <Text style={styles.uploadText}>Vehicle's Details</Text>
            <Text style={[styles.label]}>Vehicle Type</Text>
            <ElementDropdown
              data={vehicleTypeData}
              value={vehicleType}
              onChange={item => {
                setVehicleType(item.value);
              }}
              placeholder="Select Vehicle Type"
              style={styles.inputBox}
              valueField="value"
              labelField="name"
            />

            <CustomInputField
              label={'Vehicle Brand'}
              value={vehicleBrand}
              onChangeText={setVehicleBrand}
              keyboardType="default"
              secureTextEntry={false}
              placeholder={'Vehicle Brand Name (Ex. - Honda)'}
            />

            <CustomInputField
              label={'Vehicle Number'}
              value={vehicleNumber}
              onChangeText={setVehicleNumber}
              keyboardType="default"
              secureTextEntry={false}
              placeholder={'Vehicle Number (Ex. - AB12CD3456)'}
            />

            <CustomInputField
              label={'Vehicle Model'}
              value={vehicleModel}
              onChangeText={setVehicleModel}
              keyboardType="default"
              secureTextEntry={false}
              placeholder={'Please Enter Vehicle Model (Ex. - Civic ZX MT)'}
            />

            <Text style={[styles.label]}>Fuel Type</Text>
            <ElementDropdown
              data={fuelTypes}
              value={vehicleFuelType}
              onChange={item => {
                setVehicleFuelType(item.value);
              }}
              placeholder="Select Fuel Type"
              style={styles.inputBox}
              valueField="value"
              labelField="name"
            />

            <Text style={[styles.label]}>Transmission Type</Text>
            <ElementDropdown
              data={vehicleTransmissionTypeData}
              value={vehicleTransmissionType}
              onChange={item => {
                setVehicleTransmissionType(item.value);
              }}
              placeholder="Select Transmission Type"
              style={styles.inputBox}
              valueField="value"
              labelField="name"
            />

            <CustomInputField
              label={'Vehicle Description'}
              value={vehicleDescription}
              onChangeText={setVehicleDescription}
              keyboardType="default"
              secureTextEntry={false}
              placeholder={'Please Enter Vehicle Description'}
              inputStyles={styles.descriptionInput}
              multiline={true}
              returnKeyType="default"
            />

            <Text style={[styles.label]}>Seating Capacity</Text>
            <ElementDropdown
              data={seatOptions}
              value={seatingCapacity}
              onChange={item => {
                setSeatingCapacity(item.value);
              }}
              placeholder="Select Seating Capacity"
              style={styles.inputBox}
              valueField="value"
              labelField="name"
            />

            <Text style={[styles.label]}>Luggage Capacity</Text>
            <ElementDropdown
              data={luggageOptions}
              value={luggageCapacity}
              onChange={item => {
                setLuggageCapacity(item.value);
              }}
              placeholder="Select Luggage Capacity"
              style={styles.inputBox}
              valueField="value"
              labelField="name"
            />

            <CustomInputField
              label={'Maximum Power'}
              value={maxPorwer}
              onChangeText={setMaxPorwer}
              keyboardType="default"
              secureTextEntry={false}
              placeholder={'Vehicle Maximum Power'}
            />

            <CustomInputField
              label={'Maximum Speed'}
              value={maxSpeed}
              onChangeText={setMaxSpeed}
              keyboardType="default"
              secureTextEntry={false}
              placeholder={'Vehicle Maximum Speed'}
            />

            <CustomInputField
              label={'Fuel Cost Average'}
              value={fuelCostAverage}
              onChangeText={setFuelCostAverage}
              keyboardType="default"
              secureTextEntry={false}
              placeholder={'Vehicle Fuel Cost Average (in km/ltr)'}
            />

            <CustomInputField
              label={'Zero To Sixty Speed in Time'}
              value={zeroToSixtySpeedTime}
              onChangeText={setZeroToSixtySpeedTime}
              keyboardType="default"
              secureTextEntry={false}
              placeholder={'Vehicle Zero-Sixty Speed Time (in seconds)'}
            />

            <Text style={styles.uploadText}>Vehicle's Documents</Text>

            <CustomInputField
              label={'Registration Number (RC)'}
              value={rcNumber}
              onChangeText={setRcNumber}
              keyboardType="default"
              secureTextEntry={false}
              placeholder={'Vehicle Registration Number'}
            />
            <CustomInputField
              label={'Pollution Under Control Number (PUC)'}
              value={pucNumber}
              onChangeText={setPucNumber}
              keyboardType="default"
              secureTextEntry={false}
              placeholder={'Vehicle PUC Number'}
            />
            <CustomInputField
              label={'Insurance Number'}
              value={insuranceNumber}
              onChangeText={setInsuranceNumber}
              keyboardType="default"
              secureTextEntry={false}
              placeholder={'Vehicle Insurance Number'}
            />
            <CustomInputField
              label={'Permit Number'}
              value={permitNumber}
              onChangeText={setPermitNumber}
              keyboardType="default"
              secureTextEntry={false}
              placeholder={'Vehicle Permit Number'}
            />
            <Text style={styles.uploadText}>Vehicle's Images</Text>

            <TouchableOpacity
              disabled={isUploading}
              style={styles.imageContainer}
              onPress={toggleImagePickerModal}>
              <View style={styles.placeholderContainer}>
                {isUploading ? (
                  <ActivityIndicator size={scale(24)} color={COLORS.Amber} />
                ) : (
                  <Image source={Icons.FileUpload} style={styles.uploadIcon} />
                )}

                <View style={[styles.instructionRow]}>
                  <Icon name="check-circle" size={20} color={COLORS.Amber} />
                  <Text style={styles.subtitle}>
                    Upload image files only(supports JPEG,PNG,JPG).
                  </Text>
                </View>
                <View style={[styles.instructionRow]}>
                  <Icon name="check-circle" size={20} color={COLORS.Amber} />
                  <Text style={styles.subtitle}>
                    Upload each side of images of your vehicle.
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {renderUploadedImages()}

            <PrimaryButton
              buttonText="Update"
              style={styles.primaryButton}
              onPress={handleUpdate}
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
                  onPress={() =>
                    handleImageSelection(ImagePicker.openPicker, true)
                  }
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
        </ScrollView>
      )}
    </Container>
  );
};

export default EditVehicleDetails;

const styles = StyleSheet.create({
  loaderBox: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    marginHorizontal: scale(15),
  },
  uploadText: {
    color: COLORS.themePrimary,
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(16),
    alignSelf: 'center',
  },
  label: {
    marginVertical: verticalScale(3),
    color: COLORS.black,
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(15),
  },
  inputBox: {
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: scale(5),
    paddingHorizontal: scale(10),
    paddingVertical: scale(8),
    fontSize: scale(14),
    color: COLORS.black,
    fontFamily: Fonts.Regular,
    marginBottom: scale(4),
  },
  imageContainer: {
    width: '100%',
    height: scale(150),
    borderWidth: moderateScale(2),
    borderStyle: 'dashed',
    borderColor: COLORS.black,
    borderRadius: moderateScale(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(20),
  },
  placeholderContainer: {
    // alignItems: 'center',
  },
  uploadIcon: {
    width: scale(40),
    height: scale(40),
    marginBottom: scale(10),
    alignSelf: 'center',
  },
  uploadText: {
    color: COLORS.themePrimary,
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(16),
    alignSelf: 'center',
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: moderateScale(13),
    color: COLORS.gray,
    marginLeft: scale(10),
    fontFamily: Fonts.Regular,
  },
  primaryButton: {
    borderRadius: moderateScale(30),
    marginTop: scale(20),
    bottom: scale(15),
  },
  imagesPreviewContainer: {
    marginBottom: scale(10),
  },
  uploadedImagesLabel: {
    fontSize: moderateScale(14),
    color: COLORS.black,
    fontFamily: Fonts.Medium,
    marginBottom: scale(5),
  },
  imagePreviewWrapper: {
    position: 'relative',
    marginRight: scale(10),
    zIndex: 9,
  },
  imagePreview: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(5),
    borderWidth: 1,
    borderColor: COLORS.Amber,
  },
  removeImageButton: {
    position: 'absolute',
    top: scale(4),
    right: scale(4),
    backgroundColor: COLORS.red,
    borderRadius: scale(10),
    width: scale(20),
    height: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
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
});
