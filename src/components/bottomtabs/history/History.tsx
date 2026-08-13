import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Dimensions,
  BackHandler,
  Platform,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import styles from './styles';
import imagePath from '../../../constants/imagePath';
import Header from '../../comman/Header/Header';
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";

// import navigationStrings from '../constants/navigationStrings';
// navigationStrings
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
// setLoginAuthToken
import colors from '../../../styles/colors';
import { useSelector } from 'react-redux';

import DashedLine from 'react-native-dashed-line';
import { Card, Header as HeaderRNE } from '@rneui/themed';
import { TouchableOpacity } from 'react-native-gesture-handler';
// import {get} from '../../../services/api_helper';
import {
  requestGetAllTransactions,
  requestCustomerBalancePoint,
  requestFilterTransaction,
  requestDamageHistory,
} from '../../../services/backend_helper';
import appTheme from '../../../utils/appTheme';
import Icon from 'react-native-vector-icons/Feather';
import MI from 'react-native-vector-icons/MaterialIcons';
import { Button } from '@rneui/themed';
// import { Icon } from 'react-native-vector-icons/Feather';
import navigationStrings from '../../../constants/navigationStrings';
import { useTranslation } from 'react-i18next';
import { Wrap } from '@react-native-material/core';
import { BlackCalendarIcon, CloseIcon, FilterIcon } from '../../Svg/Svg';
import DateTimePicker from '@react-native-community/datetimepicker'
import LinearGradient from 'react-native-linear-gradient';
import { getTokenAsyncStorage } from '../../../services/auth_helper';

const { height, width } = Dimensions.get('window');

