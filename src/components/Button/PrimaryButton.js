import React, { forwardRef } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/Colors';

const PrimaryButton = forwardRef((props, ref) => {
  const {
    onPress,
    buttonText,
    disabled = false,
    loaderColor = 'white',
    loading = false,
    fontSize = 16,
    textColor = "white",
    style,
    ...restProps
  } = props;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, { backgroundColor: disabled ? 'gray' : COLORS.themeSecondary }, style]}
      {...restProps}
    >
      <Text style={[styles.buttonText, { fontSize, color: textColor }]}>
        {buttonText}
      </Text>
      {loading && <ActivityIndicator color={loaderColor} size={20} />}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  button: {
    borderRadius: 6,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16
  },
  buttonText: {
    fontFamily: 'Roboto-Medium',
    numberOfLines: 1,
  }
});

export default PrimaryButton;
