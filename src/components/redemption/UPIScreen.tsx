import { View, SafeAreaView, Pressable, BackHandler, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity, Linking, Platform, Dimensions } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Text } from '@rneui/base';
import navigationStrings from '../../constants/navigationStrings';
import { Button, Header as HeaderRNE, Input } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import colors from '../../styles/colors';
import {
  postUpdateUpiInfo,
  requestGetCustomerBankInfo,
  requestWalletRedemption,
} from '../../services/backend_helper';
import { NavigationInterFace } from '../../interfaces/navigationType.interface';
import appTheme from '../../utils/appTheme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

const UPIScreen = (props: any) => {
  const { height, width } = Dimensions.get('window');
  const { t } = useTranslation();
  const [disableSubmitBtn, setDisableSubmitBtn] = useState(false);
  const [acVerified, setAcVerified] = useState(false);
  const [disableinput, setdisableinput] = useState(false);
  const [pts, setPts] = useState('');
  const [loading, setLoading] = useState(false);

  const [click, setClick] = useState(0);
  const navigation = useNavigation<NavigationInterFace>();
  const [showSendApproval, setShowSendApproval] = useState(false);

  const clearPts = () => {
    setPts('');
  };

  const initialValues = {
    upiNumber: '',
    holderName: ''
  };
  const validationSchema = Yup.object({
    upiNumber: Yup.string()
      .required(`${t('requirederror', { fieldname: `${t('upi')}` })}`)
      .min(
        4,
        ({ min }) =>
          `${t('lenghterr', {
            fieldname: `${t('upi')}`,
            len: `${min}`,
          })}`,
      ),
      // .matches(
      //   new RegExp(/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/),
      //   `${t('invalid')} ${t('upiid')}`,
      // ),
    holderName: Yup.string()
      .required(`${t('requirederror', { fieldname: `${t('upiholdername')}` })}`)
      .min(
        3,
        ({ min }) =>
          `${t('lenghterr', {
            fieldname: `${t('upiholdername')}`,
            len: `${min}`,
          })}`,
      ),
  });

  const onSubmit = async (values: any) => {
    await requestWalletRedemption(values)
      .then(res => {
        console.log(res);
        if (res.isError == false) {
        }
      })
      .catch(error => {
        console.log('Response: ', error);
      });
  };

  function handleBackButtonClick() {
    navigation.goBack();
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
  const formik = useFormik({ initialValues, onSubmit, validationSchema });
  // const formik = useFormik<WalletRedemptionInterface>({
  //   initialValues: initialValues,
  //   onSubmit: onSubmit,
  //   validationSchema,
  //   enableReinitialize: true,
  // });
  const sendaccountinfoforapproval = async () => {
    setdisableinput(false);
    const data = {
      upiNumber: formik.values.upiNumber,
      // upiHolderName: formik.values.holderName,
    };
    console.log(data, "-UPI DATA-")
    postUpdateUpiInfo(data)
      .then(res => {
        if (res.isError == false) {
          console.log('Account Details Send for Approval');
          console.log(res.data);

          setShowSendApproval(true);
          setDisableSubmitBtn(true);
          // for (const [key, value] of Object.entries(res.data)) {
          // if (initialValues.hasOwnProperty(key)) {
          //   formik.setFieldValue(key, value);
          //   setapproved(false);
          // }
          // }
        }
      })
      .catch(error => {
        console.log('Response: ', error);
      });
  };

  useEffect(() => {
    fetchCustomerBankInfo();
  }, []);
  const fetchCustomerBankInfo = async () => {
    setLoading(true);
    setDisableSubmitBtn(true);
    try {
      const res = await requestGetCustomerBankInfo({});
      console.log(res.data, "UPI RESPONSE");
      if (res.isError === false && res.data?.upiNumber) {
        formik.setFieldValue('upiNumber', res.data.upiNumber);
        formik.setFieldValue('holderName', res.data.upiHolderName || ''); 
        setAcVerified(res.data.upiVerified);
        setdisableinput(false); 
      } else {
        console.warn("No valid UPI details found.");
        setdisableinput(true);
      }
    } catch (error) {
      console.error("Error fetching bank info:", error);
    } finally {
      setLoading(false);
      setDisableSubmitBtn(false);
    }
  };
  
  // const fetchCustomerBankInfo = async () => {
  //   setLoading(true)
  //   setDisableSubmitBtn(true)
  //   await requestGetCustomerBankInfo({})
  //     .then(res => {
  //       console.log(res.data, "UPI RESPONSE");
  //       if (res.isError == false && res.data.upiNumber) {
  //         formik.setFieldValue('upiNumber', res.data.upiNumber);
  //         formik.setFieldValue('holderName', res.data.upiHolderName);
  //         // console.log('Response Data', res.data);
  //         setAcVerified(res.data.upiVerified);
  //         // setAcVerified(true);
  //         setLoading(false)
  //         setDisableSubmitBtn(false)
  //       } else {
  //         setdisableinput(true);
  //         setLoading(false)
  //         setDisableSubmitBtn(false)
  //       }
  //     })
  //     .catch(error => {
  //       console.log('Response: ', error);
  //       setLoading(false)
  //     });
  // };


  const handleCallSupport = () => {
    Linking.openURL("tel:8103324701");
  };

  const VerificationBadge = ({ loading, acVerified }: any) => {
    if (loading) {
      return (
        <View
          style={{
            ...styles.badgeContainer,
            backgroundColor: 'gray',
            justifyContent: 'center',
            width: '16%',
            height: '9%',
          }}>
          <ActivityIndicator size="small" color="#000000" />
        </View>
      );
    }
    return (
      <View
        style={{
          ...styles.badgeContainer,
          backgroundColor: acVerified ? '#b7df89' : '#f94c56',
          justifyContent: 'flex-end',
        }}>
        <Text style={styles.badgeText}>
          {t(acVerified ? 'verified' : 'notverified')}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ height: 100, backgroundColor: colors.white, flex: 1 }}>
      <HeaderRNE
       backgroundColor="white"
       backgroundImageStyle={{}}
       barStyle="dark-content"
        centerComponent={{
          text: `${t('upi')}`,
          style: { color: 'black', fontSize: 22 },
        }}
        leftComponent={
          <Pressable onPress={() => props.navigation.goBack()}>
            <Ionicons name="chevron-back" size={25} color={'black'} />
          </Pressable>
        }
        placement="center"
        containerStyle={{
          bottom: Platform.OS === "android"
            ? Platform.OS === "android" && Platform.Version <= 34
              ?0
              : height * 0.04
            : 0
        }}
      />

  {acVerified?
      <View
        style={{
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          alignContent: 'flex-end',
        }}>
        <VerificationBadge loading={loading} acVerified={acVerified} />
        <ScrollView style={{ width: '93%', alignSelf: 'center' }}>
          <View style={{ width: '100%', alignSelf: 'center' }}>
            <Input
              labelStyle={{
                fontWeight: '100',
                fontSize: 15,
                color: 'black',
                paddingBottom: 10,
              }}
              containerStyle={{
                justifyContent: 'center',
                paddingTop: 20,
                paddingBottom: 0,
                borderColor: 'rgba(0,0,0,0.08)',
              }}
              inputContainerStyle={{
                borderColor: 'rgba(0,0,0,0.08)',
                borderWidth: 1,
                borderRadius: 10,
              }}
              renderErrorMessage={false}
              value={formik?.values?.upiNumber}
              label={`${t('upiid')}`}
              onChangeText={(text: string) => {
                formik.setFieldValue('upiNumber', text);
              }}
              disabled={!disableinput}
            />
            {formik.errors.upiNumber && (
              <Text style={{ fontSize: 11, color: 'red', marginHorizontal: 12 }}>
                {formik.errors.upiNumber}
              </Text>
            )}

          </View>
      
          <View style={{ width: '96%', alignSelf: 'center', marginTop: 12 }}>
            {acVerified ? (
              <Button
                title={`${t('next')}`}
                onPress={() => {
                  navigation.navigate(navigationStrings.Payout, {
                    mode: 'UPI',
                    upiid: formik.values.upiNumber,
                    bank: '',
                    accountnum: '',
                    ifsccode: '',
                    holdername: '',
                    upiHolderName: formik.values.holderName
                  });
                }}
                buttonStyle={{
                  backgroundColor: appTheme.NEW_PALLET,
                  borderRadius: 8,
                }}
                titleStyle={{ color: 'black' }}
                containerStyle={{ paddingTop: 10 }}
              />
            ) : (
              <Button
                title={
                  showSendApproval
                    ? `${t('sendapproval')}`
                    : `${t('sendapproval')}`
                }
                onPress={() => {
                  console.log('Form is Valid: ', formik.isValid);
                  sendaccountinfoforapproval();
                }}
                buttonStyle={{
                  backgroundColor: appTheme.NEW_PALLET,
                  borderRadius: 8,
                }}
                titleStyle={{ color: 'black' }}
                containerStyle={{ paddingTop: 10 }}
                disabled={disableSubmitBtn}
              />
            )}
            {disableSubmitBtn && !acVerified ? (
              <Text style={{ color: 'red' }}>{`${t('yourupisend')}`}</Text>
            ) : null}

            <View
              style={{
                paddingTop: 10,
                flexDirection: 'row',
                alignItems: 'center',
                alignContent: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
              }}>
              <Icon
                name="lock"
                size={15}
                color="black"
                style={{ paddingHorizontal: 5 }}
              />
              <Text style={{ color: 'black' }}>{`${t('secureinfo')}`}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
     :
     <View style={styles.modalContainer}>
     <View style={styles.modalView}>
       <Text style={styles.modalTitle}>Verification Pending</Text>
       <Text style={styles.modalText}>
         Your account verification is still in process. If you need assistance,
         please contact our support team at:
       </Text>
       <Text style={styles.helplineNumber}>📞 81033 24701</Text>
       <TouchableOpacity style={styles.contactButton} onPress={handleCallSupport}>
         <Text style={styles.buttonText}>Call Support</Text>
       </TouchableOpacity>
     </View>
   </View>
            }

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  badgeContainer: {
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 14,
    padding: 10,
    fontWeight: '500',
    color: 'black',
  },
  modalContainer: {
    paddingTop: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 10,
  },
  helplineNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: appTheme.NEW_PALLET,
    marginBottom: 15,
  },
  contactButton: {
    backgroundColor: appTheme.NEW_PALLET,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
})

export default UPIScreen;