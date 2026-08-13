import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Pressable,
  Dimensions,
  Modal,
  TextInput,
  ImageBackground,
  ToastAndroid,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import imagePath from '../../../constants/imagePath';
import { Dropdown } from 'react-native-element-dropdown';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import colors from '../../../styles/colors';
import DashedLine from 'react-native-dashed-line';
import { useNavigation } from '@react-navigation/native';
import { Image as ImageRNE } from '@rneui/themed';
import {
  requestGetAuthCustomerInfo,
  requestGetCityList,
  requestGetCustomerAddress,
  requestGetKycInfo,
  requestGetProfileInfo,
  requestGetStateList,
  requestPostalCode,
  requestUpdateCustomerDetail,
  requestUpdateCustomerKycInfo,
  requestUpdateCustomerLocation,
} from '../../../services/backend_helper';
import { NavigationInterFace } from '../../../interfaces/navigationType.interface';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import RNFS, { stopUpload } from 'react-native-fs';
import {
  Button as BRNE,
  Button,
  Dialog,
  Header as HeaderRNE,
  Input,
} from '@rneui/themed';
import {
  AuthPersonalDetailInterface,
  ViewAuthInfoInterface,
} from '../../../interfaces/auth.interface';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';
import appTheme, { screenWidth } from '../../../utils/appTheme';
import ImageCropPicker from 'react-native-image-crop-picker';
import { getTokenAsyncStorage } from '../../../services/auth_helper';
import axios from 'axios';
import { API_URL } from '../../../services/api_helper';
import { mpstate } from './city';
import CustomerTypeDropDowm from '../../comman/Address/CustomerTypeDropDowm';
import navigationStrings from '../../../constants/navigationStrings';
import { launchImageLibrary } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { requestCameraPermission, requestGalleryPermission } from './permission';

