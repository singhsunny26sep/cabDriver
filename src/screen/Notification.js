import React from 'react';
import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import {Container} from '../components/Container/Container';
import {COLORS} from '../theme/Colors';
import {AppBar} from '../components/AppBar/AppBar';
import Icon from 'react-native-vector-icons/FontAwesome';
import {moderateScale, scale, verticalScale} from '../utils/Scalling';
import {notificationData} from '../utils/StaticDataBase';
import { Fonts } from '../theme/Fonts';

export default function Notification() {
  const renderItem = ({item, index}) => {
    const showDate =
      index === 0 || notificationData[index - 1].date !== item.date;

    return (
      <>
        {showDate && (
          <View style={styles.dateHeader}>
            <Text style={styles.dateText}>{item.date}</Text>
            <TouchableOpacity>
              <Text style={styles.markAllRead}>Mark all as read</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.notificationItem}>
          <View style={styles.iconContainer}>
            <Icon
              name={item.type === 'payment' ? 'credit-card' : 'user-circle'}
              size={24}
              color="#666"
            />
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        </View>
      </>
    );
  };

  return (
    <Container
      statusBarStyle={'dark-content'}
      statusBarBackgroundColor={COLORS.white}
      backgroundColor={COLORS.white}>
      <AppBar title="Notification" back={true} />
      <FlatList
        data={notificationData}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={10}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  flatListContent: {
    flexGrow: 1,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(8),
  },
  dateText: {
    fontSize:moderateScale(15),
    color:COLORS.gray,
    fontFamily:Fonts.Medium,
  },
  markAllRead: {
    fontSize:moderateScale(15),
    color:COLORS.gray,
    fontFamily:Fonts.Medium,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: moderateScale(16),
    marginBottom: 1,
  },
  iconContainer: {
    marginRight: moderateScale(12),
  },
  contentContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: verticalScale(4),
  },
  title: {
    fontSize:moderateScale(15),
    color: '#000',
    fontFamily:Fonts.Medium,
    flex: 1,
  },
  time: {
    fontSize:moderateScale(15),
    color: COLORS.gray,
    fontFamily:Fonts.Regular,
    marginLeft: moderateScale(8),
  },
  description: {
    fontSize:moderateScale(13),
    color:COLORS.gray,
    fontFamily:COLORS.gray,
    lineHeight:scale(18),
  },
});
