import React, {useState, useEffect, ReactNode} from 'react';
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
import {useFormik} from 'formik';
import {useDispatch} from 'react-redux';
import {login, stackUpdate} from '../../redux';
import LinearGradient from 'react-native-linear-gradient';
import {setTokenAsyncStorage} from '../../services/auth_helper';
import {Button, Input} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../constants/navigationStrings';
import {NavigationInterFace} from '../../interfaces/navigationType.interface';

import {
  requestGetMobileExist,
  requestLoginOTP,
  requestResendOTP,
  requestSendOTP,
} from '../../services/backend_helper';
import {useTranslation} from 'react-i18next';
import DeviceInfo from 'react-native-device-info';
import {log} from 'react-native-reanimated';
const OTPComponent = (props: any) => {
  const {t} = useTranslation();
  const {height, width} = Dimensions.get('window');
  const [showError, setshowError] = useState(false);
  const maximumCodeLength = 4;
  const [disableGetOTPButton, setDisableGetOTPButton] = useState(false);
  const [seconds, setSeconds] = useState(5);
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

  const [isPinReady, setIsPinReady] = useState(false);
  const navigation = useNavigation<NavigationInterFace>();
  const dispatch = useDispatch();
  const [otpCode, setOTPCode] = useState('');
  const [otpCodeResponse, setOTPCodeResponse] = useState(0);
  const [resendOTPEnable, setResendOTPEnable] = useState(false);
  const [userExistResponse, setuserExistResponse] = useState(false);
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
      .required(`${t('requirederror', {fieldname: `${t('phoneno')}`})}`)
      .min(
        10,
        ({min}) =>
          `${t('lenghterrnum', {
            fieldname: `${t('phoneno')}`,
            len: `${min}`,
          })}`,
      )
      .max(
        10,
        ({max}) =>
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
          console.log('Response', res);
        } else {
          console.log('ERROR');
        }
      })
      .catch(error => {
        // formik.setFieldValue('isClicked', false);
        console.log('Login Response >>>>  ', error);
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
          console.log('Response', res);
        } else {
          console.log('ERROR');
        }
      })
      .catch(error => {
        // formik.setFieldValue('isClicked', false);
        console.log('Login Response >>>>  ', error);
      });
  };
  const [showOTPCodeBox, setShowOTPCodeBox] = useState(false);
  const resendOTP = () => {
    setSeconds(30);
  };
  const onSubmit = async (values: any) => {
    var data = {
      username: formik.values.username,
      otp: formik.values.password,
      appVersion: appliationversion,
      deviceToken: '',
      deviceType: 'android',
      deviceName: temp1,
    };
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
    if (userExistResponse == true) {
      console.log('User Exist', userExistResponse);
      await requestLoginOTP(data)
        .then(res => {
          // formik.setFieldValue('isClicked', false);
          if (res.isError == false && res.message == 'SUCCESS') {
            formik.setValues({...initialValues, isClicked: false});
            var resData = JSON.stringify(res.data);
            setTokenAsyncStorage(res?.data?.token);
            dispatch(login(resData));
            dispatch(stackUpdate('dashboard'));
          } else {
            Alert.alert('', `${res.message}`, [
              {
                text: 'OK',
                onPress: () => console.log('Ask me later pressed'),
                style: 'cancel',
              },
            ]);
          }
        })
        .catch(error => {
          formik.setFieldValue('isClicked', false);
          console.log('Login Response >>>>  ', error);
          setshowError(true);
        });
      console.log('formik pass', formik.values.username);
      // setSendMobileNo(formik.values.username);
      // navigation.navigate(navigationStrings.SIGN_UP_ONE, {
      //   mobileno: formik.values.username,
      // });
    } else if (userExistResponse == false) {
      console.log('User Exist', userExistResponse);
      navigation.navigate(navigationStrings.SIGN_UP_ONE, {
        mobileno: formik.values.username,
        user_exist: userExistResponse,
      });
    }
    // } else {
    //   console.log('OTP dont match');
    //   console.log(
    //     'OTP ENTERED- ',
    //     formik.values.password,
    //     'OTP RESPOSE SET',
    //     otpCodeResponse,
    //   );
    // }
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
    <SafeAreaView style={{backgroundColor: appTheme.APP_BACKGROUND_COLOR}}>
      <View>
        <View>
          <View>
            <View>
              <Text style={{marginTop: 20}}>
                <Text style={{color: 'black'}}>{t('phoneno')}</Text>
                <Text style={{color: 'red'}}>*</Text>
              </Text>
            </View>
            <View>
              {/* <LinearGradient
                colors={['#39B8FF', '#0029FF']}
                style={{
                  width: width * 0.88,
                  padding: formik.values.focusUserName ? 1 : 0,
                  borderRadius: 8,
                  marginTop: 10,
                }}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}> */}
              <Input
                style={{
                  width: width * 0.88 - (formik.values.focusUserName ? 2 : 0),
                  borderColor: 'black',
                  borderWidth: formik.values.focusUserName ? 0 : 1,
                  borderRadius: 8,
                  // marginTop: 10,
                  paddingHorizontal: 10,
                  backgroundColor: 'white',
                  // marginBottom: 1,
                }}
                placeholder={'Phone Number'}
                placeholderTextColor="#CCCCCC"
                value={formik.values.username}
                onChangeText={text => handleChangeUsername(text)}
                keyboardType="phone-pad"
                maxLength={10}
                // onFocus={() => {
                //   // _onPhoneNumberPressed();
                //   // PhoneNumberPressed();
                //   formik.setValues({``
                //     ...formik.values,
                //     focusUserName: true,
                //     focusPassword: false,
                //   });
                // }}
                // onBlur={() => {
                //   fetchGetMobileExist();
                // }}
              />
              {/* </LinearGradient> */}
              {formik.errors.username && (
                <Text style={{fontSize: 11, color: 'red'}}>
                  {formik.errors.username}
                </Text>
              )}
            </View>
          </View>
          <View style={{paddingTop: 10}}>
            <Button
              title={`${t('getotp')}`}
              onPress={() => {
                // navigation.navigate(navigationStrings.SIGN_UP_ONE, {
                //   mobileno: '8269268961',
                // });
                if (formik.values.username.length == 10) {
                  OTPonSubmit();
                  setDisableGetOTPButton(true);
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
                // console.log('Request OTP Pressed');
                // setOTPWindows(true);
              }}
              // style={{ paddingTop: 20 }}
              buttonStyle={{
                // paddingTop: 30,
                backgroundColor: appTheme.NEW_PALLET,
                borderRadius: 8,
              }}
              titleStyle={{color: 'black'}}
              containerStyle={{paddingTop: 10}}
              disabled={disableGetOTPButton}
            />
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
          {showOTPCodeBox ? (
            <View>
              <View>
                <View>
                  <View>
                    <Text style={{color: 'black', marginTop: 20}}>
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
                        containerStyle={{justifyContent: 'center'}}
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
                      <Text style={{fontSize: 11, color: 'red'}}>
                        {`${t('invalidotp')}`}
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
                        <Text style={{paddingHorizontal: 5}}>
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
                          style={[
                            seconds == 0 ? stylesNew.black : stylesNew.grey,
                          ]}>
                          {`${t('resend')} ${t('OTP')}`}
                        </Text>
                      </Pressable>
                    </View>

                    <View style={{paddingTop: 10}}>
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
                        disabled={
                          formik.values.isClicked ? true : !formik.isValid
                        }
                        titleStyle={{color: 'black'}}
                        containerStyle={{paddingTop: 10}}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ) : null}
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
