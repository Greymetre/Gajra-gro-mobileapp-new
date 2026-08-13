import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../Button/styles';

export interface ButtonProps {
  title: string;
  onPress: Function;
  // disabled: Boolean;
}
const Button = (props: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={() => {
        props.onPress();
      }}
    >
      <LinearGradient
        start={{x: 0, y: 1}}
        end={{x: 0.8, y: 1}}
        colors={['#39B8FF', '#39B8FF', '#0029FF']}
        style={styles.linearGradient}
      >
        <Text style={styles.buttonText}>{props.title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default Button;
