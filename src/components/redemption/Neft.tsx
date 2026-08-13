import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  BackHandler,
  ActivityIndicator,
  StyleSheet,
  Linking,
  Platform,
  Dimensions,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import navigationStrings from '../../constants/navigationStrings';
import { useNavigation } from '@react-navigation/native';

import * as Yup from 'yup';
import { useFormik } from 'formik';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  postupdatebankinfo,
  requestGetCustomerBankInfo,
  requestNeftRedemption,
} from '../../services/backend_helper';
import { NeftRedemptionInterface } from '../../interfaces/redemption.interface';
import { NavigationInterFace } from '../../interfaces/navigationType.interface';
import { Button, Header, Input } from '@rneui/themed';
import appTheme from '../../utils/appTheme';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import ModalLoader from '../loader/ModalLoader';
import { Modal } from 'react-native';

const Neft = (props: any) => {
  const { height, width } = Dimensions.get('window');
  const { t } = useTranslation();

  const navigation = useNavigation<NavigationInterFace>();
  const [pts, setPts] = useState('');
  const [approved, setapproved] = useState(true);
  const [acVerified, setAcVerified] = useState(false);
  const [disableinput, setdisableinput] = useState(false);
  const [showSendApproval, setShowSendApproval] = useState(false);
  const [disableSubmitBtn, setDisableSubmitBtn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);


  const initialValues = {
    accountNo: '',
    ifsc: '',
    holderName: '',
    bankName: '',
  };
  const validationSchema = Yup.object({
    accountNo: Yup.string()
      .required(`${t('requirederror', { fieldname: `${t('accno')}` })}`)
      .min(
        9,
        ({ min }) =>
          `${t('lenghterrnum', {
            fieldname: `${t('accno')}`,
            len: `${min}`,
          })}`,
      )
      .matches(new RegExp(/^[0-9]{9,18}$/), `${t('invalid')} ${t('accno')}`),
    bankName: Yup.string().required(
      `${t('requirederror', { fieldname: `${t('bank')}` })}`,
    ),
    ifsc: Yup.string()
      .required(`${t('requirederror', { fieldname: `${t('ifsccode')}` })}`)
      .min(
        11,
        ({ min }) =>
          `${t('lenghterr', {
            fieldname: `${t('ifsccode')}`,
            len: `${min}`,
          })}`,
      ),
    // .max(
    //   11,
    //   ({ max }) =>
    //     `${t('lenghterr', {
    //       fieldname: `${t('ifsccode')}`,
    //       len: `${max}`,
    //     })}`,
    // ),
    holderName: Yup.string()
      .required(`${t('requirederror', { fieldname: `${t('acholdername')}` })}`)
      .min(
        3,
        ({ min }) =>
          `${t('lenghterr', {
            fieldname: `${t('acholdername')}`,
            len: `${min}`,
          })}`,
      ),
  });
  const updateacinfo = async () => {
    setapproved(false);
    const data = {
      accountNo: formik.values.accountNo,
      bankName: formik.values.bankName,
      holderName: formik.values.holderName,
      ifsc: formik.values.ifsc,
    };
    postupdatebankinfo(data)
      .then(res => {
        if (res.isError == false) {
          for (const [key, value] of Object.entries(res.data)) {
            if (initialValues.hasOwnProperty(key)) {
              formik.setFieldValue(key, value);
              setapproved(false);
            }
          }
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

  const fetchCustomerBankInfo = async () => {
    setLoading(true);
    setDisableSubmitBtn(true);
  
    try {
      const res = await requestGetCustomerBankInfo({});
      console.log("API Response:", res)
      if (res.isError === false && res.data) {
        console.log("Response Data:", res.data);
        setDisableSubmitBtn(true);
        setdisableinput(false);
        Object.entries(res.data).forEach(([key, value]) => {
          if (initialValues.hasOwnProperty(key)) {
            console.log(`Updating field: ${key} = ${value}`);
            formik.setFieldValue(key, value);
          }
        });
        setAcVerified(res.data.verified);
      } else {
        console.warn("No valid bank details found.");
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
  //       if (res.isError == false && res.data.accountNo) {
  //         console.log('Response Data', res.data);
  //         // set
  //         setDisableSubmitBtn(true);
  //         setdisableinput(false);

  //         for (const [key, value] of Object.entries(res.data)) {
  //           if (initialValues.hasOwnProperty(key)) {
  //             console.log(key, value)
  //             formik.setFieldValue(key, value);
  //           }
  //         }
  //         // setAcVerified(true);
  //         setAcVerified(res.data.verified);
  //       } else {
  //         setdisableinput(true);
  //         console.log('Response Data', res.data);
  //       }
  //       setLoading(false)
  //       setDisableSubmitBtn(false)
  //     })
  //     .catch(error => {
  //       console.log('Response: ', error);
  //       setLoading(false)
  //       setDisableSubmitBtn(false)
  //     });
  // };

  const sendaccountinfoforapproval = async () => {
    setdisableinput(false);
    const data = {
      accountNo: formik.values.accountNo,
      bankName: formik.values.bankName,
      holderName: formik.values.holderName,
      ifsc: formik.values.ifsc,
    };
    console.log("data", data)
    postupdatebankinfo(data)
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

  const onSubmit = async (values: any) => {
    await requestNeftRedemption(values)
      .then(res => {
        if (res.isError == false) {
          // navigation.navigate(navigationStrings.REDEEMHISTORY);
        }
      })
      .catch(error => {
        console.log('Response: ', error);
      });
  };
  const formik = useFormik<NeftRedemptionInterface>({
    initialValues: initialValues,
    // onSubmit: onSubmit,
    onSubmit: (values) => {
      sendaccountinfoforapproval();
    },
    validationSchema,
    // validateOnMount: true,
    // enableReinitialize: true,
  });


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
            paddingVertical: 10
            // height: '9%',
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
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <SafeAreaView>
        <KeyboardAwareScrollView>
          <Header
            backgroundColor="white"
            backgroundImageStyle={{}}
            barStyle="dark-content"
            centerComponent={{
              text: `${t('IMPS')} ${t('redemption')}`,
              style: { color: 'black', fontSize: 19 },
            }}
            centerContainerStyle={{ height: 28, justifyContent: 'center' }}
            leftContainerStyle={{ paddingLeft: 5 }}
            leftComponent={
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={25} color={'black'} />
              </TouchableOpacity>
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

          {acVerified ?
            <ScrollView
              style={{ marginTop: responsiveHeight(1) }}
              showsVerticalScrollIndicator={false}>
              <View>
                <View
                  style={{
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                    alignContent: 'flex-end',
                  }}>

                  <VerificationBadge loading={loading} acVerified={acVerified} />
                  <View style={{ width: '93%', alignSelf: 'center' }}>
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
                      label={`${t('bank')}`}
                      onChangeText={(text: string) => {
                        formik.setFieldValue('bankName', text);
                      }}
                      value={formik?.values?.bankName}
                      disabled={!disableinput}
                    />
                    {formik.errors.bankName && (
                      <Text style={{ fontSize: 11, color: 'red', marginHorizontal: 12 }}>
                        {formik.errors.bankName}
                      </Text>
                    )}
                  </View>
                  <View style={{ width: '93%', alignSelf: 'center' }}>
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
                      label={`${t('accno')}`}
                      // placeHolder="Account Number"
                      // placeHolderTextColor={colors.grey}
                      onChangeText={(text: string) => {
                        formik.setFieldValue('accountNo', text);
                      }}
                      value={formik?.values?.accountNo}
                      keyboardType="numeric"
                      rightIcon={undefined}
                      disabled={!disableinput}
                    />
                    {formik.errors.accountNo && (
                      <Text style={{ fontSize: 11, color: 'red', marginHorizontal: 12 }}>
                        {formik.errors.accountNo}
                      </Text>
                    )}
                  </View>

                  <View style={{ width: '93%', alignSelf: 'center' }}>
                    <Input
                      // onChange={setAcVerified(false)}
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
                      inputStyle={{
                        textTransform: 'uppercase',
                      }}
                      renderErrorMessage={false}
                      label={`${t('ifsccode')}`}
                      onChangeText={(text: string) => {
                        formik.setFieldValue('ifsc', text);
                      }}
                      value={formik?.values?.ifsc}
                      disabled={!disableinput}
                    // maxLength={11}
                    />
                    {console.log(formik?.values?.ifsc)}
                    {formik.errors.ifsc && (
                      <Text style={{ fontSize: 11, color: 'red', marginHorizontal: 12 }}>
                        {formik.errors.ifsc}
                      </Text>
                    )}
                  </View>
                  <View style={{ width: '93%', alignSelf: 'center' }}>
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
                      label={`${t('acholdername')}`}
                      // placeHolder="Recipient Name"
                      // placeHolderTextColor={colors.grey}
                      onChangeText={(text: string) => {
                        formik.setFieldValue('holderName', text);
                      }}
                      value={formik?.values?.holderName}
                      disabled={!disableinput}
                    />
                    {/* {formik.errors.holderName && ( */}
                    {formik.touched.holderName && formik.errors.holderName && (
                      <Text style={{ fontSize: 11, color: 'red', marginHorizontal: 12 }}>
                        {formik.errors.holderName}
                      </Text>
                    )}
                  </View>

                  <View
                    style={{
                      width: '90%',
                      paddingTop: 10,
                      marginHorizontal: responsiveWidth(4),
                    }}>
                    {acVerified ? (
                      <Button
                        title={`${t('next')}`}
                        onPress={() => {
                          navigation.navigate(navigationStrings.Payout, {
                            mode: 'IMPS',
                            upiid: '',
                            bank: formik.values.bankName,
                            accountnum: formik.values.accountNo,
                            ifsccode: formik.values.ifsc,
                            holdername: formik.values.holderName,
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
                          if (formik.isValid) {
                            formik.handleSubmit();
                          }
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
                      <Text style={{ color: 'red' }}>{`${t('yourneftsend')}`}</Text>
                    ) : null}

                    {/* <Button
                  title="Confirm"
                  onPress={() => {
                    if (formik.isValid) {
                      onSubmit(formik.values);
                      navigation.navigate(navigationStrings.REWARDSUCCESS, {
                        pts,
                      });
                      console.log('Form is Valid: ', formik.isValid);
                      // console.log('form is valf')
                      // props.navigation.navigate();
                    } else {
                      console.log('Form is Valid: ', formik.isValid);
                    }
                    // disabled={!(formik.isValid && formik.dirty)}
                  }}
                /> */}

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
                      {/* <Image
                    source={imagePath.SECURELOCK}
                    style={{height: 12, width: 12}}
                  /> */}
                      <Text style={{ color: 'black' }}>{`${t('secureinfo')}`}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
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

        </KeyboardAwareScrollView>



      </SafeAreaView>
      {/* ) : (
    <Location
    onBackPress{()=>{setLocationVisibility(false);}}/>
    )}
  ); */}
    </View>
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
export default Neft;
