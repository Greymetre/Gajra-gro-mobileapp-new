import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Double} from 'react-native/Libraries/Types/CodegenTypes';

export interface IProps {
  buttonText: string;
  onPress: Function;
  marker: any;
  style?: any;
  imgWidth?: Double;
  imgHeight?: Double;
  disabled?: boolean;
}

export default function ImageButton(props: IProps) {
  return (
    <TouchableOpacity
      onPress={() => {
        props.onPress();
      }}
      disabled={props.disabled ?? false}
    >
      <View style={[styles.button, props.style]}>
        <Image
          style={[
            styles.image,
            {
              width: props.imgWidth ?? responsiveWidth(20),
              height: props.imgHeight ?? responsiveHeight(7),
            },
          ]}
          source={props.marker}
          // resizeMode={'contain'}
        />
        <Text style={styles.buttonText}>{props.buttonText}</Text>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
  },
  buttonText: {
    fontSize: responsiveFontSize(2),
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    color: '#000000',
    marginStart: responsiveWidth(2),
    backgroundColor: 'transparent',
  },
  image: {
    width: responsiveWidth(20),
    height: responsiveHeight(7),
    resizeMode: 'contain',
  },
});
