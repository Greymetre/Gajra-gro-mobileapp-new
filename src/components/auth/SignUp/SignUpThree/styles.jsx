import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

const {StyleSheet} = require('react-native');

const styles = StyleSheet.create({
  viewDob: {
    flex: 1,
    marginStart: responsiveWidth(2),
  },
  stepContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewMonth: {
    flex: 1,
    marginStart: responsiveWidth(2),
  },
  viewYear: {
    flex: 1,
    marginStart: responsiveWidth(2),
  },
  innerContainer: {
    marginHorizontal: responsiveHeight(2),
    marginBottom: responsiveHeight(9),
  },
  viewContainer: {
    justifyContent: 'center',
  },
  imageThree: {
    width: 18,
    height: 18,
  },
  imageTwo: {
    width: 18,
    height: 18,
  },
  imageOne: {
    width: 18,
    height: 18,
  },
  stepOne: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepTwo: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepThree: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepTwo: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepThree: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  stepInnerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    marginHorizontal: responsiveWidth(4),
    marginVertical: responsiveHeight(3),
  },
  innerViewStyle: {
    marginHorizontal: responsiveHeight(2),
    marginBottom: responsiveHeight(9),
  },
  inputView: {
    justifyContent: 'center',
  },
  lineView: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderRadius: 1,
    borderColor: '#B4B4B4',
    marginTop: responsiveHeight(3),
  },
  viewRadioGroup: {
    flexDirection: 'row',
    marginTop: responsiveHeight(2),
  },
  viewPriceRange: {
    marginTop: responsiveHeight(2),
  },
  viewRangeSlider: {
    marginTop: responsiveHeight(2),
  },
  viewInput: {
    flexDirection: 'row',
  },
  dropDownContainer: {
    flexDirection: 'row',
    flex: 3,
    justifyContent: 'space-between',
  },
  viewDropdownOne: {
    flex: 1,
    marginStart: responsiveWidth(2),
  },
  viewDropdownTwo: {
    flex: 1,
    marginTop: responsiveHeight(0.3),
    marginStart: responsiveWidth(2),
  },
  viewDropdownThree: {
    flex: 1,
    marginTop: responsiveHeight(0.3),
    marginStart: responsiveWidth(2),
  },
  viewQuestions: {
    flex: 1,
    marginStart: responsiveWidth(2),
  },
  questionsTitle: {
    flex: 1,
    marginTop: responsiveHeight(2),
  },
  questionsSubTitle: {
    marginTop: responsiveHeight(2),
  },
  checkBoxView: {
    flex: 3,
    marginTop: responsiveHeight(2),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleSurvey: {
    marginTop: responsiveHeight(0.8),
  },
  titleDetails: {
    marginTop: responsiveHeight(0.8),
  },
  titleKyc: {
    marginTop: responsiveHeight(0.8),
  },
});
export default styles;
