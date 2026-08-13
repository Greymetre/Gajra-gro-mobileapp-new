import React, {useState} from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Header from '../../../comman/Header/Header';
import InputField from '../../../comman/InputField/InputField';
import Picker from '../../../comman/Picker/Picker';
import Button from '../../../comman/Button/Button';
import styles from '../../SignUp/SignUpTwo/styles';
import {useNavigation} from '@react-navigation/native';
import DropDown from '../../../comman/DropDown/DropDown';
import navigationStrings from '../../../../constants/navigationStrings';
import imagePath from '../../../../constants/imagePath';
import * as Yup from 'yup';
import {useFormik} from 'formik';

const SignUpTwo = (props: any) => {
  const navigation = useNavigation();

  const initialValues = {
    aadharNo: '',
    aadharImg: '',
    panNo: '',
    panImg: '',
    gstNo: '',
    gstImg: '',
    docType: '',
  };

  const validationSchema = Yup.object({
    aadharNo: Yup.string()
      .min(12, ({min}) => `Aadhar number must be ${min} digits`)
      .max(12, ({max}) => `Aadhar number must be ${max} digits`)
      .matches(
        new RegExp(/^[0-9\b\+\(\)]+$/),
        'Aadhar number contains digits only',
      ),
    panNo: Yup.string().matches(
      new RegExp(/^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/),
      'Please enter valid PAN number',
    ),
    gstNo: Yup.string().matches(
      new RegExp(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/),
      'Please enter valid GST number',
    ),
    docType: Yup.string().required('Please Select KYC Document Type'),
  });
  const onSubmit = async (values: any) => {
    console.log('>>>>>  Submit Clicked  <<<<<');
  };
  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });
  const docTypelist = ['Voter ID', "Driver's License", 'Electricity Bill'];
  const [selectedItem, setSelectedItem] = useState(null);
  const onSelect = (item: any) => {
    setSelectedItem(item);
    if (item == 'Aadhar') {
    } else if (item == 'PAN') {
    } else if (item == 'GST') {
    }
  };

  const [regResult, setRegResult] = useState('');

  return (
    <View style={{flex: 1}}>
      <SafeAreaView>
        <Header
          title="Sign Up"
          backArrow={imagePath.BACK}
          onPress={() => {
            // navigation.navigate(navigationStrings.SIGN_UP_ONE);
            props.navigation.navigate(navigationStrings.SIGN_UP_ONE);
          }}
        />

        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.stepContainer}>
            <View style={styles.stepInnerContainer}>
              <View style={styles.stepOne}>
                <Image
                  source={imagePath.ICON_ONE}
                  style={styles.imageOne}
                  resizeMode={'cover'}
                />
                <Text style={styles.titleDetails}>Details</Text>
              </View>
              <View style={styles.stepTwo}>
                <Image
                  source={imagePath.ICON_TWO}
                  style={styles.imageTwo}
                  resizeMode={'cover'}
                />
                <Text style={styles.titleKyc}>KYC</Text>
              </View>
              <View style={styles.stepThree}>
                <Image
                  source={imagePath.ICON_THREE}
                  style={styles.imageThree}
                  resizeMode={'cover'}
                />
                <Text style={styles.titleSurvey}>Survey</Text>
              </View>
            </View>
          </View>
          <View style={styles.viewStyle}>
            <View style={styles.innerContainer}>
              {/* <form onSubmit={formik.handleSubmit} autoComplete="off"> */}
              <InputField
                label="Aadhar Number"
                placeHolder="1234 1234 1234"
                // placeholderTextColor={'#B4B4B4'}
                rightIcon={undefined}
                onPressRight={() => {}}
                onChangeText={(text: string) => {
                  formik.setFieldValue('aadharNo', text);
                }}
                inputStyle={{}}
              />
              {formik.errors.aadharNo && (
                <Text style={{fontSize: 11, color: 'red'}}>
                  {formik.errors.aadharNo}
                </Text>
              )}

              <Picker
                camera={imagePath.UPLOAD}
                label="Upload Aadhar image"
                camera_title="Size ( 100 -140 kb )"
              />
              <View style={styles.lineStyle}></View>
              <InputField
                label="PAN Number"
                placeHolder="ABCDE1234Z"
                // placeholderTextColor={'#B4B4B4'}
                rightIcon={undefined}
                onPressRight={() => {}}
                onChangeText={(text: string) => {
                  formik.setFieldValue('panNo', text);
                }}
                inputStyle={{}}
              />
              {/* {formik.errors.panNo && (
                <Text style={{ fontSize: 11, color: 'red' }}>
                  {formik.errors.panNo}
                </Text>
              )} */}
              <Picker
                camera={imagePath.UPLOAD}
                label="PAN image"
                labelTwo="Upload PAN image"
                camera_title="Size ( 100 -140 kb )"
              />
              <InputField
                label="GST Number"
                placeHolder="23AAAGM0289CA19"
                // placeholderTextColor={'#B4B4B4'}
                rightIcon={undefined}
                onPressRight={() => {}}
                onChangeText={(text: string) => {
                  formik.setFieldValue('gstNo', text);
                }}
                inputStyle={{}}
              />
              {/* {formik.errors.gstNo && (
                <Text style={{ fontSize: 11, color: 'red' }}>
                  {formik.errors.gstNo}
                </Text>
              )} */}
              <Picker
                camera={imagePath.UPLOAD}
                label="Upload GST image"
                camera_title="Size ( 100 -140 kb )"
              />
              <InputField
                label="Phone*"
                placeHolder="Contact Name"
                // placeholderTextColor={'#B4B4B4'}
                rightIcon={undefined}
                onPressRight={() => {}}
                onChangeText={() => {}}
                inputStyle={{}}
              />
              <View>
                <DropDown
                  label="Choose Document Type"
                  value={formik.values.docType}
                  data={docTypelist}
                  onSelect={(arg: string) => {
                    formik.setFieldValue('docType', arg);
                  }}
                />
                {/* <DropDown
                    label="Select document type"
                    value={selectedItem}
                    data={docTypes}
                    onSelect={onSelect}
                  /> */}
              </View>
            </View>
            <Button
              title="Next"
              // aadharValid
              // panValid
              onPress={() => {
                if (formik.isValid) {
                  props.navigation.navigate(navigationStrings.SIGN_UP_THREE);
                }
                formik.handleSubmit();
                console.log('-------');
                console.log('Form is valid: ', formik.isValid);
                console.log('-------');
                console.log('Form is submitting: ', formik.isSubmitting);
                // console.log(formik.isValidating);
              }}
              // () => {
              // let aadharValid:boolean=false;
              // if (formik.values.aadharNo.length==12){
              //   aadharValid=true;
              // }
              // let panValid:boolean=false;
              // if (formik.values.panNo.length==10){
              //   panValid=true;
              // }
              // let gstValid:boolean=false;
              // if (formik.values.gstNo.length==12){
              //   gstValid=true;
              // }

              // if(!formik.values.aadharImg||!formik.values.gstImg||!formik.values.panImg){
              // }
              // else{
              //   if(aadharValid||gstValid||panValid){
              //   }
              // }
              // valiada
              // navigation.navigate(navigationStrings.SIGN_UP_THREE);
              // formik.handleSubmit();
              // }}
            />
            {/* </form> */}
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </View>
  );
};
export default SignUpTwo;
