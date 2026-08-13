// import React, {useState, useEffect} from 'react';
// import {
//   Alert,
//   Dimensions,
//   Image,
//   Keyboard,
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
// import SmsRetriever from 'react-native-sms-retriever';

// const {height, width} = Dimensions.get('window');
// export default function Login(props: any) {
//   const [otpWindow, setOTPWindow] = useState(false);
//   const [userExistResponse, setuserExistResponse] = useState(false);
//   const [sendMobileNo, setSendMobileNo] = useState('');
//   const [finalMobileNo, setFinalMobileNo] = useState('');
//   const _onPhoneNumberPressed = async () => {
//     try {
//       const phoneNumber = await SmsRetriever.requestPhoneNumber()
//         .then(res => {
//           console.log('Mobile Respinse', res);
//           // setFinalMobileNo(res.data);
//         })
//         .catch(error => {
//           console.log(error);
//         });
//       console.log(phoneNumber);
//       // alert(`Phone Number: ${phoneNumber}`);
//     } catch (error) {
//       console.log(error);
//       // alert(`Phone Number Error: ${JSON.stringify(error)}`);
//     }
//   };
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
//   const PasswordinitialValues = {
//     username: '',
//     password: '',
//     isVisible: true,
//     isClicked: false,
//     focusUserName: false,
//     focusPassword: false,
//   };
//   const OTPinitialValues = {
//     username: '',
//   };
//   const [otpCode, setOTPCode] = useState('');
//   const [isPinReady, setIsPinReady] = useState(false);
//   const maximumCodeLength = 4;
//   const validationSchema = Yup.object({
//     username: Yup.string()
//       .required('Please enter mobile number')
//       .min(10)
//       .max(13),
//     password: Yup.string().min(4).max(4).required('OTP is required'),
//   });
//   const OTPvalidationSchema = Yup.object({
//     username: Yup.string()
//       .required('Please enter mobile number')
//       .min(10)
//       .max(10),
//     // password: Yup.string().min(4).max(4).required('OTP is required'),
//   });
//   const PasswordvalidationSchema = Yup.object({
//     username: Yup.string()
//       .required('Please enter mobile number')
//       .min(10)
//       .max(13),
//     password: Yup.string().min(3).max(20).required('Password is required'),
//   });

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
//   const PasswordonSubmit = async (values: any) => {
//     var data = {
//       username: formik.values.username,
//       password: formikPassword.values.password,
//     };
//     console.log(formikPassword.values.username);

//     setSendMobileNo(formikPassword.values.username);
//     console.log('Signindata', sendMobileNo);
//     if (userExistResponse == true) {
//       console.log('User Exist', userExistResponse);
//       await requestLoginPassword(data)
//         .then(res => {
//           // formik.setFieldValue('isClicked', false);
//           if (res.isError == false && res.message == 'SUCCESS') {
//             formikPassword.setValues({...initialValues, isClicked: false});
//             var resData = JSON.stringify(res.data);
//             setTokenAsyncStorage(res?.data?.token);
//             dispatch(login(resData));
//             dispatch(stackUpdate('dashboard'));
//           }
//         })
//         .catch(error => {
//           formikPassword.setFieldValue('isClicked', false);
//           console.log('Login Response >>>>  ', error);
//         });
//       console.log('formik pass', formikPassword.values.username);
//       setSendMobileNo(formikPassword.values.username);
//       navigation.navigate(navigationStrings.SIGN_UP_ONE, {
//         mobileno: formik.values.username,
//       });
//     } else if (userExistResponse == false) {
//       console.log('Already a User', userExistResponse);
//     }
//   };
//   const formikPassword = useFormik({
//     initialValues: PasswordinitialValues,
//     onSubmit: PasswordonSubmit,
//     validationSchema: PasswordvalidationSchema,
//   });
//   console.log(formikPassword.values);
//   const OTPonSubmit = async (values: any) => {
//     var data = {
//       mobile: formikOTP.values.username,
//     };
//     console.log('OTP Username', data);

