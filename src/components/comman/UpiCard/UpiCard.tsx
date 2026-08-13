import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Card} from '@rneui/themed';
import colors from '../../../styles/colors';
const {height, width} = Dimensions.get('window');
export interface IProps {
  onPress: Function;
  img: any;
  bgColor: any;
  style: any;
}
//return to old attach upistyle to touch style and remove card continer
export default function Payment_Card(props: IProps) {
  return (
    <Card containerStyle={styles.upi_cards}>
      {/* <View style={{backgroundColor: props.bgColor}}> */}
      <View style={(styles.final_upi, {backgroundColor: props.bgColor})}>
        <TouchableOpacity onPress={props.onPress}>
          <View style={(styles.final_upi, {backgroundColor: props.bgColor})}>
            <View style={styles.img_container}>
              <Image source={props.img} style={styles.img} />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  // outer_container: {
  //   alignItems: 'center',
  //   borderRadius: 10,
  //   elevation: 5,
  //   flexDirection: 'row',
  //   height: 100,
  //   paddingLeft: 2,
  //   paddingRight: 2,
  //   justifyContent: 'center',
  //   margin: 5,
  //   overflow: 'hidden',
  //   shadowOffset: {width: 1, height: 1},
  //   shadowOpacity: 0.5,
  //   shadowRadius: 3,
  // },
  final_upi: {
    // flex: 0.5,
    borderRadius: 16,
    backgroundColor: '#EEF7FF',
    width: width * 0.5 - 32,
    // width: 13,
    height: 100,
    // flexDirection: 'row',
    // paddingLeft: 16,
    // Uncomment the below
    // justifyContent: 'space-between',
  },
  // container: {
  //   alignItems: 'center',
  //   borderRadius: 10,
  //   elevation: 3,
  //   flexDirection: 'row',
  //   height: 100,
  //   justifyContent: 'center',
  //   shadowColor: colors.black,
  //   // width: 110,
  //   paddingLeft: 2,
  //   paddingRight: 2,
  //   shadowOffset: {width: 1, height: 1},
  //   shadowOpacity: 0.5,
  //   shadowRadius: 3,
  // },
  img_container: {
    // width: 100,
    height: '100%',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {justifyContent: 'center'},
  upi_cards: {
    // flex: 0.5,
    width: width * 0.5 - 32,
    height: 65,
    // width: 190,
    borderRadius: 18,
    backgroundColor: 'white',
    // paddingBottom: 10,
    // alignSelf: 'center',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  // touchcss: {
  //   flex: 0.5,
  //   // width: width * 0.5 - 32,
  //   // height: '100%',
  //   // width: 190,
  //   // borderRadius: 18,
  //   backgroundColor: 'white',
  //   // paddingBottom: 10,
  //   // alignSelf: 'center',
  //   // justifyContent: 'center',
  //   // alignItems: 'center',
  // },
});
// export default Payment_Card;