const History = (props: any) => {
  const { t } = useTranslation();
  const [filterData, setFilterData] = useState(false);
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const [transactionData, setTransactionData] = useState([]);
  const [damageData, setDamageData] = useState([]);
  const [balancePoint, setBalancePoint] = useState(0);
  const [RedeemPoints, setRedeemPoints] = useState(0);
  const [selectedDateFrom, setSelectedDateFrom] = useState<any>();
  const [show, setShow] = useState(false)
  const [selectedDateTo, setSelectedDateTo] = useState<any>();
  const [date, setDate] = useState(new Date())
  const [mode, setMode] = useState<any>('date')
  const [itemSelect, setItemSelect] = useState<any>()
  const [show2, setShow2] = useState(false)
  const [date2, setDate2] = useState<any>(new Date())
  const [status, setStatus] = useState<any>(3)

  const navigation: any = useNavigation();
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
  const fetchCustomerBalancePoint = async () => {
    await requestCustomerBalancePoint({})
      .then(res => {
        if (res.isError == false) {
          setBalancePoint(res?.data?.balance);
          setRedeemPoints(res?.data?.redeempoint);
        }
      })
      .catch(error => {
        console.log('Response: ', error);
      });
  };
  const fetchTransactions = async () => {
    await requestGetAllTransactions()
      .then(res => {
        if (res.isError == false) {
          setTransactionData(res.data);
        }
      })
      .catch(error => {
        console.log('Response Transactions: ', error);
      });
  };
  useEffect(() => {
    fetchTransactions();
    DamageEntry()
    fetchCustomerBalancePoint();
  }, []);


  const FilterSubmit = async () => {
    const token = await getTokenAsyncStorage();
    const filterData = {
      token: token,
      startDate: selectedDateFrom,
      endDate: selectedDateTo
    }
    if (selectedDateFrom && selectedDateTo) {
      await requestFilterTransaction(filterData)
        .then(res => {
          if (res.isError == false) {
            setTransactionData(res?.data);
          }
        })
        .catch(error => {
          console.log('Response Transactions: ', error);
        });
    }
  }


  const onChange3 = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    let tempDate = new Date(currentDate);
    let formattedDate = tempDate.getFullYear() + '-' + ('0' + (tempDate.getMonth() + 1)).slice(-2) + '-' + ('0' + tempDate.getDate()).slice(-2);
    if (selectedDateFrom === 'From') {
      setSelectedDateFrom(formattedDate);

    } else if (selectedDateTo === 'To') {
      setSelectedDateTo(formattedDate);
    }
  };

  const DamageEntry = async () => {
    const token = await getTokenAsyncStorage();
    const filterData = {
      token: token,
      startDate: selectedDateFrom,
      endDate: selectedDateTo
    }
    await requestDamageHistory(filterData)
      .then(res => {
        if (res.isError == false) {
          setDamageData(res?.data)
          // setRedemptionData(res.data);
        }
      })
      .catch(error => {
        console.log('Response Transactions: ', error);
      });
  }

  const _renderItem = ({ item }: any) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignSelf: 'baseline',
          alignContent: 'center',
          width: width * 0.9,
          height: 50,
        }}>
        <View
          style={{
            backgroundColor: appTheme.NEW_PALLET,
            height: 32,
            width: 32,
            borderRadius: 32 / 4,
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 4,
          }}>
          <Icon name="inbox" size={24} color="white" />
        </View>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            marginHorizontal: responsiveWidth(1.5),
            justifyContent: 'space-between',
          }}>
          <View>
            <Text
              style={{
                width: '100%',
                flexWrap: 'wrap',
                fontWeight: '400',
                fontSize: responsiveFontSize(2),
              }}>
              {item.pointType}
            </Text>


            {/* <Text style={{fontWeight: 400, fontSize: responsiveFontSize(1.8)}}>
              {item.pointType}
            </Text> */}
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={{
                  fontSize: responsiveFontSize(1.6),
                  color: colors.grey,
                }}>
                {/* Date: {''} */}
              </Text>
              <Text
                style={{ fontSize: responsiveFontSize(1.6), color: colors.grey }}>
                {new Date(item.createdAt).toLocaleDateString().slice(0, 10)} {'  '} {`${item?.coupon ? `(` + (item?.coupon) + `)` : ''}`}
              </Text>
            </View>
          </View>
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  top: 2,
                  fontWeight: '500',
                  color: appTheme.NEW_PALLET,
                  marginHorizontal: responsiveWidth(2),
                }}>
                {item.points}
              </Text>
              <Image style={{ width: 20, height: 20 }} source={imagePath.RUPEE} />
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text
                style={{ fontSize: responsiveFontSize(1.6), color: colors.grey }}>
                {item.date}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const _DamagerenderItem = ({ item }: any) => {
    if(item?.statusType != "Rejected"){
      return (
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignSelf: 'baseline',
            alignContent: 'center',
            width: width * 0.9,
            height: 50,
          }} activeOpacity={1} onPress={() => { 
            if(item?.statusType == "Rejected"){
              setItemSelect(item) 
              actionSheetRef.current?.show()
            }
             }}>
          <View
            style={{
              backgroundColor: appTheme.NEW_PALLET,
              height: 32,
              width: 32,
              borderRadius: 32 / 4,
              alignContent: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 4,
            }}>
            <Icon name="inbox" size={24} color="white" />
          </View>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              marginHorizontal: responsiveWidth(1.5),
              justifyContent: 'space-between',
            }}>
            <View>
              <Text
                style={{
                  width: '100%',
                  flexWrap: 'wrap',
                  fontWeight: '400',
                  fontSize: responsiveFontSize(2),
                }}>
                {"Damage entry"}
              </Text>
  
  
              {/* <Text style={{fontWeight: 400, fontSize: responsiveFontSize(1.8)}}>
                {item.pointType}
              </Text> */}
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={{
                    fontSize: responsiveFontSize(1.6),
                    color: colors.grey,
                  }}>
                  {/* Date: {''} */}
                </Text>
                <Text
                  style={{ fontSize: responsiveFontSize(1.6), color: colors.grey }}>
                  {new Date(item.createdAt).toLocaleDateString().slice(0, 10)} {'  '} {`${item?.couponCode ? `(` + (item?.couponCode) + `)` : ''}`}
                </Text>
              </View>
            </View>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignContent: 'center',
                  backgroundColor: item?.statusType == "Rejected" ? 'red' : 'orange',
                  paddingHorizontal: 5,
                  paddingVertical: 4,
                  borderRadius: 8
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '500',
                    color: 'white',
                  }}>
                  {item?.statusType}
                </Text>
  
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text
                  style={{ fontSize: responsiveFontSize(1.6), color: colors.grey }}>
                  {item.date}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  };
  return (
    <View style={styles.safeAreaView}>
      <HeaderRNE
           backgroundColor="white"
           backgroundImageStyle={{}}
           barStyle="dark-content"
        centerComponent={{
          text: `${t('transaction')}`,
          style: {
            color: 'black',
            fontSize: 19,
            justifyContent: 'center',
            alignContent: 'center',
            alignSelf: 'center',
            alignItems: 'center',
          },
        }}
        centerContainerStyle={{ height: 28, justifyContent: 'center' }}
        leftComponent={
          <TouchableOpacity
            containerStyle={{ padding: 5 }}
            onPress={() => props.navigation.goBack()}>
            <Ionicons name="chevron-back" size={25} color={'black'} />
          </TouchableOpacity>
        }
        leftContainerStyle={{ paddingLeft: 9 }}
        linearGradientProps={{}}
        placement="center"
        rightContainerStyle={{}}
        statusBarProps={{}}
        containerStyle={{
          bottom: Platform.OS === "android"
            ? Platform.OS === "android" && Platform.Version <= 34
              ?0
              : height * 0.04
            : 0
        }}
      />
      <ScrollView>
      <View>
        {/* <View style={{alignSelf: 'baseline'}}> */}
        <Card
          containerStyle={{
            width: width - 30,
            backgroundColor: appTheme.NEW_PALLET,
            borderRadius: 18,
          }}>
          <View>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View
                style={{
                  padding: 10,
                }}>
                <Text style={{ fontWeight: '700', fontSize: 20, color: 'white' }}>
                  {`${t('balance')}`}
                </Text>
                <Text style={{ fontWeight: '700', fontSize: 32, color: 'white' }}>
                  {balancePoint}
                </Text>
              </View>
              <DashedLine
                axis="vertical"
                dashColor="white"
                dashLength={4}
                dashGap={3}
                style={{ paddingLeft: 70 }}
              />

              <View
                style={{
                  padding: 10,
                }}>
                <View style={{ alignSelf: 'baseline', width: width / 2 }}>
                  <Text
                    style={{
                      fontWeight: '700',
                      fontSize: 20,
                      color: 'white',
                    }}>
                    {`${t('totalearned')}`}
                  </Text>
                </View>
                <Text style={{ fontWeight: '700', fontSize: 32, color: 'white' }}>
                  {balancePoint + RedeemPoints}
                </Text>
              </View>
            </View>
            <DashedLine
              axis="horizontal"
              dashColor="white"
              dashLength={4}
              dashGap={3}
            />
            <View
              style={{
                paddingTop: 20,
                flexDirection: 'row',
                alignContent: 'flex-end',
                justifyContent: 'flex-end',
                padding: 5,
              }}>
              <Button
                type={'solid'}
                title={`${t('couponscan')}`}
                titleStyle={{ color: 'black', padding: 10 }}
                icon={<MI name="qr-code-scanner" color={'black'} size={20} />}
                iconPosition={'right'}
                iconContainerStyle={{ margin: 2 }}
                buttonStyle={{ backgroundColor: 'white' }}
                containerStyle={{ borderRadius: 24 }}
                onPress={() => {
                  navigation.navigate(navigationStrings.COUPON_SCAN);
                }}
              />
            </View>
          </View>
        </Card>
        {/* </View> */}

        <View style={{ paddingVertical: 10 }}>
          <DashedLine dashColor="grey" dashLength={3} dashThickness={1} />
        </View>
        {/* <View
          style={{
            marginHorizontal: responsiveWidth(4),
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}> */}
        <Text
          style={{
            paddingTop: 10,
            marginHorizontal: responsiveWidth(4),
            paddingBottom: 10,
            fontWeight: '500',
            fontSize: 16,
            textDecorationLine: 'underline',
          }}>
          {`${t('history')}`}
        </Text>
        {/* </View> */}
        <ScrollView showsVerticalScrollIndicator={true}>
          <TouchableOpacity style={styles.filterContainer} onPress={() => setFilterData(true)}>
            <View style={{ flexDirection: 'row', }}>
              <FilterIcon style={{ alignSelf: 'center' }} />
              <Text style={styles.filterText}>Filter</Text>
            </View>
            {
              filterData == true && (
                <TouchableOpacity onPress={() => setFilterData(false)}>
                  <CloseIcon />
                </TouchableOpacity>
              )
            }
            {console.log(itemSelect)}
          </TouchableOpacity>
          {
            filterData && (
              <View style={styles.filterTouchView}>
                <Text style={styles.daterangeText}>Date Range</Text>
                <View style={styles.monthContainer}>
                  {
                    Platform.OS == 'android' && (
                      <>
                        <View style={{ width: '49%' }}>
                          <TouchableOpacity style={[styles.dateContainer, { paddingHorizontal: 10 }]} onPress={() => {
                            setSelectedDateFrom('From');
                            setShow(true)
                          }}>
                            <Text style={[styles.dateText2, { opacity: selectedDateFrom == undefined ? 0.7 : 1 }]}>{selectedDateFrom == undefined ? 'From' : selectedDateFrom}</Text>
                            <BlackCalendarIcon />
                          </TouchableOpacity>
                        </View>
                        <View style={{ width: '49%' }}>
                          <TouchableOpacity style={[styles.dateContainer, { paddingHorizontal: 10 }]} onPress={() => {
                            setShow(true)
                            setSelectedDateTo('To')
                          }}>
                            <Text style={[styles.dateText2, { opacity: selectedDateTo == undefined ? 0.7 : 1 }]}>{selectedDateTo == undefined ? 'To' : selectedDateTo}</Text>
                            <BlackCalendarIcon />
                          </TouchableOpacity>
                        </View>
                      </>
                    )
                  }

                </View>

                <LinearGradient colors={['orange', 'orange']}
                  style={[styles.submitButton]}>
                  <TouchableOpacity style={[styles.submitButton]}
                    onPress={() => {
                      FilterSubmit()
                      DamageEntry()
                      setFilterData(false)
                    }}>
                    <Text style={styles.text}>{'Submit'}</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            )
          }
          <View style={{ flex: 2 }}>
            <View
              style={{
                marginHorizontal: responsiveWidth(3),
                padding: 6,
                overflow: 'hidden',
              }}>
              <FlatList
                data={transactionData}
                renderItem={_renderItem}
                contentContainerStyle={{}}
              />
            </View>
            <View style={{ paddingVertical: 10, }}>
              <DashedLine dashColor="grey" dashLength={3} dashThickness={1} />
            </View>
            <Text
              style={{
                paddingTop: 10,
                marginHorizontal: responsiveWidth(4),
                paddingBottom: 10,
                fontWeight: '500',
                fontSize: 16,
                textDecorationLine: 'underline',
              }}>
              {`Damage coupon history`}
            </Text>
            <View
              style={{
                marginHorizontal: responsiveWidth(3),
                padding: 6,
                overflow: 'hidden',
              }}>
              <FlatList
                data={damageData}
                renderItem={_DamagerenderItem}
                contentContainerStyle={{}}
              />
            </View>
          </View>
          <View style={{ height: 200 }} />
        </ScrollView>
        {
          Platform.OS == 'android' && (
            <>
              {show && (
                <DateTimePicker
                  testID='dateTimePicker'
                  value={date}
                  mode={mode}
                  is24Hour={true}
                  display='default'
                  onChange={(event, selectedDate) => onChange3(event, selectedDate)}

                />
              )}
            </>
          )
        }
      </View>
      <ActionSheet ref={actionSheetRef} >
        <View style={{ paddingTop: 15 }}>
          <Text
            style={{
              paddingTop: 10,
              marginHorizontal: responsiveWidth(4),
              paddingBottom: 10,
              fontWeight: '700',
              fontSize: 20,
              color: 'black',
              textDecorationLine: 'underline',
            }}>
            {`Damage coupon details`}
          </Text>
          <View>
            <Text
              style={{
                paddingTop: 5,
                marginHorizontal: responsiveWidth(4),
                paddingBottom: 10,
                fontWeight: '700',
                fontSize: 15,
                color: 'black',
                textDecorationLine: 'underline',
              }}>
              {`Coupon code`}{':'}  {itemSelect?.couponCode}
            </Text>
            <Text
              style={{
                paddingTop: 5,
                marginHorizontal: responsiveWidth(4),
                paddingBottom: 10,
                fontWeight: '700',
                fontSize: 15,
                color: 'black',
                textDecorationLine: 'underline',
              }}>
              {`Remark`}{':'}  {itemSelect?.remark}
            </Text>
          </View>
          <LinearGradient colors={['orange', 'orange']}
            style={[styles.submitButton,{height: 35}]}>
            <TouchableOpacity style={[styles.submitButton]}
              onPress={() => {
                actionSheetRef.current?.hide()
              }}>
              <Text style={styles.text}>{'ok'}</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
        <View style={{ height: 35 }} />
      </ActionSheet>
      </ScrollView>
    </View>
  );
};

