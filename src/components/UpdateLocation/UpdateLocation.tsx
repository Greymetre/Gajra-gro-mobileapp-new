import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Header as HeaderRNE} from '@rneui/themed';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';
import colors from '../../styles/colors';
import appTheme from '../../utils/appTheme';
import styles from './styles';
import {
  requestLocationPermission,
  getCurrentCoordinates,
  toGeoJsonCoordinates,
  alertLocationPermissionDenied,
  alertLocationPermissionBlocked,
  alertLocationUnavailable,
} from '../../utils/locationHelper';
import type {UserCoordinates} from '../../utils/locationHelper';
import {
  requestGetCustomerAddress,
  requestUpdateCustomerAddress,
} from '../../services/backend_helper';
import {UserAddressInterface} from '../../interfaces/address.interface';

const UpdateLocation = (props: any) => {
  const {t} = useTranslation();
  const navigation = useNavigation();

  const [coords, setCoords] = useState<UserCoordinates | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedCoords, setSavedCoords] = useState<UserCoordinates | null>(null);
  // updateAddress replaces the whole address, so we keep the saved one around
  // and post it back untouched alongside the new coordinates.
  const [address, setAddress] = useState<UserAddressInterface>({});

  /**
   * Loads the address currently stored on the account. `coordinates` come back
   * in GeoJSON order — [longitude, latitude].
   */
  const fetchAddress = async () => {
    await requestGetCustomerAddress({})
      .then(res => {
        if (res.isError == false && res.data) {
          const {postalCode, address: line, city, state, country, coordinates} =
            res.data;
          setAddress({postalCode, address: line, city, state, country});
          if (Array.isArray(coordinates) && coordinates.length === 2) {
            setSavedCoords({
              longitude: coordinates[0],
              latitude: coordinates[1],
            });
          }
        }
      })
      .catch(error => {
        console.log('Get address error >>> ', error);
      });
  };

  /**
   * Asks for the permission when needed, then reads the position.
   * Mirrors the flow used on the sign-up screen so both places behave the same.
   */
  const detectLocation = async () => {
    setDetecting(true);
    const status = await requestLocationPermission();

    if (status === 'blocked') {
      setDetecting(false);
      alertLocationPermissionBlocked();
      return;
    }

    if (status === 'denied') {
      setDetecting(false);
      alertLocationPermissionDenied(() => {
        detectLocation();
      });
      return;
    }

    const position = await getCurrentCoordinates();
    setDetecting(false);

    if (!position) {
      alertLocationUnavailable(() => {
        detectLocation();
      });
      return;
    }

    setCoords(position);
  };

  useEffect(() => {
    fetchAddress();
    detectLocation();
  }, []);

  const onSubmit = async () => {
    if (!coords) {
      return;
    }
    setSaving(true);
    const data = {
      postalCode: address.postalCode ?? '',
      address: address.address ?? '',
      city: address.city ?? '',
      state: address.state ?? '',
      country: address.country ?? 'India',
      coordinates: toGeoJsonCoordinates(coords),
    };
    console.log('Update Location Data', data);
    await requestUpdateCustomerAddress(data)
      .then(res => {
        if (res.isError == false) {
          setSavedCoords(coords);
          Alert.alert(`${t('updatelocation')}`, `${t('locationupdated')}`, [
            {text: 'OK', onPress: () => navigation.goBack()},
          ]);
        } else {
          Alert.alert(`${t('updatelocation')}`, `${t('locationupdatefailed')}`);
        }
      })
      .catch(error => {
        console.log('Update location error >>> ', error?.response ?? error);
        Alert.alert(`${t('updatelocation')}`, `${t('locationupdatefailed')}`);
      });
    setSaving(false);
  };

  const renderCoordinate = (label: string, value?: number) => (
    <View style={styles.coordBox}>
      <Text allowFontScaling={false} style={styles.coordLabel}>
        {label}
      </Text>
      <Text
        allowFontScaling={false}
        style={[
          styles.coordValue,
          value === undefined ? styles.coordPlaceholder : null,
        ]}>
        {value === undefined ? '--' : value.toFixed(6)}
      </Text>
    </View>
  );

  const canSubmit = !!coords && !saving && !detecting;

  return (
    <View style={styles.screen}>
      <SafeAreaView />
      <HeaderRNE
        backgroundColor={colors.white}
        barStyle="dark-content"
        centerComponent={{
          text: `${t('updatelocation')}`,
          style: styles.headerTitle,
        }}
        centerContainerStyle={{height: 32, justifyContent: 'center'}}
        leftComponent={
          <TouchableOpacity
            style={{padding: 5}}
            onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={25} color={colors.black} />
          </TouchableOpacity>
        }
        leftContainerStyle={{paddingLeft: 5}}
        containerStyle={styles.header}
        placement="center"
      />

      <ScrollView contentContainerStyle={styles.scrollBody}>
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            {detecting ? (
              <ActivityIndicator color={colors.black} />
            ) : (
              <Icon
                name={coords ? 'map-marker-check' : 'map-marker-radius'}
                size={38}
                color={colors.black}
              />
            )}
          </View>
          <Text allowFontScaling={false} style={styles.heroTitle}>
            {detecting
              ? `${t('detectinglocation')}`
              : coords
              ? `${t('locationcaptured')}`
              : `${t('locationnotdetected')}`}
          </Text>
          <Text allowFontScaling={false} style={styles.heroSubtitle}>
            {t('updatelocationhint')}
          </Text>
        </View>

        <Text allowFontScaling={false} style={styles.sectionLabel}>
          {t('savedlocation')}
        </Text>
        <View style={styles.card}>
          <View style={styles.savedRow}>
            <View style={styles.savedIcon}>
              <Icon
                name={savedCoords ? 'check' : 'map-marker-off-outline'}
                size={20}
                color={colors.black}
              />
            </View>
            <View style={{flex: 1}}>
              <Text allowFontScaling={false} style={styles.savedValue}>
                {savedCoords
                  ? `${savedCoords.latitude.toFixed(
                      6,
                    )}, ${savedCoords.longitude.toFixed(6)}`
                  : `${t('locationnotset')}`}
              </Text>
              <Text allowFontScaling={false} style={styles.savedCaption}>
                {t('savedlocationcaption')}
              </Text>
            </View>
          </View>
        </View>

        <Text allowFontScaling={false} style={styles.sectionLabel}>
          {t('currentlocation')}
        </Text>
        <View style={styles.card}>
          <View style={styles.coordRow}>
            {renderCoordinate(`${t('latitude')}`, coords?.latitude)}
            <View style={styles.coordDivider} />
            {renderCoordinate(`${t('longitude')}`, coords?.longitude)}
          </View>
          <View style={styles.accuracyRow}>
            <Icon
              name="crosshairs-gps"
              size={14}
              color={colors.blackOpacity50}
            />
            <Text allowFontScaling={false} style={styles.accuracyText}>
              {coords?.accuracy
                ? `${t('accuracy')}: ±${Math.round(coords.accuracy)} m`
                : `${t('accuracy')}: --`}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.detectButton}
          disabled={detecting}
          onPress={detectLocation}>
          <Icon name="crosshairs-gps" size={20} color={colors.black} />
          <Text allowFontScaling={false} style={styles.detectText}>
            {coords ? `${t('detectagain')}` : `${t('detectlocation')}`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.submitButton,
            canSubmit ? null : styles.submitButtonDisabled,
          ]}
          disabled={!canSubmit}
          onPress={onSubmit}>
          {saving ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text allowFontScaling={false} style={styles.submitText}>
              {t('updatelocation')}
            </Text>
          )}
        </TouchableOpacity>

        <Text allowFontScaling={false} style={styles.helperText}>
          {t('updatelocationfooter')}
        </Text>
      </ScrollView>
    </View>
  );
};

export default UpdateLocation;
