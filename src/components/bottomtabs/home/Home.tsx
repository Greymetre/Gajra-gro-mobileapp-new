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
import { useDispatch } from 'react-redux';
import { stackUpdate, userLogout } from '../../../redux';
import Carousel from 'react-native-reanimated-carousel';
import FastImage from 'react-native-fast-image';


const { width: screenWidth } = Dimensions.get('window');

const Home = (props: any) => {
  const { t } = useTranslation();
  const [currentVersion, setCurrentVersion] = useState('5.8');
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
          setLatestVersion(res?.data?.loyalty_app_version);
          setCurrentVersion('5.8');
          if (res?.data?.loyalty_app_version != '5.8') {
            setIsLoadingVersion(true);
          } else {
            setIsLoadingVersion(false);
          }
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
  let smallCard = [
    {
      title: 'Coupon',
      screenPath: 'Coupon Scan',
      iconname: 'percent',
      translate_key: 'couponscan',
    },
    {
      title: 'Transaction',
      screenPath: 'History',
      iconname: 'credit-card',
      translate_key: 'transaction',
    },
    {
      title: 'Redeem',
      screenPath: 'RedemptionFinal',
      iconname: 'box',
      translate_key: 'redeem',
    },
    {
      title: 'History',
      screenPath: 'Redeem History',
      iconname: 'gift',
      translate_key: 'redemptionhistory',
    },
  ];
  const renderItem2 = ({ item }) => (
    <View style={{
      backgroundColor: '#fff',
      borderRadius: 8,
      height: 250,
      padding: 20,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Image source={{ uri: imagePath.IMAGE_URL + item }} style={{
        width: '100%',
        height: 170,
        resizeMode: 'cover',
        borderRadius: 8,
      }} />
      {/* <Text style={styles.title}>{item.title}</Text> */}
    </View>
  );
  const renderItem = ({ item }: { item: any; index: any }) => {
    console.log(item, 'itemitemitem')
    return (
      <View
        style={{
          marginHorizontal: responsiveWidth(4),
          marginTop: responsiveHeight(2),
        }}>

        <Image
          style={{ height: 150, width: 300, borderRadius: 18 }}
          source={{ uri: imagePath.IMAGE_URL + item }}
        />
      </View>
    );
  };
  // const StaticRenderItem = ({item}: {item: any; index: any}) => {
  //   return (
  //     <View
  //       style={{
  //         marginHorizontal: responsiveWidth(2),
  //         marginTop: responsiveHeight(2),
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //       }}>
  //       <Image
  //         style={{height: 150, width: 280, borderRadius: 18}}
  //         source={item.image_path}
  //       />
  //     </View>
  //   );
  // };
  const renderNewCoupon = ({ item }: { item: any }) => {
    return (
      <View
        style={{
          justifyContent: 'space-around',
          alignContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          flexDirection: 'column',
          flexWrap: 'wrap',
        }}>
        <Pressable
          onPress={() => {
            navigation.navigate(item.screenPath);
          }}>
          <Card
            containerStyle={{
              paddingHorizontal: 10,
              marginHorizontal: 10,
              borderRadius: 16,
              width: width * 0.5 - 20,
              elevation: 4,
            }}>
            <View style={{ alignContent: 'center', alignItems: 'center' }}>
              <View
                style={{
                  backgroundColor: appTheme.NEW_PALLET,
                  height: 40,
                  width: 40,
                  borderRadius: 40 / 2,
                  alignContent: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {(() => {
                  switch (item.title) {
                    case 'Coupon':
                      return (
                        <MI name="qr-code-scanner" size={25} color="black" />
                      );
                    case 'History':
                      return (
                        <Ionicons name="gift-outline" size={25} color="black" />
                      );
                    default:
                      return (
                        <Icon name={item.iconname} size={25} color="black" />
                      );
                  }
                })()}
              </View>
              <Text
                style={{
                  alignContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}>
                {t(item.translate_key)}
              </Text>
            </View>
          </Card>
        </Pressable>
        <View style={{ marginTop: 10 }}></View>
      </View>
    );
  };
  return (
    <SafeAreaView style={{ backgroundColor: appTheme.APP_BACKGROUND_COLOR }}>
      <HeaderRNE
        centerComponent={
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={imagePath.APP_LOGO}
              style={{
                resizeMode: 'contain',
                height: 40,
                width: 40,
                borderRadius: 40 / 2,
              }}
            />
            <Text
              style={{
                paddingHorizontal: 10,
                fontSize: 15,
                color: 'black',
                fontWeight: '500',
              }}>
              {t('home.title')}{' '}
            </Text>
          </View>
        }
        leftComponent={
          <TouchableOpacity
            containerStyle={{ padding: 5 }}
            onPress={() => navigation.navigate(navigationStrings.SIDEMENU)}>
            <Ionicons name="menu" size={25} color={'black'} />
          </TouchableOpacity>
        }
        backgroundColor="white"
        placement="left"
        rightComponent={<LanguageDropdown />}
        rightContainerStyle={{ paddingRight: 5 }}
        // containerStyle={{
        //   bottom: Platform.OS === "android"
        //     ? Platform.OS === "android" && Platform.Version <= 34
        //       ?0
        //       : height * 0.00
        //     : 0
        // }}
        containerStyle={{ marginTop: -45 }}
      />
      <ScrollView >
        <View
          style={{
            justifyContent: 'center',
          }}>
          {isLoadingVersion &&
            !isLoadingDB &&
            // parseFloat(currentVersion) < parseFloat(latestVersion) ? (
            <Modal animationType="slide" transparent={true}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <LottieView
                    style={{
                      height: 200,
                      width: 200,
                    }}
                    source={require('../../../../assets/images/alert.json')}
                    autoPlay
                    loop
                  />
                  <Text style={styles.modalText}>{`${t(
                    'updatenow',
                  )}`}</Text>
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
                    <Text style={styles.textStyle}>{`${t(
                      'updatenow',
                    )}`}</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          }
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: responsiveHeight(2),
              marginHorizontal: width * 0.06,
            }}>
            <View>
              <Text style={{ fontSize: responsiveHeight(2.5) }}>
                {profileData?.firmName}
              </Text>
              <Text
                style={{
                  fontWeight: '500',
                  marginTop: responsiveHeight(0.5),
                }}>
                {t('home.tagline')}
              </Text>
            </View>
            {
              profileData?.avatar ? (
                <Image
                  source={{ uri: `${imagePath.IMAGE_URL}${profileData?.avatar}` }}
                  style={{
                    resizeMode: 'contain',
                    height: 46,
                    width: 46,
                    borderRadius: 46 / 2,
                  }}
                />
              ) : (

                <Ionicons name="person-circle-outline" size={46} />
              )
            }
          </View>
          <View style={{ flex: 1 }}>
            <Card
              containerStyle={{
                borderRadius: 16,
                shadowOpacity: 1,
                elevation: 5,
                backgroundColor: appTheme.NEW_PALLET,
              }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 0.5 }}>
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: '600',
                      color: 'black',
                    }}>
                    {t('home.totaltag')}
                  </Text>
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: '600',
                      color: 'black',
                    }}>
                    {t('points')}
                  </Text>
                  <Pressable
                    onPress={() => {
                      navigation.navigate(navigationStrings.HISTORY);
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignContent: 'center',
                        paddingTop: 10,
                      }}>
                      <Text style={{ marginRight: 6, fontSize: 15 }}>
                        {t('viewdetails')}
                      </Text>
                      <AntDesign
                        name="rightcircle"
                        color={'black'}
                        size={responsiveWidth(4.5)}
                      />
                    </View>
                  </Pressable>
                </View>
                <View
                  style={{
                    flex: 0.5,
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                  }}>
                  <Text
                    style={{
                      fontSize: 32,
                      fontWeight: '700',
                      color: 'black',
                    }}>
                    {balancePoint}
                  </Text>
                </View>
              </View>
            </Card>
            {thresholdPoint - balancePoint > 0 && RdeemPoint === 0 ? (
              <Text
                style={{
                  width: width * 0.84,
                  marginTop: 10,
                  fontSize: 15,
                  fontWeight: '500',
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignContent: 'center',
                  alignSelf: 'center',
                }}>
                <Text>{t('milestonetrgt1')} </Text>
                <Text style={{ color: 'green' }}>
                  {thresholdPoint - balancePoint}
                </Text>
                <Text> {t('milestonetrgt2')}</Text>
              </Text>
            ) : null}
          </View>
          {/* <Carousel width={50} loop autoPlay={true} data={bannerImageData}>
                <Text>Test</Text>
              </Carousel> */}
          <View>
            {/* {console.log(bannerImageData, 'bannerImageDatabannerImageData')}
                {Array.isArray(bannerImageData) && bannerImageData.length ? (
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    data={bannerImageData}
                    renderItem={renderItem}
                  />
                ) : (
                  ''
                )} */}
            <Carousel
              loop
              width={width}
              height={width / 2}
              autoPlay={true}
              data={(Array.isArray(bannerImageData) && bannerImageData.length) ? bannerImageData : []}
              scrollAnimationDuration={1000}
              // onSnapToItem={(index) => console.log('current index:', index)}
              onSnapToItem={(index) => { }}
              renderItem={renderItem2}
            />
            {/* <Carousel
                  data={(Array.isArray(bannerImageData) && bannerImageData.length) ?  bannerImageData : []}
                  renderItem={renderItem2}
                  width={screenWidth}
                  
                  loop={true}
                  autoplay={true}
                  autoplayDelay={1000}
                  autoplayInterval={3000}
                /> */}
            <FlatList
              numColumns={2}
              data={smallCard}
              renderItem={renderNewCoupon}
            />
            <Pressable style={styles.eCataologue} onPress={()=>{
              props?.navigation.navigate('CatalogueWebView')
            }}>
              <View
                style={{
                  backgroundColor: appTheme.NEW_PALLET,
                  height: 40,
                  width: 40,
                  borderRadius: 40 / 2,
                  alignContent: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Ionicons name="albums-outline" size={25} color="black" />

              </View>
              <Text
                style={{
                  alignContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}>
                {'e-Catalogue'}
              </Text>
            </Pressable>
            <View style={{ height: 150 }} />
            {displayWelcomePoints === true ? (
              <View style={styles.centeredView}>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisibleWP}>
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <LottieView
                        style={{
                          height: 200,
                          width: 200,
                        }}
                        source={require('../../../../assets/images/success.json')}
                        autoPlay
                        speed={0.6}
                        loop
                      />
                      <Text style={styles.modalText}>
                        {`${t('registrtionsuccess')}`}
                      </Text>
                      <Text style={styles.modalText}>
                        {`${t('redemptionmsgtxt1', {
                          wpoints: welcomePoints,
                        })}
                            `}
                      </Text>

                      <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => {
                          console.log('button clicke');
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
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
