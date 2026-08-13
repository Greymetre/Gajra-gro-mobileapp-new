import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import colors from '../../../styles/colors';

const {StyleSheet} = require('react-native');

const styles = StyleSheet.create({
  imageStyle: {
    tintColor: colors.blackOpacity30,
    width: responsiveWidth(4),
    height: responsiveHeight(2),
    marginEnd: responsiveWidth(3),
  },
  inputStyle: {
    borderRadius: responsiveWidth(2),
    marginTop: responsiveHeight(1),
  },
  mainStyle: {
    paddingHorizontal: responsiveWidth(2),
    paddingTop: responsiveHeight(1),
  },
  inlineStyle: {
    paddingVertical: responsiveHeight(2),
    fontSize: responsiveFontSize(2),
    flex: 1,
    borderRadius: responsiveWidth(2),
    borderWidth: 1,
    borderColor: colors.borderColor,
    paddingStart: responsiveWidth(2),
  },
  labelTextStyle: {
    fontSize: responsiveFontSize(2),
    color: '#000000',
    marginVertical: responsiveHeight(1),
  },
  flexView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: responsiveHeight(6.6),
    borderWidth: 1,
    marginVertical: responsiveHeight(1),

    borderRadius: responsiveWidth(2),
    borderColor: colors.borderColor,
    paddingStart: responsiveWidth(2),
  },
});
export default styles;
