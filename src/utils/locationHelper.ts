import {Alert, Linking, PermissionsAndroid, Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export interface UserCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

/**
 * granted  - we can read the position
 * denied   - user said no, but the OS will ask again
 * blocked  - user picked "Don't ask again" / iOS denial, only Settings can fix it
 */
export type LocationPermissionStatus = 'granted' | 'denied' | 'blocked';

/**
 * Ask the OS for foreground location access.
 * Android uses the core PermissionsAndroid API (same style as CatalogueWebView),
 * iOS relies on the geolocation module which reads the NSLocation* usage
 * descriptions already present in Info.plist.
 */
export const requestLocationPermission =
  async (): Promise<LocationPermissionStatus> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'We need your location to register your shop at the correct place.',
            buttonPositive: 'Allow',
            buttonNegative: 'Cancel',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return 'granted';
        }
        return granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
          ? 'blocked'
          : 'denied';
      } catch (error) {
        console.log('Location permission error >>> ', error);
        return 'denied';
      }
    }

    return new Promise(resolve => {
      let settled = false;
      const done = (status: LocationPermissionStatus) => {
        if (!settled) {
          settled = true;
          resolve(status);
        }
      };

      // On iOS these callbacks only fire when the authorization status
      // *changes*. If the user already answered (e.g. during the warm-up on
      // mount) they never fire, so the probe below settles the promise.
      Geolocation.requestAuthorization(
        () => done('granted'),
        error => {
          console.log('Location permission error >>> ', error);
          done('blocked');
        },
      );

      // getCurrentPosition fails right away with PERMISSION_DENIED (code 1)
      // when access is denied. Any other outcome means we are allowed to try.
      Geolocation.getCurrentPosition(
        () => done('granted'),
        error => {
          console.log('Location permission probe >>> ', error);
          done(error?.code === 1 ? 'blocked' : 'granted');
        },
        // Keep every option finite: Infinity can't cross the RN bridge and
        // crashes with "Malformed calls from JS".
        {enableHighAccuracy: false, timeout: 30000, maximumAge: 60000},
      );
    });
  };

/**
 * Reads the current position. Assumes the permission is already granted.
 * Resolves with null instead of rejecting so callers stay on one path.
 */
const readPosition = (options: {
  enableHighAccuracy: boolean;
  timeout: number;
  maximumAge: number;
}): Promise<UserCoordinates | null> =>
  new Promise(resolve => {
    Geolocation.getCurrentPosition(
      position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        resolve({latitude, longitude, accuracy: position.coords.accuracy});
      },
      error => {
        console.log('Get location error >>> ', error);
        resolve(null);
      },
      options,
    );
  });

/**
 * Tries a precise GPS fix first. GPS often can't get a fix indoors, so when
 * that fails we fall back to a coarse (Wi-Fi / cell) or recently cached fix.
 */
export const getCurrentCoordinates =
  async (): Promise<UserCoordinates | null> => {
    const precise = await readPosition({
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 10000,
    });
    if (precise) {
      return precise;
    }
    return readPosition({
      enableHighAccuracy: false,
      timeout: 15000,
      maximumAge: 300000,
    });
  };

/**
 * Permission + position in one call.
 */
export const getCurrentLocation = async (): Promise<UserCoordinates | null> => {
  const status = await requestLocationPermission();
  if (status !== 'granted') {
    return null;
  }
  return getCurrentCoordinates();
};

/**
 * Backend stores the point as GeoJSON, which is [longitude, latitude] — note
 * the order is the reverse of how we usually say it.
 */
export const toGeoJsonCoordinates = (
  coordinates: UserCoordinates,
): [number, number] => [coordinates.longitude, coordinates.latitude];

/**
 * Rationale popup for a permission the user refused but can still grant.
 */
export const alertLocationPermissionDenied = (onAllow: () => void) => {
  Alert.alert(
    'Location permission needed',
    'We need your location to register your shop at the correct place. Please allow location access to continue.',
    [
      {text: 'Not now', style: 'cancel'},
      {text: 'Allow', onPress: onAllow},
    ],
  );
};

/**
 * The user blocked the permission, so only the OS settings screen can undo it.
 */
export const alertLocationPermissionBlocked = () => {
  Alert.alert(
    'Location permission blocked',
    'Location access is turned off for this app. Please enable it from Settings to complete your registration.',
    [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Open settings', onPress: () => Linking.openSettings()},
    ],
  );
};

/**
 * Permission is fine but we still could not get a fix — usually GPS is off.
 */
export const alertLocationUnavailable = (onRetry: () => void) => {
  Alert.alert(
    'Unable to get location',
    'Please turn on your location (GPS) so we can register your shop at the correct place.',
    [
      {text: 'Open settings', onPress: () => Linking.openSettings()},
      {text: 'Retry', onPress: onRetry},
    ],
  );
};
