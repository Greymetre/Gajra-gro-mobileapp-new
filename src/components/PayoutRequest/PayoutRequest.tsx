import { SafeAreaView, Text, View, Dimensions, StyleSheet, ScrollView, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { responsiveHeight } from 'react-native-responsive-dimensions';
import { useNavigation, useRoute } from '@react-navigation/native';
import DashedLine from 'react-native-dashed-line';
import { Card, Header as HeaderRNE, Input } from '@rneui/themed';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from '@rneui/themed';
import appTheme from '../../utils/appTheme';
import {
  getLastRedemptionInfo,
  requestCustomerBalancePoint,
  requestNeftRedemption,
  requestUpiRedemption,
} from '../../services/backend_helper';

import colors from '../../styles/colors';
import { useFormik } from 'formik';
const { height, width } = Dimensions.get('window');
import * as Yup from 'yup';
import AlertComp from '../comman/AlertComp/AlertComp';
import AlertStatic from '../comman/AlertStatic/AlertStatic';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LanguageDropdown from '../comman/LanguageDropdown/LanguageDropdown';
import { useTranslation } from 'react-i18next';

const PayoutRequest = () => {
  const route = useRoute();
  console.log('Route Object', route.params);
  const { t } = useTranslation();

  const [pointsButton, setPointsButton] = useState('');
  const [mode, setmode] = useState('');
  const [objUPI, setobjUPI] = useState({});
  const [objNEFT, setobjNEFT] = useState({});
  const [balancePoint, setBalancePoint] = useState(0);
  const [RedeemPoints, setRedeemPoints] = useState(0);
  const [lastDate, setLastDate] = useState(Date());
  const [lastPoint, setLastPoint] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);



  const fetchLastinfo = async () => {
    await getLastRedemptionInfo({})
      .then(res => {
        if (res.isError == false) {
          console.log(res.data[0]);
          setLastDate(res.data[0].createdAt);
          setLastPoint(res.data[0].amount);
        }
      })
      .catch(error => {
        console.log('Response: ', error);
      });
    const llDate = new Date(lastDate);
  };
  const alertMessageg = async () => {
    <AlertComp
      successAlert={requestSent}
      title={requestSent ? 'Success' : 'Failed'}
      timeoutSec={0}
      messageText={
        requestSent
          ? `Your redemption request of ${formik.values.redeemedpoints} has been sent successfull.`
          : `Invalid Request`
      }
      handleClick={null}
    />;
  };
  const fetchCustomerBalancePoint = async () => {
    await requestCustomerBalancePoint({})
      .then(res => {
        console.log(res);
        if (res.isError == false) {
          setBalancePoint(res.data.balance);
          setRedeemPoints(res.data.redeempoint);
        }
      })
      .catch(error => {
        console.log('Response: ', error);
      });
  };
  const setall = async () => {
    setmode(route.params?.mode);
    if (mode == 'UPI') {
      const upidata = { upiid: String(route.params?.upiid), upiHolderName: route.params?.upiHolderName };
      setobjUPI(() => {
        upidata;
      });
      // console.log();
    }
    if (mode == 'IMPS') {
      const neftdata = {
        bank: String(route.params?.bank),
        acccountnum: String(route.params?.accountnum),
        ifsccode: String(route.params?.ifsccode),
      };
      setobjNEFT(() => {
        neftdata;
      });
      // console.log(upidata);
    }
  };
  const initialValues = {
    redeemedpoints: 0,
  };
  const validationSchema = Yup.object({
    redeemedpoints: Yup.number()
      .required(
        `${t('requirederror', { fieldname: `${t('redeem')} ${t('points')}` })}`,
      )
      .min(
        1,
        ({ min }) =>
          `${t('minerror', {
            fieldname: `${t('redeem')} ${t('points')}`,
            len: `${min}`,
          })}`,
      )

      .max(
        balancePoint,
        ({ max }) =>
          `${t('maxerror', {
            fieldname: `${t('redeem')} ${t('points')}`,
            len: `${max}`,
          })}`,
      ),
  });
  const onSubmit = async () => {
    console.log('--On Submit Pressed--');
    console.log(mode);
    if (formik.isValid) {
      if (mode == 'UPI') {
        console.log('inside Upi mode');
        const data = {
          upiNumber: route.params?.upiid,
          amount: formik.values.redeemedpoints,
          // upiHolderName: route.params?.upiHolderName
        };
        console.log({ data });
        setIsLoading(true)
        await requestUpiRedemption({ payment: data })
          .then(res => {
            if (res.isError == false) {
              console.log('Request Sent Successfully');
              console.log(res);
              setIsLoading(false)
              setRequestSent(true);
              // navigation.navigate(navigationStrings.REDEEMHISTORY);
            }
          })
          .catch(error => {
            console.log('Response: ', error);
            setIsLoading(false)
            setRequestSent(false);
          });
      }
      if (mode === 'IMPS') {
        console.log('inside Neft mode');
        const data = {
          accountNo: route.params?.accountnum,
          holderName: route.params?.holdername,
          bankName: route.params?.bank,
          ifsc: route.params?.ifsccode,
          amount: formik.values.redeemedpoints,
        };
        console.log({ data });
        setIsLoading(true)
        await requestNeftRedemption({ payment: data })
          .then(res => {
            if (res.isError == false) {
              console.log('Request Sent Successfully');
              console.log(res);
              setIsLoading(false)
              setRequestSent(true);

              // navigation.navigate(navigationStrings.REDEEMHISTORY);
            }
          })
          .catch(error => {
            console.log('Response: ', error);
            setIsLoading(false)
            setRequestSent(false);
          });
        // .catch(error => {
        //   if (error.response) {
        //     console.log('Response Data:', error.response.data);
        //     console.log('Response Status:', error.response.status);
        //     console.log('Response Headers:', error.response.headers);
        //   } else if (error.request) {
        //     console.log('No Response Received:', error.request);
        //   } else {
        //     console.log('Error Message:', error.message);
        //   }
        //   setRequestSent(false);
        // });
      }
    }
  };
  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
    // validateOnMount: true,
    // validateOnBlur: false,
    // validateOnChange: false,
  });
  const titlenew = `${t('redeem')} ${pointsButton} ${t('points')}`;

  // setupi(route.params?.upiid);
  // setbank(route.params?.bank);
  // setaccountnum(route.params?.accountnum);
  // setifsccode(route.params?.ifsccode);
  const navigation = useNavigation();
  // function handleBackButtonClick() {
  //   navigation.goBack();
  //   return true;
  // }
  // useEffect(() => {
  //   BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
  //   return () => {
  //     BackHandler.removeEventListener(
  //       'hardwareBackPress',
  //       handleBackButtonClick,
  //     );
  //   };
  // }, []);

  // const fetchTransactions = async () => {
  //   await requestGetAllTransactions()
  //     .then(res => {
  //       if (res.isError == false) {
  //         setTransactionData(res.data);
  //         console.log(res.data);
  //       }
  //     })
  //     .catch(error => {
  //       console.log('Response Transactions: ', error);
  //     });
  // };

  useEffect(() => {
    fetchCustomerBalancePoint();
    fetchLastinfo();
    setall();
  }, []);
  // const [upi, setupi] = useState('');
  // const [bank, setbank] = useState('');
  // const [accountnum, setaccountnum] = useState('');
  // const [ifsccode, setifsccode] = useState('');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      {/* <SafeAreaView style={styles.safeAreaView}> */}
      {/* <Header title="Transaction History" backArrow={imagePath.BACK} /> */}
      <HeaderRNE
        backgroundColor="white"
        backgroundImageStyle={{}}
        barStyle="dark-content"
        centerComponent={{
          text: `${t('redemption')}`,
          style: {
            color: 'black',
            fontSize: 19,
            justifyContent: 'center',
            alignContent: 'center',
            alignSelf: 'center',
            alignItems: 'center',
          },
        }}
        centerContainerStyle={{ height: 28, justifyContent: 'center' }}
        // containerStyle={{width: 350}}
        leftComponent={
          <TouchableOpacity
            containerStyle={{ padding: 5 }}
            onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={25} color={'black'} />
          </TouchableOpacity>
        }
        leftContainerStyle={{ paddingLeft: 9 }}
        linearGradientProps={{}}
        placement="center"
        rightContainerStyle={{}}
        statusBarProps={{}}
        containerStyle={{
          bottom: Platform.OS === "android"
            ? Platform.OS === "android" && Platform.Version <= 34
              ?0
              : height * 0.04
            : 0
        }}
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={{ alignSelf: 'baseline' }}>
          <Card
            containerStyle={{
              width: width - 30,
              backgroundColor: appTheme.NEW_PALLET,
              borderRadius: 18,
            }}>
            <View
              style={{
                flexDirection: 'column',
                alignContent: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                // padding: 30,
              }}>
              {/* <View style={{flexDirection: 'row', justifyContent: 'space-between'}}> */}
              <View
                style={{
                  padding: 10,
                }}>
                <Text style={{ fontWeight: '700', fontSize: 20, color: 'black' }}>
                  {`${t('availablebalance')}`}
                </Text>
                <Text style={{ fontWeight: '700', fontSize: 32, color: 'black' }}>
                  {balancePoint} {`${t('points')}`}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignContent: 'flex-end',
                justifyContent: 'space-between',
                padding: 5,
              }}>
              <Text>{`${t('lastredeem')}: ${lastPoint} ${t('points')}`}</Text>
              <Text>
                {new Date(lastDate)
                  .toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                  .replace(/ /g, '-')}
              </Text>
            </View>
            {/* </View> */}
          </Card>
        </View>
        {/* <ScrollView showsVerticalScrollIndicator={true}> */}
        <View style={{ paddingVertical: 10 }}>
          <DashedLine dashColor="grey" dashLength={3} dashThickness={1} />
        </View>
        {/* <LanguageDropdown /> */}
        <View>
          <Text
            style={{
              fontSize: 17,
              color: 'black',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            {`${t('redeemtagline')}`}
          </Text>
        </View>
        <View
          style={{
            paddingTop: 15,
            flexDirection: 'row',
            width: 120,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          <Input
            inputMode="numeric"
            inputStyle={{ fontSize: 30, fontWeight: '800' }}
            onChangeText={(text: any) => {
              formik.setFieldValue('redeemedpoints', text);
              // console.log('Text', text);

              // console.log(formik.values.redeemedpoints);

              setPointsButton(text);
            }}
          // errorMessage={formik.errors.redeemedpoints}
          // renderErrorMessage={formik.errors.redeemedpoints?.length == 0}
          />
          <Text style={{ fontSize: 17, color: 'black' }}> {`${t('points')}`}</Text>
        </View>
        <View
          style={{
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          {formik.errors.redeemedpoints && (
            <Text style={{ fontSize: 11, color: 'red' }}>
              {formik.errors.redeemedpoints}
            </Text>
          )}
        </View>
        {/* <View style={{paddingBottom: responsiveHeight(5)}}></View> */}
        {/* <Shadow> */}
        <Card containerStyle={newstyle}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text
              style={{
                color: 'black',
                fontSize: 16,
                padding: 4,
                fontWeight: '500',
              }}>
              {`${t('redeemtagline')} ${t('via')}`}
            </Text>
          </View>
          <Text style={{ fontSize: 16, padding: 4, fontWeight: '500' }}>
            {`${t('modemethod')}`} - {mode}
          </Text>
          {mode == 'UPI' ? (
            <>
              <Text style={{ fontSize: 16, padding: 4, fontWeight: '500' }}>
                {`${t('upiid')}`} - {route.params?.upiid}
              </Text>
              {/* <Text style={{ fontSize: 16, padding: 4, fontWeight: '500' }}>
           {`${t('upiholdername')}`} - {route.params?.upiHolderName}
         </Text> */}
            </>
          ) : (
            <View>
              <Text style={{ fontSize: 16, padding: 4, fontWeight: '500' }}>
                {`${t('bank')}`} - {route.params?.bank}
              </Text>
              <Text style={{ fontSize: 16, padding: 4, fontWeight: '500' }}>
                {`${t('accno')}`} - {String(route.params?.accountnum)}
              </Text>
              <Text style={{ fontSize: 16, padding: 4, fontWeight: '500' }}>
                {`${t('ifsccode')}`} - {route.params?.ifsccode}
              </Text>
            </View>
          )}
        </Card>
        {/* </Shadow> */}
        <View style={{ justifyContent: 'center', paddingTop: 10 }}>
          <Button
            title={titlenew}
            onPress={() => {
              if (!isLoading) {
                console.log('Pressed');
                console.log(formik.isValid, 'ooooododododdasdafasdf');
                formik.handleSubmit();
                setRequestSent(true);
              }
            }}
            buttonStyle={{
              alignSelf: 'center',
              backgroundColor: appTheme.NEW_PALLET,
              borderRadius: 8,
              width: '90%',
            }}
            icon={
              <Icon
                name="security"
                size={20}
                color={formik.isValid ? 'black' : 'grey'}
              // disabled={!formik.isValid}
              />
            }
            disabled={!formik.isValid || formik.values.redeemedpoints == 0}
            titleStyle={{ color: 'black' }}
            containerStyle={{ paddingTop: 10 }}
          />
          {requestSent ? (
            <AlertStatic
              successAlert={requestSent}
              title={requestSent ? `${t('success')}` : `${t('failed')}`}
              // timeoutSec={100}
              messageText={
                requestSent
                  ? `${t('alertsuccess1')} ${formik.values.redeemedpoints} ${t(
                    'points',
                  )} ${t('alertsuccess2')}`
                  : `${t('invalidreq')}`
              }
            // handleClick={navigation.navigate(navigationStrings.HOME)}
            />
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PayoutRequest;

const newstyle = StyleSheet.create({
  borderRadius: 16,
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.4,
  shadowRadius: 10,
  elevation: 3,
});
