// import React, {useState, useEffect} from 'react';
// import {
//   Alert,
//   Dimensions,
//   Image,
//   Keyboard,
//   PermissionsAndroid,
//   Pressable,
//   SafeAreaView,
//   ScrollView,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// import appTheme from '../../utils/appTheme';
// import * as Yup from 'yup';
// import {useFormik} from 'formik';
// import ButtonComp from '../comman/Button';
// import {
//   requestLoginOTP,
//   requestGetSettingInfo,
//   requestSendOTP,
//   requestLoginPassword,
//   requestGetMobileExist,
// } from '../../services/backend_helper';
// import {useDispatch} from 'react-redux';
// import {login, StackDelete, stackInsert, stackUpdate} from '../../redux';
// import LinearGradient from 'react-native-linear-gradient';
// import {
//   setSettingAsyncStorage,
//   setTokenAsyncStorage,
// } from '../../services/auth_helper';
// import DeviceInfo from 'react-native-device-info';

// import {useTranslation} from 'react-i18next';
// import OTPInput from '../comman/OTPwork/OTPInput';
// import {ButtonContainer, ButtonText} from '../comman/OTPwork/OTPwork';
// import {Button, ButtonGroup} from '@rneui/themed';
// import {color} from 'react-native-reanimated';
// import {useNavigation} from '@react-navigation/native';
// import navigationStrings from '../../constants/navigationStrings';
// import {NavigationInterFace} from '../../interfaces/navigationType.interface';
// import DeviceNumber from 'react-native-device-number';
// // import SmsRetriever from 'react-native-sms-retriever';
// import PasswordLogin from './PasswordLogin';
// import CreatePassword from './CreatePassword';

// import {GetMobileExistInterface} from '../../interfaces/auth.interface';
// import RegisterUser from './RegisterUser';

// const {height, width} = Dimensions.get('window');
// export default function Login(props: any) {
//   const [otpWindow, setOTPWindow] = useState(false);
//   const [matchMobile, setMatchMobile] = useState(false);
//   const [createUserForm, setCreateUserForm] = useState(false);
//   const [userExistResponse, setuserExistResponse] = useState(false);
//   const [mobileExist, setMobileExist] = useState<GetMobileExistInterface>({});
//   const [sendMobileNo, setSendMobileNo] = useState('');
//   // const [finalMobileNo, setFinalMobileNo] = useState('');
//   // const requestPhoneStatePermission = async () => {
//   //   try {
//   //     const granted = await PermissionsAndroid.request(
//   //       PermissionsAndroid.PERMISSIONS.READ_PHONE_NUMBERS,
//   //       {
//   //         title: 'Gajra Gears Phone Permission',
//   //         message:
//   //           'Gajra Gears App needs access to your phone ' +
//   //           'number to verify mobile number.',
//   //         // buttonNeutral: 'Ask Me Later',
//   //         buttonNegative: 'Cancel',
//   //         buttonPositive: 'OK',
//   //       },
//   //     );
//   //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//   //       console.log('You can use the app');
//   //     } else {
//   //       console.log('Permission denied');
//   //     }
//   //   } catch (err) {
//   //     console.warn(err);
//   //   }
//   // };
//   // const requestReadSMSPermission = async () => {
//   //   try {
//   //     const granted = await PermissionsAndroid.request(
//   //       PermissionsAndroid.PERMISSIONS.READ_SMS,
//   //       {
//   //         title: 'Gajra Gears Phone Permission',
//   //         message:
//   //           'Gajra Gears App needs access to your phone ' +
//   //           'state to access mobile number.',
//   //         // buttonNeutral: 'Ask Me Later',
//   //         buttonNegative: 'Cancel',
//   //         buttonPositive: 'OK',
//   //       },
//   //     );
//   //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//   //       console.log('You can use the camera');
//   //     } else {
//   //       console.log('Camera permission denied');
//   //     }
//   //   } catch (err) {
//   //     console.warn(err);
//   //   }
//   // };
//   // requestPhoneStatePermission();
//   // requestReadSMSPermission();
//   // const _onPhoneNumberPressed = async () => {
//   //   const pp = await DeviceInfo.getPhoneNumber();
//   // };
//   const [otpCodeResponse, setOTPCodeResponse] = useState(0);
//   // DeviceNumber.get().then(res => {
//   //   console.log(res);
//   // });
//   const fetchSettingInfo = async () => {
//     await requestGetSettingInfo()
//       .then(res => {
//         if (res.isError == false) {
//           setSettingAsyncStorage(res.data);
//         }
//       })
//       .catch(error => {
//         console.log('Response: ', error);
//       });
//   };
//   // const ll = DeviceInfo.getPhoneNumber()
//   //   .then(phonenum => {
//   //     console.log(phonenum);
//   //     setFinalMobileNo(phonenum.slice(-10));
//   //   })
//   //   .catch(error => {
//   //     console.log(error);
//   //   });
//   // console.log(ll);

