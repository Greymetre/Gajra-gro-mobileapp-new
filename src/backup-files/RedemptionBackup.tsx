// import {
//   View,
//   SafeAreaView,
//   TouchableOpacity,
//   Image,
//   Dimensions,
//   Modal,
//   Text,
//   Pressable,
//   BackHandler,
//   Platform,
//   PermissionsAndroid,
//   ScrollView,
//   StyleSheet,
// } from 'react-native';
// import React, {useEffect, useState} from 'react';
// import colors from '../../styles/colors';
// import LottieView from 'lottie-react-native';
// import navigationStrings from '../../constants/navigationStrings';
// import {
//   Button,
//   Card,
//   Dialog,
//   Header as HeaderRNE,
//   Image as ImageRNE,
// } from '@rneui/themed';
// import imagePath from '../../constants/imagePath';
// import {useNavigation} from '@react-navigation/native';
// import styles from './styles';
// import {responsiveFontSize} from 'react-native-responsive-dimensions';
// import {NavigationInterFace} from '../../interfaces/navigationType.interface';
// import {
//   requestCustomerBalancePoint,
//   requestGetKycInfo,
//   requestUpdateCustomerKycInfo,
// } from '../../services/backend_helper';
// import {getSettingAsyncStorage} from '../../services/auth_helper';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import {useTranslation} from 'react-i18next';
// import * as ImagePicker from 'react-native-image-picker';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import RNFS from 'react-native-fs';
// import {useFormik} from 'formik';
// import appTheme from '../../utils/appTheme';
// import * as Yup from 'yup';

// const includeExtra = true;
// const RedemptionFinal = (props: any) => {
//   const [permissionsGranted, setPermissionsGranted] = useState(false);
//   const [aadharFileFront, setAadharFileFront] = useState<String | null>();
//   const [aadharFileURIFront, setAadharFileURIFront] = useState<String | null>();
//   const [aadharFileBack, setAadharFileBack] = useState<String | null>();
//   const [aadharFileURIBack, setAadharFileURIBack] = useState<String | null>();
//   const [passbookFile, setpassbookFile] = useState<String | null>();
//   const [passbookFileURI, setpassbookFileURI] = useState<String | null>();
//   const [panFile, setPanFile] = useState<String | null>();
//   const [panFileURI, setPanFileURI] = useState<String | null>();
//   const [aadharFrontObject, setAaharFrontObject] = useState({});
//   const [aadharBackObject, setAaharBackObject] = useState({});
//   const [passbookObject, setPassbookObject] = useState({});
//   const [panObject, setPanObject] = useState({});
//   const [showAadharFront, setShowAadharFront] = useState(false);
//   const [showAadharBack, setShowAadharBack] = useState(false);
//   const [showPassbook, setshowPassbook] = useState(false);
//   const [showPAN, setShowPan] = useState(false);
//   // const [showAadharFront, setShowAadharFront] = useState(false);
//   // const [showAadharFront, setShowAadharFront] = useState(false);
//   // const [chooseMode, setChooseMode] = useState('');
//   const [balancePoint, setBalancePoint] = useState(0);
//   const [redemptionPoint, setRedemptionPoint] = useState(0);
//   const [thresholdPoint, setThresholdPoint] = useState(0);
//   const [isLoadingPoints, setIsLoadingPoints] = useState(true);
//   const [modalVisible, setModalVisible] = useState(true);
//   const [responseFrontAadharDB, setResponseFrontAadharDB]: any = useState({});
//   const [responseBackAadharDB, setResponseBackAadharDB]: any = useState({});
//   // console.log('-------------------');
//   // console.log('File Front', aadharFileFront);
//   // console.log('Front Object', aadharFrontObject);
//   const [dbKyc, setDbKyc] = useState({});
//   const {t} = useTranslation();
//   const toggleDialog = () => {
//     setShowAadharFront(!showAadharFront);
//   };
//   const toggleDialogAadharBack = () => {
//     setShowAadharBack(!showAadharBack);
//   };
//   const togglePassbook = () => {
//     setshowPassbook(!showPassbook);
//   };
//   const togglePAN = () => {
//     setShowPan(!showPAN);
//   };
//   const initialValues = {
//     aadharfrontimage: [],
//     aadharbackimage: {},
//     panimage: {},
//     bankimage: {},
//   };
//   const validationSchema = Yup.object({
//     aadharfrontimage: Yup.mixed().required(
//       `${t('requirederror', {fieldname: `${t('name')}`})}`,
//     ),
//     aadharbackimage: Yup.mixed().required(
//       `${t('requirederror', {fieldname: `${t('name')}`})}`,
//     ),
//     panimage: Yup.mixed(),
//     bankimage: Yup.mixed().required(
//       `${t('requirederror', {fieldname: `${t('name')}`})}`,
//     ),
//   });
//   console.log(
//     'file://' + RNFS.DownloadDirectoryPath + '/' + responseFrontAadharDB.id,
//   );
//   const onSubmit = async () => {
//     console.log('Inside Lop');
//     console.log('Front URI -', aadharFileURIFront);
//     // if (aadharFileURIFront !== undefined && aadharFileURIFront !== null) {

//     // setAaharFrontObject({
//     //   name: 'Aadhar Front',
//     //   type: responseFrontAadharDB.type,
//     //   uri:
//     //     'file://' + RNFS.DownloadDirectoryPath + '/' + responseFrontAadharDB.id,
//     // });
//     // setAaharBackObject({
//     //   name: 'Aadhar Back',
//     //   type: responseBackAadharDB.type,
//     //   uri:
//     //     'file://' + RNFS.DownloadDirectoryPath + '/' + responseBackAadharDB.id,
//     // });

