import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { COLORS } from '../../theme/Colors';
import { Fonts } from '../../theme/Fonts';
import { moderateScale, scale } from '../../utils/Scalling';

const CustomModal = ({
  visible,
  onClose,
  title,
  message,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  onConfirm,
  confirmButtonColor = COLORS.Amber,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]} 
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>{cancelText}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modalButton, { backgroundColor: confirmButtonColor }]} 
              onPress={onConfirm}
            >
              <Text style={styles.confirmButtonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
    padding: scale(20),
  },
  modalTitle: {
    fontSize: moderateScale(18),
    fontFamily: Fonts.Medium,
    color: COLORS.black,
    marginBottom: scale(10),
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: moderateScale(16),
    fontFamily: Fonts.Regular,
    color: COLORS.gray7,
    marginBottom: scale(20),
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: scale(10),
  },
  modalButton: {
    flex: 1,
    paddingVertical: scale(12),
    borderRadius: scale(8),
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.gray4
  },
  cancelButtonText: {
    fontSize: moderateScale(16),
    fontFamily: Fonts.Medium,
    color: COLORS.black,
  },
  confirmButtonText: {
    fontSize: moderateScale(16),
    fontFamily: Fonts.Medium,
    color: COLORS.black,
  },
});

export default CustomModal; 