export default History;



// : (
//   <>
//     <View style={{ width: '49%' }}>
//       <Text style={styles.dateText2}>{'From'}</Text>
//       <TouchableOpacity style={styles.dateContainer} onPress={() => {
//         setShow(true)
//       }}>
//         {show ? (
//           <DateTimePicker
//             testID='dateTimePicker'
//             value={date}
//             mode={mode}
//             is24Hour={true}
//             display='default'
//             onChange={(event, selectedDate) => onChange(event, selectedDate)}

//           />
//         ) : (
//           <Text style={styles.placholderdateText}>{'2024-12-08'}</Text>
//         )}
//         <BlackCalendarIcon style={{ right: 10 }} />
//       </TouchableOpacity>

//     </View>
//     <View style={{ width: '49%' }}>
//       <Text style={styles.dateText2}>{'To'}</Text>

//       <TouchableOpacity style={styles.dateContainer} onPress={() => {
//         setShow2(true)
//       }}>
//         {show2 ? (
//           <DateTimePicker
//             testID='dateTimePicker'
//             value={date2}
//             mode={mode2}
//             is24Hour={true}
//             display='default'
//             onChange={(event, selectedDate) => onChange2(event, selectedDate)}

//           />
//         ) : (
//           <Text style={styles.placholderdateText}>{'2024-12-08'}</Text>
//         )}
//         <BlackCalendarIcon style={{ right: 10 }} />
//       </TouchableOpacity>
//     </View>
//   </>
// )