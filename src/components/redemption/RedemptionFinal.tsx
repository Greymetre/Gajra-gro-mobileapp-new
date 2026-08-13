import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  Text,
  Pressable,
  BackHandler,
  Platform,
  PermissionsAndroid,
  ScrollView,
  StyleSheet,
  Linking,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import colors from '../../styles/colors';
import LottieView from 'lottie-react-native';
import navigationStrings from '../../constants/navigationStrings';
import {
  Button,
  Card,
  Dialog,
  Header as HeaderRNE,
  Image as ImageRNE,
  ListItem,
} from '@rneui/themed';
import ImageCropPicker from 'react-native-image-crop-picker';
import imagePath from '../../constants/imagePath';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import styles from './styles';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { NavigationInterFace } from '../../interfaces/navigationType.interface';
import {
  requestCustomerBalancePoint,
  requestGetKycInfo,
  requestUpdateCustomerKycInfo,
} from '../../services/backend_helper';
import { getSettingAsyncStorage } from '../../services/auth_helper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import RNFS from 'react-native-fs';
import { useFormik } from 'formik';
import appTheme from '../../utils/appTheme';
import * as Yup from 'yup';
import FormData from 'form-data';
import { CloseIcon } from '../Svg/Svg';

const includeExtra = true;
const RedemptionFinal = (props: any) => {
  const [conditonalAPI, setConditionalAPI] = useState({});
  const [disableNEFT, setDisableNEFT] = useState(true);
  const [disableUPI, setDisableUPI] = useState(true);

  const [balancePoint, setBalancePoint] = useState(0);
  const [redemptionPoint, setRedemptionPoint] = useState(0);
  const [thresholdPoint, setThresholdPoint] = useState(0);
  const [isLoadingPoints, setIsLoadingPoints] = useState(true);
  const [modalVisible, setModalVisible] = useState(true);
  const [compulsaryModal, setcompulsaryModal] = useState(false);
  const [upiModal, setUpiModal] = useState(false);
  const [msgTxt, setMsgTxt] = useState('');
  const [showSubmitMsg, setShowSubmitMsg] = useState(false);
  const [dbKyc, setDbKyc] = useState({});
  const { t } = useTranslation();

  const [isAvalableUPI, setIsAvalableUPI] = useState<any>(false);
  const [isAvalableUPI1, setIsAvalableUPI1] = useState<any>();
  const [isAvalablePassbook, setIsAvalablePassbook] = useState<any>(false);
  const [isAvalablePassbook1, setIsAvalablePassbook1] = useState<any>();
  const [passbookModal, setPassbookModal] = useState(false);



  // const OsVer = Platform.constants['Release'];
  // console.log(OsVer);
  const fetchGetAuthKycInfo = async () => {
    await requestGetKycInfo({})
      .then(res => {
        console.log(res);
        if (res.isError === false) {
          console.log('Response KYC Details - ', res.data);
          setDbKyc(res.data);
          // if (
          //   res.data.aadharVerified === true &&
          //   res.data.bankVerified === true
          // ) {
          //   setDisableNEFT(false);
          // } else {
          //   setcompulsaryModal(true)
          // }
          // if (
          //   res.data.aadharVerified === true &&
          //   res.data.upiVerified === true) {
          //   setDisableUPI(false);
          // } else {
          //   setcompulsaryModal(true)
          // }

          if (
            res.data.aadharVerified === true &&
            res.data.isPassBookAvailable != false) {
            setDisableNEFT(false);
          } else {
            setcompulsaryModal(true)
          }
          if (
            res.data.aadharVerified === true &&
            res.data.isUpiAvailable != false) {
            setDisableUPI(false);
          } else {
            setcompulsaryModal(true)
          }

          if (res.data.isPassBookAvailable == false) {
            setIsAvalablePassbook1(false)
          } else {
            setIsAvalablePassbook1(true)
          }
          if (res.data.isUpiAvailable == false) {
            setIsAvalableUPI1(false)
          } else {
            setIsAvalableUPI1(true)
          }

          if (res.data.aadharFrontImage !== '') {
            setConditionalAPI(conditonalAPI => ({
              ...conditonalAPI,
              aadharFrontImage: true,
            }));
          }
          if (res.data.aadharBackImage !== '') {
            setConditionalAPI(conditonalAPI => ({
              ...conditonalAPI,
              aadharBackImage: true,
            }));
          }
          if (res.data.panImage !== '') {
            setConditionalAPI(conditonalAPI => ({
              ...conditonalAPI,
              panImage: true,
            }));
          }
          if (res.data.passbookImage !== '') {
            setConditionalAPI(conditonalAPI => ({
              ...conditonalAPI,
              passbookImage: true,
            }));
          }
        }
      })
      .catch(error => {
        console.log('Response: ', error.responses);
      });
  };
  const onclose = () => {
    setModalVisible(false)
    setcompulsaryModal(false)
    navigation.goBack()
  }

  const handleBackPress = useCallback(() => {
    if (compulsaryModal) {
      onclose();

      return true; // Return true to indicate that the back press has been handled
    }
    return false; // Return false to allow the default back press behavior (e.g., exit the app)
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => backHandler.remove();
  }, [handleBackPress]);

  const fetchCustomerBalancePoint = async () => {
    await requestCustomerBalancePoint({})
      .then(res => {
        if (res.isError == false) {
          setBalancePoint(res?.data?.balance);
          // setBalancePoint(500);
          setRedemptionPoint(res?.data?.redeempoint);
          setIsLoadingPoints(false);
        }
      })
      .catch(error => {
        console.log('Response: ', error);
      });
  };
  const getThresholdPoints = async () => {
    await getSettingAsyncStorage()
      .then(res => {
        const sett = JSON.parse(res);
        setThresholdPoint(sett?.redemption?.threshold);
      })
      .catch(error => {
        console.log('Response: ', error);
      });
  };
  useFocusEffect(
    React.useCallback(() => {
      fetchCustomerBalancePoint();
      fetchGetAuthKycInfo();
      getThresholdPoints();
    }, []),
  )
  useEffect(() => {

  }, []);
  const navigation = useNavigation<NavigationInterFace>();
  const { height, width } = Dimensions.get('window');

  const handleCallSupport = () => {
    Linking.openURL("tel:8103324701");
  };



  return (
    <View
      style={{ flex: 1, backgroundColor: colors.white, height: height }}>
      <HeaderRNE
        backgroundColor="white"
        backgroundImageStyle={{}}
        barStyle="dark-content"
        centerComponent={{
          text: `${t('redemption')}`,
          style: { color: 'black', fontSize: 22 },
        }}
        centerContainerStyle={{ height: 28, justifyContent: 'center' }}
        leftComponent={
          <TouchableOpacity onPress={() => props.navigation.goBack()}>
            <Ionicons name="chevron-back" size={25} color={'black'} />
          </TouchableOpacity>
        }
        leftContainerStyle={{ paddingLeft: 5 }}
        placement="center"
        containerStyle={{
          bottom: Platform.OS === "android"
            ? Platform.OS === "android" && Platform.Version <= 34
              ?0
              : height * 0.04
            : 0
        }}
      />
      <ScrollView>
        <View>
          <Card containerStyle={styles.big_card_view}>
            <Image style={styles.image_view} source={imagePath.REEDEM_DEC} />
          </Card>
        </View>
        <View
          style={{
            paddingTop: 20,
            paddingHorizontal: 17,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {/* <Button
            onPress={() => navigation.navigate('UPIScreen', { mode: 'UPI' })}
            containerStyle={{
              justifyContent: 'center',
              // elevation: 1,
            }}
            buttonStyle={{
              // backgroundColor: '#FFE7C7',
              backgroundColor: '#FEF8DD',
              borderRadius: 20,
              width: width / 2 - 30,
              height: 90,
              overflow: 'hidden',
            }}
            titleStyle={{
              marginLeft: 35,
              padding: 20,
              fontSize: responsiveFontSize(2.2),
              margin: 10,
              color: 'black',
            }}
            title={`${t('upi')}`}
            iconPosition={'right'}
            disabled={true}
            icon={
              <View style={{ overflow: 'hidden', borderRadius: 20 }}>
                <View
                  style={{
                    paddingLeft: 80,
                    height: 120,
                    width: 120,
                    borderRadius: 130 / 2,
                    backgroundColor: '#FFE7C7',
                    // backgroundColor: '#aaaaaa',
                    overflow: 'hidden',
                  }}
                />
                <View
                  style={{
                    paddingTop: 120,
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignSelf: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                  }}>
                  <Icon
                    name="send-o"
                    size={30}
                    color="#585858"
                    style={{
                      position: 'absolute',
                      paddingRight: 30,
                    }}
                  />
                </View>
              </View>
            }
          /> */}
          <Button
            onPress={() => { !disableUPI ? navigation.navigate('UPIScreen', { mode: 'UPI' }) : isAvalableUPI1 == false ? setUpiModal(true) : setIsAvalableUPI(true) }}
            // onPress={() => { navigation.navigate('UPIScreen', { mode: 'UPI' }) }}
            containerStyle={{
              justifyContent: 'center',
            }}
            // disabled={disableNEFT}
            buttonStyle={{
              backgroundColor: '#FEF8DD',
              borderRadius: 20,
              width: width / 2 - 30,
              height: 90,
              overflow: 'hidden',
            }}
            titleStyle={{
              marginLeft: 35,
              padding: 20,
              fontSize: responsiveFontSize(2.2),
              margin: 10,
              color: 'black',
            }}
            // title={`${t('upi')}`}
            title={`${t('UPI')}`}
            iconPosition={'right'}
            icon={
              <View style={{ overflow: 'hidden', borderRadius: 20 }}>
                <View
                  style={{
                    paddingLeft: 80,
                    height: 120,
                    width: 120,
                    borderRadius: 130 / 2,
                    backgroundColor: '#FFE7C7',
                    // backgroundColor: '#aaaaaa',
                    overflow: 'hidden',
                  }}
                />
                <View
                  style={{
                    paddingTop: 120,
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignSelf: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                  }}>
                  <Icon
                    name="send-o"
                    size={30}
                    color="#585858"
                    style={{
                      position: 'absolute',
                      paddingRight: 30,
                    }}
                  />
                </View>
              </View>
            }
          />
          <Button
            onPress={() => { !disableNEFT ? navigation.navigate('Neft') : isAvalablePassbook1 == false ? setPassbookModal(true) : setIsAvalableUPI(true) }}
            containerStyle={{
              justifyContent: 'center',
            }}
            // disabled={disableNEFT}
            buttonStyle={{
              backgroundColor: '#FEF8DD',
              borderRadius: 20,
              width: width / 2 - 30,
              height: 90,
              overflow: 'hidden',
            }}
            titleStyle={{
              marginLeft: 35,
              padding: 20,
              fontSize: responsiveFontSize(2.2),
              margin: 10,
              color: 'black',
            }}
            // title={`${t('neft')}`}
            title={`${t('IMPS')}`}
            iconPosition={'right'}
            icon={
              <View style={{ overflow: 'hidden' }}>
                <View
                  style={{
                    paddingLeft: 80,
                    height: 120,
                    width: 120,
                    borderRadius: 130 / 2,
                    backgroundColor: '#FFE7C7',
                    overflow: 'hidden',
                  }}
                />
                <View
                  style={{
                    paddingTop: 120,
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignSelf: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                  }}>
                  <Icon
                    name="bank"
                    size={30}
                    color="#585858"
                    style={{
                      position: 'absolute',
                      paddingRight: 30,
                    }}
                  />
                </View>
              </View>
            }
          />
        </View>
        <View
          style={{
            paddingLeft: 20,
            paddingRight: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }}>
          <View style={{ width: '50%', }}>
            {disableUPI ?
              <Text style={{ color: 'red' }}>{t('verify UPI ID')}</Text>
              : null}
          </View>

          {disableNEFT ? (
            <View style={{ width: 160 }}>
              <Text style={{ color: 'red' }}>{t('verifyKYC')}</Text>
            </View>
          ) : null}
        </View>
        {/* // Uncomment before the production */}
        {redemptionPoint === 0 &&
          Number(balancePoint) < Number(thresholdPoint) &&
          !isLoadingPoints ? (
          // <AlertStatic
          //   successAlert={false}
          //   title={`${t('lowpoints')}`}
          //   messageText={`${t('err1')} ${thresholdPoint - balancePoint} ${t(
          //     'err2',
          //   )}`}
          // />
          <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={onclose}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <LottieView
                    style={{
                      height: 200,
                      width: 200,
                    }}
                    source={require('../../../assets/images/alert.json')}
                    autoPlay
                    loop
                  />
                  <Text style={styles.modalText}>{`${t('lowpoints')}`}</Text>
                  <Text style={styles.modalText}>{`${t('err1')} ${thresholdPoint - balancePoint
                    } ${t('err2')}`}</Text>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => {
                      console.log('Go Back Pressed');
                      setModalVisible(false);
                      setcompulsaryModal(false)
                      navigation.navigate(navigationStrings.HOME);
                    }}>
                    <Text style={styles.textStyle}>{`${t('goback')}`}</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          </View>
        ) : (
          <>
            {(isAvalablePassbook1 && isAvalableUPI1) && (
              <Modal
                animationType="slide"
                transparent={true}
                visible={compulsaryModal}
                onRequestClose={onclose}>
                <View style={styles.centeredView}>
                  <View style={{ position: 'absolute', top: 0 }}>
                    <HeaderRNE
                      backgroundColor="white"
                      backgroundImageStyle={{}}
                      barStyle="dark-content"
                      centerComponent={{
                        text: `${t('redemption')}`,
                        style: { color: 'black', fontSize: 22 },
                      }}
                      centerContainerStyle={{ height: 28, justifyContent: 'center' }}
                      leftComponent={
                        <TouchableOpacity onPress={() => props.navigation.goBack()}>
                          <Ionicons name="chevron-back" size={25} color={'black'} />
                        </TouchableOpacity>
                      }
                      leftContainerStyle={{ paddingLeft: 5 }}
                      placement="center"
                    />
                  </View>
                  <View style={styles.modalView}>
                    <LottieView
                      style={{ height: 200, width: 200 }}
                      source={require('../../../assets/images/alert.json')}
                      autoPlay
                      loop
                    />
                    <Text style={styles.modalText}>Upload Required Details</Text>
                    {(disableNEFT && disableUPI) ? (
                      <Text style={styles.modalText}>
                        Please upload your KYC and UPI Information on the Profile Page.
                      </Text>
                    ) : (
                      <>
                        {disableNEFT && (
                          <Text style={styles.modalText}>
                            Please upload your KYC Information on the Profile Page.
                          </Text>
                        )}
                        {disableUPI && (
                          <Text style={styles.modalText}>
                            Please upload your UPI ID Information on the Profile Page.
                          </Text>
                        )}
                      </>
                    )}
                    <Button
                      title={'Profile'}
                      onPress={() => {
                        navigation.navigate(navigationStrings.PROFILE, { data: true });
                        setcompulsaryModal(false);
                      }}
                      buttonStyle={{
                        backgroundColor: appTheme.NEW_PALLET,
                        borderRadius: 12,
                        width: 80,
                      }}
                    />
                  </View>
                </View>
              </Modal>
            )}


            <Modal
              animationType="slide"
              transparent={true}
              visible={upiModal}
              onRequestClose={onclose}>
              <View style={styles.centeredView}>
                <View style={{ position: 'absolute', top: 0 }}>
                  <HeaderRNE
                    backgroundColor="white"
                    backgroundImageStyle={{}}
                    barStyle="dark-content"
                    centerComponent={{
                      text: `${t('redemption')}`,
                      style: { color: 'black', fontSize: 22 },
                    }}
                    centerContainerStyle={{ height: 28, justifyContent: 'center' }}
                    leftComponent={
                      <TouchableOpacity onPress={() => props.navigation.goBack()}>
                        <Ionicons name="chevron-back" size={25} color={'black'} />
                      </TouchableOpacity>
                    }
                    leftContainerStyle={{ paddingLeft: 5 }}
                    placement="center"
                  />
                </View>
                <View style={styles.modalView}>
                <TouchableOpacity onPress={() => { setUpiModal(false) }}
                    style={{
                      backgroundColor: appTheme.NEW_PALLET,
                      borderRadius: 20,
                      padding: 2,
                      position: 'absolute', right: 0, top: 0
                    }}>
                    <CloseIcon />
                  </TouchableOpacity>
                  <LottieView
                    style={{ height: 200, width: 200 }}
                    source={require('../../../assets/images/alert.json')}
                    autoPlay
                    loop
                  />
                  <Text style={styles.modalText}>Upload Required Details</Text>

                  <Text style={styles.modalText}>
                    Please upload your UPI ID Information on the Profile Page.
                  </Text>

                  <Button
                    title={'Profile'}
                    onPress={() => {
                      navigation.navigate(navigationStrings.PROFILE, { data: true });
                      setcompulsaryModal(false);
                      setUpiModal(false)
                    }}
                    buttonStyle={{
                      backgroundColor: appTheme.NEW_PALLET,
                      borderRadius: 12,
                      width: 80,
                    }}
                  />
                </View>
              </View>
            </Modal>

            <Modal
              animationType="slide"
              transparent={true}
              visible={passbookModal}
              onRequestClose={onclose}>
              <View style={styles.centeredView}>
                <View style={{ position: 'absolute', top: 0 }}>
                  <HeaderRNE
                    backgroundColor="white"
                    backgroundImageStyle={{}}
                    barStyle="dark-content"
                    centerComponent={{
                      text: `${t('redemption')}`,
                      style: { color: 'black', fontSize: 22 },
                    }}
                    centerContainerStyle={{ height: 28, justifyContent: 'center' }}
                    leftComponent={
                      <TouchableOpacity onPress={() => props.navigation.goBack()}>
                        <Ionicons name="chevron-back" size={25} color={'black'} />
                      </TouchableOpacity>
                    }
                    leftContainerStyle={{ paddingLeft: 5 }}
                    placement="center"
                  />
                </View>
                <View style={styles.modalView}>
                  <TouchableOpacity onPress={() => { setPassbookModal(false) }}
                    style={{
                      backgroundColor: appTheme.NEW_PALLET,
                      borderRadius: 20,
                      padding: 2,
                      position: 'absolute', right: 0, top: 0
                    }}>
                    <CloseIcon />
                  </TouchableOpacity>
                  <LottieView
                    style={{ height: 200, width: 200 }}
                    source={require('../../../assets/images/alert.json')}
                    autoPlay
                    loop
                  />
                  <Text style={styles.modalText}>Upload Required Details</Text>

                  <Text style={styles.modalText}>
                    Please upload your KYC Information on the Profile Page.
                  </Text>

                  <Button
                    title={'Profile'}
                    onPress={() => {
                      navigation.navigate(navigationStrings.PROFILE, { data: true });
                      setcompulsaryModal(false);
                      setPassbookModal(false)
                    }}
                    buttonStyle={{
                      backgroundColor: appTheme.NEW_PALLET,
                      borderRadius: 12,
                      width: 80,
                    }}
                  />
                </View>
              </View>
            </Modal>

            <Modal
              animationType="slide"
              transparent={true}
              visible={isAvalableUPI}
              onRequestClose={() => setIsAvalableUPI(false)}>
              <View style={styles.centeredView}>
                <View style={{ position: 'absolute', top: 0 }}>
                  <HeaderRNE
                    backgroundColor="white"
                    backgroundImageStyle={{}}
                    barStyle="dark-content"
                    centerComponent={{
                      text: `${t('redemption')}`,
                      style: { color: 'black', fontSize: 22 },
                    }}
                    centerContainerStyle={{ height: 28, justifyContent: 'center' }}
                    leftComponent={
                      <TouchableOpacity onPress={() => props.navigation.goBack()}>
                        <Ionicons name="chevron-back" size={25} color={'black'} />
                      </TouchableOpacity>
                    }
                    leftContainerStyle={{ paddingLeft: 5 }}
                    placement="center"
                  />
                </View>
                <View style={styles.modalView}>
                  <TouchableOpacity onPress={() => { setIsAvalableUPI(false) }}
                    style={{
                      backgroundColor: appTheme.NEW_PALLET,
                      borderRadius: 20,
                      padding: 2,
                      position: 'absolute', right: 0, top: 0
                    }}>
                    <CloseIcon />
                  </TouchableOpacity>
                  <View style={styles.modalView12}>
                    <Text style={styles.modalTitle12}>Verification Pending</Text>
                    <Text style={styles.modalText}>
                      Your account verification is still in process. If you need assistance,
                      please contact our support team at:
                    </Text>
                    <Text style={styles.helplineNumber12}>📞 81033 24701</Text>
                    <TouchableOpacity style={styles.contactButton12} onPress={handleCallSupport}>
                      <Text style={styles.buttonText12}>Call Support</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </>
        )}


      </ScrollView> 
    </View>
  );
};

export default RedemptionFinal;