const Profile = (props: any) => {
  const { height, width } = Dimensions.get('window');
  const navigation = useNavigation<NavigationInterFace>();
  const [profileData, setProfileData] = useState<ViewAuthInfoInterface>();
  const [disabledInput, setdisabledInput] = useState(true);
  const { t } = useTranslation();
  const [ggNumber, setGgNumber] = useState<any>();
  const [CustomerTypeNew, setCustomerTypeNew] = useState<any>();

  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [aadharFileFront, setAadharFileFront] = useState<String | null>();
  const [aadharFileURIFront, setAadharFileURIFront] = useState<String | null>();
  const [aadharFileBack, setAadharFileBack] = useState<String | null>();
  const [aadharFileURIBack, setAadharFileURIBack] = useState<String | null>();
  const [passbookFile, setpassbookFile] = useState<String | null>();
  const [passbookFileURI, setpassbookFileURI] = useState<String | null>();
  const [panFile, setPanFile] = useState<String | null>();
  const [panFileURI, setPanFileURI] = useState<String | null>();
  const [aadharFrontObject, setAaharFrontObject] = useState<any>();
  const [aadharBackObject, setAaharBackObject] = useState<any>();
  const [passbookObject, setPassbookObject] = useState<any>();
  const [panObject, setPanObject] = useState<any>();
  const [avatarObject, setAvatarObject] = useState<any>();
  const [shopObject, setShopObject] = useState<any>();
  const [showShopImg, setShowShopImg] = useState<any>(false);
  const [showAadharFront, setShowAadharFront] = useState<any>(false);
  const [showAadharBack, setShowAadharBack] = useState<any>(false);
  const [showPassbook, setshowPassbook] = useState<any>(false);
  const [showPAN, setShowPan] = useState<any>(false);
  const [conditonalAPI, setConditionalAPI] = useState<any>({});
  const [verificationDB, setVerificationDB] = useState<any>({});
  const [postalCodeData, setPostalCodeData] = useState<any>();

  const [disableNEFT, setDisableNEFT] = useState<any>(true);
  const [newForm, setnewform] = useState<any>('');
  // kyc toggles and options
  const [visibleAF, setVisibleAF] = useState<any>(false);
  const [visibleAB, setVisibleAB] = useState<any>(false);
  const [visibleP, setVisibleP] = useState<any>(false);
  const [visiblePAN, setVisiblePAN] = useState<any>(false);
  const [msgTxt, setMsgTxt] = useState<any>('');
  const [showSubmitMsg, setShowSubmitMsg] = useState<any>(false);


  const [upiIdNumber, setUpiIdNumber] = useState<string | null>(null);
  const [upiIdFile, setUpiIdFile] = useState<String | null>();
  const [upiIdFileURI, setUpiIdFileURI] = useState<String | null>();
  const [showUPIID, setShowUPIID] = useState<any>(false);
  const [visibleUPIID, setVisibleUPIID] = useState<any>(false);
  const [upiObject, setUpiObject] = useState<any>();


  const toggleDialogAF = () => {
    setVisibleAF(!visibleAF);
  };
  const toggleDialogAB = () => {
    setVisibleAB(!visibleAB);
  };
  const toggleDialogP = () => {
    setVisibleP(!visibleP);
  };
  const toggleDialogPAN = () => {
    setVisiblePAN(!visiblePAN);
  };
  const toggleDialog = () => {
    setShowAadharFront(!showAadharFront);
  };
  const toggleDialogAadharBack = () => {
    setShowAadharBack(!showAadharBack);
  };
  const togglePassbook = () => {
    setshowPassbook(!showPassbook);
  };
  const togglePAN = () => {
    setShowPan(!showPAN);
  };

  const toggleDialogUPIID = () => {
    setVisibleUPIID(!visibleUPIID);
  };
  const toggleUPIID = () => {
    setShowUPIID(!showUPIID);
  };


  const initialDetailValues = {
    firmName: '',
    contactPerson: '',
    mobile: 0,
    email: '',
    customerType: '',
  };
  const { country, statename, city } = props;
  const [visibleAvatar, setvisibleAvatar] = useState(false);
  const [visibleShop, setvisibleShop] = useState(false);
  const toggleDialogAvatar = () => {
    setvisibleAvatar(!visibleAvatar);
    // setdisabledInput(true)
  };
  const toggleDialogShop = () => {
    setvisibleShop(!visibleShop);
  };
  const [stateData, setStateData] = useState([]);
  const [stateSelect, setStateSelect] = useState('Madhya Pradesh');
  const fetchGetAuthCustomerInfo = async () => {
    await requestGetAuthCustomerInfo({}).then(res => {

      if (res.isError == false) {
        setProfileData(res.data);
        for (const [key, value] of Object.entries(res.data)) {
          if (initialDetailValues.hasOwnProperty(key)) {
            verifiedFormik.setFieldValue(key, value);
          }
          // if (key === 'address') {
          //   const {address} = res.data;
          //   for (const [key2, value2] of Object.entries(address)) {
          //     formikLocation.setFieldValue(key2, value2);
          //   }
          // }
        }
      }
    });
  };
  const newAadharFront = async () => {
    const granted = await requestCameraPermission();

    if (!granted) {
      return;
    }
    ImageCropPicker.openCamera({
      compressImageQuality: 0.2,
      freeStyleCropEnabled: true,
      cropping: true,
    }).then(async image => {

      setConditionalAPI((conditonalAPI: any) => ({
        ...conditonalAPI,
        aadharFrontImage: false,
      }));
      await setAaharFrontObject({
        name: 'Aadhar Front',
        type: image.mime,
        uri: `${image.path}`,
      });
      await verifiedFormik.setFieldValue('aadharFrontImage', `${image.path}`);
      toggleDialogAF();
    }).catch(err => {
      toggleDialogAF();
      console.error('Error occurred while selecting Aadhar Front image:', err);
    });
  };
  const newAadharBack = async () => {
    const granted = await requestCameraPermission();

    if (!granted) {
      return;
    }
    ImageCropPicker.openCamera({
      compressImageQuality: 0.2,
      freeStyleCropEnabled: true,
      cropping: true,
    }).then(async image => {
      toggleDialogAB()
      setConditionalAPI((conditonalAPI: any) => ({
        ...conditonalAPI,
        aadharBackImage: false,
      }));
      await setAaharBackObject({
        name: 'Aadhar Back',
        type: image.mime,
        uri: `${image.path}`,
      });
      await verifiedFormik.setFieldValue('aadharBackImage', `${image.path}`);
    }).catch(err => {
      toggleDialogAB()
      console.error('Error occurred while selecting Aadhar Back image:', err);
    });
  };
  const newGalleryAadharFront = async () => {
    const granted = await requestGalleryPermission();

    if (!granted) {
      return;
    }
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.2, // same as previous compressImageQuality
        selectionLimit: 1,
      },
      async response => {
        if (response.didCancel || response.errorCode) return;

        const image = response.assets?.[0];
        if (!image) return;

        try {
          const croppedImage = await ImageCropPicker.openCropper({
            path: image.uri!, // picked image URI
            mediaType: 'photo',
            cropping: true,
            freeStyleCropEnabled: true,
          });

          // Update conditional API state
          setConditionalAPI((conditionalAPI: any) => ({
            ...conditionalAPI,
            aadharFrontImage: false,
          }));

          // Save Aadhar Front object
          setAaharFrontObject({
            name: 'Aadhar Front',
            type: croppedImage.mime,
            uri: croppedImage.path,
          });

          // Update Formik field
          verifiedFormik.setFieldValue('aadharFrontImage', croppedImage.path);
          toggleDialogAF();

        } catch (err) {
          console.log('Cropping cancelled or failed', err);
          toggleDialogAF();

        }
      }
    );
  };

  const newGalleryAadharBack = async () => {
    const granted = await requestGalleryPermission();

    if (!granted) {
      return;
    }
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.2, // same as previous compressImageQuality
        selectionLimit: 1,
      },
      async response => {
        if (response.didCancel || response.errorCode) return;

        const image = response.assets?.[0];
        if (!image) return;

        try {
          const croppedImage = await ImageCropPicker.openCropper({
            path: image.uri!, // picked image URI
            mediaType: 'photo',
            cropping: true,
            freeStyleCropEnabled: true,
          });
          toggleDialogAB();
          // Update conditional API state
          setConditionalAPI((conditionalAPI: any) => ({
            ...conditionalAPI,
            aadharBackImage: false,
          }));

          // Save Aadhar Back object
          setAaharBackObject({
            name: 'Aadhar Back',
            type: croppedImage.mime,
            uri: croppedImage.path,
          });

          // Update Formik field
          verifiedFormik.setFieldValue('aadharBackImage', croppedImage.path);
        } catch (err) {
          console.log('Cropping cancelled or failed', err);
          toggleDialogAB();
        }
      }
    );
  };

  const newPassbook = async () => {
    const granted = await requestCameraPermission();

    if (!granted) {
      return;
    }
    ImageCropPicker.openCamera({
      compressImageQuality: 0.2,
      freeStyleCropEnabled: true,
      cropping: true,
    }).then(async image => {

      setConditionalAPI((conditonalAPI: any) => ({
        ...conditonalAPI,
        passbookImage: false,
      }));
      await setPassbookObject({
        name: 'Passbook',
        type: image.mime,
        uri: `${image.path}`,
      });
      await verifiedFormik.setFieldValue('passbookImage', `${image.path}`);
      toggleDialogP();
    }).catch(err => {
      console.error('Error occurred while selecting Passbook image:', err);
      toggleDialogP();
    });
  };
  const newPAN = async () => {
    const granted = await requestCameraPermission();

    if (!granted) {
      return;
    }
    ImageCropPicker.openCamera({
      compressImageQuality: 0.2,
      freeStyleCropEnabled: true,
      cropping: true,
    }).then(async image => {

      setConditionalAPI((conditonalAPI: any) => ({
        ...conditonalAPI,
        panImage: false,
      }));
      await setPanObject({
        name: 'PAN Card',
        type: image.mime,
        uri: `${image.path}`,
      });
      await verifiedFormik.setFieldValue('panImage', `${image.path}`);
      toggleDialogPAN();
    }).catch(err => {
      console.error('Error occurred while selecting PAN image:', err);
      toggleDialogPAN();
    });
  };
  const newGalleryPAN = async () => {
    const granted = await requestGalleryPermission();

    if (!granted) {
      return;
    }
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.2, // same as your previous compressImageQuality
        selectionLimit: 1,
      },
      async response => {
        if (response.didCancel || response.errorCode) return;

        const image = response.assets?.[0];
        if (!image) return;

        try {
          const croppedImage = await ImageCropPicker.openCropper({
            path: image.uri!, // picked image URI
            mediaType: 'photo',
            cropping: true,
            freeStyleCropEnabled: true,
          });

          // Update conditional API state
          setConditionalAPI((conditionalAPI: any) => ({
            ...conditionalAPI,
            panImage: false,
          }));

          // Save PAN object
          setPanObject({
            name: 'PAN Card',
            type: croppedImage.mime,
            uri: croppedImage.path,
          });

          // Update Formik field
          verifiedFormik.setFieldValue('panImage', croppedImage.path);
          toggleDialogPAN();
        } catch (err) {
          console.log('Cropping cancelled or failed', err);
          toggleDialogPAN();
        }
      }
    );
  };


  const newUPIID = async () => {
    const granted = await requestCameraPermission();

    if (!granted) {
      return;
    }
    ImageCropPicker.openCamera({
      compressImageQuality: 0.2,
      freeStyleCropEnabled: true,
      cropping: true,
    }).then(async image => {

      setConditionalAPI((conditonalAPI: any) => ({
        ...conditonalAPI,
        upiImage: false,
      }));
      await setUpiObject({
        name: 'UPIID IMAGE',
        type: image.mime,
        uri: `${image.path}`,
      });
      await verifiedFormik.setFieldValue('upiImage', `${image.path}`);
      toggleDialogUPIID();
    }).catch(err => {
      console.error('Error occurred while selecting UPI ID image:', err);
      toggleDialogUPIID();
    });
  };
  const newGalleryUPIID = async () => {
    const granted = await requestGalleryPermission();

    if (!granted) {
      return;
    }
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.2, // same as your previous compressImageQuality
        selectionLimit: 1,
      },
      async response => {
        if (response.didCancel || response.errorCode) return;

        const image = response.assets?.[0];
        if (!image) return;

        try {
          const croppedImage = await ImageCropPicker.openCropper({
            path: image.uri!, // picked image URI
            mediaType: 'photo',
            cropping: true,
            freeStyleCropEnabled: true,
          });

          // Update conditional API state
          setConditionalAPI((conditionalAPI: any) => ({
            ...conditionalAPI,
            upiImage: false,
          }));

          // Save UPI object
          setUpiObject({
            name: 'UPIID IMAGE',
            type: croppedImage.mime,
            uri: croppedImage.path,
          });

          // Update Formik field
          verifiedFormik.setFieldValue('upiImage', croppedImage.path);
          toggleDialogUPIID();
        } catch (err) {
          console.log('Cropping cancelled or failed', err);
          toggleDialogUPIID();
        }
      }
    );
  };



  const newGalleryPassbook = async () => {
    const granted = await requestGalleryPermission();

    if (!granted) {
      return;
    }
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.2,
        selectionLimit: 1,
      },
      async response => {
        if (response.didCancel || response.errorCode) return;

        const image = response.assets?.[0];
        if (!image) return;

        try {
          const croppedImage = await ImageCropPicker.openCropper({
            path: image.uri!, // picked image URI
            mediaType: 'photo',
            cropping: true,
            freeStyleCropEnabled: true,
          });

          // Update conditional API state
          setConditionalAPI((conditionalAPI: any) => ({
            ...conditionalAPI,
            passbookImage: false,
          }));

          // Save passbook object
          setPassbookObject({
            name: 'Passbook',
            type: croppedImage.mime,
            uri: croppedImage.path,
          });

          // Update Formik field
          verifiedFormik.setFieldValue('passbookImage', croppedImage.path);
          toggleDialogP();

        } catch (err) {
          console.log('Cropping cancelled or failed', err);
          toggleDialogP();

        }
      }
    );
  };

  const avatarCamera = async () => {
    ImageCropPicker.openCamera({
      compressImageQuality: 0.5,
      freeStyleCropEnabled: true,
      cropping: true,
    }).then(async image => {

      setConditionalAPI((conditonalAPI: any) => ({
        ...conditonalAPI,
        avatar: false,
      }));
      await setAvatarObject({
        name: 'Avatar',
        type: image.mime,
        uri: `${image.path}`,
      });
      await verifiedFormik.setFieldValue('avatar', `${image.path}`);
    });
  };
  const avatarGallery = async () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.5,
        selectionLimit: 1,
      },
      async response => {

        if (response.didCancel || response.errorCode) return;

        const image = response.assets?.[0];
        if (!image) return;

        try {
          const croppedImage = await ImageCropPicker.openCropper({
            path: image.uri!, // picked image URI
            mediaType: 'photo',
            cropping: true,
            freeStyleCropEnabled: true,
          });

          // Update conditional API state
          setConditionalAPI((conditionalAPI: any) => ({
            ...conditionalAPI,
            avatar: false,
          }));

          // Save avatar object
          setAvatarObject({
            name: 'Avatar',
            type: croppedImage.mime,
            uri: croppedImage.path,
          });

          // Set formik field
          verifiedFormik.setFieldValue('avatar', croppedImage.path);
        } catch (err) {
          console.log('Cropping cancelled or failed', err);
        }
      }
    );
  };

  const shopCamera = async () => {
    const granted = await requestCameraPermission();

    if (!granted) {
      return;
    }
    ImageCropPicker.openCamera({
      useFrontCamera: false,
      compressImageQuality: 0.5,
      freeStyleCropEnabled: true,
      cropping: true,
    }).then(async image => {
      setConditionalAPI((conditonalAPI: any) => ({
        ...conditonalAPI,
        shopimage: false,
      }));
      await setShopObject({
        name: 'Avatar',
        type: image.mime,
        uri: `${image.path}`,
      });
      await verifiedFormik.setFieldValue('shopimage', image.path);
    });
  };



  const shopGallery = async () => {
    console.log('reddd')
    const granted = await requestGalleryPermission();

    if (!granted) {
      console.log('sss')
      return;
    }
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.5,
        selectionLimit: 1,
      },
      async response => {
        console.log('Response from gallery:', response);
        if (response.didCancel || response.errorCode) return;

        const image = response.assets?.[0];
        if (!image) return;

        try {
          // Step 2: Pass the picked image URI to image-crop-picker
          // const croppedImage = await ImageCropPicker.openCropper({
          //   path: image.uri!,      // picked image URI
          //   width: 300,            // desired crop width
          //   height: 300,           // desired crop height
          //   cropping: true,
          // });

          const croppedImage = await ImageCropPicker.openCropper({
            path: image.uri!, // picked image URI
            mediaType: 'photo',
            cropping: true,
            freeStyleCropEnabled: true,
          })

          // Step 3: Save cropped image
          setConditionalAPI((conditionalAPI: any) => ({
            ...conditionalAPI,
            shopimage: false,
          }));

          setShopObject({
            name: 'Avatar',
            type: croppedImage.mime,
            uri: croppedImage.path,
          });

          verifiedFormik.setFieldValue('shopimage', croppedImage.path);
        } catch (err) {
          console.log('Cropping cancelled or failed', err);
        }
      }
    );
  };





  // const verifiedValidationSchema = Yup.object({
  //   shopimage: Yup.string().required(
  //     `${t('requirederror', { fieldname: `${t('shopimage')}` })}`,
  //   ),
  //   aadharFrontImage: Yup.string().required(
  //     `${t('requirederror', { fieldname: `${t('aadharcardfront')}` })}`,
  //   ),
  //   passbookImage: Yup.string().required(
  //     `${t('requirederror', { fieldname: `${t('pass_cheque')}` })}`,
  //   ),
  //   aadharBackImage: Yup.string().required(
  //     `${t('requirederror', { fieldname: `${t('aadharcardback')}` })}`,
  //   ),
  // });
  const verifiedValidationSchema = Yup.object({
    shopimage: Yup.string().required(
      t('requirederror', { fieldname: t('shopimage') })
    ),
    aadharFrontImage: Yup.string().required(
      t('requirederror', { fieldname: t('aadharcardfront') })
    ),
    passbookImage: Yup.string().when('upiNumber', {
      is: (upiNumber) => !upiNumber || upiNumber.trim() === '',
      then: (schema) =>
        schema.required(t('requirederrorpassbook', { fieldname: t('pass_cheque') })),
      otherwise: (schema) => schema.nullable(),
    }),
    aadharBackImage: Yup.string().required(
      t('requirederror', { fieldname: t('aadharcardback') })
    ),
  });



  const [dbKyc, setDbKyc] = useState({});

  // ----------SUBMIT BUTTON API----------
  const finalSubmit = async () => {
    if (upiIdNumber && (!conditonalAPI.upiImage && !verifiedFormik.values['upiImage'])) {
      ToastAndroid.show('UPI screenshot is required', ToastAndroid.SHORT);
      return
    }
    try {
      const token = await getTokenAsyncStorage();
      let myHeaders = new Headers();
      myHeaders.append('Authorization', `Bearer ${token}`);

      let formdata = new FormData();
      formdata.append('firmName', verifiedFormik?.values?.firmName);
      formdata.append('contactPerson', verifiedFormik?.values?.contactPerson);
      formdata.append('mobile', verifiedFormik?.values?.mobile);
      formdata.append('customerType', CustomerTypeNew);
      formdata.append('address[state]', verifiedFormik?.values?.state);
      formdata.append('address[city]', verifiedFormik?.values?.city);
      formdata.append('address[postalCode]', verifiedFormik?.values?.postalCode);
      formdata.append('address[address]', verifiedFormik?.values?.address);

      // Append UPI Number
      formdata.append("upiNumber", upiIdNumber || "");
      if (aadharFrontObject) formdata.append('aadharimage', aadharFrontObject);
      if (aadharBackObject) formdata.append('aadharBackImage', aadharBackObject);
      if (passbookObject) formdata.append('passbookImage', passbookObject);
      if (panObject) formdata.append('panimage', panObject);
      if (avatarObject) formdata.append('avatar', avatarObject);
      if (shopObject) formdata.append('shopimage', shopObject);
      if (upiObject) formdata.append("upiImage", upiObject);

      console.log('Submitting FormData:', formdata);
      let response = await fetch(`${API_URL}/loyalty/auth/updatePersonalInfo`, {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      let resData = await response.json();
      if (resData?.isError === false) {
        setShowSubmitMsg(true);
        setMsgTxt('Your KYC details have been sent for verification');
        navigation.navigate(navigationStrings.HOME)
        ToastAndroid.show('Your KYC details have been sent for verification', ToastAndroid.SHORT);
      } else {
        throw new Error(resData?.message || 'Unknown error occurred');
      }
    } catch (error: any) {
      console.error('API Error:', error);
      setShowSubmitMsg(true);
      setMsgTxt(error.message);
    }
  };


  const verifiedFormik: any = useFormik({
    initialValues: dbKyc,
    onSubmit: finalSubmit,
    validationSchema: verifiedValidationSchema,
    enableReinitialize: true,
    validateOnMount: true,
  });

  // ----------FETCH PROFILE DATA----------
  useEffect(() => {
    finalFetchProfileInfo();
  }, []);
  const finalFetchProfileInfo = async () => {
    await requestGetProfileInfo({})
      .then(res => {
        if (res.isError === false) {
          console.log('BIG Response KYC Details - ', res.data);
          setDbKyc(res.data);
          setGgNumber(res?.data?.customerType)
          setCustomerTypeNew(res?.data?.customerType)
          if (
            res.data.aadharVerified === true &&
            res.data.bankVerified === true
          ) {
            setDisableNEFT(false);
          }
          if (
            res.data.aadharVerified === true &&
            res.data.aadharBackImage != '' &&
            res?.data?.aadharFrontImage
          ) {
            setVerificationDB((verificationDB: any) => ({
              ...verificationDB,
              aadharVerified: true,
            }));
          }
          if (res.data.panVerified === true && res?.data?.panImage != '') {
            setVerificationDB((verificationDB: any) => ({
              ...verificationDB,
              panVerified: true,
            }));
          }
          if (res.data.upiVerified === true && res?.data?.upiNumber != '') {
            setVerificationDB((verificationDB: any) => ({
              ...verificationDB,
              upiVerified: true,
            }));
            setUpiIdNumber(res?.data?.upiNumber)
          }
          if (res?.data?.upiNumber != '') {
            setUpiIdNumber(res?.data?.upiNumber)
          }
          if (res.data.upiImageVerified === true && res?.data?.upiImage != '') {
            setVerificationDB((verificationDB: any) => ({
              ...verificationDB,
              upiImageVerified: true,
            }));
          }
          if (
            res.data.bankVerified === true &&
            res?.data?.passbookImage != ''
          ) {
            setVerificationDB((verificationDB: any) => ({
              ...verificationDB,
              bankVerified: true,
            }));
          }
          if (res.data.aadharFrontImage !== '') {
            setConditionalAPI((conditonalAPI: any) => ({
              ...conditonalAPI,
              aadharFrontImage: true,
            }));
          }
          if (res.data.aadharBackImage !== '') {
            setConditionalAPI((conditonalAPI: any) => ({
              ...conditonalAPI,
              aadharBackImage: true,
            }));
          }
          if (res.data.panImage !== '') {
            setConditionalAPI((conditonalAPI: any) => ({
              ...conditonalAPI,
              panImage: true,
            }));
          }
          if (res.data.upiImage !== '') {
            setConditionalAPI((conditonalAPI: any) => ({
              ...conditonalAPI,
              upiImage: true,
            }));
          }
          if (res.data.passbookImage !== '') {
            setConditionalAPI((conditonalAPI: any) => ({
              ...conditonalAPI,
              passbookImage: true,
            }));
          }
          if (res.data.avatar !== '') {
            setConditionalAPI((conditonalAPI: any) => ({
              ...conditonalAPI,
              avatar: true,
            }));
          }
          if (res.data.shopimage !== '') {
            setConditionalAPI((conditonalAPI: any) => ({
              ...conditonalAPI,
              shopimage: true,
            }));
          }
        }
      })
      .catch(error => {
        console.log('Response: ', error.responses);
      });
  };

  // ----------GET STATE DATA----------
  useEffect(() => {
    fetchStateData();
  }, [country]);
  const fetchStateData = async () => {
    await requestGetStateList({ country: country }).then(res => {
      if (!res.isError) {
        setStateData(res.data);
        setStateSelect('Madhya Pradesh');
      }
    });
  };


  const handleInputChange = (name: string, value: string) => {
    verifiedFormik.setFieldValue(name, value);
  };
  const [cityData, setCityData] = useState<any>([]);
  const fetchCityData = async () => {
    await requestGetCityList({ state: stateSelect }).then(res => {
      if (!res.isError) {
        if (stateSelect == 'Madhya Pradesh') {
          setCityData(mpstate);
        } else {
          setCityData(res.data);
        }
      }
    });
  };
  useEffect(() => {
    fetchCityData();
  }, [stateSelect]);


  const parseAddress = (address: any) => {
    const parts = address.split(',').map((part: string) => part.trim());
    const data = {
      country: parts[parts.length - 1],
      state: parts[parts.length - 2],
      district: parts[parts.length - 3],
    };
    return data;
  };

  const searchPostCodeArea = async (text: any) => {
    const searchdata = {
      search: text,
    }
    await requestPostalCode(searchdata)
      .then(res => {
        console.log(res, 'resresresresres')
        if (res[0]?.display_name) {
          let dataCheck = res[0]?.display_name.includes(text)
          if (dataCheck == true) {
            const add = parseAddress(res[0]?.display_name);
            console.log(add, 'odoodo')
            handleInputChange('city', add?.district);
            handleInputChange('state', add?.state);
            // setPostalCodeData(add)
          }
        }
      })
      .catch(error => {
        console.log('Response Transactions: ', error);
      });
  }



  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <SafeAreaView style={{ flex: 1 }}>
        <HeaderRNE
          backgroundColor="white"
          barStyle="dark-content"
          centerComponent={{
            text: 'Profile',
            style: { color: 'black', fontSize: 22 },
          }}
          leftComponent={
            <Pressable
              onPress={() =>
                props.route.params?.data == true
                  ? navigation.navigate('Home')
                  : props.navigation.goBack()
              }>
              <Ionicons name="chevron-back" size={25} color={'black'} />
            </Pressable>
          }
          containerStyle={{ marginTop: -45 }}
          placement="center"
        />
        <KeyboardAwareScrollView
          style={{ marginTop: responsiveHeight(1) }}
          showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1, marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View
                style={{
                  marginHorizontal: responsiveWidth(4),
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View style={{ flexDirection: 'row' }}>
                  {verifiedFormik?.values['avatar'] ? (
                    <ImageRNE
                      style={{ height: 60, width: 60, borderRadius: 30 }}
                      source={{
                        uri: conditonalAPI.avatar
                          ? `${imagePath.IMAGE_URL}${verifiedFormik.values['avatar']}`
                          : `${verifiedFormik.values['avatar']}`,
                        cache: 'reload',
                      }}
                    />
                  ) : (
                    <Ionicons name="person-circle-outline" size={100} />
                  )}
                </View>
                <View
                  style={{
                    alignItems: 'baseline',
                    marginHorizontal: responsiveWidth(4),
                  }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: 'black',
                    }}>
                    {profileData?.contactPerson}
                  </Text>
                  <Text
                    style={{
                      paddingTop: 5,
                      fontSize: 17,
                      color: 'grey',
                    }}>
                    {'+91 ' + verifiedFormik?.values?.mobile}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  marginHorizontal: responsiveWidth(2),
                  flex: 1,
                }}>
                <BRNE
                  // title={'Edit Profile'}
                  color={appTheme.NEW_PALLET}
                  type="solid"
                  onPress={() => setdisabledInput(false)}
                  icon={
                    <Feather
                      name="edit"
                      color="black"
                      size={22}
                      style={{ paddingHorizontal: 3 }}
                    />
                  }
                  iconPosition="right"
                  buttonStyle={{
                    backgroundColor: appTheme.NEW_PALLET,
                    borderRadius: 8,
                  }}
                  titleStyle={{ color: 'black' }}
                  containerStyle={{ paddingTop: 10 }}
                />
                {/* <TouchableOpacity
                style={{
                  width: '70%',
                  padding: 10,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: responsiveWidth(2),
                  backgroundColor: colors.black,
                }}>
                <Text
                  style={{
                    fontSize: responsiveFontSize(1.4),
                    color: colors.white,
                  }}>
                  Edit Profile
                </Text>
                <View style={{width: responsiveWidth(3.5)}}></View>
                <Image
                  style={{width: 10, height: 10}}
                  source={imagePath.EDIT}
                />
              </TouchableOpacity> */}
              </View>
            </View>
            <View
              style={{
                marginTop: responsiveHeight(3),
              }}>
              <DashedLine
                dashGap={7}
                dashLength={4}
                dashThickness={1}
                dashColor="#ccc"
              />
            </View>
            <View style={{ paddingHorizontal: 10 }}>
              <View style={{ marginHorizontal: 10 }}>
                <View style={styles.textContainer}>
                  <Text style={styles.text}>Customer type</Text>
                </View>
                <View
                  style={[
                    styles.inputBox,
                    { borderColor: 'rgba(0,0,0,0.08)', marginVertical: 10 },
                  ]}>
                  <TextInput
                    style={styles.innerBox}
                    autoCapitalize="none"
                    editable={false}
                    placeholderTextColor={'grey'}
                    // keyboardType='number-pad'
                    //   maxLength={12}
                    value={ggNumber}
                    onChangeText={text => { }}
                    // onBlur={handleBlur('aadharNo')}
                    placeholder={`Customer type`}
                  />
                </View>
              </View>

              <Input
                containerStyle={styles.textInputContainer}
                inputContainerStyle={styles.textInputContainer1}
                renderErrorMessage={false}
                value={verifiedFormik?.values?.firmName}
                disabled={disabledInput}
                label={`${t('shopname')}`}
                onChangeText={(text: string) => {
                  verifiedFormik.setFieldValue('firmName', text);
                }}
                labelStyle={styles.textInputLabel}
              />

              <Input
                containerStyle={styles.textInputContainer}
                inputContainerStyle={styles.textInputContainer1}
                renderErrorMessage={false}
                value={verifiedFormik?.values?.contactPerson}
                disabled={disabledInput}
                label={`${t('name')}`}
                onChangeText={(text: string) => {
                  verifiedFormik.setFieldValue('contactPerson', text);
                }}
                labelStyle={styles.textInputLabel}
              />

              <Input
                containerStyle={styles.textInputContainer}
                inputContainerStyle={styles.textInputContainer1}
                renderErrorMessage={false}
                value={verifiedFormik.values.mobile?.toString()}
                disabled={true}
                label={`${t('phoneno')}`}
                onChangeText={(text: string) => {
                  verifiedFormik.setFieldValue('mobile', parseInt(text));
                }}
                labelStyle={styles.textInputLabel}
              />

              <Input
                containerStyle={styles.textInputContainer}
                inputContainerStyle={styles.textInputContainer1}
                renderErrorMessage={false}
                value={verifiedFormik?.values?.address}
                onChangeText={(text: string) => {
                  verifiedFormik.setFieldValue('address', text);
                  // formik.setFieldValue()
                }}
                label={`${t('address')}`}
                labelStyle={styles.textInputLabel}
                disabled={disabledInput}
              />
              {verifiedFormik.errors.address && (
                <Text style={{ paddingLeft: 10, fontSize: 11, color: 'red' }}>
                  {verifiedFormik.errors.address}
                </Text>
              )}

              <Input
                containerStyle={styles.textInputContainer}
                inputContainerStyle={styles.textInputContainer1}
                maxLength={6}
                renderErrorMessage={false}
                value={verifiedFormik?.values?.postalCode}
                onChangeText={(text: string) => {
                  verifiedFormik.setFieldValue('postalCode', text);
                  if (text.length == 6) {
                    console.log(text, 'oooododoodo')
                    searchPostCodeArea(text)
                  }
                  // formik.setFieldValue()
                }}
                disabled={disabledInput}
                keyboardType="numeric"
                label={`${t('postalcode')}`}
                labelStyle={styles.textInputLabel}
              />
              {verifiedFormik.errors.postalCode && (
                <Text style={{ paddingLeft: 10, fontSize: 11, color: 'red' }}>
                  {verifiedFormik.errors.postalCode}
                </Text>
              )}

              <Text
                style={styles.labelStateCity}>
                {`${t('select')} ${t('state')}`}
              </Text>
              <View
                style={styles.stateCityContainer}>
                <Dropdown
                  data={stateData}
                  style={styles.stateCityDropdownWrapper}
                  search={true}
                  containerStyle={{ borderRadius: 8 }}
                  dropdownPosition={'top'}
                  selectedTextStyle={{ color: disabledInput ? 'grey' : 'black' }}
                  disable={disabledInput}
                  selectedTextProps={{ selectionColor: 'black' }}
                  itemTextStyle={{ paddingLeft: 10 }}
                  inputSearchStyle={{
                    height: 40,
                  }}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder={`${t('select')} ${t('state')}`}
                  searchPlaceholder="Search..."
                  value={verifiedFormik.values.state}
                  onChange={(item: any) => {
                    handleInputChange('state', item.value);
                    setStateSelect(item?.value);
                  }}
                />
              </View>
              {verifiedFormik.errors.state && (
                <Text style={{ paddingLeft: 10, fontSize: 11, color: 'red' }}>
                  {verifiedFormik.errors.state}
                </Text>
              )}

              <Text
                style={styles.labelStateCity}>
                {`${t('select')} ${t('city')}`}
              </Text>
              <View
                style={styles.stateCityContainer}>
                <Dropdown
                  style={styles.stateCityDropdownWrapper}
                  selectedTextStyle={{ color: disabledInput ? 'grey' : 'black' }}
                  disable={disabledInput}
                  containerStyle={{ borderRadius: 8 }}
                  selectedTextProps={{ selectionColor: 'black' }}
                  itemTextStyle={{ paddingLeft: 10 }}
                  inputSearchStyle={{
                    height: 40,
                  }}
                  dropdownPosition={'top'}
                  showsVerticalScrollIndicator={true}
                  search={true}
                  data={cityData}
                  labelField="label"
                  valueField="value"
                  placeholder={`${t('select')} ${t('city')}`}
                  searchPlaceholder="Search City"
                  value={verifiedFormik.values.city}
                  onChange={(item: any) => {
                    handleInputChange('city', item.value);
                  }}
                />
              </View>
              {verifiedFormik.errors?.city && (
                <Text style={{ paddingLeft: 10, fontSize: 11, color: 'red' }}>
                  {verifiedFormik.errors?.city}
                </Text>
              )}
            </View>

            {!disabledInput ?
              <View style={{ paddingHorizontal: 10, marginHorizontal: 10, marginTop: 13 }}>
                <View style={styles.textContainer}>
                  <Text style={{ fontSize: 14, color: '#000000' }}>{conditonalAPI.avatar ? 'Update Profile Image' : 'Upload Profile Image'}</Text>
                </View>
                <View
                  style={styles.profileImageBoxWrapper}>
                  {verifiedFormik?.values['avatar'] ? (
                    <ImageRNE
                      style={styles.boxImage}
                      source={{
                        uri: conditonalAPI.avatar
                          ? `${imagePath.IMAGE_URL}${verifiedFormik.values['avatar']}`
                          : `${verifiedFormik.values['avatar']}`,
                        cache: 'reload',
                      }}
                    />
                  ) : null}
                  <View
                    style={styles.boxImageUploadButton}>
                    <View style={{ flexDirection: 'row' }}>
                      <Button
                        title={'Upload'}
                        titleStyle={{ color: 'black' }}
                        onPress={toggleDialogAvatar}
                        color={'#FFE7C7'}
                        containerStyle={{
                          borderRadius: 18,
                          // borderTopRightRadius: 18,
                          // borderBottomRightRadius: 18,
                          padding: 3,
                        }}
                        iconPosition="right"
                        icon={
                          <Ionicons
                            name="cloud-upload"
                            size={20}
                            // color={'#585858'}
                            color={'black'}
                            style={{
                              paddingHorizontal: 5,
                              alignSelf: 'flex-end',
                            }}
                          />
                        }
                      />
                    </View>
                  </View>
                </View>
              </View>
              : null}


            <Text
              style={styles.shopLabelText}>
              <Text style={{ fontSize: 14, color: 'black' }}>{'Shop Image'}</Text>
              <Text style={{ color: 'red' }}>*</Text>
            </Text>
            <View
              style={styles.boxWrapper}>
              <View
                style={styles.boxCrossIcon}>
                <Ionicons
                  name="close-circle-outline"
                  size={25}
                  color={'red'}
                  onPress={() => {
                    verifiedFormik.setFieldValue('shopimage', '');
                    // setShop(null);
                    // setAadharFileURIBack(null);
                  }}
                />
              </View>
              {verifiedFormik.values['shopimage'] ? (
                <ImageRNE
                  style={styles.boxImage}
                  onPress={() => setShowShopImg(true)}
                  source={{
                    uri: conditonalAPI.shopimage
                      ? `${imagePath.IMAGE_URL}${verifiedFormik.values['shopimage']}`
                      : `${verifiedFormik.values['shopimage']}`,
                    cache: 'reload',
                  }}
                />
              ) : null}
              <View
                style={styles.boxImageUploadButton}>
                <View style={{ flexDirection: 'row' }}>
                  <Button
                    title={'Upload'}
                    titleStyle={{ color: 'black' }}
                    onPress={toggleDialogShop}
                    color={'#FFE7C7'}
                    containerStyle={{
                      borderRadius: 18,
                      // borderTopRightRadius: 18,
                      // borderBottomRightRadius: 18,
                      padding: 3,
                    }}
                    iconPosition="right"
                    icon={
                      <Ionicons
                        name="cloud-upload-sharp"
                        size={20}
                        // color={'#585858'}
                        color={'black'}
                        style={{
                          paddingHorizontal: 5,
                          alignSelf: 'flex-end',
                        }}
                      />
                    }
                  />
                </View>
              </View>
              {showShopImg ? (
                <Modal animationType="slide" transparent={true}>
                  <Dialog
                    overlayStyle={{ borderRadius: 20 }}
                    isVisible={showShopImg}
                    onBackdropPress={() => setShowShopImg(!showShopImg)}>
                    <View
                      style={styles.modalView}>
                      <Image
                        style={styles.modalImage}
                        source={{
                          uri: conditonalAPI.shopimage
                            ? `${imagePath.IMAGE_URL}${verifiedFormik.values['shopimage']}`
                            : `${verifiedFormik.values['shopimage']}`,
                          cache: 'reload',
                        }}></Image>
                    </View>
                  </Dialog>
                </Modal>
              ) : null}
              <View style={{ padding: 1 }}></View>
            </View>
            {verifiedFormik.errors.shopimage && (
              <Text style={{ fontSize: 11, color: 'red', paddingLeft: 20 }}>
                {verifiedFormik.errors.shopimage}
              </Text>
            )}
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignContent: 'center',
              alignItems: 'center',
              paddingTop: 10,
              justifyContent: 'space-evenly',
            }}>
            <View
              style={{
                borderBottomColor: 'black',
                borderBottomWidth: StyleSheet.hairlineWidth,
                width: width / 2 - 80,
                borderWidth: 0.7,
                borderColor: 'black',
              }}
            />
            <Text style={{ color: 'black', fontSize: 16, margin: 5 }}>
              KYC Details
            </Text>
            <FontAwesome name="id-card" size={20} color={'black'} />
            <View
              style={{
                borderBottomColor: 'black',
                borderBottomWidth: StyleSheet.hairlineWidth,
                width: width / 2 - 80,
                borderWidth: 0.7,
                borderColor: 'black',
              }}
            />
          </View>


          <View
            style={{
              padding: 10,
              paddingLeft: 20,
              justifyContent: 'flex-start',
              flexDirection: 'row',
            }}>
            <Text style={{ fontSize: 14, paddingRight: 10, color: 'black' }}>
              <Text style={{ fontSize: 14, color: 'black' }}>
                {t('aadharcardfront')}
              </Text>
              <Text style={{ color: 'red' }}>*</Text>
            </Text>
            {verificationDB.aadharVerified === true ? (
              <View
                style={styles.verifiedView}>
                <Ionicons
                  name="checkmark-circle"
                  color={'green'}
                  size={15}
                  style={{ paddingLeft: 10 }}
                />
                <Text
                  style={styles.verifiedText}>
                  {t('verified')}
                </Text>
              </View>
            ) : (
              <View
                style={styles.notVerifiedView}>
                <Ionicons
                  name="close-circle"
                  color={'red'}
                  size={15}
                  style={{ paddingLeft: 10 }}
                />
                <Text
                  style={styles.notVerifiedText}>
                  {t('notverified')}
                </Text>
              </View>
            )}
          </View>

          <View
            style={styles.boxWrapper}>
            {verificationDB.aadharVerified != true ?
              <View
                style={styles.boxCrossIcon}>
                <Ionicons
                  name="close-circle-outline"
                  size={25}
                  color={'red'}
                  onPress={() => {
                    verifiedFormik.setFieldValue('aadharFrontImage', '');
                    setAadharFileFront(null);
                    setAadharFileURIFront(null);
                  }}
                />
              </View>
              : null}

            {
              verifiedFormik.values['aadharFrontImage'] ? (
                <ImageRNE
                  style={styles.boxImage}
                  onPress={() => setShowAadharFront(true)}
                  source={{
                    uri: conditonalAPI.aadharFrontImage
                      ? `${imagePath.IMAGE_URL}${verifiedFormik.values['aadharFrontImage']}`
                      : `${verifiedFormik.values['aadharFrontImage']}`,
                    cache: 'reload',
                  }}
                />
              ) : null
            }

            {verificationDB.aadharVerified != true ?
              <View
                style={styles.boxImageUploadButton}>
                <View style={{ flexDirection: 'row' }}>
                  {/* <Button
                onPress={() => newcrop()}
                color={'#FFE7C7'}
                containerStyle={{
                  borderTopLeftRadius: 18,
                  borderBottomLeftRadius: 18,
                  padding: 3,
                }}
                icon={
                  <Icon
                    name="camera"
                    size={25}
                    color={'#585858'}
                    style={{
                      alignSelf: 'flex-end',
                    }}
                  />
                }
              /> */}
                  <Button
                    title={'Upload'}
                    titleStyle={{ color: 'black' }}
                    // onPress={() => openGalleryAadharFront()}
                    onPress={toggleDialogAF}
                    disabled={verificationDB.aadharVerified}
                    color={'#FFE7C7'}
                    containerStyle={{
                      borderRadius: 18,
                      // borderTopRightRadius: 18,
                      // borderBottomRightRadius: 18,
                      padding: 3,
                    }}
                    iconPosition="right"
                    icon={
                      <Ionicons
                        name="cloud-upload-sharp"
                        size={20}
                        // color={'#585858'}
                        color={'black'}
                        style={{
                          paddingHorizontal: 5,
                          alignSelf: 'flex-end',
                        }}
                      />
                    }
                  />
                </View>
              </View> : null}

            <View style={{ padding: 1 }}></View>
          </View>
          {showAadharFront ? (
            <Modal animationType="slide" transparent={true}>
              <Dialog
                overlayStyle={{ borderRadius: 20 }}
                isVisible={showAadharFront}
                onBackdropPress={toggleDialog}>
                <View
                  style={styles.modalView}>
                  <Image
                    style={styles.modalImage}
                    source={{
                      uri: conditonalAPI.aadharFrontImage
                        ? `${imagePath.IMAGE_URL}${verifiedFormik.values['aadharFrontImage']}`
                        : `${verifiedFormik.values['aadharFrontImage']}`,
                      cache: 'reload',
                    }}></Image>
                </View>
              </Dialog>
            </Modal>
          ) : null}
          {verifiedFormik.errors.aadharFrontImage && (
            <Text style={{ fontSize: 11, color: 'red', paddingLeft: 20 }}>
              {verifiedFormik.errors.aadharFrontImage}
            </Text>
          )}


          <View
            style={{
              padding: 10,
              paddingLeft: 20,
              justifyContent: 'flex-start',
              flexDirection: 'row',
            }}>
            <Text style={{ fontSize: 14, paddingRight: 10, color: 'black' }}>
              <Text style={{ fontSize: 14, color: 'black' }}>
                {' '}
                {t('aadharcardback')}
              </Text>
              <Text style={{ color: 'red' }}>*</Text>
            </Text>
            {verificationDB.aadharVerified === true ? (
              <View
                style={styles.verifiedView}>
                <Ionicons
                  name="checkmark-circle"
                  color={'green'}
                  size={15}
                  style={{ paddingLeft: 10 }}
                />
                <Text
                  style={styles.verifiedText}>
                  {t('verified')}
                </Text>
              </View>
            ) : (
              <View
                style={styles.notVerifiedView}>
                <Ionicons
                  name="close-circle"
                  color={'red'}
                  size={15}
                  style={{ paddingLeft: 10 }}
                />
                <Text
                  style={styles.notVerifiedText}>
                  {t('notverified')}
                </Text>
              </View>
            )}
          </View>
          <View
            style={styles.boxWrapper}>
            {verificationDB.aadharVerified != true ?
              <View
                style={styles.boxCrossIcon}>
                <Ionicons
                  name="close-circle-outline"
                  size={25}
                  color={'red'}
                  onPress={() => {
                    verifiedFormik.setFieldValue('aadharBackImage', '');
                    // setAadharFileBack(null);
                    // setAadharFileURIBack(null);
                  }}
                />
              </View>
              : null}

            {verifiedFormik.values['aadharBackImage'] ? (
              <ImageRNE
                style={styles.boxImage}
                onPress={() => setShowAadharBack(true)}
                source={{
                  uri: conditonalAPI.aadharBackImage
                    ? `${imagePath.IMAGE_URL}${verifiedFormik.values['aadharBackImage']}`
                    : `${verifiedFormik.values['aadharBackImage']}`,
                  cache: 'reload',
                }}
              />
            ) : null}

            {verificationDB.aadharVerified != true ?
              <View
                style={styles.boxImageUploadButton}>
                <View style={{ flexDirection: 'row' }}>
                  {/* <Button
                onPress={() => openCameraAadharBack()}
                color={'#FFE7C7'}
                containerStyle={{
                  borderTopLeftRadius: 18,
                  borderBottomLeftRadius: 18,
                  padding: 3,
                }}
                icon={
                  <Icon
                    name="camera"
                    size={25}
                    color={'#585858'}
                    style={{
                      alignSelf: 'flex-end',
                    }}
                  />
                }
              /> */}
                  <Button
                    title={'Upload'}
                    titleStyle={{ color: 'black' }}
                    onPress={toggleDialogAB}
                    color={'#FFE7C7'}
                    disabled={verificationDB.aadharVerified}
                    containerStyle={{
                      borderRadius: 18,
                      // borderTopRightRadius: 18,
                      // borderBottomRightRadius: 18,
                      padding: 3,
                    }}
                    iconPosition="right"
                    icon={
                      <Ionicons
                        name="cloud-upload-sharp"
                        size={20}
                        // color={'#585858'}
                        color={'black'}
                        style={{
                          paddingHorizontal: 5,
                          alignSelf: 'flex-end',
                        }}
                      />
                    }
                  />
                </View>
              </View> : null}

            <View style={{ padding: 1 }}></View>
          </View>
          {showAadharBack ? (
            <Modal animationType="slide" transparent={true}>
              <Dialog
                overlayStyle={{ borderRadius: 20 }}
                isVisible={showAadharBack}
                onBackdropPress={toggleDialogAadharBack}>
                <View
                  style={styles.modalView}>
                  <Image
                    style={styles.modalImage}
                    source={{
                      uri: conditonalAPI.aadharBackImage
                        ? `${imagePath.IMAGE_URL}${verifiedFormik.values['aadharBackImage']}`
                        : `${verifiedFormik.values['aadharBackImage']}`,
                      cache: 'reload',
                    }}></Image>
                </View>
              </Dialog>
            </Modal>
          ) : null}
          {verifiedFormik.errors.aadharBackImage && (
            <Text style={{ fontSize: 11, color: 'red', paddingLeft: 20 }}>
              {verifiedFormik.errors.aadharBackImage}
            </Text>
          )}

          {/* Paste here */}
          <View
            style={{
              padding: 10,
              paddingLeft: 20,
              justifyContent: 'flex-start',
              flexDirection: 'row',
            }}>
            <Text style={{ fontSize: 14, paddingRight: 10, color: 'black' }}>
              <Text style={{ fontSize: 14, color: 'black' }}>
                {t('pass_cheque')}
              </Text>
              {/* <Text style={{ color: 'red' }}>*</Text> */}
            </Text>
            {verificationDB.bankVerified === true ? (
              <View
                style={styles.verifiedView}>
                <Ionicons
                  name="checkmark-circle"
                  color={'green'}
                  size={15}
                  style={{ paddingLeft: 10 }}
                />
                <Text
                  style={styles.verifiedText}>
                  {t('verified')}
                </Text>
              </View>
            ) : (
              <View
                style={styles.notVerifiedView}>
                <Ionicons
                  name="close-circle"
                  color={'red'}
                  size={15}
                  style={{ paddingLeft: 10 }}
                />
                <Text
                  style={styles.notVerifiedText}>
                  {t('notverified')}
                </Text>
              </View>
            )}
          </View>
          <View
            style={styles.boxWrapper}>
            {verificationDB.bankVerified != true ?
              <View
                style={styles.boxCrossIcon}>
                <Ionicons
                  name="close-circle-outline"
                  size={25}
                  color={'red'}
                  onPress={() => {
                    verifiedFormik.setFieldValue('passbookImage', '');
                    setpassbookFile(null);
                    setpassbookFileURI(null);
                  }}
                />
              </View>
              : null}

            {
              verifiedFormik.values['passbookImage'] ? (
                <ImageRNE
                  style={styles.boxImage}
                  onPress={() => setshowPassbook(true)}
                  source={{
                    uri: conditonalAPI.passbookImage
                      ? `${imagePath.IMAGE_URL}${verifiedFormik.values['passbookImage']}`
                      : `${verifiedFormik.values['passbookImage']}`,
                    cache: 'reload',
                  }}
                />
              ) : null
              // <Ionicons
              //   name="images"
              //   size={46}
              //   style={{paddingLeft: 10}}
              //   color={'#585858'}
              // />
            }

            {verificationDB.bankVerified != true ?
              <View
                style={styles.boxImageUploadButton}>
                <View style={{ flexDirection: 'row' }}>
                  {/* <Button
                onPress={() => openCameraPassbook()}
                color={'#FFE7C7'}
                containerStyle={{
                  borderTopLeftRadius: 18,
                  borderBottomLeftRadius: 18,
                  padding: 3,
                }}
                icon={
                  <Icon
                    name="camera"
                    size={25}
                    color={'#585858'}
                    style={{
                      alignSelf: 'flex-end',
                    }}
                  />
                }
              /> */}
                  <Button
                    title={'Upload'}
                    titleStyle={{ color: 'black' }}
                    onPress={toggleDialogP}
                    color={'#FFE7C7'}
                    disabled={verificationDB.bankVerified}
                    containerStyle={{
                      borderRadius: 18,
                      // borderTopRightRadius: 18,
                      // borderBottomRightRadius: 18,
                      padding: 3,
                    }}
                    iconPosition="right"
                    icon={
                      <Ionicons
                        name="cloud-upload-sharp"
                        size={20}
                        // color={'#585858'}
                        color={'black'}
                        style={{
                          paddingHorizontal: 5,
                          alignSelf: 'flex-end',
                        }}
                      />
                    }
                  />
                </View>
              </View> : null}

            <View style={{ padding: 1 }}></View>
          </View>
          {showPassbook ? (
            <Modal animationType="slide" transparent={true}>
              <Dialog
                overlayStyle={{ borderRadius: 20 }}
                isVisible={showPassbook}
                onBackdropPress={togglePassbook}>
                <View
                  style={styles.modalView}>
                  <Image
                    style={styles.modalImage}
                    source={{
                      uri: conditonalAPI.passbookImage
                        ? `${imagePath.IMAGE_URL}${verifiedFormik.values['passbookImage']}`
                        : `${verifiedFormik.values['passbookImage']}`,
                      cache: 'reload',
                    }}></Image>
                </View>
              </Dialog>
            </Modal>
          ) : null}
          {(verifiedFormik.errors.passbookImage && !upiIdNumber) && (
            <Text style={{ fontSize: 11, color: 'red', paddingLeft: 20 }}>
              {verifiedFormik.errors.passbookImage}
            </Text>
          )}


          <View
            style={{
              padding: 10,
              paddingLeft: 20,
              justifyContent: 'flex-start',
              flexDirection: 'row',
            }}>
            <Text style={{ fontSize: 14, paddingRight: 10, color: 'black' }}>
              {t('pancard')}
            </Text>
            {verificationDB.panVerified === true ? (
              <View
                style={styles.verifiedView}>
                <Ionicons
                  name="checkmark-circle"
                  color={'green'}
                  size={15}
                  style={{ paddingLeft: 10 }}
                />
                <Text
                  style={styles.verifiedText}>
                  {t('verified')}
                </Text>
              </View>
            ) : (
              <View
                style={styles.notVerifiedView}>
                <Ionicons
                  name="close-circle"
                  color={'red'}
                  size={15}
                  style={{ paddingLeft: 10 }}
                />
                <Text
                  style={styles.notVerifiedText}>
                  {t('notverified')}
                </Text>
              </View>
            )}
          </View>
          <View
            style={styles.boxWrapper}>
            {verificationDB.panVerified != true ?
              <View
                style={styles.boxCrossIcon}>
                <Ionicons
                  name="close-circle-outline"
                  size={25}
                  color={'red'}
                  onPress={() => {
                    verifiedFormik.setFieldValue('panImage', '');
                    setPanFile(null);
                    setPanFileURI(null);
                  }}
                />
              </View>
              : null}
            {
              verifiedFormik.values['panImage'] ? (
                <ImageRNE
                  style={styles.boxImage}
                  onPress={() => setShowPan(true)}
                  source={{
                    uri: conditonalAPI.panImage
                      ? `${imagePath.IMAGE_URL}${verifiedFormik.values['panImage']}`
                      : `${verifiedFormik.values['panImage']}`,
                    cache: 'reload',
                  }}
                />
              ) : null
              // <Ionicons
              //   name="images"
              //   size={46}
              //   style={{paddingLeft: 10}}
              //   color={'#585858'}
              // />
            }
            {verificationDB.panVerified != true ?
              <View
                style={styles.boxImageUploadButton}>
                <View style={{ flexDirection: 'row' }}>
                  {/* <Button
                onPress={() => openCameraPAN()}
                color={'#FFE7C7'}
                containerStyle={{
                  borderTopLeftRadius: 18,
                  borderBottomLeftRadius: 18,
                  padding: 3,
                }}
                icon={
                  <Icon
                    name="camera"
                    size={25}
                    color={'#585858'}
                    style={{
                      alignSelf: 'flex-end',
                    }}
                  />
                }
              /> */}
                  <Button
                    title={'Upload'}
                    titleStyle={{ color: 'black' }}
                    onPress={toggleDialogPAN}
                    disabled={verificationDB.panVerified}
                    color={'#FFE7C7'}
                    containerStyle={{
                      borderRadius: 18,
                      // borderTopRightRadius: 18,
                      // borderBottomRightRadius: 18,
                      padding: 3,
                    }}
                    iconPosition="right"
                    icon={
                      <Ionicons
                        name="cloud-upload-sharp"
                        size={20}
                        // color={'#585858'}
                        color={'black'}
                        style={{
                          paddingHorizontal: 5,
                          alignSelf: 'flex-end',
                        }}
                      />
                    }
                  />
                </View>
              </View> : null}

            <View style={{ padding: 1 }}></View>
          </View>
          {showPAN ? (
            <Modal animationType="slide" transparent={true}>
              <Dialog
                overlayStyle={{ borderRadius: 20 }}
                isVisible={showPAN}
                onBackdropPress={togglePAN}>
                <View
                  style={styles.modalView}>
                  <Image
                    style={styles.modalImage}
                    source={{
                      uri: conditonalAPI.panImage
                        ? `${imagePath.IMAGE_URL}${verifiedFormik.values['panImage']}`
                        : `${verifiedFormik.values['panImage']}`,
                      cache: 'reload',
                    }}></Image>
                </View>
              </Dialog>
            </Modal>
          ) : null}
          {verifiedFormik.errors.panImage && (
            <Text style={{ fontSize: 11, color: 'red', paddingLeft: 20 }}>
              {verifiedFormik.errors.panImage}
            </Text>
          )}

          {/* ----------NEW SECTION---------- */}
          <View style={{ marginHorizontal: 10, paddingHorizontal: 10, paddingTop: 14 }}>
            <View
              style={{
                paddingVertical: 10,
                // paddingLeft: 20,
                justifyContent: 'flex-start',
                flexDirection: 'row',
              }}>
              <Text style={{ fontSize: 14, paddingRight: 10, color: 'black' }}>
                {t('upi_id')}
              </Text>
              {verificationDB.upiVerified === true ? (
                <View
                  style={styles.verifiedView}>
                  <Ionicons
                    name="checkmark-circle"
                    color={'green'}
                    size={15}
                    style={{ paddingLeft: 10 }}
                  />
                  <Text
                    style={styles.verifiedText}>
                    {t('verified')}
                  </Text>
                </View>
              ) : (
                <View
                  style={styles.notVerifiedView}>
                  <Ionicons
                    name="close-circle"
                    color={'red'}
                    size={15}
                    style={{ paddingLeft: 10 }}
                  />
                  <Text
                    style={styles.notVerifiedText}>
                    {t('notverified')}
                  </Text>
                </View>
              )}
            </View>
            <View
              style={[
                styles.inputBox,
                { borderColor: 'rgba(0,0,0,0.08)', marginVertical: 10, marginTop: 4 },
              ]}>
              {/* <TextInput
              style={styles.innerBox}
              autoCapitalize="none"
              editable={verificationDB.upiVerified != true ? true : false}
              placeholderTextColor={'grey'}
              value={upiIdNumber}
              onChangeText={text => {
                setUpiIdNumber(text)
              }}
              placeholder={`UPI ID`}
            /> */}
              <TextInput
                style={styles.innerBox}
                autoCapitalize="none"
                editable={!verificationDB.upiVerified}
                placeholderTextColor={'grey'}
                value={verifiedFormik.values.upiNumber || upiIdNumber}
                onChangeText={text => {
                  setUpiIdNumber(text);
                  verifiedFormik.setFieldValue('upiNumber', text);
                  setTimeout(() => verifiedFormik.validateForm(), 100);
                }}
                placeholder="UPI ID"
              />

            </View>

            <View
              style={{
                paddingVertical: 10,
                justifyContent: 'flex-start',
                flexDirection: 'row',
              }}>
              <Text style={{ fontSize: 14, paddingRight: 10, color: 'black' }}>
                {t('upi_id_image')}
              </Text>
              {verificationDB.upiVerified === true ? (
                <View
                  style={styles.verifiedView}>
                  <Ionicons
                    name="checkmark-circle"
                    color={'green'}
                    size={15}
                    style={{ paddingLeft: 10 }}
                  />
                  <Text
                    style={styles.verifiedText}>
                    {t('verified')}
                  </Text>
                </View>
              ) : (
                <View
                  style={styles.notVerifiedView}>
                  <Ionicons
                    name="close-circle"
                    color={'red'}
                    size={15}
                    style={{ paddingLeft: 10 }}
                  />
                  <Text
                    style={styles.notVerifiedText}>
                    {t('notverified')}
                  </Text>
                </View>
              )}
            </View>
            <View
              style={[styles.boxWrapper, { width: '100%', }]}>
              {verificationDB.upiVerified != true ?
                <View
                  style={styles.boxCrossIcon}>
                  <Ionicons
                    name="close-circle-outline"
                    size={25}
                    color={'red'}
                    onPress={() => {
                      verifiedFormik.setFieldValue('upiImage', '');
                      setUpiIdFile(null);
                      setUpiIdFileURI(null);
                    }}
                  />
                </View>
                : null}
              {
                verifiedFormik.values['upiImage'] ? (
                  <ImageRNE
                    style={styles.boxImage}
                    onPress={() => setShowUPIID(true)}
                    source={{
                      uri: conditonalAPI.upiImage
                        ? `${imagePath.IMAGE_URL}${verifiedFormik.values['upiImage']}`
                        : `${verifiedFormik.values['upiImage']}`,
                      cache: 'reload',
                    }}
                  />
                ) : null
              }

              {!conditonalAPI?.upiImage || !verifiedFormik?.values?.upiImage ?
                <View
                  style={styles.boxImageUploadButton}>
                  <View style={{ flexDirection: 'row' }}>
                    <Button
                      title={'Upload'}
                      titleStyle={{ color: 'black' }}
                      onPress={toggleDialogUPIID}
                      // disabled={verificationDB.upiVerified}
                      color={'#FFE7C7'}
                      containerStyle={{
                        borderRadius: 18,
                        padding: 3,
                      }}
                      iconPosition="right"
                      icon={
                        <Ionicons
                          name="cloud-upload-sharp"
                          size={20}
                          color={'black'}
                          style={{
                            paddingHorizontal: 5,
                            alignSelf: 'flex-end',
                          }}
                        />
                      }
                    />
                  </View>
                </View> : null}

              <View style={{ padding: 1 }}></View>
            </View>
            {(upiIdNumber && (!conditonalAPI.upiImage && !verifiedFormik.values['upiImage'])) && (
              <Text style={{ fontSize: 11, color: 'red' }}>
                {'UPI screenshot is required'}
              </Text>
            )}
            {showUPIID ? (
              <Modal animationType="slide" transparent={true}>
                <Dialog
                  overlayStyle={{ borderRadius: 20 }}
                  isVisible={showUPIID}
                  onBackdropPress={toggleUPIID}>
                  <View
                    style={styles.modalView}>
                    <Image
                      style={styles.modalImage}
                      source={{
                        uri: conditonalAPI.upiImage
                          ? `${imagePath.IMAGE_URL}${verifiedFormik.values['upiImage']}`
                          : `${verifiedFormik.values['upiImage']}`,
                        cache: 'reload',
                      }}></Image>
                  </View>
                </Dialog>
              </Modal>
            ) : null}
            {/* {verifiedFormik.errors.upiImage && (
            <Text style={{ fontSize: 11, color: 'red', paddingLeft: 20 }}>
              {verifiedFormik.errors.upiImage}
            </Text>
          )} */}
          </View>
          {console.log('Formik Values:', verifiedFormik.values)}
          {console.log('Formik Errors:', verifiedFormik.errors)}
          {console.log('Formik isValid:', verifiedFormik.isValid)}


          <View
            style={{
              paddingTop: 10,
              justifyContent: 'space-evenly',
              marginHorizontal: 20,
              paddingBottom: 40,
            }}>
            <BRNE
              title={`${t('submit')}`}
              onPress={() => {
                finalSubmit();
              }}
              buttonStyle={{
                backgroundColor: appTheme.NEW_PALLET,
                borderRadius: 8,
              }}
              titleStyle={{ color: 'black' }}
              containerStyle={{ paddingTop: 10 }}
              disabled={!verifiedFormik.isValid}
            // disabled={!verifiedFormik.isValid || 
            //   (!verifiedFormik.values.passbookImage && !verifiedFormik.values.upiIdNumber)}
            />

            {showSubmitMsg ? (
              <Text style={{ color: 'red', paddingLeft: 15 }}>{msgTxt}</Text>
            ) : null}
          </View>
          <Dialog isVisible={visibleAvatar} onBackdropPress={toggleDialogAvatar}>
            <Dialog.Title title="Select" />
            <Dialog.Actions>
              <View>
                <Dialog.Button
                  title="Camera"
                  onPress={() => {
                    avatarCamera();
                    toggleDialogAvatar();
                  }}
                />
                <Dialog.Button
                  title="Gallery"
                  onPress={() => {
                    avatarGallery();
                    toggleDialogAvatar();
                  }}
                />
              </View>
            </Dialog.Actions>
          </Dialog>
          <Dialog isVisible={visibleShop} onBackdropPress={toggleDialogShop}>
            <Dialog.Title title="Select" />
            <Dialog.Actions>
              <View>
                <Dialog.Button
                  title="Camera"
                  onPress={() => {
                    shopCamera();
                    toggleDialogShop();
                  }}
                />
                <Dialog.Button
                  title="Gallery"
                  onPress={() => {
                    shopGallery();
                    toggleDialogShop();
                  }}
                />
              </View>
            </Dialog.Actions>
          </Dialog>
          <Dialog isVisible={visibleAF} onBackdropPress={toggleDialogAF}>
            <Dialog.Title title="Select" titleStyle={{ color: 'black' }} />
            <Dialog.Actions>
              <View
                style={{
                  justifyContent: 'flex-start',
                  alignContent: 'flex-start',
                  alignItems: 'flex-start',
                  alignSelf: 'flex-start',
                }}>
                {/* <Button title={'Camera'} /> */}
                <Dialog.Button
                  title="Camera"
                  style={{ width: width }}
                  onPress={() => {
                    newAadharFront();

                  }}
                />
                <Dialog.Button
                  title="Gallery"
                  style={{ width: width }}
                  onPress={() => {
                    newGalleryAadharFront();
                  }}
                />
              </View>
            </Dialog.Actions>
          </Dialog>
          <Dialog isVisible={visibleAB} onBackdropPress={toggleDialogAB}>
            <Dialog.Title title="Select" />
            <Dialog.Actions>
              <View>
                <Dialog.Button
                  title="Camera"
                  onPress={() => {
                    newAadharBack();
                    // toggleDialogAB();
                  }}
                />
                <Dialog.Button
                  title="Gallery"
                  onPress={() => {
                    newGalleryAadharBack();

                  }}
                />
              </View>
            </Dialog.Actions>
          </Dialog>
          <Dialog isVisible={visibleP} onBackdropPress={toggleDialogP}>
            <Dialog.Title title="Select" />
            <Dialog.Actions>
              <View>
                <Dialog.Button
                  title="Camera"
                  onPress={() => {
                    newPassbook();

                  }}
                />
                <Dialog.Button
                  title="Gallery"
                  onPress={() => {
                    // newGalleryPassbook();
                    newGalleryPassbook();
                  }}
                />
              </View>
            </Dialog.Actions>
          </Dialog>
          <Dialog isVisible={visiblePAN} onBackdropPress={toggleDialogPAN}>
            <Dialog.Title title="Select" />
            <Dialog.Actions>
              <View>
                <Dialog.Button
                  title="Camera"
                  onPress={() => {
                    newPAN();
                    
                  }}
                />
                <Dialog.Button
                  title="Gallery"
                  onPress={() => {
                    newGalleryPAN();
                  
                  }}
                />
              </View>
            </Dialog.Actions>
          </Dialog>
          {/* ----------NEW SECTION---------- */}
          <Dialog isVisible={visibleUPIID} onBackdropPress={toggleDialogUPIID}>
            <Dialog.Title title="Select" />
            <Dialog.Actions>
              <View>
                <Dialog.Button
                  title="Camera"
                  onPress={() => {
                    newUPIID();
                    
                  }}
                />
                <Dialog.Button
                  title="Gallery"
                  onPress={() => {
                    newGalleryUPIID();
                    
                  }}
                />
              </View>
            </Dialog.Actions>
          </Dialog>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    justifyContent: 'center',
  },
  textContainer: {
    marginTop: 10,
  },
  inputBox: {
    height: 50,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 20,
    elevation: 3,
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
  linearGradient: {
    // borderRadius: responsiveWidth(3),
    height: responsiveHeight(4.5),
    fontWeight: '500',
    fontSize: responsiveFontSize(2),
    justifyContent: 'center',
    borderRadius: responsiveWidth(10),
  },
  buttonText: {
    fontSize: responsiveFontSize(1.6),
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#fff',
    backgroundColor: 'transparent',
  },
  viewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: responsiveWidth(10),
    // backgroundColor: '#39B8FF',
    width: responsiveWidth(20),
  },


  verifiedView: {
    borderRadius: 20,
    backgroundColor: '#d2f8dc',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  verifiedText: {
    fontSize: 14,
    color: 'green',
    paddingRight: 10,
  },
  notVerifiedView: {
    borderRadius: 20,
    backgroundColor: '#ffcccb',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  notVerifiedText: {
    fontSize: 14,
    color: 'red',
    paddingRight: 10,
  },
  profileImageBoxWrapper: {
    alignContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderColor: 'grey',
    borderWidth: 0.5,
    borderRadius: 18,
    width: '100%',
    flexDirection: 'row',
    height: 90,
    alignItems: 'center',
    elevation: 3,
    marginTop: 10,
  },
  boxImage: {
    width: 110,
    height: 70,
    left: 10,
    right: 10,
    resizeMode: 'cover',
    borderBottomLeftRadius: 18,
    borderTopLeftRadius: 18,
  },
  boxImageUploadButton: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 5,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    position: 'absolute',
    bottom: 0,
    right: 0,

  },
  shopLabelText: {
    fontSize: 14,
    paddingLeft: 20,
    color: 'black',
    paddingBottom: 10,
    paddingTop: 20,
  },

  boxWrapper: {
    alignContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderColor: 'grey',
    borderWidth: 0.5,
    // borderWidth: 1,
    // backgroundColor: '#FEF8DD',
    borderRadius: 18,
    width: '90%',
    flexDirection: 'row',
    height: 90,
    alignItems: 'center',
    elevation: 3,
  },
  boxCrossIcon: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
    position: 'absolute',
    zIndex: 1,
    top: 0,
    right: 0,
    padding: 5,
  },
  modalView: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  modalImage: {
    width: 290,
    height: 210,
    resizeMode: 'contain',
  },
  textInputContainer: {
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 0,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  textInputContainer1: {
    borderColor: 'rgba(0,0,0,0.08)',
    borderWidth: 1,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#FFFFFF'
  },
  textInputLabel: {
    fontWeight: '100',
    fontSize: 15,
    color: 'black',
    paddingBottom: 10,
  },
  labelStateCity: {
    paddingTop: 20,
    paddingLeft: 10,
    paddingBottom: 10,
    color: 'black',
    fontSize: 15,
  },
  stateCityContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  stateCityDropdownWrapper: {
    width: screenWidth * 0.9,
    height: 50,
    paddingHorizontal: 5,
    backgroundColor: 'white',
    borderColor: 'rgba(0,0,0,0.08)',
    borderWidth: 1,
    borderRadius: 8,
    elevation: 3,
  }
});
export default Profile;
