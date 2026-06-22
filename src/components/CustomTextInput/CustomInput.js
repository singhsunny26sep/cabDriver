import React from 'react';
import { TextInput, View, Text } from 'react-native';
import { COLORS } from '../../theme/Colors';
import { scale,moderateScale,verticalScale } from '../../utils/Scalling';

function CustomInput({
  label,
  textInputProps,
  height = moderateScale(56),
  left,
  right,
  handleKeyPress,
  borderWith = 1,
  secureTextEntry = false,
}) {
  return (
    <View style={{
      height: height,
      borderRadius: 9,
      borderWidth: borderWith,
      borderColor: '#B8B8B8',
      alignItems: 'center',
      flexDirection: 'row',
    }}>
      {left}
      <TextInput
        placeholder={textInputProps?.placeholder ?? ''}
        onSubmitEditing={handleKeyPress}
        returnKeyType="done"
        placeholderTextColor="#D0D0D0"
        secureTextEntry={secureTextEntry}
        style={{
          fontSize: moderateScale(14),
          color: COLORS.black,
          fontFamily: 'Poppins-Medium',
          paddingLeft: scale(15),
          flex: 1,
          lineHeight: scale(25),
          paddingVertical: verticalScale(5),
        }}
        {...textInputProps}
      />
      {right}
    </View>
  );
}

export default CustomInput;
