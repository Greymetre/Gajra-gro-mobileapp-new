import React from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';

import styles from '../Header/styles';

export interface HeaderProps {
  onPress: Function;
  backArrow: any;
  title: string;
}
const Header = (props: HeaderProps) => {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => {
              props.onPress;
            }}>
            <Image
              style={styles.backImage}
              source={props.backArrow}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
          <Text style={styles.titleStyle}>{props.title}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default Header;

// ui Code

// import React from 'react';
// import { Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
// import styles from '../Header/styles';
// const Header = ({ onPress, backArrow, title, imageStyle = {} }) => {
//   return (
//     <SafeAreaView>
//       <View style={styles.container}>
//         <View style={styles.headerContainer}>
//           <TouchableOpacity onPress={onPress}>
//             <Image
//               style={[styles.backImage, imageStyle]}
//               source={backArrow}
//               resizeMode={'contain'}
//             />
//           </TouchableOpacity>
//           <Text style={styles.titleStyle}>{title}</Text>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };
// export default Header;
