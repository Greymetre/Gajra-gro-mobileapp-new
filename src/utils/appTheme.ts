import { Dimensions } from 'react-native';
const { height, width } = Dimensions.get("window");

export default {
  APP_BACKGROUND_COLOR: '#FFFFFF',
  PRIMARY_COLOR: '#EF697F',
  FADED_PRIMARY_COLOR: '#F2AEBA',
  NORMAL_WHITE_COLOR: '#FFF',
  // FONT_SIZE_HEADING_LABEL: height * 0.03,
  FONT_SIZE_HEADING_LABEL: 25,
  SECONDARY_COLOR: '#10CCCD',
  NORMAL_RED: 'red',
  NORMAL_BLACK: 'black',
  // NEW_PALLET :'#F4C360',
  NEW_PALLET :'#F7D185',
  LIGHT_TONE :'#F4C360',
  SMALL_CARD :' #FEFAF3',
  DARK1 :'#F7D185',
  DARK_BOTTOMTAB:'#373435',
  FONT_SIZE_SMALL: 12,
  FONT_SIZE_MEDIUM: 14,
  FONT_SIZE_LARGE: 16,
  FONT_WEIGHT_LIGHT: 200,
  FONT_WEIGHT_MEDIUM: 600,
  FONT_WEIGHT_HEAVY: 800,
};


export const screenWidth = Dimensions.get('window').width;
export const screenHeight = Dimensions.get('window').height;