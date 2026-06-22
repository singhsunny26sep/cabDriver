import { useNavigation } from '@react-navigation/core';
import { View, Text, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { moderateScale,verticalScale,scale } from '../../utils/Scalling';
import { colors } from '../../constants/colors';

export function AppBar(props) {
  const {
    left,
    right,
    back,
    title,
    elevation = 5,
    onCustomBackPress = undefined,
    fontFamily,
    backgroundColor = '#fff',
    textColor = '#2A2A2A',
    isDarkMode = false,
  } = props;

  const navigation = useNavigation();

  const headerBackgroundColor = isDarkMode ? '#000000' : backgroundColor;
  const headerTextColor = isDarkMode ? '#ffffff' : textColor;

  return (
    <View style={{ flexDirection: 'row', backgroundColor: headerBackgroundColor, height: 50 }}>
      {back ? (
        <View style={{ marginLeft: 1, alignItems: 'center', justifyContent: 'center', flex: 2, backgroundColor: headerBackgroundColor }}>
          <Pressable hitSlop={22} onPress={onCustomBackPress ?? navigation.goBack} style={{ flexDirection: 'row', alignItems: 'center', gap: moderateScale(2) }}>
            <Icon name="angle-left" size={scale(20)} color={'#414141'} />
            <Text style={{ fontFamily: 'poppinsRegular', color: isDarkMode ? '#ffffff' : '#414141', lineHeight: 24, fontSize: 16 }}>
              {'Back'}
            </Text>
          </Pressable>
        </View>
      ) : (
        left
      )}
      <View style={{ flex: 8, justifyContent: 'center', alignItems: 'center', marginLeft: !back ? 25 : 0 }}>
        <Text style={{ fontFamily: 'poppinsMedium', color: headerTextColor, lineHeight: 20, fontSize: 18 }}>
          {title}
        </Text>
      </View>
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 2 }}>
        {right}
      </View>
    </View>
  );
}
