import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

export interface BRProps {
  text: string;
  styleBtn?: any;
  bgColor?: string;
  onPress: Function;
}
export default function ButtonWithRadius(props: BRProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        props.styleBtn,
        {backgroundColor: props.bgColor ?? '#666666'},
      ]}
      onPress={() => {
        props.onPress();
      }}
    >
      {/* <View style={styles.viewStyle}> */}
      <Text style={[styles.buttonText]}>{props.text}</Text>
      {/* </View> */}
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    // backgroundColor: 'red',
    width: responsiveWidth(40),
  },
  buttonText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#000000',
    borderRadius: 8,
    fontWeight: '400',
  },
});
