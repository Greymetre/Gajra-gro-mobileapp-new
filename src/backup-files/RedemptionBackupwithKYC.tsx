import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  Text,
  Pressable,
  BackHandler,
  Platform,
  PermissionsAndroid,
  ScrollView,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import colors from '../../styles/colors';
import LottieView from 'lottie-react-native';
import navigationStrings from '../../constants/navigationStrings';
import {
  Button,
  Card,
  Dialog,
  Header as HeaderRNE,
  Image as ImageRNE,
  ListItem,
} from '@rneui/themed';
import ImageCropPicker from 'react-native-image-crop-picker';
import imagePath from '../../constants/imagePath';
import {useNavigation} from '@react-navigation/native';
import styles from './styles';
import {responsiveFontSize} from 'react-native-responsive-dimensions';
import {NavigationInterFace} from '../../interfaces/navigationType.interface';
import {
  requestCustomerBalancePoint,
  requestGetKycInfo,
  requestUpdateCustomerKycInfo,
} from '../../services/backend_helper';
import {getSettingAsyncStorage} from '../../services/auth_helper';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useTranslation} from 'react-i18next';
import * as ImagePicker from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import RNFS from 'react-native-fs';
import {useFormik} from 'formik';
import appTheme from '../../utils/appTheme';
import * as Yup from 'yup';
import FormData from 'form-data';

