import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal, TouchableOpacity } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

const ModalLoader = ({ isLoading }: any) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={isLoading}
      onRequestClose={() => { }}>
      <View style={styles.modalBackground}>
        {/* <TouchableOpacity onPress={() => navigation.goBack()}
        style={{position:'absolute',top:10,left:16}}>
                <Ionicons name="chevron-back" size={25} color={'black'} />
              </TouchableOpacity> */}
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator size="large" color={'#FFFFFF'} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIndicatorWrapper: {
    backgroundColor: 'transparent',
    height: 100,
    width: 200,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ModalLoader;