import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import {Alert, Linking, Platform} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';

const alertBlocked = (what: string) => {
  Alert.alert(
    `${what} permission blocked`,
    `${what} access is turned off for this app. Please enable it from Settings to upload an image.`,
    [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Open settings', onPress: () => Linking.openSettings()},
    ],
  );
};

/**
 * Shows why the camera/gallery didn't open. User cancelling is not an error.
 */
export const showImagePickerError = (error: any) => {
  console.log('Image picker error >>> ', error);
  if (error?.code === 'E_PICKER_CANCELLED') {
    return;
  }
  Alert.alert(
    'Unable to open',
    error?.message || 'Something went wrong. Please try again.',
  );
};

/**
 * `onUseGallery` is offered as a fallback when the device has no camera
 * (e.g. the iOS simulator) so the user can still finish the upload.
 */
export const requestCameraPermission = async (onUseGallery?: () => void) => {
  const permission =
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.CAMERA
      : PERMISSIONS.ANDROID.CAMERA;

  const status = await check(permission);

  switch (status) {
    case RESULTS.GRANTED:
      return true;

    case RESULTS.DENIED: {
      const result = await request(permission);
      if (result === RESULTS.BLOCKED) {
        alertBlocked('Camera');
      }
      return result === RESULTS.GRANTED;
    }

    case RESULTS.BLOCKED:
      alertBlocked('Camera');
      return false;

    case RESULTS.UNAVAILABLE:
      // No camera hardware - e.g. the iOS simulator.
      Alert.alert(
        'Camera not available',
        'This device has no camera. Please use Gallery to upload the image.',
        onUseGallery
          ? [
              {text: 'Cancel', style: 'cancel'},
              {text: 'Use Gallery', onPress: onUseGallery},
            ]
          : undefined,
      );
      return false;

    case RESULTS.LIMITED:
    default:
      return false;
  }
};

export const requestGalleryPermission = async () => {
  // Android: launchImageLibrary opens the system photo picker, which needs no
  // runtime permission. (This used to check a permission literally named
  // 'granted', which Android reports as unavailable - so gallery never opened.)
  if (Platform.OS !== 'ios') {
    return true;
  }
  const permission: any = PERMISSIONS.IOS.PHOTO_LIBRARY;

  const status = await check(permission);
  switch (status) {
    case RESULTS.GRANTED:
    case RESULTS.LIMITED: // iOS only
      return true;

    case RESULTS.DENIED: {
      const result = await request(permission);
      return (
        result === RESULTS.GRANTED ||
        result === RESULTS.LIMITED
      );
    }

    case RESULTS.BLOCKED:
      alertBlocked('Photo library');
      return false;

    case RESULTS.UNAVAILABLE:
    default:
      return false;
  }
};
/**
 * Opens the cropper for an image picked with react-native-image-picker.
 *
 * On iOS the gallery hands the image back while its own screen is still
 * animating closed, and iOS refuses to present the cropper on top of a
 * closing screen - the crop never shows and the image is never set.
 * Waiting for the dismiss animation first avoids that.
 */
export const cropPickedImage = async (uri: string) => {
  if (Platform.OS === 'ios') {
    await new Promise(resolve => setTimeout(resolve, 700));
  }
  return ImageCropPicker.openCropper({
    path: uri,
    mediaType: 'photo',
    cropping: true,
    freeStyleCropEnabled: true,
  });
};
