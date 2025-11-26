import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  ScrollView,
} from 'react-native';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import Icons from '../assets/Icons';
import PrimaryButton from '../components/Button/PrimaryButton';
import {Container} from '../components/Container/Container';
import {COLORS} from '../theme/Colors';
import {AppBar} from '../components/AppBar/AppBar';
import { moderateScale, scale } from '../utils/Scalling';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Fonts } from '../theme/Fonts';

const ProfilePicture = ({navigation}) => {
  const [selectedImages, setSelectedImages] = useState([]);

  const selectImage = async type => {
    const options = {
      mediaType: 'photo',
      quality: 1,
      selectionLimit: 1,
    };

    try {
      const result =
        type === 'camera'
          ? await launchCamera(options)
          : await launchImageLibrary(options);

      if (result.assets) {
        setSelectedImages(prevImages => [...prevImages, ...result.assets.map(asset => asset.uri)]);
      }
    } catch (error) {
      console.log('Error selecting image:', error);
    }
  };

  const removeImage = (indexToRemove) => {
    setSelectedImages(prevImages => 
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
      <AppBar back title='Profile Picture'/>
      <View style={styles.container}>        
        <View style={styles.instructionRow}>
          <Icon name="check-circle" size={20} color={COLORS.Amber} />
          <Text style={styles.subtitle}>
            Please upload a clear selfie
          </Text>
        </View>

        <View style={styles.instructionRow}>
          <Icon name="check-circle" size={20} color={COLORS.Amber} />
          <Text style={styles.subtitle}>
            The selfie should have the applicant's face alone
          </Text>
        </View>

        <View style={[styles.instructionRow, styles.lastInstruction]}>
          <Icon name="check-circle" size={20} color={COLORS.Amber} />
          <Text style={styles.subtitle}>
            Upload jpg, png, jpeg, or pdf
          </Text>
        </View>

        <TouchableOpacity
          style={styles.imageContainer}
          onPress={() => selectImage('gallery')}>
             <View style={styles.placeholderContainer}>
             <Image source={Icons.FileUpload}
                style={styles.uploadIcon}
              />
              <Text style={styles.uploadText}>Upload Documents</Text>
            </View>
        </TouchableOpacity>

        <View style={styles.selectedImagesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {selectedImages.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image 
                  source={{ uri }} 
                  style={styles.selectedImage} 
                  resizeMode="cover"
                />
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => removeImage(index)}
                >
                  <Icon name="close" size={20} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.buttonContainer}>
          <PrimaryButton buttonText='Done'/>
        </View>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: scale(15)
  },
  subtitle: {
    fontSize: moderateScale(16),
    color: COLORS.gray,
    flex: 1,
    marginLeft: scale(10),
    fontFamily: Fonts.Regular
  },
  imageContainer: {
    width: '100%',
    height: scale(170),
    borderWidth: moderateScale(2),
    borderStyle: 'dashed',
    borderColor: COLORS.black,
    borderRadius: moderateScale(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: scale(20),
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: moderateScale(10),
  },
  placeholderContainer: {
    alignItems: 'center',
  },
  uploadIcon: {
    width: scale(50),
    height: scale(50),
    marginBottom: scale(10),
  },
  uploadText: {
    color: COLORS.black,
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(16)
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  lastInstruction: {
    marginBottom: scale(20)
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: scale(20)
  },
  selectedImagesContainer: {
    width: '100%',
    height: scale(130),
    marginBottom: scale(20),
  },
  imageWrapper: {
    marginRight: scale(10),
    position: 'relative',
  },
  selectedImage: {
    width: scale(130),
    height: scale(130),
    borderRadius: moderateScale(10),
  },
  removeButton: {
    position: 'absolute',
    top: -scale(-5),
    right: -scale(-5),
    backgroundColor: COLORS.black,
    borderRadius: scale(12),
    width: scale(24),
    height: scale(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfilePicture;

