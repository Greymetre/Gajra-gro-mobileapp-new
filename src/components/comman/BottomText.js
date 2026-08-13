import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
export default function BottomText({onPress,title,sub_title}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: responsiveHeight(3),
      }}
      onPress={onPress}
    >
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.subTitle}> {sub_title}</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  title: {
    fontSize: responsiveFontSize(2),
    color: '#828282',
  },
  subTitle: {
    fontSize: responsiveFontSize(2),
    color: 'black',
    fontWeight: '400',
  },
});
