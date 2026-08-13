import React, {useState} from 'react';
import {Image, Modal, Text, TouchableOpacity, View} from 'react-native';
import imagePath from '../../../constants/imagePath';
import styles from '../../comman/Picker/styles';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import {ModalAlertPopup} from '../ModalAlertPopup';

const Picker = (props: any) => {
  // const Picker = ({label, camera, camera_title}) => {

  const [img, setImg] = useState<string>('');
  const [isBtnClicked, setBtnClicked] = useState(false);

  function byCamera() {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: false,
    })
      .then(image => {
        console.log('Selected Image by Crop >>>>>     ', image);
        setImg(image.path);
        props.onSelecet(image.path);
      })
      .catch((errors: any) => {
        console.log('Selected Image by Crop Catch >>>>>     ', errors);
      });
  }
  function byGallery() {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: false,
    })
      .then(image => {
        console.log('Selected Image by Crop >>>>>     ', image);
        setImg(image.path);
        props.onSelecet(image.path);
      })
      .catch((errors: any) => {
        console.log('Selected Image by Crop Catch >>>>>     ', errors);
      });
  }

  function h() {
    launchCamera(
      {
        mediaType: 'photo',
        saveToPhotos: false,
        quality: 0.4,
        maxHeight: 200,
        maxWidth: 200,
      },
      res => {  
        console.log('Image >>>>>>>>>  ', res);
        if (res.didCancel) {
        } else if (res.errorCode) {
        } else if (res.errorMessage) {
        } else if (res.assets!.length > 0) {
          console.log('Image URI >>>>  ', res.assets![0].uri);
          setImg(`${res.assets![0].uri}`);
        }

        // setShopImg('');
      },
    );
  }
  return (
    <View>
      <Text style={styles.titleStyle}>{props.label}</Text>
      <View style={styles.pickerContainer}>
        <TouchableOpacity
          style={{justifyContent: 'center', alignItems: 'center'}}
          onPress={() => {
            // h();
            // camera();
            setBtnClicked(true);
          }}
        >
          {img == '' ? (
            <>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Image
                  style={styles.imageCamera}
                  source={props.camera}
                  resizeMode={'center'}
                />
                <Image
                  style={styles.add}
                  source={imagePath.ADD}
                  resizeMode={'contain'}
                />
              </View>
              <Text style={styles.titleStyle2}>{props.label}</Text>
              <Text>{props.camera_title}</Text>
            </>
          ) : (
            <Image
              // style={styles.add}
              style={styles.selectedImage}
              source={{uri: img}}
              // resizeMode={'repeat'}
            />
          )}
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        visible={isBtnClicked}
        onRequestClose={() => {}}
        transparent={true}
      >
        <ModalAlertPopup
          modalText={'Take Image From'}
          action={() => {
            setBtnClicked(false);
          }}
          actionCameraClick={() => {
            byCamera();
          }}
          actionGalleryClick={() => {
            byGallery();
          }}
        />
      </Modal>
    </View>
  );
};
export default Picker;
