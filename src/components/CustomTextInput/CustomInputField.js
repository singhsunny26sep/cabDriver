import React from 'react';
import { View, Text, TextInput, StyleSheet} from 'react-native';
import { scale } from '../../utils/Scalling';
import { COLORS } from '../../theme/Colors';
import { Fonts } from '../../theme/Fonts';

// interface Props {
//     label: string,
//     placeholder: string,
//     keyboardType: any,
//     secureTextEntry?: boolean,
//     value: string,
//     onChangeText: (text: string) => void,
//     autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters',
//     autoComplete?: any,
//     autoFocus?: boolean,
//     editable?: boolean,
//     inputMode?: 'decimal' | 'email' | 'none' | 'numeric' | 'search' | 'tel' | 'text' | 'url',
//     multiline?: boolean,
//     returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send',

//   }

const CustomInputField = ({ label, placeholder, keyboardType, secureTextEntry, value, onChangeText, autoComplete, autoCapitalize, autoFocus, editable, inputMode, multiline,returnKeyType, inputContainerStyle, inputStyles}) => {

  return (
    <View style={[styles.inputContainer, inputContainerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={[styles.inputBox, inputStyles]}
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        editable={editable}
        inputMode={inputMode}
        placeholderTextColor={COLORS.borderColor}
        returnKeyType={returnKeyType}
        multiline={multiline}
        // autoComplete={autoComplete}
        // autoCapitalize={autoCapitalize}
        // autoFocus={autoFocus}
        // returnKeyType={returnKeyType}
      />
    </View>
  );
};

export default React.memo(CustomInputField);

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: scale(10),
      },
      label: {
        fontSize: scale(14),
        color: COLORS.black,
        marginBottom: scale(5),
        fontFamily: Fonts.Medium,
      },
      inputBox: {
        borderWidth: 1,
        borderColor: COLORS.borderColor,
        borderRadius: scale(5),
        paddingHorizontal: scale(10),
        paddingVertical: 0,
        fontSize: scale(14),
        color: COLORS.black,
        fontFamily: Fonts.Regular,
        height: scale(42),
      },
});