//     const formData = new FormData();
//     formData.append('aadharimage', aadharFrontObject);
//     formData.append('gstinimage', aadharFrontObject);
//     formData.append('otherimage', aadharBackObject);
//     formData.append('panimage', aadharFrontObject);
//     console.log(formData);
//     // await requestUpdateCustomerKycInfo(formData)
//     //   .then(res => {
//     //     if (res.isError == false) {
//     //       console.log('File Upload Response', res);
//     //       console.log('File Uploaded Successfully');
//     //     }
//     //   })
//     //   .catch(error => {
//     //     console.log('Response: ', error);
//     //   });
//     // }
//     // formData.append('avatar', aadharFileURIFront);
//   };
//   const formik = useFormik({initialValues, onSubmit, validationSchema});
//   const verifiedInitalValues = {
//     aadharFrontImage: '',
//     aadharBackImage: '',
//     gstinImage: '',
//     panImage: '',
//     otherFrontImage: '',
//     otherBackImage: '',
//     panVerified: false,
//     gstinVerified: false,
//     aadharVerified: false,
//     otherVerified: false,
//   };
//   const verifiedValidationSchema = {
//     aadharFrontImage: Yup.mixed(),
//     aadharBackImage: Yup.mixed(),
//     gstinImage: Yup.mixed(),
//     panImage: Yup.mixed(),
//     otherFrontImage: Yup.mixed(),
//     otherBackImage: Yup.mixed(),
//     panVerified: Yup.boolean(),
//     gstinVerified: Yup.boolean(),
//     aadharVerified: Yup.boolean(),
//     otherVerified: Yup.boolean(),
//   };
//   const verifiedFormik = useFormik({
//     initialValues: dbKyc,
//     onSubmit,
//     // validationSchema: verifiedValidationSchema,
//     enableReinitialize: true,
//   });
//   console.log('Verified formik - ', verifiedFormik);
//   const fetchGetAuthKycInfo = async () => {
//     await requestGetKycInfo({})
//       .then(res => {
//         console.log(res);
//         if (res.isError === false) {
//           console.log('Response KYC Details - ', res.data);
//           // console.log('Api Call1');
//           setDbKyc(res.data);
//           // for (const [key, value] of Object.entries(res.data)) {
//           //   if (verifiedInitalValues.hasOwnProperty(key)) {
//           //     verifiedFormik.setFieldValue(key, value);
//           //     console.log(verifiedFormik.values);
//           //   }
//           // }
//           // console.log('Api Call2');
//         }
//       })
//       .catch(error => {
//         console.log('Response: ', error.responses);
//       });
//   };
//   console.log('Database KYC  -- ', dbKyc);
//   // console.log('Final Formik Values - ', verifiedFormik.values);
//   async function requestPermissions() {
//     if (Platform.OS === 'android') {
//       const granted = await PermissionsAndroid.requestMultiple([
//         'android.permission.READ_EXTERNAL_STORAGE',
//         'android.permission.WRITE_EXTERNAL_STORAGE',
//         'android.permission.CAMERA',
//       ]);
//       console.log('Permissions Granted - ', granted);
//       if (
//         granted['android.permission.READ_EXTERNAL_STORAGE'] ===
//           'never_ask_again' &&
//         granted['android.permission.WRITE_EXTERNAL_STORAGE'] ===
//           'never_ask_again' &&
//         granted['android.permission.CAMERA'] === 'granted'
//       ) {
//         setPermissionsGranted(true);
//       }
//     }
//   }
//   // const checkAndroidPermission = async () => {
//   //   if (Platform.OS === 'android') {
//   //     const granted = await PermissionsAndroid.requestMultiple([
//   //       'android.permission.READ_EXTERNAL_STORAGE',
//   //       'android.permission.WRITE_EXTERNAL_STORAGE',
//   //       'android.permission.CAMERA',
//   //     ]);
//   //     console.log('Permissions Granted - ', granted);
//   //     if (
//   //       granted['android.permission.READ_EXTERNAL_STORAGE'] ===
//   //         'never_ask_again' &&
//   //       granted['android.permission.WRITE_EXTERNAL_STORAGE'] ===
//   //         'never_ask_again' &&
//   //       granted['android.permission.CAMERA'] === 'granted'
//   //     ) {
//   //       setPermissionsGranted(true);
//   //     }
//   //   }
//   // };
//   // console.log(verifiedFormik.values['aadharFrontImage']);
//   const openGalleryAadharFront = async () => {
//     // console.log('1');
//     // await requestPermissions();
//     // console.log('2');
//     // if (Platform.OS === 'android') {
//     //   const readGranted = await PermissionsAndroid.check(
//     //     'android.permission.READ_EXTERNAL_STORAGE',
//     //   );
//     //   console.log('Read Permission - ', readGranted);
//     //   const writeGranted = await PermissionsAndroid.check(
//     //     'android.permission.WRITE_EXTERNAL_STORAGE',
//     //   );
//     //   console.log('Read Permission - ', writeGranted);
//     //   const cameraGranted = await PermissionsAndroid.check(
//     //     'android.permission.CAMERA',
//     //   );
//     //   console.log('Read Permission - ', cameraGranted);
//     // }
//     if (permissionsGranted) {
//       await ImagePicker.launchImageLibrary(
//         {
//           mediaType: 'photo',
//           includeBase64: true,
//           includeExtra,
//           quality: 0.5,
//           selectionLimit: 1,
//         },
//         async response => {
//           if (response.didCancel) {
//             console.log('Action Cancelled by User');
//           } else if (response.errorMessage) {
//             console.log('Error Message', response.errorMessage);
//           } else if (response && response?.assets != undefined) {
//             console.log(response.assets[0]);
//             // setResponseFrontAadharDB(response.assets[0]);
//             // setAadharFileURIFront('asd');
//             // const destiny =
//             //   RNFS.DownloadDirectoryPath + '/' + response?.assets[0].id;
//             console.log(response.assets[0]);
//             // setAadharFileURIFront(destiny);
//             // setAadharFileFront('file://' + destiny);
//             // console.log(destiny);
//             console.log('aadharFileURIFront', response?.assets[0].uri);
//             verifiedFormik.setFieldValue(
//               'aadharFrontImage',
//               response?.assets[0].uri,
//             );
//             // console.log('aadharFileURIFront', aadharFileURIFront);
//             console.log('4');
//             // await RNFS.copyFile(response.assets[0].uri, destiny)
//             //   .then(success => {
//             //     console.log(success);
//             //     console.log('file moved!' + success);
//             //     setAadharFileFront(`file://${destiny}`);
//             //     // setAaharFrontObject({
//             //     //   name: 'Aadhar Front',
//             //     //   type: response?.assets[0]?.type,
//             //     //   uri: 'file://' + aadharFileURIFront,
//             //     // });
//             //   })
//             //   .catch(err => {
//             //     console.log('Error: ' + err.message);
//             //   });
//             setAaharFrontObject({
//               name: 'Aadhar Front',
//               type: await response?.assets[0]?.type,
//               uri: aadharFileFront,
//             });
//             // formik.setFieldValue('aadharfrontimage', aadharFileURIFront);
//           }
//         },
//       );
//       // console.log('aadharFileURIFront', aadharFileURIFront);
//       // console.log('aadharFileURIFront', aadharFileURIFront);
//       // console.log('aadharFileURIFront', aadharFileURIFront);
//       // console.log('aadharFileURIFront', aadharFileURIFront);
//       // console.log('aadharFileURIFront', aadharFileURIFront);
//     }
//   };
//   // console.log('Response DB', responseFrontAadharDB);
//   // console.log('aadharFileURIFront', aadharFileURIFront);
//   const openCameraAadharFront = async () => {
//     console.log('1');
//     await requestPermissions();
//     console.log('2');
//     if (permissionsGranted) {
//       await ImagePicker.launchCamera(
//         {
//           mediaType: 'photo',
//           includeBase64: true,
//           includeExtra,
//           quality: 0.5,
//           cameraType: 'back',
//         },
//         response => {
//           if (response.didCancel) {
//             console.log('Action Cancelled by User');
//           } else if (response.errorMessage) {
//             console.log('Error Message', response.errorMessage);
//           } else if (response && response?.assets != undefined) {
//             console.log('Response', response);
//             const destiny =
//               RNFS.DownloadDirectoryPath + '/' + response?.assets[0].id;
//             setAadharFileURIFront(destiny);
//             console.log('destiny', destiny);
//             console.log('aadharFileURIFront', aadharFileURIFront);
//             RNFS.copyFile(response.assets[0].uri, destiny)
//               .then(success => {
//                 console.log(success);
//                 console.log('file moved!' + success);
//                 setAadharFileFront(`file://${destiny}`);
//               })
//               .catch(err => {
//                 console.log('Error: ' + err.message);
//               });
//             setAaharFrontObject({
//               name: 'Aadhar Front',
//               type: response?.assets[0]?.type,
//               uri: 'file://' + aadharFileURIFront,
//             });
//             formik.setFieldValue('aadharfrontimage', aadharFileURIFront);
//           }
//         },
//       );
//     }
//   };
//   const openGalleryAadharBack = async () => {
//     await requestPermissions();
//     if (permissionsGranted) {
//       await ImagePicker.launchImageLibrary(
//         {
//           mediaType: 'photo',
//           includeBase64: true,
//           includeExtra,
//           quality: 0.5,
//           selectionLimit: 1,
//         },
//         response => {
//           if (response.didCancel) {
//             console.log('Action Cancelled by User');
//           } else if (response.errorMessage) {
//             console.log('Error Message', response.errorMessage);
//           } else if (response && response?.assets != undefined) {
//             console.log('Response', response);
//             const destiny =
//               RNFS.DownloadDirectoryPath + '/' + response?.assets[0].id;
//             setAadharFileURIBack(destiny);
//             console.log('destiny', destiny);
//             console.log('aadharFileURIBack', aadharFileURIBack);
//             RNFS.copyFile(response.assets[0].uri, destiny)
//               .then(success => {
//                 console.log(success);
//                 console.log('file moved!' + success);
//                 setAadharFileBack(`file://${destiny}`);
//               })
//               .catch(err => {
//                 console.log('Error: ' + err.message);
//               });
//             setAaharBackObject({
//               name: 'Aadhar Back',
//               type: response?.assets[0]?.type,
//               uri: 'file://' + aadharFileURIBack,
//             });
//           }
//         },
//       );
//     }
//   };
//   const openCameraAadharBack = async () => {
//     console.log('1');
//     await requestPermissions();
//     console.log('2');
//     if (permissionsGranted) {
//       await ImagePicker.launchCamera(
//         {
//           mediaType: 'photo',
//           includeBase64: true,
//           includeExtra,
//           quality: 0.5,
//           cameraType: 'back',
//         },
//         response => {
//           if (response.didCancel) {
//             console.log('Action Cancelled by User');
//           } else if (response.errorMessage) {
//             console.log('Error Message', response.errorMessage);
//           } else if (response && response?.assets != undefined) {
//             console.log('Response', response);
//             const destiny =
//               RNFS.DownloadDirectoryPath + '/' + response?.assets[0].id;
//             setAadharFileURIBack(destiny);
//             console.log('destiny', destiny);
//             console.log('aadharFileURIBack', aadharFileURIBack);
//             RNFS.copyFile(response.assets[0].uri, destiny)
//               .then(success => {
//                 console.log(success);
//                 console.log('file moved!' + success);
//                 setAadharFileBack(`file://${destiny}`);
//               })
//               .catch(err => {
//                 console.log('Error: ' + err.message);
//               });
//             setAaharBackObject({
//               name: 'Aadhar Back',
//               type: response?.assets[0]?.type,
//               uri: 'file://' + aadharFileURIBack,
//             });
//           }
//         },
//       );
//     }
//   };
//   const openGalleryPassbook = async () => {
//     await requestPermissions();
//     if (permissionsGranted) {
//       await ImagePicker.launchImageLibrary(
//         {
//           mediaType: 'photo',
//           includeBase64: true,
//           includeExtra,
//           quality: 0.5,
//           selectionLimit: 1,
//         },
//         response => {
//           if (response.didCancel) {
//             console.log('Action Cancelled by User');
//           } else if (response.errorMessage) {
//             console.log('Error Message', response.errorMessage);
//           } else if (response && response?.assets != undefined) {
//             console.log('Response', response);
//             const destiny =
//               RNFS.DownloadDirectoryPath + '/' + response?.assets[0].id;
//             setpassbookFileURI(destiny);
//             console.log('destiny', destiny);
//             console.log('Passbook URI', passbookFileURI);
//             RNFS.copyFile(response.assets[0].uri, destiny)
//               .then(success => {
//                 console.log(success);
//                 console.log('file moved!' + success);
//                 setpassbookFile(`file://${destiny}`);
//               })
//               .catch(err => {
//                 console.log('Error: ' + err.message);
//               });
//             setPassbookObject({
//               name: 'Passbook',
//               type: response?.assets[0]?.type,
//               uri: 'file://' + passbookFileURI,
//             });
//           }
//         },
//       );
//     }
//   };
//   const openCameraPassbook = async () => {
//     console.log('1');
//     await requestPermissions();
//     console.log('2');
//     if (permissionsGranted) {
//       await ImagePicker.launchCamera(
//         {
//           mediaType: 'photo',
//           includeBase64: true,
//           includeExtra,
//           quality: 0.5,
//           cameraType: 'back',
//         },
//         response => {
//           if (response.didCancel) {
//             console.log('Action Cancelled by User');
//           } else if (response.errorMessage) {
//             console.log('Error Message', response.errorMessage);
//           } else if (response && response?.assets != undefined) {
//             console.log('Response', response);
//             const destiny =
//               RNFS.DownloadDirectoryPath + '/' + response?.assets[0].id;
//             setpassbookFileURI(destiny);
//             console.log('destiny', destiny);
//             console.log('Passbook URI - ', passbookFileURI);
//             RNFS.copyFile(response.assets[0].uri, destiny)
//               .then(success => {
//                 console.log(success);
//                 console.log('file moved!' + success);
//                 setpassbookFile(`file://${destiny}`);
//               })
//               .catch(err => {
//                 console.log('Error: ' + err.message);
//               });
//             setPassbookObject({
//               name: 'Passbook',
//               type: response?.assets[0]?.type,
//               uri: 'file://' + passbookFileURI,
//             });
//           }
//         },
//       );
//     }
//   };
//   const openGalleryPAN = async () => {
//     await requestPermissions();
//     if (permissionsGranted) {
//       await ImagePicker.launchImageLibrary(
//         {
//           mediaType: 'photo',
//           includeBase64: true,
//           includeExtra,
//           quality: 0.5,
//           selectionLimit: 1,
//         },
//         response => {
//           if (response.didCancel) {
//             console.log('Action Cancelled by User');
//           } else if (response.errorMessage) {
//             console.log('Error Message', response.errorMessage);
//           } else if (response && response?.assets != undefined) {
//             console.log('Response', response);
//             const destiny =
//               RNFS.DownloadDirectoryPath + '/' + response?.assets[0].id;
//             setPanFileURI(destiny);
//             console.log('destiny', destiny);
//             console.log('PAN URI - ', panFileURI);
//             RNFS.copyFile(response.assets[0].uri, destiny)
//               .then(success => {
//                 console.log(success);
//                 console.log('file moved!' + success);
//                 setPanFile(`file://${destiny}`);
//               })
//               .catch(err => {
//                 console.log('Error: ' + err.message);
//               });
//             setPanObject({
//               name: 'PAN Card',
//               type: response?.assets[0]?.type,
//               uri: 'file://' + panFileURI,
//             });
//           }
//         },
//       );
//     }
//   };
//   const openCameraPAN = async () => {
//     console.log('1');
//     await requestPermissions();
//     console.log('2');
//     if (permissionsGranted) {
//       await ImagePicker.launchCamera(
//         {
//           mediaType: 'photo',
//           includeBase64: true,
//           includeExtra,
//           quality: 0.5,
//           cameraType: 'back',
//         },
//         response => {
//           if (response.didCancel) {
//             console.log('Action Cancelled by User');
//           } else if (response.errorMessage) {
//             console.log('Error Message', response.errorMessage);
//           } else if (response && response?.assets != undefined) {
//             console.log('Response', response);
//             const destiny =
//               RNFS.DownloadDirectoryPath + '/' + response?.assets[0].id;
//             setPanFileURI(destiny);
//             console.log('destiny', destiny);
//             console.log('aadharFileURIBack', panFileURI);
//             RNFS.copyFile(response.assets[0].uri, destiny)
//               .then(success => {
//                 console.log(success);
//                 console.log('file moved!' + success);
//                 setPanFile(`file://${destiny}`);
//               })
//               .catch(err => {
//                 console.log('Error: ' + err.message);
//               });
//             setPanObject({
//               name: 'Aadhar Back',
//               type: response?.assets[0]?.type,
//               uri: 'file://' + panFileURI,
//             });
//           }
//         },
//       );
//     }
//   };
//   function handleBackButtonClick() {
//     navigation.goBack();
//     return true;
//   }
//   useEffect(() => {
//     BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
//     return () => {
//       BackHandler.removeEventListener(
//         'hardwareBackPress',
//         handleBackButtonClick,
//       );
//     };
//   }, []);
//   const fetchCustomerBalancePoint = async () => {
//     await requestCustomerBalancePoint({})
//       .then(res => {
//         if (res.isError == false) {
//           setBalancePoint(res?.data?.balance);
//           setRedemptionPoint(res?.data?.redeempoint);
//           setIsLoadingPoints(false);
//         }
//       })
//       .catch(error => {
//         console.log('Response: ', error);
//       });
//   };
//   const getThresholdPoints = async () => {
//     await getSettingAsyncStorage()
//       .then(res => {
//         const sett = JSON.parse(res);
//         setThresholdPoint(sett?.redemption?.threshold);
//       })
//       .catch(error => {
//         console.log('Response: ', error);
//       });
//   };
//   useEffect(() => {
//     fetchGetAuthKycInfo();
//     getThresholdPoints();
//     fetchCustomerBalancePoint();
//     requestPermissions();
//   }, []);
//   const navigation = useNavigation<NavigationInterFace>();
//   const {height, width} = Dimensions.get('window');

