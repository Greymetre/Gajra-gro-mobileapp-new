import {
  View,
  Text,
  SafeAreaView,
  Image,
  FlatList,
  Pressable,
  Dimensions,
  Modal,
  BackHandler,
  Platform,
  StyleSheet,
  Alert,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
import appTheme from '../../../utils/appTheme';
import LottieView from 'lottie-react-native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import imagePath from '../../../constants/imagePath';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Header as HeaderRNE } from '@rneui/themed';
import {
  requestCustomerBalancePoint,
  requestDashboard,
  requestGetAuthCustomerInfo,
  requestGetBannerImages,
  requestGetSettingInfo,
  requestLogout,
  requestSeenWelcomeMessage,
  tokenSend
} from '../../../services/backend_helper';
import navigationStrings from '../../../constants/navigationStrings';
import { ViewAuthInfoInterface } from '../../../interfaces/auth.interface';
import {
  getSettingAsyncStorage,
  setSettingAsyncStorage,
} from '../../../services/auth_helper';
import { Linking } from 'react-native';
// import VersionCheck from 'react-native-version-check';
import { Card } from '@rneui/themed';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MI from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LanguageDropdown from '../../comman/LanguageDropdown/LanguageDropdown';
import { useTranslation } from 'react-i18next';

import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { useDispatch } from 'react-redux';
import { stackUpdate, userLogout } from '../../../redux';
import Carousel from 'react-native-reanimated-carousel';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { TAB_BAR_SPACE } from '../../../navigation/CustomTabBar';
import ShineOverlay from '../../comman/ShineOverlay';


const { width: screenWidth } = Dimensions.get('window');

/** "6.5", "6.5.0" and " 6.5 " are the same version; "6.5" and "6.50" are not. */
const isSameVersion = (a: any, b: any) => {
  const parts = (v: any) =>
    `${v ?? ''}`.trim().split('.').map(n => parseInt(n, 10) || 0);
  const x = parts(a);
  const y = parts(b);
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    if ((x[i] ?? 0) !== (y[i] ?? 0)) {
      return false;
    }
  }
  return true;
};

