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
    formik.setFieldValue('couponCode', e);
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

  return (
    <View style={{ backgroundColor: appTheme.APP_BACKGROUND_COLOR }}>
      <ScrollView>
        <View
          style={{
            width: width,
            backgroundColor: 'white',
          }}>
          <KeyboardAwareScrollView  style={{ backgroundColor: 'white' }}>
            <HeaderRNE
              backgroundColor="white"
              backgroundImageStyle={{}}
              barStyle="dark-content"
              centerComponent={{
                text: `${t('couponscan')}`,
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
              // containerStyle={{width: 350}}
              leftComponent={
                <TouchableOpacity
                  containerStyle={{ padding: 5 }}
                  onPress={() => props.navigation.push('Home')}>
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
                  : 0,
              }}
            />
            <View
              style={{
                alignContent: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              }}></View>
            <View>
              <Text style={[styles.textSubTitle, { alignSelf: 'center' }]}>
                {`${t('scanqr')}`}
              </Text>
              <Text style={[styles.textContent, { alignSelf: 'center' }]}>
                {`${t('qrtagline')}`}
              </Text>
              <View style={{ alignItems: 'center', marginTop: 20 }}>
                <ImageButton
                  buttonText=""
                  marker={require('../../../assets/images/qr_code.png')}
                  onPress={() => { }}
                  style={{ width: width * 0.4 }}
                  imgWidth={width * 0.4}
                  imgHeight={height * 0.2}
                  disabled={true}></ImageButton>
              </View>
              <View style={{ marginHorizontal: 10, paddingHorizontal: 10 }}>
                <Button
                  title={`${t('scanqr')}`}
                  onPress={openScannerWithPermission}
                  color={
                    formik.values.coupons.length == 0
                      ? appTheme.NEW_PALLET
                      : 'grey'
                  }
                  buttonStyle={{
                    backgroundColor: appTheme.NEW_PALLET,
                    borderRadius: 8,
                  }}
                  disabled={formik.values.coupons.length == 1}
                />
              </View>
              {
                userAllData?.customerType == "Mechanic" && (

                  <View style={{ marginHorizontal: 10, paddingHorizontal: 10, marginTop: 20 }}>
                    <Button
                      title={`${t('DAMAGE_SCAN')}`}
                      onPress={() => {
                        navigation.push(navigationStrings.DAMAGE, { code: formik.values.couponCode.toUpperCase() })
                      }}
                      color={
                        formik.values.coupons.length == 0
                          ? appTheme.NEW_PALLET
                          : 'grey'
                      }
                      buttonStyle={{
                        backgroundColor: 'grey',
                        borderRadius: 8,
                      }}
                      disabled={formik.values.coupons.length == 1}
                    />
                  </View>
                )
              }
              <Text
                style={{
                  color: '#B4B4B4',
                  fontSize: 22,
                  letterSpacing: 4,
                  marginTop: 20,
                }}
                numberOfLines={1}
                ellipsizeMode={'clip'}>
                ------------------------------------------------------
              </Text>
              {formik.values.isCouponSelected && (
                <View>
                  <View
                    style={{
                      flex: 1,
                    }}>
                    <View
                      style={{
                        width: width * 0.94,
                        alignItems: 'center',
                        alignContent: 'center',
                        justifyContent: 'center',
                        alignSelf: 'center',
                      }}>
                      <Input
                        containerStyle={{ padding: 1 }}
                        inputContainerStyle={{
                          borderRadius: 12,
                          borderWidth: 0.5,
                          borderColor: 'black',
                        }}
                        value={formik.values.couponCode.toUpperCase()}
                        onChangeText={text => handleChangeCode(text)}
                        inputStyle={{
                          textTransform: 'uppercase',
                        }}
                        label={`${t('enterinputcode')}`}
                        labelStyle={{ marginBottom: 10 }}
                        disabled={formik.values.coupons.length == 1}
                      />
                    </View>
                  </View>
                  {formik.values.coupons.length > 0 && (
                    <>
                      <View style={{ marginTop: 20 }}></View>
                      {formik.values.coupons.map((item: any, index: number) => (
                        <View
                          key={index}
                          style={{
                            borderTopWidth: 1,
                            borderLeftWidth: 1,
                            borderRightWidth: 1,
                            borderBottomWidth:
                              index == formik.values.coupons.length - 1 ? 1 : 0,
                            borderTopLeftRadius: index == 0 ? 8 : 0,
                            borderTopRightRadius: index == 0 ? 8 : 0,
                            borderBottomLeftRadius:
                              index == formik.values.coupons.length - 1 ? 8 : 0,
                            borderBottomRightRadius:
                              index == formik.values.coupons.length - 1 ? 8 : 0,
                            borderColor: '#B4B4B4',
                            padding: 10,
                            width: width * 0.9,
                            alignSelf: 'center',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <Text style={{ color: 'black' }}>{item}</Text>
                          <Ent
                            name="cross"
                            color={'red'}
                            size={26}
                            onPress={() => {
                              var couponsList = formik.values.coupons;
                              couponsList.splice(index, 1);
                              formik.setFieldValue('coupons', [...couponsList]);
                              formik.resetForm();
                              setShowError(false);
                            }}
                          />
                        </View>
                      ))}
                    </>
                  )}
                  <View
                    style={{
                      alignItems: 'center',
                      marginTop: 20,
                      marginBottom: 20,
                    }}>
                    <Button
                      title={`${t('submit')}`}
                      titleStyle={{ color: 'black' }}
                      loading={isLoadingSubmit}
                      onPress={() => {
                        setIsLoadingSubmit(true);
                        console.log(formik.values.couponCode.length);
                        formik.handleSubmit();
                        console.log('pressed');
                      }}
                      buttonStyle={{
                        backgroundColor: appTheme.NEW_PALLET,
                        borderRadius: 8,
                        width: width * 0.85,
                        height: 43,
                      }}
                      disabled={
                        formik.values.coupons.length > 0 ||
                          (formik.values.couponCode.length >= 8 &&
                            formik.values.couponCode.length <= 50 &&
                            !isLoadingSubmit)
                          ? false
                          : true
                      }
                    />
                    {showError ? (
                      <Text
                        style={{
                          color: 'red',
                          padding: 10,
                          paddingHorizontal: 30,
                        }}>
                        {messageText}
                      </Text>
                    ) : null}
                  </View>
                </View>
              )}
              {formik.values.scan && (
                <View
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                  }}>
                  <QrScanComp
                    onResult={(qrData: any, isScanned: boolean) => {
                      formik.setFieldValue('scan', false);
                      console.log('QR Scanned >>>>    ', qrData);
                      if (isScanned) {
                        formik.setFieldValue('coupons', [
                          ...formik.values.coupons,
                          ...[qrData.toUpperCase()],
                        ]);
                        console.log(
                          'QR Scanned >>>>    ',
                          formik.values.coupons,
                        );
                      }
                      setIsLoadingSubmit(true)
                      formik.handleSubmit();
                    }}></QrScanComp>
                </View>
              )}
            </View>
          </KeyboardAwareScrollView>
        </View>
        <View style={{ height: 50 }}></View>
        <View style={{ paddingBottom: responsiveHeight(13) }}></View>
      </ScrollView>
    </View>
  );
}

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
