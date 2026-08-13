import React from 'react';
import {Image, Text, TextInput, TouchableOpacity, View} from 'react-native';
import styles from '../InputField/styles';

export interface InputFieldInterface {
  label: string;
  placeHolder: string;
  onChangeText?: any;
  inputStyle?: any;
  rightIcon?: any;
  onPressRight?: Function;
  readonly?: boolean;
  placeHolderTextColor? : any;
  value? : any ;
  // ...props
}
const InputField = (props: InputFieldInterface) => {
  // const InputField = ({
  //   label,
  //   placeHolder,
  //   onChangeText = () => {},
  //   inputStyle = {},
  //   rightIcon,
  //   onPressRight,
  //   ...props
  // }) => {
  return (
    <View style={{...styles.inputStyle, ...props.inputStyle}}>
      <Text style={styles.labelTextStyle}>{props.label}</Text>
      <View style={styles.flexView}>
        <TextInput
          placeholder={props.placeHolder}
          onChangeText={text => {
            props.onChangeText(text);
          }}
          editable = {props.readonly ? false : true}
          value={props.value}
        />
        {/* <TextInput placeholder={props.placeHolder} {...props} /> */}
        {!!props.rightIcon ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              props.onPressRight;
            }}
          >
            <Image style={styles.imageStyle} source={props.rightIcon} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default InputField;
