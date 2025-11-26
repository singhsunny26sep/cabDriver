import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import { AppBar } from '../../components/AppBar/AppBar';
import PrimaryButton from '../../components/Button/PrimaryButton';
import { scale,moderateScale,verticalScale } from '../../utils/Scalling';
import { Container } from '../../components/Container/Container';
import { COLORS } from '../../theme/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Fonts } from '../../theme/Fonts';

const UpdateDoc = ({}) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const menuItems = [
    {title: 'Profile Picture', route: 'ProfilePicture'},
    {title: 'Bank Account Details', route: 'BankAccountDetails'},
    {title: 'Driving Details', route: 'DrivingDetails'},
  ];

  const renderMenuItem = item => (
    <TouchableOpacity 
      key={item.title} 
      style={styles.menuItem}
      onPress={() => navigation.navigate(item.route)}>
      <Text style={styles.menuItemText}>{item.title}</Text>
      <Icon name="chevron-right" size={moderateScale(24)} color={COLORS.grey} />
    </TouchableOpacity>
  );

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
      <AppBar back title='Update Document Details'/>
      <View style={styles.menuContainer}>
        {menuItems.map(renderMenuItem)}
        <Text style={styles.submittedText}>Submitted Steps</Text>
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('GovernmentID')}>
          <Text style={styles.menuItemText}>Government ID</Text>
          <Icon name="chevron-right" size={moderateScale(24)} color={COLORS.grey} />
        </TouchableOpacity>
      </View>
    </Container>
  );
};
export default UpdateDoc;

const styles = StyleSheet.create({
  
  header: {
    padding:scale (20),
  },
  welcomeText: {
    fontSize:moderateScale (24),
    fontFamily:Fonts.Bold,
    marginBottom:scale (8),
  },
  subText: {
    fontSize:moderateScale (18),
    color:COLORS.gray,
    marginBottom:scale (10),
    fontFamily:Fonts.Medium
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: scale(15),
    marginTop:scale(20)
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: scale(15),
    marginBottom: scale(10),
    borderWidth: 1,
    borderColor:COLORS.gray6,
    borderRadius: moderateScale(8),
    backgroundColor: COLORS.white,
  },
  menuItemText: {
    fontSize: moderateScale(16),
    color: COLORS.black,
    fontFamily:Fonts.Light
  },
  submittedText: {
    fontSize: moderateScale(16),
    color: COLORS.black,
    marginVertical: scale(5),
    fontFamily:Fonts.Medium,
    marginLeft:scale(3),
    fontFamily:Fonts.Medium
  },
  primaryButton: {
    borderRadius: moderateScale(30),
    marginHorizontal: scale(15),
    marginTop: scale(20),
    bottom:scale(15)
  },
});

