// import {
//   View,
//   Text,
//   SafeAreaView,
//   ScrollView,
//   Image,
//   TouchableOpacity,
//   FlatList,
// } from 'react-native';
// import React from 'react';
// import Header from '../../comman/Header/Header';
// import imagePath from '../../../constants/imagePath';
// import {
//   responsiveFontSize,
//   responsiveHeight,
//   responsiveWidth,
// } from 'react-native-responsive-dimensions';
// import colors from '../../../styles/colors';
// import styles from '../home/styles';
// import DashedLine from 'react-native-dashed-line';
// import InputField from '../../comman/InputField';

// const Coupon = () => {
//   let data = [
//     {
//       id: '1',
//       title: 'Scanned ID 1',
//       name: 'ID name text',
//       points: '+900',
//       image: imagePath.RUPEE,
//     },
//     {
//       id: '2',
//       title: 'Scanned ID 1',
//       name: 'ID name text',
//       points: '+900',
//       image: imagePath.RUPEE,
//     },
//   ];
//   const renderItem = ({item}: {item: any}) => {
//     return (
//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           marginTop: responsiveHeight(2),
//           borderWidth: 1,
//           borderColor: colors.grey,
//           padding: 20,
//           borderTopEndRadius: 20,
//           borderTopStartRadius: 20,
//         }}>
//         <View>
//           <Text style={{fontWeight: 'bold'}}>{item.title}</Text>
//           <Text style={{color: '##B4B4B4'}}>{item.name}</Text>
//         </View>

//         <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//           <Text style={{color: '#00B432'}}>{item.points}</Text>
//           <View style={{marginHorizontal: responsiveWidth(0.5)}}></View>
//           <Image source={item.image} style={{width: 20, height: 20}} />
//         </View>
//       </View>
//     );
//   };
//   return (
//     <SafeAreaView
//       style={{
//         paddingBottom: responsiveHeight(6),
//         backgroundColor: colors.white,
//       }}>
//       <HeaderRNE centerComponent={{text: 'TITLE'}} />
//       {/* <HeaderRNE></HeaderRNE> */}
//       {/* <Heade></> */}
//       {/* <Header backArrow={imagePath.BACK} title="Coupon Scan" onPress={()=>{props.navigation.navigate('Home')}}/> */}
//       <Header
//         // style={{}}
//         backArrow={imagePath.BACK}
//         title="Coupon Scan"
//         onPress={() => undefined}
//       />
//       {/* <Header backArrow={imagePath.BACK} title="Coupon Scan"/> */}
//       <ScrollView
//         style={{
//           backgroundColor: colors.white,
//         }}>
//         <View style={styles.container}>
//           <View
//             style={{
//               marginTop: responsiveHeight(3),
//               justifyContent: 'center',
//             }}>
//             <Text
//               style={{
//                 fontSize: responsiveFontSize(1.4),
//                 color: colors.black,
//                 fontWeight: 'bold',
//                 marginStart: responsiveWidth(35),
//               }}>
//               Scan QR Code
//             </Text>

//             <Text
//               style={{
//                 fontSize: responsiveFontSize(1.4),
//                 color: colors.grey,
//                 fontWeight: 'bold',
//                 alignSelf: 'center',
//                 textAlign: 'center',
//                 marginTop: responsiveHeight(1),
//               }}>
//               {`Open your camera and place the \ncamera on the QR code`}
//             </Text>

//             <View
//               style={{
//                 marginTop: responsiveHeight(2),
//                 alignItems: 'center',
//               }}>
//               <Image
//                 style={{
//                   width: 60,
//                   height: responsiveHeight(30),
//                 }}
//                 source={imagePath.QR_CODE}
//               />
//             </View>
//             <Text
//               style={{
//                 fontSize: responsiveFontSize(1.4),
//                 color: colors.grey,
//                 fontWeight: 'bold',
//                 alignSelf: 'center',
//                 textAlign: 'center',
//                 marginTop: responsiveHeight(1),
//               }}>
//               {`QR ID : 212321321FS98`}
//             </Text>
//             <TouchableOpacity
//               style={{
//                 backgroundColor: '#000',
//                 flexDirection: 'row',
//                 marginTop: responsiveHeight(5),
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 height: responsiveHeight(5.7),
//                 borderRadius: responsiveWidth(2),
//               }}>
//               <Text
//                 style={{color: colors.white, fontSize: responsiveFontSize(2)}}>
//                 Place Camera on the QR.
//               </Text>
//             </TouchableOpacity>
//             <View style={{marginTop: responsiveHeight(3)}}>
//               <DashedLine dashGap={7} dashLength={1} dashThickness={1} />
//             </View>
//             <View
//               style={{
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 flexDirection: 'row',
//               }}>
//               <View
//                 style={{
//                   width: responsiveWidth(40),
//                   height: responsiveHeight(4.5),
//                   backgroundColor: '#EEF7FF',
//                   justifyContent: 'center',
//                   marginTop: responsiveHeight(3),
//                   flexDirection: 'row',
//                   alignItems: 'center',
//                   borderRadius: responsiveWidth(10),
//                 }}>
//                 <Text>Coupon Code</Text>
//               </View>
//               <View style={{margin: responsiveWidth(2)}}></View>

//               <View
//                 style={{
//                   width: responsiveWidth(40),
//                   height: responsiveHeight(4.5),
//                   backgroundColor: '#F5F5F5',
//                   justifyContent: 'center',
//                   marginTop: responsiveHeight(3),
//                   alignItems: 'center',
//                   borderRadius: responsiveWidth(10),
//                 }}>
//                 <Text>Scanning History</Text>
//               </View>
//             </View>
//             <InputField
//               label="Enter a Coupon Code"
//               placeholder="Enter Code Here"
//             />
//             <View
//               style={{
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 marginTop: responsiveHeight(1.5),
//               }}>
//               <Text style={{fontWeight: 'bold'}}>Today</Text>
//               <View
//                 style={{
//                   flexDirection: 'row',
//                   justifyContent: 'space-between',
//                   alignItems: 'center',
//                 }}>
//                 <Image
//                   source={imagePath.CALENDAR}
//                   style={{width: 20, height: 20}}
//                 />
//                 <View style={{marginHorizontal: responsiveWidth(0.5)}}></View>
//                 <Text style={{fontWeight: 'bold', color: 'black'}}>
//                   Change Date
//                 </Text>
//               </View>
//             </View>
//             <View>
//               <FlatList data={data} renderItem={renderItem} />
//             </View>
//             <TouchableOpacity
//               style={{
//                 backgroundColor: '#F5F5F5',
//                 borderRadius: responsiveWidth(2),
//                 height: responsiveHeight(5.5),
//                 marginTop: responsiveHeight(2),
//                 justifyContent: 'center',
//                 alignItems: 'center',
//               }}>
//               <Text style={{fontWeight: 'bold'}}>Submit</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default Coupon;
