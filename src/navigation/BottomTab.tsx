import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Platform, StyleSheet, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MI from 'react-native-vector-icons/MaterialIcons';
import History from '../components/bottomtabs/history/History';
import Home from '../components/bottomtabs/home/Home';
import CouponScan from '../components/coupon_scan/CouponScan';
import navigationStrings from '../constants/navigationStrings';
import HistoryRedemption from '../components/redemption/HistoryRedemption';
import appTheme from '../utils/appTheme';
import {useTranslation} from 'react-i18next';
import { useEffect, useState } from 'react';
import messaging from '@react-native-firebase/messaging';
import { useNavigation } from '@react-navigation/native';
import { notificationListener } from '../utils/notificationServices';

const Tab = createBottomTabNavigator();
const BottomTab = () => {
  const navigation = useNavigation();
  const [initialRoute, setInitialRoute] = useState('Home');
  useEffect(() => {
    notificationListener(navigation)
  }, [])
  
  
 
  const {t} = useTranslation();
  return (
    <Tab.Navigator
      initialRouteName={navigationStrings.HOME}
      screenOptions={{
        unmountOnBlur: true,
        headerShown: false,
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'black',
        tabBarLabelStyle: {
          top: Platform.OS === 'ios' ? 15 : -10,
          fontSize: 11,
        },

        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'white',
          borderTopColor: 'grey',
          alignItems: 'center',
          justifyContent: 'center',
          height:Platform.OS === 'android' && Platform.Version <= 34? 68:75,
        },
        tabBarHideOnKeyboard: true,
        tabBarAllowFontScaling: true,
      }}>
      <Tab.Screen
        name="Dashboard"
        component={Home}
        options={{
          // tabBarLabel: `${t('dashboard')}`,
          tabBarLabel: ({focused}: any) => (
            <Text style={[styles.label, focused && styles.activeLabel]}>
             {`${t('dashboard')}`}
            </Text>
          ),
          unmountOnBlur: true,
          tabBarActiveTintColor: appTheme.NEW_PALLET,
          tabBarInactiveTintColor: 'black',
          tabBarActiveBackgroundColor: appTheme.DARK_BOTTOMTAB,
          tabBarIcon: ({focused}) => {
            return (
              <Icon
                name="home"
                size={focused ? 28 : 22}
                color={focused ? appTheme.NEW_PALLET : appTheme.DARK_BOTTOMTAB}
              />
            );
          },
         
        }}
      />
      <Tab.Screen
        name="Coupon Scan"
        component={CouponScan}
        options={{
          // tabBarLabel: `${t('couponscan')}`,
          tabBarLabel: ({focused}: any) => (
            <Text style={[styles.label, focused && styles.activeLabel]}>
             {`${t('couponscan')}`}
            </Text>
          ),
          unmountOnBlur: true,
          tabBarActiveTintColor: appTheme.NEW_PALLET,
          tabBarInactiveTintColor: 'black',
          tabBarActiveBackgroundColor: appTheme.DARK_BOTTOMTAB,
          tabBarIcon: ({focused}) => {
            return (
              <MI
                name="qr-code-scanner"
                size={focused ? 28 : 22}
                color={focused ? appTheme.NEW_PALLET : appTheme.DARK_BOTTOMTAB}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name={'History'}
        component={History}
        options={{
          // tabBarLabel: `${t('history')}`,
          tabBarLabel: ({focused}: any) => (
            <Text style={[styles.label, focused && styles.activeLabel]}>
             {`${t('history')}`}
            </Text>
          ),
          unmountOnBlur: true,

          tabBarActiveTintColor: appTheme.NEW_PALLET,
          tabBarInactiveTintColor: 'black',
          tabBarActiveBackgroundColor: appTheme.DARK_BOTTOMTAB,
          tabBarIcon: ({focused}) => {
            return (
              <Icon
                name="repeat"
                size={focused ? 28 : 22}
                color={focused ? appTheme.NEW_PALLET : appTheme.DARK_BOTTOMTAB}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Redeem History"
        component={HistoryRedemption}
        options={{
          // tabBarLabel: `${t('redeem')} ${t('history')}`,
          tabBarLabel: ({focused}: any) => (
            <Text style={[styles.label, focused && styles.activeLabel]}>
             { `${t('redeem')} ${t('history')}`}
            </Text>
          ),
          unmountOnBlur: true,
          tabBarActiveTintColor: appTheme.NEW_PALLET,
          tabBarInactiveTintColor: 'black',
          tabBarActiveBackgroundColor: appTheme.DARK_BOTTOMTAB,
          tabBarIcon: ({focused}) => {
            return (
              <Ionicons
                name="gift-outline"
                size={focused ? 28 : 22}
                color={focused ? appTheme.NEW_PALLET : appTheme.DARK_BOTTOMTAB}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export const styles = StyleSheet.create({
 
  label: {
    marginTop: 4,
    fontSize: 10,
    color: appTheme.DARK_BOTTOMTAB,
    // fontFamily: fonts.InterSemiB,
    bottom:Platform.OS === 'android' && Platform.Version <= 34? 8:0,
    fontWeight:'bold'
  },
  activeLabel: {
    fontSize: 10,
    color:appTheme.NEW_PALLET,
    // fontFamily: fonts.InterSemiB,
  },
})
export default BottomTab;
