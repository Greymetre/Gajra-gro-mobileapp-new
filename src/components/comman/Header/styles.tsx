// import { color } from '@rneui/base';
import {Dimensions, StyleSheet} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import colors from '../../../styles/colors';
const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    height: responsiveHeight(6),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginTop: responsiveHeight(2),
    // height: responsiveHeight(5),
    width: '100%',
    // paddingTop: 15,
    marginStart: responsiveScreenWidth(5),
    minHeight: 70,
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerContainer: {
    flexDirection: 'row',
    width: width,
    // padding: 10,
    alignItems: 'center',
    //     flexDirection: 'row',
    //     justifyContent: 'space-between',
    //     width: width,
    //     alignItems: 'center',
    //     flex: 1,
  },
  backImage: {
    width: responsiveHeight(2),
    height: responsiveHeight(2),
  },
  titleStyle: {
    alignSelf: 'center',
    // paddingLeft: 59,
    marginStart: responsiveWidth(3),
    fontSize: responsiveFontSize(3),
    fontWeight: '500',
    textAlign: 'center',
    color: colors.black,
  },
});
export default styles;

// UI Code

// import { Dimensions, StyleSheet } from 'react-native';
// import {
//   responsiveFontSize,
//   responsiveHeight,
//   responsiveScreenWidth,
//   responsiveWidth,
// } from 'react-native-responsive-dimensions';
// import colors from '../../../styles/colors';
// const { width } = Dimensions.get('window');

// const styles = StyleSheet.create({
//   container: {
//     height: responsiveHeight(6),
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: colors.white,
//   },
//   safeAreaView: {
//     flex: 1,
//     backgroundColor: colors.white,
//   },
//   headerContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: width,
//     alignItems: 'center',
//     flex: 1,
//   },

//   backImage: {
//     width: responsiveHeight(2),
//     height: responsiveHeight(2),
//     marginStart: responsiveWidth(4),
//   },
//   titleStyle: {
//     fontSize: responsiveFontSize(2),
//     fontWeight: '600',
//     color: colors.black,
//     flex: 1,
//     marginEnd: responsiveWidth(2),
//     textAlign: 'center',
//   },
// });
// export default styles;