const includeExtra = true;
const RedemptionFinal = (props: any) => {
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [aadharFileFront, setAadharFileFront] = useState<String | null>();
  const [aadharFileURIFront, setAadharFileURIFront] = useState<String | null>();
  const [aadharFileBack, setAadharFileBack] = useState<String | null>();
  const [aadharFileURIBack, setAadharFileURIBack] = useState<String | null>();
  const [passbookFile, setpassbookFile] = useState<String | null>();
  const [passbookFileURI, setpassbookFileURI] = useState<String | null>();
  const [panFile, setPanFile] = useState<String | null>();
  const [panFileURI, setPanFileURI] = useState<String | null>();
  const [aadharFrontObject, setAaharFrontObject] = useState({});
  const [aadharBackObject, setAaharBackObject] = useState({});
  const [passbookObject, setPassbookObject] = useState({});
  const [panObject, setPanObject] = useState({});
  const [showAadharFront, setShowAadharFront] = useState(false);
  const [showAadharBack, setShowAadharBack] = useState(false);
  const [showPassbook, setshowPassbook] = useState(false);
  const [showPAN, setShowPan] = useState(false);
  const [conditonalAPI, setConditionalAPI] = useState({});
  const [disableNEFT, setDisableNEFT] = useState(true);
  const [newForm, setnewform] = useState('');
  // const [showAadharFront, setShowAadharFront] = useState(false);
  // const [showAadharFront, setShowAadharFront] = useState(false);
  // const [chooseMode, setChooseMode] = useState('');
  const [balancePoint, setBalancePoint] = useState(0);
  const [redemptionPoint, setRedemptionPoint] = useState(0);
  const [thresholdPoint, setThresholdPoint] = useState(0);
  const [isLoadingPoints, setIsLoadingPoints] = useState(true);
  const [modalVisible, setModalVisible] = useState(true);
  const [msgTxt, setMsgTxt] = useState('');
  const [showSubmitMsg, setShowSubmitMsg] = useState(false);

  const [visibleAF, setVisibleAF] = useState(false);
  const [visibleAB, setVisibleAB] = useState(false);
  const [visibleP, setVisibleP] = useState(false);
  const [visiblePAN, setVisiblePAN] = useState(false);
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
  const [dbKyc, setDbKyc] = useState({});
  const {t} = useTranslation();
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
  const OsVer = Platform.constants['Release'];
  console.log(OsVer);
  // const initialValues = {
  //   aadharfrontimage: [],
  //   aadharbackimage: {},
  //   panimage: {},
  //   bankimage: {},
  // };
  // const validationSchema = Yup.object({
  //   aadharfrontimage: Yup.mixed().required(
  //     `${t('requirederror', {fieldname: `${t('name')}`})}`,
  //   ),
  //   aadharbackimage: Yup.mixed().required(
  //     `${t('requirederror', {fieldname: `${t('name')}`})}`,
  //   ),
  //   panimage: Yup.mixed(),
  //   bankimage: Yup.mixed().required(
  //     `${t('requirederror', {fieldname: `${t('name')}`})}`,
  //   ),
  // });
  // console.log(
  //   'file://' + RNFS.DownloadDirectoryPath + '/' + responseFrontAadharDB.id,
  // );
  const onSubmit = async () => {
    console.log('Inside Lop');
    console.log('Front URI -', aadharFileURIFront);
    // if (aadharFileURIFront !== undefined && aadharFileURIFront !== null) {

    // setAaharFrontObject({
    //   name: 'Aadhar Front',
    //   type: responseFrontAadharDB.type,
    //   uri:
    //     'file://' + RNFS.DownloadDirectoryPath + '/' + responseFrontAadharDB.id,
    // });
    // setAaharBackObject({
    //   name: 'Aadhar Back',
    //   type: responseBackAadharDB.type,
    //   uri:
    //     'file://' + RNFS.DownloadDirectoryPath + '/' + responseBackAadharDB.id,
    // });

    const formData = new FormData();
    await formData.append('aadharimage', aadharFrontObject);
    await formData.append('aadharBackImage', aadharBackObject);
    await formData.append('passbookImage', passbookObject);
    // if (Object.keys(panObject).length !== 0) {
    //   await formData.append('panimage', panObject);
    // }
    console.log(formData);
    setnewform(formData);
    await requestUpdateCustomerKycInfo(formData)
      .then(res => {
        if (res.isError == false) {
          console.log('File Upload Response', res);
          console.log('File Uploaded Successfully');
          setShowSubmitMsg(true);
          setMsgTxt('Your KYC details have been sent for verification');
        }
      })
      .catch(error => {
        setShowSubmitMsg(true);
        setMsgTxt(error + JSON.stringify(error.request._response));
        console.log('Response: ', error);
      });
    // formData.append('avatar', aadharFileURIFront);
  };
  // const verifiedInitalValues = {
  //   aadharFrontImage: '',
  //   aadharBackImage: '',
  //   gstinImage: '',
  //   panImage: '',
  //   otherFrontImage: '',
  //   otherBackImage: '',
  //   panVerified: false,
  //   gstinVerified: false,
  //   aadharVerified: false,
  //   otherVerified: false,
  // };
  const verifiedValidationSchema = Yup.object({
    aadharFrontImage: Yup.string().required(
      `${t('requirederror', {fieldname: `${t('aadharcardfront')}`})}`,
    ),
    passbookImage: Yup.string().required(
      `${t('requirederror', {fieldname: `${t('pass_cheque')}`})}`,
    ),
    aadharBackImage: Yup.string().required(
      `${t('requirederror', {fieldname: `${t('aadharcardback')}`})}`,
    ),
  });
  const verifiedFormik = useFormik({
    initialValues: dbKyc,
    onSubmit,
    validationSchema: verifiedValidationSchema,
    enableReinitialize: true,
    validateOnMount: true,
  });
  const fetchGetAuthKycInfo = async () => {
    await requestGetKycInfo({})
      .then(res => {
        console.log(res);
        if (res.isError === false) {
          // console.log('Response KYC Details - ', res.data);
          setDbKyc(res.data);
          if (
            res.data.aadharVerified === true &&
            res.data.bankVerified === true
          ) {
            setDisableNEFT(false);
          }
          if (res.data.aadharFrontImage !== '') {
            setConditionalAPI(conditonalAPI => ({
              ...conditonalAPI,
              aadharFrontImage: true,
            }));
          }
          if (res.data.aadharBackImage !== '') {
            setConditionalAPI(conditonalAPI => ({
              ...conditonalAPI,
              aadharBackImage: true,
            }));
          }
          if (res.data.panImage !== '') {
            setConditionalAPI(conditonalAPI => ({
              ...conditonalAPI,
              panImage: true,
            }));
          }
          if (res.data.passbookImage !== '') {
            setConditionalAPI(conditonalAPI => ({
              ...conditonalAPI,
              passbookImage: true,
            }));
          }
        }
      })
      .catch(error => {
        console.log('Response: ', error.responses);
      });
  };
  // console.log(conditonalAPI);
  // console.log('Database KYC  -- ', dbKyc);
  // console.log('Final Formik Values - ', verifiedFormik.values);
  // console.log('Verified Formik - ', verifiedFormik.values);

  async function requestPermissions() {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.requestMultiple([
        'android.permission.READ_EXTERNAL_STORAGE',
        'android.permission.WRITE_EXTERNAL_STORAGE',
        'android.permission.READ_MEDIA_IMAGES',
        'android.permission.CAMERA',
      ]);
      console.log('Permissions Granted - ', granted);
      if (Platform.OS === 'android' && OsVer >= 13) {
        if (
          granted['android.permission.READ_MEDIA_IMAGES'] === 'granted' &&
          // granted['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted' &&
          granted['android.permission.CAMERA'] === 'granted'
        ) {
          setPermissionsGranted(true);
        }
      } else if (
        // granted['android.permission.READ_EXTERNAL_STORAGE'] === 'granted' &&
        // granted['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted' &&
        granted['android.permission.CAMERA'] === 'granted'
      ) {
        setPermissionsGranted(true);
      }
    }
    console.log('Out loop granted - ', permissionsGranted);
  }
  const newAadharFront = async () => {
    ImageCropPicker.openCamera({
      compressImageQuality: 0.2,
      freeStyleCropEnabled: true,
      cropping: true,
    }).then(async image => {
      console.log(image);
      await setAaharFrontObject({
        name: 'Aadhar Front',
        type: image.mime,
        uri: `${image.path}`,
      });
      await verifiedFormik.setFieldValue('aadharFrontImage', `${image.path}`);
    });
  };
  const newAadharBack = async () => {
    ImageCropPicker.openCamera({
      compressImageQuality: 0.2,
      freeStyleCropEnabled: true,
      cropping: true,
    }).then(async image => {
      console.log(image);
      await setAaharBackObject({
        name: 'Aadhar Back',
        type: image.mime,
        uri: `${image.path}`,
      });
      await verifiedFormik.setFieldValue('aadharBackImage', `${image.path}`);
    });
  };
  const newGalleryAadharFront = async () => {
    ImageCropPicker.openPicker({
      compressImageQuality: 0.2,
      freeStyleCropEnabled: true,
      cropping: true,
    }).then(async image => {
      console.log(image);
      await setAaharFrontObject({
        name: 'Aadhar Front',
        type: image.mime,
        uri: `${image.path}`,
      });
      await verifiedFormik.setFieldValue('aadharFrontImage', `${image.path}`);
    });
  };
  const newGalleryAadharBack = async () => {
    ImageCropPicker.openPicker({
      compressImageQuality: 0.2,
      freeStyleCropEnabled: true,
      cropping: true,
    }).then(async image => {
      console.log(image);
      await setAaharBackObject({
        name: 'Aadhar Back',
        type: image.mime,
        uri: `${image.path}`,
      });
      await verifiedFormik.setFieldValue('aadharBackImage', `${image.path}`);
    });
  };
  const newPassbook = async () => {
    ImageCropPicker.openCamera({
      compressImageQuality: 0.2,
      freeStyleCropEnabled: true,
      cropping: true,
    }).then(async image => {
      console.log(image);
      await setPassbookObject({
        name: 'Passbook',
        type: image.mime,
        uri: `${image.path}`,
      });
      await verifiedFormik.setFieldValue('passbookImage', `${image.path}`);
    });
  };
  const newPAN = async () => {
    ImageCropPicker.openCamera({
      compressImageQuality: 0.2,
      freeStyleCropEnabled: true,
      cropping: true,
    }).then(async image => {
      console.log(image);
      await setPanObject({
        name: 'PAN Card',
        type: image.mime,
        uri: `${image.path}`,
      });
      await verifiedFormik.setFieldValue('panImage', `${image.path}`);
    });
  };
  const newGalleryPAN = async () => {
    ImageCropPicker.openPicker({
      compressImageQuality: 0.2,
      freeStyleCropEnabled: true,
      cropping: true,
    }).then(async image => {
      console.log(image);
      await setPanObject({
        name: 'PAN Card',
        type: image.mime,
        uri: `${image.path}`,
      });
      await verifiedFormik.setFieldValue('panImage', `${image.path}`);
    });
  };
  const newGalleryPassbook = async () => {
    ImageCropPicker.openPicker({
      compressImageQuality: 0.2,
      freeStyleCropEnabled: true,
      cropping: true,
    }).then(async image => {
      console.log(image);
      await setPassbookObject({
        name: 'Passbook',
        type: image.mime,
        uri: `${image.path}`,
      });
      await verifiedFormik.setFieldValue('passbookImage', `${image.path}`);
    });
  };

  // const checkAndroidPermission = async () => {
  //   if (Platform.OS === 'android') {
  //     const granted = await PermissionsAndroid.requestMultiple([
  //       'android.permission.READ_EXTERNAL_STORAGE',
  //       'android.permission.WRITE_EXTERNAL_STORAGE',
  //       'android.permission.CAMERA',
  //     ]);
  //     console.log('Permissions Granted - ', granted);
  //     if (
  //       granted['android.permission.READ_EXTERNAL_STORAGE'] ===
  //         'never_ask_again' &&
  //       granted['android.permission.WRITE_EXTERNAL_STORAGE'] ===
  //         'never_ask_again' &&
  //       granted['android.permission.CAMERA'] === 'granted'
  //     ) {
  //       setPermissionsGranted(true);
  //     }
  //   }
  // };
  // console.log(verifiedFormik.values['aadharFrontImage']);
  const openGalleryAadharFront = async () => {
    // console.log('1');
    // await requestPermissions();
    // console.log('2');
    // if (Platform.OS === 'android') {
    //   const readGranted = await PermissionsAndroid.check(
    //     'android.permission.READ_EXTERNAL_STORAGE',
    //   );
    //   console.log('Read Permission - ', readGranted);
    //   const writeGranted = await PermissionsAndroid.check(
    //     'android.permission.WRITE_EXTERNAL_STORAGE',
    //   );
    //   console.log('Read Permission - ', writeGranted);
    //   const cameraGranted = await PermissionsAndroid.check(
    //     'android.permission.CAMERA',
    //   );
    //   console.log('Read Permission - ', cameraGranted);
    // }
    console.log('-----------------');
    await requestPermissions();
    if (permissionsGranted) {
      await ImagePicker.launchImageLibrary(
        {
          mediaType: 'photo',
          includeBase64: true,
          includeExtra,
          quality: 0.5,
          selectionLimit: 1,
        },
        response => {
          if (response.didCancel) {
            console.log('Action Cancelled by User');
          } else if (response.errorMessage) {
            console.log('Error Message', response.errorMessage);
          } else if (response && response?.assets != undefined) {
            console.log(response.assets[0]);
            // setResponseFrontAadharDB(response.assets[0]);
            // setAadharFileURIFront('asd');
            const destiny =
              RNFS.DownloadDirectoryPath + '/' + response?.assets[0].id;
            console.log(response.assets[0]);
            setAadharFileURIFront(destiny);
            // setAadharFileFront('file://' + destiny);
            // console.log(destiny);
            console.log('aadharFileURIFront', response?.assets[0].uri);
            // verifiedFormik.setFieldValue(
            //   'aadharFrontImage',
            //   response?.assets[0].uri,
            // );
            // console.log('aadharFileURIFront', aadharFileURIFront);
            console.log('4');
            RNFS.copyFile(response.assets[0].uri, destiny)
              .then(success => {
                console.log(success);
                console.log('file moved!' + success);
                setAadharFileFront(`file://${destiny}`);
              })
              .catch(err => {
                console.log('Error: ' + err.message);
              });
            setAaharFrontObject({
              name: 'Aadhar Front',
              type: response?.assets[0]?.type,
              uri: `file://${destiny}`,
            });
            verifiedFormik.setFieldValue(
              'aadharFrontImage',
              `file://${destiny}`,
            );
            // formik.setFieldValue('aadharfrontimage', aadharFileURIFront);
          }
        },
      );
      // console.log('aadharFileURIFront', aadharFileURIFront);
      // console.log('aadharFileURIFront', aadharFileURIFront);
      // console.log('aadharFileURIFront', aadharFileURIFront);
      // console.log('aadharFileURIFront', aadharFileURIFront);
      // console.log('aadharFileURIFront', aadharFileURIFront);
    }
  };
  // console.log('Response DB', responseFrontAadharDB);
  // console.log('aadharFileURIFront', aadharFileURIFront);
  const openCameraAadharFront = async () => {
    await requestPermissions();
    if (permissionsGranted) {
      await ImagePicker.launchCamera(
        {mediaType: 'photo', quality: 0.5, cameraType: 'back'},
        response => {
          if (response.didCancel) {
            console.log('Action Cancelled by User');
          } else if (response.errorMessage) {
            console.log('Error Message', response.errorMessage);
          } else if (response && response?.assets != undefined) {
            console.log('Response', response);
            const destiny =
              RNFS.DownloadDirectoryPath + '/' + response?.assets[0].id;
            setAadharFileURIFront(destiny);
            RNFS.copyFile(response.assets[0].uri, destiny)
              .then(success => {
                console.log(success);
                console.log('file moved!' + success);
                setAadharFileFront(`file://${destiny}`);
              })
              .catch(err => {
                console.log('Error: ' + err.message);
              });
            setAaharFrontObject({
              name: 'Aadhar Front',
              type: response?.assets[0]?.type,
              uri: `file://${destiny}`,
            });
            verifiedFormik.setFieldValue(
              'aadharFrontImage',
              `file://${destiny}`,
            );
          }
        },
      );
    }
  };
  const openGalleryAadharBack = async () => {
    await requestPermissions();
    if (permissionsGranted) {
      await ImagePicker.launchImageLibrary(
        {
          mediaType: 'photo',
          includeBase64: true,
          includeExtra,
          quality: 0.5,
          selectionLimit: 1,
        },
        response => {
          if (response.didCancel) {
            console.log('Action Cancelled by User');
          } else if (response.errorMessage) {
            console.log('Error Message', response.errorMessage);
          } else if (response && response?.assets != undefined) {
            console.log('Response', response);
            const destiny =
              RNFS.DownloadDirectoryPath + '/' + response?.assets[0].id;
            setAadharFileURIBack(destiny);
            console.log('destiny', destiny);
            console.log('aadharFileURIBack', aadharFileURIBack);
            RNFS.copyFile(response.assets[0].uri, destiny)
              .then(success => {
                console.log(success);
                console.log('file moved!' + success);
                setAadharFileBack(`file://${destiny}`);
              })
              .catch(err => {
                console.log('Error: ' + err.message);
              });
            setAaharBackObject({
              name: 'Aadhar Back',
              type: response?.assets[0]?.type,
              uri: `file://${destiny}`,
            });
            verifiedFormik.setFieldValue(
              'aadharBackImage',
              `file://${destiny}`,
            );
          }
        },
      );
    }
  };
  const openCameraAadharBack = async () => {
    console.log('1');
    await requestPermissions();
    console.log('2');
    if (permissionsGranted) {
      await ImagePicker.launchCamera(
        {
          mediaType: 'photo',
          includeBase64: true,
          includeExtra,
          quality: 0.5,
          cameraType: 'back',
        },
        response => {
          if (response.didCancel) {
            console.log('Action Cancelled by User');
          } else if (response.errorMessage) {
            console.log('Error Message', response.errorMessage);
          } else if (response && response?.assets != undefined) {
            console.log('Response', response);
            const destiny =
              RNFS.DownloadDirectoryPath + '/' + response?.assets[0].id;
            setAadharFileURIBack(destiny);
            console.log('destiny', destiny);
            console.log('aadharFileURIBack', aadharFileURIBack);
            RNFS.copyFile(response.assets[0].uri, destiny)
              .then(success => {
                console.log(success);
                console.log('file moved!' + success);
                setAadharFileBack(`file://${destiny}`);
              })
              .catch(err => {
                console.log('Error: ' + err.message);
              });
            setAaharBackObject({
              name: 'Aadhar Back',
              type: response?.assets[0]?.type,
              uri: `file://${destiny}`,
            });
            verifiedFormik.setFieldValue(
              'aadharBackImage',
              `file://${destiny}`,
            );
          }
        },
      );
    }
  };
  const openGalleryPassbook = async () => {
    await requestPermissions();
    if (permissionsGranted) {
      await ImagePicker.launchImageLibrary(
        {
          mediaType: 'photo',
          includeBase64: true,
          includeExtra,
          quality: 0.5,
          selectionLimit: 1,
        },
        response => {
          if (response.didCancel) {
            console.log('Action Cancelled by User');
          } else if (response.errorMessage) {
            console.log('Error Message', response.errorMessage);
          } else if (response && response?.assets != undefined) {
            console.log('Response', response);
            const destiny =
              RNFS.DownloadDirectoryPath + '/' + response?.assets[0].id;
            setpassbookFileURI(destiny);
            console.log('destiny', destiny);
            console.log('Passbook URI', passbookFileURI);
            RNFS.copyFile(response.assets[0].uri, destiny)
              .then(success => {
                console.log(success);
                console.log('file moved!' + success);
                setpassbookFile(`file://${destiny}`);
              })
              .catch(err => {
                console.log('Error: ' + err.message);
              });
            verifiedFormik.setFieldValue('passbookImage', passbookFile);
            setPassbookObject({
              name: 'Passbook',
              type: response?.assets[0]?.type,
              uri: `file://${destiny}`,
            });
            verifiedFormik.setFieldValue('passbookImage', `file://${destiny}`);
          }
        },
      );
    }
  };
  const openCameraPassbook = async () => {
    console.log('1');
    await requestPermissions();
    console.log('2');
    if (permissionsGranted) {
      await ImagePicker.launchCamera(
        {
          mediaType: 'photo',
          includeBase64: true,
          includeExtra,
          quality: 0.5,
          cameraType: 'back',
        },
        response => {
          if (response.didCancel) {
            console.log('Action Cancelled by User');
          } else if (response.errorMessage) {
            console.log('Error Message', response.errorMessage);
          } else if (response && response?.assets != undefined) {
            console.log('Response', response);
            const destiny =
              RNFS.DownloadDirectoryPath + '/' + response?.assets[0].id;
            setpassbookFileURI(destiny);
            console.log('destiny', destiny);
            console.log('Passbook URI - ', passbookFileURI);
            RNFS.copyFile(response.assets[0].uri, destiny)
              .then(success => {
                console.log(success);
                console.log('file moved!' + success);
                setpassbookFile(`file://${destiny}`);
              })
              .catch(err => {
                console.log('Error: ' + err.message);
              });
            setPassbookObject({
              name: 'Passbook',
              type: response?.assets[0]?.type,
              uri: `file://${destiny}`,
            });
            verifiedFormik.setFieldValue('passbookImage', `file://${destiny}`);
          }
        },
      );
    }
  };
  const openGalleryPAN = async () => {
    await requestPermissions();
    if (permissionsGranted) {
      await ImagePicker.launchImageLibrary(
        {
          mediaType: 'photo',
          includeBase64: true,
          includeExtra,
          quality: 0.5,
          selectionLimit: 1,
        },
        response => {
          if (response.didCancel) {
            console.log('Action Cancelled by User');
          } else if (response.errorMessage) {
            console.log('Error Message', response.errorMessage);
          } else if (response && response?.assets != undefined) {
            console.log('Response', response);
            const destiny =
              RNFS.DownloadDirectoryPath + '/' + response?.assets[0].id;
            setPanFileURI(destiny);
            console.log('destiny', destiny);
            console.log('PAN URI - ', panFileURI);
            RNFS.copyFile(response.assets[0].uri, destiny)
              .then(success => {
                console.log(success);
                console.log('file moved!' + success);
                setPanFile(`file://${destiny}`);
              })
              .catch(err => {
                console.log('Error: ' + err.message);
              });
            setPanObject({
              name: 'PAN Card',
              type: response?.assets[0]?.type,
              uri: `file://${destiny}`,
            });
            verifiedFormik.setFieldValue('panImage', `file://${destiny}`);
          }
        },
      );
    }
  };
  console.log('Form is Valid - ', verifiedFormik.isValid);
  const openCameraPAN = async () => {
    console.log('1');
    await requestPermissions();
    console.log('2');
    if (permissionsGranted) {
      await ImagePicker.launchCamera(
        {
          mediaType: 'photo',
          includeBase64: true,
          includeExtra,
          quality: 0.5,
          cameraType: 'back',
        },
        response => {
          if (response.didCancel) {
            console.log('Action Cancelled by User');
          } else if (response.errorMessage) {
            console.log('Error Message', response.errorMessage);
          } else if (response && response?.assets != undefined) {
            console.log('Response', response);
            const destiny =
              RNFS.DownloadDirectoryPath + '/' + response?.assets[0].id;
            setPanFileURI(destiny);
            console.log('destiny', destiny);
            console.log('aadharFileURIBack', panFileURI);
            RNFS.copyFile(response.assets[0].uri, destiny)
              .then(success => {
                console.log(success);
                console.log('file moved!' + success);
                setPanFile(`file://${destiny}`);
              })
              .catch(err => {
                console.log('Error: ' + err.message);
              });
            setPanObject({
              name: 'PAN Card',
              type: response?.assets[0]?.type,
              uri: `file://${destiny}`,
            });
            verifiedFormik.setFieldValue('panImage', `file://${destiny}`);
          }
        },
      );
    }
  };
  function handleBackButtonClick() {
    navigation.goBack();
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
  const fetchCustomerBalancePoint = async () => {
    await requestCustomerBalancePoint({})
      .then(res => {
        if (res.isError == false) {
          setBalancePoint(res?.data?.balance);
          setRedemptionPoint(res?.data?.redeempoint);
          setIsLoadingPoints(false);
        }
      })
      .catch(error => {
        console.log('Response: ', error);
      });
  };
  const getThresholdPoints = async () => {
    await getSettingAsyncStorage()
      .then(res => {
        const sett = JSON.parse(res);
        setThresholdPoint(sett?.redemption?.threshold);
      })
      .catch(error => {
        console.log('Response: ', error);
      });
  };
  useEffect(() => {
    getThresholdPoints();
    fetchCustomerBalancePoint();
    requestPermissions();
    fetchGetAuthKycInfo();
  }, []);
  const navigation = useNavigation<NavigationInterFace>();
  const {height, width} = Dimensions.get('window');

  return (
    <View
      style={{flex: 1, backgroundColor: colors.white, height: height}}>
      <HeaderRNE
        backgroundColor="white"
        backgroundImageStyle={{}}
        barStyle="default"
        centerComponent={{
          text: `${t('redemption')}`,
          style: {color: 'black', fontSize: 22},
        }}
        centerContainerStyle={{height: 28, justifyContent: 'center'}}
        leftComponent={
          <TouchableOpacity onPress={() => props.navigation.goBack()}>
            <Ionicons name="chevron-back" size={25} color={'black'} />
          </TouchableOpacity>
        }
        leftContainerStyle={{paddingLeft: 5}}
        placement="center"
      />
      <ScrollView>
        <View>
          <Card containerStyle={styles.big_card_view}>
            <Image style={styles.image_view} source={imagePath.REEDEM_DEC} />
          </Card>
        </View>
        <View
          style={{
            paddingTop: 20,
            paddingHorizontal: 17,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Button
            onPress={() => navigation.navigate('UPIScreen', {mode: 'UPI'})}
            containerStyle={{
              justifyContent: 'center',
              // elevation: 1,
            }}
            buttonStyle={{
              // backgroundColor: '#FFE7C7',
              backgroundColor: '#FEF8DD',
              borderRadius: 20,
              width: width / 2 - 30,
              height: 90,
              overflow: 'hidden',
            }}
            titleStyle={{
              marginLeft: 35,
              padding: 20,
              fontSize: responsiveFontSize(2.2),
              margin: 10,
              color: 'black',
            }}
            title={`${t('upi')}`}
            iconPosition={'right'}
            disabled={true}
            icon={
              <View style={{overflow: 'hidden', borderRadius: 20}}>
                <View
                  style={{
                    paddingLeft: 80,
                    height: 120,
                    width: 120,
                    borderRadius: 130 / 2,
                    // backgroundColor: '#FFE7C7',
                    backgroundColor: '#aaaaaa',
                    overflow: 'hidden',
                  }}
                />
                <View
                  style={{
                    paddingTop: 120,
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignSelf: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                  }}>
                  <Icon
                    name="send-o"
                    size={30}
                    color="#585858"
                    style={{
                      position: 'absolute',
                      paddingRight: 30,
                    }}
                  />
                </View>
              </View>
            }
          />
          <Button
            onPress={() => navigation.navigate('Neft')}
            containerStyle={{
              justifyContent: 'center',
            }}
            // disabled={disableNEFT}
            buttonStyle={{
              backgroundColor: '#FEF8DD',
              borderRadius: 20,
              width: width / 2 - 30,
              height: 90,
              overflow: 'hidden',
            }}
            titleStyle={{
              marginLeft: 35,
              padding: 20,
              fontSize: responsiveFontSize(2.2),
              margin: 10,
              color: 'black',
            }}
            // title={`${t('neft')}`}
            title={`${t('IMPS')}`}
            iconPosition={'right'}
            icon={
              <View style={{overflow: 'hidden'}}>
                <View
                  style={{
                    paddingLeft: 80,
                    height: 120,
                    width: 120,
                    borderRadius: 130 / 2,
                    backgroundColor: '#FFE7C7',
                    overflow: 'hidden',
                  }}
                />
                <View
                  style={{
                    paddingTop: 120,
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignSelf: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                  }}>
                  <Icon
                    name="bank"
                    size={30}
                    color="#585858"
                    style={{
                      position: 'absolute',
                      paddingRight: 30,
                    }}
                  />
                </View>
              </View>
            }
          />
        </View>
        <View
          style={{
            paddingLeft: 15,
            paddingRight: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View>
            <Text style={{color: 'black'}}>{t('upicoming')}</Text>
          </View>
          {disableNEFT ? (
            <View style={{width: 160}}>
              <Text style={{color: 'red'}}>{t('verifyKYC')}</Text>
            </View>
          ) : null}
        </View>
        {/* // Uncomment before the production */}
        {redemptionPoint === 0 &&
        Number(balancePoint) < Number(thresholdPoint) &&
        !isLoadingPoints ? (
          // <AlertStatic
          //   successAlert={false}
          //   title={`${t('lowpoints')}`}
          //   messageText={`${t('err1')} ${thresholdPoint - balancePoint} ${t(
          //     'err2',
          //   )}`}
          // />
          <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {}}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <LottieView
                    style={{
                      height: 200,
                      width: 200,
                    }}
                    source={require('../../../assets/images/alert.json')}
                    autoPlay
                    loop 
                  />
                  <Text style={styles.modalText}>{`${t('lowpoints')}`}</Text>
                  <Text style={styles.modalText}>{`${t('err1')} ${
                    thresholdPoint - balancePoint
                  } ${t('err2')}`}</Text>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => {
                      console.log('Go Back Pressed');
                      navigation.navigate(navigationStrings.HOME);
                      setModalVisible(false);
                    }}>
                    <Text style={styles.textStyle}>{`${t('goback')}`}</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          </View>
        ) : null}
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
          <Text style={{color: 'black', fontSize: 16, margin: 5}}>
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
          <Text style={{fontSize: 14, paddingRight: 10, color: 'black'}}>
            <Text style={{fontSize: 14, color: 'black'}}>
              {t('aadharcardfront')}
            </Text>
            <Text style={{color: 'red'}}>*</Text>
          </Text>
          {verifiedFormik.values.aadharVerified === true ? (
            <View
              style={{
                borderRadius: 20,
                backgroundColor: '#d2f8dc',
                flexDirection: 'row',
                justifyContent: 'center',
                alignContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
              }}>
              <Ionicons
                name="checkmark-circle"
                color={'green'}
                size={15}
                style={{paddingLeft: 10}}
              />
              <Text
                style={{
                  fontSize: 14,
                  color: 'green',
                  paddingRight: 10,
                }}>
                {t('verified')}
              </Text>
            </View>
          ) : (
            <View
              style={{
                borderRadius: 20,
                backgroundColor: '#ffcccb',
                flexDirection: 'row',
                justifyContent: 'center',
                alignContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
              }}>
              <Ionicons
                name="close-circle"
                color={'red'}
                size={15}
                style={{paddingLeft: 10}}
              />
              <Text
                style={{
                  fontSize: 14,
                  color: 'red',
                  paddingRight: 10,
                }}>
                {t('notverified')}
              </Text>
            </View>
          )}
        </View>
        <View
          style={{
            alignContent: 'center',
            alignSelf: 'center',
            backgroundColor: '#FEF8DD',
            borderRadius: 18,
            width: '90%',
            flexDirection: 'row',
            height: 90,
            alignItems: 'center',
            elevation: 1,
          }}>
          <View
            style={{
              alignSelf: 'flex-end',
              justifyContent: 'flex-end',
              position: 'absolute',
              zIndex: 1,
              top: 0,
              right: 0,
              padding: 5,
            }}>
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

          {/* {aadharFileFront && aadharFileFront !== null ? ( */}
          {
            verifiedFormik.values['aadharFrontImage'] ? (
              <ImageRNE
                style={{
                  width: 110,
                  height: 70,
                  // width: '40%',
                  // height: '80%',
                  left: 10,
                  right: 10,
                  resizeMode: 'cover',
                  // borderRadius: 18,
                  borderBottomLeftRadius: 18,
                  borderTopLeftRadius: 18,
                  // borderBottomRightRadius: 18,
                }}
                onPress={() => setShowAadharFront(true)}
                source={{
                  // uri: `${imagePath.IMAGE_URL}${verifiedFormik.values['aadharFrontImage']}`:
                  uri: conditonalAPI.aadharFrontImage
                    ? `${imagePath.IMAGE_URL}${verifiedFormik.values['aadharFrontImage']}`
                    : `${verifiedFormik.values['aadharFrontImage']}`,
                  cache: 'reload',
                }}
              />
            ) : null
            // <Ionicons
            //   name="md-square-outline"
            //   size={46}
            //   style={{paddingLeft: 10}}
            //   color={'#585858'}
            // />
          }
          <View
            style={{
              flex: 1,
              // flexDirection: 'row',
              justifyContent: 'space-between',
              backgroundColor: '#FEF8DD',
              padding: 5,
              // borderRadius: 18,
              borderBottomLeftRadius: 18,
              borderBottomRightRadius: 18,
              // width: '100%',
              position: 'absolute',
              bottom: 0,
              right: 0,
            }}>
            <View style={{flexDirection: 'row'}}>
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
                titleStyle={{color: 'black'}}
                // onPress={() => openGalleryAadharFront()}
                onPress={toggleDialogAF}
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
          <View style={{padding: 1}}></View>
        </View>
        {showAadharFront ? (
          <Modal animationType="slide" transparent={true}>
            <Dialog
              overlayStyle={{borderRadius: 20}}
              isVisible={showAadharFront}
              onBackdropPress={toggleDialog}>
              <View
                style={{
                  justifyContent: 'center',
                  alignContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}>
                <Image
                  style={{
                    width: 290,
                    height: 210,
                    resizeMode: 'contain',
                  }}
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
          <Text style={{fontSize: 11, color: 'red', paddingLeft: 20}}>
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
          <Text style={{fontSize: 14, paddingRight: 10, color: 'black'}}>
            <Text style={{fontSize: 14, color: 'black'}}>
              {' '}
              {t('aadharcardback')}
            </Text>
            <Text style={{color: 'red'}}>*</Text>
          </Text>
          {verifiedFormik.values.aadharBackImage === true ? (
            <View
              style={{
                borderRadius: 20,
                backgroundColor: '#d2f8dc',
                flexDirection: 'row',
                justifyContent: 'center',
                alignContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
              }}>
              <Ionicons
                name="checkmark-circle"
                color={'green'}
                size={15}
                style={{paddingLeft: 10}}
              />
              <Text
                style={{
                  fontSize: 14,
                  color: 'green',
                  paddingRight: 10,
                }}>
                {t('verified')}
              </Text>
            </View>
          ) : (
            <View
              style={{
                borderRadius: 20,
                backgroundColor: '#ffcccb',
                flexDirection: 'row',
                justifyContent: 'center',
                alignContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
              }}>
              <Ionicons
                name="close-circle"
                color={'red'}
                size={15}
                style={{paddingLeft: 10}}
              />
              <Text
                style={{
                  fontSize: 14,
                  color: 'red',
                  paddingRight: 10,
                }}>
                {t('notverified')}
              </Text>
            </View>
          )}
        </View>
        <View
          style={{
            alignContent: 'center',
            alignSelf: 'center',
            backgroundColor: '#FEF8DD',
            borderRadius: 18,
            width: '90%',
            flexDirection: 'row',
            height: 90,
            alignItems: 'center',
            elevation: 1,
          }}>
          <View
            style={{
              alignSelf: 'flex-end',
              justifyContent: 'flex-end',
              position: 'absolute',
              zIndex: 1,
              top: 0,
              right: 0,
              padding: 5,
            }}>
            <Ionicons
              name="close-circle-outline"
              size={25}
              color={'red'}
              onPress={() => {
                verifiedFormik.setFieldValue('aadharBackImage', '');

                setAadharFileBack(null);
                setAadharFileURIBack(null);
              }}
            />
          </View>

          {
            verifiedFormik.values['aadharBackImage'] ? (
              <ImageRNE
                style={{
                  width: 110,
                  height: 70,
                  left: 10,
                  right: 10,
                  resizeMode: 'cover',
                  borderBottomLeftRadius: 18,
                  borderTopLeftRadius: 18,
                }}
                onPress={() => setShowAadharBack(true)}
                source={{
                  uri: conditonalAPI.aadharBackImage
                    ? `${imagePath.IMAGE_URL}${verifiedFormik.values['aadharBackImage']}`
                    : `${verifiedFormik.values['aadharBackImage']}`,
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
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              backgroundColor: '#FEF8DD',
              padding: 5,
              borderBottomLeftRadius: 18,
              borderBottomRightRadius: 18,
              position: 'absolute',
              bottom: 0,
              right: 0,
            }}>
            <View style={{flexDirection: 'row'}}>
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
                titleStyle={{color: 'black'}}
                onPress={toggleDialogAB}
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
          <View style={{padding: 1}}></View>
        </View>
        {showAadharBack ? (
          <Modal animationType="slide" transparent={true}>
            <Dialog
              overlayStyle={{borderRadius: 20}}
              isVisible={showAadharBack}
              onBackdropPress={toggleDialogAadharBack}>
              <View
                style={{
                  justifyContent: 'center',
                  alignContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}>
                <Image
                  style={{
                    width: 290,
                    height: 210,
                    resizeMode: 'contain',
                  }}
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
          <Text style={{fontSize: 11, color: 'red', paddingLeft: 20}}>
            {verifiedFormik.errors.aadharBackImage}
          </Text>
        )}
        <View
          style={{
            padding: 10,
            paddingLeft: 20,
            justifyContent: 'flex-start',
            flexDirection: 'row',
          }}>
          <Text style={{fontSize: 14, paddingRight: 10, color: 'black'}}>
            <Text style={{fontSize: 14, color: 'black'}}>
              {t('pass_cheque')}
            </Text>
            <Text style={{color: 'red'}}>*</Text>
          </Text>
          {verifiedFormik.values.bankVerified === true ? (
            <View
              style={{
                borderRadius: 20,
                backgroundColor: '#d2f8dc',
                flexDirection: 'row',
                justifyContent: 'center',
                alignContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
              }}>
              <Ionicons
                name="checkmark-circle"
                color={'green'}
                size={15}
                style={{paddingLeft: 10}}
              />
              <Text
                style={{
                  fontSize: 14,
                  color: 'green',
                  paddingRight: 10,
                }}>
                {t('verified')}
              </Text>
            </View>
          ) : (
            <View
              style={{
                borderRadius: 20,
                backgroundColor: '#ffcccb',
                flexDirection: 'row',
                justifyContent: 'center',
                alignContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
              }}>
              <Ionicons
                name="close-circle"
                color={'red'}
                size={15}
                style={{paddingLeft: 10}}
              />
              <Text
                style={{
                  fontSize: 14,
                  color: 'red',
                  paddingRight: 10,
                }}>
                {t('notverified')}
              </Text>
            </View>
          )}
        </View>
        <View
          style={{
            alignContent: 'center',
            alignSelf: 'center',
            backgroundColor: '#FEF8DD',
            borderRadius: 18,
            width: '90%',
            flexDirection: 'row',
            height: 90,
            alignItems: 'center',
            elevation: 1,
          }}>
          <View
            style={{
              alignSelf: 'flex-end',
              justifyContent: 'flex-end',
              position: 'absolute',
              zIndex: 1,
              top: 0,
              right: 0,
              padding: 5,
            }}>
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

          {
            verifiedFormik.values['passbookImage'] ? (
              <ImageRNE
                style={{
                  width: 110,
                  height: 70,
                  left: 10,
                  right: 10,
                  resizeMode: 'cover',
                  borderBottomLeftRadius: 18,
                  borderTopLeftRadius: 18,
                }}
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

          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              backgroundColor: '#FEF8DD',
              padding: 5,
              borderBottomLeftRadius: 18,
              borderBottomRightRadius: 18,
              position: 'absolute',
              bottom: 0,
              right: 0,
            }}>
            <View style={{flexDirection: 'row'}}>
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
                titleStyle={{color: 'black'}}
                onPress={toggleDialogP}
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
          <View style={{padding: 1}}></View>
        </View>
        {showPassbook ? (
          <Modal animationType="slide" transparent={true}>
            <Dialog
              overlayStyle={{borderRadius: 20}}
              isVisible={showPassbook}
              onBackdropPress={togglePassbook}>
              <View
                style={{
                  justifyContent: 'center',
                  alignContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}>
                <Image
                  style={{
                    width: 290,
                    height: 210,
                    resizeMode: 'contain',
                  }}
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
        {verifiedFormik.errors.passbookImage && (
          <Text style={{fontSize: 11, color: 'red', paddingLeft: 20}}>
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
          <Text style={{fontSize: 14, paddingRight: 10, color: 'black'}}>
            {t('pancard')}
          </Text>
          {verifiedFormik.values.panVerified === true ? (
            <View
              style={{
                borderRadius: 20,
                backgroundColor: '#d2f8dc',
                flexDirection: 'row',
                justifyContent: 'center',
                alignContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
              }}>
              <Ionicons
                name="checkmark-circle"
                color={'green'}
                size={15}
                style={{paddingLeft: 10}}
              />
              <Text
                style={{
                  fontSize: 14,
                  color: 'green',
                  paddingRight: 10,
                }}>
                {t('verified')}
              </Text>
            </View>
          ) : (
            <View
              style={{
                borderRadius: 20,
                backgroundColor: '#ffcccb',
                flexDirection: 'row',
                justifyContent: 'center',
                alignContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
              }}>
              <Ionicons
                name="close-circle"
                color={'red'}
                size={15}
                style={{paddingLeft: 10}}
              />
              <Text
                style={{
                  fontSize: 14,
                  color: 'red',
                  paddingRight: 10,
                }}>
                {t('notverified')}
              </Text>
            </View>
          )}
        </View>
        <View
          style={{
            alignContent: 'center',
            alignSelf: 'center',
            backgroundColor: '#FEF8DD',
            borderRadius: 18,
            width: '90%',
            flexDirection: 'row',
            height: 90,
            alignItems: 'center',
            elevation: 1,
          }}>
          <View
            style={{
              alignSelf: 'flex-end',
              justifyContent: 'flex-end',
              position: 'absolute',
              zIndex: 1,
              top: 0,
              right: 0,
              padding: 5,
            }}>
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

          {
            verifiedFormik.values['panImage'] ? (
              <ImageRNE
                style={{
                  width: 110,
                  height: 70,
                  left: 10,
                  right: 10,
                  resizeMode: 'cover',
                  borderBottomLeftRadius: 18,
                  borderTopLeftRadius: 18,
                }}
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

          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              backgroundColor: '#FEF8DD',
              padding: 5,
              borderBottomLeftRadius: 18,
              borderBottomRightRadius: 18,
              position: 'absolute',
              bottom: 0,
              right: 0,
            }}>
            <View style={{flexDirection: 'row'}}>
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
                titleStyle={{color: 'black'}}
                onPress={toggleDialogPAN}
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
          <View style={{padding: 1}}></View>
        </View>
        {showPAN ? (
          <Modal animationType="slide" transparent={true}>
            <Dialog
              overlayStyle={{borderRadius: 20}}
              isVisible={showPAN}
              onBackdropPress={togglePAN}>
              <View
                style={{
                  justifyContent: 'center',
                  alignContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}>
                <Image
                  style={{
                    width: 290,
                    height: 210,
                    resizeMode: 'contain',
                  }}
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
          <Text style={{fontSize: 11, color: 'red', paddingLeft: 20}}>
            {verifiedFormik.errors.panImage}
          </Text>
        )}
        <View
          style={{
            paddingTop: 10,
            justifyContent: 'space-evenly',
            marginHorizontal: 20,
            paddingBottom: 40,
          }}>
          <Button
            title={`${t('submit')}`}
            onPress={() => {
              onSubmit();
            }}
            buttonStyle={{
              backgroundColor: appTheme.NEW_PALLET,
              borderRadius: 8,
            }}
            titleStyle={{color: 'black'}}
            containerStyle={{paddingTop: 10}}
            disabled={!verifiedFormik.isValid}
          />
          {showSubmitMsg ? (
            <Text style={{color: 'red', paddingLeft: 15}}>{msgTxt}</Text>
          ) : null}
          {newForm ? <Text>{JSON.stringify(newForm)}</Text> : null}
        </View>
        <Dialog isVisible={visibleAF} onBackdropPress={toggleDialogAF}>
          <Dialog.Title title="Select" titleStyle={{color: 'black'}} />
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
                style={{width: width}}
                onPress={() => {
                  newAadharFront();
                  toggleDialogAF();
                }}
              />
              <Dialog.Button
                title="Gallery"
                onPress={() => {
                  newGalleryAadharFront();
                  toggleDialogAF();
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
                  toggleDialogAB();
                }}
              />
              <Dialog.Button
                title="Gallery"
                onPress={() => {
                  newGalleryAadharBack();
                  toggleDialogAB();
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
                  toggleDialogP();
                }}
              />
              <Dialog.Button
                title="Gallery"
                onPress={() => {
                  // newGalleryPassbook();
                  newGalleryPassbook();
                  toggleDialogP();
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
                  toggleDialogPAN();
                }}
              />
              <Dialog.Button
                title="Gallery"
                onPress={() => {
                  newGalleryPAN();
                  toggleDialogPAN();
                }}
              />
            </View>
          </Dialog.Actions>
        </Dialog>
      </ScrollView>
    </View>
  );
};

export default RedemptionFinal;
