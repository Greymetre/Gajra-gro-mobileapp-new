import {StyleSheet, Dimensions} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import appTheme from '../../utils/appTheme';

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    height: height,
    backgroundColor: appTheme.APP_BACKGROUND_COLOR,
    marginHorizontal: width * 0.05,
  },
  big_card_view: {
    borderRadius: 16,
    // backgroundColor: '#FFE7C7',
    backgroundColor: '#FEF8DD',
    width: width - 32,
    height: 200,
    paddingHorizontal: 16,
  },
  image_view: {
    borderRadius: 16,
    width: width - 64,
    height: 200 - 32,
    paddingHorizontal: 16,
  },
  upi_cards: {
    height: 70,
    width: width * 0.5 - 32,
    borderRadius: 18,
    backgroundColor: 'white',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mini_card_view: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: '#EEF7FF',
    width: width * 0.5,
    height: 100,
    paddingLeft: 16,
    // maxWidth: '50%',
    flexDirection: 'row',
    // Uncomment the below
    // justifyContent: 'space-evenly',
  },
  test_card_view: {
    flex: 0.5,
    borderRadius: 16,
    backgroundColor: '#EEF7FF',
    width: width * 0.5 - 16,
    // width: 13,
    height: 100,
    // paddingLeft: 16,
    // flexDirection: 'row',
    // Uncomment the below
    justifyContent: 'space-between',
  },
  text_text: {
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  image_card: {
    alignSelf: 'center',
    justifyContent: 'flex-end',
    paddingLeft: 50,
  },
  bottom_left: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: 65,
    height: 65,
    bottom: 15,
    right: 15,
    elevation: 10,
  },
  row: {},
  other_upi: {
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    // width: 10,
    // height: 48,
  },
  final_text_view: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  image_view_final: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  cardContainer: {
    flexDirection: 'row',
  },
  leftBox: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  rightBox: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  leftText: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  rightImage: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
  },
  ffinalimg: {},
  ffinaltxt: {},
  imageContainer: {
    resizeMode: 'contain',
    height: height * 0.07,
    width: width * 0.4,
  },
  hamMenu: {
    resizeMode: 'contain',
    height: height * 0.07,
    width: width * 0.04,
  },
  button: {
    backgroundColor: '#000',
    flexDirection: 'row',
    paddingHorizontal: responsiveWidth(3),
    justifyContent: 'space-between',
    alignItems: 'center',
    height: responsiveHeight(5.7),
    borderRadius: responsiveWidth(2),
  },
  buttonText: {
    fontSize: responsiveFontSize(2),
    textAlign: 'center',
    color: '#fff',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button_modal: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: appTheme.NEW_PALLET,
  },
  buttonClose: {
    backgroundColor: appTheme.NEW_PALLET,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    color: 'black',
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },


  modalView12: {
    width: "100%",
    alignItems: "center",
  },
  modalTitle12: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  modalText12: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 10,
  },
  helplineNumber12: {
    fontSize: 18,
    fontWeight: "bold",
    color: appTheme.NEW_PALLET,
    marginBottom: 15,
  },
  contactButton12: {
    backgroundColor: appTheme.NEW_PALLET,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText12: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
});

export default styles;
