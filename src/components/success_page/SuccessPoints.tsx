import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  BackHandler,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Text} from '@rneui/base';
import navigationStrings from '../../constants/navigationStrings';
import {Header as HeaderRNE} from '@rneui/themed';

import {useNavigation, useRoute} from '@react-navigation/native';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Button as Btn} from '@rneui/themed';
import colors from '../../styles/colors';
import LottieView from 'lottie-react-native';
import {NavigationInterFace} from '../../interfaces/navigationType.interface';
import appTheme from '../../utils/appTheme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';

const SuccessPoints = (props: any) => {
  const {t} = useTranslation();

  const nowDate = new Date();
  const navigation = useNavigation();
  const route = useRoute();
  const {points} = route.params;
  function handleBackButtonClick() {
    navigation.navigate(navigationStrings.COUPON_SCAN);
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
  console.log(points,"AAAAAAAAAAAA")
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <HeaderRNE
        backgroundColor="white"
        backgroundImageStyle={{}}
        barStyle="default"
        centerComponent={{
          text: 'Successful!',
          style: {color: 'black', fontSize: 19},
        }}
        centerContainerStyle={{height: 28, justifyContent: 'center'}}
        leftComponent={
          <TouchableOpacity
            onPress={() => navigation.navigate(navigationStrings.HOME)}>
            <Ionicons name="chevron-back" size={25} color={'black'} />
          </TouchableOpacity>
        }
        placement="center"
      />
      <View
        style={{
          // flex: 0.5,
          alignContent: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
        }}>
        <View
          style={{
            alignItems: 'center',
          }}>
          <LottieView
            style={{
              height: 200,
              width: 200,
            }}
            source={require('../../../assets/images/success.json')}
            autoPlay
            loop
          />
        </View>
        <View
          style={{
            width: '90%',
            marginTop: responsiveHeight(2),
            marginHorizontal: responsiveWidth(4),
            alignContent: 'center',
            alignItems: 'center',
            paddingBottom: 20,
          }}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>
            {`${t('couponscannedsuccess')}`}
            {'\n'}
          </Text>
          <Text style={{fontSize: 18, fontWeight: '500', color: 'green'}}>
            {`+${points} ${t('points')}`}
          </Text>
          <Text
            style={{
              fontSize: 17,
            }}>
            {`${t('couponscannedsuccess2')}`}
          </Text>
          <Text style={{padding: 20}}>
            {`${t('date')}`}
            {nowDate
              .toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })
              .replace(/ /g, '-')}{' '}
            {nowDate.toLocaleTimeString('en-US', {
              hour12: true,
              hour: 'numeric',
              minute: 'numeric',
            })}
          </Text>
          <Btn
            title="Scan More"
            onPress={() => {
              // navigation.navigate(navigationStrings.HOME);
              // navigation.navigate()
              navigation.navigate(navigationStrings.COUPON_SCAN);
            }}
            buttonStyle={{
              backgroundColor: appTheme.NEW_PALLET,
              borderRadius: 8,
            }}
            titleStyle={{color: 'black'}}
            containerStyle={{paddingTop: 10}}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
export default SuccessPoints;