//     // var jsonData = JSON.parse(`${data}`);
//     requestSendOTP(data)
//       .then(res => {
//         // formik.setFieldValue('isClicked', false);
//         if (res.isError == false && res.message == 'SUCCESS') {
//           // formik.setValues({...initialValues, isClicked: false});
//           var resData = JSON.stringify(res.data);
//           setOTPCodeResponse(res.data.otp);
//           setuserExistResponse(res.data.userExist);
//           console.log('Response', res);
//         } else {
//           console.log('ERROR');
//         }
//       })
//       .catch(error => {
//         // formik.setFieldValue('isClicked', false);
//         console.log('Login Response >>>>  ', error);
//       });
//   };
//   const formikOTP = useFormik({
//     initialValues: OTPinitialValues,
//     onSubmit: OTPonSubmit,
//     validationSchema: OTPvalidationSchema,
//   });

//   const handleChangeOTP = (e: any) => {
//     // console.log(e);
//     // console.log('OTP ENTERED ____', otpCode);

//     formik.setFieldValue('password', otpCode);
//     // console.log(otpCode);

//     // console.log(">>>>> Password > ", e);
//   };
//   const handleChangePassword = (e: any) => {
//     // console.log(e);
//     // console.log('OTP ENTERED ____', otpCode);

//     formikPassword.setFieldValue('password', e);
//     // console.log(otpCode);

//     // console.log(">>>>> Password > ", e);
//   };

//   const handleChangeUsername = (e: any) => {
//     // console.log('>>>>> Email > ', e);
//     formikOTP.setFieldValue('username', e);
//     formik.setFieldValue('username', e);
//     formikPassword.setFieldValue('username', e);
//   };
//   // console.log('Response', otpCode);
//   // console.log('Response', otpCodeResponse);
//   // console.log('Response', userExistResponse);

//   const onSubmitFinal = async (values: any) => {
//     var data = {
//       username: formik.values.username,
//       otp: formik.values.password,
//     };
//     // console.log(formik.values.username);

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
//           {/* <Image
//             source={require('../../../assets/images/app_logo.png')}
//             style={{
//               resizeMode: 'contain',
//               height: height * 0.07,
//               width: width * 0.4,
//               // backgroundColor: 'red',
//             }}
//           /> */}
//           <Image
//             source={require('../../../assets/images/login_banner.png')}
//             style={{
//               resizeMode: 'cover',
//               height: height * 0.26,
//               width: width * 0.88,
//               // backgroundColor: 'yellow',
//               borderRadius: 15,
//               marginTop: 15,
//             }}
//           />
//           <View style={{width: width * 0.88}}>
//             <Text
//               style={{
//                 color: 'black',
//                 fontWeight: 'bold',
//                 fontSize: 22,
//                 marginTop: 10,
//               }}>
//               Sign In
//             </Text>
//           </View>
//           <Text style={{marginTop: 20}}>
//             <Text style={{color: 'black'}}>Phone Number</Text>
//             <Text style={{color: 'red'}}>*</Text>
//           </Text>
//           <LinearGradient
//             colors={['#39B8FF', '#0029FF']}
//             style={{
//               width: width * 0.88,
//               padding: formik.values.focusUserName ? 1 : 0,
//               borderRadius: 8,
//               marginTop: 10,
//             }}
//             start={{x: 0, y: 0}}
//             end={{x: 1, y: 0}}>
//             <TextInput
//               style={{
//                 width: width * 0.88 - (formik.values.focusUserName ? 2 : 0),
//                 borderColor: 'black',
//                 borderWidth: formik.values.focusUserName ? 0 : 1,
//                 borderRadius: 8,
//                 // marginTop: 10,
//                 paddingHorizontal: 10,
//                 backgroundColor: 'white',
//                 // marginBottom: 1,
//               }}
//               placeholder={'Phone Number'}
//               placeholderTextColor="#CCCCCC"
//               value={formikOTP.values.username}
//               onChangeText={text => handleChangeUsername(text)}
//               keyboardType="phone-pad"
//               onFocus={() => {
//                 _onPhoneNumberPressed();
//                 formik.setValues({
//                   ...formik.values,
//                   focusUserName: true,
//                   focusPassword: false,
//                 });
//               }}
//             />
//           </LinearGradient>
//           {formikOTP.errors.username && (
//             <Text style={{fontSize: 11, color: 'red'}}>
//               {formikOTP.errors.username}
//             </Text>
//           )}
//           {/* <View>
//             <Pressable
//               onPress={() => {
//                 console.log("pressed");
//               }}
//             > */}
//           <View style={{paddingTop: 10}}>
//             <Button
//               // ViewComponent={LinearGradient} // Don't forget this!
//               // linearGradientProps={{
//               //   colors: ["#F4C360", "#373435"],
//               //   start: { x: 0.5, y: 0 },
//               //   end: { x: 0.5, y: 1 },
//               //   // locations:{[0.9,1]}
//               // }}
//               title="Get OTP to Login"
//               onPress={() => {
//                 // console.log('Request OTP Pressed');
//                 // setOTPWindows(true);
//                 formikOTP.handleSubmit();
//               }}
//               // style={{ paddingTop: 20 }}
//               buttonStyle={{
//                 // paddingTop: 30,
//                 backgroundColor: appTheme.NEW_PALLET,
//                 borderRadius: 8,
//               }}
//               titleStyle={{color: 'black'}}
//               containerStyle={{paddingTop: 10}}
//             />
//           </View>
//           {/* </Pressable>
//           </View> */}
//           <Text style={{color: 'black', marginTop: 20}}>OTP</Text>
//           {/* <TextInput editable maxLength={4} /> */}
//           {/*  */}
//           <Pressable onPress={Keyboard.dismiss}>
//             <OTPInput
//               code={formik.values.password}
//               setCode={(otpCode: any) =>
//                 formik.setFieldValue('password', otpCode)
//               }
//               maximumLength={maximumCodeLength}
//               setIsPinReady={setIsPinReady}
//             />
//           </Pressable>

