import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Pressable,
  Platform,
  VirtualizedList,
} from "react-native";
import React, { useEffect, useState } from "react";
import imagePath from "../../constants/imagePath";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import * as Yup from "yup";
import { useFormik } from "formik";
import colors from "../../styles/colors";
import InputField from "../comman/InputField/InputField";
import Button from "../comman/Button/Button";
import { AuthKycDetailInterface } from "../../interfaces/auth.interface";
import { useNavigation } from "@react-navigation/native";
import { NavigationInterFace } from "../../interfaces/navigationType.interface";
import {
  requestGetKycInfo,
  requestUpdateCustomerKycInfo,
} from "../../services/backend_helper";
import { KycvalidationSchema } from "../../validations/kyc_validation";
import LinearGradient from "react-native-linear-gradient";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { openCamera } from "react-native-image-crop-picker";
const KycDetails = () => {
  const navigation = useNavigation<NavigationInterFace>();
  const [showAadhar, setShowAadhar] = useState(true);
  const [showPan, setShowPan] = useState(false);
  const [showGstin, setShowGstin] = useState(false);
  const [aadharImg, setAadharImg] = React.useState(null);
  const [gstinImg, setGstinImg] = React.useState(null);
  const [panImg, setPanImg] = React.useState(null);
  const [otherImg, setOtherImg] = React.useState(null);
  const [kycData, setkycData] = useState({});
  const initialValues = {
    gstinNo: "",
    panNo: "",
    aadharNo: "",
    otherNo: "",
    otherName: "",
    aadharimage: "",
    gstinimage: "",
    panimage: "",
    otherimage: "",
  };
  const fetchGetAuthKycInfo = async () => {
    await requestGetKycInfo({})
      .then((res) => {
        console.log(res);
        if (res.isError == false) {
          setkycData(res.data);
          for (const [key, value] of Object.entries(res.data)) {
            if (initialValues.hasOwnProperty(key)) {
              formik.setFieldValue(key, value);
            }
          }
        }
      })
      .catch((error) => {
        console.log("Response: ", error.responses);
      });
  };

  useEffect(() => {
    fetchGetAuthKycInfo();
  }, []);

  const onSubmit = async () => {
    const data = formik.values;
    const iData = new FormData();
    await iData.append("aadharimage", {
      name: aadharImg?.fileName,
      type: aadharImg?.type,
      uri:
        Platform.OS === "ios"
          ? aadharImg?.uri.replace("file://", "")
          : aadharImg?.uri,
    });

    await iData.append("gstinimage", {
      name: gstinImg?.fileName,
      type: gstinImg?.type,
      uri:
        Platform.OS === "ios"
          ? gstinImg?.uri.replace("file://", "")
          : gstinImg?.uri,
    });
    await iData.append("panimage", {
      name: panImg?.fileName,
      type: panImg?.type,
      uri:
        Platform.OS === "ios"
          ? panImg?.uri.replace("file://", "")
          : panImg?.uri,
    });

    await iData.append("otherimage", {
      name: otherImg?.fileName,
      type: otherImg?.type,
      uri:
        Platform.OS === "ios"
          ? otherImg?.uri.replace("file://", "")
          : otherImg?.uri,
    });

    Object.keys(data).forEach((key: string) => {
      iData.append(key, data[key]);
    });

    await requestUpdateCustomerKycInfo(iData)
      .then((res) => {
        console.log(res);
        if (res.isError == false) {
        }
      })
      .catch((error) => {
        console.log("Response: ", error);
      });
  };

  const formik = useFormik<AuthKycDetailInterface>({
    initialValues: initialValues,
    onSubmit,
    validationSchema: KycvalidationSchema,
    enableReinitialize: true,
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <View style={{ flex: 1, marginBottom: 60 }}>
        <View
          style={{
            marginHorizontal: responsiveWidth(4),
            flexDirection: "row",
            marginTop: responsiveWidth(4),
          }}
        >
          <Image style={{ width: 20, height: 20 }} source={imagePath.ALERT} />
          <Text
            style={{
              fontSize: responsiveFontSize(1.6),
              color: colors.black,
              marginHorizontal: responsiveWidth(2),
            }}
          >
            KYC Details
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "80%",
            marginStart: responsiveWidth(2),
            justifyContent: "space-evenly",
          }}
        >
          <View
            style={{
              marginTop: responsiveHeight(2),
              marginStart: responsiveWidth(4),
              width: "30%",
            }}
          >
            <Pressable
              onPress={() => {
                setShowAadhar(true);
                setShowGstin(false);
                setShowPan(false);
              }}
            >
              {showAadhar ? (
                <>
                  <View>
                    <LinearGradient
                      start={{ x: 0, y: 1 }}
                      end={{ x: 0.8, y: 1 }}
                      colors={["#39B8FF", "#39B8FF", "#0029FF"]}
                      style={styles.linearGradient}
                    >
                      <Text style={[styles.buttonText]}>Aadhar</Text>
                    </LinearGradient>
                  </View>
                </>
              ) : (
                <View
                  style={
                    {
                      // marginStart: responsiveWidth(2),
                    }
                  }
                >
                  <Text
                    style={{
                      fontSize: responsiveFontSize(1.6),
                      marginStart: responsiveWidth(4),
                    }}
                  >
                    Aadhar
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
          <View>
            <Pressable
              style={{
                backgroundColor: "#F5F5F5",
                justifyContent: "center",
                marginStart: responsiveWidth(4),
                alignItems: "center",
                marginTop: responsiveHeight(2),
                height: responsiveHeight(4.5),
                width: responsiveWidth(20),
                borderRadius: responsiveWidth(10),
              }}
              onPress={() => {
                setShowAadhar(false);
                setShowGstin(false);
                setShowPan(true);
              }}
            >
              {showPan ? (
                <>
                  <View style={styles.linearGradient}>
                    <LinearGradient
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0.6, y: 1 }}
                      colors={["#39B8FF", "#39B8FF", "#0029FF"]}
                      style={styles.linearGradient}
                    >
                      <Text style={[styles.buttonText]}>PAN</Text>
                    </LinearGradient>
                  </View>
                </>
              ) : (
                <>
                  <Text style={{ fontSize: responsiveFontSize(1.6) }}>PAN</Text>
                </>
              )}
            </Pressable>
          </View>
          <View>
            <Pressable
              style={{
                backgroundColor: "#F5F5F5",
                justifyContent: "center",
                alignItems: "center",
                marginTop: responsiveHeight(2),
                height: responsiveHeight(4.5),
                width: responsiveWidth(20),
                marginStart: responsiveWidth(4),
                borderRadius: responsiveWidth(10),
              }}
              onPress={() => {
                setShowAadhar(false);
                setShowGstin(true);
                setShowPan(false);
              }}
            >
              {showGstin ? (
                <>
                  <View style={styles.linearGradient}>
                    <LinearGradient
                      start={{ x: 0, y: 1 }}
                      end={{ x: 0.8, y: 1 }}
                      colors={["#39B8FF", "#39B8FF", "#0029FF"]}
                      style={styles.linearGradient}
                    >
                      <Text style={[styles.buttonText]}>GSTIN</Text>
                    </LinearGradient>
                  </View>
                </>
              ) : (
                <>
                  <Text style={{ fontSize: responsiveFontSize(1.6) }}>
                    GSTIN
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        </View>
        {showAadhar ? (
          <>
            <View
              style={{ width: "90%", marginHorizontal: responsiveWidth(4) }}
            >
              <InputField
                label="Aadhar Number"
                placeHolder="Aadhar Number"
                placeHolderTextColor={colors.grey}
                value={formik?.values?.aadharNo}
              />
            </View>

            <View
              style={{
                width: "90%",
                marginTop: responsiveHeight(2),
                marginHorizontal: responsiveWidth(4),
              }}
            >
              {/* <Pressable onPress={launchCamera}> */}
              <Text
                style={{
                  fontSize: responsiveFontSize(1.6),
                  color: colors.black,
                }}
              >
                Aadhar Image
              </Text>
              {/* </Pressable> */}

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  height: responsiveHeight(5.5),
                  borderWidth: 1,
                  marginTop: responsiveHeight(1.2),
                  borderRadius: responsiveWidth(3),
                  borderColor: colors.borderColor,
                }}
              >
                <Image
                  style={{
                    width: 30,
                    height: 30,
                    marginStart: 10,
                  }}
                  // source={{ uri: aadharImg.uri }}
                  source={imagePath.GALLERY}
                />
                <TextInput
                  style={{ marginStart: responsiveWidth(2), width: "60%" }}
                />
                <Pressable
                  //   onPress={launchCamera(openCamera)}
                  style={{
                    height: responsiveHeight(5.5),
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: colors.black,
                    borderTopRightRadius: responsiveWidth(2),
                    width: "28%",
                    borderBottomRightRadius: responsiveWidth(2),
                  }}
                >
                  <Text
                    style={{
                      color: colors.white,
                      fontWeight: "bold",
                      fontSize: responsiveFontSize(1.6),
                    }}
                    onPress={() => {
                      launchImageLibrary({ noData: true }, (response) => {
                        if (response) {
                          setAadharImg(response);
                        }
                      });
                    }}
                  >
                    Change
                  </Text>
                </Pressable>
              </View>
            </View>
          </>
        ) : (
          <></>
        )}
        {showPan ? (
          <>
            <View
              style={{ width: "90%", marginHorizontal: responsiveWidth(4) }}
            >
              <InputField
                label="PAN Number"
                placeHolder="PAN Number"
                placeHolderTextColor={colors.grey}
                value={formik?.values?.panNo}
              />
            </View>
            <View
              style={{
                width: "90%",
                marginTop: responsiveHeight(2),
                marginHorizontal: responsiveWidth(4),
              }}
            >
              <Text
                style={{
                  fontSize: responsiveFontSize(1.6),
                  color: colors.black,
                }}
              >
                PAN Image
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  height: responsiveHeight(5.5),
                  borderWidth: 1,
                  marginTop: responsiveHeight(1.2),
                  borderRadius: responsiveWidth(3),
                  borderColor: colors.borderColor,
                }}
              >
                <Image
                  style={{
                    width: 30,
                    height: 30,
                    marginStart: 10,
                  }}
                  source={imagePath.GALLERY}
                />
                <TextInput
                  style={{ marginStart: responsiveWidth(2), width: "60%" }}
                />
                <TouchableOpacity
                  style={{
                    height: responsiveHeight(5.5),
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: colors.black,
                    borderTopRightRadius: responsiveWidth(2),
                    width: "28%",

                    borderBottomRightRadius: responsiveWidth(2),
                  }}
                >
                  <Text
                    style={{
                      color: colors.white,
                      fontWeight: "bold",
                      fontSize: responsiveFontSize(1.6),
                    }}
                  >
                    Change
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <></>
        )}

        {showGstin ? (
          <>
            <View
              style={{ width: "90%", marginHorizontal: responsiveWidth(4) }}
            >
              <InputField
                label="GSTIN Number"
                placeHolder="PAN Number"
                placeHolderTextColor={colors.grey}
                value={formik?.values?.gstinNo}
              />
            </View>
            <View
              style={{
                width: "90%",
                marginTop: responsiveHeight(2),
                marginHorizontal: responsiveWidth(4),
              }}
            >
              <Text
                style={{
                  fontSize: responsiveFontSize(1.6),
                  color: colors.black,
                }}
              >
                GSTIN Image
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  height: responsiveHeight(5.5),
                  borderWidth: 1,
                  marginTop: responsiveHeight(1.2),
                  borderRadius: responsiveWidth(3),
                  borderColor: colors.borderColor,
                }}
              >
                <Image
                  style={{
                    width: 30,
                    height: 30,
                    marginStart: 10,
                  }}
                  source={imagePath.GALLERY}
                />
                <TextInput
                  style={{ marginStart: responsiveWidth(2), width: "60%" }}
                />
                <TouchableOpacity
                  style={{
                    height: responsiveHeight(5.5),
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: colors.black,
                    borderTopRightRadius: responsiveWidth(2),
                    width: "28%",
                    borderBottomRightRadius: responsiveWidth(2),
                  }}
                >
                  <Text
                    style={{
                      color: colors.white,
                      fontWeight: "bold",
                      fontSize: responsiveFontSize(1.6),
                    }}
                  >
                    Change
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <></>
        )}

        {/* <View
          style={{
            width: '90%',
            marginTop: responsiveHeight(2),
            marginHorizontal: responsiveWidth(4),
          }}>
          <Text
            style={{
              fontSize: responsiveFontSize(1.6),
              color: colors.black,
            }}>
            Visiting Card
          </Text>
          <View style={{marginTop: responsiveHeight(2)}}>
            <Image
              style={{
                width: '100%',
                height: responsiveHeight(25),
                borderRadius: responsiveWidth(2),
              }}
              source={imagePath.VISITING_CARD}
            />
          </View>
        </View> */}
        <View
          style={{
            marginLeft: responsiveHeight(3),
            marginRight: responsiveHeight(3),
          }}
        >
          <Button
            title="Update"
            // disabled={!formikDetail.isValid}
            onPress={async () => {
              console.log("error", formik.errors);
              if (formik.isValid) {
                formik.handleSubmit();
                //props.navigation.navigate(navigationStrings.SIGN_UP_TWO);
              } else {
                console.log("Form is Valid: ", !formik.isValid);
              }
            }}
          />
        </View>
      </View>
      {/* <View style={{paddingBottom: responsiveHeight(7)}}></View> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
  linearGradient: {
    // borderRadius: responsiveWidth(3),
    height: responsiveHeight(4.5),
    fontWeight: "500",
    // fontSize: responsiveFontSize(2),
    justifyContent: "center",
    borderRadius: responsiveWidth(10),
  },
  buttonText: {
    fontSize: responsiveFontSize(1.6),
    fontFamily: "Gill Sans",
    textAlign: "center",
    width: responsiveWidth(20),
    color: "#fff",
    backgroundColor: "transparent",
  },
  viewStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: responsiveWidth(10),
    // backgroundColor: '#39B8FF',
    width: responsiveWidth(20),
  },
});

export default KycDetails;