//   return (
//     <SafeAreaView
//       style={{flex: 1, backgroundColor: colors.white, height: height}}>
//       <HeaderRNE
//         backgroundColor="white"
//         backgroundImageStyle={{}}
//         barStyle="default"
//         centerComponent={{
//           text: `${t('redemption')}`,
//           style: {color: 'black', fontSize: 22},
//         }}
//         centerContainerStyle={{height: 28, justifyContent: 'center'}}
//         leftComponent={
//           <TouchableOpacity onPress={() => props.navigation.goBack()}>
//             <Ionicons name="chevron-back" size={25} color={'black'} />
//           </TouchableOpacity>
//         }
//         leftContainerStyle={{paddingLeft: 5}}
//         placement="center"
//       />
//       <ScrollView>
//         <View>
//           <Card containerStyle={styles.big_card_view}>
//             <Image style={styles.image_view} source={imagePath.REEDEM_DEC} />
//           </Card>
//         </View>
//         <View
//           style={{
//             paddingTop: 20,
//             paddingHorizontal: 17,
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//           }}>
//           <Button
//             onPress={() => navigation.navigate('UPIScreen', {mode: 'UPI'})}
//             containerStyle={{
//               justifyContent: 'center',
//               // elevation: 1,
//             }}
//             buttonStyle={{
//               // backgroundColor: '#FFE7C7',
//               backgroundColor: '#FEF8DD',
//               borderRadius: 20,
//               width: width / 2 - 30,
//               height: 90,
//               overflow: 'hidden',
//             }}
//             titleStyle={{
//               marginLeft: 35,
//               padding: 20,
//               fontSize: responsiveFontSize(2.2),
//               margin: 10,
//               color: 'black',
//             }}
//             title={`${t('upi')}`}
//             iconPosition={'right'}
//             icon={
//               <View style={{overflow: 'hidden', borderRadius: 20}}>
//                 <View
//                   style={{
//                     paddingLeft: 80,
//                     height: 120,
//                     width: 120,
//                     borderRadius: 130 / 2,
//                     backgroundColor: '#FFE7C7',
//                     overflow: 'hidden',
//                   }}
//                 />
//                 <View
//                   style={{
//                     paddingTop: 120,
//                     justifyContent: 'center',
//                     alignContent: 'center',
//                     alignSelf: 'center',
//                     alignItems: 'center',
//                     position: 'absolute',
//                   }}>
//                   <Icon
//                     name="send-o"
//                     size={30}
//                     color="#585858"
//                     style={{
//                       position: 'absolute',
//                       paddingRight: 30,
//                     }}
//                   />
//                 </View>
//               </View>
//             }
//           />
//           <Button
//             onPress={() => navigation.navigate('Neft')}
//             containerStyle={{
//               justifyContent: 'center',
//             }}
//             buttonStyle={{
//               backgroundColor: '#FEF8DD',
//               borderRadius: 20,
//               width: width / 2 - 30,
//               height: 90,
//               overflow: 'hidden',
//             }}
//             titleStyle={{
//               marginLeft: 35,
//               padding: 20,
//               fontSize: responsiveFontSize(2.2),
//               margin: 10,
//               color: 'black',
//             }}
//             title={`${t('neft')}`}
//             iconPosition={'right'}
//             icon={
//               <View style={{overflow: 'hidden'}}>
//                 <View
//                   style={{
//                     paddingLeft: 80,
//                     height: 120,
//                     width: 120,
//                     borderRadius: 130 / 2,
//                     backgroundColor: '#FFE7C7',
//                     overflow: 'hidden',
//                   }}
//                 />
//                 <View
//                   style={{
//                     paddingTop: 120,
//                     justifyContent: 'center',
//                     alignContent: 'center',
//                     alignSelf: 'center',
//                     alignItems: 'center',
//                     position: 'absolute',
//                   }}>
//                   <Icon
//                     name="bank"
//                     size={30}
//                     color="#585858"
//                     style={{
//                       position: 'absolute',
//                       paddingRight: 30,
//                     }}
//                   />
//                 </View>
//               </View>
//             }
//           />
//         </View>
//         {/* // Uncomment before the production */}
//         {redemptionPoint === 0 &&
//         Number(balancePoint) < Number(thresholdPoint) &&
//         !isLoadingPoints ? (
//           // <AlertStatic
//           //   successAlert={false}
//           //   title={`${t('lowpoints')}`}
//           //   messageText={`${t('err1')} ${thresholdPoint - balancePoint} ${t(
//           //     'err2',
//           //   )}`}
//           // />
//           <View style={styles.centeredView}>
//             <Modal
//               animationType="slide"
//               transparent={true}
//               visible={modalVisible}
//               onRequestClose={() => {}}>
//               <View style={styles.centeredView}>
//                 <View style={styles.modalView}>
//                   <LottieView
//                     style={{
//                       height: 200,
//                       width: 200,
//                     }}
//                     source={require('../../../assets/images/alert.json')}
//                     autoPlay
//                     loop
//                   />
//                   <Text style={styles.modalText}>{`${t('lowpoints')}`}</Text>
//                   <Text style={styles.modalText}>{`${t('err1')} ${
//                     thresholdPoint - balancePoint
//                   } ${t('err2')}`}</Text>
//                   <Pressable
//                     style={[styles.button, styles.buttonClose]}
//                     onPress={() => {
//                       console.log('Go Back Pressed');
//                       navigation.navigate(navigationStrings.HOME);
//                       setModalVisible(false);
//                     }}>
//                     <Text style={styles.textStyle}>{`${t('goback')}`}</Text>
//                   </Pressable>
//                 </View>
//               </View>
//             </Modal>
//           </View>
//         ) : null}
//         <View
//           style={{
//             flexDirection: 'row',
//             alignContent: 'center',
//             alignItems: 'center',
//             paddingTop: 10,
//             justifyContent: 'space-evenly',
//           }}>
//           <View
//             style={{
//               borderBottomColor: 'black',
//               borderBottomWidth: StyleSheet.hairlineWidth,
//               width: width / 2 - 80,
//               borderWidth: 0.7,
//               borderColor: 'black',
//             }}
//           />
//           <Text style={{color: 'black', fontSize: 16, margin: 5}}>
//             KYC Details
//           </Text>
//           <FontAwesome name="id-card" size={20} color={'black'} />
//           <View
//             style={{
//               borderBottomColor: 'black',
//               borderBottomWidth: StyleSheet.hairlineWidth,
//               width: width / 2 - 80,
//               borderWidth: 0.7,
//               borderColor: 'black',
//             }}
//           />
//         </View>
//         <View
//           style={{
//             padding: 10,
//             paddingLeft: 20,
//             justifyContent: 'flex-start',
//             flexDirection: 'row',
//           }}>
//           <Text style={{fontSize: 14, paddingRight: 10, color: 'black'}}>
//             Aadhar Card Front
//           </Text>
//           {verifiedFormik.values.aadharVerified === true ? (
//             <View
//               style={{
//                 borderRadius: 20,
//                 backgroundColor: '#d2f8dc',
//                 flexDirection: 'row',
//                 justifyContent: 'center',
//                 alignContent: 'center',
//                 alignSelf: 'center',
//                 alignItems: 'center',
//               }}>
//               <Ionicons
//                 name="checkmark-circle"
//                 color={'green'}
//                 size={15}
//                 style={{paddingLeft: 10}}
//               />
//               <Text
//                 style={{
//                   fontSize: 14,
//                   color: 'green',
//                   paddingRight: 10,
//                 }}>
//                 Verified
//               </Text>
//             </View>
//           ) : (
//             <View
//               style={{
//                 borderRadius: 20,
//                 backgroundColor: '#ffcccb',
//                 flexDirection: 'row',
//                 justifyContent: 'center',
//                 alignContent: 'center',
//                 alignSelf: 'center',
//                 alignItems: 'center',
//               }}>
//               <Ionicons
//                 name="close-circle"
//                 color={'red'}
//                 size={15}
//                 style={{paddingLeft: 10}}
//               />
//               <Text
//                 style={{
//                   fontSize: 14,
//                   color: 'red',
//                   paddingRight: 10,
//                 }}>
//                 Not Verified
//               </Text>
//             </View>
//           )}
//         </View>
//         <View
//           style={{
//             alignContent: 'center',
//             alignSelf: 'center',
//             backgroundColor: '#FEF8DD',
//             borderRadius: 18,
//             width: '90%',
//             flexDirection: 'row',
//             height: 90,
//             alignItems: 'center',
//             elevation: 1,
//           }}>
//           <View
//             style={{
//               alignSelf: 'flex-end',
//               justifyContent: 'flex-end',
//               position: 'absolute',
//               zIndex: 1,
//               top: 0,
//               right: 0,
//               padding: 5,
//             }}>
//             <Ionicons
//               name="close-circle-outline"
//               size={25}
//               color={'red'}
//               onPress={() => {
//                 formik.setFieldValue('aadharcardfront', undefined);
//                 setAadharFileFront(null);
//                 setAadharFileURIFront(null);
//               }}
//             />
//           </View>