//           {() => {
//             formik.setFieldValue('password', otpCode);
//             handleChangeOTP(otpCode);
//           }}
//           <Text>{otpCode}</Text>
//           <LinearGradient
//             colors={['#39B8FF', '#0029FF']}
//             style={{
//               width: width * 0.88,
//               padding: formik.values.focusPassword ? 1 : 0,
//               borderRadius: 8,
//               marginTop: 10,
//             }}
//             start={{x: 0, y: 0}}
//             end={{x: 1, y: 0}}>
//             <View
//               style={{
//                 width: width * 0.88 - (formik.values.focusPassword ? 2 : 0),
//                 borderColor: 'black',
//                 borderWidth: formik.values.focusPassword ? 0 : 1,
//                 borderRadius: 8,
//                 // marginTop: 10,
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 paddingHorizontal: 10,
//                 backgroundColor: 'white',
//               }}>
//               <TextInput
//                 style={{
//                   width: width * 0.8 - 20,
//                   borderColor: 'black',
//                   // borderWidth: 1,
//                   borderRadius: 8,
//                   // marginTop: 10,
//                   paddingRight: 10,
//                   // backgroundColor: 'purple',
//                 }}
//                 placeholder={'Password'}
//                 placeholderTextColor="#AAAAAA"
//                 value={formikPassword.values.password}
//                 onChangeText={text => handleChangePassword(text)}
//                 // secureTextEntry={formik.values.isVisible}
//                 // onFocus={() => {
//                 //   formikPassword.setValues({
//                 //     ...formik.values,
//                 //     focusUserName: false,
//                 //     focusPassword: true,
//                 //   });
//                 // }}
//               />
//               <TouchableOpacity
//                 onPress={() => {
//                   formik.setFieldValue('isVisible', !formik.values.isVisible);
//                   // console.log('Visible ', formik.values.isVisible);
//                 }}
//                 style={{
//                   width: width * 0.06,
//                   // backgroundColor: 'red'
//                 }}>
//                 <Image
//                   source={require('../../../assets/images/eye_off.png')}
//                   style={{resizeMode: 'contain', width: width * 0.06}}
//                   resizeMode="contain"
//                 />
//               </TouchableOpacity>
//             </View>
//           </LinearGradient>
//           {formik.errors.password && (
//             <Text style={{fontSize: 11, color: 'red'}}>
//               {formik.errors.password}
//             </Text>
//           )}
//           <View
//             style={{
//               flexDirection: 'row',
//               alignContent: 'flex-end',
//               alignItems: 'flex-end',
//               alignSelf: 'flex-end',
//             }}>
//             <Text
//               style={{
//                 color: 'black',
//                 // alignSelf: "flex-end",
//                 marginTop: 10,
//                 marginHorizontal: 5,
//                 textDecorationLine: 'underline',
//               }}>
//               Resend OTP
//             </Text>
//             <Text
//               style={{
//                 color: 'black',
//                 // alignSelf: "flex-end",
//                 marginTop: 10,
//                 marginHorizontal: 5,
//                 textDecorationLine: 'underline',
//               }}>
//               Resend OTP via Call
//             </Text>
//           </View>
//           <View style={{paddingTop: 10}}>
//             <Button
//               title="Submit with OTP"
//               loading={formikPassword.values.isClicked}
//               onPress={() => {
//                 formik.handleSubmit();
//                 // console.log('OTP CODE', otpCode);
//                 // console.log('formik pass', formik.values.username);
//                 // setSendMobileNo(formik.values.username);
//                 // navigation.navigate(navigationStrings.SIGN_UP_ONE, {
//                 //   mobileno: formik.values.username,
//                 // });
//                 console.log('Submit Clicked');
//               }}
//               buttonStyle={{
//                 backgroundColor: appTheme.NEW_PALLET,
//                 // backgroundColor: "#FFE712",
//                 borderRadius: 8,
//                 // paddingTop: 0,
//               }}
//               disabled={formik.values.isClicked ? true : !formik.isValid}
//               titleStyle={{color: 'black'}}
//               containerStyle={{paddingTop: 10}}
//             />
//           </View>
//           <View style={{paddingTop: 10}}>
//             <Button
//               title="Submit with Password"
//               loading={formikPassword.values.isClicked}
//               onPress={() => {
//                 formikPassword.handleSubmit();
//                 // console.log('OTP CODE', otpCode);
//                 // console.log('formik pass', formik.values.username);
//                 // setSendMobileNo(formik.values.username);
//                 // navigation.navigate(navigationStrings.SIGN_UP_ONE, {
//                 //   mobileno: formik.values.username,
//                 // });
//                 console.log('Submit Clicked');
//               }}
//               buttonStyle={{
//                 backgroundColor: appTheme.NEW_PALLET,
//                 // backgroundColor: "#FFE712",
//                 borderRadius: 8,
//                 // paddingTop: 0,
//               }}
//               disabled={
//                 formikPassword.values.isClicked ? true : !formikPassword.isValid
//               }
//               titleStyle={{color: 'black'}}
//               containerStyle={{paddingTop: 10}}
//             />
//           </View>
//           <Text style={{fontSize: 30}}>{otpCodeResponse}</Text>
//           <ButtonComp
//             title="Sign In"
//             isLoading={formik.values.isClicked}
//             onPress={() => {
//               formik.handleSubmit();
//               // props.navigate.navigation
//             }}
//             disabled={formik.values.isClicked ? true : !formik.isValid}
//             style={{marginTop: 10}}
//             colors={['#39B8FF', '#39B8FF', '#0029FF']}
//           />
//           <Text
//             style={{
//               color: '#B4B4B4',
//               alignSelf: 'center',
//               marginTop: 10,
//               fontSize: 14,
//               fontWeight: '400',
//             }}>
//             Don't have account?
//             <Text
//               style={{color: 'black', fontWeight: '600'}}
//               onPress={() => {
//                 props.navigation.navigate('SignUpOne', {});
//               }}>
//               {' '}
//               Create Now
//             </Text>
//           </Text>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }
