import {
  View,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
import {Text} from '@rneui/base';
import {useNavigation, useRoute} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import styles from './styles';
import {NavigationInterFace} from '../../../interfaces/navigationType.interface';
import navigationStrings from '../../../constants/navigationStrings';
import Home from '../../bottomtabs/home/Home';
import {useTranslation} from 'react-i18next';
export interface AlertModalProps {
  successAlert: boolean;
  // alertAnimation: string;
  title: string;
  // timeoutSec: number;
  // points: number;
  messageText: string;
  // disabled: Boolean;
}
const AlertStatic = (props: AlertModalProps) => {
  const {t} = useTranslation();

  const route = useRoute();
  const [modalVisible, setModalVisible] = useState(true);
  const navigation = useNavigation<NavigationInterFace>();
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // setModalVisible(!modalVisible);
          // navigation.navigate("Dashboard");
          // Alert.alert('Go Back', 'Go Back', [
          //   {
          //     text: 'Back',
          //     onPress: () => navigation.navigate(navigationStrings.HOME),
          //   },
          // ]);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {(() => {
              if (props.successAlert) {
                return (
                  <LottieView
                    style={{
                      height: 200,
                      width: 200,
                    }}
                    source={require('../../../../assets/images/success.json')}
                    autoPlay
                    loop
                  />
                );
              }
              return (
                <LottieView
                  style={{
                    height: 200,
                    width: 200,
                  }}
                  source={require('../../../../assets/images/alert.json')}
                  autoPlay
                  loop
                />
              );
            })()}
            <Text style={styles.modalText}>{props.title}</Text>
            {/* <Text style={styles.modalText}>Congratualations</Text> */}
            <Text style={styles.modalText}>
              {/* You have been rewarded with 100 points. */}
              {props.messageText}
            </Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                console.log('Go Back Pressed');

                navigation.push(navigationStrings.HOME);

                // navigation.navigate(navigationStrings.HOME);
                // navigation.navigate(navigationStrings.HOME);
                setModalVisible(!modalVisible);
              }}>
              {/* {console.log(route.name)} */}
              <Text style={styles.textStyle}>{`${t('goback')}`}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {/* <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={() => setModalVisible(true)}> */}
      {/* <Text>
        {setTimeout(() => {
          setModalVisible(false);
        }, props.timeoutSec)}
      </Text> */}
      {/* </Pressable> */}
    </View>
  );
};
export default AlertStatic;