//           {/* {aadharFileFront && aadharFileFront !== null ? ( */}
//           {verifiedFormik.values['aadharFrontImage'] ? (
//             <ImageRNE
//               style={{
//                 width: 110,
//                 height: 70,
//                 // width: '40%',
//                 // height: '80%',
//                 left: 10,
//                 right: 10,
//                 resizeMode: 'cover',
//                 // borderRadius: 18,
//                 borderBottomLeftRadius: 18,
//                 borderTopLeftRadius: 18,
//                 // borderBottomRightRadius: 18,
//               }}
//               onPress={() => setShowAadharFront(true)}
//               source={{
//                 uri: `${imagePath.IMAGE_URL_TEST}${verifiedFormik.values['aadharFrontImage']}`,
//               }}
//             />
//           ) : (
//             <Ionicons
//               name="images"
//               size={46}
//               style={{paddingLeft: 10}}
//               color={'#585858'}
//             />
//           )}
//           <View
//             style={{
//               flex: 1,
//               // flexDirection: 'row',
//               justifyContent: 'space-between',
//               backgroundColor: '#FEF8DD',
//               padding: 5,
//               // borderRadius: 18,
//               borderBottomLeftRadius: 18,
//               borderBottomRightRadius: 18,
//               // width: '100%',
//               position: 'absolute',
//               bottom: 0,
//               right: 0,
//             }}>
//             <View style={{flexDirection: 'row'}}>
//               <Button
//                 onPress={openCameraAadharFront}
//                 color={'#FFE7C7'}
//                 containerStyle={{
//                   borderTopLeftRadius: 18,
//                   borderBottomLeftRadius: 18,
//                   padding: 3,
//                 }}
//                 icon={
//                   <Icon
//                     name="camera"
//                     size={25}
//                     color={'#585858'}
//                     style={{
//                       alignSelf: 'flex-end',
//                     }}
//                   />
//                 }
//               />
//               <Button
//                 onPress={() => openGalleryAadharFront()}
//                 color={'#FFE7C7'}
//                 containerStyle={{
//                   borderTopRightRadius: 18,
//                   borderBottomRightRadius: 18,
//                   padding: 3,
//                 }}
//                 icon={
//                   <Ionicons
//                     name="image"
//                     size={25}
//                     color={'#585858'}
//                     style={{
//                       alignSelf: 'flex-end',
//                     }}
//                   />
//                 }
//               />
//             </View>
//           </View>
//           <View style={{padding: 1}}></View>
//         </View>
//         {showAadharFront ? (
//           <Modal animationType="slide" transparent={true}>
//             <Dialog
//               overlayStyle={{borderRadius: 20}}
//               isVisible={showAadharFront}
//               onBackdropPress={toggleDialog}>
//               <View
//                 style={{
//                   justifyContent: 'center',
//                   alignContent: 'center',
//                   alignItems: 'center',
//                   alignSelf: 'center',
//                 }}>
//                 <Image
//                   style={{
//                     width: 290,
//                     height: 210,
//                     resizeMode: 'contain',
//                   }}
//                   source={{
//                     uri: `${aadharFileFront}`,
//                   }}></Image>
//               </View>
//             </Dialog>
//           </Modal>
//         ) : null}
//         {formik.errors.aadharfrontimage && (
//           <Text style={{fontSize: 11, color: 'red'}}>
//             {formik.errors.aadharfrontimage}
//           </Text>
//         )}
//         <View
//           style={{
//             padding: 10,
//             paddingLeft: 20,
//             justifyContent: 'flex-start',
//             flexDirection: 'row',
//           }}>
//           <Text style={{fontSize: 14, paddingRight: 10, color: 'black'}}>
//             Aadhar Card Back
//           </Text>
//           {verifiedFormik.values.aadharVerified === true ? (
//             <View
//               style={{
//                 borderRadius: 20,
//                 backgroundColor: '#d2f8dc',
//                 flexDirection: 'row',
//                 justifyContent: 'center',
//                 alignContent: 'center',
//                 alignSelf: 'center',
//                 alignItems: 'center',
//               }}>
//               <Ionicons
//                 name="checkmark-circle"
//                 color={'green'}
//                 size={15}
//                 style={{paddingLeft: 10}}
//               />
//               <Text
//                 style={{
//                   fontSize: 14,
//                   color: 'green',
//                   paddingRight: 10,
//                 }}>
//                 Verified
//               </Text>
//             </View>
//           ) : (
//             <View
//               style={{
//                 borderRadius: 20,
//                 backgroundColor: '#ffcccb',
//                 flexDirection: 'row',
//                 justifyContent: 'center',
//                 alignContent: 'center',
//                 alignSelf: 'center',
//                 alignItems: 'center',
//               }}>
//               <Ionicons
//                 name="close-circle"
//                 color={'red'}
//                 size={15}
//                 style={{paddingLeft: 10}}
//               />
//               <Text
//                 style={{
//                   fontSize: 14,
//                   color: 'red',
//                   paddingRight: 10,
//                 }}>
//                 Not Verified
//               </Text>
//             </View>
//           )}
//         </View>
//         <View
//           style={{
//             alignContent: 'center',
//             alignSelf: 'center',
//             backgroundColor: '#FEF8DD',
//             borderRadius: 18,
//             width: '90%',
//             flexDirection: 'row',
//             height: 90,
//             alignItems: 'center',
//             elevation: 1,
//           }}>
//           <View
//             style={{
//               alignSelf: 'flex-end',
//               justifyContent: 'flex-end',
//               position: 'absolute',
//               zIndex: 1,
//               top: 0,
//               right: 0,
//               padding: 5,
//             }}>
//             <Ionicons
//               name="close-circle-outline"
//               size={25}
//               color={'red'}
//               onPress={() => {
//                 setAadharFileBack(null);
//                 setAadharFileURIBack(null);
//               }}
//             />
//           </View>

