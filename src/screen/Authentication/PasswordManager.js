import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Container} from '../../components/Container/Container';
import {AppBar} from '../../components/AppBar/AppBar';
import CustomInput from '../../components/CustomTextInput/CustomInput';
import PrimaryButton from '../../components/Button/PrimaryButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS} from '../../theme/Colors';
import {scale, verticalScale} from '../../utils/Scalling';

export default function PasswordManager({navigation}) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const toggleEyeIcon = field => {
    switch (field) {
      case 'current':
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case 'new':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirm':
        setShowConfirmPassword(!showConfirmPassword);
        break;
    }
  };

  const renderEyeIcon = (field, showPassword) => (
    <TouchableOpacity
      onPress={() => toggleEyeIcon(field)}
      style={styles.eyeIcon}>
      <Icon
        name={showPassword ? 'eye-outline' : 'eye-off-outline'}
        size={24}
        color={COLORS.gray}
      />
    </TouchableOpacity>
  );

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
      <AppBar back title="Password Manager" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.content}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Current Password</Text>
            <CustomInput
              textInputProps={{
                value: currentPassword,
                onChangeText: setCurrentPassword,
                placeholder: 'Enter current password',
              }}
              secureTextEntry={!showCurrentPassword}
              right={renderEyeIcon('current', showCurrentPassword)}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>New Password</Text>
            <CustomInput
              textInputProps={{
                value: newPassword,
                onChangeText: setNewPassword,
                placeholder: 'Enter new password',
              }}
              secureTextEntry={!showNewPassword}
              right={renderEyeIcon('new', showNewPassword)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm New Password</Text>
            <CustomInput
              textInputProps={{
                value: confirmPassword,
                onChangeText: setConfirmPassword,
                placeholder: 'Confirm new password',
              }}
              secureTextEntry={!showConfirmPassword}
              right={renderEyeIcon('confirm', showConfirmPassword)}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <PrimaryButton buttonText="Change Password" />
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: scale(16),
  },
  inputContainer: {
    marginBottom: verticalScale(20),
  },
  label: {
    fontSize: scale(14),
    fontFamily: 'Poppins-Medium',
    color: COLORS.black,
    marginBottom: verticalScale(8),
  },
  eyeIcon: {
    padding: scale(10),
  },
  forgotText: {
    fontSize: scale(12),
    color: COLORS.themeSecondary,
    fontFamily: 'Poppins-Medium',
    alignSelf: 'flex-end',
    marginTop: verticalScale(8),
  },
  buttonContainer: {
    padding: scale(16),
  },
  scrollViewContent: {
    flexGrow: 1,
  },
});
