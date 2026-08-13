import {StyleSheet} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  linearGradient: {
    borderRadius: responsiveWidth(3),
    height: responsiveHeight(6.4),
    fontWeight: '500',
    marginTop: responsiveHeight(3),
    fontSize: responsiveFontSize(2),
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#fff',
    backgroundColor: 'transparent',
  },
});
export default styles;