//   const fetchGetMobileExist = async () => {
//     const iData = {mobile: formik.values.username};
//     await requestGetMobileExist(iData)
//       .then(res => {
//         if (res.isError == false) {
//           setMobileExist(res.data);
//           if (res.data.exists == false) {
//             setCreateUserForm(true);
//           }
//         }
//       })
//       .catch(error => {
//         console.log('Response: ', error);
//       });
//   };
//   useEffect(() => {
//     fetchSettingInfo();
//     // _onPhoneNumberPressed();
//     // console.log(otpCode);
//   }, []);
//   const navigation = useNavigation();
//   const dispatch = useDispatch();
//   DeviceInfo.getManufacturer().then(manufacturer => {
//     // console.log(manufacturer);
//   });
//   let deviceName = DeviceInfo.getModel();
//   // console.log(deviceName);
//   let buildNumber = DeviceInfo.getBuildNumber();
//   // console.log(buildNumber);
//   let brand = DeviceInfo.getBrand();
//   // console.log(brand);
//   DeviceInfo.getBaseOs().then(baseOs => {
//     // console.log(baseOs);
//   });
//   let systemVersion = DeviceInfo.getSystemVersion();
//   // console.log(systemVersion);
//   // console.log(DeviceInfo);
//   const initialValues = {
//     username: '',
//     password: '',
//     isVisible: true,
//     isClicked: false,
//     focusUserName: false,
//     focusPassword: false,
//   };

//   const validationSchema = Yup.object({
//     username: Yup.string()
//       .required('Please enter mobile number')
//       .min(10)
//       .max(13),
//     password: Yup.string().min(4).max(4).required('OTP is required'),
//   });
//   // const OTPvalidationSchema = Yup.object({
//   //   username: Yup.string()
//   //     .required('Please enter mobile number')
//   //     .min(10)
//   //     .max(10),
//   //   // password: Yup.string().min(4).max(4).required('OTP is required'),
//   // });
//   // const PasswordvalidationSchema = Yup.object({
//   //   username: Yup.string()
//   //     .required('Please enter mobile number')
//   //     .min(10)
//   //     .max(13),
//   //   password: Yup.string().min(3).max(20).required('Password is required'),
//   // });

//   const onSubmit = async (values: any) => {
//     // console.log('On Submit >>>>>    ', values);
//     formik.setFieldValue('isClicked', true);

//     onSubmitFinal(values);
//   };

//   const formik = useFormik({
//     initialValues,
//     onSubmit,
//     validationSchema,
//   });

//   const handleChangeUsername = (e: any) => {
//     formik.setFieldValue('username', e);
//     // if (finalMobileNo === e) {
//     //   setMatchMobile(true);
//     // } else {
//     //   setMatchMobile(false);
//     // }
//   };
//   console.log(matchMobile);
//   console.log('Mobie Exist ', mobileExist);
//   console.log('setCreateUserForm ', createUserForm);

//   const onSubmitFinal = async (values: any) => {
//     var data = {
//       username: formik.values.username,
//       otp: formik.values.password,
//     };

//     setSendMobileNo(formik.values.username);
//     console.log('Signindata', sendMobileNo);
//     if (otpCodeResponse == parseInt(formik.values.password)) {
//       console.log('OTP MATCHES');
//       if (userExistResponse == true) {
//         console.log('User Exist', userExistResponse);
//         await requestLoginOTP(data)
//           .then(res => {
//             // formik.setFieldValue('isClicked', false);
//             if (res.isError == false && res.message == 'SUCCESS') {
//               formik.setValues({...initialValues, isClicked: false});
//               var resData = JSON.stringify(res.data);
//               setTokenAsyncStorage(res?.data?.token);
//               dispatch(login(resData));
//               dispatch(stackUpdate('dashboard'));
//             } else {
//               Alert.alert('', `${res.message}`, [
//                 {
//                   text: 'OK',
//                   onPress: () => console.log('Ask me later pressed'),
//                   style: 'cancel',
//                 },
//               ]);
//             }
//           })
//           .catch(error => {
//             formik.setFieldValue('isClicked', false);
//             console.log('Login Response >>>>  ', error);
//           });
//         console.log('formik pass', formik.values.username);
//         setSendMobileNo(formik.values.username);
//         navigation.navigate(navigationStrings.SIGN_UP_ONE, {
//           mobileno: formik.values.username,
//         });
//       } else if (userExistResponse == false) {
//         console.log('User Exist', userExistResponse);
//       }
//     } else {
//       console.log('OTP dont match');
//       console.log(
//         'OTP ENTERED- ',
//         formik.values.password,
//         'OTP RESPOSE SET',
//         otpCodeResponse,
//       );
//     }
//   };

