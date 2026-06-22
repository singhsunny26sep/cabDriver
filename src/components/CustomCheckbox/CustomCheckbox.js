import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../theme/Colors';
import { scale } from '../../utils/Scalling';

const CustomCheckbox = ({ checked, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.checkbox, checked && styles.checked]}>
        {checked && (
          <Icon name="checkmark" size={scale(16)} color={COLORS.white} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkbox: {
    width: scale(20),
    height: scale(20),
    borderRadius: scale(4),
    borderWidth: 1.5,
    borderColor: COLORS.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: COLORS.Amber,
    borderColor: COLORS.Amber,
  },
});

export default CustomCheckbox;
