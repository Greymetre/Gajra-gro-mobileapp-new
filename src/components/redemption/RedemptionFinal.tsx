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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import ShineOverlay from '../comman/ShineOverlay';
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
  const safeInsets = useSafeAreaInsets();
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
  const [upiMaintenanceModal, setUpiMaintenanceModal] = useState(false);
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



  const openImps = () => {
    !disableNEFT
      ? navigation.navigate('Neft')
      : isAvalablePassbook1 == false
        ? setPassbookModal(true)
        : setIsAvalableUPI(true);
  };

  return (
    // White behind the status bar so it blends with the header; the page itself is grey.
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={rfStyles.header}>
        <Pressable
          onPress={() => props.navigation.goBack()}
          hitSlop={6}
          style={({ pressed }) => [rfStyles.headerButton, pressed && { opacity: 0.6 }]}>
          <Ionicons name="chevron-back" size={22} color={appTheme.DARK_BOTTOMTAB} />
        </Pressable>
        <Text style={rfStyles.headerTitle}>{`${t('redemption')}`}</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView
        style={{ backgroundColor: '#F7F7F7' }}
        // Keep the last button clear of the Android nav bar / iPhone home indicator.
        contentContainerStyle={{ paddingBottom: 40 + safeInsets.bottom }}
        showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <LinearGradient
          colors={['#FFF6DE', '#FDEBC0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={rfStyles.hero}>
          <ShineOverlay />
          <Image style={rfStyles.heroImage} source={imagePath.REEDEM_DEC} />
          <View style={rfStyles.balanceChip}>
            <Ionicons name="star" size={16} color={appTheme.NEW_PALLET} />
            <Text style={rfStyles.balanceLabel}>Available</Text>
            <Text style={rfStyles.balanceValue}>{balancePoint}</Text>
            <Text style={rfStyles.balanceUnit}>pts</Text>
          </View>
        </LinearGradient>

        <Text style={rfStyles.sectionTitle}>Choose payout method</Text>

        {/* UPI (under maintenance) */}
        <Pressable
          onPress={() => setUpiMaintenanceModal(true)}
          style={({ pressed }) => [rfStyles.option, rfStyles.optionMuted, pressed && { opacity: 0.85 }]}>
          <View style={[rfStyles.optionIcon, { backgroundColor: '#EFEFEF' }]}>
            <Icon name="send-o" size={22} color="#8A8A8A" />
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <View style={rfStyles.optionTitleRow}>
              <Text style={[rfStyles.optionTitle, { color: '#6B6B6B' }]}>{`${t('UPI')}`}</Text>
              <View style={[rfStyles.badge, { backgroundColor: '#FFF1D2' }]}>
                <Ionicons name="construct-outline" size={11} color="#B7791F" />
                <Text style={[rfStyles.badgeText, { color: '#B7791F' }]}>Under maintenance</Text>
              </View>
            </View>
            <Text style={rfStyles.optionSubtitle}>Instant transfer to your UPI ID</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#C9C9C9" />
        </Pressable>

        {/* IMPS */}
        <Pressable
          onPress={openImps}
          style={({ pressed }) => [rfStyles.option, pressed && { transform: [{ scale: 0.99 }], opacity: 0.9 }]}>
          <View style={[rfStyles.optionIcon, { backgroundColor: appTheme.NEW_PALLET }]}>
            <Icon name="bank" size={22} color={appTheme.DARK_BOTTOMTAB} />
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <View style={rfStyles.optionTitleRow}>
              <Text style={rfStyles.optionTitle}>{`${t('IMPS')}`}</Text>
              {disableNEFT ? (
                <View style={[rfStyles.badge, { backgroundColor: '#FDECEA' }]}>
                  <Ionicons name="alert-circle-outline" size={11} color="#D93025" />
                  <Text style={[rfStyles.badgeText, { color: '#D93025' }]}>KYC required</Text>
                </View>
              ) : (
                <View style={[rfStyles.badge, { backgroundColor: '#E4F6EC' }]}>
                  <Ionicons name="checkmark-circle" size={11} color="#1E9E5A" />
                  <Text style={[rfStyles.badgeText, { color: '#1E9E5A' }]}>Available</Text>
                </View>
              )}
            </View>
            <Text style={rfStyles.optionSubtitle}>Direct transfer to your bank account</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={appTheme.DARK_BOTTOMTAB} />
        </Pressable>

        {disableNEFT ? (
          <View style={rfStyles.note}>
            <Ionicons name="information-circle" size={18} color="#D93025" />
            <Text style={rfStyles.noteText}>{t('verifyKYC')}</Text>
          </View>
        ) : null}

        {thresholdPoint ? (
          <View style={[rfStyles.note, rfStyles.noteInfo]}>
            <Ionicons name="information-circle" size={18} color="#2F6FED" />
            <Text style={[rfStyles.noteText, { color: '#3A4A6B' }]}>
              Minimum {thresholdPoint} points are required for your first redemption.
            </Text>
          </View>
        ) : null}

        <Pressable onPress={handleCallSupport} style={rfStyles.support}>
          <Ionicons name="call-outline" size={16} color={appTheme.DARK_BOTTOMTAB} />
          <Text style={rfStyles.supportText}>Need help? Call support</Text>
        </Pressable>
        <Modal
          animationType="slide"
          transparent={true}
          visible={upiMaintenanceModal}
          onRequestClose={() => setUpiMaintenanceModal(false)}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity onPress={() => { setUpiMaintenanceModal(false) }}
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
              <Text style={styles.modalText}>UPI Under Maintenance</Text>
              <Text style={styles.modalText}>
                UPI redemption is temporarily unavailable. Please use IMPS or try again later.
              </Text>
              <Button
                title={'OK'}
                onPress={() => { setUpiMaintenanceModal(false) }}
                buttonStyle={{
                  backgroundColor: appTheme.NEW_PALLET,
                  borderRadius: 12,
                  width: 80,
                }}
              />
            </View>
          </View>
        </Modal>
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

const rfStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 12,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    zIndex: 2,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F4F4F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1C',
  },
  hero: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 22,
    paddingTop: 16,
    paddingBottom: 14,
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F5E2B0',
  },
  heroImage: {
    width: '85%',
    height: 170,
    resizeMode: 'contain',
  },
  balanceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: appTheme.DARK_BOTTOMTAB,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  balanceLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginLeft: 6,
  },
  balanceValue: {
    fontSize: 17,
    fontWeight: '800',
    color: 'white',
    marginLeft: 6,
  },
  balanceUnit: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1C',
    marginHorizontal: 16,
    marginTop: 22,
    marginBottom: 4,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F5E2B0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  optionMuted: {
    backgroundColor: '#FAFAFA',
    borderColor: '#EDEDED',
  },
  optionIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1C',
    marginRight: 8,
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#8A8A8A',
    marginTop: 4,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    marginLeft: 3,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: '#FDECEA',
    borderRadius: 12,
    padding: 12,
  },
  noteInfo: {
    backgroundColor: '#E8F0FF',
  },
  noteText: {
    flex: 1,
    fontSize: 12.5,
    color: '#D93025',
    marginLeft: 8,
  },
  support: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
    paddingVertical: 10,
  },
  supportText: {
    fontSize: 13,
    fontWeight: '600',
    color: appTheme.DARK_BOTTOMTAB,
    marginLeft: 6,
    textDecorationLine: 'underline',
  },
});

export default RedemptionFinal;
