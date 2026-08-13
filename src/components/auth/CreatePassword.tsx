import React, {useState, useEffect} from 'react';
import { Dimensions, Image, SafeAreaView, Text, TextInput,TouchableOpacity,View, RefreshControl} from 'react-native';
import appTheme from '../../utils/appTheme';
import * as Yup from 'yup';
import {useFormik} from 'formik';
import LinearGradient from 'react-native-linear-gradient';
import {Button, ButtonGroup} from '@rneui/themed';
import { requestCreateNewPassword } from '../../services/backend_helper'
import {useNavigation} from '@react-navigation/native';
import navigationStrings from '../../constants/navigationStrings';
import { NavigationInterFace } from '../../interfaces/navigationType.interface';
const {height, width} = Dimensions.get('window');
const CreatePassword = ({ username }: { username : string}) => {
    const navigation = useNavigation<NavigationInterFace>();
    const initialValues = {
        username: username,
        password: '',
        passwordConfirmation : '',
        isVisible: true,
        isClicked: false,
        focusConfPassword: false,
        focusPassword: false,
    };

    const validationSchema = Yup.object({
        username: Yup.string()
          .required('Please enter mobile number')
          .min(10)
          .max(13),
        password: Yup.string().min(8).max(20).required('Password is required'),
        passwordConfirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
      });
      const onSubmit = async (values: any) => {
        formik.setFieldValue('isClicked', true);
        const iData = {username : formik.values.username, password : formik.values.password}
        await requestCreateNewPassword(iData)
        .then((res) => {
          if (res.isError == false) {
            navigation.navigate(navigationStrings.LOGIN);
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
                  focusConfPassword: false,
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
              borderWidth: formik.values.focusConfPassword ? 0 : 1,
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
                borderRadius: 8,
                paddingRight: 10,
              }}
              placeholder={'Confirm Password'}
              placeholderTextColor="#AAAAAA"
              value={formik.values.passwordConfirmation}
              onChangeText={(text: string) => {
                formik.setFieldValue("passwordConfirmation", text);
              }}
              secureTextEntry={formik.values.isVisible}
              onFocus={() => {
                formik.setValues({
                  ...formik.values,
                  focusConfPassword: false,
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
        {formik.errors.passwordConfirmation && (
          <Text style={{fontSize: 11, color: 'red'}}>
            {formik.errors.passwordConfirmation}
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
  )
}

export default CreatePassword