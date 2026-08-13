// import {
//   View,
//   SafeAreaView,
//   ScrollView,
//   TouchableOpacity,
//   FlatList,
//   Image,
//   Platform,
// } from 'react-native';
// import React from 'react';
// import Header from '../comman/Header/Header';
// import colors from '../../styles/colors';
// import {Text} from '@rneui/base';
// import navigationStrings from '../../constants/navigationStrings';
// import {Card, Header as HeaderRNE} from '@rneui/themed';
// import imagePath from '../../constants/imagePath';
// import {useNavigation} from '@react-navigation/native';
// import styles from './styles';
// import DashedLine from 'react-native-dashed-line';
// import {
//   responsiveHeight,
//   responsiveScreenHeight,
//   responsiveWidth,
// } from 'react-native-responsive-dimensions';
// import {useFormik} from 'formik';
// import * as Yup from 'yup';
// import InputField from '../comman/InputField/InputField';
// import Button from '../comman/Button/Button';
// const PaymentSelect = (props: any) => {
//   const initialValues = {
//     MobileNum: '',
//   };
//   const validationSchema = Yup.object({
//     MobileNum: Yup.string()
//       .required('Please enter a number')
//       .min(10, ({min}) => `Mobile Number must be of ${min} digits`)
//       .max(10, ({max}) => `Mobile Number must be of ${max} digits`)
//       .matches(new RegExp(/^[0-9]{10}$/), 'Moile Number must be of 10 digits'),
//   });
//   const navigation = useNavigation();
//   let pay_list = [
//     {
//       id: '1',
//       image: imagePath.GOOGLEUPI,
//     },
//     {
//       id: '2',
//       image: imagePath.PAYTM,
//     },
//     {
//       id: '3',
//       image: imagePath.BHIMUPI,
//     },
//     {
//       id: '4',
//     },
//   ];
//   const renderIconImage = ({item}) => {
//     return (
//       <View>
//         <Image source={item.image} />
//       </View>
//     );
//   };
//   return (
//     <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
//       <Header
//         onPress={navigation.goBack}
//         backArrow={imagePath.BACK}
//         title={'Paytm'}
//       />
//       {/* <View>
//         <Card containerStyle={styles.big_card_view}>
//           <Image style={styles.image_view} source={imagePath.LOGIN} />
//         </Card>
//       </View> */}
//       <View>
//         <Text
//           style={{
//             paddingTop: 10,
//             fontWeight: '500',
//             fontSize: 17,
//             paddingLeft: 16,
//           }}>
//           Enter Paytm Wallet Details
//         </Text>
//         {/* <FlatList
//           numColumns={2}
//           data={pay_list}
//           renderItem={({item}) => (
//             <Card containerStyle={styles.upi_cards}>
//               <TouchableOpacity
//                 // onPress={() => navigation.navigate(item.screenPath)}
//                 style={
//                   {
//                     // justifyContent: 'space-between',
//                     // alignItems: 'center',
//                     // paddingVertical: responsiveHeight(3),
//                     // paddingHorizontal:
//                     //   Platform.OS === 'android'
//                     //     ? responsiveWidth(4)
//                     //     : responsiveWidth(5.5),
//                   }
//                 }>
//                 <View style={styles.row}>
//                   <Text style={styles.text_text}>{item.title}</Text>
//                   <Image source={item.image} style={styles.other_upi} />
//                 </View>
//               </TouchableOpacity>
//             </Card>
//           )}
//                */}
//         {/* // <DashedLine></DashedLine> */}
//         {/* /> */}
//         <DashedLine
//           dashGap={7}
//           dashLength={1}
//           dashThickness={1}
//           style={{paddingTop: 15}}
//         />
//         <View style={{width: '90%', marginHorizontal: responsiveWidth(4)}}>
//           <InputField
//             label={'Name'}
//             placeHolder={'Amit'}
//             onChangeText={undefined}
//             inputStyle={undefined}
//             rightIcon={undefined}
//             onPressRight={undefined}
//           />
//         </View>
//         <View style={{width: '90%', marginHorizontal: responsiveWidth(4)}}>
//           <InputField
//             label={'Mobile Number'}
//             placeHolder={'9875523454'}
//             onChangeText={undefined}
//             inputStyle={undefined}
//             rightIcon={undefined}
//             onPressRight={undefined}
//           />
//         </View>
//         <View style={{width: '90%', marginHorizontal: responsiveWidth(4)}}>
//           <Button
//             title="Confirm"
//             onPress={() => {
//               // if (formik.isValid) {
//               //   console.log('Form is Valid: ', formik.isValid);
//               //   // console.log('form is valf')
//               //   // props.navigation.navigate();
//               // } else {
//               //   console.log('Form is Valid: ', formik.isValid);
//               // }
//               // disabled={!(formik.isValid && formik.dirty)}
//             }}
//           />
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default PaymentSelect;
