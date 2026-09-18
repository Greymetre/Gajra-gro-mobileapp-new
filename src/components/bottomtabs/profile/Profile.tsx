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
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useEffect, useRef, useState } from 'react';
import imagePath from '../../../constants/imagePath';
import { Dropdown } from 'react-native-element-dropdown';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import colors from '../../../styles/colors';
import DashedLine from 'react-native-dashed-line';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
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
  postupdatebankinfo,
  requestUpdateCustomerAddress,
} from '../../../services/backend_helper';
import {
  requestLocationPermission,
  getCurrentCoordinates,
  toGeoJsonCoordinates,
  alertLocationPermissionDenied,
  alertLocationPermissionBlocked,
  alertLocationUnavailable,
} from '../../../utils/locationHelper';
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AadhaarKycCard from './AadhaarKycCard';
import PassbookBankCard from './PassbookBankCard';
import PanKycCard from './PanKycCard';
import UpiKycCard from './UpiKycCard';
import ShopImageCard from './ShopImageCard';
import { KycCardHeader, KycField, kycStyles } from './KycCardParts';
import LinearGradient from 'react-native-linear-gradient';
import { getUpiError, normalizeUpi } from '../../../utils/upi';
import { getPanError, normalizePan } from '../../../utils/pan';
import {
  BANK_FIELDS,
  bankDetailsChanged,
  getBankFieldError,
} from '../../../utils/bankDetails';
import { getAadhaarError, normalizeAadhaar } from '../../../utils/aadhaar';
import { cropPickedImage, requestCameraPermission, requestGalleryPermission, showImagePickerError } from './permission';

