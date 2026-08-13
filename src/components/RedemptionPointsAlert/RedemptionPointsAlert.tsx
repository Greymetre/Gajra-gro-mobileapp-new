import {View, Modal, Alert} from 'react-native';
import React, {useState} from 'react';
import {Text} from '@rneui/base';
import {useRoute} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import styles from './styles';

const WelcomePoints = (props: any) => {
  const [modalVisible, setModalVisible] = useState(true);
  const pts = 450;
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <LottieView
              style={{
                height: 200,
                width: 200,
              }}
              source={require('../../../assets/images/success.json')}
              autoPlay
              loop
            />
            <Text style={styles.modalText}>You must have </Text>
            <Text style={styles.modalText}>
              You have been rewarded with 100 points.
            </Text>

            {/* <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => setModalVisible(!modalVisible)}>
                      <Text style={styles.textStyle}>Hide Modal</Text>
                    </Pressable> */}
          </View>
        </View>
      </Modal>
      {/* <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={() => setModalVisible(true)}> */}
      <Text>
        {setTimeout(() => {
          setModalVisible(false);
        }, 3000)}
      </Text>
      {/* </Pressable> */}
    </View>
  );
};
export default WelcomePoints;
