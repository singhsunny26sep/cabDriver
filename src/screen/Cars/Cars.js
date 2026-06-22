import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList, Image} from 'react-native';
import { Container } from '../../components/Container/Container';
import { COLORS } from '../../theme/Colors';
import { AppBar } from '../../components/AppBar/AppBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { moderateScale,scale,verticalScale } from '../../utils/Scalling';
import { Fonts } from '../../theme/Fonts';

export default function Cars() {
  const carsData = [
    {
      id: '1',
      name: 'Maruti Suzuki Swift(VXI)',
      type: 'Mini',
      passengers: 4,
      fuel: 'Petrol',
      lastUpdated: '8 Jun 2023',
      status: 'Under Verification',
    },
    {
        id: '2',
        name: 'Maruti Suzuki Swift(VXI)',
        type: 'Mini',
        passengers: 4,
        fuel: 'Petrol',
        lastUpdated: '8 Jun 2023',
        status: 'Under Verification',
      },
  ];

  const renderCarItem = ({item}) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.imageContainer}>
          <Image
            source={{uri:'https://imgd.aeplcdn.com/600x337/n/cw/ec/44709/fortuner-exterior-right-front-three-quarter-20.jpeg?isig=0&q=80'}}
            style={styles.carImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.verificationBadge}>
            <Text style={styles.verificationText}>{item.status}</Text>
          </View>

          <Text style={styles.carName}>{item.name}</Text>
          <Text style={styles.carType}>{item.type}</Text>

          <View style={styles.detailsRow}>
            <View style={styles.detail}>
              <Icon name="account" size={20} color={COLORS.grey} />
              <Text style={styles.detailText}>{item.passengers}</Text>
            </View>
            <View style={styles.detail}>
              <Icon name="gas-station" size={20} color={COLORS.grey} />
              <Text style={styles.detailText}>{item.fuel}</Text>
            </View>
          </View>
          <Text style={styles.lastUpdated}>Last Updated {item.lastUpdated}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
    </View>
  );

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
      <AppBar title="Cars" back />

      <FlatList
        data={carsData}
        renderItem={renderCarItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  cardContent: {
    flexDirection: 'row',
  },
  imageContainer: {
    width: scale(140),
    height: scale(140),
    marginRight: scale(12),
    borderRadius: moderateScale(12),
    overflow: 'hidden',
    backgroundColor: '#F8F8F8',
  },
  carImage: {
    width: '100%',
    height: '100%',
    borderRadius: moderateScale(12),
  },
  detailsContainer: {
    flex: 1,
  },
  verificationBadge: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  verificationText: {
    color: COLORS.grey,
    fontSize: 12,
    fontWeight: '500',
  },
  carName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    color: '#1A1A1A',
  },
  carType: {
    fontSize: 14,
    color: COLORS.grey,
    marginBottom: 12,
    fontWeight: '500',
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    marginLeft: 4,
    color: COLORS.grey,
  },
  lastUpdated: {
    fontSize: 12,
    color: COLORS.grey,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 12,
    marginTop:scale(5),
  },
  editButton: {
    flex: 1,
    paddingVertical:verticalScale(5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:moderateScale(20),
    borderWidth: 1,
    borderColor: COLORS.grey,
    backgroundColor: COLORS.whiteOpacity0,
    minWidth: '45%',
  },
  deleteButton: {
    flex: 1,
    paddingVertical:verticalScale(5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:moderateScale(20),
    backgroundColor: COLORS.gray4,
    minWidth: '45%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  editButtonText: {
    color: COLORS.black,
    fontSize:moderateScale(14),
    fontFamily:Fonts.Medium,
    paddingTop:scale(3),
  },
  deleteButtonText: {
    color: COLORS.white,
    fontSize:moderateScale(14),
    fontFamily:Fonts.Medium,
    paddingTop:scale(3),
  },
});