const Profile = (props: any) => {
  const safeInsets = useSafeAreaInsets();
  // The same screen serves two routes: the main Profile (personal details,
  // shop address, shop image) and "KYC Details" (Aadhaar, bank, PAN, UPI),
  // opened with navigation.push(PROFILE, { section: 'kyc' }).
  const isKycSection = props.route?.params?.section === 'kyc';
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
  // The pickers are presented on top of the dialog; closing the dialog at the
  // same time tears the picker down with it on iOS. Wait for the dialog's
  // close animation to finish before opening the camera/gallery.
  const afterDialogClosed = (open: () => void) => {
    setTimeout(open, Platform.OS === 'ios' ? 600 : 300);
  };

  const [updatingLocation, setUpdatingLocation] = useState(false);

  /**
   * Detects the current position and saves it straight away - no separate
   * screen. updateAddress replaces the whole address, so the saved address is
   * fetched first and sent back unchanged alongside the new coordinates.
   */
  const updateLocationNow = async () => {
    if (updatingLocation) {
      return;
    }
    setUpdatingLocation(true);
    try {
      const status = await requestLocationPermission();
      if (status === 'blocked') {
        alertLocationPermissionBlocked();
        return;
      }
      if (status === 'denied') {
        alertLocationPermissionDenied(() => updateLocationNow());
        return;
      }

      const [position, addressRes] = await Promise.all([
        getCurrentCoordinates(),
        requestGetCustomerAddress({}).catch(() => null),
      ]);
      if (!position) {
        alertLocationUnavailable(() => updateLocationNow());
        return;
      }

      const saved = addressRes?.isError === false && addressRes?.data ? addressRes.data : {};
      const res = await requestUpdateCustomerAddress({
        postalCode: saved.postalCode ?? '',
        address: saved.address ?? '',
        city: saved.city ?? '',
        state: saved.state ?? '',
        country: saved.country ?? 'India',
        coordinates: toGeoJsonCoordinates(position),
      });
      if (res?.isError !== false) {
        throw new Error(res?.message);
      }
      Alert.alert(
        'Location updated',
        `Your shop location has been saved.\n\nLatitude: ${position.latitude.toFixed(6)}\nLongitude: ${position.longitude.toFixed(6)}`,
      );
    } catch (error: any) {
      console.log('Update location error >>> ', error?.response ?? error);
      Alert.alert(`${t('updatelocation')}`, `${t('locationupdatefailed')}`);
    } finally {
      setUpdatingLocation(false);
    }
  };

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
    const granted = await requestCameraPermission(newGalleryAadharFront);

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
      showImagePickerError(err);
    });
  };
  const newAadharBack = async () => {
    const granted = await requestCameraPermission(newGalleryAadharBack);

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
      showImagePickerError(err);
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
          const croppedImage = await cropPickedImage(image.uri!);

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
          showImagePickerError(err);
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
          const croppedImage = await cropPickedImage(image.uri!);
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
          showImagePickerError(err);
          toggleDialogAB();
        }
      }
    );
  };

  const newPassbook = async () => {
    const granted = await requestCameraPermission(newGalleryPassbook);

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
      showImagePickerError(err);
      toggleDialogP();
    });
  };
  const newPAN = async () => {
    const granted = await requestCameraPermission(newGalleryPAN);

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
      showImagePickerError(err);
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
          const croppedImage = await cropPickedImage(image.uri!);

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
          showImagePickerError(err);
          toggleDialogPAN();
        }
      }
    );
  };


  const newUPIID = async () => {
    const granted = await requestCameraPermission(newGalleryUPIID);

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
      showImagePickerError(err);
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
          const croppedImage = await cropPickedImage(image.uri!);

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
          showImagePickerError(err);
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
          const croppedImage = await cropPickedImage(image.uri!);

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
          showImagePickerError(err);
          toggleDialogP();

        }
      }
    );
  };

  const avatarCamera = async () => {
    const granted = await requestCameraPermission(avatarGallery);

    if (!granted) {
      setvisibleAvatar(false);
      return;
    }
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
      setvisibleAvatar(false);
    }).catch(err => {
      setvisibleAvatar(false);
      showImagePickerError(err);
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
          const croppedImage = await cropPickedImage(image.uri!);

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
          showImagePickerError(err);
        }
      }
    );
  };

  const shopCamera = async () => {
    const granted = await requestCameraPermission(shopGallery);

    if (!granted) {
      setvisibleShop(false);
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
      setvisibleShop(false);
    }).catch(err => {
      setvisibleShop(false);
      showImagePickerError(err);
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

          const croppedImage = await cropPickedImage(image.uri!)

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
          showImagePickerError(err);
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
  // Values already saved on the server are never re-validated: older records
  // may not match today's format rules and must not block the Submit button.
  const isUnchanged = (field: string, value: any) =>
    `${value ?? ''}`.replace(/\s/g, '').toUpperCase() ===
    `${dbKyc?.[field] ?? ''}`.replace(/\s/g, '').toUpperCase();

  const allValidationRules: any = {
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
    // Optional, but when filled it must be a real Aadhaar number.
    aadharNo: Yup.string()
      .nullable()
      .test('aadhaar', function (value) {
        if (isUnchanged('aadharNo', value)) {
          return true;
        }
        const message = getAadhaarError(value || '');
        return message ? this.createError({ message }) : true;
      }),
    // Optional. Only checked when changed, so an already-saved UPI ID never blocks submit.
    upiNumber: Yup.string()
      .nullable()
      .test('upi', function (value) {
        if (isUnchanged('upiNumber', value)) {
          return true;
        }
        const message = getUpiError(value || '');
        return message ? this.createError({ message }) : true;
      }),
    // Optional, but when filled it must be a valid PAN.
    panNo: Yup.string()
      .nullable()
      .test('pan', function (value) {
        if (isUnchanged('panNo', value)) {
          return true;
        }
        const message = getPanError(value || '');
        return message ? this.createError({ message }) : true;
      }),
    // Optional bank details: each field may be empty, but a filled one must be valid.
    ...Object.fromEntries(
      BANK_FIELDS.map(field => [
        field,
        Yup.string()
          .nullable()
          .test('bank-' + field, function (value) {
            if (isUnchanged(field, value)) {
              return true;
            }
            const message = getBankFieldError(field, this.parent);
            return message ? this.createError({ message }) : true;
          }),
      ]),
    ),
  };
  // Each screen only validates what it shows, so a missing Aadhaar image can't
  // silently block the Profile submit (and vice versa).
  const verifiedValidationSchema = Yup.object(
    Object.fromEntries<any>(
      Object.entries(allValidationRules).filter(([field]) =>
        isKycSection ? field !== 'shopimage' : field === 'shopimage',
      ),
    ),
  );



  const [dbKyc, setDbKyc] = useState<any>({});

  // ToastAndroid does nothing on iOS, so fall back to an alert there.
  const showMessage = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert(message);
    }
  };

  // ----------SUBMIT BUTTON API----------
  const finalSubmit = async () => {
    if (isKycSection && upiIdNumber && !verifiedFormik.values['upiImage']) {
      showMessage('UPI screenshot is required');
      return
    }
    try {
      const token = await getTokenAsyncStorage();
      let myHeaders = new Headers();
      myHeaders.append('Authorization', `Bearer ${token}`);

      let formdata = new FormData();
      formdata.append('firmName', verifiedFormik?.values?.firmName);
      formdata.append('contactPerson', verifiedFormik?.values?.contactPerson);
      // Only send buyerName when it's set (or clearing a saved one): a backend
      // without this field rejects unknown fields and would fail the whole update.
      const buyerName = (verifiedFormik?.values?.buyerName || '').trim();
      if (buyerName || dbKyc?.buyerName) formdata.append('buyerName', buyerName);
      formdata.append('mobile', verifiedFormik?.values?.mobile);
      formdata.append('customerType', CustomerTypeNew);
      formdata.append('address[state]', verifiedFormik?.values?.state);
      formdata.append('address[city]', verifiedFormik?.values?.city);
      formdata.append('address[postalCode]', verifiedFormik?.values?.postalCode);
      formdata.append('address[address]', verifiedFormik?.values?.address);

      // Append UPI Number
      formdata.append("upiNumber", normalizeUpi(upiIdNumber || ""));
      const aadharNo = normalizeAadhaar(verifiedFormik?.values?.aadharNo || '');
      if (aadharNo) formdata.append('aadharNo', aadharNo);
      const panNo = normalizePan(verifiedFormik?.values?.panNo || '');
      if (panNo) formdata.append('panNo', panNo);
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
      // Read the body even on 4xx - the server puts the real reason in `message`.
      const rawBody = await response.text();
      let resData: any = null;
      try {
        resData = JSON.parse(rawBody);
      } catch {
        resData = null;
      }
      if (!response.ok) {
        console.log('updatePersonalInfo failed >>> ', response.status, rawBody);
        throw new Error(
          resData?.message || `Something went wrong (status ${response.status}). Please try again.`,
        );
      }
      if (resData?.isError === false) {
        // Bank details go through their own API. Only call it when they changed:
        // it resets the admin's bank verification, which IMPS payouts depend on.
        const bankDetails = {
          accountNo: (verifiedFormik.values.accountNo || '').trim(),
          holderName: (verifiedFormik.values.holderName || '').trim(),
          bankName: (verifiedFormik.values.bankName || '').trim(),
          ifsc: (verifiedFormik.values.ifsc || '').trim(),
        };
        if (bankDetailsChanged(bankDetails, dbKyc)) {
          try {
            const bankRes = await postupdatebankinfo(bankDetails);
            if (bankRes?.isError !== false) {
              throw new Error(bankRes?.message || 'Bank details could not be saved');
            }
          } catch (bankError: any) {
            console.log('updatebankInfo failed >>> ', bankError);
            Alert.alert(
              'Bank details not saved',
              'Your KYC was submitted, but the bank details could not be saved. Please try again.',
            );
            return;
          }
        }
        setShowSubmitMsg(true);
        setMsgTxt('Your KYC details have been sent for verification');
        if (isKycSection) {
          navigation.goBack();
        } else {
          navigation.navigate(navigationStrings.HOME);
        }
        showMessage('Your KYC details have been sent for verification');
      } else {
        throw new Error(resData?.message || 'Unknown error occurred');
      }
    } catch (error: any) {
      console.log('API Error:', error);
      setShowSubmitMsg(true);
      setMsgTxt(error.message);
      Alert.alert('Profile update failed', error.message);
    }
  };


  const verifiedFormik: any = useFormik({
    initialValues: dbKyc,
    onSubmit: finalSubmit,
    validationSchema: verifiedValidationSchema,
    enableReinitialize: true,
    validateOnMount: true,
  });

  // Status of each KYC document for the summary card on the Profile screen.
  const kycState = (verified: boolean, uploaded: any) =>
    verified ? 'verified' : uploaded ? 'pending' : 'missing';
  const kycItems = [
    { key: 'aadhaar', label: 'Aadhaar', state: kycState(verificationDB.aadharVerified === true, dbKyc?.aadharFrontImage) },
    { key: 'bank', label: 'Bank', state: kycState(verificationDB.bankVerified === true, dbKyc?.passbookImage || dbKyc?.accountNo) },
    { key: 'pan', label: 'PAN', state: kycState(verificationDB.panVerified === true, dbKyc?.panImage || dbKyc?.panNo) },
    { key: 'upi', label: 'UPI', state: kycState(verificationDB.upiVerified === true, dbKyc?.upiNumber) },
  ];

  // Refresh when coming back from the KYC Details screen so the summary is current.
  const hasFocusedOnce = useRef(false);
  useFocusEffect(
    React.useCallback(() => {
      if (hasFocusedOnce.current && !isKycSection) {
        finalFetchProfileInfo();
      }
      hasFocusedOnce.current = true;
    }, [isKycSection]),
  );

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
    // White behind the status bar so it blends with the header; the page itself is grey.
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Router already pads for the status bar; a second SafeAreaView doubled the gap. */}
      <View style={{ flex: 1 }}>
        <View style={pStyles.header}>
          <Pressable
            onPress={() =>
              props.route.params?.data == true
                ? navigation.navigate('Home')
                : props.navigation.goBack()
            }
            hitSlop={6}
            style={({ pressed }) => [pStyles.headerButton, pressed && { opacity: 0.6 }]}>
            <Ionicons name="chevron-back" size={22} color={appTheme.DARK_BOTTOMTAB} />
          </Pressable>
          <Text style={pStyles.headerTitle}>{isKycSection ? 'KYC Details' : 'Profile'}</Text>
          <View style={{ width: 40 }} />
        </View>
        <KeyboardAwareScrollView
          style={{ backgroundColor: '#F7F7F7' }}
          // Keep the last button clear of the Android nav bar / iPhone home indicator.
          contentContainerStyle={{ paddingBottom: safeInsets.bottom }}
          showsVerticalScrollIndicator={false}>
          <View style={{ flex: 1, marginBottom: 20 }}>
            {isKycSection ? (
              <View style={pStyles.kycIntro}>
                <View style={pStyles.kycIntroIcon}>
                  <FontAwesome name="id-card" size={18} color={appTheme.DARK_BOTTOMTAB} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={pStyles.kycIntroTitle}>Complete your KYC</Text>
                  <Text style={pStyles.kycIntroText}>
                    Verified KYC is required to redeem your points to your bank account.
                  </Text>
                </View>
              </View>
            ) : null}
            {!isKycSection && (<>
            {/* Profile summary */}
            <LinearGradient
              colors={['#2B2829', appTheme.DARK_BOTTOMTAB, '#4A4344']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={pStyles.summaryCard}>
              <View style={pStyles.summaryDecor} />
              <View style={pStyles.summaryRow}>
                <Pressable
                  disabled={disabledInput}
                  onPress={toggleDialogAvatar}
                  style={pStyles.avatarWrap}>
                  {verifiedFormik?.values['avatar'] ? (
                    <Image
                      style={pStyles.avatar}
                      source={{
                        uri: conditonalAPI.avatar
                          ? `${imagePath.IMAGE_URL}${verifiedFormik.values['avatar']}`
                          : `${verifiedFormik.values['avatar']}`,
                        cache: 'reload',
                      }}
                    />
                  ) : (
                    <View style={[pStyles.avatar, pStyles.avatarPlaceholder]}>
                      <Ionicons name="person" size={34} color={appTheme.DARK_BOTTOMTAB} />
                    </View>
                  )}
                  {!disabledInput ? (
                    <View style={pStyles.avatarBadge}>
                      <Ionicons name="camera" size={13} color={appTheme.DARK_BOTTOMTAB} />
                    </View>
                  ) : null}
                </Pressable>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={pStyles.summaryName} numberOfLines={1}>
                    {profileData?.contactPerson || verifiedFormik?.values?.contactPerson}
                  </Text>
                  <Text style={pStyles.summaryMobile}>
                    {'+91 ' + (verifiedFormik?.values?.mobile ?? '')}
                  </Text>
                  {ggNumber ? (
                    <View style={pStyles.typeChip}>
                      <Ionicons name="storefront-outline" size={12} color={appTheme.DARK_BOTTOMTAB} />
                      <Text style={pStyles.typeChipText}>{ggNumber}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
              <View style={pStyles.summaryActions}>
                <Pressable
                  onPress={() => setdisabledInput(!disabledInput)}
                  style={({ pressed }) => [
                    pStyles.actionButton,
                    pStyles.actionPrimary,
                    pressed && { opacity: 0.8 },
                  ]}>
                  <Feather
                    name={disabledInput ? 'edit-2' : 'x'}
                    size={15}
                    color={appTheme.DARK_BOTTOMTAB}
                  />
                  <Text style={pStyles.actionPrimaryText}>
                    {disabledInput ? 'Edit Profile' : 'Stop Editing'}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={updateLocationNow}
                  disabled={updatingLocation}
                  style={({ pressed }) => [
                    pStyles.actionButton,
                    pStyles.actionSecondary,
                    (pressed || updatingLocation) && { opacity: 0.8 },
                  ]}>
                  {updatingLocation ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <MaterialCommunityIcons name="map-marker-radius" size={16} color="white" />
                  )}
                  <Text style={pStyles.actionSecondaryText} numberOfLines={1}>
                    {updatingLocation ? 'Detecting…' : `${t('updatelocation')}`}
                  </Text>
                </Pressable>
              </View>
            </LinearGradient>

            {!disabledInput ? (
              <View style={pStyles.editBanner}>
                <Ionicons name="create-outline" size={16} color="#8A6100" />
                <Text style={pStyles.editBannerText}>
                  Editing is on. Tap the photo to change it, then press Submit to save.
                </Text>
              </View>
            ) : null}

            {/* KYC summary - opens the KYC Details screen */}
            <Pressable
              onPress={() => (navigation as any).push(navigationStrings.PROFILE, { section: 'kyc' })}
              style={({ pressed }) => [pStyles.kycCard, pressed && { opacity: 0.9 }]}>
              <View style={pStyles.kycCardTop}>
                <View style={pStyles.kycIntroIcon}>
                  <FontAwesome name="id-card" size={18} color={appTheme.DARK_BOTTOMTAB} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={pStyles.kycIntroTitle}>KYC Details</Text>
                  <Text style={pStyles.kycIntroText}>
                    {kycItems.filter(k => k.state === 'verified').length} of {kycItems.length} verified
                  </Text>
                </View>
                <View style={pStyles.kycCta}>
                  <Text style={pStyles.kycCtaText}>
                    {kycItems.every(k => k.state === 'verified') ? 'View' : 'Complete KYC'}
                  </Text>
                  <Ionicons name="chevron-forward" size={14} color={appTheme.DARK_BOTTOMTAB} />
                </View>
              </View>
              <View style={pStyles.kycProgressTrack}>
                <View
                  style={[
                    pStyles.kycProgressFill,
                    {
                      width: `${(kycItems.filter(k => k.state === 'verified').length / kycItems.length) * 100}%`,
                    },
                  ]}
                />
              </View>
              <View style={pStyles.kycChips}>
                {kycItems.map(k => (
                  <View
                    key={k.key}
                    style={[
                      pStyles.kycChip,
                      {
                        backgroundColor:
                          k.state === 'verified' ? '#E4F6EC' : k.state === 'pending' ? '#FFF1D2' : '#FDECEA',
                      },
                    ]}>
                    <Ionicons
                      name={k.state === 'verified' ? 'checkmark-circle' : k.state === 'pending' ? 'time' : 'alert-circle'}
                      size={12}
                      color={k.state === 'verified' ? '#1E9E5A' : k.state === 'pending' ? '#B7791F' : '#D93025'}
                    />
                    <Text
                      style={[
                        pStyles.kycChipText,
                        {
                          color: k.state === 'verified' ? '#1E9E5A' : k.state === 'pending' ? '#B7791F' : '#D93025',
                        },
                      ]}>
                      {k.label}
                    </Text>
                  </View>
                ))}
              </View>
            </Pressable>

            {/* Personal details */}
            <View style={kycStyles.card}>
              <KycCardHeader icon="person-outline" title="Personal Details" />
              <KycField
                label="Customer Type"
                icon="pricetag-outline"
                locked
                value={ggNumber || ''}
                placeholder="Customer type"
              />
              <KycField
                label={`${t('shopname')}`}
                icon="storefront-outline"
                locked={disabledInput}
                value={verifiedFormik?.values?.firmName || ''}
                onChangeText={(text: string) => verifiedFormik.setFieldValue('firmName', text)}
                placeholder="Enter shop name"
              />
              <KycField
                label={`${t('name')}`}
                icon="person-outline"
                locked={disabledInput}
                value={verifiedFormik?.values?.contactPerson || ''}
                onChangeText={(text: string) => verifiedFormik.setFieldValue('contactPerson', text)}
                placeholder="Enter your name"
              />
              <KycField
                label="Buyer Name (Optional)"
                icon="cart-outline"
                locked={disabledInput}
                value={verifiedFormik?.values?.buyerName || ''}
                onChangeText={(text: string) => verifiedFormik.setFieldValue('buyerName', text)}
                autoCapitalize="words"
                maxLength={60}
                placeholder="Person who buys stock for the shop"
              />
              <KycField
                label={`${t('phoneno')}`}
                icon="call-outline"
                locked
                value={verifiedFormik.values.mobile?.toString() || ''}
                helper="Registered mobile number can't be changed"
              />
            </View>

            {/* Address */}
            <View style={kycStyles.card}>
              <KycCardHeader icon="location-outline" title="Shop Address" />
              <KycField
                label={`${t('address')}`}
                icon="home-outline"
                locked={disabledInput}
                value={verifiedFormik?.values?.address || ''}
                onChangeText={(text: string) => verifiedFormik.setFieldValue('address', text)}
                placeholder="House / shop no., street, area"
                error={verifiedFormik.errors.address}
              />
              <KycField
                label={`${t('postalcode')}`}
                icon="mail-outline"
                locked={disabledInput}
                value={verifiedFormik?.values?.postalCode || ''}
                onChangeText={(text: string) => {
                  const digits = text.replace(/[^0-9]/g, '');
                  verifiedFormik.setFieldValue('postalCode', digits);
                  if (digits.length == 6) {
                    searchPostCodeArea(digits);
                  }
                }}
                keyboardType="number-pad"
                maxLength={6}
                placeholder="6-digit PIN code"
                error={verifiedFormik.errors.postalCode}
              />

              <Text style={pStyles.fieldLabel}>{`${t('state')}`}</Text>
              <Dropdown
                data={stateData}
                style={[pStyles.dropdown, disabledInput && pStyles.dropdownLocked]}
                search={true}
                containerStyle={{ borderRadius: 10 }}
                dropdownPosition={'top'}
                selectedTextStyle={pStyles.dropdownText}
                placeholderStyle={pStyles.dropdownPlaceholder}
                disable={disabledInput}
                itemTextStyle={{ paddingLeft: 10 }}
                inputSearchStyle={{ height: 40, borderRadius: 8 }}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={`${t('select')} ${t('state')}`}
                searchPlaceholder="Search..."
                value={verifiedFormik.values.state}
                renderLeftIcon={() => (
                  <Ionicons name="map-outline" size={18} color="#6B6B6B" style={{ marginRight: 8 }} />
                )}
                onChange={(item: any) => {
                  handleInputChange('state', item.value);
                  setStateSelect(item?.value);
                }}
              />
              {verifiedFormik.errors.state ? (
                <Text style={pStyles.errorText}>{verifiedFormik.errors.state}</Text>
              ) : null}

              <Text style={pStyles.fieldLabel}>{`${t('city')}`}</Text>
              <Dropdown
                style={[pStyles.dropdown, disabledInput && pStyles.dropdownLocked]}
                selectedTextStyle={pStyles.dropdownText}
                placeholderStyle={pStyles.dropdownPlaceholder}
                disable={disabledInput}
                containerStyle={{ borderRadius: 10 }}
                itemTextStyle={{ paddingLeft: 10 }}
                inputSearchStyle={{ height: 40, borderRadius: 8 }}
                dropdownPosition={'top'}
                showsVerticalScrollIndicator={true}
                search={true}
                data={cityData}
                labelField="label"
                valueField="value"
                placeholder={`${t('select')} ${t('city')}`}
                searchPlaceholder="Search City"
                value={verifiedFormik.values.city}
                renderLeftIcon={() => (
                  <Ionicons name="business-outline" size={18} color="#6B6B6B" style={{ marginRight: 8 }} />
                )}
                onChange={(item: any) => {
                  handleInputChange('city', item.value);
                }}
              />
              {verifiedFormik.errors?.city ? (
                <Text style={pStyles.errorText}>{verifiedFormik.errors?.city}</Text>
              ) : null}
            </View>


            <ShopImageCard
              imageUri={
                verifiedFormik.values['shopimage']
                  ? conditonalAPI.shopimage
                    ? `${imagePath.IMAGE_URL}${verifiedFormik.values['shopimage']}`
                    : `${verifiedFormik.values['shopimage']}`
                  : null
              }
              error={verifiedFormik.errors.shopimage}
              onPick={toggleDialogShop}
              onRemove={() => {
                verifiedFormik.setFieldValue('shopimage', '');
                // Clear the pending upload too, or the removed photo is still sent.
                setShopObject(null);
              }}
              onPreview={() => setShowShopImg(true)}
            />
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
            </>)}
          </View>

          {isKycSection && (<>


          <AadhaarKycCard
            verified={verificationDB.aadharVerified === true}
            frontUri={
              verifiedFormik.values['aadharFrontImage']
                ? conditonalAPI.aadharFrontImage
                  ? `${imagePath.IMAGE_URL}${verifiedFormik.values['aadharFrontImage']}`
                  : `${verifiedFormik.values['aadharFrontImage']}`
                : null
            }
            backUri={
              verifiedFormik.values['aadharBackImage']
                ? conditonalAPI.aadharBackImage
                  ? `${imagePath.IMAGE_URL}${verifiedFormik.values['aadharBackImage']}`
                  : `${verifiedFormik.values['aadharBackImage']}`
                : null
            }
            frontError={verifiedFormik.errors.aadharFrontImage}
            backError={verifiedFormik.errors.aadharBackImage}
            onPickFront={toggleDialogAF}
            onPickBack={toggleDialogAB}
            onRemoveFront={() => {
              verifiedFormik.setFieldValue('aadharFrontImage', '');
              setAaharFrontObject(null);
              setAadharFileFront(null);
              setAadharFileURIFront(null);
            }}
            onRemoveBack={() => {
              verifiedFormik.setFieldValue('aadharBackImage', '');
              setAaharBackObject(null);
            }}
            onPreviewFront={() => setShowAadharFront(true)}
            onPreviewBack={() => setShowAadharBack(true)}
            aadhaarNumber={verifiedFormik.values['aadharNo']}
            // Don't nag while typing: show the error once all 12 digits are in
            // or the user leaves the field.
            aadhaarNumberError={
              verifiedFormik.touched.aadharNo ||
                normalizeAadhaar(verifiedFormik.values['aadharNo'] || '').length === 12
                ? verifiedFormik.errors.aadharNo
                : null
            }
            onChangeAadhaarNumber={(digits: string) => {
              verifiedFormik.setFieldValue('aadharNo', digits);
            }}
            onBlurAadhaarNumber={() => verifiedFormik.setFieldTouched('aadharNo', true)}
          />
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

          <PassbookBankCard
            passbookVerified={verificationDB.bankVerified === true}
            passbookUri={
              verifiedFormik.values['passbookImage']
                ? conditonalAPI.passbookImage
                  ? `${imagePath.IMAGE_URL}${verifiedFormik.values['passbookImage']}`
                  : `${verifiedFormik.values['passbookImage']}`
                : null
            }
            passbookError={!upiIdNumber ? verifiedFormik.errors.passbookImage : null}
            onPickPassbook={toggleDialogP}
            onRemovePassbook={() => {
              verifiedFormik.setFieldValue('passbookImage', '');
              setPassbookObject(null);
              setpassbookFile(null);
              setpassbookFileURI(null);
            }}
            onPreviewPassbook={() => setshowPassbook(true)}
            bankValues={verifiedFormik.values}
            // Show a field's error once it's touched; a failed submit touches all.
            bankErrors={Object.fromEntries(
              BANK_FIELDS.map(field => [
                field,
                verifiedFormik.touched[field] ? verifiedFormik.errors[field] : null,
              ]),
            )}
            bankLocked={dbKyc?.verified === true}
            onChangeBank={(field, value) => verifiedFormik.setFieldValue(field, value)}
            onBlurBank={field => verifiedFormik.setFieldTouched(field, true)}
          />
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


          <PanKycCard
            verified={verificationDB.panVerified === true}
            imageUri={
              verifiedFormik.values['panImage']
                ? conditonalAPI.panImage
                  ? `${imagePath.IMAGE_URL}${verifiedFormik.values['panImage']}`
                  : `${verifiedFormik.values['panImage']}`
                : null
            }
            imageError={verifiedFormik.errors.panImage}
            onPickImage={toggleDialogPAN}
            onRemoveImage={() => {
              verifiedFormik.setFieldValue('panImage', '');
              setPanObject(null);
              setPanFile(null);
              setPanFileURI(null);
            }}
            onPreviewImage={() => setShowPan(true)}
            panNumber={verifiedFormik.values['panNo']}
            // Show the error once the PAN is complete or the user leaves the field.
            panNumberError={
              verifiedFormik.touched.panNo ||
                normalizePan(verifiedFormik.values['panNo'] || '').length === 10
                ? verifiedFormik.errors.panNo
                : null
            }
            onChangePanNumber={(pan: string) => verifiedFormik.setFieldValue('panNo', pan)}
            onBlurPanNumber={() => verifiedFormik.setFieldTouched('panNo', true)}
          />
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

          <UpiKycCard
            verified={verificationDB.upiVerified === true}
            upiId={verifiedFormik.values.upiNumber ?? upiIdNumber}
            // Show the error once the user leaves the field.
            upiIdError={verifiedFormik.touched.upiNumber ? verifiedFormik.errors.upiNumber : null}
            onChangeUpiId={(upi: string) => {
              setUpiIdNumber(upi);
              verifiedFormik.setFieldValue('upiNumber', upi);
            }}
            onBlurUpiId={() => verifiedFormik.setFieldTouched('upiNumber', true)}
            screenshotUri={
              verifiedFormik.values['upiImage']
                ? conditonalAPI.upiImage
                  ? `${imagePath.IMAGE_URL}${verifiedFormik.values['upiImage']}`
                  : `${verifiedFormik.values['upiImage']}`
                : null
            }
            screenshotError={
              upiIdNumber && !verifiedFormik.values['upiImage'] ? 'UPI screenshot is required' : null
            }
            onPickScreenshot={toggleDialogUPIID}
            onRemoveScreenshot={() => {
              verifiedFormik.setFieldValue('upiImage', '');
              // Clear the pending upload too, or the removed screenshot is still sent.
              setUpiObject(null);
              setUpiIdFile(null);
              setUpiIdFileURI(null);
            }}
            onPreviewScreenshot={() => setShowUPIID(true)}
          />
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
          </>)}
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
                    setvisibleAvatar(false);
                    afterDialogClosed(avatarCamera);
                  }}
                />
                <Dialog.Button
                  title="Gallery"
                  onPress={() => {
                    setvisibleAvatar(false);
                    afterDialogClosed(avatarGallery);
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
                    setvisibleShop(false);
                    afterDialogClosed(shopCamera);
                  }}
                />
                <Dialog.Button
                  title="Gallery"
                  onPress={() => {
                    setvisibleShop(false);
                    afterDialogClosed(shopGallery);
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
      </View>
    </View>
  );
};

