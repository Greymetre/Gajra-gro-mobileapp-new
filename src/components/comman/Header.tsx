import React from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Button from './Button';

const {height, width} = Dimensions.get('window');
export default function Header(props: any) {
  return (
    <SafeAreaView>
      <View
        style={{
          height: responsiveHeight(5),
          width: '100%',
          marginStart: responsiveWidth(5),
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: width,
            alignItems: 'center',
          }}>
          {/* <Button onPress={}> */}

          <Image
            style={{
              width: responsiveHeight(2),
              height: responsiveHeight(2),
            }}
            source={props.backArrow}
            resizeMode={'contain'}
            />
            {/* </Button> */}
          <Text
            style={{
              alignSelf: 'center',
              marginStart: responsiveWidth(3),
              fontSize: responsiveFontSize(3),
              fontWeight: '600',
            }}>
            {props.title}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
