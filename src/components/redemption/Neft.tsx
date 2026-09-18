import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  ActivityIndicator,
  StyleSheet,
  Linking,
  Platform,
  Dimensions,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import navigationStrings from '../../constants/navigationStrings';
import { useNavigation } from '@react-navigation/native';

import * as Yup from 'yup';
import { useFormik } from 'formik';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  postupdatebankinfo,
  requestGetCustomerBankInfo,
  requestNeftRedemption,
} from '../../services/backend_helper';
import { NeftRedemptionInterface } from '../../interfaces/redemption.interface';
import { NavigationInterFace } from '../../interfaces/navigationType.interface';
import { Button, Header, Input } from '@rneui/themed';
import appTheme from '../../utils/appTheme';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import ModalLoader from '../loader/ModalLoader';
import { Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import ShineOverlay from '../comman/ShineOverlay';

const Neft = (props: any) => {
  const safeInsets = useSafeAreaInsets();
  const { height, width } = Dimensions.get('window');
  const { t } = useTranslation();

  const navigation = useNavigation<NavigationInterFace>();
  const [pts, setPts] = useState('');
  const [approved, setapproved] = useState(true);
  const [acVerified, setAcVerified] = useState(false);
  const [disableinput, setdisableinput] = useState(false);
  const [showSendApproval, setShowSendApproval] = useState(false);
  const [disableSubmitBtn, setDisableSubmitBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);


  const initialValues = {
    accountNo: '',
    ifsc: '',
    holderName: '',
    bankName: '',
  };
  const validationSchema = Yup.object({
    accountNo: Yup.string()
      .required(`${t('requirederror', { fieldname: `${t('accno')}` })}`)
      .min(
        9,
        ({ min }) =>
          `${t('lenghterrnum', {
            fieldname: `${t('accno')}`,
            len: `${min}`,
          })}`,
      )
      .matches(new RegExp(/^[0-9]{9,18}$/), `${t('invalid')} ${t('accno')}`),
    bankName: Yup.string().required(
      `${t('requirederror', { fieldname: `${t('bank')}` })}`,
    ),
    ifsc: Yup.string()
      .required(`${t('requirederror', { fieldname: `${t('ifsccode')}` })}`)
      .min(
        11,
        ({ min }) =>
          `${t('lenghterr', {
            fieldname: `${t('ifsccode')}`,
            len: `${min}`,
          })}`,
      ),
    // .max(
    //   11,
    //   ({ max }) =>
    //     `${t('lenghterr', {
    //       fieldname: `${t('ifsccode')}`,
    //       len: `${max}`,
    //     })}`,
    // ),
    holderName: Yup.string()
      .required(`${t('requirederror', { fieldname: `${t('acholdername')}` })}`)
      .min(
        3,
        ({ min }) =>
          `${t('lenghterr', {
            fieldname: `${t('acholdername')}`,
            len: `${min}`,
          })}`,
      ),
  });
  const updateacinfo = async () => {
    setapproved(false);
    const data = {
      accountNo: formik.values.accountNo,
      bankName: formik.values.bankName,
      holderName: formik.values.holderName,
      ifsc: formik.values.ifsc,
    };
    postupdatebankinfo(data)
      .then(res => {
        if (res.isError == false) {
          for (const [key, value] of Object.entries(res.data)) {
            if (initialValues.hasOwnProperty(key)) {
              formik.setFieldValue(key, value);
              setapproved(false);
            }
          }
        }
      })
      .catch(error => {
        console.log('Response: ', error);
      });
  };
  function handleBackButtonClick() {
    navigation.goBack();
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

  const fetchCustomerBankInfo = async () => {
    setLoading(true);
    setDisableSubmitBtn(true);
  
    try {
      const res = await requestGetCustomerBankInfo({});
      console.log("API Response:", res)
      if (res.isError === false && res.data) {
        console.log("Response Data:", res.data);
        setDisableSubmitBtn(true);
        setdisableinput(false);
        Object.entries(res.data).forEach(([key, value]) => {
          if (initialValues.hasOwnProperty(key)) {
            console.log(`Updating field: ${key} = ${value}`);
            formik.setFieldValue(key, value);
          }
        });
        setAcVerified(res.data.verified);
      } else {
        console.warn("No valid bank details found.");
        setdisableinput(true);
      }
    } catch (error) {
      console.error("Error fetching bank info:", error);
    } finally {
      setLoading(false);
      setDisableSubmitBtn(false);
    }
  };
  
  // const fetchCustomerBankInfo = async () => {
  //   setLoading(true)
  //   setDisableSubmitBtn(true)
  //   await requestGetCustomerBankInfo({})
  //     .then(res => {
  //       if (res.isError == false && res.data.accountNo) {
  //         console.log('Response Data', res.data);
  //         // set
  //         setDisableSubmitBtn(true);
  //         setdisableinput(false);

  //         for (const [key, value] of Object.entries(res.data)) {
  //           if (initialValues.hasOwnProperty(key)) {
  //             console.log(key, value)
  //             formik.setFieldValue(key, value);
  //           }
  //         }
  //         // setAcVerified(true);
  //         setAcVerified(res.data.verified);
  //       } else {
  //         setdisableinput(true);
  //         console.log('Response Data', res.data);
  //       }
  //       setLoading(false)
  //       setDisableSubmitBtn(false)
  //     })
  //     .catch(error => {
  //       console.log('Response: ', error);
  //       setLoading(false)
  //       setDisableSubmitBtn(false)
  //     });
  // };

  const sendaccountinfoforapproval = async () => {
    setdisableinput(false);
    const data = {
      accountNo: formik.values.accountNo,
      bankName: formik.values.bankName,
      holderName: formik.values.holderName,
      ifsc: formik.values.ifsc,
    };
    console.log("data", data)
    postupdatebankinfo(data)
      .then(res => {
        if (res.isError == false) {
          console.log('Account Details Send for Approval');
          console.log(res.data);

          setShowSendApproval(true);
          setDisableSubmitBtn(true);
          // for (const [key, value] of Object.entries(res.data)) {
          // if (initialValues.hasOwnProperty(key)) {
          //   formik.setFieldValue(key, value);
          //   setapproved(false);
          // }
          // }
        }
      })
      .catch(error => {
        console.log('Response: ', error);
      });
  };
  useEffect(() => {
    fetchCustomerBankInfo();
  }, []);

  const onSubmit = async (values: any) => {
    await requestNeftRedemption(values)
      .then(res => {
        if (res.isError == false) {
          // navigation.navigate(navigationStrings.REDEEMHISTORY);
        }
      })
      .catch(error => {
        console.log('Response: ', error);
      });
  };
  const formik = useFormik<NeftRedemptionInterface>({
    initialValues: initialValues,
    // onSubmit: onSubmit,
    onSubmit: (values) => {
      sendaccountinfoforapproval();
    },
    validationSchema,
    // validateOnMount: true,
    // enableReinitialize: true,
  });


  const handleCallSupport = () => {
    Linking.openURL("tel:8103324701");
  };

  const [declared, setDeclared] = useState(false);

  const spacedAccount = (formik?.values?.accountNo || '').replace(/(.{4})(?=.)/g, '$1 ');

  const goNext = () => {
    navigation.navigate(navigationStrings.Payout, {
      mode: 'IMPS',
      upiid: '',
      bank: formik.values.bankName,
      accountnum: formik.values.accountNo,
      ifsccode: formik.values.ifsc,
      holdername: formik.values.holderName,
    });
  };

  const renderDetail = (icon: string, label: string, value?: string) => (
    <View style={nStyles.detailRow}>
      <View style={nStyles.detailIcon}>
        <Ionicons name={icon} size={16} color={appTheme.DARK_BOTTOMTAB} />
      </View>
      <Text style={nStyles.detailLabel}>{label}</Text>
      <Text style={nStyles.detailValue} numberOfLines={1} selectable>
        {value || '-'}
      </Text>
    </View>
  );

  return (
    // White behind the status bar so it blends with the header; the page itself is grey.
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={nStyles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={6}
          style={({ pressed }) => [nStyles.headerButton, pressed && { opacity: 0.6 }]}>
          <Ionicons name="chevron-back" size={22} color={appTheme.DARK_BOTTOMTAB} />
        </Pressable>
        <Text style={nStyles.headerTitle}>{`${t('IMPS')} ${t('redemption')}`}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={{ backgroundColor: '#F7F7F7' }}
        // Keep the last button clear of the Android nav bar / iPhone home indicator.
        contentContainerStyle={{ paddingBottom: 40 + safeInsets.bottom }}
        showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={nStyles.loadingBox}>
            <ActivityIndicator size="large" color={appTheme.DARK_BOTTOMTAB} />
            <Text style={nStyles.loadingText}>Loading your bank details…</Text>
          </View>
        ) : acVerified ? (
          <>
            {/* Bank card */}
            <LinearGradient
              colors={['#2B2829', appTheme.DARK_BOTTOMTAB, '#4A4344']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={nStyles.bankCard}>
              <View style={nStyles.bankDecor} />
              <ShineOverlay />
              <View style={nStyles.bankTop}>
                <View style={nStyles.bankIcon}>
                  <MCI name="bank" size={20} color={appTheme.DARK_BOTTOMTAB} />
                </View>
                <Text style={nStyles.bankName} numberOfLines={1}>
                  {formik?.values?.bankName || `${t('bank')}`}
                </Text>
                <View style={nStyles.verifiedBadge}>
                  <Ionicons name="shield-checkmark" size={12} color="#1E9E5A" />
                  <Text style={nStyles.verifiedText}>{t('verified')}</Text>
                </View>
              </View>
              <Text style={nStyles.accountNumber}>{spacedAccount}</Text>
              <View style={nStyles.bankBottom}>
                <View style={{ flex: 1 }}>
                  <Text style={nStyles.bankMetaLabel}>{`${t('acholdername')}`}</Text>
                  <Text style={nStyles.bankMetaValue} numberOfLines={1}>
                    {formik?.values?.holderName}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={nStyles.bankMetaLabel}>{`${t('ifsccode')}`}</Text>
                  <Text style={nStyles.bankMetaValue}>
                    {(formik?.values?.ifsc || '').toUpperCase()}
                  </Text>
                </View>
              </View>
            </LinearGradient>

            {/* Details */}
            <View style={nStyles.card}>
              <Text style={nStyles.cardTitle}>Payout account</Text>
              {renderDetail('business-outline', `${t('bank')}`, formik?.values?.bankName)}
              {renderDetail('keypad-outline', `${t('accno')}`, formik?.values?.accountNo)}
              {renderDetail('barcode-outline', `${t('ifsccode')}`, (formik?.values?.ifsc || '').toUpperCase())}
              {renderDetail('person-outline', `${t('acholdername')}`, formik?.values?.holderName)}
              <Text style={nStyles.cardHint}>
                To change these details, update them from your Profile. Changes need re-verification.
              </Text>
            </View>

            {/* Self declaration */}
            <Pressable
              onPress={() => setDeclared(!declared)}
              style={[nStyles.declaration, declared && nStyles.declarationChecked]}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: declared }}>
              <View style={[nStyles.checkbox, declared && nStyles.checkboxChecked]}>
                {declared ? <Ionicons name="checkmark" size={16} color={appTheme.DARK_BOTTOMTAB} /> : null}
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={nStyles.declarationTitle}>Self Declaration</Text>
                <Text style={nStyles.declarationText}>
                  I hereby declare that the bank account shown above belongs to me and the details are
                  correct. I understand that my redemption amount will be transferred to this account,
                  and Gajra Gears is not responsible for any transfer made to incorrect details provided
                  by me.
                </Text>
              </View>
            </Pressable>

            <Pressable
              disabled={!declared}
              onPress={goNext}
              style={({ pressed }) => [
                nStyles.nextButton,
                !declared && nStyles.nextDisabled,
                pressed && { transform: [{ scale: 0.98 }] },
              ]}>
              <Text style={[nStyles.nextText, !declared && { color: '#9A9A9A' }]}>{`${t('next')}`}</Text>
              <Ionicons
                name="arrow-forward"
                size={18}
                color={declared ? appTheme.DARK_BOTTOMTAB : '#9A9A9A'}
                style={{ marginLeft: 6 }}
              />
            </Pressable>
            {!declared ? (
              <Text style={nStyles.nextHint}>Please accept the self declaration to continue</Text>
            ) : null}

            <View style={nStyles.secureRow}>
              <Icon name="lock" size={13} color="#6B6B6B" />
              <Text style={nStyles.secureText}>{`${t('secureinfo')}`}</Text>
            </View>
          </>
        ) : (
          <View style={nStyles.pendingCard}>
            <View style={nStyles.pendingIcon}>
              <Ionicons name="hourglass-outline" size={30} color="#B7791F" />
            </View>
            <Text style={nStyles.pendingTitle}>Verification Pending</Text>
            <Text style={nStyles.pendingText}>
              Your bank account verification is still in process. If you need assistance, please
              contact our support team.
            </Text>
            <Text style={nStyles.helpline}>📞 81033 24701</Text>
            <Pressable
              style={({ pressed }) => [nStyles.nextButton, { alignSelf: 'stretch', marginHorizontal: 0 }, pressed && { opacity: 0.85 }]}
              onPress={handleCallSupport}>
              <Ionicons name="call" size={18} color={appTheme.DARK_BOTTOMTAB} />
              <Text style={[nStyles.nextText, { marginLeft: 8 }]}>Call Support</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const nStyles = StyleSheet.create({
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
  loadingBox: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 13,
    color: '#8A8A8A',
    marginTop: 12,
  },
  bankCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 22,
    padding: 20,
    overflow: 'hidden',
  },
  bankDecor: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    right: -70,
    bottom: -100,
    backgroundColor: 'rgba(247,209,133,0.12)',
  },
  bankTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: appTheme.NEW_PALLET,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: 'white',
    marginLeft: 10,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E4F6EC',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E9E5A',
    marginLeft: 3,
  },
  accountNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 2,
    marginTop: 26,
  },
  bankBottom: {
    flexDirection: 'row',
    marginTop: 18,
  },
  bankMetaLabel: {
    fontSize: 10.5,
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bankMetaValue: {
    fontSize: 14,
    fontWeight: '600',
    color: appTheme.NEW_PALLET,
    marginTop: 3,
  },
  card: {
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1C1C',
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EDEDED',
  },
  detailIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: '#FFF1D2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailLabel: {
    fontSize: 13,
    color: '#8A8A8A',
    marginLeft: 10,
  },
  detailValue: {
    flex: 1,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1C',
    marginLeft: 12,
  },
  cardHint: {
    fontSize: 11.5,
    color: '#9A9A9A',
    marginTop: 10,
  },
  declaration: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#EDEDED',
  },
  declarationChecked: {
    borderColor: appTheme.NEW_PALLET,
    backgroundColor: '#FFFBF1',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#BDBDBD',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: appTheme.NEW_PALLET,
    borderColor: appTheme.NEW_PALLET,
  },
  declarationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1C1C',
  },
  declarationText: {
    fontSize: 12,
    color: '#6B6B6B',
    lineHeight: 18,
    marginTop: 4,
  },
  nextButton: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 18,
    height: 52,
    borderRadius: 14,
    backgroundColor: appTheme.NEW_PALLET,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextDisabled: {
    backgroundColor: '#ECECEC',
  },
  nextText: {
    fontSize: 16,
    fontWeight: '700',
    color: appTheme.DARK_BOTTOMTAB,
  },
  nextHint: {
    fontSize: 11.5,
    color: '#B7791F',
    textAlign: 'center',
    marginTop: 8,
  },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  secureText: {
    fontSize: 12,
    color: '#6B6B6B',
    marginLeft: 6,
  },
  pendingCard: {
    marginHorizontal: 16,
    marginTop: 24,
    backgroundColor: 'white',
    borderRadius: 22,
    padding: 22,
    alignItems: 'center',
  },
  pendingIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF1D2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1C',
    marginTop: 14,
  },
  pendingText: {
    fontSize: 13,
    color: '#6B6B6B',
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 8,
  },
  helpline: {
    fontSize: 17,
    fontWeight: '700',
    color: '#B7791F',
    marginTop: 12,
  },
});

const styles = StyleSheet.create({
  badgeContainer: {
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 14,
    padding: 10,
    fontWeight: '500',
    color: 'black',
  },
  modalContainer: {
    paddingTop: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 10,
  },
  helplineNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: appTheme.NEW_PALLET,
    marginBottom: 15,
  },
  contactButton: {
    backgroundColor: appTheme.NEW_PALLET,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
})
export default Neft;
