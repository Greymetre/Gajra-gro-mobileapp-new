import React, {useState, useEffect} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import appTheme from '../../utils/appTheme';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import {useDispatch} from 'react-redux';
import {login, stackUpdate} from '../../redux';
import LinearGradient from 'react-native-linear-gradient';
import {
  setSettingAsyncStorage,
  setTokenAsyncStorage,
} from '../../services/auth_helper';

import {Button, ButtonGroup} from '@rneui/themed';
import {color} from 'react-native-reanimated';
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../constants/navigationStrings';
import {NavigationInterFace} from '../../interfaces/navigationType.interface';

import { requestLoginPassword } from '../../services/backend_helper';
const {height, width} = Dimensions.get('window');
const PasswordLogin = ({ username }: { username : string}) => {

  useEffect(() => {}, []);
  const navigation = useNavigation<NavigationInterFace>();
  const dispatch = useDispatch();
  const initialValues = {
    username: username,
    password: '',
    isVisible: true,
    isClicked: false,
    focusUserName: false,
    focusPassword: false,
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .required('Please enter mobile number')
      .min(10)
      .max(13),
    password: Yup.string().min(8).max(30).required('Password is required'),
  });

  const onSubmit = async (values: any) => {
    console.log('passwe')
    formik.setFieldValue('isClicked', true);
    const iData = {username : formik.values.username, password : formik.values.password}
        await requestLoginPassword(iData)
        .then((res) => {
          if (res.isError == false) {
            formik.setValues({...initialValues, isClicked: false});
            var resData = JSON.stringify(res.data);
            setTokenAsyncStorage(res?.data?.token);
            dispatch(login(resData));
            dispatch(stackUpdate('dashboard'));
          }
          else {
            Alert.alert('', `${res.message}`, [
              {
                text: 'OK',
                onPress: () => console.log('Ask me later pressed'),
                style: 'cancel',
              },
            ]);
          }
        })
        .catch((error) => {
          console.log("Response: ", error);
        });
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
    enableReinitialize: true,
  });
  return (
    <SafeAreaView style={{backgroundColor: appTheme.APP_BACKGROUND_COLOR}}>
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
                formik.setFieldValue("password", text);
              }}
              secureTextEntry={formik.values.isVisible}
              onFocus={() => {
                formik.setValues({
                  ...formik.values,
                  focusUserName: false,
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
    </SafeAreaView>
  );
};

export default PasswordLogin;
