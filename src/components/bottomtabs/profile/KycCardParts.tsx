/**
 * Building blocks shared by the KYC cards on the Profile screen
 * (Shop image, Passbook & bank details, PAN, UPI).
 */
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import appTheme from '../../../utils/appTheme';

export const StatusBadge = ({ verified }: { verified: boolean }) => {
  const { t } = useTranslation();
  const color = verified ? 'green' : 'red';
  return (
    <View style={[styles.badge, verified ? styles.badgeVerified : styles.badgeNotVerified]}>
      <Ionicons name={verified ? 'checkmark-circle' : 'close-circle'} size={14} color={color} />
      <Text style={[styles.badgeText, { color }]}>
        {verified ? t('verified') : t('notverified')}
      </Text>
    </View>
  );
};

interface CardHeaderProps {
  icon: string;
  title: string;
  required?: boolean;
  /** Leave undefined for documents that are never verified (no badge). */
  verified?: boolean;
}

export const KycCardHeader = ({ icon, title, required, verified }: CardHeaderProps) => (
  <View style={styles.header}>
    <View style={styles.headerTitle}>
      <Ionicons name={icon} size={20} color="black" />
      <Text style={styles.title}>
        {title}
        {required ? <Text style={styles.required}> *</Text> : null}
      </Text>
    </View>
    {verified !== undefined ? <StatusBadge verified={verified} /> : null}
  </View>
);

interface DocumentTileProps {
  uri?: string | null;
  /** Verified documents can't be removed or replaced. */
  locked: boolean;
  emptyText: string;
  error?: string | null;
  onPick: () => void;
  onRemove: () => void;
  onPreview: () => void;
}

export const DocumentTile = (props: DocumentTileProps) => (
  <>
    {props.uri ? (
      <View style={styles.tile}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={props.onPreview}
          style={StyleSheet.absoluteFill}>
          <Image source={{ uri: props.uri, cache: 'reload' }} style={styles.tileImage} />
        </TouchableOpacity>
        {!props.locked && (
          <>
            <TouchableOpacity
              onPress={props.onRemove}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.removeButton}>
              <Ionicons name="close" size={14} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={props.onPick} style={styles.changeButton}>
              <Ionicons name="camera-reverse-outline" size={14} color="black" />
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    ) : (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={props.onPick}
        disabled={props.locked}
        style={[styles.tile, styles.emptyTile, props.error ? styles.emptyTileError : null]}>
        <View style={styles.uploadIcon}>
          <Ionicons name="cloud-upload-outline" size={22} color="black" />
        </View>
        <Text style={styles.uploadText}>{props.emptyText}</Text>
        <Text style={styles.uploadHint}>Camera or Gallery</Text>
      </TouchableOpacity>
    )}
    {props.error ? <Text style={styles.errorText}>{props.error}</Text> : null}
  </>
);

interface KycFieldProps extends TextInputProps {
  label: string;
  icon: string;
  error?: string | null;
  helper?: string;
  locked: boolean;
}

export const KycField = ({ label, icon, error, helper, locked, ...inputProps }: KycFieldProps) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <View
      style={[
        styles.inputWrapper,
        error ? styles.inputWrapperError : null,
        locked ? styles.inputWrapperLocked : null,
      ]}>
      <Ionicons name={icon} size={18} color="#6B6B6B" />
      <TextInput
        style={styles.input}
        editable={!locked}
        placeholderTextColor="#A0A0A0"
        autoCorrect={false}
        {...inputProps}
      />
    </View>
    {error ? (
      <Text style={styles.errorText}>{error}</Text>
    ) : helper ? (
      <Text style={styles.helperText}>{helper}</Text>
    ) : null}
  </View>
);

export const kycStyles = StyleSheet.create({
  card: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 18,
    borderWidth: 0.5,
    borderColor: 'grey',
    padding: 14,
    marginTop: 14,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0,0,0,0.2)',
    marginTop: 16,
    marginBottom: 12,
  },
  optional: {
    fontSize: 12,
    color: '#8A8A8A',
    fontWeight: 'normal',
  },
});

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
    marginLeft: 8,
    flexShrink: 1,
  },
  required: {
    color: 'red',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 8,
  },
  badgeVerified: {
    backgroundColor: '#E3F6E5',
  },
  badgeNotVerified: {
    backgroundColor: '#FDE4E4',
  },
  badgeText: {
    fontSize: 12,
    marginLeft: 4,
  },
  tile: {
    height: 130,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F2F2F2',
  },
  tileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  emptyTile: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFAF0',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: appTheme.NEW_PALLET,
    paddingHorizontal: 12,
  },
  emptyTileError: {
    borderColor: 'red',
  },
  uploadIcon: {
    backgroundColor: '#FFE7C7',
    borderRadius: 20,
    padding: 8,
    marginBottom: 6,
  },
  uploadText: {
    fontSize: 13,
    color: 'black',
    fontWeight: '500',
    textAlign: 'center',
  },
  uploadHint: {
    fontSize: 11,
    color: '#8A8A8A',
    marginTop: 2,
  },
  removeButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(220,0,0,0.85)',
    borderRadius: 12,
    padding: 3,
  },
  changeButton: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE7C7',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  changeText: {
    fontSize: 11,
    color: 'black',
    marginLeft: 3,
  },
  field: {
    marginTop: 10,
  },
  label: {
    fontSize: 13,
    color: 'black',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
    backgroundColor: 'white',
  },
  inputWrapperError: {
    borderColor: 'red',
  },
  inputWrapperLocked: {
    backgroundColor: '#F5F5F5',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: 'black',
    marginLeft: 8,
  },
  helperText: {
    fontSize: 11,
    color: '#8A8A8A',
    marginTop: 4,
  },
  errorText: {
    fontSize: 11,
    color: 'red',
    marginTop: 4,
  },
});
