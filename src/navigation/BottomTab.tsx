import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MI from 'react-native-vector-icons/MaterialIcons';
import History from '../components/bottomtabs/history/History';
import Home from '../components/bottomtabs/home/Home';
import CouponScan from '../components/coupon_scan/CouponScan';
import navigationStrings from '../constants/navigationStrings';
import HistoryRedemption from '../components/redemption/HistoryRedemption';
import CustomTabBar from './CustomTabBar';
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
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        unmountOnBlur: true,
        headerShown: false,
      }}>
      <Tab.Screen
        name="Dashboard"
        component={Home}
        options={{
          title: `${t('dashboard')}`,
          tabBarIcon: ({color}) => <Icon name="home" size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Coupon Scan"
        component={CouponScan}
        options={{
          title: `${t('couponscan')}`,
          tabBarIcon: ({color}) => <MI name="qr-code-scanner" size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name={'History'}
        component={History}
        options={{
          title: `${t('history')}`,
          tabBarIcon: ({color}) => <Icon name="repeat" size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Redeem History"
        component={HistoryRedemption}
        options={{
          title: `${t('redeem')} ${t('history')}`,
          tabBarIcon: ({color}) => <Ionicons name="gift-outline" size={22} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTab;
