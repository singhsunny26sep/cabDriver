import React, {useState, version} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Image,
} from 'react-native';
import {Container} from '../../components/Container/Container';
import {COLORS} from '../../theme/Colors';
import {AppBar} from '../../components/AppBar/AppBar';
import RadioButton from '../../components/RadioButton/RadioButton';
import {moderateScale, scale, verticalScale} from '../../utils/Scalling';
import {Fonts} from '../../theme/Fonts';
import PrimaryButton from '../../components/Button/PrimaryButton';
import Icons from '../../assets/Icons';

export default function CancelRide({navigation}) {
  const [selectedReason, setSelectedReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [showModal, setShowModal] = useState(false);

  const reasons = [
    'Rider Not Available',
    'Rider want to book another cab',
    'Rider Misbehave',
    'Taxi Breakdown',
    'Puncture',
    'Other',
  ];

  const handleCancelRide = () => {
    if (!selectedReason) {
      return;
    }
    setShowModal(true);
  };

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
      <AppBar title="Cancel Ride" back />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerText}>
          Please select the reason for cancellations:
        </Text>

        {reasons.map((reason, index) => (
          <RadioButton
            key={index}
            label={reason}
            selected={selectedReason === reason}
            onSelect={() => setSelectedReason(reason)}
          />
        ))}

        {selectedReason === 'Other' && (
          <View style={styles.otherContainer}>
            <Text style={styles.otherLabel}>Other</Text>
            <TextInput
              style={styles.otherInput}
              placeholder="Enter your Reason"
              value={otherReason}
              onChangeText={setOtherReason}
              multiline
              numberOfLines={4}
            />
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomContainer}>
        <PrimaryButton buttonText="Cancel Ride" onPress={handleCancelRide} />
      </View>

      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View>
              <Image source={Icons.CloseIcon} style={styles.modalIcon} />
              <Text style={styles.successText}>
                Booking Cancelled Successfully!
              </Text>
              <Text style={styles.successSubText}>
                Your booking with CRN: #854HG23 has been cancelled successfully.
              </Text>
            </View>
            <PrimaryButton
              buttonText="Got It"
              style={styles.gotItButton}
              onPress={() => navigation.navigate('BottomTab')}
            />
          </View>
        </View>
      </Modal>
    </Container>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: scale(16),
    paddingBottom: scale(100),
  },
  headerText: {
    fontSize: moderateScale(15),
    color: COLORS.gray,
    marginBottom: scale(20),
    fontFamily: Fonts.Medium,
  },
  otherContainer: {
    marginTop: 10,
  },
  otherLabel: {
    fontSize: moderateScale(16),
    color: COLORS.gray,
    fontFamily: Fonts.Medium,
  },
  otherInput: {
    borderWidth: scale(1),
    borderColor: COLORS.gray3,
    borderRadius: moderateScale(8),
    padding: scale(12),
    height: scale(100),
    textAlignVertical: 'top',
  },
  bottomContainer: {
    marginTop: 'auto',
    paddingHorizontal: scale(16),
    paddingBottom: scale(16),
  },
  cancelButton: {
    backgroundColor: COLORS.Amber,
    padding: scale(15),
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.black,
    fontSize: moderateScale(15),
    fontFamily: Fonts.Medium,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    padding: scale(20),
    alignItems: 'center',
    width: '100%',
    borderTopRightRadius: moderateScale(15),
    borderTopLeftRadius: moderateScale(15),
  },
  modalTitle: {
    fontSize: moderateScale(18),
    fontFamily: Fonts.Medium,
    color: COLORS.black,
    marginBottom: scale(10),
  },
  modalText: {
    fontSize: moderateScale(14),
    fontFamily: Fonts.Regular,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: scale(20),
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: scale(12),
    borderRadius: moderateScale(8),
    marginHorizontal: scale(5),
  },
  modalButtonCancel: {
    backgroundColor: COLORS.gray3,
  },
  modalButtonConfirm: {
    backgroundColor: COLORS.Amber,
  },
  modalButtonText: {
    color: COLORS.black,
    fontSize: moderateScale(14),
    fontFamily: Fonts.Medium,
    textAlign: 'center',
  },
  modalIcon: {
    height: scale(80),
    width: scale(80),
    alignSelf: 'center',
  },
  successText: {
    textAlign: 'center',
    marginVertical: verticalScale(10),
    fontFamily: Fonts.Medium,
    color: COLORS.black,
    fontSize: moderateScale(18),
  },
  successSubText: {
    textAlign: 'center',
    fontFamily: Fonts.Regular,
    color: COLORS.gray,
    fontSize: moderateScale(15),
  },
  gotItButton: {
    width: scale(300),
    marginTop: scale(30),
  },
});
