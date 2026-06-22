import React from 'react';
import Toast from 'react-native-toast-message';
import {View, Text, StyleSheet} from 'react-native';
import { COLORS } from '../../theme/Colors';
import {Fonts} from '../../theme/Fonts';
import { scale, moderateScale, verticalScale } from '../../utils/Scalling';
import Icon from 'react-native-vector-icons/MaterialIcons';

const toastConfig = {
  success: ({text1, text2}) => (
    <View style={[styles.toastContainer, styles.successToast]}>
      <Icon name="check-circle" size={24} color={COLORS.success} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{text1}</Text>
        {text2 && <Text style={styles.message}>{text2}</Text>}
      </View>
    </View>
  ),

  error: ({text1, text2}) => (
    <View style={[styles.toastContainer, styles.errorToast]}>
      <Icon name="error" size={24} color={COLORS.error} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{text1}</Text>
        {text2 && <Text style={styles.message}>{text2}</Text>}
      </View>
    </View>
  ),

  warning: ({text1, text2}) => (
    <View style={[styles.toastContainer, styles.warningToast]}>
      <Icon name="warning" size={24} color={COLORS.warning} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{text1}</Text>
        {text2 && <Text style={styles.message}>{text2}</Text>}
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  toastContainer: {
    width: '90%',
    padding: moderateScale(5),
    borderRadius: moderateScale(8),
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: COLORS.bColor,
    borderLeftWidth: scale(5),
  },
  successToast: {
    borderLeftColor: COLORS.success,
  },
  errorToast: {
    borderLeftColor: COLORS.error,
  },
  warningToast: {
    borderLeftColor: COLORS.warning,
  },
  textContainer: {
    marginLeft: scale(10),
    flex: 1,
  },
  title: {
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(16),
    color: COLORS.black,
  },
  message: {
    fontFamily: Fonts.Regular,
    fontSize: moderateScale(14),
    color: COLORS.gray,
    marginTop: verticalScale(2),
  },
});

export const showToast = (type, title, message) => {
  Toast.show({
    type,
    text1: title,
    text2: message,
    visibilityTime: 5000,
    autoHide: true,
    topOffset: scale(50),
  });
};

export default function CustomToast() {
  return <Toast config={toastConfig} />;
}
