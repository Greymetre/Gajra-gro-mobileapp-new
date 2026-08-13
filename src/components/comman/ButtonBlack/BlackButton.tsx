import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import styles from '../ButtonBlack/styles';

export interface BlackBtnProps {
  onPress: Function;
  location: string;
  marker: any;
}
const BlackButton = (props: BlackBtnProps) => {
  // const BlackButton = ({onPress, location, marker}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        props.onPress();
      }}
    >
      <View style={styles.button}>
        <Image
          style={styles.imageStyle}
          source={props.marker}
          resizeMode={'center'}
        />
        <Text style={styles.buttonText}>{props.location}</Text>
      </View>
    </TouchableOpacity>
  );
};
export default BlackButton;


// Ui Code

// import React from 'react';
// import {
//   Dimensions,
//   Image,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// // import LinearGradient from 'react-native-linear-gradient';
// import {
//   responsiveFontSize,
//   responsiveHeight,
//   responsiveWidth,
// } from 'react-native-responsive-dimensions';
// export default function BlackButton(props, { btnStl }) {
//   return (
//     <TouchableOpacity onPress={props.onPress}>
//       <View style={styles.button}>
//         <Image
//           style={{
//             width: 20,
//             height: 20,
//             tintColor: '#fff',
//             marginStart: responsiveWidth(4),
//           }}
//           source={props.marker}
//           resizeMode={'center'}
//         />
//         <Text style={styles.buttonText}>{props.location}</Text>
//       </View>
//     </TouchableOpacity>
//   );
// }
// const styles = StyleSheet.create({
//   container: {
//     justifyContent: 'center',
//     marginHorizontal: responsiveWidth(2),
//   },
//   button: {
//     backgroundColor: '#000',
//     alignItems: 'center',
//     height: responsiveHeight(5.7),
//     flexDirection: 'row',
//     borderRadius: responsiveWidth(2),
//   },
//   buttonText: {
//     fontSize: responsiveFontSize(2),
//     fontFamily: 'Gill Sans',
//     textAlign: 'center',
//     color: '#fff',
//     marginStart: responsiveWidth(2),
//     backgroundColor: 'transparent',
//   },
// });
