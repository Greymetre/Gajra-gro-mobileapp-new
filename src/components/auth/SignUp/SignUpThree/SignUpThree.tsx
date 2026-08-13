import React, {useCallback, useState} from 'react';
import {Image, SafeAreaView, Text, View} from 'react-native';
import {
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import RadioGroup from 'react-native-radio-buttons-group';
// import RangeSlider from '@jesster2k10/react-native-range-slider';
import styles from '../../SignUp/SignUpThree/styles';
import Header from '../../../comman/Header/Header';
import InputField from '../../../comman/InputField/InputField';
import DropDown from '../../../comman/DropDown/DropDown';
import Button from '../../../comman/Button/Button';
import {useNavigation} from '@react-navigation/native';
import CheckBox from '../../../comman/CheckBox/CheckBox';
import colors from '../../../../styles/colors';
import navigationStrings from '../../../../constants/navigationStrings';
import imagePath from '../../../../constants/imagePath';
import finalPropsSelectorFactory from 'react-redux/es/connect/selectorFactory';
import * as Yup from 'yup';
import {useFormik} from 'formik';

const SignUpThree = (props: any) => {
  const navigation = useNavigation();
  const initialValues = {
    name: '',
    occupation: '',
    gender: '',
    minPrice: '',
    maxPrice: '',
    year: '',
    month: '',
    day: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Please enter name')
      .min(3, ({min}) => `Name must be at least ${min} characters`),
    occupation: Yup.string()
      .required('Please enter occupation')
      .min(3, ({min}) => `Occupation must be at least ${min} characters`),
    gender: Yup.string().required('Please select gender'),
    minPrice: Yup.string()
      .min(1, ({min}) => `Price should be at least ${min} digits`)
      .max(7, ({max}) => `Price should be at most ${max} digits`)
      .matches(new RegExp(/^[0-9\b\+\(\)]+$/), 'Price contain digits only'),
    maxPrice: Yup.string()
      .min(1, ({min}) => `Price should be at least ${min} digits`)
      .max(7, ({max}) => `Price should be at most ${max} digits`)
      .matches(new RegExp(/^[0-9\b\+\(\)]+$/), 'Price contain digits only'),
    year: Yup.string()
      .min(4, ({min}) => `Year must be ${min} digits`)
      .max(4, ({max}) => `Year must be ${max} digits`)
      .matches(new RegExp(/^[0-9\b\+\(\)]+$/), 'Year contain digits only'),
    month: Yup.string()
      .min(1, ({min}) => `Month should be at least ${min} digits`)
      .max(2, ({max}) => `Month should be at most ${max} digits`)
      .matches(new RegExp(/^[0-9\b\+\(\)]+$/), 'Year contain digits only'),
    day: Yup.string()
      .min(1, ({min}) => `Day should be at least ${min} digits`)
      .max(2, ({max}) => `Day should be at most ${max} digits`)
      .matches(new RegExp(/^[0-9\b\+\(\)]+$/), 'Day contain digits only'),
  });
  const onSubmit = async (values: any) => {
    console.log('>>>>>  Submit Clicked  <<<<<');
  };
  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const onChange = (min: number, max: number) => {
    console.log('min: ', min);
    console.log('max: ', max);
  };
  let fruits = [
    {
      id: 1,
      name: 'Choose from below',
    },
    {
      id: 2,
      name: 'Choose Type 1',
    },
    {
      id: 3,
      name: 'Choose Type 2',
    },
    {
      id: 4,
      name: 'Choose Type 3',
    },
  ];
  let dob = [
    {
      id: 1,
      name: 'Date',
    },
    {
      id: 2,
      name: '1',
    },
  ];
  let month = [
    {
      id: 1,
      name: 'Month',
    },
    {
      id: 2,
      name: 'January',
    },
  ];
  let year = [
    {
      id: 1,
      name: 'Year',
    },
    {
      id: 2,
      name: '2022',
    },
  ];
  const setValue = (value: any[]) => {
    var newArray = value.filter(
      (item: {selected: boolean}) => item.selected === true,
    ); //get the items that are selected
    setRadioButtons(newArray[0].value); //set the selected value in this Hook
  };
  const radioButtonsData = [
    {
      id: '1', // acts as primary key, should be unique and non-empty string
      label: 'Female',
      value: 'Female',
    },
    {
      id: '2',
      label: 'Male',
      value: 'Male',
    },
    {
      id: '3',
      label: 'Others',
      value: 'Others',
    },
  ];
  const [radioButtons, setRadioButtons] = useState('apple'); //pass in our data to this state. This will store the current user's choice

  const [chosenOption, setChosenOption] = useState('apple'); //will store our current user options
  const options = [
    {label: 'Winter', value: 'Winter'},
    {label: 'Summer', value: 'Summer'},
    {label: 'Spring', value: 'Spring'},
  ];
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedDOB, setSelectedDOB] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);

  const onSelect = (item: React.SetStateAction<null>) => {
    setSelectedItem(item);
  };
  const onSelectDOB = (item1: React.SetStateAction<null>) => {
    setSelectedDOB(item1);
  };
  const onSelectMonth = (item2: React.SetStateAction<null>) => {
    setSelectedMonth(item2);
  };
  const onSelectYear = (item3: React.SetStateAction<null>) => {
    setSelectedYear(item3);
  };
  const [summer, setSummer] = useState(false);
  const [winter, setWinter] = useState(false);
  const [spring, setSpring] = useState(false);
  // const renderThumb = useCallback(() => <Thumb />, []);
  // const renderRail = useCallback(() => <Rail />, []);
  // const renderRailSelected = useCallback(() => <RailSelected />, []);
  // const renderLabel = useCallback((value: any) => <Label text={value} />, []);
  // const renderNotch = useCallback(() => <Notch />, []);
  // const handleValueChange = useCallback((low: any, high: any) => {
  //   setLow(low);
  //   setHigh(high);
  // }, []);
  return (
    <View style={{flex: 1}}>
      <SafeAreaView>
        <Header
          title="Sign Up"
          backArrow={imagePath.BACK}
          onPress={() => {
            // navigation.navigate(navigationStrings.SIGN_UP_TWO);
            props.navigation.navigate(navigationStrings.SIGN_UP_TWO);
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
          <View style={styles.innerViewStyle}>
            <View style={styles.inputView}>
              <InputField
                label="Enter Your Name"
                placeHolder="Eg. Amit Tav"
                // placeholderTextColor={'#B4B4B4'}
                onChangeText={() => {}}
                onPressRight={() => {}}
                inputStyle={{}}
                rightIcon={() => {}}
              />
              <View style={styles.lineView}></View>
              <InputField
                label="Your occupation "
                placeHolder="Eg. Develope"
                // placeholderTextColor={'#B4B4B4'}
                onChangeText={() => {}}
                onPressRight={() => {}}
                inputStyle={{}}
                rightIcon={() => {}}
              />
              <View style={styles.lineView}></View>
              <View
                style={{
                  marginTop: responsiveHeight(2),
                }}>
                <Text>What is your gender</Text>
              </View>
              <RadioGroup
                containerStyle={styles.viewRadioGroup}
                radioButtons={radioButtonsData} //pass in our array
                onPress={value => setValue(value)}
              />
              <View style={styles.lineView}></View>
              <View style={styles.viewPriceRange}>
                <Text>Choose your price range</Text>
              </View>
              <View style={styles.viewRangeSlider}>
                {/* <RangeSlider
                  type="range" // ios only
                  minStartValue={100}
                  min={100}
                  max={12000}
                  maxStartValue={12000}
                  minLabelColor={colors.black}
                  maxLabelColor={colors.black}
                  selectedMinimum={20} // ios only
                  selectedMaximum={60} // ios only
                  tintColor="#ecf0f1"
                  handleColor="#5497D8"
                  handlePressedColor="#5497D8"
                  tintColorBetweenHandles="#5497D8"
                  onChange={onChange}
                /> */}
                <View style={styles.viewInput}>
                  <View style={{flex: 1}}>
                    <InputField
                      label="Minimum Price "
                      placeHolder="100"
                      // placeholderTextColor={'#B4B4B4'}
                      onChangeText={() => {}}
                      onPressRight={() => {}}
                      inputStyle={{}}
                      rightIcon={() => {}}
                    />
                  </View>
                  <View style={{marginStart: responsiveWidth(2)}}></View>
                  <View style={{flex: 1}}>
                    <InputField
                      label="Minimum Price "
                      placeHolder="Email"
                      // placeholderTextColor={'#B4B4B4'}
                      onChangeText={() => {}}
                      onPressRight={() => {}}
                      inputStyle={{}}
                      rightIcon={() => {}}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.lineView}></View>
              <View style={styles.dropDownContainer}>
                <View style={styles.viewDropdownOne}>
                  <DropDown
                    label="Date of Birthday"
                    value={selectedDOB}
                    data={dob}
                    onSelect={onSelectDOB}
                  />
                </View>
                <View style={styles.viewDropdownTwo}>
                  <DropDown
                    value={selectedMonth}
                    data={month}
                    onSelect={onSelectMonth}
                  />
                </View>
                <View style={styles.viewDropdownThree}>
                  <DropDown
                    value={selectedYear}
                    data={year}
                    onSelect={onSelectYear}
                  />
                </View>
              </View>
              <View style={styles.lineView}></View>
              <View style={styles.viewQuestions}>
                <Text style={styles.questionsTitle}>Question</Text>
                <Text style={[styles.questionsSubTitle]}>
                  Now is the winter of our discontent. Made glorious summer by
                  this sun of York; And all the clouds that lour'd upon our
                  house?
                </Text>
              </View>
              <View style={styles.checkBoxView}>
                <View style={{flex: 1}}>
                  <CheckBox
                    onPress={() => setSummer(!summer)}
                    title="Summer"
                    isChecked={summer}
                  />
                </View>
                <View style={{flex: 1}}>
                  <CheckBox
                    onPress={() => setWinter(!winter)}
                    title="Winter"
                    isChecked={winter}
                  />
                </View>
                <View style={{flex: 1}}>
                  <CheckBox
                    onPress={() => setSpring(!spring)}
                    title="Spring"
                    isChecked={spring}
                  />
                </View>
              </View>
            </View>
            <Button
              title="Next"
              onPress={() => {
                // navigation.navigate(navigationStrings.HOME);
                props.navigation.navigate(navigationStrings.HOME);
              }}
            />
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </View>
  );
};
export default SignUpThree;
