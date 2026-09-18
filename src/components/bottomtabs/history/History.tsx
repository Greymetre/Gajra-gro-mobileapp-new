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
  Pressable,
  StyleSheet,
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
import ShineOverlay from '../../comman/ShineOverlay';
import { TAB_BAR_SPACE } from '../../../navigation/CustomTabBar';

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

  const [activeTab, setActiveTab] = useState<'points' | 'damage'>('points');
  // Rejected damage entries have never been listed here; keep that behaviour.
  const visibleDamage = (Array.isArray(damageData) ? damageData : []).filter(
    (item: any) => item?.statusType != 'Rejected',
  );

  const formatDate = (value: any) => {
    const d = new Date(value);
    return isNaN(d.getTime())
      ? ''
      : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const toApiDate = (d: Date) =>
    d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);

  const statusColors = (statusType: string) => {
    switch (statusType) {
      case 'Approved':
        return { bg: '#E4F6EC', fg: '#1E9E5A' };
      case 'Rejected':
        return { bg: '#FDECEA', fg: '#D93025' };
      default:
        return { bg: '#FFF1D2', fg: '#B7791F' };
    }
  };

  const renderTransaction = (item: any, index: number) => (
    <View key={item?._id ?? index} style={hStyles.row}>
      <View style={[hStyles.rowIcon, { backgroundColor: '#E4F6EC' }]}>
        <Ionicons name="arrow-down" size={18} color="#1E9E5A" />
      </View>
      <View style={{ flex: 1, marginHorizontal: 12 }}>
        <Text style={hStyles.rowTitle} numberOfLines={1}>
          {item.pointType}
        </Text>
        <Text style={hStyles.rowMeta} numberOfLines={1}>
          {formatDate(item.createdAt)}
          {item?.coupon ? `  •  ${item.coupon}` : ''}
        </Text>
      </View>
      <View style={hStyles.pointsPill}>
        <Text style={hStyles.pointsText}>+{item.points}</Text>
        <Image style={{ width: 16, height: 16, marginLeft: 4 }} source={imagePath.RUPEE} />
      </View>
    </View>
  );

  const renderDamage = (item: any, index: number) => {
    const c = statusColors(item?.statusType);
    return (
      <Pressable
        key={item?._id ?? index}
        style={hStyles.row}
        onPress={() => {
          if (item?.statusType == 'Rejected') {
            setItemSelect(item);
            actionSheetRef.current?.show();
          }
        }}>
        <View style={[hStyles.rowIcon, { backgroundColor: '#FDECEA' }]}>
          <Ionicons name="warning-outline" size={18} color="#D93025" />
        </View>
        <View style={{ flex: 1, marginHorizontal: 12 }}>
          <Text style={hStyles.rowTitle}>Damage entry</Text>
          <Text style={hStyles.rowMeta} numberOfLines={1}>
            {formatDate(item.createdAt)}
            {item?.couponCode ? `  •  ${item.couponCode}` : ''}
          </Text>
        </View>
        <View style={[hStyles.statusPill, { backgroundColor: c.bg }]}>
          <Text style={[hStyles.statusText, { color: c.fg }]}>{item?.statusType}</Text>
        </View>
      </Pressable>
    );
  };

  const renderDateButton = (which: 'from' | 'to') => {
    const value = which === 'from' ? selectedDateFrom : selectedDateTo;
    const hasValue = value && value !== 'From' && value !== 'To';
    if (Platform.OS === 'ios') {
      // iOS shows its own compact picker inline.
      return (
        <View style={hStyles.dateBox}>
          <Text style={hStyles.dateLabel}>{which === 'from' ? 'From' : 'To'}</Text>
          <DateTimePicker
            value={hasValue ? new Date(value) : new Date()}
            mode="date"
            display="compact"
            maximumDate={new Date()}
            onChange={(event: any, selected?: Date) => {
              if (!selected) {
                return;
              }
              which === 'from'
                ? setSelectedDateFrom(toApiDate(selected))
                : setSelectedDateTo(toApiDate(selected));
            }}
          />
        </View>
      );
    }
    return (
      <Pressable
        style={hStyles.dateBox}
        onPress={() => {
          which === 'from' ? setSelectedDateFrom('From') : setSelectedDateTo('To');
          setShow(true);
        }}>
        <Text style={hStyles.dateLabel}>{which === 'from' ? 'From' : 'To'}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[hStyles.dateValue, !hasValue && { color: '#A0A0A0' }]}>
            {hasValue ? value : 'Select'}
          </Text>
          <Ionicons name="calendar-outline" size={16} color="#6B6B6B" style={{ marginLeft: 6 }} />
        </View>
      </Pressable>
    );
  };

  return (
    // White behind the status bar so it blends with the header; the page itself is grey.
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={hStyles.header}>
        <Pressable
          onPress={() => props.navigation.goBack()}
          hitSlop={6}
          style={({ pressed }) => [hStyles.headerButton, pressed && { opacity: 0.6 }]}>
          <Ionicons name="chevron-back" size={22} color={appTheme.DARK_BOTTOMTAB} />
        </Pressable>
        <Text style={hStyles.headerTitle}>{`${t('transaction')}`}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={{ backgroundColor: '#F7F7F7' }}
        contentContainerStyle={{ paddingBottom: TAB_BAR_SPACE }}
        showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <LinearGradient
          colors={['#2B2829', appTheme.DARK_BOTTOMTAB, '#4A4344']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={hStyles.summary}>
          <View style={hStyles.summaryDecor} />
          <ShineOverlay />
          <Text style={hStyles.summaryLabel}>{`${t('balance')}`}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Ionicons name="star" size={22} color={appTheme.NEW_PALLET} />
            <Text style={hStyles.summaryValue}>{balancePoint}</Text>
            <Text style={hStyles.summaryUnit}>pts</Text>
          </View>
          <View style={hStyles.statsRow}>
            <View style={hStyles.stat}>
              <Text style={hStyles.statLabel}>{`${t('totalearned')}`}</Text>
              <Text style={hStyles.statValue}>{balancePoint + RedeemPoints}</Text>
            </View>
            <View style={hStyles.statDivider} />
            <View style={hStyles.stat}>
              <Text style={hStyles.statLabel}>Redeemed</Text>
              <Text style={hStyles.statValue}>{RedeemPoints || 0}</Text>
            </View>
          </View>
          <Pressable
            onPress={() => navigation.navigate(navigationStrings.COUPON_SCAN)}
            style={({ pressed }) => [hStyles.scanButton, pressed && { opacity: 0.85 }]}>
            <MI name="qr-code-scanner" color={appTheme.DARK_BOTTOMTAB} size={20} />
            <Text style={hStyles.scanButtonText}>{`${t('couponscan')}`}</Text>
          </Pressable>
        </LinearGradient>

        {/* Tabs + filter */}
        <View style={hStyles.toolbar}>
          <View style={hStyles.segment}>
            {(['points', 'damage'] as const).map(tab => (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[hStyles.segmentItem, activeTab === tab && hStyles.segmentItemActive]}>
                <Text style={[hStyles.segmentText, activeTab === tab && hStyles.segmentTextActive]}>
                  {tab === 'points' ? `${t('history')}` : 'Damage Reports'}
                </Text>
              </Pressable>
            ))}
          </View>
          <Pressable
            onPress={() => setFilterData(!filterData)}
            style={[hStyles.filterButton, filterData && hStyles.filterButtonActive]}>
            <Ionicons
              name={filterData ? 'close' : 'options-outline'}
              size={18}
              color={filterData ? 'white' : appTheme.DARK_BOTTOMTAB}
            />
          </Pressable>
        </View>

        {filterData && (
          <View style={hStyles.filterCard}>
            <Text style={hStyles.filterTitle}>Date Range</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {renderDateButton('from')}
              {renderDateButton('to')}
            </View>
            <Pressable
              style={({ pressed }) => [hStyles.applyButton, pressed && { opacity: 0.85 }]}
              onPress={() => {
                FilterSubmit();
                DamageEntry();
                setFilterData(false);
              }}>
              <Text style={hStyles.applyText}>Apply Filter</Text>
            </Pressable>
          </View>
        )}

        {/* List */}
        <View style={hStyles.listCard}>
          {activeTab === 'points' ? (
            Array.isArray(transactionData) && transactionData.length ? (
              transactionData.map((item: any, index: number) => (
                <View key={item?._id ?? index}>
                  {index > 0 ? <View style={hStyles.divider} /> : null}
                  {renderTransaction(item, index)}
                </View>
              ))
            ) : (
              <View style={hStyles.empty}>
                <Ionicons name="receipt-outline" size={34} color="#C9C9C9" />
                <Text style={hStyles.emptyText}>No transactions yet</Text>
                <Text style={hStyles.emptySub}>Scan a QR code to start earning points</Text>
              </View>
            )
          ) : visibleDamage.length ? (
            visibleDamage.map((item: any, index: number) => (
              <View key={item?._id ?? index}>
                {index > 0 ? <View style={hStyles.divider} /> : null}
                {renderDamage(item, index)}
              </View>
            ))
          ) : (
            <View style={hStyles.empty}>
              <Ionicons name="shield-checkmark-outline" size={34} color="#C9C9C9" />
              <Text style={hStyles.emptyText}>No damage reports</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {Platform.OS == 'android' && show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={(event, selectedDate) => onChange3(event, selectedDate)}
        />
      )}

      <ActionSheet ref={actionSheetRef} containerStyle={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
        <View style={{ padding: 20 }}>
          <Text style={hStyles.sheetTitle}>Damage coupon details</Text>
          <View style={hStyles.sheetRow}>
            <Text style={hStyles.sheetLabel}>Coupon code</Text>
            <Text style={hStyles.sheetValue}>{itemSelect?.couponCode || '-'}</Text>
          </View>
          <View style={hStyles.sheetRow}>
            <Text style={hStyles.sheetLabel}>Remark</Text>
            <Text style={hStyles.sheetValue}>{itemSelect?.remark || '-'}</Text>
          </View>
          <Pressable
            style={[hStyles.applyButton, { marginTop: 18 }]}
            onPress={() => actionSheetRef.current?.hide()}>
            <Text style={hStyles.applyText}>OK</Text>
          </Pressable>
        </View>
      </ActionSheet>
    </View>
  );
};

const hStyles = StyleSheet.create({
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
  summary: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 22,
    padding: 20,
    overflow: 'hidden',
  },
  summaryDecor: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    right: -70,
    top: -90,
    backgroundColor: 'rgba(247,209,133,0.12)',
  },
  summaryLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 38,
    fontWeight: '800',
    color: 'white',
    marginLeft: 8,
  },
  summaryUnit: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginLeft: 6,
    marginTop: 12,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    paddingVertical: 12,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  statLabel: {
    fontSize: 11.5,
    color: 'rgba(255,255,255,0.65)',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: appTheme.NEW_PALLET,
    marginTop: 2,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    backgroundColor: appTheme.NEW_PALLET,
    borderRadius: 14,
    paddingVertical: 12,
  },
  scanButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: appTheme.DARK_BOTTOMTAB,
    marginLeft: 8,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 20,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#ECECEC',
    borderRadius: 14,
    padding: 4,
  },
  segmentItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 9,
    borderRadius: 11,
  },
  segmentItemActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8A8A8A',
  },
  segmentTextActive: {
    color: '#1C1C1C',
    fontWeight: '700',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#E6E6E6',
  },
  filterButtonActive: {
    backgroundColor: appTheme.DARK_BOTTOMTAB,
    borderColor: appTheme.DARK_BOTTOMTAB,
  },
  filterCard: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 14,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1C1C',
    marginBottom: 10,
  },
  dateBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.12)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'flex-start',
  },
  dateLabel: {
    fontSize: 11,
    color: '#8A8A8A',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1C',
  },
  applyButton: {
    marginTop: 14,
    height: 46,
    borderRadius: 14,
    backgroundColor: appTheme.NEW_PALLET,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyText: {
    fontSize: 15,
    fontWeight: '700',
    color: appTheme.DARK_BOTTOMTAB,
  },
  listCard: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: 'white',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#1C1C1C',
  },
  rowMeta: {
    fontSize: 12,
    color: '#8A8A8A',
    marginTop: 3,
  },
  pointsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E4F6EC',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  pointsText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E9E5A',
  },
  statusPill: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E6E6E6',
    marginLeft: 52,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B6B6B',
    marginTop: 8,
  },
  emptySub: {
    fontSize: 12,
    color: '#9A9A9A',
    marginTop: 2,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1C',
    marginBottom: 12,
  },
  sheetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E6E6E6',
  },
  sheetLabel: {
    fontSize: 13,
    color: '#8A8A8A',
  },
  sheetValue: {
    flex: 1,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1C',
    marginLeft: 12,
  },
});

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