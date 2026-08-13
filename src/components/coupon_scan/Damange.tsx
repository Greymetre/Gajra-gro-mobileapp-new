import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  BackHandler,
  TextInput,
  Image,
  Modal,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Button, Header as HeaderRNE, Input } from '@rneui/themed';
import QrScanComp from './QrScanComp';
import ImageButton from '../comman/imageButton/ImageButton';
import { Formik, useFormik } from 'formik';
import appTheme from '../../utils/appTheme';
import { requestGetProfileInfo, submitScannedCode } from '../../services/backend_helper';
import { useSelector } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import { getSettingAsyncStorage, getTokenAsyncStorage } from '../../services/auth_helper';
import navigationStrings from '../../constants/navigationStrings';
import { responsiveHeight } from 'react-native-responsive-dimensions';
const { height, width } = Dimensions.get('window');
import Ent from 'react-native-vector-icons/Entypo';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { AttactmentIcon, CameraIcon, PhotosIcon } from '../Svg/Svg';
import { API_URL } from '../../services/api_helper';
import RNFS from 'react-native-fs';
import ImageResizer from '@bam.tech/react-native-image-resizer';

export const DamageQrcodeValidation = yup.object({
  attactmentFirst: yup.mixed().required('Attactment first image is required'),
  // attactmentSecond: yup.mixed().required('Attactment second image is required'),
  // attactmentThird: yup.mixed().required('Attactment third image is required'),
});
export default function Damage(props: any) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [showError, setShowError] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [schemeActive, setSchemeActive] = useState(false);
  const [serialNumber, setSerialNumber] = useState<any>(props?.route?.params?.code ? props?.route?.params?.code : '');
  const [ggNumber, setGgNumber] = useState<any>();

  const [modalVisible, setModalVisible] = useState(false);
  const [firstAttact, setFirstAttact] = useState<any>();
  const [firstHeight, setFirstHeight] = useState<any>();
  const [firstWidth, setFirstWidth] = useState<any>();
  const [secondAttact, setSecondAttact] = useState<any>();
  const [thirdAttact, setThirdAttact] = useState<any>();
  const [imageData, setImageData] = useState<any>();

  const [userData, setuserData] = useState()


  const onSelectCamera = (imageData: any) => {
    const { type, imageValue } = imageData;
    setModalVisible(false);
    openCamera(type, imageValue);
  };

  const onSelectGallery = (imageData: any) => {
    const { type, imageValue } = imageData;
    setModalVisible(false);
    takePhotoFromLibray(1, imageValue);
  };

  const takePhotoFromLibray = (type: any, imageValue: any) => {
    setTimeout(() => {
      ImagePicker.openPicker({
        cropping: false,
      }).then(image => {
        console.log("imageimage",image)
        if (type == 1) {
          setFirstAttact(image?.path);
          setFirstHeight(image?.height)
          setFirstWidth(image?.width)
          imageValue('attactmentFirst', `${image.path}`);
        } else if (type == 2) {
          setSecondAttact(image?.path);
        } else if (type == 3) {
          setThirdAttact(image?.path);
        }
        console.log(image);
      });
    }, 500);
  };
  const openCamera = (type: any, imageValue: any) => {
    setTimeout(() => {
      ImagePicker.openCamera({
        cropping: false,
      }).then(image => {
        if (type == 1) {
          setFirstAttact(image?.path);
          setFirstHeight(image?.height)
          setFirstWidth(image?.width)
          imageValue('attactmentFirst', `${image.path}`);
        } else if (type == 2) {
          setSecondAttact(image?.path);
        } else if (type == 3) {
          setThirdAttact(image?.path);
        }
        console.log(image);
      });
    }, 500);
  };
  const [schemeStartDate, setSchemeStartDate] = useState<Date>(
    new Date('2030-01-01'),
  );
  const initialValues = {
    isCouponSelected: true,
    couponCode: '',
    isFocused: false,
    coupons: [],
    scan: false,
  };


  const nowDate = new Date();
  function handleBackButtonClick() {
    navigation.push(navigationStrings.HOME);
    return true;
  }
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, []);


  useEffect(() => {
    finalFetchProfileInfo()
  }, [])


  const finalFetchProfileInfo = async () => {
    await requestGetProfileInfo({})
      .then(res => {
        setuserData(res?.data?._id)
        if (res.isError === false) {
          // console.log('BIG Response KYC Details - ', res.data);
        }
      })
      .catch(error => {
        console.log('Response: ', error.responses);
      });
  };

  const compressImage1 = async (uri: string) => {
    const resizedImage = await ImageResizer.createResizedImage(uri, 800, 600, 'JPEG', 80);
    return resizedImage.uri;
  };

  const getFileSizeInMB = async (uri: string) => {
    try {
      const stat = await RNFS.stat(uri);
      return stat.size / (1024 * 1024);
    } catch (error) {
      console.error('Error getting file size:', error);
      return 0;
    }
  };
  // const compressImage = async (uri: string) => {
  //   const originalSize = await getFileSizeInMB(uri);
  //   console.log(`Original image size: ${originalSize.toFixed(2)} MB`);
  //   const resizedImage = await ImageResizer.createResizedImage(uri, 500, 400, 'JPEG', 50);
  //   const compressedSize = await getFileSizeInMB(resizedImage.uri);
  //   console.log(`Compressed image size: ${compressedSize.toFixed(2)} MB`);
  //   return resizedImage.uri;
  // };
  const compressImage = async (uri: string) => {
    const originalSize = await getFileSizeInMB(uri);
    console.log(`Original image size: ${originalSize.toFixed(2)} MB`);
    const resizedImage = await ImageResizer.createResizedImage(uri, 1200, 900, 'JPEG', 80);
    const compressedSize = await getFileSizeInMB(resizedImage.uri);
    console.log(`Compressed image size: ${compressedSize.toFixed(2)} MB`);
    return resizedImage.uri;
  };
  

  // const requestProfileImage = async () => {
  //   let formdata = new FormData();
  //   if (firstAttact) {
  //     const compressedUri = await compressImage(firstAttact);
  //     formdata.append(`couponImage`, {
  //       uri: compressedUri,
  //       type: 'image/jpeg',
  //       name: 'image.jpg',
  //     });
  //   }
  //   console.log("*****", serialNumber, ggNumber, userData)
  //   if (serialNumber) {
  //     formdata.append(`couponCode`, serialNumber);
  //   }
  //   if (ggNumber) {
  //     formdata.append(`couponGg`, ggNumber);
  //   }
  //   formdata.append(`customerid`, userData);
  //   console.log(formdata)
  //   const token = await getTokenAsyncStorage();
  //   setIsLoadingSubmit(true)
  //   await fetch(
  //     `${API_URL}/loyalty/transactions/add-invalid`,
  //     {
  //       method: 'POST',
  //       headers: {
  //         Accept: 'application/json',
  //         'Content-Type': 'multipart/form-data',
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: formdata,
  //     },
  //   )
  //     .then(res => res.json())
  //     .then(async resData => {
  //       setIsLoadingSubmit(false)
  //       console.log(resData, 'ddddd')
  //       if (resData?.message == "SUCCESS") {
  //         // navigation.goBack()

  //         Alert.alert('Success', `Coupon Code Send for Approval Points Will Be Credited Once Approved In case any query pls call to Help line Number -81033 24701 \n\nकूपन कोड प्राप्त हो गया कृपया इंतजार करें आपके पॉइंट जमा कर दिए जाएंगे यदि कोई प्रश्न हो तो कृपया हेल्प लाइन नंबर -81033 24701 पर कॉल करें`);
  //         setFirstAttact('')
  //         navigation.navigate(navigationStrings?.COUPON_SCAN)
  //       } else {
  //         Alert.alert(resData?.message)
  //       }
  //     });
  //   setIsLoadingSubmit(false)
  // };

  const requestProfileImage = async () => {
    try {
      let formdata = new FormData();

      if (firstAttact) {
        const compressedUri = await compressImage(firstAttact);
        console.log("Compressed Image URI:", compressedUri);

        // if (!compressedUri || !compressedUri.startsWith("file://")) {
        //   Alert.alert("Invalid Image", "Image compression failed or invalid URI.");
        //   return;
        // }

        formdata.append("couponImage", {
          uri: firstAttact,
          type: "image/jpeg",
          name: "image.jpg",
        });
      }

      if (serialNumber) formdata.append("couponCode", serialNumber);
      if (ggNumber) formdata.append("couponGg", ggNumber);
      formdata.append("customerid", userData);
      console.log("FormData:", (formdata as any)._parts);

      const token = await getTokenAsyncStorage();
      setIsLoadingSubmit(true);

      const makeRequest = async (attempt = 1) => {
        try {
          const response = await fetch(`${API_URL}/loyalty/transactions/add-invalid`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
            body: formdata,
          });

          if (!response.ok) throw new Error("Server error");

          const resData = await response.json();
          console.log("Response:", resData);
          setIsLoadingSubmit(false);

          if (resData?.message === "SUCCESS") {
            // navigation.goBack();
            Alert.alert('Success', `Coupon Code Send for Approval Points Will Be Credited Once Approved In case any query pls call to Help line Number -81033 24701 \n\nकूपन कोड प्राप्त हो गया कृपया इंतजार करें आपके पॉइंट जमा कर दिए जाएंगे यदि कोई प्रश्न हो तो कृपया हेल्प लाइन नंबर -81033 24701 पर कॉल करें`);
            setFirstAttact("");
            // navigation.navigate(navigationStrings.HOME)
            navigation.goBack();
          } else {
            Alert.alert(resData?.message || "Submission failed.");
          }
        } catch (error) {
          if (attempt < 2) {
            console.warn(`Retrying request... Attempt ${attempt + 1}`);
            setTimeout(() => makeRequest(attempt + 1), 2000);
          } else {
            setIsLoadingSubmit(false);
            console.error("Error submitting form:", error);
            Alert.alert("Network error", "Failed to submit. Please try again.");
          }
        }
      };

      // Call API with retry logic
      await makeRequest();
    } catch (error) {
      setIsLoadingSubmit(false);
      console.error("Unexpected error:", error);
      Alert.alert("Unexpected error", "Something went wrong.");
    }
  };



  return (
    <View style={{ backgroundColor: appTheme.APP_BACKGROUND_COLOR, flex: 1 }}>
      <View
        style={{
          // width: width,
          flex: 1,
          backgroundColor: 'white',
        }}>

        <HeaderRNE
         backgroundColor="white"
         backgroundImageStyle={{}}
         barStyle="dark-content"
          centerContainerStyle={{ height: 28, justifyContent: 'center' }}
          // containerStyle={{width: 350}}
          leftComponent={
            <TouchableOpacity
              containerStyle={{ padding: 5 }}
              onPress={() => props.navigation.push('Home')}>
              <Ionicons name="chevron-back" size={25} color={'black'} />
            </TouchableOpacity>
          }
          leftContainerStyle={{ paddingLeft: 5 }}
          linearGradientProps={{}}
          placement="center"
          rightContainerStyle={{}}
          statusBarProps={{}}
          containerStyle={{
            bottom: Platform.OS === "android"
              ? Platform.OS === "android" && Platform.Version <= 34
                ?0
                : height * 0.04
              : 0,
              height:height*0.08,
          }}
          
        />
        <ScrollView>
          <View
            style={{
              alignContent: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 10,
            }}></View>
          <View
            style={{
              // width: width,
              flex: 1,
              backgroundColor: 'white',
            }}>
            <Text style={[styles.textSubTitle]}>{`${t('DAMAGE_SCAN')}`}</Text>

            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <ImageButton
                buttonText=""
                marker={require('../../../assets/images/Dummygg.jpeg')}
                onPress={() => { }}
                style={{ width: width }}
                imgWidth={width}
                imgHeight={180}
                disabled={true}></ImageButton>
            </View>

            <Formik
              // validationSchema={DamageQrcodeValidation}
              enableReinitialize={true}
              initialValues={{
                attactmentFirst: '',
                // attactmentSecond: '',
                // attactmentThird: ''
              }}
              onSubmit={async values => {
                if (firstAttact) {

                  requestProfileImage()
                } else {
                  Alert.alert("Please upload your coupon image")
                }
                console.log('ddjdj', values);
                // submitQRCODE(values)
              }}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                isValid,
                touched,
                setFieldValue,
              }) => {
                return (
                  <>
                    <View style={[styles.mainContainer, { marginHorizontal: 20 }]}>
                      <View style={styles.pointContainer}>
                        <View>
                          <View style={styles.textContainer}>
                            <Text style={styles.text}>
                              Enter QR code Number (Optional)
                            </Text>
                          </View>

                          <View
                            style={[
                              styles.inputBox,
                              { borderColor: 'black', marginVertical: 10 },
                            ]}>
                            <TextInput
                              style={styles.innerBox}
                              autoCapitalize="none"
                              placeholderTextColor={'grey'}
                              // keyboardType='number-pad'
                              //   maxLength={12}
                              value={serialNumber}
                              onChangeText={text => {
                                setSerialNumber(text);
                              }}
                              // onBlur={handleBlur('aadharNo')}
                              placeholder={`Enter QR code Number`}
                            />
                          </View>
                        </View>
                        {errors.attactmentFirst && touched.attactmentFirst && (
                          <Text style={styles.errorText2}>
                            {errors.attactmentFirst}
                          </Text>
                        )}
                        <View>
                          <View style={styles.textContainer}>
                            <Text style={styles.text}>
                              Enter GG Number
                            </Text>
                          </View>

                          <View
                            style={[
                              styles.inputBox,
                              { borderColor: 'black', marginVertical: 10 },
                            ]}>
                            <TextInput
                              style={styles.innerBox}
                              autoCapitalize="none"
                              placeholderTextColor={'grey'}
                              // keyboardType='number-pad'
                              //   maxLength={12}
                              value={ggNumber}
                              onChangeText={text => {
                                setGgNumber(text);
                              }}
                              // onBlur={handleBlur('aadharNo')}
                              placeholder={`Enter GG Number`}
                            />
                          </View>
                        </View>
                        {/* {errors.attactmentFirst && touched.attactmentFirst && (
                        <Text style={styles.errorText2}>
                          {errors.attactmentFirst}
                        </Text>
                      )} */}
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: '100%',

                            alignItems: 'center',
                          }}>
                          <TouchableOpacity
                            style={styles.dragContainer}
                            onPress={() => {
                              console.log('shshhs');
                              setModalVisible(true);
                              setImageData({
                                type: 1,
                                imageValue: setFieldValue,
                              });
                            }}>
                            <AttactmentIcon />
                            <View style={styles.view}>
                              <Text style={styles.dragText}>Upload Image</Text>
                            </View>
                          </TouchableOpacity>

                          <View
                            style={{
                              width: '48%',
                            }}>
                            {imageData && firstAttact ? (
                              <Image
                                source={{
                                  uri: firstAttact,
                                }}
                                style={styles.imageView2}
                              />
                            ) : (
                              <View
                                style={[
                                  styles.imageView2,
                                  {
                                    backgroundColor: '#14347B',
                                  },
                                ]}
                              />
                            )}
                          </View>
                        </View>
                      </View>

                      <View style={{ marginHorizontal: 5, paddingHorizontal: 5 }}>
                        {
                          isLoadingSubmit ?
                            <View style={{
                              alignSelf: "center",
                              backgroundColor: 'orange',
                              borderRadius: 8,
                              alignItems: 'center',
                              height: 50,
                              justifyContent: 'center',
                              width: '100%'
                            }}>
                              <ActivityIndicator size={35} color={'white'} />
                            </View>
                            :
                            <TouchableOpacity
                              onPress={() => {
                                if (firstAttact) {
                                  handleSubmit();
                                } else {
                                  setModalVisible(true)
                                  setImageData({
                                    type: 1,
                                    imageValue: setFieldValue,
                                  });
                                }
                              }}
                              style={{
                                backgroundColor: 'orange',
                                borderRadius: 8,
                                alignItems: 'center',
                                height: 50,
                                justifyContent: 'center'
                              }}>
                              <Text style={{
                                fontSize: 18,
                                fontWeight: 'bold',
                                color: '#FFFFFF'
                              }}>{`${t('submit')}`}</Text>
                            </TouchableOpacity>
                          // <Button
                          //   title={`${t('submit')}`}
                          //   onPress={() => {
                          //     console.log('sss');
                          //     if(firstAttact){
                          //       handleSubmit();
                          //     } else{
                          //       setModalVisible(true)
                          //       setImageData({
                          //         type: 1,
                          //         imageValue: setFieldValue,
                          //       });
                          //     }
                          //   }}
                          //   color={'grey'}
                          //   buttonStyle={{
                          //     backgroundColor: 'orange',
                          //     borderRadius: 8,
                          //   }}
                          //   loading={isLoadingSubmit}
                          // />
                          // )
                        }

                      </View>
                    </View>
                  </>
                );
              }}
            </Formik>
          </View>
          <View style={{ height: 80 }} />
        </ScrollView>
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                onPress={() => {
                  console.log(imageData, '77');
                  onSelectCamera(imageData);
                }}
                style={{ flexDirection: 'row', marginVertical: 10 }}>
                <CameraIcon />
                <Text style={styles.optionText}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  onSelectGallery(imageData);
                }}
                style={{ flexDirection: 'row', marginVertical: 10 }}>
                <PhotosIcon />
                <Text style={styles.optionText}>Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                }}
                style={{ alignItems: 'flex-end' }}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: height * 0.1,
    paddingLeft: 15,
    width: width,
    justifyContent: 'center',
  },
  textTitle: {
    fontWeight: '600',
    fontSize: 6,
    textAlign: 'center',
    // padding: 16,
    color: 'black',
  },
  textSubTitle: {
    fontWeight: '500',
    fontSize: 20,
    textAlign: 'center',
    color: 'black',
  },
  textContent: {
    fontWeight: '500',
    fontSize: 11,
    textAlign: 'center',
    color: '#9A9A9A',
    width: width / 2,
    marginTop: 5,
  },
  textContainer: {
    marginTop: 10,
  },
  inputBox: {
    height: 50,
    borderRadius: 4,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    marginTop: 20,
  },
  innerBox: {
    height: 50,
    color: '#02242D',
    fontSize: 16,
  },
  text: {
    color: '#02242D',
    fontSize: 15,
    opacity: 0.7,
  },
  errorText2: {
    marginTop: 10,
    fontSize: 10,
    color: '#A60014',
  },
  imageView2: {
    height: 147,
    borderRadius: 4,
    width: '100%',
  },
  text2: {
    fontWeight: '500',
    fontSize: 12,
    width: width * 0.88,
    color: 'black',
    marginTop: 20,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingLeft: 7,
  },
  view: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  mainContainer: {
    marginTop: 10,
    // marginHorizontal: ms(0)
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  optionText: {
    fontSize: 16,
    paddingHorizontal: 10,
    color: 'black',
  },
  cancelText: {
    fontSize: 18,
    color: 'red',
  },
  dragContainer: {
    borderWidth: 1,
    borderColor: '#D5D8E2',
    borderStyle: 'dashed',
    alignItems: 'center',
    paddingVertical: 37,
    marginVertical: 20,
    borderRadius: 4,
    width: 145,
  },
  dragText: {
    color: '#282A37',
    fontSize: 14,
  },
  chooseText: {
    color: '#25BAD0',
    fontSize: 14,
  },
  pointContainer: {
    backgroundColor: 'white',
    paddingVertical: 20,
    borderRadius: 20,
    marginBottom: 20,
    marginHorizontal: 10,
  },
});
