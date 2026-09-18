import React, { useState, useEffect, useRef } from 'react';
import {
  Alert,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
  ActivityIndicator,
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
        deviceType: Platform.OS,
        deviceName: temp1,
      };
    } else {
      var data = {
        username: formik.values.username,
        otp: formik.values.password,
        appVersion: appliationversion,
        deviceToken: `${fcmToken}`,
        deviceType: Platform.OS,
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

  const otpInputRef = useRef<TextInput>(null);
  const otpDigits = (formik.values.password || '').split('');
  const phoneLocked = mobileInput;

  return (
    <View style={oStyles.card}>
      {/* Phone number */}
      <Text style={oStyles.label}>
        {t('phoneno')}
        <Text style={{ color: '#D93025' }}> *</Text>
      </Text>
      <View
        style={[
          oStyles.phoneRow,
          phoneLocked && oStyles.phoneRowLocked,
          formik.errors.username ? oStyles.inputError : null,
        ]}>
        <View style={oStyles.countryCode}>
          <Text style={oStyles.countryCodeText}>+91</Text>
        </View>
        <TextInput
          style={oStyles.phoneInput}
          placeholder="Enter mobile number"
          placeholderTextColor="#A0A0A0"
          value={formik.values.username}
          onChangeText={text => handleChangeUsername(text.replace(/[^0-9]/g, ''))}
          keyboardType="phone-pad"
          maxLength={10}
          editable={!phoneLocked}
          textContentType="telephoneNumber"
          autoComplete="tel"
        />
        {phoneLocked ? (
          <Pressable
            hitSlop={8}
            onPress={() => {
              setMobileInput(false);
              setDisableGetOTPButton(false);
            }}
            style={oStyles.editButton}>
            <FontAwesome name="pencil" size={14} color={appTheme.DARK_BOTTOMTAB} />
            <Text style={oStyles.editText}>Edit</Text>
          </Pressable>
        ) : null}
      </View>
      {formik.errors.username ? (
        <Text style={oStyles.errorText}>{String(formik.errors.username)}</Text>
      ) : null}

      <Pressable
        disabled={disableGetOTPButton}
        onPress={() => {
          if (formik.values.username.length == 10) {
            setMobileInput(true);
            OTPonSubmit();
            setShowOTPCodeBox(true);
            setSeconds(30);
            setTimeout(() => {
              setResendOTPEnable(true);
            }, 30000);
            setTimeout(() => otpInputRef.current?.focus(), 400);
          } else {
            formik.validateForm();
          }
        }}
        style={({ pressed }) => [
          oStyles.otpButton,
          disableGetOTPButton && oStyles.otpButtonSent,
          pressed && { opacity: 0.85 },
        ]}>
        <FontAwesome
          name={disableGetOTPButton ? 'check-circle' : 'send'}
          size={15}
          color={disableGetOTPButton ? '#1E9E5A' : 'white'}
        />
        <Text style={[oStyles.otpButtonText, disableGetOTPButton && { color: '#1E9E5A' }]}>
          {disableGetOTPButton ? `${t('otpsentmessage')}` : `${t('getotp')}`}
        </Text>
      </Pressable>

      {/* OTP boxes: one hidden input drives four display boxes */}
      <Text style={[oStyles.label, { marginTop: 22 }]}>{`${t('OTP')}`}</Text>
      <Pressable style={oStyles.otpRow} onPress={() => otpInputRef.current?.focus()}>
        {[0, 1, 2, 3].map(i => {
          const active = i === otpDigits.length && otpDigits.length < maximumCodeLength;
          return (
            <View
              key={i}
              style={[
                oStyles.otpBox,
                otpDigits[i] ? oStyles.otpBoxFilled : null,
                active ? oStyles.otpBoxActive : null,
                showError ? oStyles.inputError : null,
              ]}>
              <Text style={oStyles.otpDigit}>{otpDigits[i] || ''}</Text>
            </View>
          );
        })}
        <TextInput
          ref={otpInputRef}
          style={oStyles.hiddenOtpInput}
          maxLength={maximumCodeLength}
          value={formik.values.password}
          onChangeText={(code: string) => {
            formik.setFieldValue('password', code.replace(/[^0-9]/g, ''));
            if (formik.dirty) {
              setshowError(false);
            }
          }}
          textContentType="oneTimeCode"
          autoComplete="sms-otp"
          keyboardType="number-pad"
          caretHidden
        />
      </Pressable>

      {showError ? <Text style={[oStyles.errorText, { textAlign: 'center' }]}>{errMessageRes}</Text> : null}

      <View style={oStyles.resendRow}>
        {seconds > 0 ? (
          <Text style={oStyles.resendText}>
            {`${t('resend')}`} in{' '}
            <Text style={{ fontWeight: '700', color: '#1C1C1C' }}>
              00:{seconds < 10 ? `0${seconds}` : seconds}
            </Text>
          </Text>
        ) : (
          <Text style={oStyles.resendText}>{`${t('notrecieved')}`}</Text>
        )}
        <Pressable
          hitSlop={8}
          onPress={() => {
            if (seconds != 0) {
              setResendOTPEnable(false);
            } else if (seconds === 0) {
              resendOTPFunction();
              resendOTP();
              setResendOTPEnable(true);
            }
          }}>
          <Text style={[oStyles.resendLink, seconds > 0 && { color: '#B5B5B5' }]}>
            {`${t('resend')} ${t('OTP')}`}
          </Text>
        </Pressable>
      </View>

      <Pressable
        disabled={formik.values.isClicked ? true : !formik.isValid}
        onPress={() => formik.handleSubmit()}
        style={({ pressed }) => [
          oStyles.submitButton,
          (formik.values.isClicked || !formik.isValid) && oStyles.submitDisabled,
          pressed && { transform: [{ scale: 0.98 }] },
        ]}>
        {formik.values.isClicked ? (
          <ActivityIndicator color={appTheme.DARK_BOTTOMTAB} />
        ) : (
          <>
            <Text style={oStyles.submitText}>{`${t('submit')}`}</Text>
            <FontAwesome name="arrow-right" size={15} color={appTheme.DARK_BOTTOMTAB} style={{ marginLeft: 8 }} />
          </>
        )}
      </Pressable>
    </View>
  );
};

const oStyles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 22,
    padding: 18,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1C1C',
    marginBottom: 8,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.12)',
    borderRadius: 14,
    height: 54,
    paddingRight: 10,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  phoneRowLocked: {
    backgroundColor: '#F7F7F7',
  },
  inputError: {
    borderColor: '#D93025',
  },
  countryCode: {
    height: '100%',
    paddingHorizontal: 14,
    justifyContent: 'center',
    backgroundColor: '#FFF6D6',
    borderRightWidth: 1,
    borderRightColor: 'rgba(0,0,0,0.08)',
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1C',
  },
  phoneInput: {
    flex: 1,
    fontSize: 17,
    letterSpacing: 1,
    color: 'black',
    paddingHorizontal: 12,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1D2',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  editText: {
    fontSize: 12,
    fontWeight: '700',
    color: appTheme.DARK_BOTTOMTAB,
    marginLeft: 5,
  },
  errorText: {
    fontSize: 12,
    color: '#D93025',
    marginTop: 6,
  },
  otpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    height: 48,
    borderRadius: 14,
    backgroundColor: appTheme.DARK_BOTTOMTAB,
  },
  otpButtonSent: {
    backgroundColor: '#E4F6EC',
  },
  otpButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: 'white',
    marginLeft: 8,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  otpBox: {
    width: 60,
    height: 62,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.12)',
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxFilled: {
    borderColor: appTheme.NEW_PALLET,
    backgroundColor: '#FFFBEF',
  },
  otpBoxActive: {
    borderColor: appTheme.DARK_BOTTOMTAB,
    backgroundColor: 'white',
  },
  otpDigit: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1C',
  },
  hiddenOtpInput: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.02,
    color: 'transparent',
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  resendText: {
    fontSize: 13,
    color: '#6B6B6B',
  },
  resendLink: {
    fontSize: 13,
    fontWeight: '700',
    color: appTheme.DARK_BOTTOMTAB,
    textDecorationLine: 'underline',
    marginLeft: 8,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    height: 52,
    borderRadius: 14,
    backgroundColor: appTheme.NEW_PALLET,
  },
  submitDisabled: {
    backgroundColor: '#ECECEC',
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
    color: appTheme.DARK_BOTTOMTAB,
  },
});

export default OTPComponent;

