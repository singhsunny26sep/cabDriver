import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { Container } from '../../components/Container/Container';
import { AppBar } from '../../components/AppBar/AppBar';
import CustomInput from '../../components/CustomTextInput/CustomInput';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../theme/Colors';
import { Fonts } from '../../theme/Fonts';
import { scale, verticalScale, moderateScale } from '../../utils/Scalling';

export default function PasswordManager({ navigation }) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [strengthText, setStrengthText] = useState('');
  const [strengthColor, setStrengthColor] = useState(COLORS.gray);

  const buttonScale = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (newPassword) {
      evaluatePasswordStrength(newPassword);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      setPasswordStrength(0);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [newPassword]);

  const evaluatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    setPasswordStrength(strength);
    
    if (strength <= 1) {
      setStrengthText('Weak');
      setStrengthColor('#EF4444'); // red
    } else if (strength <= 3) {
      setStrengthText('Medium');
      setStrengthColor('#F59E0B'); // orange
    } else {
      setStrengthText('Strong');
      setStrengthColor('#10B981'); // green
    }
  };

  const toggleEyeIcon = (field) => {
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
    <TouchableOpacity onPress={() => toggleEyeIcon(field)} style={styles.eyeIcon}>
      <Icon
        name={showPassword ? 'eye-outline' : 'eye-off-outline'}
        size={20}
        color={COLORS.gray}
      />
    </TouchableOpacity>
  );

  const handleChangePassword = () => {
    // Simple validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      // Show toast or alert (you can integrate showToast)
      return;
    }
    if (newPassword !== confirmPassword) {
      // Show mismatch error
      return;
    }

    Animated.sequence([
      Animated.spring(buttonScale, { toValue: 0.96, friction: 5, useNativeDriver: true }),
      Animated.spring(buttonScale, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start(() => {
      // API call to change password
      console.log('Change password', { currentPassword, newPassword });
    });
  };

  const getStrengthBarWidth = () => {
    return (passwordStrength / 5) * 100;
  };

  return (
    <Container
      statusBarStyle="dark-content"
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
      <AppBar back title="Password Manager" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        
        {/* Header Icon */}
        <View style={styles.headerIconContainer}>
          <View style={styles.iconCircle}>
            <Icon name="shield-key-outline" size={40} color={COLORS.Amber} />
          </View>
          <Text style={styles.headerTitle}>Change Password</Text>
          <Text style={styles.headerSubtitle}>
            Create a strong and unique password
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          {/* Current Password */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Current Password</Text>
            <CustomInput
              textInputProps={{
                value: currentPassword,
                onChangeText: setCurrentPassword,
                placeholder: 'Enter current password',
                placeholderTextColor: COLORS.gray4,
                style: styles.inputText,
              }}
              secureTextEntry={!showCurrentPassword}
              right={renderEyeIcon('current', showCurrentPassword)}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              activeOpacity={0.7}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* New Password */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>New Password</Text>
            <CustomInput
              textInputProps={{
                value: newPassword,
                onChangeText: setNewPassword,
                placeholder: 'Enter new password',
                placeholderTextColor: COLORS.gray4,
                style: styles.inputText,
              }}
              secureTextEntry={!showNewPassword}
              right={renderEyeIcon('new', showNewPassword)}
            />
            
            {/* Password Strength Indicator */}
            {newPassword.length > 0 && (
              <Animated.View style={[styles.strengthContainer, { opacity: fadeAnim }]}>
                <View style={styles.strengthBarBackground}>
                  <View
                    style={[
                      styles.strengthBarFill,
                      {
                        width: `${getStrengthBarWidth()}%`,
                        backgroundColor: strengthColor,
                      },
                    ]}
                  />
                </View>
                <View style={styles.strengthTextRow}>
                  <Text style={[styles.strengthText, { color: strengthColor }]}>
                    Password Strength: {strengthText}
                  </Text>
                  <Text style={styles.strengthHint}>
                    {passwordStrength < 3 ? 'Add uppercase, numbers, or symbols' : 'Great! Very secure'}
                  </Text>
                </View>
              </Animated.View>
            )}
          </View>

          {/* Confirm Password */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Confirm New Password</Text>
            <CustomInput
              textInputProps={{
                value: confirmPassword,
                onChangeText: setConfirmPassword,
                placeholder: 'Confirm new password',
                placeholderTextColor: COLORS.gray4,
                style: styles.inputText,
              }}
              secureTextEntry={!showConfirmPassword}
              right={renderEyeIcon('confirm', showConfirmPassword)}
            />
            {confirmPassword.length > 0 && newPassword !== confirmPassword && (
              <Text style={styles.errorText}>Passwords do not match</Text>
            )}
          </View>
        </View>

        {/* Action Button */}
        <Animated.View style={[styles.buttonWrapper, { transform: [{ scale: buttonScale }] }]}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleChangePassword}
            style={styles.button}>
            <Icon name="lock-reset" size={20} color="#FFF" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Update Password</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Security Tips */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>🔒 Security Tips</Text>
          <Text style={styles.tipItem}>• Use at least 8 characters</Text>
          <Text style={styles.tipItem}>• Mix uppercase & lowercase letters</Text>
          <Text style={styles.tipItem}>• Include numbers and symbols</Text>
          <Text style={styles.tipItem}>• Avoid common words or personal info</Text>
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(30),
  },
  headerIconContainer: {
    alignItems: 'center',
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
  },
  iconCircle: {
    width: scale(70),
    height: scale(70),
    borderRadius: scale(35),
    backgroundColor: '#FFF5EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(12),
    shadowColor: COLORS.Amber,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTitle: {
    fontSize: moderateScale(22),
    fontFamily: Fonts.SemiBold,
    color: '#1A2C3E',
    marginBottom: verticalScale(4),
  },
  headerSubtitle: {
    fontSize: moderateScale(13),
    fontFamily: Fonts.Regular,
    color: '#6C7A8E',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(28),
    paddingVertical: verticalScale(20),
    paddingHorizontal: scale(20),
    marginBottom: verticalScale(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 8,
  },
  inputWrapper: {
    marginBottom: verticalScale(20),
  },
  label: {
    fontSize: moderateScale(14),
    fontFamily: Fonts.Medium,
    color: '#374151',
    marginBottom: verticalScale(8),
  },
  inputText: {
    fontSize: moderateScale(14),
    fontFamily: Fonts.Regular,
    color: '#1F2937',
  },
  eyeIcon: {
    padding: scale(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgotText: {
    fontSize: moderateScale(12),
    color: COLORS.Amber,
    fontFamily: Fonts.Medium,
    alignSelf: 'flex-end',
    marginTop: verticalScale(8),
  },
  strengthContainer: {
    marginTop: verticalScale(12),
  },
  strengthBarBackground: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(6),
  },
  strengthText: {
    fontSize: moderateScale(11),
    fontFamily: Fonts.Medium,
  },
  strengthHint: {
    fontSize: moderateScale(10),
    fontFamily: Fonts.Regular,
    color: '#9CA3AF',
  },
  errorText: {
    fontSize: moderateScale(11),
    color: '#EF4444',
    fontFamily: Fonts.Regular,
    marginTop: verticalScale(6),
  },
  buttonWrapper: {
    borderRadius: moderateScale(40),
    overflow: 'hidden',
    shadowColor: COLORS.Amber,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: verticalScale(24),
  },
  button: {
    backgroundColor: COLORS.Amber,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(40),
  },
  buttonIcon: {
    marginRight: scale(8),
  },
  buttonText: {
    fontSize: moderateScale(16),
    fontFamily: Fonts.SemiBold,
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  tipsCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: moderateScale(20),
    padding: scale(16),
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  tipsTitle: {
    fontSize: moderateScale(14),
    fontFamily: Fonts.SemiBold,
    color: '#374151',
    marginBottom: verticalScale(8),
  },
  tipItem: {
    fontSize: moderateScale(12),
    fontFamily: Fonts.Regular,
    color: '#6B7280',
    marginBottom: verticalScale(4),
    lineHeight: 18,
  },
});