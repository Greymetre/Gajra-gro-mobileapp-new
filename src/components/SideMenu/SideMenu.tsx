import {
  View,
  Image,
  Linking,
  Pressable,
  BackHandler,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import imagePath from '../../constants/imagePath';
const { width } = Dimensions.get('window');

const SideMenu = (props: any) => {
  const safeInsets = useSafeAreaInsets();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [profileData, setProfileData] = useState<ViewAuthInfoInterface>({});
  const [settingCatalogueData, setSettingCatalogueData] = useState({});
  const [settingSocialMedia, setSettingSocialMedia] = useState({});
  const [settingHelpdesk, setSettingHelpdesk] = useState({});
  const [newSetting, setNewSetting] = useState<any>();
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

  const menuItems = [
    {
      key: 'profile',
      label: 'Profile',
      subtitle: 'KYC, bank & shop details',
      icon: 'account-circle-outline',
      visible: true,
      onPress: () => navigation.navigate(navigationStrings.PROFILE),
    },
    {
      key: 'product',
      label: 'Product Catalogue',
      subtitle: 'Browse all Gajra products',
      icon: 'book-cog-outline',
      visible: !!newSetting?.catalogue?.product,
      onPress: () => Linking.openURL(newSetting?.catalogue?.product),
    },
    {
      key: 'scheme',
      label: `${t('schemecat')}`,
      subtitle: 'Current loyalty schemes',
      icon: 'book-open-outline',
      visible: !!newSetting?.catalogue?.loyalty,
      onPress: () => Linking.openURL(newSetting?.catalogue?.loyalty),
    },
    {
      key: 'terms',
      label: `${t('tnc')}`,
      subtitle: 'Programme rules',
      icon: 'newspaper-variant-outline',
      visible: !!newSetting?.catalogue?.terms,
      onPress: () => Linking.openURL(newSetting?.catalogue?.terms),
    },
  ].filter(item => item.visible);

  const helpdeskActions = [
    {
      key: 'phone',
      label: 'Call',
      icon: 'phone-outline',
      color: '#2F6FED',
      tint: '#E8F0FF',
      value: newSetting?.helpdesk?.phone,
      onPress: () => Linking.openURL(`tel:+${newSetting?.helpdesk?.phone}`),
    },
    {
      key: 'email',
      label: 'Email',
      icon: 'email-outline',
      color: '#E0592A',
      tint: '#FDEDE6',
      value: newSetting?.helpdesk?.email,
      onPress: () => Linking.openURL(`mailto:${newSetting?.helpdesk?.email}`),
    },
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      icon: 'whatsapp',
      color: '#1E9E5A',
      tint: '#E4F6EC',
      value: newSetting?.helpdesk?.whatsapp,
      onPress: () =>
        Linking.openURL(
          `https://api.whatsapp.com/send?phone=${newSetting?.helpdesk?.whatsapp}`,
        ),
    },
  ].filter(action => action.value);

  return (
    // White behind the status bar so it blends with the header; the page itself is grey.
    <SafeAreaView style={menuStyles.screen}>
      <View style={menuStyles.header}>
        <Pressable
          onPress={() => props.navigation.goBack()}
          hitSlop={6}
          style={({ pressed }) => [menuStyles.backButton, pressed && { opacity: 0.6 }]}>
          <Ionicons name="chevron-back" size={22} color={appTheme.DARK_BOTTOMTAB} />
        </Pressable>
        <Text style={menuStyles.headerTitle}>{`${t('menu')}`}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={{ backgroundColor: '#F7F7F7' }}
        // Keep the last button clear of the Android nav bar / iPhone home indicator.
        contentContainerStyle={{ paddingBottom: 40 + safeInsets.bottom }}
        showsVerticalScrollIndicator={false}>
        {/* Brand + user */}
        <View style={menuStyles.brandCard}>
          <Image
            source={require('../../../assets/images/login_banner.png')}
            style={menuStyles.brandImage}
          />
          <View style={menuStyles.userRow}>
            {profileData?.avatar ? (
              <Image
                source={{ uri: `${imagePath.IMAGE_URL}${profileData?.avatar}` }}
                style={menuStyles.avatar}
              />
            ) : (
              <View style={[menuStyles.avatar, menuStyles.avatarPlaceholder]}>
                <Ionicons name="person" size={20} color={appTheme.DARK_BOTTOMTAB} />
              </View>
            )}
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={menuStyles.userName} numberOfLines={1}>
                {profileData?.firmName || profileData?.contactPerson || ' '}
              </Text>
              <Text style={menuStyles.userMeta} numberOfLines={1}>
                {[profileData?.customerType, profileData?.mobile].filter(Boolean).join('  •  ')}
              </Text>
            </View>
          </View>
        </View>

        {/* Menu */}
        <Text style={menuStyles.sectionLabel}>MENU</Text>
        <View style={menuStyles.group}>
          {menuItems.map((item, index) => (
            <Pressable
              key={item.key}
              onPress={item.onPress}
              style={({ pressed }) => [
                menuStyles.row,
                index < menuItems.length - 1 && menuStyles.rowDivider,
                pressed && { backgroundColor: '#FAF6EC' },
              ]}>
              <View style={menuStyles.rowIcon}>
                <Icon name={item.icon} size={20} color={appTheme.DARK_BOTTOMTAB} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={menuStyles.rowTitle}>{item.label}</Text>
                <Text style={menuStyles.rowSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#B5B5B5" />
            </Pressable>
          ))}
        </View>

        {/* Helpdesk */}
        {helpdeskActions.length ? (
          <>
            <Text style={menuStyles.sectionLabel}>{`${t('helpdesk')}`.toUpperCase()}</Text>
            <View style={menuStyles.helpCard}>
              <View style={menuStyles.helpHeader}>
                <View style={menuStyles.helpHeaderIcon}>
                  <Icon name="headset" size={20} color={appTheme.DARK_BOTTOMTAB} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={menuStyles.rowTitle}>Need help?</Text>
                  <Text style={menuStyles.rowSubtitle}>Our support team is here for you</Text>
                </View>
              </View>
              <View style={menuStyles.helpActions}>
                {helpdeskActions.map(action => (
                  <Pressable
                    key={action.key}
                    onPress={action.onPress}
                    style={({ pressed }) => [
                      menuStyles.helpAction,
                      { backgroundColor: action.tint },
                      pressed && { opacity: 0.7 },
                    ]}>
                    <Icon name={action.icon} size={22} color={action.color} />
                    <Text style={[menuStyles.helpActionText, { color: action.color }]}>
                      {action.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </>
        ) : null}

        {/* Logout */}
        <Pressable
          onPress={() => logout()}
          style={({ pressed }) => [menuStyles.logout, pressed && { opacity: 0.7 }]}>
          <Icon name="logout" size={20} color="#D93025" />
          <Text style={menuStyles.logoutText}>{`${t('logout')}`}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const menuStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
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
  backButton: {
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
  brandCard: {
    marginHorizontal: 16,
    marginTop: 18,
    backgroundColor: 'black',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  brandImage: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: appTheme.DARK_BOTTOMTAB,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: appTheme.NEW_PALLET,
  },
  avatarPlaceholder: {
    backgroundColor: appTheme.NEW_PALLET,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: 'white',
  },
  userMeta: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#9A9A9A',
    marginHorizontal: 20,
    marginTop: 22,
    marginBottom: 8,
  },
  group: {
    marginHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  rowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E6E6E6',
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFF1D2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1C1C',
  },
  rowSubtitle: {
    fontSize: 12,
    color: '#8A8A8A',
    marginTop: 2,
  },
  helpCard: {
    marginHorizontal: 16,
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  helpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpHeaderIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: appTheme.NEW_PALLET,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpActions: {
    flexDirection: 'row',
    marginTop: 14,
    gap: 10,
  },
  helpAction: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 14,
    paddingVertical: 12,
  },
  helpActionText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 22,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#FDECEA',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#D93025',
    marginLeft: 8,
  },
});

export default SideMenu;
