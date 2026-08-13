import React from 'react';
import Login from '../components/auth/Login';
import SignUpOne from '../components/auth/SignUp/SignUpOne/SignUpOne';
import SignUpThree from '../components/auth/SignUp/SignUpThree/SignUpThree';
import SignUpTwo from '../components/auth/SignUp/SignUpTwo/SignUpTwo';
import Location from '../components/Location/Location';
import navigationStrings from '../constants/navigationStrings';
import ReferEarn from '../components/refer/ReferEarn';
import History from '../components/bottomtabs/history/History';
import StartingScreen from '../components/auth/StartingScreen';
import CatalogueWebView from '../components/auth/CatalogueWebView';

export default function (Stack: any) {
  return (
    <>
      
      <Stack.Screen
        name={navigationStrings.STARTINGSCREEN}
        options={{headerShown: false}}
        component={StartingScreen}
      />
      <Stack.Screen
        name={navigationStrings.LOGIN}
        options={{headerShown: false}}
        component={Login}
      />
      <Stack.Screen
        name={navigationStrings.SIGN_UP_ONE}
        options={{headerShown: false}}
        component={SignUpOne}
      />
      <Stack.Screen
        name={navigationStrings.SIGN_UP_TWO}
        options={{headerShown: false}}
        component={SignUpTwo}
      />
      <Stack.Screen
        name={navigationStrings.SIGN_UP_THREE}
        options={{headerShown: false}}
        component={SignUpThree}
      />
      <Stack.Screen
        name="CatalogueWebViewScreen"
        options={{headerShown: false}}
        component={CatalogueWebView}
      />
      <Stack.Screen
        name={navigationStrings.LOCATION}
        options={{headerShown: false}}
        component={Location}
      />
      <Stack.Screen
        name={navigationStrings.TRANSACTION}
        options={{headerShown: false}}
        component={History}
      />
    </>
  );
}
