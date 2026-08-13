import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import {Platform} from 'react-native';

export const requestCameraPermission = async () => {
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
      return result === RESULTS.GRANTED;
    }

    case RESULTS.BLOCKED:
    case RESULTS.UNAVAILABLE:
    case RESULTS.LIMITED:
    default:
      return false;
  }
};

export const requestGalleryPermission = async () => {
  const permission : any =
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.PHOTO_LIBRARY
      : RESULTS.GRANTED

  const status = await check(permission);
console.log(status, 'statusstatusstatusstatus')
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
    case RESULTS.UNAVAILABLE:
    default:
      return false;
  }
};