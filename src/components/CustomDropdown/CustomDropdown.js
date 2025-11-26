import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  Pressable,
  Image,
} from 'react-native';
import {COLORS} from '../../theme/Colors';
import {moderateScale, scale, verticalScale} from '../../utils/Scalling';
import {Fonts} from '../../theme/Fonts';
import Icon from'react-native-vector-icons/Entypo'

const CustomDropdown = ({
  data,
  onSelect,
  defaultButtonText,
  value,
  ...props
}) => {
  const [visible, setVisible] = useState(false);

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => {
          onSelect(item);
          setVisible(false);
        }}>
        <Text style={styles.itemText}>{item}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setVisible(true)}
        {...props}>
        <Text style={[styles.buttonText, !value && styles.placeholderText]}>
          {value || defaultButtonText}
        </Text>
       <Icon name='chevron-small-down' size={35} color={COLORS.black}/>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setVisible(false)}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.headerText}>Select Gender</Text>
              <TouchableOpacity 
                style={styles.closeButtonContainer} 
                onPress={() => setVisible(false)}
              >
                <Text style={styles.closeButton}>×</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              bounces={false}
              contentContainerStyle={{
                paddingVertical: scale(5)
              }}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  dropdownButton: {
    width: '100%',
    height: verticalScale(45),
    backgroundColor: COLORS.white,
    borderRadius: scale(8),
    borderWidth: 0.5,
    borderColor: COLORS.gray,
    paddingHorizontal: scale(15),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: moderateScale(14),
    fontFamily: Fonts.Regular,
    color: COLORS.gray4,
  },
  placeholderText: {
    color: COLORS.gray,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    maxHeight: '60%',
    backgroundColor: COLORS.white,
    borderRadius: scale(12),
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderColor:COLORS.gray3
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: scale(10),
    paddingHorizontal: scale(15),
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.gray,
    backgroundColor: '#f8f8f8',
  },
  headerText: {
    fontSize: moderateScale(14),
    fontFamily: Fonts.Medium,
    color: COLORS.black,
  },
  closeButton: {
    fontSize: moderateScale(18),
    color: COLORS.gray,
    padding: scale(3),
  },
  itemContainer: {
    padding: scale(12),
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  itemText: {
    fontSize: moderateScale(14),
    fontFamily: Fonts.Regular,
    color: COLORS.black,
  },
  dropdownIcon: {
    width: scale(16),
    height: scale(16),
    tintColor: COLORS.gray,
  },
});

export default CustomDropdown; 