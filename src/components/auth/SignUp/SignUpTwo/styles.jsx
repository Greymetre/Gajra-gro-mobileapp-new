import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';

const {StyleSheet} = require('react-native');

const styles = StyleSheet.create({
  stepOne: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepInnerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  lineStyle: {
    borderStyle: 'dashed',
    borderWidth: 1,
    borderRadius: 1,
    borderColor: '#B4B4B4',
    marginTop: responsiveHeight(3),
  },
  titleDetails: {
    marginTop: responsiveHeight(0.8),
  },
  viewStyle: {
    marginHorizontal: responsiveHeight(2),
    marginBottom: responsiveHeight(9),
  },
  innerContainer: {
    justifyContent: 'center',
  },
  stepTwo: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepThree: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageThree: {
    width: 18,
    height: 18,
  },
  titleSurvey: {
    marginTop: responsiveHeight(0.8),
  },
  titleKyc: {
    marginTop: responsiveHeight(0.8),
  },
  imageTwo: {
    width: 18,
    height: 18,
  },
  imageOne: {
    width: 18,
    height: 18,
  },
  stepContainer: {
    marginVertical: responsiveHeight(2),
    marginHorizontal: responsiveWidth(4),
    margin: 40,
  },
});
export default styles;
