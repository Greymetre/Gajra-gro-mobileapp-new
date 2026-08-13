import React, {useEffect, useState} from 'react';
import {Dimensions, Image, SafeAreaView, Text, View} from 'react-native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Navigation} from '../../navigation/types';
import appTheme from '../../utils/appTheme';
import BlackButton from '../comman/ButtonBlack/BlackButton';
import DropDown from '../comman/DropDown/DropDown';
import Header from '../comman/Header/Header';
import InputField from '../comman/InputField';
import ButtonComp from '../comman/Button/Button';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import styles from '../../components/Location/styles';
import imagePath from '../../constants/imagePath';
import {TouchableOpacity} from 'react-native-gesture-handler';
import * as Yup from 'yup';
// responsiveHeight
import {useFormik} from 'formik';
import {
  requestGetCountryList,
  requestGetCustomerAddress,
  requestUpdateCustomerLocation,
} from '../../services/backend_helper';
import {Header as HeaderRNE} from '@rneui/themed';
import CityDropDown from '../comman/Address/CityDropDown';
import StateDropDown from '../comman/Address/StateDropDown';
import CountryDropDown from '../comman/Address/CountryDropDown';
import navigationStrings from '../../constants/navigationStrings';
import {NavigationInterFace} from '../../interfaces/navigationType.interface';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
const {height, width} = Dimensions.get('window');

const Location = (props: any) => {
  const navigation = useNavigation<NavigationInterFace>();
  const handleInputChange = (name: string, value: string) => {
    formik.setFieldValue(name, value);
  };
  const fetchCustomerAddress = async () => {
    await requestGetCustomerAddress({})
      .then(res => {
        if (res.isError == false) {
          for (const [key, value] of Object.entries(res.data)) {
            if (initialValues.hasOwnProperty(key)) {
              formik.setFieldValue(key, value);
            }
          }
        }
      })
      .catch(error => {
        console.log('Response: ', error);
      });
  };

  useEffect(() => {
    fetchCustomerAddress();
  }, []);

  const initialValues = {
    address: '',
    postalCode: '',
    country: '',
    state: '',
    city: '',
  };

  const validationSchema = Yup.object({
    address: Yup.string()
      .required('Please enter your area detail')
      .min(3, ({min}) => `Length must be at least ${min} characters`),
    postalCode: Yup.string()
      .required('Please enter the phone number')
      .min(5, ({min}) => `Postal code must be at least ${min} digits`)
      .max(10, ({max}) => `Postal code must be at most ${max} digits`),
    country: Yup.string().required('Please select Country'),
    state: Yup.string().required('Please select State'),
    // .min(1, ({min}) => 'Please select Shop Image'),
    city: Yup.string().required('Please select City'),
  });

  const onSubmit = async (values: any) => {
    await requestUpdateCustomerLocation(formik.values)
      .then(res => {
        if (res.isError == false) {
          navigation.goBack();
        }
      })
      .catch(error => {
        console.log('Response: ', error.response);
      });
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const [selectedItem, setSelectedItem] = useState(null);

  const onSelect = (item: any) => {
    setSelectedItem(item);
  };
  console.log(formik.values);

  return (
    <SafeAreaView style={{backgroundColor: 'white'}}>
      <KeyboardAwareScrollView>
        <HeaderRNE
          backgroundColor="white"
          backgroundImageStyle={{}}
          barStyle="default"
          centerComponent={{
            text: 'Edit Location',
            style: {color: 'black', fontSize: 19, fontWeight: 'bold'},
          }}
          centerContainerStyle={{height: 28, justifyContent: 'center'}}
          // containerStyle={{width: 350}}
          leftComponent={
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={25} color={'black'} />
            </TouchableOpacity>
          }
          placement="center"
        />
        <Image
          source={require('../../../assets/images/maps.png')}
          style={{
            resizeMode: 'cover',
            height: responsiveHeight(30),
            width: width,

            // backgroundColor: 'red',
          }}
        />
        {/* <View
          style={{
            // height: 90,
            // width: 90,
            // height: 20,
            // width: 20,
            position: 'absolute',
            // backgroundColor: 'purple',
            start: responsiveWidth(4),
            top: 10,
          }}>
          <TouchableOpacity
            onPress={() => {
              props.onBackPress();
            }}
            style={
              {
                // backgroundColor: 'red',
                // width: 50,
                // height: 50,
              }
            }>
            <Image
              source={require('../../../assets/images/back_arrow.png')}
              style={styles.backArrow}
              resizeMode={'center'}
            />
          </TouchableOpacity>
        </View> */}
        <View style={styles.button}>
          <View>
            <Image
              style={styles.imageStyle}
              source={imagePath.CURRENT_LOCATION}
              resizeMode={'center'}
            />
          </View>
          <Text style={styles.buttonText}>Use my current location</Text>
        </View>
        <View style={{marginHorizontal: responsiveWidth(4)}}>
          <InputField
            label="Building, House, Area, Locality"
            placeholder="Eg. House No. 125, Church street"
            placeholderTextColor={'#B4B4B4'}
            onChangeText={(text: string) => {
              formik.setFieldValue('address', text);
            }}
            value={formik?.values?.address}
          />
          {formik.errors.address && (
            <Text style={{fontSize: 11, color: 'red'}}>
              {formik.errors.address}
            </Text>
          )}

          <InputField
            label="Postal Code"
            placeholder="Eg. 234 098"
            placeholderTextColor={'#B4B4B4'}
            onChangeText={(text: string) => {
              formik.setFieldValue('postalCode', text);
            }}
            value={formik?.values?.postalCode}
          />
          {formik.errors.postalCode && (
            <Text style={{fontSize: 11, color: 'red'}}>
              {formik.errors.postalCode}
            </Text>
          )}

          <View style={styles.container}>
            <View style={styles.viewStyle}>
              <Text
                style={{
                  paddingTop: 10,
                  paddingBottom: 10,
                  color: 'black',
                  fontSize: responsiveFontSize(2),
                }}>
                Select Country
              </Text>

              <CountryDropDown
                handleInputChange={handleInputChange}
                country={formik?.values?.country}
              />
              {formik.errors.country && (
                <Text style={{fontSize: 11, color: 'red'}}>
                  {formik.errors.country}
                </Text>
              )}
            </View>
            <View style={{margin: 10}}></View>
            {/* <View style={styles.dropDownOne}> */}
            <View style={styles.viewStyle}>
              <Text
                style={{
                  paddingTop: 10,
                  paddingBottom: 10,
                  color: 'black',

                  fontSize: responsiveFontSize(2),
                }}>
                Select State
              </Text>
              <StateDropDown
                handleInputChange={handleInputChange}
                statename={formik?.values?.state}
              />
              {formik.errors.state && (
                <Text style={{fontSize: 11, color: 'red'}}>
                  {formik.errors.state}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.viewStyle}>
            <Text
              style={{
                paddingTop: 10,
                paddingBottom: 10,
                color: 'black',

                fontSize: responsiveFontSize(2),
              }}>
              Select City
            </Text>
            <CityDropDown
              handleInputChange={handleInputChange}
              statename={formik?.values?.state}
              city={formik?.values?.city}
            />
            {formik.errors.city && (
              <Text style={{fontSize: 11, color: 'red'}}>
                {formik.errors.city}
              </Text>
            )}
          </View>

          <View style={styles.viewLocation}>
            <ButtonComp
              title="Confirm Location"
              onPress={() => {
                formik.handleSubmit();
              }}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
      <View style={{height: 160}}></View>
    </SafeAreaView>
  );
};

export default Location;