const Home = (props: any) => {
  const { t } = useTranslation();
  const [currentVersion, setCurrentVersion] = useState(DeviceInfo.getVersion());
  const [latestVersion, setLatestVersion] = useState('');
  const [balancePoint, setBalancePoint] = useState(0);
  const [RdeemPoint, setRdeemPoint] = useState(0);
  const [schemeActive, setSchemeActive] = useState(false);
  const { height, width } = Dimensions.get('window');
  const [schemeStartDate, setSchemeStartDate] = useState<Date>(new Date());
  const [profileData, setProfileData] = useState<ViewAuthInfoInterface>();
  const [bannerImageData, setBannerImageData] = useState([]);
  const [welcomePoints, setWelcomePoints] = useState(0);
  const [displayWelcomePoints, setDisplayWelcomePoints] = useState(false);
  const [thresholdPoint, setThresholdPoint] = useState(0);
  const [isLoadingDB, setIsLoadingDB] = useState(true);
  const [isLoadingWelcome, setIsLoadingWelcome] = useState(true);
  const [isLoadingVersion, setIsLoadingVersion] = useState(false);
  const [showLoad, setShowLoad] = useState(true);
  const [modalVisibleWP, setModalVisibleWP] = useState(true);
  const dispatch = useDispatch();

  // console.log('isLoadingVersion', isLoadingVersion);
  // console.log('isLoadingDB', isLoadingDB);
  // console.log('comapre', currentVersion === latestVersion);
  const nowDate = new Date();
  // const handlemodalclick = () => {
  //   setModalVisible(false);
  // };
  const getAsyncStartDate = async () => {
    const settings = await getSettingAsyncStorage();
    const sett = await JSON.parse(settings);
    setSchemeStartDate(new Date(sett.loyaltyscheme.startedAt));
    // console.log('Scheme Date - ', schemeStartDate);
    // console.log('Now Date - ', nowDate);
    // console.log('Compare date', schemeStartDate.getTime() > nowDate.getTime());

    if (schemeStartDate.getTime() < nowDate.getTime()) {
      console.log('Scheme Date is less than current date time');
      setSchemeActive(true);
    }
  };
  const fetchSettingInfo = async () => {
    await requestGetSettingInfo()
      .then(res => {
        if (res.isError == false) {
          console.log('API SUCCESS');

          setSettingAsyncStorage(res.data);
        }
      })
      .catch(error => {
        console.log('Response: ', error);
      });
  };
  const fetchBannerImages = async () => {
    await requestGetBannerImages({})
      .then(res => {
        if (res.isError === false) {
          console.log(res?.data?.banner, 'bannnn')
          setBannerImageData(res?.data?.banner);
          console.log(res?.data?.banner);
          setWelcomePoints(res?.data?.welcome);
        }
      })
      .catch(error => {
        console.log('Response: ', error);
      });
  };


  //logout functionality during inactive user
  const clearAsyncStorage = async () => {
    await AsyncStorage.removeItem('TOKEN');
    await AsyncStorage.removeItem('SETTING');
  };
  const logout = async () => {
    await requestLogout({})
      .then(res => {
        if (res.isError == false) {
          clearAsyncStorage();
          dispatch(userLogout(res.data));
          dispatch(stackUpdate('auth'));
        }
      })
      .catch(error => {
        console.log('Response', error);
      });
  };
  const fetchGetAuthCustomerInfo = async () => {
    await requestGetAuthCustomerInfo({})
      .then(res => {
        if (res.isError == false) {
          console.log(res?.data, 'data dtaa ')
          if (res?.data?.active == false) {
            logout()
          }
          setProfileData(res.data);
          tokenDeviceSend(res.data?._id)
        }
      })
      .catch(error => {
        console.log('Response: ', error);
      });
  };
  // const navigation = useNavigation<NavigationInterFace>();
  const navigation = useNavigation();
  const welcomeFunction = async () => {
    setIsLoadingWelcome(true);
    // setModalVisible(!modalVisible);
    // setDisplayWelcomePoints(false);
    await requestSeenWelcomeMessage({})
      .then(res => {
        console.log(res);
        if (res.isError == false) {
          // setDisplayWelcomePoints(false);
        }
      })
      .catch(error => {
        console.log('Response: ', error);
      });
    await setIsLoadingWelcome(false);
  };
  useEffect(() => {
    requestDashboard()
      .then(res => {
        console.log(res, 'hshhs')
        if (res.isError == false) {
          setIsLoadingDB(true);
          console.log('Dashoard Settings', res);
          if (res?.data?.has_seen_welcome === false) {
            setDisplayWelcomePoints(true);
          }
          // Force update: the CRM's loyalty_app_version must match the installed
          // version exactly (read from the build, not hardcoded). Any other
          // version - older or newer - shows the blocking update popup.
          // Android only for now: the iOS build is versioned separately.
          const installedVersion = DeviceInfo.getVersion();
          const requiredVersion = res?.data?.loyalty_app_version;
          setLatestVersion(requiredVersion);
          setCurrentVersion(installedVersion);
          setIsLoadingVersion(
            Platform.OS === 'android' &&
              !!requiredVersion &&
              !isSameVersion(installedVersion, requiredVersion),
          );
          setThresholdPoint(res?.data?.threshold);
          setIsLoadingDB(false);
        }
      })
      .catch(error => {
        console.log('Response: ', error);
      });

  }, []);

  const tokenDeviceSend = async (id: any) => {
    var deviceToken = await AsyncStorage.getItem('fcmToken');
    var data = {
      deviceToken: deviceToken,
      customerid: id
    };
    console.log(data, deviceToken, "deviocetopkensadhfasdfsadfdf")
    tokenSend(data)
      .then(res => {
        console.log(res, "resresresresrerser")
      })
      .catch(error => {
        console.log('Response: ', error);
      });
  }

  // useEffect(() => {
  //   // const cversion = VersionCheck.getCurrentVersion();
  //   setCurrentVersion('5.8');
  //   if (latestVersion != currentVersion) {
  //     setIsLoadingVersion(true);
  //   }
  //   console.log('Current Version App - ', currentVersion);
  //   console.log('Latest Version App - ', latestVersion);
  //   setIsLoadingVersion(false);
  // }, [latestVersion]);
  useEffect(() => {
    requestCustomerBalancePoint({})
      .then(res => {
        if (res.isError == false) {
          // console.log(res.data.balance);
          setBalancePoint(res.data.balance);
          // setBalancePoint(1000);
          // setRdeemPoint(300);
          setRdeemPoint(res.data.redeempoint);
        }
      })
      .catch(error => {
        console.log('Response: ', error);
      });
  }, []);
  useEffect(() => {
    fetchSettingInfo();
    fetchBannerImages();
    getAsyncStartDate();

  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchGetAuthCustomerInfo();
    }, []),
  )

  function handleBackButtonClick() {
    BackHandler.exitApp();
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
  // Each action gets its own accent so the grid is easy to scan.
  // QR Scan is the main job of the app, so it's the dark "hero" tile.
  const quickActions = [
    {
      key: 'scan',
      screenPath: 'Coupon Scan',
      translate_key: 'couponscan',
      subtitle: 'Scan & earn points',
      hero: true,
      tint: '#FFF1D2',
      color: appTheme.NEW_PALLET,
      renderIcon: (color: string) => <MI name="qr-code-scanner" size={24} color={color} />,
    },
    {
      key: 'transaction',
      screenPath: 'History',
      translate_key: 'transaction',
      subtitle: 'Points earned',
      tint: '#E8F0FF',
      color: '#2F6FED',
      renderIcon: (color: string) => <Icon name="credit-card" size={21} color={color} />,
    },
    {
      key: 'redeem',
      screenPath: 'RedemptionFinal',
      translate_key: 'redeem',
      subtitle: 'Use your points',
      tint: '#E4F6EC',
      color: '#1E9E5A',
      renderIcon: (color: string) => <Icon name="box" size={21} color={color} />,
    },
    {
      key: 'redeemHistory',
      screenPath: 'Redeem History',
      translate_key: 'redemptionhistory',
      subtitle: 'Past redemptions',
      tint: '#F0E9FE',
      color: '#7C4DDB',
      renderIcon: (color: string) => <Ionicons name="gift-outline" size={23} color={color} />,
    },
  ];

  const banners: string[] =
    Array.isArray(bannerImageData) && bannerImageData.length ? bannerImageData : [];
  const [activeBanner, setActiveBanner] = useState(0);
  const bannerWidth = width - 32;

  // Milestone: points still needed before the first redemption unlocks.
  const pointsToMilestone = thresholdPoint - balancePoint;
  const showMilestone = pointsToMilestone > 0 && RdeemPoint === 0;
  const milestoneProgress =
    thresholdPoint > 0 ? Math.min(Math.max(balancePoint / thresholdPoint, 0), 1) : 0;

  return (
    // White behind the status bar so it blends with the header; the page itself is grey.
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={homeStyles.header}>
        <Pressable
          onPress={() => navigation.navigate(navigationStrings.SIDEMENU)}
          hitSlop={6}
          style={({ pressed }) => [homeStyles.menuButton, pressed && { opacity: 0.6 }]}>
          <Ionicons name="menu" size={22} color={appTheme.DARK_BOTTOMTAB} />
        </Pressable>
        <View style={homeStyles.brand}>
          <View style={homeStyles.logoRing}>
            <Image source={imagePath.APP_LOGO} style={homeStyles.headerLogo} />
          </View>
          <Text style={homeStyles.headerTitle} numberOfLines={2}>
            {t('home.title')}
          </Text>
        </View>
        <LanguageDropdown variant="pill" />
      </View>
      <ScrollView style={{ backgroundColor: '#F7F7F7' }} showsVerticalScrollIndicator={false}>
        {isLoadingVersion && !isLoadingDB && (
          <Modal animationType="slide" transparent={true}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <LottieView
                  style={{ height: 200, width: 200 }}
                  source={require('../../../../assets/images/alert.json')}
                  autoPlay
                  loop
                />
                <Text style={styles.modalText}>{`${t('updatenow')}`}</Text>
                <Text style={styles.modalText}>
                  {`${t('updatemessage', {
                    cversion: currentVersion,
                    lversion: latestVersion,
                  })}`}
                </Text>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => {
                    Linking.openURL(
                      'https://play.google.com/store/apps/details?id=com.tfl.gajragear',
                    );
                  }}>
                  <Text style={styles.textStyle}>{`${t('updatenow')}`}</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        )}

        {/* Greeting */}
        <View style={homeStyles.greetingRow}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={homeStyles.greetingHello}>Welcome back 👋</Text>
            <Text style={homeStyles.greetingName} numberOfLines={1}>
              {profileData?.firmName}
            </Text>
            <Text style={homeStyles.greetingTagline}>{t('home.tagline')}</Text>
          </View>
          <Pressable onPress={() => navigation.navigate(navigationStrings.PROFILE)}>
            {profileData?.avatar ? (
              <Image
                source={{ uri: `${imagePath.IMAGE_URL}${profileData?.avatar}` }}
                style={homeStyles.avatar}
              />
            ) : (
              <View style={[homeStyles.avatar, homeStyles.avatarPlaceholder]}>
                <Ionicons name="person" size={24} color={appTheme.DARK_BOTTOMTAB} />
              </View>
            )}
          </Pressable>
        </View>

        {/* Points */}
        <LinearGradient
          colors={['#F9DC9E', appTheme.NEW_PALLET, '#F2BE55']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={homeStyles.pointsCard}>
          <View style={homeStyles.pointsDecorLarge} />
          <View style={homeStyles.pointsDecorSmall} />
          <ShineOverlay />
          <View style={homeStyles.pointsTopRow}>
            <View style={{ flex: 1 }}>
              <Text style={homeStyles.pointsLabel}>
                {t('home.totaltag')} {t('points')}
              </Text>
              <View style={homeStyles.pointsValueRow}>
                <Ionicons name="star" size={24} color={appTheme.DARK_BOTTOMTAB} />
                <Text style={homeStyles.pointsValue}>{balancePoint}</Text>
              </View>
            </View>
            <Pressable
              style={homeStyles.viewDetails}
              onPress={() => navigation.navigate(navigationStrings.HISTORY)}>
              <Text style={homeStyles.viewDetailsText}>{t('viewdetails')}</Text>
              <Ionicons name="chevron-forward" size={14} color="white" />
            </Pressable>
          </View>

          {showMilestone ? (
            <View style={homeStyles.milestone}>
              <View style={homeStyles.progressTrack}>
                <View
                  style={[homeStyles.progressFill, { width: `${milestoneProgress * 100}%` }]}
                />
              </View>
              <Text style={homeStyles.milestoneText}>
                {t('milestonetrgt1')}{' '}
                <Text style={{ fontWeight: '800' }}>{pointsToMilestone}</Text>{' '}
                {t('milestonetrgt2')}
              </Text>
            </View>
          ) : null}
        </LinearGradient>

        {/* Banners */}
        {banners.length ? (
          <View style={{ marginTop: 18 }}>
            <Carousel
              loop
              width={width}
              height={bannerWidth / 2}
              autoPlay={banners.length > 1}
              autoPlayInterval={3500}
              data={banners}
              scrollAnimationDuration={800}
              onSnapToItem={index => setActiveBanner(index)}
              renderItem={({ item }: { item: string }) => (
                <View style={homeStyles.bannerSlide}>
                  <Image
                    source={{ uri: imagePath.IMAGE_URL + item }}
                    style={[homeStyles.bannerImage, { width: bannerWidth, height: bannerWidth / 2 }]}
                  />
                </View>
              )}
            />
            {banners.length > 1 ? (
              <View style={homeStyles.dots}>
                {banners.map((_, i) => (
                  <View key={i} style={[homeStyles.dot, i === activeBanner && homeStyles.dotActive]} />
                ))}
              </View>
            ) : null}
          </View>
        ) : null}

        {/* Quick actions */}
        <Text style={homeStyles.sectionTitle}>Quick Actions</Text>
        <View style={homeStyles.actionsGrid}>
          {quickActions.map(action => (
            <Pressable
              key={action.key}
              onPress={() => navigation.navigate(action.screenPath)}
              style={({ pressed }) => [
                homeStyles.actionWrap,
                action.hero && homeStyles.actionWrapHero,
                pressed && homeStyles.pressed,
              ]}>
              <LinearGradient
                colors={
                  action.hero
                    ? ['#2B2829', appTheme.DARK_BOTTOMTAB, '#4A4344']
                    : ['#FFFFFF', action.tint]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  homeStyles.actionTile,
                  !action.hero && { borderColor: action.tint },
                ]}>
                <View
                  style={[
                    homeStyles.actionDecor,
                    {
                      backgroundColor: action.hero
                        ? 'rgba(247,209,133,0.12)'
                        : action.color + '14',
                    },
                  ]}
                />
                {action.hero ? <ShineOverlay /> : null}
                <View style={homeStyles.actionTopRow}>
                  <View
                    style={[
                      homeStyles.actionIcon,
                      { backgroundColor: action.hero ? appTheme.NEW_PALLET : action.color },
                    ]}>
                    {action.renderIcon(action.hero ? appTheme.DARK_BOTTOMTAB : 'white')}
                  </View>
                  <View
                    style={[
                      homeStyles.actionArrow,
                      { backgroundColor: action.hero ? 'rgba(255,255,255,0.14)' : 'white' },
                    ]}>
                    <Ionicons
                      name="arrow-forward"
                      size={14}
                      color={action.hero ? appTheme.NEW_PALLET : action.color}
                      style={{ transform: [{ rotate: '-45deg' }] }}
                    />
                  </View>
                </View>
                <Text
                  style={[homeStyles.actionTitle, action.hero && { color: 'white' }]}
                  numberOfLines={1}>
                  {t(action.translate_key)}
                </Text>
                <Text
                  style={[
                    homeStyles.actionSubtitle,
                    action.hero && { color: 'rgba(255,255,255,0.65)' },
                  ]}
                  numberOfLines={1}>
                  {action.subtitle}
                </Text>
              </LinearGradient>
            </Pressable>
          ))}
        </View>

        {/* e-Catalogue (coming soon — webview paused for now) */}
        <Pressable
          onPress={() =>
            Alert.alert('Coming Soon', 'e-Catalogue will be available soon. Stay tuned!')
          }
          style={({ pressed }) => [homeStyles.catalogueWrap, pressed && homeStyles.pressed]}>
          <LinearGradient
            colors={['#2B2829', appTheme.DARK_BOTTOMTAB, '#4A4344']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={homeStyles.catalogueCard}>
            <View style={homeStyles.catalogueDecor} />
            <View style={homeStyles.catalogueIcon}>
              <Ionicons name="albums-outline" size={24} color={appTheme.DARK_BOTTOMTAB} />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={homeStyles.catalogueTitle}>e-Catalogue</Text>
                <View style={homeStyles.soonPill}>
                  <Ionicons name="time-outline" size={10} color="#B7791F" />
                  <Text style={homeStyles.soonPillText}>Coming Soon</Text>
                </View>
              </View>
              <Text style={homeStyles.catalogueSubtitle}>Browse our complete product range</Text>
            </View>
            <View style={homeStyles.catalogueCta}>
              <Ionicons name="lock-closed" size={16} color={appTheme.DARK_BOTTOMTAB} />
            </View>
          </LinearGradient>
        </Pressable>

        {/* Room for the floating tab bar */}
        <View style={{ height: TAB_BAR_SPACE }} />

        {/* Welcome points are only given to mechanics, so retailers never see this popup */}
        {displayWelcomePoints === true && profileData?.customerType === 'Mechanic' ? (
          <View style={styles.centeredView}>
            <Modal animationType="slide" transparent={true} visible={modalVisibleWP}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <LottieView
                    style={{ height: 200, width: 200 }}
                    source={require('../../../../assets/images/success.json')}
                    autoPlay
                    speed={0.6}
                    loop
                  />
                  <Text style={styles.modalText}>{`${t('registrtionsuccess')}`}</Text>
                  <Text style={styles.modalText}>
                    {`${t('redemptionmsgtxt1', { wpoints: welcomePoints })}`}
                  </Text>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => {
                      setModalVisibleWP(false);
                      setDisplayWelcomePoints(false);
                      welcomeFunction();
                    }}>
                    <Text style={styles.textStyle}>Okay</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const homeStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
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
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F4F4F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  logoRing: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    borderColor: appTheme.NEW_PALLET,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E1C1D',
    overflow: 'hidden',
  },
  headerLogo: {
    resizeMode: 'contain',
    height: 34,
    width: 34,
  },
  headerTitle: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    lineHeight: 18,
    color: '#1C1C1C',
    fontWeight: '700',
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
  },
  greetingHello: {
    fontSize: 13,
    color: '#7A7A7A',
  },
  greetingName: {
    fontSize: 22,
    fontWeight: '700',
    color: 'black',
    marginTop: 2,
  },
  greetingTagline: {
    fontSize: 12,
    color: '#7A7A7A',
    marginTop: 2,
  },
  avatar: {
    height: 52,
    width: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: appTheme.NEW_PALLET,
  },
  avatarPlaceholder: {
    backgroundColor: '#FFF3DA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointsCard: {
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 20,
    padding: 18,
    overflow: 'hidden',
    shadowColor: '#C9962F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  pointsDecorLarge: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.18)',
    top: -60,
    right: -40,
  },
  pointsDecorSmall: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.14)',
    bottom: -30,
    left: -20,
  },
  pointsTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  pointsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A3A14',
  },
  pointsValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  pointsValue: {
    fontSize: 38,
    fontWeight: '800',
    color: 'black',
    marginLeft: 6,
  },
  viewDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appTheme.DARK_BOTTOMTAB,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  viewDetailsText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 2,
  },
  milestone: {
    marginTop: 14,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.6)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: appTheme.DARK_BOTTOMTAB,
  },
  milestoneText: {
    fontSize: 12,
    color: '#4A3A14',
    marginTop: 8,
  },
  bannerSlide: {
    alignItems: 'center',
  },
  bannerImage: {
    borderRadius: 16,
    resizeMode: 'cover',
    backgroundColor: '#EDEDED',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D0D0D0',
    marginHorizontal: 3,
  },
  dotActive: {
    width: 18,
    backgroundColor: appTheme.DARK_BOTTOMTAB,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'black',
    marginHorizontal: 16,
    marginTop: 22,
    marginBottom: 10,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 16,
  },
  actionWrap: {
    width: '48%',
    marginBottom: 12,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  actionWrapHero: {
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 6,
  },
  actionTile: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'transparent',
    padding: 14,
    overflow: 'hidden',
  },
  actionDecor: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    right: -38,
    bottom: -48,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  actionTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  actionIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionArrow: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1C1C',
  },
  actionSubtitle: {
    fontSize: 11.5,
    color: '#8A8A8A',
    marginTop: 3,
  },
  catalogueWrap: {
    marginHorizontal: 16,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 5,
  },
  catalogueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    padding: 16,
    overflow: 'hidden',
  },
  catalogueDecor: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    right: -40,
    top: -60,
    backgroundColor: 'rgba(247,209,133,0.12)',
  },
  catalogueIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: appTheme.NEW_PALLET,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catalogueTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: 'white',
  },
  catalogueSubtitle: {
    fontSize: 11.5,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 3,
  },
  soonPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1D2',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginLeft: 8,
  },
  soonPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#B7791F',
    marginLeft: 3,
  },
  catalogueCta: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: appTheme.NEW_PALLET,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Home;
