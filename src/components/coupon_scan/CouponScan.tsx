import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  BackHandler,
  ToastAndroid,
  Alert,
  Platform,
  Pressable,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Button, Header as HeaderRNE, Input } from '@rneui/themed';
import QrScanComp from './QrScanComp';
import ImageButton from '../comman/imageButton/ImageButton';
import { useFormik } from 'formik';
import appTheme from '../../utils/appTheme';
import { requestGetAuthCustomerInfo, submitScannedCode } from '../../services/backend_helper';
import { useSelector } from 'react-redux';
import { ApplicationState } from '../../redux';
import { getSettingAsyncStorage } from '../../services/auth_helper';
import navigationStrings from '../../constants/navigationStrings';
import { responsiveHeight } from 'react-native-responsive-dimensions';
const { height, width } = Dimensions.get('window');
import Ent from 'react-native-vector-icons/Entypo';
import { useRoute, useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import MI from 'react-native-vector-icons/MaterialIcons';
import ShineOverlay from '../comman/ShineOverlay';
import { TAB_BAR_SPACE } from '../../navigation/CustomTabBar';

export default function CouponScan(props: any) {
  const { t } = useTranslation();
  const navigation: any = useNavigation();
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [showError, setShowError] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [schemeActive, setSchemeActive] = useState(false);
  const [userAllData, setUserAllData] = useState<any>(false);
  const [schemeStartDate, setSchemeStartDate] = useState<Date>(
    new Date('2030-01-01'),
  );
  // const stateData = useSelector(
  //   (state: ApplicationState) => state.loginReducers,
  // );
  // var authData = JSON.parse(stateData);

  useEffect(() => {
    fetchGetAuthCustomerInfo()
  }, [])

  const fetchGetAuthCustomerInfo = async () => {
    await requestGetAuthCustomerInfo({})
      .then(res => {
        if (res.isError == false) {
          console.log(res?.data, 'data dtaa ')
          setUserAllData(res?.data)
        }
      })
      .catch(error => {
        console.log('Response: ', error);
      });
  };

  const initialValues = {
    isCouponSelected: true,
    couponCode: '',
    isFocused: false,
    coupons: [],
    scan: false,
  };

  const getSumOfEarnPoints = async (data: any) => {
    console.log(data);
    var pointsValue = 0
    data.map((item: any) => {
      console.log(item)
      if (item?.isError == true) {
        pointsValue = pointsValue + 0
      } else {
        pointsValue = pointsValue + parseInt(item?.points)
      }
    })
    console.log(pointsValue, 666666666)
    return pointsValue
    // const points =
    //   Array.isArray(data) &&
    //   data.reduce((a: any, v: any) => (a = a ? parseInt(a): 0 + v?.points ? parseInt(v.points) : 0), 0);
    // return points;
  };

  // const routeNew = useRoute();
  const getAsyncStartDate = async () => {
    const settings: any = await getSettingAsyncStorage();
    const sett = await JSON.parse(settings);
    // console.log(sett);
    setSchemeStartDate(new Date(sett?.loyaltyscheme?.startedAt));
  };

  const nowDate = new Date();
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

  const dateCompare = async () => {
    if (nowDate.getTime() > schemeStartDate.getTime()) {
      setButtonEnabled(true);
      setSchemeActive(true);
    } else {
    }
  };

  useEffect(() => {
    getAsyncStartDate();
    dateCompare();
  }, []);

  const onSubmit = async (values: any) => {
    var listCoupons = [];
    var uniqueListCoupon = [];
    if (formik.values.couponCode.length > 0) {
      await listCoupons.push({ coupon: formik.values.couponCode.toUpperCase() });
    }

    for (let obj of formik.values.coupons) {
      await listCoupons.push({ coupon: obj });
    }
    let unique = [...new Set(listCoupons.map(item => item.coupon))];
    formik.values.coupons = [];
    for (let obj of unique) {
      await uniqueListCoupon.push({ coupon: obj });
      formik.values.coupons = formik.values.coupons.concat(obj);
    }
    var iData = {
      coupons: uniqueListCoupon,
    };
    console.log('Data', iData);
    await submitScannedCode(iData).then(
      async response => {
        // const
        const { data } = response;
        // console.log(response, 'responseresponseresponseresponse')
        const errormsg = data.find(
          (obj: any) => obj.coupon === iData.coupons[0].coupon,
        );
        setIsLoadingSubmit(false);

        if (response.isError === false && errormsg?.errorMessage) {
          console.log('New Err Msg', errormsg.errorMessage);
          await setShowError(true);
          await setMessageText(errormsg.errorMessage);

          if (errormsg.errorMessage === 'QRCODE_ALREADY_SCANNED') {
            Alert.alert('This QR code has already been scanned.')
            // ToastAndroid.show('This QR code has already been scanned. Please use a different one.', ToastAndroid.SHORT);
          }
          else if (errormsg.errorMessage === "This is Retailer coupon" || errormsg.errorMessage === "This is Mechanic coupon") {
            Alert.alert(`${errormsg.errorMessage}`);
            // ToastAndroid.show(`${errormsg.errorMessage}`, ToastAndroid.SHORT);
            return;
          }
          else {
            navigation.push(navigationStrings.DAMAGE, { code: response?.data[0]?.coupon.toUpperCase() });
            setShowError(false)
            setMessageText('')
            await formik.resetForm();
          }
        } else if (response.isError === false && response.data[0]?.points) {
          await getSumOfEarnPoints(response.data).then(async (points: any) => {
            await props.navigation.navigate(navigationStrings.SUCCESSPOINTS, {
              points: points,
            });
          });
        }
      },
      error => {
        setIsLoadingSubmit(false);
        // setErrMessage
        console.log('err', error.response.data.message);
        var y = error.response.data.message.split(':')[1];
        setMessageText(y);
        console.log('err', error.response.status);
        setShowError(true);
        if (error.response.status === 400) {
          const { data } = error.response;
          console.log(data);
        }
      },
    );
    console.log('showError', showError);
    console.log('messageText', messageText);
    if (showError === true && messageText) {
      console.log('Inside Condn');
      await formik.resetForm();
    }
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
  });

  const handleChangeCode = (e: any) => {
    formik.setFieldValue('couponCode', e.slice(0, 8));
  };

  useEffect(() => {
    if (navigation.isFocused()) {
      formik.resetForm()
    }
  }, [navigation.isFocused()]);

  const openScannerWithPermission = async () => {
  try {
    let permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;

    let result = await check(permission);

    if (result === RESULTS.GRANTED) {
      formik.setFieldValue('scan', true);
      return;
    }

    if (result === RESULTS.DENIED) {
      let req = await request(permission);

      if (req === RESULTS.GRANTED) {
        formik.setFieldValue('scan', true);
      } else {
        Alert.alert(
          'Camera Permission',
          'Camera permission is required to scan QR code',
        );
      }
    }

    if (result === RESULTS.BLOCKED) {
      Alert.alert(
        'Permission Blocked',
        'Please enable camera permission from settings',
      );
    }
  } catch (e) {
    console.log(e);
  }
};

  const scanLocked = formik.values.coupons.length == 1;
  const submitDisabled =
    formik.values.coupons.length > 0 ||
      (formik.values.couponCode.length >= 8 &&
        formik.values.couponCode.length <= 50 &&
        !isLoadingSubmit)
      ? false
      : true;
  const canReportDamage =
    userAllData?.customerType == 'Mechanic' || userAllData?.customerType == 'Retailer';

  return (
    // White behind the status bar so it blends with the header; the page itself is grey.
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={qStyles.header}>
        <Pressable
          onPress={() => props.navigation.push('Home')}
          hitSlop={6}
          style={({ pressed }) => [qStyles.headerButton, pressed && { opacity: 0.6 }]}>
          <Ionicons name="chevron-back" size={22} color={appTheme.DARK_BOTTOMTAB} />
        </Pressable>
        <Text style={qStyles.headerTitle}>{`${t('couponscan')}`}</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAwareScrollView
        style={{ backgroundColor: '#F7F7F7' }}
        contentContainerStyle={{ paddingBottom: TAB_BAR_SPACE }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {/* Scan hero */}
        <LinearGradient
          colors={['#2B2829', appTheme.DARK_BOTTOMTAB, '#4A4344']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={qStyles.heroCard}>
          <View style={qStyles.heroDecor} />
          <ShineOverlay />
          <View style={qStyles.qrFrame}>
            <Image
              source={require('../../../assets/images/qr_code.png')}
              style={qStyles.qrImage}
            />
          </View>
          <Text style={qStyles.heroTitle}>{`${t('scanqr')}`}</Text>
          <Text style={qStyles.heroSubtitle}>{`${t('qrtagline')}`}</Text>
          <Pressable
            onPress={openScannerWithPermission}
            disabled={scanLocked}
            style={({ pressed }) => [
              qStyles.scanButton,
              scanLocked && { opacity: 0.5 },
              pressed && { transform: [{ scale: 0.98 }] },
            ]}>
            <MI name="qr-code-scanner" size={22} color={appTheme.DARK_BOTTOMTAB} />
            <Text style={qStyles.scanButtonText}>{`${t('scanqr')}`}</Text>
          </Pressable>
        </LinearGradient>

        {/* Damage report */}
        {canReportDamage ? (
          <Pressable
            onPress={() => {
              navigation.push(navigationStrings.DAMAGE, {
                code: formik.values.couponCode.toUpperCase(),
              });
            }}
            disabled={scanLocked}
            style={({ pressed }) => [
              qStyles.damageCard,
              scanLocked && { opacity: 0.5 },
              pressed && { opacity: 0.8 },
            ]}>
            <View style={qStyles.damageIcon}>
              <Ionicons name="warning-outline" size={22} color="#D93025" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={qStyles.damageTitle} numberOfLines={1}>
                {`${t('DAMAGE_SCAN')}`}
              </Text>
              <Text style={qStyles.damageSubtitle}>QR damaged or not scanning? Report it here</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#B5B5B5" />
          </Pressable>
        ) : null}

        {/* OR divider */}
        <View style={qStyles.orRow}>
          <View style={qStyles.orLine} />
          <Text style={qStyles.orText}>OR</Text>
          <View style={qStyles.orLine} />
        </View>

        {/* Manual entry */}
        {formik.values.isCouponSelected && (
          <View style={qStyles.card}>
            <View style={qStyles.cardHeader}>
              <View style={qStyles.cardHeaderIcon}>
                <Ionicons name="keypad-outline" size={18} color={appTheme.DARK_BOTTOMTAB} />
              </View>
              <Text style={qStyles.cardTitle}>{`${t('enterinputcode')}`}</Text>
            </View>

            <View style={[qStyles.inputWrapper, scanLocked && qStyles.inputLocked]}>
              <Ionicons name="pricetag-outline" size={18} color="#6B6B6B" />
              <TextInput
                style={qStyles.input}
                value={formik.values.couponCode.toUpperCase()}
                onChangeText={text => handleChangeCode(text)}
                maxLength={8}
                autoCapitalize="characters"
                autoCorrect={false}
                editable={!scanLocked}
                placeholder="8-character code"
                placeholderTextColor="#A0A0A0"
              />
              <Text style={qStyles.counter}>{formik.values.couponCode.length}/8</Text>
            </View>

            {formik.values.coupons.length > 0 && (
              <View style={{ marginTop: 12 }}>
                <Text style={qStyles.scannedLabel}>Scanned codes</Text>
                {formik.values.coupons.map((item: any, index: number) => (
                  <View key={index} style={qStyles.couponChip}>
                    <Ionicons name="qr-code-outline" size={16} color={appTheme.DARK_BOTTOMTAB} />
                    <Text style={qStyles.couponChipText}>{item}</Text>
                    <Pressable
                      hitSlop={8}
                      onPress={() => {
                        var couponsList = formik.values.coupons;
                        couponsList.splice(index, 1);
                        formik.setFieldValue('coupons', [...couponsList]);
                        formik.resetForm();
                        setShowError(false);
                      }}>
                      <Ionicons name="close-circle" size={20} color="#D93025" />
                    </Pressable>
                  </View>
                ))}
              </View>
            )}

            <Pressable
              onPress={() => {
                setIsLoadingSubmit(true);
                formik.handleSubmit();
              }}
              disabled={submitDisabled}
              style={({ pressed }) => [
                qStyles.submitButton,
                submitDisabled && qStyles.submitDisabled,
                pressed && { transform: [{ scale: 0.98 }] },
              ]}>
              {isLoadingSubmit ? (
                <ActivityIndicator color={appTheme.DARK_BOTTOMTAB} />
              ) : (
                <Text style={[qStyles.submitText, submitDisabled && { color: '#9A9A9A' }]}>
                  {`${t('submit')}`}
                </Text>
              )}
            </Pressable>

            {showError ? (
              <View style={qStyles.errorBox}>
                <Ionicons name="alert-circle" size={16} color="#D93025" />
                <Text style={qStyles.errorText}>{messageText}</Text>
              </View>
            ) : null}
          </View>
        )}
      </KeyboardAwareScrollView>

      {formik.values.scan && (
        <View style={StyleSheet.absoluteFill}>
          <QrScanComp
            onResult={(qrData: any, isScanned: boolean) => {
              formik.setFieldValue('scan', false);
              console.log('QR Scanned >>>>    ', qrData);
              if (isScanned) {
                formik.setFieldValue('coupons', [
                  ...formik.values.coupons,
                  ...[qrData.toUpperCase()],
                ]);
              }
              setIsLoadingSubmit(true)
              formik.handleSubmit();
            }}></QrScanComp>
        </View>
      )}
    </View>
  );
}

const QR_SIZE = 150;

const qStyles = StyleSheet.create({
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
  heroCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 22,
    padding: 20,
    alignItems: 'center',
    overflow: 'hidden',
  },
  heroDecor: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    right: -70,
    top: -90,
    backgroundColor: 'rgba(247,209,133,0.12)',
  },
  qrFrame: {
    width: QR_SIZE + 24,
    height: QR_SIZE + 24,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: appTheme.NEW_PALLET,
  },
  qrImage: {
    width: QR_SIZE,
    height: QR_SIZE,
    resizeMode: 'contain',
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginTop: 16,
  },
  heroSubtitle: {
    fontSize: 12.5,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    marginTop: 18,
    backgroundColor: appTheme.NEW_PALLET,
    borderRadius: 14,
    paddingVertical: 14,
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: appTheme.DARK_BOTTOMTAB,
    marginLeft: 8,
  },
  damageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 14,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#FBE0DE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  damageIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FDECEA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  damageTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1C1C',
  },
  damageSubtitle: {
    fontSize: 11.5,
    color: '#8A8A8A',
    marginTop: 2,
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    marginVertical: 18,
  },
  orLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#CFCFCF',
  },
  orText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9A9A9A',
    marginHorizontal: 12,
    letterSpacing: 1,
  },
  card: {
    marginHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardHeaderIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#FFF1D2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1C1C',
    marginLeft: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 52,
    backgroundColor: 'white',
  },
  inputLocked: {
    backgroundColor: '#F5F5F5',
  },
  input: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 3,
    color: 'black',
    marginLeft: 8,
  },
  counter: {
    fontSize: 12,
    color: '#9A9A9A',
  },
  scannedLabel: {
    fontSize: 12,
    color: '#8A8A8A',
    marginBottom: 6,
  },
  couponChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7E6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  couponChipText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
    color: 'black',
    marginLeft: 8,
  },
  submitButton: {
    marginTop: 16,
    height: 50,
    borderRadius: 14,
    backgroundColor: appTheme.NEW_PALLET,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitDisabled: {
    backgroundColor: '#ECECEC',
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
    color: appTheme.DARK_BOTTOMTAB,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: '#FDECEA',
    borderRadius: 10,
    padding: 10,
  },
  errorText: {
    flex: 1,
    fontSize: 12.5,
    color: '#D93025',
    marginLeft: 6,
  },
});

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: height * 0.1,
    paddingLeft: 15,
    width: width,
    justifyContent: 'center',
  },
  textTitle: {
    fontWeight: '600',
    fontSize: 6,
    textAlign: 'center',
    // padding: 16,
    color: 'black',
  },
  textSubTitle: {
    fontWeight: '500',
    fontSize: 14,
    textAlign: 'center',
    color: 'black',
  },
  textContent: {
    fontWeight: '500',
    fontSize: 11,
    textAlign: 'center',
    color: '#9A9A9A',
    width: width / 2,
    marginTop: 5,
  },
  text2: {
    fontWeight: '500',
    fontSize: 12,
    width: width * 0.88,
    color: 'black',
    marginTop: 20,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingLeft: 7,
  },
});
