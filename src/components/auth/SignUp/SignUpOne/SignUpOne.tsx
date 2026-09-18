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
  Alert,
  StyleSheet,
  ActivityIndicator,
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
import {
  requestLocationPermission,
  getCurrentCoordinates,
  toGeoJsonCoordinates,
  alertLocationPermissionDenied,
  alertLocationPermissionBlocked,
  alertLocationUnavailable,
} from '../../../../utils/locationHelper';
import type {UserCoordinates} from '../../../../utils/locationHelper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KycCardHeader, KycField, kycStyles } from '../../../bottomtabs/profile/KycCardParts';

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
  const safeInsets = useSafeAreaInsets();

  const [tempDisable, setTempDisable] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const [userExistResponse, setUserExistResponse] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [shopImg, setShopImg] = React.useState<any>(null);
  const [avatarImg, setAvatarImg] = React.useState<any>(null);
  const [custType, setCustType] = useState<string>();
  const [coords, setCoords] = useState<UserCoordinates | null>(null);

  /**
   * Asks for the permission when needed, then reads the position.
   * `showPopup` is off for the silent warm-up on mount and on for the submit
   * attempt, where the user has to be told why we are blocking them.
   */
  const ensureLocation = async (
    showPopup: boolean = true,
  ): Promise<UserCoordinates | null> => {
    const status = await requestLocationPermission();

    if (status === 'blocked') {
      if (showPopup) {
        alertLocationPermissionBlocked();
      }
      return null;
    }

    if (status === 'denied') {
      if (showPopup) {
        alertLocationPermissionDenied(() => {
          ensureLocation();
        });
      }
      return null;
    }

    const position = await getCurrentCoordinates();
    if (!position) {
      if (showPopup) {
        alertLocationUnavailable(() => {
          ensureLocation();
        });
      }
      return null;
    }

    setCoords(position);
    return position;
  };

  // Warm up the GPS fix while the user is still filling the form so the
  // coordinates are ready by the time they press submit.
  useEffect(() => {
    ensureLocation(false);
  }, []);
  // const [country, setCountry] =

  const handleInputChange = (name: string, value: string) => {
    formik.setFieldValue(name, value);
  };
  const initialValues = {
    firmName: '',
    contactPerson: '',
    buyerName: '',
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
        .matches(/^[0-9]+$/, 'Postal code must contain only digits')
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
    // The mount effect usually has the fix ready; retry here (with the popups
    // enabled) when the permission was refused or the first attempt timed out.
    const position = coords ?? (await ensureLocation());
    if (!position) {
      return;
    }
    var data = {
      firmName: formik.values.firmName,
      contactPerson: formik.values.contactPerson,
      // Optional; only sent when filled so older backends don't reject the field.
      ...(formik.values.buyerName?.trim() ? { buyerName: formik.values.buyerName.trim() } : {}),
      phoneCode: '+91',
      mobile: formik.values.mobile,

      deviceToken: `${fcmToken}`,
      deviceType: Platform.OS,

      // email: null,
      // password: formik.values.password,
      customerType: formik.values.customerType,
      address: {
        postalCode: formik.values.address.postalCode,
        address: formik.values.address.address,
        city: formik.values.address.city,
        state: formik.values.address.state,
        country: 'India',
        // GeoJSON order: [longitude, latitude]
        coordinates: toGeoJsonCoordinates(position),
      },
    };
    console.log('Button Pressed++++++',data);
    // Don't block sign up when the FCM token is missing (e.g. iOS simulator or
    // notifications denied) - the OTP login flow already allows this.
    console.log('Sign Up Data', data);
    setBtnClicked(true);
    requestSignup(data)
      .then(res => {
        console.log('response', res);
        if (res.isError == false && res.message == 'SUCCESS') {
          console.log(res.data);
          var resData = JSON.stringify(res.data);
          setTokenAsyncStorage(res?.data?.token);
          dispatch(login(resData));
          dispatch(stackUpdate('dashboard'));
        } else {
          Alert.alert('Sign Up Failed', res?.message || 'Something went wrong. Please try again.');
        }
      })
      .catch(error => {
        console.log('Sign Up Error Response >>>>  ', error);
        Alert.alert(
          'Sign Up Failed',
          error?.response?.data?.message || error?.message || 'Something went wrong. Please try again.',
        );
      })
      .finally(() => setBtnClicked(false));
    
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

  // Loosely typed views of formik errors / route params for the JSX below.
  const errs: any = formik.errors;
  const routeParams: any = route.params ?? {};

  const dropdownStyle: any = {
    width: '100%',
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)',
  };

  return (
    // White behind the status bar so it blends with the header; the page itself is grey.
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={suStyles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          hitSlop={6}
          style={({ pressed }) => [suStyles.headerButton, pressed && { opacity: 0.6 }]}>
          <Icon name="chevron-back" size={22} color={appTheme.DARK_BOTTOMTAB} />
        </Pressable>
        <Text style={suStyles.headerTitle}>{`${t('signup')}`}</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAwareScrollView
        style={{ backgroundColor: '#F7F7F7' }}
        contentContainerStyle={{ paddingBottom: 40 + safeInsets.bottom }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}>
        {/* Intro */}
        <View style={suStyles.intro}>
          <View style={suStyles.introIcon}>
            <Icon name="person-add" size={22} color={appTheme.DARK_BOTTOMTAB} />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={suStyles.introTitle}>Create your account</Text>
            <Text style={suStyles.introText}>
              Tell us about you and your shop to start earning points.
            </Text>
          </View>
        </View>

        {/* Personal details */}
        <View style={kycStyles.card}>
          <KycCardHeader icon="person-outline" title="Your Details" />
          <KycField
            label={`${t('name')} *`}
            icon="person-outline"
            locked={false}
            value={formik.values.contactPerson}
            onChangeText={(text: string) => formik.setFieldValue('contactPerson', text)}
            textContentType="name"
            autoCapitalize="words"
            placeholder="Enter your full name"
            error={errs.contactPerson}
          />
          <KycField
            label={`${t('phoneno')}`}
            icon="call-outline"
            locked
            value={`${routeParams.mobileno ?? ''}`}
            helper="Verified with OTP"
          />
          <Text style={suStyles.fieldLabel}>{`${t('customertype')} *`}</Text>
          <CustomerTypeDropDowm
            handleInputChange={handleInputChange}
            statename={formik?.values?.customerType}
            dropdownStyle={dropdownStyle}
          />
          {errs.customerType ? (
            <Text style={suStyles.errorText}>{errs.customerType}</Text>
          ) : null}
        </View>

        {/* Shop details */}
        <View style={kycStyles.card}>
          <KycCardHeader icon="storefront-outline" title="Shop Details" />
          <KycField
            label={`${t('shopname')} *`}
            icon="storefront-outline"
            locked={false}
            value={formik.values.firmName}
            onChangeText={(text: string) => formik.setFieldValue('firmName', text)}
            autoCapitalize="words"
            placeholder="Enter shop name"
            error={errs.firmName}
          />
          <KycField
            label="Buyer Name (Optional)"
            icon="cart-outline"
            locked={false}
            value={formik.values.buyerName}
            onChangeText={(text: string) => formik.setFieldValue('buyerName', text)}
            autoCapitalize="words"
            maxLength={60}
            placeholder="Person who buys stock for the shop"
          />
        </View>

        {/* Address */}
        <View style={kycStyles.card}>
          <KycCardHeader icon="location-outline" title="Shop Address" />
          <KycField
            label={`${t('address')}`}
            icon="home-outline"
            locked={false}
            value={formik.values.address.address}
            onChangeText={(text: string) => formik.setFieldValue('address.address', text)}
            placeholder="House / shop no., street, area"
            error={errs.address?.address}
          />
          <KycField
            label={`${t('postalcode')} *`}
            icon="mail-outline"
            locked={false}
            value={formik?.values?.address?.postalCode}
            onChangeText={(text: string) =>
              formik.setFieldValue('address.postalCode', text.replace(/[^0-9]/g, ''))
            }
            keyboardType="number-pad"
            maxLength={6}
            placeholder="6-digit PIN code"
            error={errs.address?.postalCode}
          />
          <Text style={suStyles.fieldLabel}>{`${t('state')} *`}</Text>
          <StateDropDown
            handleInputChange={handleInputChange}
            statename={formik?.values?.address?.state}
            dropdownStyle={dropdownStyle}
          />
          {errs.address?.state ? (
            <Text style={suStyles.errorText}>{errs.address?.state}</Text>
          ) : null}
          <Text style={suStyles.fieldLabel}>{`${t('city')}`}</Text>
          <CityDropDown
            handleInputChange={handleInputChange}
            statename={formik?.values?.address?.state}
            city={formik?.values?.address?.city}
            dropdownStyle={dropdownStyle}
          />
          {errs.address?.city ? (
            <Text style={suStyles.errorText}>{errs.address?.city}</Text>
          ) : null}
          <View style={suStyles.locationNote}>
            <Icon name="location" size={14} color="#2F6FED" />
            <Text style={suStyles.locationNoteText}>
              Your current location is saved with your shop, so please sign up from your shop.
            </Text>
          </View>
        </View>

        {tempDisable ? (
          <View style={suStyles.existsBox}>
            <Icon name="alert-circle" size={18} color="#D93025" />
            <Text style={suStyles.existsText}>{`${t('account_already')}`}</Text>
          </View>
        ) : null}

        <Pressable
          disabled={tempDisable || isBtnClicked}
          onPress={() => formik.handleSubmit()}
          style={({ pressed }) => [
            suStyles.submitButton,
            (tempDisable || isBtnClicked) && suStyles.submitDisabled,
            pressed && { transform: [{ scale: 0.98 }] },
          ]}>
          {isBtnClicked ? (
            <ActivityIndicator color={appTheme.DARK_BOTTOMTAB} />
          ) : (
            <>
              <Text style={suStyles.submitText}>{`${t('submit')}`}</Text>
              <Icon name="arrow-forward" size={18} color={appTheme.DARK_BOTTOMTAB} style={{ marginLeft: 6 }} />
            </>
          )}
        </Pressable>
      </KeyboardAwareScrollView>
    </View>
  );
};

