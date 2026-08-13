import React, {useEffect, useState} from 'react';
import {Dimensions, PermissionsAndroid, SafeAreaView, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// responsiveHeight
import {useFormik} from 'formik';
import {requestUpdateCustomerLocation} from '../../services/backend_helper';
import {Button, Header as HeaderRNE} from '@rneui/themed';

const {height, width} = Dimensions.get('window');

const ImageUpload = (props: any) => {
  const requestFilePermissions = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (result === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Storage Permission Granted.');
      } else if (result === PermissionsAndroid.RESULTS.DENIED) {
        console.log('Storage Permission Denied.');
      } else if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        console.log('Storage Permission Denied with Never Ask Again.');
        Alert.alert(
          'Storage Permission Required',
          'App needs access to your storage to read files. Please go to app settings and grant permission.',
          [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Open Settings', onPress: openSettings},
          ],
        );
      }
      // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      //   console.log('You can use the camera');
      // } else {
      //   console.log(granted);
      // }
    } catch (err) {
      console.warn(err);
    }
  };
  const initialValues = {
    img: '',
  };

  const onSubmit = async (values: any) => {
    await requestUpdateCustomerLocation(formik.values)
      .then(res => {
        if (res.isError == false) {
        }
      })
      .catch(error => {
        console.log('Response: ', error.response);
      });
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
  });

  return (
    <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
      <KeyboardAwareScrollView>
        <HeaderRNE
          backgroundColor="white"
          backgroundImageStyle={{}}
          barStyle="default"
          centerComponent={{
            text: 'imageupload',
            style: {color: 'black', fontSize: 19, fontWeight: 'bold'},
          }}
          centerContainerStyle={{height: 28, justifyContent: 'center'}}
          // containerStyle={{width: 350}}
          //   leftComponent={}
          placement="center"
        />
        <Button title={'image upload'} onPress={requestFilePermissions} />
      </KeyboardAwareScrollView>
      <View style={{height: 160}}></View>
    </SafeAreaView>
  );
};

export default ImageUpload;
