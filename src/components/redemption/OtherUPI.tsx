import {
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../comman/Header/Header';
import colors from '../../styles/colors';
import {Text} from '@rneui/base';
import navigationStrings from '../../constants/navigationStrings';
import {Card, Header as HeaderRNE} from '@rneui/themed';
import imagePath from '../../constants/imagePath';
import {useNavigation} from '@react-navigation/native';
import styles from './styles';
import DashedLine from 'react-native-dashed-line';
import {
  responsiveHeight,
  responsiveScreenHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import InputField from '../comman/InputField/InputField';
import Button from '../comman/Button/Button';
import {WalletRedemptionInterface} from '../../interfaces/redemption.interface';
import {requestWalletRedemption} from '../../services/backend_helper';
import {NavigationInterFace} from '../../interfaces/navigationType.interface';
import AvailablePoints from '../comman/AvailablePoints';

const OtherUPI = (props: any) => {
  const balPoint = <AvailablePoints />;
  const initialValues = {
    mobile: '',
    redeemedpoints: 0,
    type: 'Paytm',
  };
  const validationSchema = Yup.object({
    mobile: Yup.string().required('Please enter a UPI Id'),
    // .min(10, ({min}) => `UPI Id must be of ${min} digits`)
    // .max(10, ({max}) => `Mobile Number must be of ${max} digits`)
    // .matches(new RegExp(/^[0-9]{10}$/), 'Moile Number must be of 10 digits'),
    redeemedpoints: Yup.string()
      .required('Please Enter redeemed points to Redeem')
      .matches(new RegExp(/^[0-9\b]+$/)),
    // .max(
    //   (balPoint),
    //   'Redemption Points must be less than Available Points',
    // ),
  });
  const [pts, setPts] = useState('');

  const navigation = useNavigation<NavigationInterFace>();
  const onSubmit = async (values: any) => {
    await requestWalletRedemption(values)
      .then(res => {
        console.log(res);
        if (res.isError == false) {
          navigation.navigate(navigationStrings.REWARDSUCCESS, {pts});
        }
      })
      .catch(error => {
        console.log('Response: ', error);
      });
  };

  const formik = useFormik<WalletRedemptionInterface>({
    initialValues: initialValues,
    onSubmit: onSubmit,
    validationSchema,
    enableReinitialize: true,
  });

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <Header
        onPress={navigation.goBack}
        backArrow={imagePath.BACK}
        title={'Other UPI Apps'}
      />
      <View>
        <Text
          style={{
            paddingTop: 10,
            fontWeight: '500',
            fontSize: 17,
            paddingLeft: 16,
          }}>
          Enter UPI Details
        </Text>
        <DashedLine
          dashGap={7}
          dashLength={1}
          dashThickness={1}
          style={{paddingTop: 15}}
        />
        {/* <View style={{width: '90%', marginHorizontal: responsiveWidth(4)}}>
          <InputField
            label={'Name'}
            placeHolder={'Amit'}
            onChangeText={(text: string) => {
              formik.setFieldValue('Name', text);
            }}
            inputStyle={undefined}
            rightIcon={undefined}
          />
          {formik.errors.Name && (
            <Text style={{fontSize: 11, color: 'red'}}>
              {formik.errors.Name}
            </Text>
          )}
        </View> */}
        <View style={{width: '90%', marginHorizontal: responsiveWidth(4)}}>
          <InputField
            label={'UPI Id'}
            placeHolder={'9875523454@upi'}
            onChangeText={(text: string) => {
              formik.setFieldValue('mobile', text);
            }}
            inputStyle={undefined}
            rightIcon={undefined}
          />
          {formik.errors.mobile && (
            <Text style={{fontSize: 11, color: 'red'}}>
              {formik.errors.mobile}
            </Text>
          )}
        </View>
        <View style={{width: '90%', marginHorizontal: responsiveWidth(4)}}>
          <InputField
            label="Points to Redeem"
            placeHolder="300"
            placeHolderTextColor={colors.grey}
            onChangeText={(text: string) => {
              setPts(text);
              formik.setFieldValue('redeemedpoints', text);
            }}
          />
          {formik.errors.redeemedpoints && (
            <Text style={{fontSize: 11, color: 'red'}}>
              {formik.errors.redeemedpoints}
            </Text>
          )}
          <View style={{width: '90%', marginHorizontal: responsiveWidth(4)}}>
            <Text style={{fontSize: responsiveFontSize(2)}}>
              Available points: <AvailablePoints />
            </Text>
          </View>
        </View>
        <View style={{width: '90%', marginHorizontal: responsiveWidth(4)}}>
          <Button
            title="Confirm"
            onPress={() => {
              if (formik.isValid) {
                // console.log(formik.values.)
                console.log('Form is Valid: ', formik.isValid);
                onSubmit(formik.values);
                // navigation.navigate(navigationStrings.REWARDSUCCESS, {pts});
              } else {
                console.log('Form is Valid: ', formik.isValid);
              }
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OtherUPI;