//   console.log('exist', mobileExist);

//   return (
//     <SafeAreaView style={{backgroundColor: appTheme.APP_BACKGROUND_COLOR}}>
//       <ScrollView>
//         <View
//           style={{
//             height: height,
//             width: width,
//             backgroundColor: appTheme.APP_BACKGROUND_COLOR,
//             paddingHorizontal: width * 0.06,
//           }}>
//           <View>
//             <Image
//               source={require('../../../assets/images/login_banner.png')}
//               style={{
//                 resizeMode: 'cover',
//                 height: height * 0.26,
//                 width: width * 0.88,
//                 // backgroundColor: 'yellow',
//                 borderRadius: 15,
//                 marginTop: 15,
//               }}
//             />
//             <View style={{width: width * 0.88}}>
//               <Text
//                 style={{
//                   color: 'black',
//                   fontWeight: 'bold',
//                   fontSize: 22,
//                   marginTop: 10,
//                 }}>
//                 Sign In
//               </Text>
//             </View>
//             <Text style={{marginTop: 20}}>
//               <Text style={{color: 'black'}}>Phone Number</Text>
//               <Text style={{color: 'red'}}>*</Text>
//             </Text>
//             <LinearGradient
//               colors={['#39B8FF', '#0029FF']}
//               style={{
//                 width: width * 0.88,
//                 padding: formik.values.focusUserName ? 1 : 0,
//                 borderRadius: 8,
//                 marginTop: 10,
//               }}
//               start={{x: 0, y: 0}}
//               end={{x: 1, y: 0}}>
//               <TextInput
//                 style={{
//                   width: width * 0.88 - (formik.values.focusUserName ? 2 : 0),
//                   borderColor: 'black',
//                   borderWidth: formik.values.focusUserName ? 0 : 1,
//                   borderRadius: 8,
//                   // marginTop: 10,
//                   paddingHorizontal: 10,
//                   backgroundColor: 'white',
//                   // marginBottom: 1,
//                 }}
//                 placeholder={'Phone Number'}
//                 placeholderTextColor="#CCCCCC"
//                 value={formik.values.username}
//                 onChangeText={text => handleChangeUsername(text)}
//                 keyboardType="phone-pad"
//                 onFocus={() => {
//                   // _onPhoneNumberPressed();
//                   // PhoneNumberPressed();
//                   formik.setValues({
//                     ...formik.values,
//                     focusUserName: true,
//                     focusPassword: false,
//                   });
//                 }}
//                 onBlur={() => {
//                   fetchGetMobileExist();
//                 }}
//               />
//             </LinearGradient>
//             {formik.errors.username && (
//               <Text style={{fontSize: 11, color: 'red'}}>
//                 {formik.errors.username}
//               </Text>
//             )}
//             {mobileExist.setPassword ? (
//               // {!mobileExist.setPassword ? (
//               <PasswordLogin username={formik.values.username} />
//             ) : null}
//             {mobileExist.exists && !mobileExist.setPassword && matchMobile ? (
//               <CreatePassword username={formik.values.username} />
//             ) : null}
//             {!mobileExist.exists && createUserForm ? (
//               <RegisterUser username={formik.values.username} />
//             ) : null}
//             {/* <Text>{finalMobileNo}</Text> */}
//             {/* <Text>{formik.values.username}</Text> */}
//             {/* <View style={{paddingTop: 10}}>
//               <Button
//                 title="CONTINUE"
//                 onPress={() => {
//                   console.log('continue pressed');

//                   // formikOTP.handleSubmit();
//                 }}
//                 buttonStyle={{
//                   backgroundColor: appTheme.NEW_PALLET,
//                   borderRadius: 8,
//                 }}
//                 titleStyle={{color: 'black'}}
//                 containerStyle={{paddingTop: 10}}
//               />
//             </View> */}
//             {/* <Text style={{color: 'black', marginTop: 20}}>OTP</Text> */}
//             {/* {() => {
//             formik.setFieldValue('password', otpCode);
//             handleChangeOTP(otpCode);
//           }} */}
//           </View>
//           {/* <Pressable
//             onPress={() => navigation.navigate(navigationStrings.TRANSACTION)}
//             style={{backgroundColor: 'black'}}>
//             <Text>New Field</Text>
//           </Pressable> */}
//         </View>
//       </ScrollView>
//       {/* </View> */}
//     </SafeAreaView>
//   );
// }