const pStyles = StyleSheet.create({
  kycIntro: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '5%',
    marginTop: 16,
    backgroundColor: '#FFFBE0',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F2EC7A',
    padding: 14,
  },
  kycIntroIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: appTheme.NEW_PALLET,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kycIntroTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1C1C',
  },
  kycIntroText: {
    fontSize: 12,
    color: '#6B6B6B',
    marginTop: 2,
  },
  kycCard: {
    marginHorizontal: '5%',
    marginTop: 14,
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F2E3B8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  kycCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  kycCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1D2',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  kycCtaText: {
    fontSize: 12,
    fontWeight: '700',
    color: appTheme.DARK_BOTTOMTAB,
    marginRight: 2,
  },
  kycProgressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EFEFEF',
    marginTop: 14,
    overflow: 'hidden',
  },
  kycProgressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#1E9E5A',
  },
  kycChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  kycChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  kycChipText: {
    fontSize: 11.5,
    fontWeight: '700',
    marginLeft: 4,
  },
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
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1C',
  },
  summaryCard: {
    marginHorizontal: '5%',
    marginTop: 16,
    borderRadius: 20,
    padding: 16,
    overflow: 'hidden',
  },
  summaryDecor: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    right: -50,
    top: -70,
    backgroundColor: 'rgba(247,209,133,0.12)',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrap: {
    width: 72,
    height: 72,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2.5,
    borderColor: appTheme.NEW_PALLET,
  },
  avatarPlaceholder: {
    backgroundColor: appTheme.NEW_PALLET,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: appTheme.NEW_PALLET,
  },
  summaryName: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  summaryMobile: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 3,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: appTheme.NEW_PALLET,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 8,
  },
  typeChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: appTheme.DARK_BOTTOMTAB,
    marginLeft: 4,
  },
  summaryActions: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 10,
  },
  actionPrimary: {
    backgroundColor: appTheme.NEW_PALLET,
  },
  actionPrimaryText: {
    fontSize: 13,
    fontWeight: '700',
    color: appTheme.DARK_BOTTOMTAB,
    marginLeft: 6,
  },
  actionSecondary: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  actionSecondaryText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'white',
    marginLeft: 6,
    flexShrink: 1,
  },
  editBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '5%',
    marginTop: 12,
    backgroundColor: '#FFF4DB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  editBannerText: {
    flex: 1,
    fontSize: 12,
    color: '#8A6100',
    marginLeft: 8,
  },
  fieldLabel: {
    fontSize: 13,
    color: 'black',
    marginTop: 10,
    marginBottom: 6,
  },
  dropdown: {
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: 'white',
  },
  dropdownLocked: {
    backgroundColor: '#F5F5F5',
  },
  dropdownText: {
    fontSize: 15,
    color: 'black',
  },
  dropdownPlaceholder: {
    fontSize: 15,
    color: '#A0A0A0',
  },
  errorText: {
    fontSize: 11,
    color: 'red',
    marginTop: 4,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '5%',
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1C',
    marginLeft: 8,
  },
});

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