//           {verifiedFormik.values['gstinImage'] ? (
//             <ImageRNE
//               style={{
//                 width: 110,
//                 height: 70,
//                 left: 10,
//                 right: 10,
//                 resizeMode: 'cover',
//                 borderBottomLeftRadius: 18,
//                 borderTopLeftRadius: 18,
//               }}
//               onPress={() => setShowAadharBack(true)}
//               source={{
//                 uri: `${imagePath.IMAGE_URL_TEST}${verifiedFormik.values['gstinImage']}`,
//               }}
//             />
//           ) : (
//             <Ionicons
//               name="images"
//               size={46}
//               style={{paddingLeft: 10}}
//               color={'#585858'}
//             />
//           )}
//           <View
//             style={{
//               flex: 1,
//               justifyContent: 'space-between',
//               backgroundColor: '#FEF8DD',
//               padding: 5,
//               borderBottomLeftRadius: 18,
//               borderBottomRightRadius: 18,
//               position: 'absolute',
//               bottom: 0,
//               right: 0,
//             }}>
//             <View style={{flexDirection: 'row'}}>
//               <Button
//                 onPress={() => openCameraAadharBack()}
//                 color={'#FFE7C7'}
//                 containerStyle={{
//                   borderTopLeftRadius: 18,
//                   borderBottomLeftRadius: 18,
//                   padding: 3,
//                 }}
//                 icon={
//                   <Icon
//                     name="camera"
//                     size={25}
//                     color={'#585858'}
//                     style={{
//                       alignSelf: 'flex-end',
//                     }}
//                   />
//                 }
//               />
//               <Button
//                 onPress={() => openGalleryAadharBack()}
//                 color={'#FFE7C7'}
//                 containerStyle={{
//                   borderTopRightRadius: 18,
//                   borderBottomRightRadius: 18,
//                   padding: 3,
//                 }}
//                 icon={
//                   <Ionicons
//                     name="image"
//                     size={25}
//                     color={'#585858'}
//                     style={{
//                       alignSelf: 'flex-end',
//                     }}
//                   />
//                 }
//               />
//             </View>
//           </View>
//           <View style={{padding: 1}}></View>
//         </View>
//         {showAadharBack ? (
//           <Modal animationType="slide" transparent={true}>
//             <Dialog
//               overlayStyle={{borderRadius: 20}}
//               isVisible={showAadharBack}
//               onBackdropPress={toggleDialogAadharBack}>
//               <View
//                 style={{
//                   justifyContent: 'center',
//                   alignContent: 'center',
//                   alignItems: 'center',
//                   alignSelf: 'center',
//                 }}>
//                 <Image
//                   style={{
//                     width: 290,
//                     height: 210,
//                     resizeMode: 'contain',
//                   }}
//                   source={{
//                     uri: `${aadharFileBack}`,
//                   }}></Image>
//               </View>
//             </Dialog>
//           </Modal>
//         ) : null}
//         <View
//           style={{
//             padding: 10,
//             paddingLeft: 20,
//             justifyContent: 'flex-start',
//             flexDirection: 'row',
//           }}>
//           <Text style={{fontSize: 14, paddingRight: 10, color: 'black'}}>
//             Passbook / Cancel Cheque
//           </Text>
//           {verifiedFormik.values.gstinVerified === true ? (
//             <View
//               style={{
//                 borderRadius: 20,
//                 backgroundColor: '#d2f8dc',
//                 flexDirection: 'row',
//                 justifyContent: 'center',
//                 alignContent: 'center',
//                 alignSelf: 'center',
//                 alignItems: 'center',
//               }}>
//               <Ionicons
//                 name="checkmark-circle"
//                 color={'green'}
//                 size={15}
//                 style={{paddingLeft: 10}}
//               />
//               <Text
//                 style={{
//                   fontSize: 14,
//                   color: 'green',
//                   paddingRight: 10,
//                 }}>
//                 Verified
//               </Text>
//             </View>
//           ) : (
//             <View
//               style={{
//                 borderRadius: 20,
//                 backgroundColor: '#ffcccb',
//                 flexDirection: 'row',
//                 justifyContent: 'center',
//                 alignContent: 'center',
//                 alignSelf: 'center',
//                 alignItems: 'center',
//               }}>
//               <Ionicons
//                 name="close-circle"
//                 color={'red'}
//                 size={15}
//                 style={{paddingLeft: 10}}
//               />
//               <Text
//                 style={{
//                   fontSize: 14,
//                   color: 'red',
//                   paddingRight: 10,
//                 }}>
//                 Not Verified
//               </Text>
//             </View>
//           )}
//         </View>
//         <View
//           style={{
//             alignContent: 'center',
//             alignSelf: 'center',
//             backgroundColor: '#FEF8DD',
//             borderRadius: 18,
//             width: '90%',
//             flexDirection: 'row',
//             height: 90,
//             alignItems: 'center',
//             elevation: 1,
//           }}>
//           <View
//             style={{
//               alignSelf: 'flex-end',
//               justifyContent: 'flex-end',
//               position: 'absolute',
//               zIndex: 1,
//               top: 0,
//               right: 0,
//               padding: 5,
//             }}>
//             <Ionicons
//               name="close-circle-outline"
//               size={25}
//               color={'red'}
//               onPress={() => {
//                 setpassbookFile(null);
//                 setpassbookFileURI(null);
//               }}
//             />
//           </View>

