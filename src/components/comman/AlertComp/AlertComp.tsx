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
import {useRoute} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import styles from './styles';
import {useTranslation} from 'react-i18next';

export interface AlertModalProps {
  successAlert: boolean;
  // alertAnimation: string;
  title: string;
  timeoutSec: number;
  // points: number;
  messageText: string;
  handleClick: any;
  // disabled: Boolean;
}
const AlertComp = (props: AlertModalProps) => {
  const {t} = useTranslation();

  const route = useRoute();
  const [modalVisible, setModalVisible] = useState(true);
  const pts = 10;
  // const renderAnimation = ()=>{
  //   return(

  //   )
  // }
  return (
    <View style={styles.centeredView}>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
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
                    speed={0.6}
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
                console.log('button clicke');

                props.handleClick();
              }}>
              <Text style={styles.textStyle}>{`${t('okay')}`}</Text>
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
export default AlertComp;
