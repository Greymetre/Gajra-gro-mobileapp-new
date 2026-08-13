import { Dimensions, StyleSheet } from "react-native";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import appTheme from "../../../utils/appTheme";
// import appTheme from '../../../utils/appTheme';
const { height, width } = Dimensions.get("window");
const styles = StyleSheet.create({
  imageContainer: {
    resizeMode: "contain",
    height: height * 0.07,
    width: width * 0.4,
  },
  hamMenu: {
    resizeMode: "contain",
    height: height * 0.07,
    width: width * 0.04,
  },
  button: {
    backgroundColor: "#000",
    flexDirection: "row",
    paddingHorizontal: responsiveWidth(3),
    justifyContent: "space-between",
    alignItems: "center",
    height: responsiveHeight(5.7),
    borderRadius: responsiveWidth(2),
  },
  buttonText: {
    fontSize: responsiveFontSize(2),
    textAlign: "center",
    color: "#fff",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
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
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    color: "black",
    fontSize: 18,
    marginBottom: 15,
    textAlign: "center",
  },
});
export default styles;
