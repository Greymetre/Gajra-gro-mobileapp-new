import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  Image,
  Linking,
  PermissionsAndroid,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import appTheme from '../../utils/appTheme';
import { requestGetSettingInfo } from '../../services/backend_helper';
import { setSettingAsyncStorage } from '../../services/auth_helper';
import DeviceInfo from 'react-native-device-info';
import { useTranslation } from 'react-i18next';
import OTPInput from '../comman/OTPwork/OTPInput';
import { ButtonContainer, ButtonText } from '../comman/OTPwork/OTPwork';
import { Button, ButtonGroup } from '@rneui/themed';
import { color } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import navigationStrings from '../../constants/navigationStrings';
import { NavigationInterFace } from '../../interfaces/navigationType.interface';
import DeviceNumber from 'react-native-device-number';
// import SmsRetriever from 'react-native-sms-retriever';
import PasswordLogin from './PasswordLogin';
import CreatePassword from './CreatePassword';
import NetInfo from '@react-native-community/netinfo';

import { GetMobileExistInterface } from '../../interfaces/auth.interface';
import RegisterUser from './RegisterUser';
import OTPComponent from './OTPComponent';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../styles/colors';
import LanguageDropdown from '../comman/LanguageDropdown/LanguageDropdown';
import { stat } from 'react-native-fs';
import OfflineNotice from '../offlinenotice/OfflineNotice';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const { height, width } = Dimensions.get('window');

export default function Login(props: any) {
  const { t } = useTranslation();
  const [tnc, setTNC] = useState('');
  const [helpline, sethelpline] = useState('');
  const [dName, setDName] = useState('');
  async function requestPermissions() {
    await PermissionsAndroid.requestMultiple([
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
      'android.permission.READ_MEDIA_IMAGES',
      'android.permission.CAMERA',
      'android.permission.POST_NOTIFICATIONS',
    ]);
  }
  const [internet, setInternet] = useState<boolean>(false);
  // const fetchSettingInfo = async () => {
  //   await requestGetSettingInfo()
  //     .then(res => {
  //       if (res.isError == false) {
  //         setSettingAsyncStorage(res.data);
  //         setTNC(res.data.catalogue.terms);
  //         sethelpline(res.data.helpdesk.phone);
  //       }
  //     })
  //     .catch(error => {
  //       console.log('Response: ', error);
  //     });
  // };
  useEffect(() => {
    const interval = setInterval(() => {
      const unsubscribe = NetInfo.addEventListener(state => {
        if (state.isConnected === true && state.isInternetReachable === true) {
          setInternet(true);
        } else {
          setInternet(false);
        }
      });
      unsubscribe();
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    // fetchSettingInfo();
    requestPermissions();
  }, []);
  DeviceInfo.getManufacturer().then(manufacturer => { });
  let ddname = DeviceInfo.getModel();
  let buildNumber = DeviceInfo.getBuildNumber();
  let brand = DeviceInfo.getBrand();
  let temp1 = `${brand} ${ddname}`;
  let systemVersion = DeviceInfo.getSystemVersion();
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: appTheme.APP_BACKGROUND_COLOR }}
        edges={['top', 'bottom', 'left', 'right']}
      >
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        {/* <SafeAreaView
      style={{flex: 1, backgroundColor: appTheme.APP_BACKGROUND_COLOR}}> */}
        <KeyboardAwareScrollView>
          {internet ? (
            <View
              style={{
                backgroundColor: 'black',
                alignContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <Text style={{ color: 'white', fontSize: 16 }}>Online</Text>
              <Icon name="lightning-bolt-circle" color={'#90ee90'} size={18} />
            </View>
          ) : (
            <View
              style={{
                backgroundColor: 'black',
                alignContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <Text style={{ color: 'white', fontSize: 16 }}>Offline</Text>
              <Icon name="lightning-bolt-circle" color={'#ff4000'} size={18} />
            </View>
          )}
          <View
            style={{
              backgroundColor: appTheme.APP_BACKGROUND_COLOR,
              paddingHorizontal: width * 0.06,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity style={{ backgroundColor: 'rgba(0,0,0,0.2)', height: 35, width: 35, marginTop: 10, justifyContent: 'center', alignItems: 'center', marginRight: 10, borderRadius: 40  }} onPress={() => props?.navigation.goBack()}>
                  <Ionicons name="chevron-back" size={23} color={'black'} />
                </TouchableOpacity>
                <Text
                  style={{
                    color: 'black',
                    fontWeight: '500',
                    fontSize: 24,
                    marginTop: 10,
                  }}>
                  {t('signin')}
                </Text>
              </View>
              <View
                style={{
                  alignContent: 'flex-end',
                  alignItems: 'flex-end',
                  alignSelf: 'flex-end',
                  justifyContent: 'flex-end',
                  flexDirection: 'row',
                  paddingTop: 10,
                }}>
                {internet ? (
                  <Ionicons
                    name="language"
                    color={'black'}
                    size={22}
                    style={{
                      alignContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                      justifyContent: 'center',
                      padding: 5,
                    }}
                  />
                ) : (
                  <Ionicons
                    name="language"
                    color={'red'}
                    size={22}
                    style={{
                      alignContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                      justifyContent: 'center',
                      padding: 5,
                    }}
                  />
                )}
                <LanguageDropdown />
              </View>
            </View>
            <View>
              <Image
                source={require('../../../assets/images/login_banner.png')}
                style={{
                  resizeMode: 'cover',
                  height: height * 0.26,
                  width: width * 0.88,
                  borderRadius: 15,
                  marginTop: 15,
                }}
              />
              <View style={{ paddingTop: 10, width: width * 0.88 }}>
                <View
                  style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: '200',
                      color: colors.black,
                    }}>
                    {t('welcome')}{' '}
                  </Text>
                  <Text style={{ color: colors.black, fontWeight: '200' }}>
                    {t('loginorreg')}
                  </Text>
                </View>
              </View>
              <OTPComponent />
              <View
                style={{
                  paddingTop: 40,
                  paddingBottom: 30,
                  flexDirection: 'row',
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon name="phone" size={19} color={appTheme.NEW_PALLET} />
                <Text>
                  <Text> {t('needhelp')} </Text>
                  <Text
                    style={{
                      textDecorationLine: 'underline',
                      fontWeight: '400',
                    }}
                    onPress={() => Linking.openURL(`tel:+918103324701`)}>
                    {'+918103324701'}
                  </Text>
                </Text>
              </View>
              <View style={{ paddingTop: 10 }}>
                <View
                  style={{
                    paddingTop: 10,
                    paddingHorizontal: 3,
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View style={{ paddingLeft: 3 }}>
                    <Icon
                      name="check-circle"
                      size={19}
                      color={appTheme.NEW_PALLET}
                    />
                  </View>
                  <View style={{
                    paddingHorizontal: 1,
                    //  paddingBottom: 20
                  }}>
                    <Text>
                      <Text>
                        {t('accepttnc1')}{' '}
                        <Text
                          style={{
                            color: 'blue',
                            textDecorationLine: 'underline',
                          }}
                          onPress={() =>
                            Linking.openURL(
                              'https://drive.google.com/file/d/1peJX2f54DRz77XPU0DXhXh7fpo8jrT5c/view?usp=sharing',
                            )
                          }>
                          {t('accepttnc2')}
                        </Text>{' '}
                        {t('accepttnc3')}
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
