import {StyleSheet} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import colors from '../../../../styles/colors';

const styles = StyleSheet.create({
  stepContainer: {
    marginTop: responsiveHeight(4),
    marginBottom: responsiveHeight(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: responsiveWidth(4),
  },
  stepOne: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  stepTwo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  stepThree: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  viewOne: {
    backgroundColor: colors.grey,
    width: 1,
    borderWidth: 1,
  },
  imageOne: {
    width: 20,
    height: 20,
  },
  viewTwo: {
    backgroundColor: colors.grey,
    width: 1,
  },
  imageTwo: {
    width: 20,
    height: 24,
    borderRadius: 10,
  },
  viewThree: {
    backgroundColor: colors.grey,
    width: 1,
  },
  imageThree: {
    width: 18,
    height: 18,
  },
  viewContainer: {
    marginHorizontal: responsiveHeight(2),
    marginBottom: responsiveHeight(9),
  },
  // Picker Styles
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