//           {passbookFile && passbookFile !== null ? (
//             <ImageRNE
//               style={{
//                 width: 110,
//                 height: 70,
//                 left: 10,
//                 right: 10,
//                 resizeMode: 'cover',
//                 borderBottomLeftRadius: 18,
//                 borderTopLeftRadius: 18,
//               }}
//               onPress={() => setshowPassbook(true)}
//               source={{
//                 uri: `${passbookFile}`,
//               }}
//             />
//           ) : (
//             <Ionicons
//               name="images"
//               size={46}
//               style={{paddingLeft: 10}}
//               color={'#585858'}
//             />
//           )}

//           <View
//             style={{
//               flex: 1,
//               justifyContent: 'space-between',
//               backgroundColor: '#FEF8DD',
//               padding: 5,
//               borderBottomLeftRadius: 18,
//               borderBottomRightRadius: 18,
//               position: 'absolute',
//               bottom: 0,
//               right: 0,
//             }}>
//             <View style={{flexDirection: 'row'}}>
//               <Button
//                 onPress={() => openCameraPassbook()}
//                 color={'#FFE7C7'}
//                 containerStyle={{
//                   borderTopLeftRadius: 18,
//                   borderBottomLeftRadius: 18,
//                   padding: 3,
//                 }}
//                 icon={
//                   <Icon
//                     name="camera"
//                     size={25}
//                     color={'#585858'}
//                     style={{
//                       alignSelf: 'flex-end',
//                     }}
//                   />
//                 }
//               />
//               <Button
//                 onPress={() => openGalleryPassbook()}
//                 color={'#FFE7C7'}
//                 containerStyle={{
//                   borderTopRightRadius: 18,
//                   borderBottomRightRadius: 18,
//                   padding: 3,
//                 }}
//                 icon={
//                   <Ionicons
//                     name="image"
//                     size={25}
//                     color={'#585858'}
//                     style={{
//                       alignSelf: 'flex-end',
//                     }}
//                   />
//                 }
//               />
//             </View>
//           </View>
//           <View style={{padding: 1}}></View>
//         </View>
//         {showPassbook ? (
//           <Modal animationType="slide" transparent={true}>
//             <Dialog
//               overlayStyle={{borderRadius: 20}}
//               isVisible={showPassbook}
//               onBackdropPress={togglePassbook}>
//               <View
//                 style={{
//                   justifyContent: 'center',
//                   alignContent: 'center',
//                   alignItems: 'center',
//                   alignSelf: 'center',
//                 }}>
//                 <Image
//                   style={{
//                     width: 290,
//                     height: 210,
//                     resizeMode: 'contain',
//                   }}
//                   source={{
//                     uri: `${passbookFile}`,
//                   }}></Image>
//               </View>
//             </Dialog>
//           </Modal>
//         ) : null}
//         <View
//           style={{
//             padding: 10,
//             paddingLeft: 20,
//             justifyContent: 'flex-start',
//             flexDirection: 'row',
//           }}>
//           <Text style={{fontSize: 14, paddingRight: 10, color: 'black'}}>
//             Pan Card Image
//           </Text>
//           {verifiedFormik.values.panVerified === true ? (
//             <View
//               style={{
//                 borderRadius: 20,
//                 backgroundColor: '#d2f8dc',
//                 flexDirection: 'row',
//                 justifyContent: 'center',
//                 alignContent: 'center',
//                 alignSelf: 'center',
//                 alignItems: 'center',
//               }}>
//               <Ionicons
//                 name="checkmark-circle"
//                 color={'green'}
//                 size={15}
//                 style={{paddingLeft: 10}}
//               />
//               <Text
//                 style={{
//                   fontSize: 14,
//                   color: 'green',
//                   paddingRight: 10,
//                 }}>
//                 Verified
//               </Text>
//             </View>
//           ) : (
//             <View
//               style={{
//                 borderRadius: 20,
//                 backgroundColor: '#ffcccb',
//                 flexDirection: 'row',
//                 justifyContent: 'center',
//                 alignContent: 'center',
//                 alignSelf: 'center',
//                 alignItems: 'center',
//               }}>
//               <Ionicons
//                 name="close-circle"
//                 color={'red'}
//                 size={15}
//                 style={{paddingLeft: 10}}
//               />
//               <Text
//                 style={{
//                   fontSize: 14,
//                   color: 'red',
//                   paddingRight: 10,
//                 }}>
//                 Not Verified
//               </Text>
//             </View>
//           )}
//         </View>
//         <View
//           style={{
//             alignContent: 'center',
//             alignSelf: 'center',
//             backgroundColor: '#FEF8DD',
//             borderRadius: 18,
//             width: '90%',
//             flexDirection: 'row',
//             height: 90,
//             alignItems: 'center',
//             elevation: 1,
//           }}>
//           <View
//             style={{
//               alignSelf: 'flex-end',
//               justifyContent: 'flex-end',
//               position: 'absolute',
//               zIndex: 1,
//               top: 0,
//               right: 0,
//               padding: 5,
//             }}>
//             <Ionicons
//               name="close-circle-outline"
//               size={25}
//               color={'red'}
//               onPress={() => {
//                 setPanFile(null);
//                 setPanFileURI(null);
//               }}
//             />
//           </View>

