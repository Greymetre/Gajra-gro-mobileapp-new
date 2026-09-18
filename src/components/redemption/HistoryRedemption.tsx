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
  ScrollView,
  Pressable,
  StyleSheet,
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
import ShineOverlay from '../comman/ShineOverlay';
import { TAB_BAR_SPACE } from '../../navigation/CustomTabBar';

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
    // Both platforms now store the picked dates in selectedDateFrom/To;
    // 'From'/'To' are placeholders set while the Android picker is open.
    const isDate = (v: any) => v && v !== 'From' && v !== 'To';
    const filterData = {
      token: token,
      startDate: selectedDateFrom,
      endDate: selectedDateTo
    }
    if (isDate(selectedDateFrom) && isDate(selectedDateTo)) {
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

  const toApiDate = (d: Date) =>
    d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);

  const prettyDate = (value: any) => {
    const d = new Date(value);
    return isNaN(d.getTime())
      ? ''
      : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const statusInfo = (status: string) => {
    switch (status) {
      case 'Success':
        return { label: `${t('sucessredemption')}`, bg: '#E4F6EC', fg: '#1E9E5A', icon: 'checkmark-circle' };
      case 'Approved':
        return { label: `${t('approved')}`, bg: '#E4F6EC', fg: '#1E9E5A', icon: 'checkmark-done' };
      case 'Rejected':
        return { label: `${t('rejected')}`, bg: '#FDECEA', fg: '#D93025', icon: 'close-circle' };
      case 'Sent for approval':
        return { label: `${t('sentforapproval')}`, bg: '#FFF1D2', fg: '#B7791F', icon: 'paper-plane' };
      case 'UNDER PROCESS':
        return { label: `${t('under_proccess')}`, bg: '#E8F0FF', fg: '#2F6FED', icon: 'sync' };
      case 'Pending':
      default:
        return { label: status || 'Pending', bg: '#FFF1D2', fg: '#B7791F', icon: 'time' };
    }
  };

  const renderDateButton = (which: 'from' | 'to') => {
    const value = which === 'from' ? selectedDateFrom : selectedDateTo;
    const hasValue = value && value !== 'From' && value !== 'To';
    if (Platform.OS === 'ios') {
      return (
        <View style={rStyles.dateBox}>
          <Text style={rStyles.dateLabel}>{which === 'from' ? 'From' : 'To'}</Text>
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
        style={rStyles.dateBox}
        onPress={() => {
          which === 'from' ? setSelectedDateFrom('From') : setSelectedDateTo('To');
          setShow(true);
        }}>
        <Text style={rStyles.dateLabel}>{which === 'from' ? 'From' : 'To'}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[rStyles.dateValue, !hasValue && { color: '#A0A0A0' }]}>
            {hasValue ? value : 'Select'}
          </Text>
          <Ionicons name="calendar-outline" size={16} color="#6B6B6B" style={{ marginLeft: 6 }} />
        </View>
      </Pressable>
    );
  };

  const list = Array.isArray(redemptionData) ? redemptionData : [];

  return (
    // White behind the status bar so it blends with the header; the page itself is grey.
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={rStyles.header}>
        <Pressable
          onPress={() => props.navigation.goBack()}
          hitSlop={6}
          style={({ pressed }) => [rStyles.headerButton, pressed && { opacity: 0.6 }]}>
          <Ionicons name="chevron-back" size={22} color={appTheme.DARK_BOTTOMTAB} />
        </Pressable>
        <Text style={rStyles.headerTitle}>{`${t('redemptionhistory')}`}</Text>
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
          style={rStyles.summary}>
          <View style={rStyles.summaryDecor} />
          <ShineOverlay />
          <Text style={rStyles.summaryLabel}>{`${t('balance')}`}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Ionicons name="wallet" size={22} color={appTheme.NEW_PALLET} />
            <Text style={rStyles.summaryValue}>{balancePoint}</Text>
            <Text style={rStyles.summaryUnit}>pts</Text>
          </View>
          <View style={rStyles.statsRow}>
            <View style={rStyles.stat}>
              <Text style={rStyles.statLabel}>{`${t('redeemed')}`}</Text>
              <Text style={rStyles.statValue}>{redeemPoint || 0}</Text>
            </View>
            <View style={rStyles.statDivider} />
            <View style={rStyles.stat}>
              <Text style={rStyles.statLabel}>Requests</Text>
              <Text style={rStyles.statValue}>{list.length}</Text>
            </View>
          </View>
          <Pressable
            onPress={() => navigation.push(navigationStrings.REDEMPTIONFINAL)}
            style={({ pressed }) => [rStyles.primaryButton, pressed && { opacity: 0.85 }]}>
            <Ionicons name="add-circle" size={20} color={appTheme.DARK_BOTTOMTAB} />
            <Text style={rStyles.primaryButtonText}>{`${t('addredemption')}`}</Text>
          </Pressable>
        </LinearGradient>

        {/* Section + filter */}
        <View style={rStyles.toolbar}>
          <Text style={rStyles.sectionTitle}>{`${t('redemptionhistory')}`}</Text>
          <Pressable
            onPress={() => setFilterData(!filterData)}
            style={[rStyles.filterButton, filterData && rStyles.filterButtonActive]}>
            <Ionicons
              name={filterData ? 'close' : 'options-outline'}
              size={18}
              color={filterData ? 'white' : appTheme.DARK_BOTTOMTAB}
            />
            <Text style={[rStyles.filterText, filterData && { color: 'white' }]}>
              {filterData ? 'Close' : 'Filter'}
            </Text>
          </Pressable>
        </View>

        {filterData && (
          <View style={rStyles.filterCard}>
            <Text style={rStyles.filterTitle}>Date Range</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {renderDateButton('from')}
              {renderDateButton('to')}
            </View>
            <Pressable
              style={({ pressed }) => [rStyles.applyButton, pressed && { opacity: 0.85 }]}
              onPress={() => {
                FilterSubmit();
                setFilterData(false);
              }}>
              <Text style={rStyles.applyText}>Apply Filter</Text>
            </Pressable>
          </View>
        )}

        {/* List */}
        {list.length ? (
          list.map((item: any, index: number) => {
            const st = statusInfo(item.status);
            return (
              <Pressable
                key={item?._id ?? index}
                onPress={() => {
                  setSelectedItem(item);
                  setItemDetailVisible(true);
                }}
                style={({ pressed }) => [rStyles.itemCard, pressed && { opacity: 0.85 }]}>
                <View style={[rStyles.itemIcon, { backgroundColor: st.bg }]}>
                  <Ionicons name={st.icon} size={20} color={st.fg} />
                </View>
                <View style={{ flex: 1, marginHorizontal: 12 }}>
                  <View style={[rStyles.statusPill, { backgroundColor: st.bg }]}>
                    <Text style={[rStyles.statusText, { color: st.fg }]}>{st.label}</Text>
                  </View>
                  <Text style={rStyles.itemMeta} numberOfLines={1}>
                    {item?.type ? `${item.type}  •  ` : ''}
                    {prettyDate(item.createdAt)}
                  </Text>
                  {item?.refno ? (
                    <Text style={rStyles.itemMeta} numberOfLines={1}>
                      {`${t('UTR_number')}: ${item.refno}`}
                    </Text>
                  ) : null}
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <View style={rStyles.pointsRow}>
                    <Text style={rStyles.pointsText}>{item.points}</Text>
                    <Image style={{ width: 16, height: 16, marginLeft: 4 }} source={imagePath.RUPEE} />
                  </View>
                  <Text style={rStyles.viewLink}>View ›</Text>
                </View>
              </Pressable>
            );
          })
        ) : (
          <View style={rStyles.empty}>
            <Ionicons name="gift-outline" size={36} color="#C9C9C9" />
            <Text style={rStyles.emptyText}>No redemptions yet</Text>
            <Text style={rStyles.emptySub}>Redeem your points to see them here</Text>
          </View>
        )}
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

      {/* Payment details sheet */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={itemDetailVisible}
        onRequestClose={() => setItemDetailVisible(false)}>
        <Pressable
          style={rStyles.sheetBackdrop}
          onPress={() => {
            setSelectedItem(null);
            setItemDetailVisible(false);
          }}>
          <Pressable style={rStyles.sheet} onPress={() => {}}>
            <View style={rStyles.sheetHandle} />
            <View style={rStyles.sheetHeader}>
              <Text style={rStyles.sheetTitle}>{`${t('Payment_Detail')}`}</Text>
              {selectedItem ? (
                <View style={[rStyles.statusPill, { backgroundColor: statusInfo(selectedItem.status).bg }]}>
                  <Text style={[rStyles.statusText, { color: statusInfo(selectedItem.status).fg }]}>
                    {statusInfo(selectedItem.status).label}
                  </Text>
                </View>
              ) : null}
            </View>
            {itemDetails
              .filter(d => d.value && d.label !== `${t('Status')}`)
              .map((d, index) => (
                <View key={index} style={rStyles.detailRow}>
                  <Text style={rStyles.detailLabel}>{d.label}</Text>
                  <Text style={rStyles.detailValue} selectable>
                    {d.value}
                  </Text>
                </View>
              ))}
            <Pressable
              style={[rStyles.applyButton, { marginTop: 18 }]}
              onPress={() => {
                setSelectedItem(null);
                setItemDetailVisible(false);
              }}>
              <Text style={rStyles.applyText}>Close</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const rStyles = StyleSheet.create({
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
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    backgroundColor: appTheme.NEW_PALLET,
    borderRadius: 14,
    paddingVertical: 12,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: appTheme.DARK_BOTTOMTAB,
    marginLeft: 8,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 22,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1C',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E6E6E6',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterButtonActive: {
    backgroundColor: appTheme.DARK_BOTTOMTAB,
    borderColor: appTheme.DARK_BOTTOMTAB,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: appTheme.DARK_BOTTOMTAB,
    marginLeft: 6,
  },
  filterCard: {
    marginHorizontal: 16,
    marginTop: 10,
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
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPill: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  itemMeta: {
    fontSize: 12,
    color: '#8A8A8A',
    marginTop: 4,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1C1C1C',
  },
  viewLink: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B7791F',
    marginTop: 8,
  },
  empty: {
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: 'white',
    borderRadius: 18,
    paddingVertical: 34,
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
  sheetBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 34,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DDDDDD',
    marginBottom: 14,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1C',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 11,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E6E6E6',
  },
  detailLabel: {
    fontSize: 13,
    color: '#8A8A8A',
  },
  detailValue: {
    flex: 1,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1C',
    marginLeft: 12,
  },
});

export default HistoryRedemption;