const suStyles = StyleSheet.create({
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
  headerButton: {
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
  intro: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    marginTop: 16,
    backgroundColor: '#FFFBE0',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F2EC7A',
    padding: 14,
  },
  introIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FBF201',
    alignItems: 'center',
    justifyContent: 'center',
  },
  introTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1C',
  },
  introText: {
    fontSize: 12.5,
    color: '#6B6B6B',
    marginTop: 3,
  },
  fieldLabel: {
    fontSize: 13,
    color: 'black',
    marginTop: 12,
    marginBottom: 6,
  },
  errorText: {
    fontSize: 11,
    color: 'red',
    marginTop: 4,
  },
  locationNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 14,
    backgroundColor: '#E8F0FF',
    borderRadius: 10,
    padding: 10,
  },
  locationNoteText: {
    flex: 1,
    fontSize: 11.5,
    color: '#3A4A6B',
    marginLeft: 6,
    lineHeight: 16,
  },
  existsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    marginTop: 14,
    backgroundColor: '#FDECEA',
    borderRadius: 12,
    padding: 12,
  },
  existsText: {
    flex: 1,
    fontSize: 13,
    color: '#D93025',
    marginLeft: 8,
  },
  submitButton: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    marginTop: 20,
    height: 52,
    borderRadius: 14,
    backgroundColor: appTheme.NEW_PALLET,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#C9962F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitDisabled: {
    backgroundColor: '#ECECEC',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
    color: appTheme.DARK_BOTTOMTAB,
  },
});

export default SignUpOne;
