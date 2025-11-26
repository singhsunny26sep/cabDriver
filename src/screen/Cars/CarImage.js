import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Container} from '../../components/Container/Container';
import {COLORS} from '../../theme/Colors';
import {verticalScale, scale, moderateScale} from '../../utils/Scalling';
import {AppBar} from '../../components/AppBar/AppBar';
import {Fonts} from '../../theme/Fonts';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';

export default function CarImage() {
  const navigation = useNavigation();

  const documentItems = [
    {title: 'Front Side with Number Plate', route: 'UploadCarPUC'},
    {title: 'Chassis Number Images', route: 'UploadCarInsurance'},
    {title: 'Back Side with Number Plate', route: 'UploadCarCertificate'},
    {title: 'Left Side Exterior', route: 'UploadCarPermit'},
    {title: 'Right Side Exterior', route: 'UploadCarPermit'},
];

  const renderDocumentItem = item => (
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
      <AppBar title="Car Image" back />
      <View style={styles.container}>
        {documentItems.map(renderDocumentItem)}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(15),
    paddingTop: scale(15),
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: scale(15),
    marginBottom: scale(10),
    borderWidth: 1,
    borderColor: COLORS.gray6,
    borderRadius: moderateScale(8),
    backgroundColor: COLORS.white,
  },
  menuItemText: {
    fontSize: moderateScale(16),
    color: COLORS.black,
    fontFamily: Fonts.Light,
  },
});

