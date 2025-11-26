import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {COLORS} from '../../theme/Colors';
import {moderateScale, scale} from '../../utils/Scalling';
import {Fonts} from '../../theme/Fonts';

const RadioButton = ({label, selected, onSelect, style}) => {
  return (
    <TouchableOpacity style={[styles.radioContainer, style]} onPress={onSelect}>
      <View style={styles.radioButton}>
        {selected && <View style={styles.radioButtonInner} />}
      </View>
      <Text style={styles.radioText}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(16),
  },
  radioButton: {
    height: scale(23),
    width: scale(23),
    borderRadius: moderateScale(15),
    borderWidth: moderateScale(2),
    borderColor: COLORS.Amber,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(15),
  },
  radioButtonInner: {
    height: scale(15),
    width: scale(15),
    borderRadius: moderateScale(10),
    backgroundColor: COLORS.Amber,
  },
  radioText: {
    fontSize: moderateScale(16),
    color: COLORS.gray,
    fontFamily: Fonts.Medium,
  },
});

export default RadioButton;
