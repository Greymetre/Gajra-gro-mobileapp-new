import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import styles from '../BottomText/styles';

export interface BottomTextProps {
  onPress: Function;
  sub_title: string;
  title: string;
}
const BottomText = (props: BottomTextProps) => {
  // const BottomText = ({onPress, sub_title, title}) => {
  return (
    <View style={styles.titleContainer}>
      <Text style={styles.title}>{props.title}</Text>
      <TouchableOpacity
        onPress={() => {
          props.onPress();
        }}
      >
        <Text style={styles.subTitle}> {props.sub_title}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomText;
