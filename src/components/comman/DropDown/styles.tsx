import {StyleSheet} from 'react-native';
import {responsiveHeight} from 'react-native-responsive-dimensions';

const styles = StyleSheet.create({
  dropDownStyle: {
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 6,
    minHeight: 42,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderTopColor: '#B4B4B4',
  },
  titleStyle: {
    marginBottom: responsiveHeight(0.7),
  },
  imageDrop: {
    width: 15,
    height: 15,
  },
  itemDropDown: {
    backgroundColor: '#fff',
    borderBottomRadius: 20,
  },
  titleDrop: {
    padding: 10,
    borderColor: '#B4B4B4',
    borderWidth: 1,
  },
  itemStyle: {
    padding: 10,
    borderColor: '#B4B4B4',
    borderWidth: 1,
  },
});
export default styles;
