import React, { useState, useEffect, useRef } from 'react';
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
  Platform,
  Pressable,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import GearShape from '../comman/GearShape';
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
    // Android-only API; on iOS it just logs a warning.
    if (Platform.OS !== 'android') {
      return;
    }
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
  // Gear turning slowly around the logo, same as the onboarding screen.
  const spin = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 14000, easing: Easing.linear, useNativeDriver: true }),
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);
  const gearRotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    // Router already pads for the status bar, so only the other edges here.
    <SafeAreaView style={lStyles.screen} edges={['bottom', 'left', 'right']}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={lStyles.header}>
          <Pressable
            onPress={() => props?.navigation.goBack()}
            hitSlop={6}
            style={({ pressed }) => [lStyles.backButton, pressed && { opacity: 0.6 }]}>
            <Ionicons name="chevron-back" size={22} color={appTheme.DARK_BOTTOMTAB} />
          </Pressable>
          <View style={[lStyles.statusPill, { backgroundColor: internet ? '#E4F6EC' : '#FDECEA' }]}>
            <View style={[lStyles.statusDot, { backgroundColor: internet ? '#1E9E5A' : '#D93025' }]} />
            <Text style={[lStyles.statusText, { color: internet ? '#1E9E5A' : '#D93025' }]}>
              {internet ? 'Online' : 'Offline'}
            </Text>
          </View>
          <LanguageDropdown variant="pill" />
        </View>

        {/* Brand */}
        <LinearGradient
          colors={['#FBF201', '#FDF98A', '#FFFFFF']}
          locations={[0, 0.5, 1]}
          style={lStyles.brandCard}>
          <View style={lStyles.brandDecor} />
          <View style={lStyles.logoStage}>
            <View style={lStyles.logoGlow} />
            <Animated.View style={[lStyles.gear, { transform: [{ rotate: gearRotate }] }]}>
              <GearShape size={112} teeth={20} color="rgba(55,52,53,0.16)" holeRatio={0.84} toothDepth={0.1} />
            </Animated.View>
            <Image source={require('../../../assets/images/logo.png')} style={lStyles.logo} resizeMode="contain" />
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={lStyles.brandName}>GAJRA GEARS</Text>
            <Text style={lStyles.brandTagline}>ENGINEERED FOR UPTIME</Text>
          </View>
        </LinearGradient>

        {/* Welcome */}
        <Text style={lStyles.title}>{t('signin')}</Text>
        <Text style={lStyles.subtitle}>
          {t('welcome')}! {t('loginorreg')}
        </Text>

        <OTPComponent />

        {/* Help + terms */}
        <Pressable
          onPress={() => Linking.openURL(`tel:+918103324701`)}
          style={({ pressed }) => [lStyles.helpCard, pressed && { opacity: 0.8 }]}>
          <View style={lStyles.helpIcon}>
            <Icon name="phone" size={18} color={appTheme.DARK_BOTTOMTAB} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={lStyles.helpTitle}>{t('needhelp')}</Text>
            <Text style={lStyles.helpNumber}>+91 81033 24701</Text>
          </View>
          <Ionicons name="call" size={18} color="#1E9E5A" />
        </Pressable>

        <View style={lStyles.termsRow}>
          <Icon name="shield-check" size={16} color="#1E9E5A" />
          <Text style={lStyles.termsText}>
            {t('accepttnc1')}{' '}
            <Text
              style={lStyles.termsLink}
              onPress={() =>
                Linking.openURL(
                  'https://drive.google.com/file/d/1peJX2f54DRz77XPU0DXhXh7fpo8jrT5c/view?usp=sharing',
                )
              }>
              {t('accepttnc2')}
            </Text>{' '}
            {t('accepttnc3')}
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const lStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  brandCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    borderRadius: 22,
    padding: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F2EC7A',
  },
  brandDecor: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    right: -50,
    top: -70,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  logoStage: {
    width: 112,
    height: 112,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGlow: {
    position: 'absolute',
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  gear: {
    position: 'absolute',
    width: 112,
    height: 112,
  },
  logo: {
    width: 92,
    height: 92,
  },
  brandName: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 3,
    color: '#1C1C1C',
  },
  brandTagline: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    color: '#5A5A5A',
    marginTop: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1C1C1C',
    marginTop: 22,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B6B6B',
    marginTop: 4,
  },
  helpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 14,
  },
  helpIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFF1D2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpTitle: {
    fontSize: 12,
    color: '#8A8A8A',
  },
  helpNumber: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1C1C',
    marginTop: 2,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 16,
    paddingHorizontal: 4,
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: '#6B6B6B',
    lineHeight: 18,
    marginLeft: 8,
  },
  termsLink: {
    color: '#2F6FED',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
