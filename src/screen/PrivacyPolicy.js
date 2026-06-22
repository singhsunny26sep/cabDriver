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

        {/* Introduction */}
        <View style={styles.section}>
          <Text style={styles.sectionText}>
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application (the "App") and related services. Please read this policy carefully. By using the App, you consent to the practices described herein.
          </Text>
        </View>

        {/* Information Collection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          <Text style={styles.sectionText}>
            We may collect the following types of information:
          </Text>
          <Text style={styles.bulletText}>
            • Personal Information: Name, email address, phone number, profile photo, payment method details (e.g., credit/debit card information, UPI ID).
          </Text>
          <Text style={styles.bulletText}>
            • Location Data: Precise or approximate real-time location data from your device when the App is in use or in the background (for driver matching and trip tracking).
          </Text>
          <Text style={styles.bulletText}>
            • Usage Data: Ride history, preferences, search queries, app interactions, device information (model, OS version), IP address, and log data.
          </Text>
          <Text style={styles.bulletText}>
            • Communications: Records of calls, chats, or messages between you and drivers or our support team.
          </Text>
        </View>

        {/* Use of Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
          <Text style={styles.sectionText}>
            We use the collected information to:
          </Text>
          <Text style={styles.bulletText}>
            • Provide, maintain, and improve our ride-hailing services.
          </Text>
          <Text style={styles.bulletText}>
            • Match you with nearby drivers, calculate fares, and process payments.
          </Text>
          <Text style={styles.bulletText}>
            • Communicate trip details, updates, and support messages.
          </Text>
          <Text style={styles.bulletText}>
            • Enhance safety features (e.g., share trip status with emergency contacts).
          </Text>
          <Text style={styles.bulletText}>
            • Personalize your experience and send promotional offers (you may opt out).
          </Text>
          <Text style={styles.bulletText}>
            • Comply with legal obligations and resolve disputes.
          </Text>
        </View>

        {/* Sharing of Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Sharing of Information</Text>
          <Text style={styles.sectionText}>
            We may share your information:
          </Text>
          <Text style={styles.bulletText}>
            • With drivers: Your pickup/drop-off locations, name, and rating are shared with the assigned driver.
          </Text>
          <Text style={styles.bulletText}>
            • With service providers: Payment processors, mapping services (e.g., Google Maps), cloud storage, and analytics partners.
          </Text>
          <Text style={styles.bulletText}>
            • For legal reasons: If required by law, court order, or to protect the rights, property, or safety of our company, users, or others.
          </Text>
          <Text style={styles.bulletText}>
            • With your consent: For any other purpose disclosed at the time of collection.
          </Text>
          <Text style={styles.sectionText}>
            We do not sell your personal information to third parties.
          </Text>
        </View>

        {/* Data Security */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Data Security</Text>
          <Text style={styles.sectionText}>
            We implement industry-standard administrative, technical, and physical safeguards to protect your information. However, no transmission over the internet or electronic storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
          </Text>
        </View>

        {/* Your Rights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Your Rights & Choices</Text>
          <Text style={styles.bulletText}>
            • Access & Update: You can review and edit your personal information via the App settings.
          </Text>
          <Text style={styles.bulletText}>
            • Location Permissions: You can disable location services in your device settings, but this may limit App functionality.
          </Text>
          <Text style={styles.bulletText}>
            • Opt-Out of Marketing: Follow the unsubscribe link in promotional emails or adjust notification preferences in the App.
          </Text>
          <Text style={styles.bulletText}>
            • Delete Account: Contact support to request account deletion. Some data may be retained for legal or legitimate business purposes.
          </Text>
        </View>

        {/* Cancellation Policy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Cancellation Policy</Text>
          <Text style={styles.sectionText}>
            • You may cancel a ride request up to 5 minutes before the driver arrives without any fee. Cancellations after this period or repeated last-minute cancellations may incur a cancellation fee (disclosed before confirmation).
          </Text>
          <Text style={styles.sectionText}>
            • If the driver is delayed by more than 10 minutes past the estimated arrival time, you may cancel free of charge.
          </Text>
          <Text style={styles.sectionText}>
            • Cancellation fees are processed through your selected payment method and are non-refundable.
          </Text>
        </View>

        {/* Children's Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
          <Text style={styles.sectionText}>
            Our services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children. If you become aware that a child has provided us with personal data, please contact us.
          </Text>
        </View>

        {/* Changes to Policy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Changes to This Privacy Policy</Text>
          <Text style={styles.sectionText}>
            We may update this policy from time to time. We will notify you of any material changes by posting the new policy in the App and updating the "Last Updated" date. Your continued use of the App after such changes constitutes acceptance of the revised policy.
          </Text>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Contact Us</Text>
          <Text style={styles.sectionText}>
            If you have any questions about this Privacy Policy, please contact us at:
          </Text>
          <Text style={styles.sectionText}>Email: support@yourrideapp.com</Text>
          <Text style={styles.sectionText}>Address: 123 Transport Lane, City, State, ZIP</Text>
        </View>

        <View style={styles.lastUpdated}>
          <Text style={styles.lastUpdatedText}>Last Updated: June 12, 2026</Text>
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: scale(16),
  },
  section: {
    marginBottom: verticalScale(20),
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontFamily: 'Poppins-SemiBold',
    color: COLORS.black,
    marginBottom: verticalScale(8),
  },
  sectionText: {
    fontSize: moderateScale(13),
    fontFamily: 'Poppins-Regular',
    color: COLORS.grey,
    lineHeight: moderateScale(18),
    marginBottom: verticalScale(6),
  },
  bulletText: {
    fontSize: moderateScale(13),
    fontFamily: 'Poppins-Regular',
    color: COLORS.grey,
    lineHeight: moderateScale(18),
    marginBottom: verticalScale(4),
    paddingLeft: scale(12),
  },
  lastUpdated: {
    marginTop: verticalScale(12),
    marginBottom: verticalScale(24),
    alignItems: 'center',
  },
  lastUpdatedText: {
    fontSize: moderateScale(11),
    fontFamily: 'Poppins-Regular',
    color: COLORS.grey + '80',
  },
});