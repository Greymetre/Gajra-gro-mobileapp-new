import React from 'react';
import {Image, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import imagePath from '../../constants/imagePath';
// import imagePath from '../../utils/imagePath';
export default function Picker(props: any) {
  return (
    <View style={{justifyContent: 'center', marginTop: responsiveHeight(2)}}>
      <Text
        style={{
          color: 'black',
          fontWeight: '400',
          fontSize: responsiveFontSize(2),
        }}>
        {props.label}
      </Text>
      <View
        style={{
          height: responsiveHeight(24),
          borderColor: 'black',
          borderWidth: 1,
          backgroundColor: '#D3D3D3',
          borderStyle: 'dashed',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: responsiveWidth(3),
          marginTop: responsiveHeight(2),
        }}>
        <TouchableOpacity
          style={{justifyContent: 'center', alignItems: 'center'}}>
          <View>
            <Image
              style={{
                width: 40,
                height: 40,
              }}
              source={props.camera}
              resizeMode={'center'}
            />
            <Image
              style={{
                top: -42,
                right: -26,
                width: 18,
                height: 18,
              }}
              source={imagePath.ADD}
              resizeMode={'contain'}
            />
          </View>
          <Text>{props.camera_title}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
