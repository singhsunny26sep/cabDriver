import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { scale } from '../../utils/Scalling';
import { COLORS } from '../../theme/Colors';
import { Fonts } from '../../theme/Fonts';

const CustomPasswordInputField = ({ 
  label, 
  placeholder, 
  value, 
  onChangeText,
  autoComplete,
  autoCapitalize,
  autoFocus,
  editable,
  inputMode,
  returnKeyType
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          value={value} 
          onChangeText={onChangeText}
          style={styles.inputBox}
          placeholder={placeholder}
          secureTextEntry={!showPassword}
          editable={editable}
          inputMode={inputMode}
          placeholderTextColor={COLORS.borderColor}
          autoComplete={autoComplete}
          autoCapitalize={autoCapitalize || 'none'}
          autoFocus={autoFocus}
          returnKeyType={returnKeyType}
        />
        <TouchableOpacity 
          style={styles.iconContainer} 
          onPress={toggleShowPassword}
          activeOpacity={0.7}
        >
          <Icon 
            name={showPassword ? 'eye-off' : 'eye'} 
            size={scale(20)} 
            color={COLORS.borderColor}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default React.memo(CustomPasswordInputField);

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: scale(15),
  },
  label: {
    fontSize: scale(14),
    color: COLORS.black,
    marginBottom: scale(5),
    fontFamily: Fonts.Medium
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: scale(5),
  },
  inputBox: {
    flex: 1,
    padding: scale(10),
    fontSize: scale(14),
    color: COLORS.black,
    fontFamily: Fonts.Regular
  },
  iconContainer: {
    padding: scale(10),
  },
});