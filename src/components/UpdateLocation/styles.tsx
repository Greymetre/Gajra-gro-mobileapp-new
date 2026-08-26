import {StyleSheet} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import appTheme from '../../utils/appTheme';
import colors from '../../styles/colors';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    marginTop: -45,
  },
  headerTitle: {
    color: colors.black,
    fontSize: responsiveFontSize(2.2),
    alignSelf: 'center',
  },
  scrollBody: {
    paddingHorizontal: responsiveWidth(6),
    paddingBottom: responsiveHeight(4),
  },

  /* Hero card — mirrors the black rounded banner used in the side menu */
  hero: {
    backgroundColor: colors.black,
    borderRadius: 18,
    alignItems: 'center',
    paddingVertical: responsiveHeight(3),
    marginTop: responsiveHeight(2),
  },
  heroBadge: {
    height: 74,
    width: 74,
    borderRadius: 37,
    backgroundColor: appTheme.NEW_PALLET,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    color: colors.white,
    fontSize: responsiveFontSize(2),
    marginTop: responsiveHeight(1.5),
  },
  heroSubtitle: {
    color: colors.grey,
    fontSize: responsiveFontSize(1.5),
    marginTop: responsiveHeight(0.6),
    textAlign: 'center',
    paddingHorizontal: responsiveWidth(8),
  },

  sectionLabel: {
    color: colors.blackOpacity50,
    fontSize: responsiveFontSize(1.5),
    letterSpacing: 0.8,
    marginTop: responsiveHeight(3),
    marginBottom: responsiveHeight(1),
  },

  card: {
    backgroundColor: appTheme.SMALL_CARD.trim(),
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.borderColor,
    padding: responsiveWidth(4),
  },
  savedRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  savedIcon: {
    height: 34,
    width: 34,
    borderRadius: 17,
    backgroundColor: appTheme.NEW_PALLET,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: responsiveWidth(3),
  },
  savedValue: {
    color: colors.black,
    fontSize: responsiveFontSize(1.8),
  },
  savedCaption: {
    color: colors.blackOpacity50,
    fontSize: responsiveFontSize(1.4),
    marginTop: 2,
  },

  /* Latitude / longitude pair */
  coordRow: {
    flexDirection: 'row',
  },
  coordBox: {
    flex: 1,
  },
  coordDivider: {
    width: 1,
    backgroundColor: colors.borderColor,
    marginHorizontal: responsiveWidth(3),
  },
  coordLabel: {
    color: colors.blackOpacity50,
    fontSize: responsiveFontSize(1.4),
  },
  coordValue: {
    color: colors.black,
    fontSize: responsiveFontSize(2.2),
    marginTop: responsiveHeight(0.5),
  },
  coordPlaceholder: {
    color: colors.grey,
  },
  accuracyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: responsiveHeight(1.8),
  },
  accuracyText: {
    color: colors.blackOpacity50,
    fontSize: responsiveFontSize(1.4),
    marginLeft: responsiveWidth(1.5),
  },

  /* Buttons */
  detectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
    borderColor: colors.black,
    borderRadius: 10,
    height: responsiveHeight(6),
    marginTop: responsiveHeight(2.5),
  },
  detectText: {
    color: colors.black,
    fontSize: responsiveFontSize(1.8),
    marginLeft: responsiveWidth(2),
  },
  submitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.black,
    borderRadius: 10,
    height: responsiveHeight(6.5),
    marginTop: responsiveHeight(1.5),
  },
  submitButtonDisabled: {
    backgroundColor: colors.grey,
  },
  submitText: {
    color: colors.white,
    fontSize: responsiveFontSize(2),
  },
  helperText: {
    color: colors.blackOpacity50,
    fontSize: responsiveFontSize(1.4),
    textAlign: 'center',
    marginTop: responsiveHeight(1.5),
  },
});

export default styles;
