import React from 'react';
import {Text, TextInput, View} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
export default function InputField(props: any) {
  return (
    <View style={{justifyContent: 'center', marginTop: responsiveHeight(2)}}>
      <Text
        style={{
          color: '#000000',
          fontWeight: '400',
          fontSize: responsiveFontSize(2),
        }}>
        {props.label}
      </Text>
      <TextInput
        style={{
          height: responsiveHeight(5.5),
          borderColor: '#ccc',
          color: 'black',
          borderWidth: 1,
          borderRadius: responsiveWidth(3),
          marginTop: responsiveHeight(0.7),
          paddingStart: responsiveWidth(2),
        }}
        placeholder={props.placeholder}
        placeholderTextColor={props.placeholderTextColor}
        secureTextEntry={props.secureTextEntry}
        onChangeText={text => {
          props.onChangeText(text);
        }}
        value={props.value}
      />
    </View>
  );
}
