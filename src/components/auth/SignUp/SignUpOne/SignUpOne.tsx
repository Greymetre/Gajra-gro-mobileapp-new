import React, { useEffect, useState } from 'react';
import {
  BackHandler,
  Dimensions,
  Image,
  SafeAreaView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Pressable,
  Platform,
  PermissionsAndroid,
  Modal,
} from 'react-native';
import axios from 'axios';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation, useRoute } from '@react-navigation/native';
import styles from '../SignUpOne/styles';
// import Header from "../../../comman/Header/Header";
import { Header as HeaderRNE, Input } from '@rneui/themed';
import BlackButton from '../../../comman/ButtonBlack/BlackButton';
import DropDown from '../../../comman/DropDown/DropDown';
import Picker from '../../../comman/Picker/Picker';
import InputField from '../../../comman/InputField/InputField';
import imagePath from '../../../../constants/imagePath';
// import Button from "../../../comman/Button/Button";
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Location from '../../../Location/Location';
import { objectAppendIntoformData } from '../../../../utils/utility';
import {
  requestSignup,
  requestProfileImageUpload,
  requestGetMobileExist,
} from '../../../../services/backend_helper';
import { Button } from '@rneui/themed';
const { height, width } = Dimensions.get('window');
import DocumentPicker from 'react-native-document-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import * as ImagePicker from 'react-native-image-picker';
import { ModalAlertPopup } from '../../../comman/ModalAlertPopup';
// const imcludeExtra = true;
// var fs = require('fs');
import fs from 'react-native-fs';
import CityDropDown from '../../../comman/Address/CityDropDown';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import StateDropDown from '../../../comman/Address/StateDropDown';
import CountryDropDown from '../../../comman/Address/CountryDropDown';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/Ionicons';
import { setTokenAsyncStorage } from '../../../../services/auth_helper';
import { login, register, stackUpdate } from '../../../../redux';
import { useDispatch } from 'react-redux';
import appTheme from '../../../../utils/appTheme';
import navigationStrings from '../../../../constants/navigationStrings';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomerTypeDropDowm from '../../../comman/Address/CustomerTypeDropDowm';

