import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const {height, width} = Dimensions.get('window');
export interface IProps {
  modalText: string;
  action: Function;
  btnTxt?: string;
  actionCameraClick: Function;
  actionGalleryClick: Function;
}
export const ModalAlertPopup = (props: IProps) => {
  return (
    <View
      style={{
        alignSelf: 'center',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000CC',
        width: width,
      }}
    >
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 10,
          width: width * 0.7,
          alignItems: 'center',
          paddingVertical: 20,
        }}
      >
        <Text allowFontScaling={false} style={styles.modal_title_text}>
          {props.modalText}
        </Text>

        <View
          style={{
            height: 2,
            backgroundColor: '#DDDDDD',
            width: width * 0.7,
            marginTop: 10,
          }}
        />

        <View
          style={{
            width: width * 0.7,
            alignItems: 'center',
            paddingTop: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              props.action(false);
              props.actionCameraClick();
            }}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 10,
              borderBottomWidth: 1,
              borderBottomColor: '#B4B4B4',
              width: width * 0.7,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 20,
              }}
            >
              <Image
                source={require('../../../assets/images/camera.png')}
                style={{width: 30, height: 30}}
                resizeMode="center"
              />
              <Text
                allowFontScaling={false}
                style={[styles.modal_button_text, {textAlign: 'center'}]}
              >
                {props.btnTxt ?? 'Camera'}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              props.action(false);
              props.actionGalleryClick();
            }}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 10,
              borderBottomWidth: 1,
              borderBottomColor: '#B4B4B4',
              width: width * 0.7,
            }}
          >
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                marginLeft: 20,
              }}
            >
              <Image
                source={require('../../../assets/images/gallery.png')}
                style={{width: 30, height: 30, tintColor: '#B4B4B4'}}
                resizeMode="center"
              />
              <Text
                allowFontScaling={false}
                style={[styles.modal_button_text, {textAlign: 'center'}]}
              >
                {props.btnTxt ?? 'Gallery'}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              props.action(false);
            }}
            style={{marginTop: 30, width: width * 0.3}}
          >
            <Text
              allowFontScaling={false}
              style={[
                styles.modal_button_text,
                {textAlign: 'center', color: '#000000AA'},
              ]}
            >
              {props.btnTxt ?? 'Cancel'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export const ModalLoaderPopup = () => {
  return (
    <View
      style={{
        width: width,
        alignSelf: 'center',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ActivityIndicator size={50} color="white" />
    </View>
  );
};

const styles = StyleSheet.create({
  modal_title_text: {
    color: '#16171EAA',
    fontWeight: 'bold',
    fontSize: 18,
  },
  modal_button_text: {
    color: '#000000',
    paddingLeft: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
