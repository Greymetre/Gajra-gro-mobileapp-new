import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

export interface IProps {
  title: string;
  isLoading: boolean;
  onPress: Function;
  disabled?: boolean;
  style?: any;
  colors: any;
  btnTxtColor?: string;
}

export default function Button(props: IProps) {
  return (
    <TouchableOpacity
      onPress={() => {
        props.onPress();
      }}
      disabled={props.disabled ?? false}
      style={[props.style, {marginTop: responsiveHeight(3)}]}
    >
      <LinearGradient
        start={{x: 0, y: 1}}
        end={{x: 0.8, y: 1}}
        colors={[...props.colors]}
        style={styles.linearGradient}
      >
        <View style={[styles.viewStyle]}>
          <Text
            style={[styles.buttonText, {color: props.btnTxtColor ?? '#FFFFFF'}]}
          >
            {props.title}
          </Text>
          {props.isLoading && (
            <ActivityIndicator
              size="large"
              color="white"
              style={{marginLeft: 20}}
            />
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  linearGradient: {
    // borderRadius: responsiveWidth(3),
    borderRadius: 8,
    // height: responsiveHeight(5.7),
    fontWeight: '500',
    fontSize: responsiveFontSize(2),
    justifyContent: 'center',
    width: responsiveWidth(88),
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    // color: '#fff',
    backgroundColor: 'transparent',
  },
  viewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#39B8FF',
    width: responsiveWidth(90),
  },
});
