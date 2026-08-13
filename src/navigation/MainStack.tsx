import React from 'react';
import Location from '../components/Location/Location';
import navigationStrings from '../constants/navigationStrings';
import BottomTab from './BottomTab';
import SideMenu from '../components/SideMenu/SideMenu';
import RedemptionFinal from '../components/redemption/RedemptionFinal';
import Neft from '../components/redemption/Neft';
import PaymentSelect from '../components/redemption/WalletRedemption';
import UPIScreen from '../components/redemption/UPIScreen';
import OtherUPI from '../components/redemption/OtherUPI';
import SuccessPoints from '../components/success_page/SuccessPoints';
import RewardSuccess from '../components/rewardpage/RewardSuccess';
import RedemptionDetail from '../components/RedemptionDetail/RedemptionDetail';
import ReferEarn from '../components/refer/ReferEarn';
import Announcements from '../components/Announcements/Announcements';
import PayoutRequest from '../components/PayoutRequest/PayoutRequest';
import ImageUpload from '../components/imageUpload/ImageUpload';
import Profile from '../components/bottomtabs/profile/Profile';
import Damage from '../components/coupon_scan/Damange';
import CatalogueWebView from '../components/auth/CatalogueWebView';
export default function (Stack: any) {
  return (
    <>
      <Stack.Screen
        name={navigationStrings.HOME}
        options={{headerShown: false}}
        component={BottomTab}
      />
      <Stack.Screen
        name="Location"
        options={{headerShown: false}}
        component={Location}
      />
      <Stack.Screen
        name={navigationStrings.REDEMPTIONFINAL}
        options={{headerShown: false}}
        component={RedemptionFinal}
      />
      <Stack.Screen
        name={navigationStrings.DAMAGE}
        options={{headerShown: false}}
        component={Damage}
      />
      <Stack.Screen
        name={navigationStrings.SIDEMENU}
        options={{headerShown: false}}
        component={SideMenu}
      />
      <Stack.Screen
        name="PaymentSelect"
        options={{headerShown: false}}
        component={PaymentSelect}
      />
      <Stack.Screen
        name="Neft"
        options={{headerShown: false}}
        component={Neft}
      />
      <Stack.Screen
        name="UPIScreen"
        options={{headerShown: false}}
        component={UPIScreen}
      />
      <Stack.Screen
        name="OtherUPI"
        options={{headerShown: false}}
        component={OtherUPI}
      />
      <Stack.Screen
        name="SuccessPoints"
        options={{headerShown: false}}
        component={SuccessPoints}
      />
      <Stack.Screen
        name="RewardSuccess"
        options={{headerShown: false}}
        component={RewardSuccess}
      />
      <Stack.Screen
        name="RedemptionDetail"
        options={{headerShown: false}}
        component={RedemptionDetail}
      />
      <Stack.Screen
        name="CatalogueWebView"
        options={{headerShown: false}}
        component={CatalogueWebView}
      />
      <Stack.Screen
        name="ReferEarn"
        options={{headerShown: false}}
        component={ReferEarn}
      />
      <Stack.Screen
        name="Announcements"
        options={{headerShown: false}}
        component={Announcements}
      />
      <Stack.Screen
        name="PayoutRequest"
        options={{headerShown: false}}
        component={PayoutRequest}
      />
      <Stack.Screen
        name="ImageUpload"
        options={{headerShown: false}}
        component={ImageUpload}
      />
      <Stack.Screen
        name="Profile"
        options={{headerShown: false}}
        component={Profile}
      />
    </>
  );
}
