import React, { useEffect, useRef, useState } from 'react';
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
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { DocumentTile, KycCardHeader, KycField, kycStyles } from '../bottomtabs/profile/KycCardParts';
import { API_URL } from '../../services/api_helper';
import RNFS from 'react-native-fs';
import ImageResizer from '@bam.tech/react-native-image-resizer';

export const DamageQrcodeValidation = yup.object({
  attactmentFirst: yup.mixed().required('Attactment first image is required'),
  // attactmentSecond: yup.mixed().required('Attactment second image is required'),
  // attactmentThird: yup.mixed().required('Attactment third image is required'),
});
export default function Damage(props: any) {
  const safeInsets = useSafeAreaInsets();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [showError, setShowError] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [schemeActive, setSchemeActive] = useState(false);
  const [serialNumber, setSerialNumber] = useState<any>(props?.route?.params?.code ? String(props.route.params.code).slice(0, 8) : '');
  const [ggNumber, setGgNumber] = useState<any>();

  const [modalVisible, setModalVisible] = useState(false);
  const [firstAttact, setFirstAttact] = useState<any>();
  const [firstHeight, setFirstHeight] = useState<any>();
  const [firstWidth, setFirstWidth] = useState<any>();
  const [secondAttact, setSecondAttact] = useState<any>();
  const [thirdAttact, setThirdAttact] = useState<any>();
  const [imageData, setImageData] = useState<any>();

  const [userData, setuserData] = useState()


  // iOS can't present the camera/gallery while this Modal is still on screen
  // (or animating out) - the picker call silently does nothing. So on iOS we
  // wait for the Modal's onDismiss before opening the picker.
  const pendingPickerAction = useRef<(() => void) | null>(null);

  const closeModalThen = (action: () => void) => {
    if (Platform.OS === 'ios') {
      pendingPickerAction.current = action;
      setModalVisible(false);
    } else {
      setModalVisible(false);
      setTimeout(action, 500);
    }
  };

  const onModalDismiss = () => {
    const action = pendingPickerAction.current;
    pendingPickerAction.current = null;
    action?.();
  };

  const handlePickerError = (error: any) => {
    console.log('Image picker error >>> ', error);
    if (error?.code === 'E_PICKER_CANCELLED') {
      return;
    }
    if (error?.code === 'E_NO_CAMERA_PERMISSION' || error?.code === 'E_NO_LIBRARY_PERMISSION') {
      Alert.alert(
        'Permission required',
        'Please allow access from Settings to upload an image.',
      );
      return;
    }
    Alert.alert('Unable to open', error?.message || 'Something went wrong. Please try again.');
  };

  const onImagePicked = (type: any, imageValue: any, image: any) => {
    console.log('imageimage', image);
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
  };

  const onSelectCamera = (imageData: any) => {
    const { type, imageValue } = imageData;
    closeModalThen(() => openCamera(type, imageValue));
  };

  const onSelectGallery = (imageData: any) => {
    const { imageValue } = imageData;
    closeModalThen(() => takePhotoFromLibray(1, imageValue));
  };

  const takePhotoFromLibray = (type: any, imageValue: any) => {
    ImagePicker.openPicker({
      cropping: false,
      mediaType: 'photo',
    })
      .then(image => onImagePicked(type, imageValue, image))
      .catch(handlePickerError);
  };
  const openCamera = (type: any, imageValue: any) => {
    ImagePicker.openCamera({
      cropping: false,
      mediaType: 'photo',
    })
      .then(image => onImagePicked(type, imageValue, image))
      .catch(handlePickerError);
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
    // White behind the status bar so it blends with the header; the page itself is grey.
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={dStyles.header}>
        <Pressable
          onPress={() => props.navigation.push('Home')}
          hitSlop={6}
          style={({ pressed }) => [dStyles.headerButton, pressed && { opacity: 0.6 }]}>
          <Ionicons name="chevron-back" size={22} color={appTheme.DARK_BOTTOMTAB} />
        </Pressable>
        <Text style={dStyles.headerTitle} numberOfLines={1}>
          Report Damaged Code
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <Formik
        enableReinitialize={true}
        initialValues={{ attactmentFirst: '' }}
        onSubmit={async values => {
          if (firstAttact) {
            requestProfileImage();
          } else {
            Alert.alert('Please upload your coupon image');
          }
        }}>
        {({ handleSubmit, setFieldValue }) => {
          const openPicker = () => {
            setModalVisible(true);
            setImageData({ type: 1, imageValue: setFieldValue });
          };
          return (
            <KeyboardAwareScrollView
              style={{ backgroundColor: '#F7F7F7' }}
              // Keep the last button clear of the Android nav bar / iPhone home indicator.
        contentContainerStyle={{ paddingBottom: 40 + safeInsets.bottom }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              {/* Intro */}
              <View style={dStyles.intro}>
                <View style={dStyles.introIcon}>
                  <Ionicons name="warning-outline" size={22} color="#D93025" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={dStyles.introTitle}>{`${t('DAMAGE_SCAN')}`}</Text>
                  <Text style={dStyles.introText}>
                    QR damaged or not scanning? Share the codes from the label and a photo — our team
                    will verify and credit your points.
                  </Text>
                </View>
              </View>

              {/* Sample label */}
              <View style={kycStyles.card}>
                <KycCardHeader icon="information-circle-outline" title="Where to find the codes" />
                <View style={dStyles.sampleWrap}>
                  <Image
                    source={require('../../../assets/images/Dummygg.jpeg')}
                    style={dStyles.sampleImage}
                  />
                </View>
                <View style={dStyles.hintRow}>
                  <View style={dStyles.hintDot} />
                  <Text style={dStyles.hintText}>
                    <Text style={dStyles.hintBold}>QR code number</Text> is printed next to the QR
                    (e.g. GS457GDR)
                  </Text>
                </View>
                <View style={dStyles.hintRow}>
                  <View style={dStyles.hintDot} />
                  <Text style={dStyles.hintText}>
                    <Text style={dStyles.hintBold}>GG number</Text> is on the product label (e.g.
                    GG-GGT99)
                  </Text>
                </View>
              </View>

              {/* Codes */}
              <View style={kycStyles.card}>
                <KycCardHeader icon="create-outline" title="Code Details" />
                <KycField
                  label="QR Code Number (Optional)"
                  icon="qr-code-outline"
                  locked={false}
                  value={serialNumber || ''}
                  onChangeText={text => setSerialNumber(text.slice(0, 8))}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  maxLength={8}
                  placeholder="8-character code"
                  helper={`${(serialNumber || '').length}/8 characters`}
                />
                <KycField
                  label="GG Number"
                  icon="barcode-outline"
                  locked={false}
                  value={ggNumber || ''}
                  onChangeText={text => setGgNumber(text)}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  placeholder="e.g. GG-GGT99"
                />
              </View>

              {/* Photo */}
              <View style={kycStyles.card}>
                <KycCardHeader icon="camera-outline" title="Coupon Photo" required />
                <DocumentTile
                  uri={firstAttact || null}
                  locked={false}
                  emptyText="Tap to upload a clear photo of the coupon"
                  onPick={openPicker}
                  onRemove={() => {
                    setFirstAttact(null);
                    setFieldValue('attactmentFirst', '');
                  }}
                  onPreview={openPicker}
                />
              </View>

              {/* Submit */}
              <Pressable
                disabled={isLoadingSubmit}
                onPress={() => {
                  if (firstAttact) {
                    handleSubmit();
                  } else {
                    openPicker();
                  }
                }}
                style={({ pressed }) => [
                  dStyles.submitButton,
                  pressed && { transform: [{ scale: 0.98 }] },
                ]}>
                {isLoadingSubmit ? (
                  <ActivityIndicator color={appTheme.DARK_BOTTOMTAB} />
                ) : (
                  <>
                    <Ionicons name="send" size={18} color={appTheme.DARK_BOTTOMTAB} />
                    <Text style={dStyles.submitText}>
                      {firstAttact ? `${t('submit')}` : 'Upload Photo & Submit'}
                    </Text>
                  </>
                )}
              </Pressable>
            </KeyboardAwareScrollView>
          );
        }}
      </Formik>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onDismiss={onModalDismiss}
        onRequestClose={() => setModalVisible(false)}>
        <Pressable style={dStyles.sheetBackdrop} onPress={() => setModalVisible(false)}>
          <Pressable style={dStyles.sheet} onPress={() => {}}>
            <View style={dStyles.sheetHandle} />
            <Text style={dStyles.sheetTitle}>Upload coupon photo</Text>
            <View style={dStyles.sheetOptions}>
              <Pressable
                onPress={() => onSelectCamera(imageData)}
                style={({ pressed }) => [dStyles.sheetOption, pressed && { opacity: 0.7 }]}>
                <View style={[dStyles.sheetOptionIcon, { backgroundColor: '#E8F0FF' }]}>
                  <Ionicons name="camera" size={24} color="#2F6FED" />
                </View>
                <Text style={dStyles.sheetOptionText}>Camera</Text>
              </Pressable>
              <Pressable
                onPress={() => onSelectGallery(imageData)}
                style={({ pressed }) => [dStyles.sheetOption, pressed && { opacity: 0.7 }]}>
                <View style={[dStyles.sheetOptionIcon, { backgroundColor: '#E4F6EC' }]}>
                  <Ionicons name="images" size={24} color="#1E9E5A" />
                </View>
                <Text style={dStyles.sheetOptionText}>Gallery</Text>
              </Pressable>
            </View>
            <Pressable onPress={() => setModalVisible(false)} style={dStyles.sheetCancel}>
              <Text style={dStyles.sheetCancelText}>Cancel</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const dStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 12,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    zIndex: 2,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F4F4F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1C',
  },
  intro: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '90%',
    alignSelf: 'center',
    marginTop: 16,
    backgroundColor: '#FFF6F5',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FBE0DE',
    padding: 14,
  },
  introIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FDECEA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  introTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1C1C',
  },
  introText: {
    fontSize: 12,
    color: '#6B6B6B',
    marginTop: 4,
    lineHeight: 17,
  },
  sampleWrap: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    backgroundColor: 'white',
    padding: 6,
    overflow: 'hidden',
  },
  sampleImage: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  hintDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: appTheme.NEW_PALLET,
    marginTop: 6,
    marginRight: 8,
  },
  hintText: {
    flex: 1,
    fontSize: 12,
    color: '#6B6B6B',
    lineHeight: 17,
  },
  hintBold: {
    fontWeight: '700',
    color: '#1C1C1C',
  },
  submitButton: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
    height: 52,
    borderRadius: 14,
    backgroundColor: appTheme.NEW_PALLET,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#C9962F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
    color: appTheme.DARK_BOTTOMTAB,
    marginLeft: 8,
  },
  sheetBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 34,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DDDDDD',
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1C',
    textAlign: 'center',
  },
  sheetOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 18,
  },
  sheetOption: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: '#F7F7F7',
    paddingVertical: 16,
  },
  sheetOptionIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1C',
    marginTop: 8,
  },
  sheetCancel: {
    marginTop: 16,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FDECEA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetCancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#D93025',
  },
});

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
