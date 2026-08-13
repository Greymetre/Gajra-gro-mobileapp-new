import {StyleSheet} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

const styles = StyleSheet.create({
  titleStyle: {
    color: 'black',
    fontWeight: '400',
    marginTop: responsiveHeight(2),
    fontSize: responsiveFontSize(2),
  },
  pickerContainer: {
    height: responsiveHeight(24),
    borderColor: 'black',
    borderWidth: 1,
    backgroundColor: '#D3D3D3',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsiveWidth(3),
    marginTop: responsiveHeight(2),
  },
  imageCamera: {
    width: 40,
    height: 40,
  },
  add: {
    top: -42,
    right: -15,
    width: 18,
    height: 18,
  },
  titleStyle2: {
    color: 'black',
    fontWeight: '400',
    fontSize: responsiveFontSize(2),
  },
  selectedImage: {
    width: responsiveWidth(92) - 2,
    height: responsiveHeight(24) - 2,
    borderRadius: responsiveWidth(3),
  },
});
export default styles;
