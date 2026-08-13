import {StyleSheet} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginHorizontal: responsiveWidth(2),
  },
  button: {
    backgroundColor: '#000',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    height: responsiveHeight(5.7),
    borderRadius: responsiveWidth(2),
  },
  buttonText: {
    fontSize: responsiveFontSize(2),
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    color: '#fff',
    marginStart: responsiveWidth(2),
    backgroundColor: 'transparent',
  },
  imageStyle: {
    width: 20,
    height: 20,
    tintColor: '#fff',
    marginStart: responsiveWidth(4),
  },
});
export default styles;