export interface CreateUserInterface {
  readonly firmName?: string;
  readonly contactPerson?: string;
  readonly phoneCode?: any;
  readonly mobile?: number;
  readonly email?: string;
  // readonly password?: string;
  readonly customerType?: string;
  // readonly avatar?: any;
  // readonly shopimage?: any;
  readonly address?: Object;
}
const SignUpOne = (props: any) => {
  const { t } = useTranslation();

  const [tempDisable, setTempDisable] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const [userExistResponse, setUserExistResponse] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [shopImg, setShopImg] = React.useState<any>(null);
  const [avatarImg, setAvatarImg] = React.useState<any>(null);
  const [custType, setCustType] = useState<string>();
  // const [country, setCountry] =

  const handleInputChange = (name: string, value: string) => {
    formik.setFieldValue(name, value);
  };
  const initialValues = {
    firmName: '',
    contactPerson: '',
    mobile: route.params.mobileno,
    customerType: '',
    email: null,
    address: {
      postalCode: '',
      country: 'India',
      state: '',
      city: '',
      address: '',
    },
  };
  const dispatch = useDispatch();
  const user_Exist = route.params.user_exist;
  const [requestData, setRequestData] =
    useState<CreateUserInterface>(initialValues);
  const validationSchema = Yup.object({
    firmName: Yup.string()
      .required(`${t('requirederror', { fieldname: `${t('shopname')}` })}`)
      .min(
        3,
        ({ min }) =>
          `${t('minerror', {
            fieldname: `${t('shopname')}`,
            len: `${min}`,
          })}`,
      ),
    contactPerson: Yup.string()
      .required(`${t('requirederror', { fieldname: `${t('name')}` })}`)
      .min(
        2,
        ({ min }) =>
          `${t('minerror', {
            fieldname: `${t('name')}`,
            len: `${min}`,
          })}`,
      ),
    mobile: Yup.string()
      .required(`${t('requirederror', { fieldname: `${t('phoneno')}` })}`)
      .min(
        10,
        ({ min }) =>
          `${t('minerror', {
            fieldname: `${t('phoneno')}`,
            len: `${min}`,
          })}`,
      )
      .max(
        10,
        ({ max }) =>
          `${t('maxerror', {
            fieldname: `${t('phoneno')}`,
            len: `${max}`,
          })}`,
      ),
      customerType: Yup.string().required(
        `${t('requirederror', { fieldname: `${t('customertype')}` })}`,
      ),
    address: Yup.object({
      postalCode: Yup.string()
        .required(`${t('requirederror', { fieldname: `${t('postalcode')}` })}`)
        .min(
          6,
          ({ min }) =>
            `${t('minerror', {
              fieldname: `${t('postalcode')}`,
              len: `${min}`,
            })}`,
        )
        .max(
          6,
          ({ max }) =>
            `${t('maxerror', {
              fieldname: `${t('postalcode')}`,
              len: `${max}`,
            })}`,
        ),
      state: Yup.string().required(
        `${t('requirederror', { fieldname: `${t('state')}` })}`,
      ),
     
    }),
  });

  const onSubmit = async (values: any) => {
    let fcmToken = await AsyncStorage.getItem('fcmToken')
    console.log('Button Pressed');
    // formik.setFieldValue("isClicked", true);
    var data = {
      firmName: formik.values.firmName,
      contactPerson: formik.values.contactPerson,
      phoneCode: '+91',
      mobile: formik.values.mobile,

      deviceToken: `${fcmToken}`,
      deviceType: 'android',

      // email: null,
      // password: formik.values.password,
      customerType: formik.values.customerType,
      address: {
        postalCode: formik.values.address.postalCode,
        address: formik.values.address.address,
        city: formik.values.address.city,
        state: formik.values.address.state,
        country: 'India',
      },
    };
    console.log('Button Pressed++++++',data);
    if(fcmToken){
      console.log('Sign Up Data', data);
      requestSignup(data)
        .then(res => {
          console.log('response', res);
          // formik.setFieldValue('isClicked', false);
          if (res.isError == false && res.message == 'SUCCESS') {
            // formik.setValues({ ...initialValues, isClicked: false });
            console.log(res.data);
            var resData = JSON.stringify(res.data);
            setTokenAsyncStorage(res?.data?.token);
            dispatch(login(resData));
            dispatch(stackUpdate('dashboard'));
          } else {
            () => console.log('Ask me later pressed');
          }
        })
        .catch(error => {
          // formik.setFieldValue("isClicked", false);
          console.log('Sign Up Error Response >>>>  ', error);
        });
    }
    
  };
  const mobileCall = async (values: any) => {
    var data = { mobile: formik.values.mobile };
    requestGetMobileExist(data)
      .then(res => {
        // formik.setFieldValue('isClicked', false);
        if (res.isError == false && res.message == 'SUCCESS') {
          setTempDisable(res.data.exists);
        }
      })
      .catch(error => {
        // formik.setFieldValue("isClicked", false);
        console.log('Sign Up Error Response >>>>  ', error);
      });
  };
  // function handleBackButtonClick() {
  //   navigation.push(navigationStrings.LOGIN);
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
  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const onSelect = (item: any) => {
    setRequestData({ ...requestData, customerType: item });
  };
  useEffect(() => {
    mobileCall({});
  }, []);
  // useEffect(() => {
  //   const backAction = () => {
  //     if (visibleLocation) {
  //       setLocationVisibility(false);
  //     } else {
  //       props.navigation.pop();
  //     }
  //     return true;
  //   };
  //   BackHandler.addEventListener("hardwareBackPress", backAction);
  //   return () =>
  //     BackHandler.removeEventListener("hardwareBackPress", backAction);
  // }, [visibleLocation]);

  const [isBtnClicked, setBtnClicked] = useState(false);
  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* {!visibleLocation ? ( */}
      {/* <SafeAreaView> */}
        <HeaderRNE
          backgroundColor="white"
          backgroundImageStyle={{}}
          barStyle="default"
          centerComponent={{
            text: `${t('signup')}`,
            style: { color: 'black', fontSize: 19, fontWeight: 'bold' },
          }}
          centerContainerStyle={{ height: 28, justifyContent: 'flex-start' }}
          leftComponent={
            // <View>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <View
                style={{
                  backgroundColor: '#F5F5F5',
                  height: 30,
                  width: 30,
                  borderRadius: 30 / 2,
                  alignContent: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon name="chevron-back" size={24} />
              </View>
            </TouchableOpacity>
          }
          placement="left"
        />
        <KeyboardAwareScrollView keyboardDismissMode='on-drag'>
          <View style={styles.viewContainer}>
            {/* <View> */}
            <View style={{ marginBottom: 40 }}>
              <Input
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
                  paddingHorizontal: 12
                }}
                renderErrorMessage={false}
                value={formik.values.contactPerson}
                onChangeText={(text: string) => {
                  formik.setFieldValue('contactPerson', text);
                }}
                textContentType="name"
                label={`${t('name')}`}
                labelStyle={{
                  fontWeight: '100',
                  fontSize: 15,
                  color: 'black',
                  paddingBottom: 10,
                }}
              />
              {formik.errors.contactPerson && (
                <Text style={{ paddingLeft: 10, fontSize: 11, color: 'red' }}>
                  {formik.errors.contactPerson}
                </Text>
              )}
              <View style={{  }}>
                <Text
                  style={{
                    paddingTop: 20,
                    paddingLeft: 10,
                    paddingBottom: 10,
                    color: 'black',
                    fontWeight:'bold',
                    fontSize: 15,
                  }}>
                  {`${t('select')} ${t('customertype')}`}
                </Text>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <CustomerTypeDropDowm
                    handleInputChange={handleInputChange}
                    statename={formik?.values?.customerType}
                  />
                </View>
                {formik.errors.customerType && (
                  <Text style={{ paddingLeft: 10, fontSize: 11, color: 'red' }}>
                    {formik.errors.customerType}
                  </Text>
                )}
              </View>
              <Input
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
                  paddingHorizontal: 12
                }}
                renderErrorMessage={false}
                value={route.params.mobileno}
                disabled={true}
                label={`${t('phoneno')}`}
                labelStyle={{
                  fontWeight: '100',
                  fontSize: 15,
                  color: 'black',
                  paddingBottom: 10,
                }}
              />
              <Input
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
                  paddingHorizontal: 12
                }}
                renderErrorMessage={false}
                value={formik.values.firmName}
                onChangeText={(text: string) => {
                  formik.setFieldValue('firmName', text);
                }}
                label={`${t('shopname')}`}
                labelStyle={{
                  fontWeight: '100',
                  fontSize: 15,
                  color: 'black',
                  paddingBottom: 10,
                }}
              />
              {formik.errors.firmName && (
                <Text style={{ paddingLeft: 10, fontSize: 11, color: 'red' }}>
                  {formik.errors.firmName}
                </Text>
              )}
              <Input
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
                  paddingHorizontal: 12
                }}
                renderErrorMessage={false}
                value={formik.values.address.address}
                onChangeText={(text: string) => {
                  formik.setFieldValue('address.address', text);
                  // formik.setFieldValue()
                }}
                label={`${t('address')}`}
                labelStyle={{
                  fontWeight: '100',
                  fontSize: 15,
                  color: 'black',
                  paddingBottom: 10,
                }}
              />
              {formik.errors.address?.address && (
                <Text style={{ paddingLeft: 10, fontSize: 11, color: 'red' }}>
                  {formik.errors.address.address}
                </Text>
              )}
              <Input
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
                  paddingHorizontal: 12
                }}
                maxLength={6}
                renderErrorMessage={false}
                value={formik?.values?.address?.postalCode}
                onChangeText={(text: string) => {
                  formik.setFieldValue('address.postalCode', text);
                  // formik.setFieldValue()
                }}
                keyboardType="numeric"
                label={`${t('postalcode')}`}
                labelStyle={{
                  fontWeight: '100',
                  fontSize: 15,
                  color: 'black',
                  paddingBottom: 10,
                }}
              />
              {formik.errors.address?.postalCode && (
                <Text style={{ paddingLeft: 10, fontSize: 11, color: 'red' }}>
                  {formik.errors.address.postalCode}
                </Text>
              )}
              
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    paddingTop: 20,
                    paddingLeft: 10,
                    paddingBottom: 10,
                    color: 'black',
                    fontSize: 15,
                  }}>
                  {`${t('select')} ${t('state')}`}
                </Text>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <StateDropDown
                    handleInputChange={handleInputChange}
                    statename={formik?.values?.address?.state}
                  />
                </View>
                {formik.errors.address?.state && (
                  <Text style={{ paddingLeft: 10, fontSize: 11, color: 'red' }}>
                    {formik.errors.address?.state}
                  </Text>
                )}
              </View>
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    paddingTop: 20,
                    paddingLeft: 10,
                    paddingBottom: 10,
                    color: 'black',
                    fontSize: 15,
                  }}>
                  {`${t('select')} ${t('city')}`}
                </Text>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <CityDropDown
                    handleInputChange={handleInputChange}
                    statename={formik?.values?.address?.state}
                    city={formik?.values?.address?.city}
                  />
                </View>
                {formik.errors.address?.city && (
                  <Text style={{ paddingLeft: 10, fontSize: 11, color: 'red' }}>
                    {formik.errors.address?.city}
                  </Text>
                )}
              </View>
              <Button
                title={`${t('submit')}`}
                onPress={() => {
                  console.log('Values ', formik.values);
                  formik.handleSubmit();
                }}
                style={{ paddingTop: 20 }}
                buttonStyle={{
                  backgroundColor: appTheme.NEW_PALLET,
                  borderRadius: 8,
                }}
                titleStyle={{ color: 'black' }}
                containerStyle={{ paddingTop: 10, marginBottom: 10 }}
                disabled={tempDisable}
              />
              {tempDisable ? (
                <Text
                  style={{
                    color: 'red',
                    // justifyContent: 'center',
                    // alignContent: 'center',
                    // alignItems: 'center',
                  }}>
                  {`${t('account_already')}`}
                </Text>
              ) : null}
            </View>
          </View>
          {/* </View> */}
        </KeyboardAwareScrollView>
        <SafeAreaView />
      {/* </SafeAreaView> */}
    </View>
  );
};

export default SignUpOne;
