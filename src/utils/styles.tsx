import {Dimensions, StyleSheet} from 'react-native';
import appTheme from './appTheme';

const {height, width} = Dimensions.get('window');

export const styleModal = StyleSheet.create({
  modal_title_text: {
    color: '#16171E',
    fontFamily: 'Montserrat-SemiBold',
  },
  modal_button_text: {
    color: '#1080E8',
    fontFamily: 'Montserrat-SemiBold',
  },
});

export const styleCommon = StyleSheet.create({
  headingLabelPink: {
    fontSize: appTheme.FONT_SIZE_HEADING_LABEL,
    color: appTheme.PRIMARY_COLOR,
  },
});

export const styleLoading = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
  },
});
