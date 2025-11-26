import React from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {Container} from '../components/Container/Container';
import {COLORS} from '../theme/Colors';
import {moderateScale, scale, verticalScale} from '../utils/Scalling';
import {AppBar} from '../components/AppBar/AppBar';
import {Fonts} from '../theme/Fonts';

export default function PrivacyPolicy({}) {
  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
      <AppBar back title="Privacy Policy" />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cancelation Policy</Text>
          <Text style={styles.sectionText}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Terms & Condition</Text>
          <Text style={styles.sectionText}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</Text>
          <Text style={styles.sectionText}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</Text>
          <Text style={styles.sectionText}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</Text>
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: scale(12),
  },
  section: {
    marginBottom: verticalScale(16),
  },
  sectionTitle: {
    fontSize: moderateScale(15),
    fontFamily: 'Poppins-Medium',
    color: COLORS.black,
    marginBottom: verticalScale(4),
  },
  sectionText: {
    fontSize: moderateScale(13),
    fontFamily: 'Poppins-Regular',
    color: COLORS.grey,
    lineHeight: moderateScale(18),
    marginBottom: verticalScale(8),
  },
});
