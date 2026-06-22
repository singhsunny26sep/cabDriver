import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import {Container} from '../../components/Container/Container';
import {AppBar} from '../../components/AppBar/AppBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {moderateScale, scale, verticalScale} from '../../utils/Scalling';
import {COLORS} from '../../theme/Colors';
import {Fonts} from '../../theme/Fonts';

export default function HelpCenter() {
  const [activeTab, setActiveTab] = useState('FAQ');
  const [expandedItem, setExpandedItem] = useState(null);

  const faqData = [
    {
      question: 'What if I need to cancel a booking?',
      answer:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      question: 'Is safe to use App?',
      answer:
        'Yes, our app is completely safe to use. We implement industry-standard security measures.',
    },
    {
      question: 'How do I receive Booking Details?',
      answer:
        'You will receive booking details via SMS and email notification.',
    },
    {
      question: 'How can I edit my profile information?',
      answer:
        'You will receive booking details via SMS and email notification.',
    },
    {
      question: 'How to cancel taxi?',
      answer:
        'You will receive booking details via SMS and email notification.',
    },
    {
      question: 'How to Add new car?',
      answer:
        'You will receive booking details via SMS and email notification.',
    },
    {
      question: 'How to see pre-booked taxi?',
      answer:
        'You will receive booking details via SMS and email notification.',
    },
  ];

  const contactData = [
    {
      title: 'Customer Service',
      subtitle: '24/7 Support Available',
      icon: 'headphones',
      color: '#FF6B6B',
    },
    {
      title: 'WhatsApp',
      subtitle: '(480) 555-0103',
      icon: 'whatsapp',
      color: '#25D366',
    },
    {
      title: 'Website',
      subtitle: 'www.yourwebsite.com',
      icon: 'web',
      color: '#4A90E2',
    },
    {
      title: 'Facebook',
      subtitle: '@yourcompany',
      icon: 'facebook',
      color: '#1877F2',
    },
    {
      title: 'Twitter',
      subtitle: '@yourhandle',
      icon: 'twitter',
      color: '#1DA1F2',
    },
    {
      title: 'Instagram',
      subtitle: '@yourprofile',
      icon: 'instagram',
      color: '#E4405F',
    },
  ];

  const renderFAQSection = () => (
    <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['All', 'Services', 'General', 'Account'].map(filter => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                filter === 'All' && styles.activeFilter,
              ]}>
              <Text
                style={[
                  styles.filterText,
                  filter === 'All' && styles.activeFilterText,
                ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {faqData.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.faqItem}
          onPress={() => setExpandedItem(expandedItem === index ? null : index)}
          activeOpacity={0.7}>
          <View style={styles.faqHeader}>
            <Text style={styles.faqQuestion}>{item.question}</Text>
            <Icon
              name={expandedItem === index ? 'chevron-up' : 'chevron-down'}
              size={moderateScale(30)}
              color={COLORS.gray3}
            />
          </View>
          {expandedItem === index && (
            <Text style={styles.faqAnswer}>{item.answer}</Text>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderContactSection = () => (
    <ScrollView style={styles.contentContainer}>
      <View style={styles.contactGrid}>
        {contactData.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.contactItem}
            activeOpacity={0.7}>
            <View
              style={[
                styles.iconContainer,
                {backgroundColor: `${item.color}15`},
              ]}>
              <Icon
                name={item.icon}
                size={moderateScale(24)}
                color={item.color}
              />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>{item.title}</Text>
              <Text style={styles.contactSubtitle}>{item.subtitle}</Text>
            </View>
            <Icon
              name="chevron-right"
              size={moderateScale(20)}
              color={COLORS.gray2}
            />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
      <AppBar title="Help Center" back />
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={24} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'FAQ' && styles.activeTab]}
          onPress={() => setActiveTab('FAQ')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'FAQ' && styles.activeTabText,
            ]}>
            FAQ
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Contact' && styles.activeTab]}
          onPress={() => setActiveTab('Contact')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'Contact' && styles.activeTabText,
            ]}>
            Contact Us
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'FAQ' ? renderFAQSection() : renderContactSection()}
    </Container>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    margin: 16,

  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: verticalScale(15),
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: moderateScale(2),
    borderBottomColor: COLORS.Amber,
  },
  tabText: {
    fontSize: moderateScale(16),
    color: COLORS.black,
    fontWeight: '600',
  },
  activeTabText: {
    color: COLORS.Amber,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
  },
  filterContainer: {
    padding: scale(16),
    paddingBottom: verticalScale(8),
  },
  filterButton: {
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(8),
    backgroundColor: COLORS.gray5,
    borderRadius: moderateScale(20),
    marginRight: scale(10),
    borderWidth: 1,
    borderColor: COLORS.gray5,
  },
  activeFilter: {
    backgroundColor: COLORS.Amber,
    borderColor: COLORS.Amber,
  },
  filterText: {
    color: COLORS.black,
    fontFamily: Fonts.Medium,
    fontSize: moderateScale(14),
  },
  activeFilterText: {
    color: COLORS.white,
  },
  faqItem: {
    padding: scale(16),
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(12),
    marginHorizontal: scale(15),
    marginVertical: verticalScale(8),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.gray5,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: moderateScale(13),
    flex: 1,
    marginRight: scale(10),
    fontFamily: Fonts.Medium,
    color: COLORS.black,
  },
  faqAnswer: {
    marginTop: verticalScale(12),
    color: COLORS.gray,
    lineHeight: verticalScale(20),
    fontFamily: Fonts.Regular,
    fontSize: moderateScale(14),
    paddingTop: verticalScale(8),
    borderTopWidth: 1,
    borderTopColor: COLORS.gray5,
  },
  contactGrid: {
    padding: scale(12),
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(16),
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(12),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.gray5,
  },
  iconContainer: {
    width: scale(45),
    height: scale(45),
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(16),
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: moderateScale(16),
    fontFamily: Fonts.SemiBold,
    color: COLORS.black,
    marginBottom: verticalScale(4),
  },
  contactSubtitle: {
    fontSize: moderateScale(13),
    fontFamily: Fonts.Regular,
    color: COLORS.gray2,
  },
});
