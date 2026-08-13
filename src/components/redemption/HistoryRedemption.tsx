import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  View,
  BackHandler,
  Platform,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from '../bottomtabs/history/styles';
import imagePath from '../../constants/imagePath';
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import colors from '../../styles/colors';
import { Button, Card, Header as HeaderRNE } from '@rneui/themed';
import {
  requestCustomerBalancePoint,
  requestDamageHistory,
  requestFilterRedemption,
  requestFilterTransaction,
  requestGetAllRedemptions,
} from '../../services/backend_helper';
import Icon from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import appTheme from '../../utils/appTheme';
import MI from 'react-native-vector-icons/MaterialCommunityIcons';
import navigationStrings from '../../constants/navigationStrings';
import { useNavigation } from '@react-navigation/native';
import DashedLine from 'react-native-dashed-line';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { BlackCalendarIcon, CloseIcon, FilterIcon } from '../Svg/Svg';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker'
import { getTokenAsyncStorage } from '../../services/auth_helper';
import { Modal } from 'react-native';

const HistoryRedemption = (props: any) => {
  const { height, width } = Dimensions.get('window');
  const navigation: any = useNavigation();
  const { t } = useTranslation();
  const [redemptionData, setRedemptionData] = useState([]);
  const [balancePoint, setBalancePoint] = useState(0);
  const [redeemPoint, setRedeemPoint] = useState(0);
  const [filterData, setFilterData] = useState(false);
  const [selectedDateFrom, setSelectedDateFrom] = useState<any>();
  const [selectedDateFrom1, setSelectedDateFrom1] = useState<any>();
  const [show, setShow] = useState(false)
  const [selectedDateTo, setSelectedDateTo] = useState<any>();
  const [selectedDateTo1, setSelectedDateTo1] = useState<any>();
  const [date, setDate] = useState(new Date())
  const [date1, setDate1] = useState(new Date())
  const [mode, setMode] = useState<any>('date')
  const [itemDetailVisible, setItemDetailVisible] = useState<any>(false)
  const [selectedItem, setSelectedItem] = useState<any>()

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
          setBalancePoint(res.data.balance);
          setRedeemPoint(res.data.redeempoint);
        }
      })
      .catch(error => {
        console.log('Response: ', error);
      });
  };


  const fetchRedemptions = async () => {
    await requestGetAllRedemptions()
      .then(res => {
        if (res.isError == false) {
          setRedemptionData(res.data);
          console.log("******", res.data)
        }
      })
      .catch(error => {
        console.log('Response Redemptions: ', error);
      });
  };
  useEffect(() => {
    fetchRedemptions();
    fetchCustomerBalancePoint();
  }, []);

  const _renderItem = (props: any) => {
    const { item } = props;
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignContent: 'center',
          alignSelf: 'baseline',
          width: width * 0.9,
          // height: 50,
          paddingBottom: 15
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
          {(() => {
            switch (item.status) {
              case '0':
                return <MI name="bank" size={24} color="#91C483" />;
              case 'Sent 0 approval':
                return <FontAwesome name="send-o" size={24} color="#f09d0b" />;
              case '0':
                return <FontAwesome name="remove" size={24} color="#FF6464" />;
              case '0':
                return (
                  <FontAwesome
                    name="check-square-o"
                    size={24}
                    color="#91C483"
                  />
                );
              // case 'Success':
              //   return <MI name="bank" size={24} color="#91C483" />;
              // case 'Sent for approval':
              //   return <FontAwesome name="send-o" size={24} color="#f09d0b" />;
              // case 'Rejected':
              //   return <FontAwesome name="remove" size={24} color="#FF6464" />;
              // case 'Approved':
              //   return <FontAwesome name="check-square-o" size={24} color="#91C483" />;
              default:
                return <Icon name="inbox" size={24} color="white" />;
            }
          })()}
        </View>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            marginHorizontal: responsiveWidth(1.5),
            justifyContent: 'space-between',
          }}>
          <View>
            {(() => {
              switch (item.status) {
                case 'Success':
                  return (
                    <Text
                      style={{
                        width: '100%',
                        flexWrap: 'wrap',
                        fontWeight: '400',
                        fontSize: responsiveFontSize(2),
                        color: '#91C483',
                      }}>
                      {`${t('sucessredemption')}`}
                    </Text>
                  );
                case 'Sent for approval':
                  return (
                    <Text
                      style={{
                        width: '100%',
                        flexWrap: 'wrap',
                        fontWeight: '400',
                        fontSize: responsiveFontSize(2),
                        color: '#f09d0b',
                      }}>
                      {`${t('sentforapproval')}`}
                    </Text>
                  );
                case 'Pending':
                  return (
                    <Text
                      style={{
                        width: '100%',
                        flexWrap: 'wrap',
                        fontWeight: '400',
                        fontSize: responsiveFontSize(2),
                        color: '#f09d0b',
                      }}>
                      {`Pending`}
                    </Text>
                  );
                case 'Rejected':
                  return (
                    <Text
                      style={{
                        width: '100%',
                        flexWrap: 'wrap',
                        fontWeight: '400',
                        fontSize: responsiveFontSize(2),
                        color: '#FF6464',
                      }}>
                      {`${t('rejected')}`}
                    </Text>
                  );
                case 'Approved':
                  return (
                    <Text
                      style={{
                        width: '100%',
                        flexWrap: 'wrap',
                        fontWeight: '400',
                        fontSize: responsiveFontSize(2),
                        color: '#91C483',
                      }}>
                      {`${t('approved')}`}
                    </Text>
                  );
                case 'UNDER PROCESS':
                  return (
                    <Text
                      style={{
                        width: '100%',
                        flexWrap: 'wrap',
                        fontWeight: '400',
                        fontSize: responsiveFontSize(2),
                        color: '#91C483',
                      }}>
                      {`${t('under_proccess')}`}
                    </Text>
                  );

                default:
                  return null;
              }
            })()}
            {/* <Text style={{fontWeight: '400', fontSize: 17}}>{item.status}</Text> */}
            <View style={{ flexDirection: 'row', width: width * 0.85, }}>
              <Text
                style={{
                  fontSize: 13,
                  color: colors.grey,
                }}>
                {`${t('UTR_number')}: ${item.refno}`}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => { setSelectedItem(item), setItemDetailVisible(true) }}
              style={{
                backgroundColor: appTheme.NEW_PALLET,
                width: '22%',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 20,
                marginTop: 4,
                paddingVertical: 2,
              }}>
              <Text style={{
                fontSize: 12,
                color: '#FFFFFF'
              }}>View</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            <Text
              style={{
                fontSize: 17,
                top: 2,
                fontWeight: '500',
                color: appTheme.NEW_PALLET,
                marginHorizontal: responsiveWidth(2),
              }}>
              {item.points}
            </Text>
            <Image style={{ width: 17, height: 17 }} source={imagePath.RUPEE} />
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 13, color: colors.grey }}>
              {new Date(item.createdAt).toLocaleDateString().slice(0, 10)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

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
  const onChange4 = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate1(currentDate);
    let tempDate = new Date(currentDate);
    let formattedDate = tempDate.getFullYear() + '-' + ('0' + (tempDate.getMonth() + 1)).slice(-2) + '-' + ('0' + tempDate.getDate()).slice(-2);
    if (selectedDateFrom1 === 'From') {
      setSelectedDateFrom1(formattedDate);

    } else if (selectedDateTo1 === 'To') {
      setSelectedDateTo1(formattedDate);
    }
  };

  const FilterSubmit = async () => {
    const token = await getTokenAsyncStorage();
    const filterData = {
      token: token,
      startDate: Platform.OS == "ios" ? selectedDateFrom1 : selectedDateFrom,
      endDate: Platform.OS == "ios" ? selectedDateTo1 : selectedDateTo
    }
    if (selectedDateFrom && selectedDateTo) {
      await requestFilterRedemption(filterData)
        .then(res => {
          if (res.isError == false) {
            setRedemptionData(res.data);
          }
        })
        .catch(error => {
          console.log('Response Transactions: ', error);
        });
    }
  }

  const formatDate = (dateString: any) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB").replace(/\//g, "-");
  };
  const itemDetails = [
    { label: `${t('Status')}`, value: selectedItem?.status },
    { label: `${t('Mode')}`, value: selectedItem?.type },
    { label: `${t('Bank_name')}`, value: selectedItem?.payment?.bankName },
    { label: `${t('Account_number')}`, value: selectedItem?.payment?.accountNo },
    { label: `${t('IFSC_Code')}`, value: selectedItem?.payment?.ifsc },
    { label: `${t('points')}`, value: selectedItem?.points },
    { label: `${t('UTR_number')}`, value: selectedItem?.refno },
    {
      label: `${t('Date')}`,
      value: formatDate(selectedItem?.statusUpdatedAt || selectedItem?.createdAt)
    },
  ];

  return (
    <View style={styles.safeAreaView}>
      {/* <View> */}
      <HeaderRNE
        backgroundColor="white"
        backgroundImageStyle={{}}
        barStyle="dark-content"
        centerComponent={{
          text: `${t('redemptionhistory')}`,
          style: { color: 'black', fontSize: 19 },
        }}
        centerContainerStyle={{ height: 28, justifyContent: 'center' }}
        leftComponent={
          <TouchableOpacity
            containerStyle={{ padding: 5 }}
            onPress={() => props.navigation.goBack()}>
            <Ionicons name="chevron-back" size={25} color={'black'} />
          </TouchableOpacity>
        }
        leftContainerStyle={{ paddingLeft: 5 }}
        linearGradientProps={{}}
        placement="center"
        rightContainerStyle={{}}
        statusBarProps={{}}
        containerStyle={{
          bottom: Platform.OS === "android"
            ? Platform.OS === "android" && Platform.Version <= 34
              ? 0
              : height * 0.04
            : 0
        }}
      />
      <ScrollView >
        <View>
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
                    {`${t('redeemed')}`}
                  </Text>

                  <Text style={{ fontWeight: '700', fontSize: 32, color: 'white' }}>
                    {redeemPoint}
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
                      style={{ fontWeight: '700', fontSize: 20, color: 'white' }}>
                      {`${t('balance')}`}
                    </Text>
                  </View>

                  <Text style={{ fontWeight: '700', fontSize: 32, color: 'white' }}>
                    {balancePoint}
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
                  title={`${t('addredemption')}`}
                  titleStyle={{ color: 'black', padding: 10 }}
                  icon={<Icon name="plus" color={'black'} size={20} />}
                  iconPosition={'right'}
                  iconContainerStyle={{ margin: 2 }}
                  buttonStyle={{ backgroundColor: 'white' }}
                  containerStyle={{ borderRadius: 24 }}
                  onPress={() => {
                    navigation.push(navigationStrings.REDEMPTIONFINAL);
                  }}
                />
              </View>
            </View>
          </Card>
        </View>
        <View style={{ paddingVertical: 10 }}>
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
          {`${t('redemptionhistory')}`}
        </Text>
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
        </TouchableOpacity>
        {
          filterData && (
            <View style={styles.filterTouchView}>
              <Text style={styles.daterangeText}>Date Range</Text>
              <View style={styles.monthContainer}>
                {
                  Platform.OS == 'android' ? (
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
                  ) : (
                    <>
                      <View style={{ width: '49%' }}>
                        <TouchableOpacity style={[styles.dateContainer, { paddingRight: 8 }]} onPress={() => {
                          setSelectedDateFrom('From');
                          setShow(true)
                        }}>
                          {
                            selectedDateFrom1 ? (
                              <Text style={[styles.dateText2, { opacity: selectedDateFrom1 == undefined ? 0.7 : 1 }]}>{selectedDateFrom1 == undefined ? 'From' : selectedDateFrom1}</Text>
                            ) : (
                              <DateTimePicker
                                testID='dateTimePicker'
                                value={date}
                                mode={mode}
                                style={{ backgroundColor: 'transparent' }}
                                is24Hour={true}
                                display='default'
                                onChange={(event, selectedDate) => onChange3(event, selectedDate)}

                              />
                            )
                          }

                          <BlackCalendarIcon />
                        </TouchableOpacity>
                      </View>
                      <View style={{ width: '49%' }}>
                        <TouchableOpacity style={[styles.dateContainer, { paddingHorizontal: 10 }]} onPress={() => {
                          setShow(true)
                          setSelectedDateTo('To')
                        }}>
                          {
                            selectedDateTo1 ? (
                              <Text style={[styles.dateText2, { opacity: selectedDateTo1 == undefined ? 0.7 : 1 }]}>{selectedDateTo1 == undefined ? 'To' : selectedDateTo1}</Text>
                            ) : (
                              <DateTimePicker
                                testID='dateTimePicker'
                                value={date1}
                                mode={mode}
                                is24Hour={true}
                                display='default'
                                onChange={(event, selectedDate) => onChange4(event, selectedDate)}

                              />
                            )
                          }


                          <BlackCalendarIcon />
                        </TouchableOpacity>
                      </View>
                    </>
                  )
                }

              </View>

              <LinearGradient colors={['orange', 'orange']}
                style={[styles.submitButton]}>
                <TouchableOpacity style={[]}
                  onPress={() => {
                    FilterSubmit()
                    setFilterData(false)
                  }}>
                  <Text style={styles.text}>{'Submit'}</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          )
        }
        <View>
          <View
            style={{
              marginHorizontal: responsiveWidth(3),
              padding: 6,
              overflow: 'hidden',
            }}>
            <FlatList
              data={redemptionData}
              renderItem={_renderItem}
              contentContainerStyle={{ paddingBottom: 100 }}
            />
          </View>
        </View>
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
      </ScrollView>





      <Modal animationType="slide" transparent={true} visible={itemDetailVisible}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              onPress={() => { setSelectedItem(null), setItemDetailVisible(false) }}
              style={{
                position: 'absolute', top: 5, right: 5,
                backgroundColor: appTheme.NEW_PALLET,
                padding: 1,
                borderRadius: 30
              }}>
              <CloseIcon />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{`${t('Payment_Detail')}`}</Text>
            <View style={styles.separator} />

            {itemDetails.map(
              (item, index) =>
                item.value && (
                  <View style={[styles.itemRow, { flexDirection: 'row', alignItems: 'center' }]}>
                    <Text style={[styles.itemText, {
                      width: width * 0.26,
                    }]}>
                      {item.label}:
                    </Text>
                    <Text style={[styles.valueText, { width: '66%' }]}>{item.label == 'Status' ?
                      item.value.toUpperCase() : item.value}</Text>
                  </View>
                )
            )}
          </View>
        </View>
      </Modal>

    </View>
  );
};
export default HistoryRedemption;
