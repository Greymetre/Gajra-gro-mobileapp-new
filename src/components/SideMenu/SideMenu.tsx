import {
  View,
  Image,
  Linking,
  Pressable,
  BackHandler,
  Dimensions,
  StyleSheet,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import navigationStrings from '../../constants/navigationStrings';
import { useNavigation } from '@react-navigation/native';
import { DrawerItem } from '@react-navigation/drawer';
import colors from '../../styles/colors';
import { SafeAreaView } from 'react-native';
import { Header as HeaderRNE } from '@rneui/themed';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationInterFace } from '../../interfaces/navigationType.interface';
import {
  requestGetAuthCustomerInfo,
  requestGetSettingInfo,
  requestLogout,
} from '../../services/backend_helper';
import { ViewAuthInfoInterface } from '../../interfaces/auth.interface';
import {
  isUserLoggedIn,
  getSettingAsyncStorage,
} from '../../services/auth_helper';
import { useDispatch, useSelector } from 'react-redux';
import { ApplicationState, stackUpdate, userLogout } from '../../redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import appTheme from '../../utils/appTheme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import DashedLine from 'react-native-dashed-line';
import { Text } from '@rneui/base';
const { width } = Dimensions.get('window');

const SideMenu = (props: any) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [profileData, setProfileData] = useState<ViewAuthInfoInterface>({});
  const [settingCatalogueData, setSettingCatalogueData] = useState({});
  const [settingSocialMedia, setSettingSocialMedia] = useState({});
  const [settingHelpdesk, setSettingHelpdesk] = useState({});
  const [newSetting, setNewSetting] = useState();
  const dispatch = useDispatch();
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

  // const renderLabel = () => {
  //   if (value || isFocus) {
  //     return (
  //       <Text style={[{color: 'red'}, isFocus && {color: 'blue'}]}>
  //         Dropdown label
  //       </Text>
  //     );
  //   }
  //   return null;
  // };
  // 35;
  const fetchSettingInfo = async () => {
    await requestGetSettingInfo()
      .then(res => {
        if (res.isError == false) {
          setNewSetting(res.data);
          console.log(res);
        }
      })
      .catch(error => {
        console.log('Response: ', error);
      });
  };
  const clearAsyncStorage = async () => {
    await AsyncStorage.removeItem('TOKEN');
    await AsyncStorage.removeItem('SETTING');
  };
  const data = useSelector((state: ApplicationState) => state.stackReducer);
  // To work on logout
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
        // console.log(getAuthToken());
        if (res.isError == false) {
          setProfileData(res.data);
        }
      })
      .catch(error => {
        console.log('Response: ', error);
      });
  };
  const fetchSettingAsyncStorage = async () => {
    const settings = await getSettingAsyncStorage();
    const { catalogue, socialmedia, helpdesk } = await JSON.parse(settings);
    setSettingCatalogueData(catalogue);
    setSettingSocialMedia(socialmedia);
    setSettingHelpdesk(helpdesk);
  };

  useEffect(() => {
    fetchSettingInfo();
    fetchSettingAsyncStorage();
    fetchGetAuthCustomerInfo();
    if (!isUserLoggedIn) {
      navigation.navigate(navigationStrings.LOGIN);
    }
  }, []);

  return (
      <View style={{ backgroundColor: 'white' }}>
        <SafeAreaView />
        <HeaderRNE
          backgroundColor="white"
          barStyle="dark-content"
          centerComponent={{
            text: `${t('menu')}`,
            style: {
              color: 'black',
              fontSize: 19,
              justifyContent: 'center',
              alignContent: 'center',
              alignSelf: 'center',
              alignItems: 'center',
            },
          }}
          centerContainerStyle={{ height: 32, justifyContent: 'center' }}
          leftComponent={
            <TouchableOpacity
              containerStyle={{ padding: 5 }}
              onPress={() => props.navigation.goBack()}>
              <Ionicons name="chevron-back" size={25} color={'black'} />
            </TouchableOpacity>
          }
          leftContainerStyle={{ paddingLeft: 5 }}
          containerStyle={{marginTop: -45}}
          placement="center"
        />
        <View style={{ padding: 10 }}></View>
        <ScrollView>
          <View
            style={{
              alignItems: 'center',
              backgroundColor: 'black',
              marginHorizontal: 25,
              borderRadius: 18,
            }}>
            <Image
              source={require('../../../assets/images/login_banner.png')}
            />
          </View>

          <View
            style={{
              backgroundColor: 'white',
              marginTop: responsiveHeight(4),
            }}>
            <DrawerItem
              onPress={() => {
                navigation.navigate(navigationStrings.PROFILE);
              }}
              label={'Profile'}
              labelStyle={{
                color: colors.black,
                // fontWeight: '600',
                fontSize: responsiveFontSize(1.8),
                justifyContent: 'flex-start',
              }}
              icon={() => (
                <View
                  style={{
                    backgroundColor: appTheme.NEW_PALLET,
                    height: 32,
                    width: 32,
                    borderRadius: 32 / 2,
                    alignContent: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  {/* <Ionicons
                    name="md-person-circle-outline"
                    size={20}
                    color="black"
                  /> */}
                  {/* <Ionicons name="person-outline" size={18} color="black" /> */}
                  {/* <Ionicons name="person" size={18} color="black" /> */}
                  <Ionicons name="person-circle-outline" size={24} color="black" />

                </View>
              )}
            />
            {newSetting?.catalogue?.product ? (
              <DrawerItem
                onPress={() => {
                  Linking.openURL(newSetting?.catalogue?.product);
                }}
                label={'Product Catalogue'}
                labelStyle={{
                  color: colors.black,
                  // fontWeight: '600',
                  fontSize: responsiveFontSize(1.8),
                  justifyContent: 'flex-start',
                }}
                icon={() => (
                  <View
                    style={{
                      backgroundColor: appTheme.NEW_PALLET,
                      height: 32,
                      width: 32,
                      borderRadius: 32 / 2,
                      alignContent: 'center',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Icon name="book-cog-outline" size={20} color="black" />
                  </View>
                )}
              />
            ) : null}
            {newSetting?.catalogue?.loyalty ? (
              <DrawerItem
                onPress={() => {
                  Linking.openURL(newSetting?.catalogue?.loyalty);
                }}
                label={`${t('schemecat')}`}
                labelStyle={{
                  color: colors.black,
                  // fontWeight: '600',
                  fontSize: responsiveFontSize(1.8),
                  justifyContent: 'flex-start',
                }}
                icon={() => (
                  <View
                    style={{
                      backgroundColor: appTheme.NEW_PALLET,
                      height: 32,
                      width: 32,
                      borderRadius: 32 / 2,
                      alignContent: 'center',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Icon name="book-open-outline" size={20} color="black" />
                  </View>
                  // </View>
                )}
              />
            ) : null}
            {newSetting?.catalogue?.terms ? (
              <DrawerItem
                onPress={() => {
                  Linking.openURL(newSetting?.catalogue?.terms);
                }}
                label={`${t('tnc')}`}
                labelStyle={{
                  color: colors.black,
                  // fontWeight: '600',
                  fontSize: responsiveFontSize(1.8),
                  justifyContent: 'flex-start',
                }}
                icon={() => (
                  <View
                    style={{
                      backgroundColor: appTheme.NEW_PALLET,
                      height: 32,
                      width: 32,
                      borderRadius: 32 / 2,
                      alignContent: 'center',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Icon
                      name="newspaper-variant-outline"
                      size={20}
                      color="black"
                    />
                  </View>
                )}
              />
            ) : null}
            <DrawerItem
              onPress={() => {
                logout();
              }}
              label={`${t('logout')}`}
              labelStyle={{
                color: colors.black,
                // fontWeight: '600',
                fontSize: responsiveFontSize(1.8),
                justifyContent: 'flex-start',
              }}
              icon={() => (
                <View
                  style={{
                    backgroundColor: appTheme.NEW_PALLET,
                    height: 32,
                    width: 32,
                    borderRadius: 32 / 2,
                    alignContent: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon name="logout" size={20} color="black" />
                </View>
              )}
            />
            <View
              style={{
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center',
                justifyContent: 'space-evenly',
              }}>
              <View
                style={{
                  borderBottomColor: 'black',
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  width: width / 2 - 80,
                  borderWidth: 0.7,
                  borderColor: 'black',
                }}
              />
              <Text style={{ fontSize: 16, margin: 5 }}>{t('helpdesk')}</Text>
              <Icon name="headset" size={20} color={'black'} />
              <View
                style={{
                  borderBottomColor: 'black',
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  width: width / 2 - 80,
                  borderWidth: 0.7,
                  borderColor: 'black',
                }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
                alignContent: 'flex-start',
                marginBottom: 15,
                paddingTop: 30,
              }}>
              {newSetting?.helpdesk?.phone ? (
                <Pressable
                  style={{
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    Linking.openURL(`tel:+${newSetting?.helpdesk?.phone}`);
                  }}>
                  <Icon name="phone-outline" size={25} color="black" />
                </Pressable>
              ) : null}
              {newSetting?.helpdesk?.email ? (
                <Pressable
                  style={{
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    Linking.openURL(`mailto:${newSetting?.helpdesk?.email}`);
                  }}>
                  <Icon name="email-outline" size={25} color="black" />
                </Pressable>
              ) : null}
              {newSetting?.helpdesk?.whatsapp ? (
                <Pressable
                  style={{
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    Linking.openURL(
                      `https://api.whatsapp.com/send?phone=${newSetting?.helpdesk?.whatsapp}`,
                    );
                  }}>
                  <Icon name="whatsapp" size={25} color="black" />
                </Pressable>
              ) : null}
            </View>
            {/* <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center",
                alignContent: "flex-start",
                marginBottom: 15,
                paddingTop: 20,
              }}
            >
              {settingSocialMedia.facebook ? (
                <Pressable
                  onPress={() => {
                    Linking.openURL(settingSocialMedia.facebook);
                  }}
                >
                  <Feather name="facebook" size={25} color="black" />
                </Pressable>
              ) : null}
              {settingSocialMedia.instagram ? (
                <Pressable
                  onPress={() => {
                    Linking.openURL(settingSocialMedia.instagram);
                  }}
                >
                  <Feather name="instagram" size={25} color="black" />
                </Pressable>
              ) : null}
              {settingSocialMedia.twitter ? (
                <Pressable
                  onPress={() => {
                    Linking.openURL(settingSocialMedia.twitter);
                  }}
                >
                  <Feather name="twitter" size={25} color="black" />
                </Pressable>
              ) : null}
              {settingSocialMedia.linkedin ? (
                <Pressable
                  onPress={() => {
                    Linking.openURL(settingSocialMedia.linkedin);
                  }}
                >
                  <Feather name="linkedin" size={25} color="black" />
                </Pressable>
              ) : null}
              {settingSocialMedia.youtube ? (
                <Pressable
                  onPress={() => {
                    Linking.openURL(settingSocialMedia.youtube);
                  }}
                >
                  <Image source={imagePath.Youtube} />
                </Pressable>
              ) : null}
            </View> */}
          </View>
        </ScrollView>
        <View style={{ height: 300 }}></View>
      </View>
  );
};

export default SideMenu;
