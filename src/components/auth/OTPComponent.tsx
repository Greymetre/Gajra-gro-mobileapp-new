import React, { useState, useEffect } from 'react';
import {
  Alert,
  Dimensions,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import appTheme from '../../utils/appTheme';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { login, stackUpdate } from '../../redux';
import { setTokenAsyncStorage } from '../../services/auth_helper';
import { Button, Input } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import navigationStrings from '../../constants/navigationStrings';
import { NavigationInterFace } from '../../interfaces/navigationType.interface';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  requestGetMobileExist,
  requestLoginOTP,
  requestResendOTP,
  requestSendOTP,
} from '../../services/backend_helper';
import { useTranslation } from 'react-i18next';
import DeviceInfo from 'react-native-device-info';
import { log } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
const OTPComponent = (props: any) => {
  const { t } = useTranslation();
  // const {height, width} = Dimensions.get('window');
  const [showError, setshowError] = useState(false);
  const maximumCodeLength = 4;
  const [disableGetOTPButton, setDisableGetOTPButton] = useState(false);
  const [seconds, setSeconds] = useState(30);
  DeviceInfo.getManufacturer().then(manufacturer => {
    // console.log(manufacturer);
  });
  let ddname = DeviceInfo.getModel();
  // console.log('Model', ddname);
  let buildNumber = DeviceInfo.getBuildNumber();
  // console.log('buildNumber', buildNumber);
  let systemVersion = DeviceInfo.getSystemVersion();
  let brand = DeviceInfo.getBrand();
  // console.log(brand);
  let temp1 = `${brand} androidVersion- ${systemVersion} ${ddname}`;
  let appliationversion = DeviceInfo.getVersion();

  // console.log('aa', appliationversion);

  // setDName(brand.concat(ddname.toString()));
  // console.log(dName);

  // console.log(, brand);

  DeviceInfo.getBaseOs().then(baseOs => {
    // console.log('BaseOS', baseOs);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [seconds]);

  // const [isPinReady, setIsPinReady] = useState(false);
  const navigation = useNavigation<NavigationInterFace>();
  const [mobileInput, setMobileInput] = useState(false);
  const dispatch = useDispatch();
  const [otpCode, setOTPCode] = useState('');
  const [otpCodeResponse, setOTPCodeResponse] = useState(0);
  const [resendOTPEnable, setResendOTPEnable] = useState(false);
  const [userExistResponse, setuserExistResponse] = useState(false);
  const [errMessageRes, setErrMessageRes] = useState('');
  const initialValues = {
    username: '',
    password: '',
    // tempPassword: '',
    isVisible: true,
    isClicked: false,
    focusUserName: false,
    focusPassword: false,
  };
  const [counter, setCounter] = useState(0);
  useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
  }, [counter]);
  // const [mobileExist, setMobileExist] = useState<GetMobileExistInterface>({});
  const validationSchema = Yup.object({
    username: Yup.string()
      .required(`${t('requirederror', { fieldname: `${t('phoneno')}` })}`)
      .min(
        10,
        ({ min }) =>
          `${t('lenghterrnum', {
            fieldname: `${t('phoneno')}`,
            len: `${min}`,
          })}`,
      )
      .max(
        10,
        ({ max }) =>
          `${t('lenghterrnum', {
            fieldname: `${t('phoneno')}`,
            len: `${max}`,
          })}`,
      ),
    password: Yup.string()
      // .label('OTP')
      .min(4)
      .max(4)
      .required(),
    // .equals(String(otpCodeResponse), 'Test message'),
    // tempPassword: Yup.string().oneOf(
    //   [Yup.ref('password')],
    //   `${t('invalidotp')}`,
    // ),
  });
  const handleChangeOTP = (e: any) => {
    console.log('OTP ENTERED ____', otpCode);
    formik.setFieldValue('password', otpCode);
  };
  const handleChangeUsername = (e: any) => {
    formik.setFieldValue('username', e);
  };
  const resendOTPFunction = async () => {
    var data = {
      mobile: formik.values.username,
    };
    await requestGetMobileExist(data).then(res => {
      if (res.isError == false && res.message == 'SUCCESS') {
        setuserExistResponse(res.data.exists);
      }
    });
    await requestResendOTP(data)
      .then(res => {
        // formik.setFieldValue('isClicked', false);
        if (res.isError == false && res.message == 'SUCCESS') {
          // formik.setValues({...initialValues, isClicked: false});
          var resData = JSON.stringify(res.data);
          setOTPCodeResponse(res.data.otp);
          // formik.setFieldValue('tempPassword', res.data.otp);
          console.log('Resend OTP Response - ', res);
        } else {
          console.log('ERROR');
        }
      })
      .catch(error => {
        // formik.setFieldValue('isClicked', false);
        console.log('Request Resend OTP Response >>>>  ', error);
      });
  };
  const OTPonSubmit = async () => {
    var data = {
      mobile: formik.values.username,
    };
    // console.log('Check Error - ', formik.values.tempPassword);
    console.log('OTP Username', data);

    // var jsonData = JSON.parse(`${data}`);
    await requestSendOTP(data)
      .then(res => {
        // formik.setFieldValue('isClicked', false);
        if (res.isError == false && res.message == 'SUCCESS') {
          // formik.setValues({...initialValues, isClicked: false});
          var resData = JSON.stringify(res.data);
          console.log(resData);
          setOTPCodeResponse(res.data.otp);
          // formik.setFieldValue('tempPassword', res.data.otp);
          setuserExistResponse(res.data.userExist);
          setDisableGetOTPButton(true);
          console.log('Response', res);
        } else {
          console.log('ERROR');
        }
      })
      .catch(error => {
        // formik.setFieldValue('isClicked', false);
        console.log('Login Response >>>>  ', error);
        setshowError(true);
        setErrMessageRes(error.message);
      });
  };
  const [showOTPCodeBox, setShowOTPCodeBox] = useState(false);
  const resendOTP = () => {
    setSeconds(30);
  };
  const onSubmit = async (values: any) => {
    let fcmToken = await AsyncStorage.getItem('fcmToken')
    console.log(fcmToken, 'oioooo')
    if (fcmToken) {
      var data = {
        username: formik.values.username,
        otp: formik.values.password,
        appVersion: appliationversion,
        deviceToken: `${fcmToken}`,
        deviceType: 'android',
        deviceName: temp1,
      };
    } else {
      var data = {
        username: formik.values.username,
        otp: formik.values.password,
        appVersion: appliationversion,
        deviceToken: `${fcmToken}`,
        deviceType: 'android',
        deviceName: temp1,
      };
    }


    console.log(
      'Code Response - ',
      otpCodeResponse,
      'Formik OTP -',
      parseInt(formik.values.password),
    );

    // setSendMobileNo(formik.values.username);
    // console.log('Signindata', sendMobileNo);
    // if (otpCodeResponse == parseInt(formik.values.password)) {
    // console.log('OTP MATCHES');
    // console.log(formik.values.tempPassword);

    console.log('User Exist', userExistResponse);
    await requestLoginOTP(data)
      .then(res => {
        // formik.setFieldValue('isClicked', false);
        // User Exists and OTP Match
        if (res.isError == false && res?.data?.token) {
          formik.setValues({ ...initialValues, isClicked: false });
          var resData = JSON.stringify(res.data);
          setTokenAsyncStorage(res?.data?.token);
          dispatch(login(resData));
          dispatch(stackUpdate('dashboard'));
        }
        // User Exists and OTP Dont Match
        else if (res.isError == false && res.data.userExist) {
          setshowError(true);
        }
        // User Does Not Exist and OTP Match
        else if (res.isError == false && res.data.userExist === false) {
          navigation.navigate(navigationStrings.SIGN_UP_ONE, {
            mobileno: formik.values.username,
            user_exist: userExistResponse,
          });
        } else {
          if (res?.data?.active == false) {
            Alert.alert('', `Your account is inactive please contact with customer care +91 81033 24701`, [
              {
                text: 'OK',
                onPress: () => console.log('Ask me later pressed'),
                style: 'cancel',
              },
            ]);
          } else {

            Alert.alert('', `${res.message}`, [
              {
                text: 'OK',
                onPress: () => console.log('Ask me later pressed'),
                style: 'cancel',
              },
            ]);
          }
        }
        console.log(res);
      })
      .catch(error => {
        console.log('Login Response >>>>  ', error);
        setErrMessageRes(error.message);
        setshowError(true);
        console.log(errMessageRes);
      });

    // }
    console.log('formik pass', formik.values.username);
    // -----------------------
    // console.log('User Exist', userExistResponse);
    // navigation.navigate(navigationStrings.SIGN_UP_ONE, {
    //   mobileno: formik.values.username,
    //   user_exist: userExistResponse,
    // });
  };
  const ootp = async () => {
    if (otpCodeResponse === parseInt(formik.values.password)) {
      // console.log(formik.values.tempPassword);
    }
  };
  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
    enableReinitialize: false,
  });

  return (
    <SafeAreaView style={{ backgroundColor: appTheme.APP_BACKGROUND_COLOR }}>
      <View>
        <View>
          <Text style={{ marginTop: 20 }}>
            <Text style={{ color: 'black' }}>{t('phoneno')}</Text>
            <Text style={{ color: 'red' }}>*</Text>
          </Text>
          <Input
            inputContainerStyle={{
              borderWidth: formik.values.focusUserName ? 0 : 1,
              borderRadius: 8,
            }}
            placeholder={'Phone Number'}
            placeholderTextColor="#CCCCCC"
            renderErrorMessage={false}
            value={formik.values.username}
            onChangeText={text => handleChangeUsername(text)}
            keyboardType="phone-pad"
            maxLength={10}
            rightIcon={
              <FontAwesome
                name="pencil-square-o"
                size={25}
                color={'black'}
                onPress={() => {
                  setMobileInput(false);
                  setDisableGetOTPButton(false);
                }}
              />
            }
            disabled={mobileInput}
          />
          {/* </LinearGradient> */}
          {formik.errors.username && (
            <Text style={{ fontSize: 11, color: 'red' }}>
              {formik.errors.username}
            </Text>
          )}
          <View
            style={{
              alignContent: 'flex-end',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              alignSelf: 'flex-end',
              width: 150,
              paddingRight: 10,
            }}>
            <Button
              title={`${t('getotp')}`}
              onPress={() => {
                // navigation.navigate(navigationStrings.SIGN_UP_ONE, {
                //   mobileno: '8269268961',
                // });
                if (formik.values.username.length == 10) {
                  setMobileInput(true);
                  OTPonSubmit();
                  setShowOTPCodeBox(true);
                  setSeconds(30);
                  setTimeout(() => {
                    setResendOTPEnable(true);
                  }, 30000);
                } else {
                  {
                    formik.validateForm();
                  }
                }
              }}
              buttonStyle={{
                backgroundColor: appTheme.NEW_PALLET,
                borderRadius: 8,
              }}
              titleStyle={{ color: 'black' }}
              containerStyle={{ paddingTop: 10 }}
              disabled={disableGetOTPButton}
            />
          </View>
          {disableGetOTPButton ? (
            <Text
              style={{
                // justifyContent: 'center',
                // alignItems: 'center',
                // alignContent: 'center',
                alignSelf: 'center',
                color: 'red',
              }}>
              {t('otpsentmessage')}
            </Text>
          ) : null}
        </View>
        <View>
          <View>
            <View>
              <View>
                <Text style={{ color: 'black', marginTop: 20, fontSize: 14 }}>
                  {' '}
                  {`${t('OTP')}`}
                </Text>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                  }}>
                  <Input
                    containerStyle={{ justifyContent: 'center', alignItems: 'center' }}
                    // disabledInputStyle={{background: '#ddd'}}
                    maxLength={maximumCodeLength}
                    inputContainerStyle={{
                      width: 160,
                      paddingHorizontal: 5,
                      justifyContent: 'space-evenly',
                      alignContent: 'center',
                      alignItems: 'center',
                      borderColor: 'black',
                      borderRadius: 12,
                      borderWidth: 0.5,
                      alignSelf: 'auto',
                    }}
                    value={formik.values.password}
                    onChangeText={(otpCode: any) => {
                      formik.setFieldValue('password', otpCode);
                      if (formik.dirty) {
                        setshowError(false);
                      }
                    }}
                    textContentType={'oneTimeCode'}
                    inputStyle={{
                      letterSpacing: 21,
                      // justifyContent: 'space-evenly',
                    }}
                    textAlignVertical={'center'}
                    placeholder="****"
                    keyboardType="number-pad"
                  />
                </View>

                {/* <Pressable onPress={Keyboard.dismiss}> */}
                {/* <OTPInput
                      code={formik.values.password}
                      setCode={(otpCode: any) =>
                        formik.setFieldValue('password', otpCode)
                      }
                      maximumLength={maximumCodeLength}
                      setIsPinReady={setIsPinReady}
                    /> */}
                {/* </Pressable> */}
              </View>
              {/* {() => {
                  formik.setFieldValue('password', otpCode);
                  handleChangeOTP(otpCode);
                }} */}
              <View>
                {showError ? (
                  <Text style={{ fontSize: 15, color: 'red' }}>
                    {errMessageRes}
                  </Text>
                ) : null}
                {/* {formik.errors.tempPassword && (
                      <Text style={{fontSize: 11, color: 'red'}}>
                        {formik.errors.tempPassword}
                      </Text>
                    )} */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignContent: 'center',
                  }}>
                  {seconds > 0 ? (
                    <Text style={{ paddingHorizontal: 5 }}>
                      {`${t('resend')}`}- 00:
                      {seconds < 10 ? `0${seconds}` : seconds}
                    </Text>
                  ) : (
                    <Text>{`${t('notrecieved')}`}</Text>
                  )}
                  <Pressable
                    // disabled={seconds > 0}
                    onPress={() => {
                      if (seconds != 0) {
                        setResendOTPEnable(false);
                        console.log('seconds != 0', seconds != 0);
                      } else if (seconds === 0) {
                        resendOTPFunction();
                        console.log('seconds === 0', seconds === 0);
                        resendOTP();

                        setResendOTPEnable(true);
                      }

                      // setSeconds(10);
                      // if (seconds == 0) {
                      //   setResendOTPEnable(true);
                      // }
                    }}>
                    <Text
                      style={[seconds == 0 ? stylesNew.black : stylesNew.grey]}>
                      {`${t('resend')} ${t('OTP')}`}
                    </Text>
                  </Pressable>
                </View>

                <View style={{ paddingTop: 10 }}>
                  <Button
                    title={`${t('submit')}`}
                    loading={formik.values.isClicked}
                    onPress={() => {
                      formik.handleSubmit();
                      // navigation.navigate(navigationStrings.SIGN_UP_ONE, {
                      //   mobileno: '9876543210',
                      // });
                    }}
                    buttonStyle={{
                      backgroundColor: appTheme.NEW_PALLET,
                      borderRadius: 8,
                    }}
                    disabled={formik.values.isClicked ? true : !formik.isValid}
                    titleStyle={{ color: 'black' }}
                    containerStyle={{ paddingTop: 10 }}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OTPComponent;

const stylesNew = StyleSheet.create({
  black: {
    color: 'black',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    fontWeight: 600,
    paddingHorizontal: 5,
    textDecorationLine: 'underline',
  },
  grey: {
    color: 'grey',
    paddingHorizontal: 5,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    textDecorationLine: 'underline',
  },
});
