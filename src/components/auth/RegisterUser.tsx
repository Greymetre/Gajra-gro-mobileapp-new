import React, {useState, useEffect} from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import appTheme from '../../utils/appTheme';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import LinearGradient from 'react-native-linear-gradient';
import {Button, ButtonGroup} from '@rneui/themed';
import {
  requestCreateNewPassword,
  requestSignup,
} from '../../services/backend_helper';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../constants/navigationStrings';
import {NavigationInterFace} from '../../interfaces/navigationType.interface';
import InputField from '../comman/InputField/InputField';
import StateDropDown from '../comman/Address/StateDropDown';
import {setTokenAsyncStorage} from '../../services/auth_helper';
import {stackUpdate} from '../../redux/action-creators';
import {useDispatch} from 'react-redux';
const {height, width} = Dimensions.get('window');
// requestSignup
const RegisterUser = ({username}: {username: string}) => {
  const navigation = useNavigation<NavigationInterFace>();
  const initialValues = {
    username: username,
    password: '',
    // passwordConfirmation: '',
    isVisible: true,
    isClicked: false,
    // focusConfPassword: false,
    focusPassword: false,
    firmName: '',
    contactPerson: '',
    mobile: username,
    customerType: 'Mechanic',
    phoneCode: '+91',
    email: null,
    // avatar: null,
    // shopimage: null,
    address: {
      postalCode: '451001',
      country: 'India',
      state: 'Madhya Pradesh',
      city: 'Indore',
      address: 'test affr',
    },
  };
  const dispatch = useDispatch();
  const validationSchema = Yup.object({
    username: Yup.string()
      .required('Please enter mobile number')
      .min(10)
      .max(13),
    password: Yup.string().min(8).max(20).required('Password is required'),
    // passwordConfirmation: Yup.string().oneOf(
    //   [Yup.ref('password'), null],
    //   'Passwords must match',
    // ),
    firmName: Yup.string()
      .required('Please enter shop name')
      .min(3, ({min}) => `Shop name must be at least ${min} characters`),
    contactPerson: Yup.string()
      .required('Please enter the your name')
      .min(3, ({min}) => `Your name must be at least ${min} characters`),
    mobile: Yup.string()
      // .required('Please enter the mobile number')
      .min(10, ({min}) => `Phone number must be at least ${min} digits`)
      .max(10, ({max}) => `Phone number must be at most ${max} digits`),
    customerType: Yup.string().required('Please select Customer Type'),
  });
  const onSubmit = async (values: any) => {
    formik.setFieldValue('isClicked', true);
    var data = {
      firmName: formik.values.firmName,
      contactPerson: formik.values.contactPerson,
      phoneCode: '+91',
      mobile: formik.values.mobile,
      email: null,
      password: formik.values.password,
      customerType: 'Mechanic',
      address: {
        postalCode: '',
        address: '',
        city: '',
        state: '',
        country: 'India',
      },
    };
    console.log('Sign Up Data', data);
    requestSignup(data)
      .then(res => {
        // formik.setFieldValue('isClicked', false);
        if (res.isError == false && res.message == 'SUCCESS') {
          // formik.setValues({ ...initialValues, isClicked: false });
          var resData = JSON.stringify(res.data);
          setTokenAsyncStorage(res?.data?.token);
          // dispatch(login(resData));
          dispatch(stackUpdate('dashboard'));
        } else {
          () => console.log('Ask me later pressed');
        }
      })
      .catch(error => {
        // formik.setFieldValue("isClicked", false);
        console.log('Sign Up Error Response >>>>  ', error);
      });
  };

  //   const iData = {
  //     username: formik.values.username,
  //     password: formik.values.password,
  //   };
  //   await requestCreateNewPassword(iData)
  //     .then(res => {
  //       if (res.isError == false) {
  //         navigation.navigate(navigationStrings.LOGIN);
  //       }
  //     })
  //     .catch(error => {
  //       console.log('Response: ', error);
  //     });
  // };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
    enableReinitialize: true,
  });
  return (
    <SafeAreaView style={{backgroundColor: appTheme.APP_BACKGROUND_COLOR}}>
      <View>
        <LinearGradient
          colors={['#39B8FF', '#0029FF']}
          style={{
            width: width * 0.88,
            padding: formik.values.focusPassword ? 1 : 0,
            borderRadius: 8,
            marginTop: 10,
          }}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}>
          <View
            style={{
              width: width * 0.88 - (formik.values.focusPassword ? 2 : 0),
              borderColor: 'black',
              borderWidth: formik.values.focusPassword ? 0 : 1,
              borderRadius: 8,
              // marginTop: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 10,
              backgroundColor: 'white',
            }}>
            <TextInput
              style={{
                width: width * 0.8 - 20,
                borderColor: 'black',
                // borderWidth: 1,
                borderRadius: 8,
                // marginTop: 10,
                paddingRight: 10,
                // backgroundColor: 'purple',
              }}
              placeholder={'Password'}
              placeholderTextColor="#AAAAAA"
              value={formik.values.password}
              onChangeText={(text: string) => {
                formik.setFieldValue('password', text);
              }}
              secureTextEntry={formik.values.isVisible}
              onFocus={() => {
                formik.setValues({
                  ...formik.values,
                  focusPassword: true,
                });
              }}
            />
            <TouchableOpacity
              onPress={() => {
                formik.setFieldValue('isVisible', !formik.values.isVisible);
              }}
              style={{
                width: width * 0.06,
              }}>
              <Image
                source={require('../../../assets/images/eye_off.png')}
                style={{resizeMode: 'contain', width: width * 0.06}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>
        {formik.errors.password && (
          <Text style={{fontSize: 11, color: 'red'}}>
            {formik.errors.password}
          </Text>
        )}
        <View>
          <InputField
            label="Your Name"
            placeHolder="Your Name"
            rightIcon={undefined}
            onPressRight={() => {}}
            onChangeText={(text: string) => {
              // setRequestData({ ...requestData, firmName: text });
              formik.setFieldValue('contactPerson', text);
            }}
            inputStyle={{}}
          />
          {formik.errors.contactPerson && (
            <Text style={{fontSize: 11, color: 'red'}}>
              {formik.errors.contactPerson}
            </Text>
          )}

          <InputField
            label="Contact Number"
            placeHolder="Mobile"
            rightIcon={undefined}
            onPressRight={() => {}}
            value={username}
            // value={mobile_val}
            // onChangeText={(text: number) => {
            //   // setRequestData({
            //   //   ...requestData,
            //   //  mobile: parseInt(text),
            //   // });
            //   formik.setFieldValue('mobile', parseInt(text));
            // }}
            inputStyle={{}}
            readonly={true}
          />
          {formik.errors.mobile && (
            <Text style={{fontSize: 11, color: 'red'}}>
              {formik.errors.mobile}
            </Text>
          )}
          <InputField
            label="Shop Name"
            placeHolder="Shop Name"
            rightIcon={undefined}
            onPressRight={() => {}}
            onChangeText={(text: string) => {
              // setRequestData({ ...requestData, : text });
              formik.setFieldValue('firmName', text);
            }}
            inputStyle={{}}
          />
          {formik.errors.firmName && (
            <Text style={{fontSize: 11, color: 'red'}}>
              {formik.errors.firmName}
            </Text>
          )}
          {/* <InputField
            label="Address"
            placeHolder="Address"
            rightIcon={undefined}
            onPressRight={() => {}}
            onChangeText={(text: string) => {
              // setRequestData({ ...requestData, : text });
              formik.setFieldValue('address', text);
            }}
            inputStyle={{}}
          />
          {formik.errors.address && (
            <Text style={{fontSize: 11, color: 'red'}}>
              {formik.errors.address.address}
            </Text>
          )} */}
        </View>

        <View style={{paddingTop: 10}}>
          <Button
            title="Submit"
            loading={formik.values.isClicked}
            onPress={() => {
              formik.handleSubmit();
            }}
            buttonStyle={{
              backgroundColor: appTheme.NEW_PALLET,
              // backgroundColor: "#FFE712",
              borderRadius: 8,
            }}
            disabled={formik.values.isClicked ? true : !formik.isValid}
            titleStyle={{color: 'black'}}
            containerStyle={{paddingTop: 10}}
          />
        </View>
        {/* <View style={{padding: 100, margin: 100}} /> */}
      </View>
    </SafeAreaView>
  );
};

export default RegisterUser;
