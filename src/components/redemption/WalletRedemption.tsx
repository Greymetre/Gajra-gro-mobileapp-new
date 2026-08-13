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
} from 'react-native-responsive-dimensions';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import InputField from '../comman/InputField/InputField';
import Button from '../comman/Button/Button';
import {WalletRedemptionInterface} from '../../interfaces/redemption.interface';
import {requestWalletRedemption} from '../../services/backend_helper';
import {NavigationInterFace} from '../../interfaces/navigationType.interface';
// useState
const WalletRedemption = (props: any) => {
  const [pts, setPts] = useState('');

  const initialValues = {
    mobile: '',
    redeemedpoints: 0,
    type: 'Paytm',
  };
  const validationSchema = Yup.object({
    mobile: Yup.string()
      .required('Please enter a number')
      .min(10, ({min}) => `Mobile Number must be of ${min} digits`)
      .max(10, ({max}) => `Mobile Number must be of ${max} digits`)
      .matches(new RegExp(/^[0-9]{10}$/), 'Moile Number must be of 10 digits'),
  });
  const navigation = useNavigation<NavigationInterFace>();

  // const renderIconImage = ({item}) => {
  //   return (
  //     <View>
  //       <Image source={item.image} />
  //     </View>
  //   );
  // };
  const onSubmit = async (values: any) => {
    await requestWalletRedemption(values)
      .then(res => {
        console.log(res);
        if (res.isError == false) {
          // navigation.navigate(navigationStrings.REDEEMHISTORY)
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
        title={'Paytm Wallet'}
      />
      {/* <View>
        <Card containerStyle={styles.big_card_view}>
          <Image style={styles.image_view} source={imagePath.LOGIN} />
        </Card>
      </View> */}
      <View>
        <Text
          style={{
            paddingTop: 10,
            fontWeight: '500',
            fontSize: 17,
            paddingLeft: 16,
          }}>
          Enter Paytm Wallet Details
        </Text>
        {/* <FlatList
          numColumns={2}
          data={pay_list}
          renderItem={({item}) => (
            <Card containerStyle={styles.upi_cards}>
              <TouchableOpacity
                // onPress={() => navigation.navigate(item.screenPath)}
                style={
                  {
                    // justifyContent: 'space-between',
                    // alignItems: 'center',
                    // paddingVertical: responsiveHeight(3),
                    // paddingHorizontal:
                    //   Platform.OS === 'android'
                    //     ? responsiveWidth(4)
                    //     : responsiveWidth(5.5),
                  }
                }>
                <View style={styles.row}>
                  <Text style={styles.text_text}>{item.title}</Text>
                  <Image source={item.image} style={styles.other_upi} />
                </View>
              </TouchableOpacity>
            </Card>
          )}
               */}
        {/* // <DashedLine></DashedLine> */}
        {/* /> */}
        <DashedLine
          dashGap={7}
          dashLength={1}
          dashThickness={1}
          style={{paddingTop: 15}}
        />
        <View style={{width: '90%', marginHorizontal: responsiveWidth(4)}}>
          <InputField
            label={'Mobile Number'}
            placeHolder={'9875523454'}
            onChangeText={(text: string) => {
              formik.setFieldValue('mobile', text);
            }}
            inputStyle={undefined}
            rightIcon={undefined}
            onPressRight={undefined}
          />
          {formik.errors.mobile && (
            <Text style={{fontSize: 11, color: 'red'}}>
              {formik.errors.mobile}
            </Text>
          )}
        </View>
        <View style={{width: '90%', marginHorizontal: responsiveWidth(4)}}>
          <InputField
            label={'Points'}
            placeHolder={'100'}
            onChangeText={(text: number) => {
              setPts(text);
              formik.setFieldValue('redeemedpoints', text);
            }}
            inputStyle={undefined}
            rightIcon={undefined}
            onPressRight={undefined}
          />
        </View>

        <View style={{width: '90%', marginHorizontal: responsiveWidth(4)}}>
          <Button
            title="Confirm"
            onPress={() => {
              if (formik.isValid) {
                onSubmit(formik.values);
                navigation.navigate(navigationStrings.REWARDSUCCESS, {pts});
                console.log('Form is Valid: ', formik.isValid);
                // console.log('form is valf')
                // props.navigation.navigate();
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

export default WalletRedemption;
