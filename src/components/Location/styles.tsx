import {StyleSheet} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

const styles = StyleSheet.create({
  container: {
    flex: 2,
    flexDirection: 'row',
  },
  imageStyle: {
    width: 20,
    height: 20,
    marginStart: responsiveWidth(4),
  },
  backArrow: {
    // resizeMode: 'center',
    height: 20,
    width: 20,
    // marginStart: responsiveWidth(4),
    // top: 10,
    // position: 'absolute',
  },
  dropDownOne: {
    flex: 1,
  },
  dropDownTwo: {
    flex: 1,
  },
  viewStyle: {
    width: responsiveWidth(43),
  },
  viewLocation: {
    marginTop: responsiveHeight(4),
    flex: 0.5,
    marginBottom: responsiveHeight(2),
    justifyContent: 'flex-end',
  },
  bottomContainer: {
    justifyContent: 'center',
    marginHorizontal: responsiveWidth(2),
  },
  button: {
    backgroundColor: '#000',
    alignItems: 'center',
    height: responsiveHeight(5.7),
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: responsiveFontSize(2),
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    color: '#fff',
    marginStart: responsiveWidth(4),
    backgroundColor: 'transparent',
  },
});
export default styles;


// UI Code


// import { StyleSheet } from 'react-native';
// import {
//   responsiveFontSize,
//   responsiveHeight,
//   responsiveWidth,
// } from 'react-native-responsive-dimensions';

// const styles = StyleSheet.create({
//   container: {
//     flex: 2,
//     flexDirection: 'row',
//   },
//   imageStyle: {
//     width: 20,
//     height: 20,
//     marginStart: responsiveWidth(4),
//   },
//   backArrow: {
//     resizeMode: 'cover',
//     height: 20,
//     width: 20,
//     marginStart: responsiveWidth(4),
//     top: 10,
//     position: 'absolute',
//   },
//   dropDownOne: {
//     flex: 1,
//   },
//   dropDownTwo: {
//     flex: 1,
//   },
//   viewStyle: {
//     width: responsiveWidth(43),
//   },
//   viewLocation: {
//     marginTop: responsiveHeight(3),
//     flex: 0.5,
//     marginBottom: responsiveHeight(2),
//     justifyContent: 'flex-end',
//   },
//   bottomContainer: {
//     justifyContent: 'center',
//     marginHorizontal: responsiveWidth(2),
//   },
//   button: {
//     backgroundColor: '#000',
//     alignItems: 'center',
//     height: responsiveHeight(5.7),
//     flexDirection: 'row',
//   },
//   buttonText: {
//     fontSize: responsiveFontSize(2),
//     fontFamily: 'Gill Sans',
//     textAlign: 'center',
//     color: '#fff',
//     marginStart: responsiveWidth(4),
//     backgroundColor: 'transparent',
//   },
//   button: {
//     backgroundColor: '#000',
//     alignItems: 'center',
//     height: responsiveHeight(5.7),
//     flexDirection: 'row',
//   },
//   buttonText: {
//     fontSize: responsiveFontSize(2),
//     fontFamily: 'Gill Sans',
//     textAlign: 'center',
//     color: '#fff',
//     marginStart: responsiveWidth(4),
//     backgroundColor: 'transparent',
//   },
// });
// export default styles;