//           {panFile && panFile !== null ? (
//             <ImageRNE
//               style={{
//                 width: 110,
//                 height: 70,
//                 left: 10,
//                 right: 10,
//                 resizeMode: 'cover',
//                 borderBottomLeftRadius: 18,
//                 borderTopLeftRadius: 18,
//               }}
//               onPress={() => setShowPan(true)}
//               source={{
//                 uri: `${panFile}`,
//               }}
//             />
//           ) : (
//             <Ionicons
//               name="images"
//               size={46}
//               style={{paddingLeft: 10}}
//               color={'#585858'}
//             />
//           )}

//           <View
//             style={{
//               flex: 1,
//               justifyContent: 'space-between',
//               backgroundColor: '#FEF8DD',
//               padding: 5,
//               borderBottomLeftRadius: 18,
//               borderBottomRightRadius: 18,
//               position: 'absolute',
//               bottom: 0,
//               right: 0,
//             }}>
//             <View style={{flexDirection: 'row'}}>
//               <Button
//                 onPress={() => openCameraPAN()}
//                 color={'#FFE7C7'}
//                 containerStyle={{
//                   borderTopLeftRadius: 18,
//                   borderBottomLeftRadius: 18,
//                   padding: 3,
//                 }}
//                 icon={
//                   <Icon
//                     name="camera"
//                     size={25}
//                     color={'#585858'}
//                     style={{
//                       alignSelf: 'flex-end',
//                     }}
//                   />
//                 }
//               />
//               <Button
//                 onPress={() => openGalleryPAN()}
//                 color={'#FFE7C7'}
//                 containerStyle={{
//                   borderTopRightRadius: 18,
//                   borderBottomRightRadius: 18,
//                   padding: 3,
//                 }}
//                 icon={
//                   <Ionicons
//                     name="image"
//                     size={25}
//                     color={'#585858'}
//                     style={{
//                       alignSelf: 'flex-end',
//                     }}
//                   />
//                 }
//               />
//             </View>
//           </View>
//           <View style={{padding: 1}}></View>
//         </View>
//         {showAadharBack ? (
//           <Modal animationType="slide" transparent={true}>
//             <Dialog
//               overlayStyle={{borderRadius: 20}}
//               isVisible={showPAN}
//               onBackdropPress={togglePAN}>
//               <View
//                 style={{
//                   justifyContent: 'center',
//                   alignContent: 'center',
//                   alignItems: 'center',
//                   alignSelf: 'center',
//                 }}>
//                 <Image
//                   style={{
//                     width: 290,
//                     height: 210,
//                     resizeMode: 'contain',
//                   }}
//                   source={{
//                     uri: `${panFile}`,
//                   }}></Image>
//               </View>
//             </Dialog>
//           </Modal>
//         ) : null}
//         <View
//           style={{
//             paddingTop: 10,
//             justifyContent: 'space-evenly',
//             marginHorizontal: 20,
//             paddingBottom: 40,
//           }}>
//           <Button
//             title={`${t('submit')}`}
//             onPress={() => {
//               onSubmit();
//             }}
//             buttonStyle={{
//               backgroundColor: appTheme.NEW_PALLET,
//               borderRadius: 8,
//             }}
//             titleStyle={{color: 'black'}}
//             containerStyle={{paddingTop: 10}}
//           />
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default RedemptionFinal;
