// import React, {useState, useEffect} from 'react';
// import {
//   Dimensions,
//   Image,
//   Keyboard,
//   Linking,
//   SafeAreaView,
//   ScrollView,
//   Text,
//   TouchableWithoutFeedback,
//   View,
// } from 'react-native';

// import appTheme from '../../utils/appTheme';
// import {requestGetSettingInfo} from '../../services/backend_helper';

// import {setSettingAsyncStorage} from '../../services/auth_helper';
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
// import OTPComponent from './OTPComponent';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import colors from '../../styles/colors';
// import LanguageDropdown from '../comman/LanguageDropdown/LanguageDropdown';

// const {height, width} = Dimensions.get('window');

// export default function Login(props: any) {
//   const {t} = useTranslation();
//   const [tnc, setTNC] = useState('');
//   const [helpline, sethelpline] = useState('');
//   const [dName, setDName] = useState('');
//   const fetchSettingInfo = async () => {
//     await requestGetSettingInfo()
//       .then(res => {
//         if (res.isError == false) {
//           setSettingAsyncStorage(res.data);
//           setTNC(res.data.catalogue.terms);
//           sethelpline(res.data.helpdesk.phone);
//         }
//       })
//       .catch(error => {
//         console.log('Response: ', error);
//       });
//   };

//   useEffect(() => {
//     fetchSettingInfo();
//   }, []);
//   const navigation = useNavigation();
//   // const dispatch = useDispatch();
//   DeviceInfo.getManufacturer().then(manufacturer => {
//     // console.log(manufacturer);
//   });
//   let ddname = DeviceInfo.getModel();
//   // console.log(deviceName);
//   let buildNumber = DeviceInfo.getBuildNumber();
//   // console.log(buildNumber);
//   let brand = DeviceInfo.getBrand();
//   // console.log(brand);
//   let temp1 = `${brand} ${ddname}`;
//   // setDName(temp1);
//   // setDName(brand.concat(ddname.toString()));
//   // console.log(dName);

//   // console.log(, brand);

//   // DeviceInfo.getBaseOs().then(baseOs => {
//   //   console.log(baseOs);
//   // });
//   let systemVersion = DeviceInfo.getSystemVersion();
//   console.log(systemVersion);
//   // console.log(DeviceInfo);
//   return (
//     <SafeAreaView
//       style={{flex: 1, backgroundColor: appTheme.APP_BACKGROUND_COLOR}}>
//       <ScrollView>
//         <TouchableWithoutFeedback
//           onPress={() => {
//             Keyboard.dismiss();
//           }}
//           accessible={false}>
//           <View
//             style={{
//               // height: height,
//               // width: width,
//               backgroundColor: appTheme.APP_BACKGROUND_COLOR,
//               paddingHorizontal: width * 0.06,
//             }}>
//             <View
//               style={{
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//               }}>
//               <Text
//                 style={{
//                   color: 'black',
//                   // fontWeight: 'bold',
//                   fontWeight: '500',
//                   fontSize: 24,
//                   marginTop: 10,
//                 }}>
//                 {t('signin')}
//               </Text>
//               <View
//                 style={{
//                   alignContent: 'flex-end',
//                   alignItems: 'flex-end',
//                   alignSelf: 'flex-end',
//                   justifyContent: 'flex-end',
//                   paddingTop: 10,
//                 }}>
//                 <LanguageDropdown />
//               </View>
//             </View>
//             <View>
//               <Image
//                 source={require('../../../assets/images/login_banner.png')}
//                 style={{
//                   resizeMode: 'cover',
//                   height: height * 0.26,
//                   width: width * 0.88,
//                   // backgroundColor: 'yellow',
//                   borderRadius: 15,
//                   marginTop: 15,
//                 }}
//               />
//               <View style={{paddingTop: 10, width: width * 0.88}}>
//                 {/* <LanguageDropdown /> */}
//                 <View
//                   style={{
//                     flexDirection: 'column',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                   }}>
//                   <Text
//                     style={{
//                       fontSize: 22,
//                       fontWeight: '200',
//                       color: colors.black,
//                     }}>
//                     {t('welcome')}{' '}
//                   </Text>
//                   <Text style={{color: colors.black, fontWeight: '200'}}>
//                     {t('loginorreg')}
//                   </Text>
//                 </View>
//               </View>
//               <OTPComponent />
//               <View
//                 style={{
//                   paddingTop: 40,
//                   paddingBottom: 30,
//                   flexDirection: 'row',
//                   alignSelf: 'center',
//                   justifyContent: 'center',
//                   // justifyContent: 'space-around',
//                   alignContent: 'center',
//                   alignItems: 'center',
//                 }}>
//                 <Icon name="phone" size={19} color={appTheme.NEW_PALLET} />
//                 <Text>
//                   <Text> {t('needhelp')} </Text>
//                   <Text
//                     style={{
//                       textDecorationLine: 'underline',
//                       fontWeight: '300',
//                     }}
//                     onPress={() => Linking.openURL(`tel:${helpline}`)}>
//                     {helpline}
//                   </Text>
//                 </Text>
//               </View>
//               <View style={{paddingTop: 10}}>
//                 {/* <Text>Need help? Whatsapp Icon Mobile No.</Text> */}
//                 <View
//                   style={{
//                     paddingTop: 10,
//                     paddingHorizontal: 3,
//                     flexDirection: 'row',
//                     justifyContent: 'space-evenly',
//                     alignContent: 'center',
//                     alignItems: 'center',
//                   }}>
//                   <View style={{paddingLeft: 3}}>
//                     <Icon
//                       name="check-circle"
//                       size={19}
//                       color={appTheme.NEW_PALLET}
//                     />
//                   </View>
//                   <View style={{paddingHorizontal: 1}}>
//                     <Text>
//                       <Text>
//                         {t('accepttnc1')}{' '}
//                         <Text
//                           style={{
//                             color: 'blue',
//                             textDecorationLine: 'underline',
//                           }}
//                           onPress={() => Linking.openURL(tnc)}>
//                           {t('accepttnc2')}
//                         </Text>{' '}
//                         {t('accepttnc3')}
//                         {/* <Text>program.</Text> */}
//                       </Text>
//                     </Text>
//                   </View>
//                 </View>
//               </View>
//             </View>
//           </View>
//         </TouchableWithoutFeedback>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }
