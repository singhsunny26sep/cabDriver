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
import DocumentPicker from 'react-native-document-picker';
import Icons from '../assets/Icons';
import PrimaryButton from '../components/Button/PrimaryButton';
import {Container} from '../components/Container/Container';
import {COLORS} from '../theme/Colors';
import {AppBar} from '../components/AppBar/AppBar';
import {moderateScale, scale} from '../utils/Scalling';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Fonts} from '../theme/Fonts';

const DrivingDetails = ({navigation}) => {
  const [selectedDocs, setSelectedDocs] = useState([]);

  const isValidFileType = (fileType) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    return validTypes.includes(fileType.toLowerCase());
  };

  const selectDocument = async () => {
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
        allowMultiSelection: true,
      });

      // Filter out invalid files
      const validDocs = results.filter(doc => {
        const isValidSize = doc.size <= 10 * 1024 * 1024; // 10MB in bytes
        const isValidType = isValidFileType(doc.type);

        if (!isValidSize) {
          alert(`File "${doc.name}" exceeds 10MB size limit`);
          return false;
        }
        if (!isValidType) {
          alert(`File "${doc.name}" is not in JPG, PNG, JPEG, or PDF format`);
          return false;
        }
        return true;
      });

      setSelectedDocs(prevDocs => [...prevDocs, ...validDocs]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.log('Error selecting document:', err);
      }
    }
  };

  const removeDocument = indexToRemove => {
    setSelectedDocs(prevDocs =>
      prevDocs.filter((_, index) => index !== indexToRemove),
    );
  };

  const getFileIcon = fileName => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'picture-as-pdf';
      case 'doc':
      case 'docx':
        return 'description';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'image';
      default:
        return 'insert-drive-file';
    }
  };

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
      <AppBar back title="Bank Account Details" />
      <View style={styles.container}>
        <View style={styles.instructionRow}>
          <Icon name="check-circle" size={20} color={COLORS.Amber} />
          <Text style={styles.subtitle}>
            Photocopies and printout of documents will not be accepted.
          </Text>
        </View>

        <View style={[styles.instructionRow, {marginBottom: scale(10)}]}>
          <Icon name="check-circle" size={20} color={COLORS.Amber} />
          <Text style={styles.subtitle}>
            The photo and all details must be clearly visible.
          </Text>
        </View>

        <View style={[styles.instructionRow, {marginBottom: scale(10)}]}>
          <Icon name="check-circle" size={20} color={COLORS.Amber} />
          <Text style={styles.subtitle}>
            Only documents that are less than 10 MB in size and in JPG,PNG,JPEG,
            or PDF format will be accepted
          </Text>
        </View>

        <TouchableOpacity
          style={styles.imageContainer}
          onPress={selectDocument}>
          <View style={styles.placeholderContainer}>
            <Image source={Icons.FileUpload} style={styles.uploadIcon} />
            <Text style={styles.uploadText}>Upload Documents</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.selectedImagesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {selectedDocs.map((doc, index) => (
              <View key={index} style={styles.imageWrapper}>
                <View style={styles.docPreview}>
                  <View style={styles.docIconContainer}>
                    <Icon
                      name={getFileIcon(doc.name)}
                      size={40}
                      color={COLORS.Amber}
                    />
                  </View>
                  <View style={styles.docInfoContainer}>
                    <Text style={styles.docName} numberOfLines={1}>
                      {doc.name}
                    </Text>
                    <Text style={styles.docSize}>
                      {(doc.size / (1024 * 1024)).toFixed(2)} MB
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeDocument(index)}>
                  <Icon name="close" size={20} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.buttonContainer}>
          <PrimaryButton buttonText="Done" />
        </View>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: scale(15),
  },
  subtitle: {
    fontSize: moderateScale(13),
    color: COLORS.gray,
    flex: 1,
    marginLeft: scale(10),
    fontFamily: Fonts.Regular,
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
    fontSize: moderateScale(16),
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  lastInstruction: {
    marginBottom: scale(20),
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: scale(20),
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
    top: scale(5),
    right: scale(5),
    backgroundColor: COLORS.black,
    borderRadius: scale(12),
    width: scale(24),
    height: scale(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  docPreview: {
    width: scale(130),
    height: scale(130),
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(10),
    padding: scale(10),
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  docIconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 193, 7, 0.1)', // Light amber background
    borderRadius: moderateScale(8),
    padding: scale(10),
    marginBottom: scale(8),
  },
  docInfoContainer: {
    alignItems: 'center',
  },
  docName: {
    color: COLORS.black,
    textAlign: 'center',
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(12),
    marginBottom: scale(2),
  },
  docSize: {
    color: COLORS.gray,
    fontFamily: Fonts.Regular,
    fontSize: moderateScale(10),
  },
});

export default DrivingDetails;
