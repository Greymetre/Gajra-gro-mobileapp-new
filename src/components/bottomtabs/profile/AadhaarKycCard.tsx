import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import appTheme from '../../../utils/appTheme';
import { formatAadhaar, maskAadhaar, normalizeAadhaar } from '../../../utils/aadhaar';

interface SideProps {
  label: string;
  uri?: string | null;
  error?: string;
  locked: boolean;
  onPick: () => void;
  onRemove: () => void;
  onPreview: () => void;
}

const AadhaarSide = ({ label, uri, error, locked, onPick, onRemove, onPreview }: SideProps) => (
  <View style={styles.side}>
    <Text style={styles.sideLabel}>
      {label}
      <Text style={styles.required}> *</Text>
    </Text>

    {uri ? (
      <View style={styles.tile}>
        <TouchableOpacity activeOpacity={0.85} onPress={onPreview} style={StyleSheet.absoluteFill}>
          <Image source={{ uri, cache: 'reload' }} style={styles.tileImage} />
        </TouchableOpacity>
        {!locked && (
          <>
            <TouchableOpacity
              onPress={onRemove}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.removeButton}>
              <Ionicons name="close" size={14} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onPick} style={styles.changeButton}>
              <Ionicons name="camera-reverse-outline" size={14} color="black" />
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    ) : (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPick}
        disabled={locked}
        style={[styles.tile, styles.emptyTile, error ? styles.emptyTileError : null]}>
        <View style={styles.uploadIcon}>
          <Ionicons name="cloud-upload-outline" size={22} color="black" />
        </View>
        <Text style={styles.uploadText}>Tap to upload</Text>
        <Text style={styles.uploadHint}>Camera or Gallery</Text>
      </TouchableOpacity>
    )}

    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

interface Props {
  verified: boolean;
  frontUri?: string | null;
  backUri?: string | null;
  frontError?: string;
  backError?: string;
  onPickFront: () => void;
  onPickBack: () => void;
  onRemoveFront: () => void;
  onRemoveBack: () => void;
  onPreviewFront: () => void;
  onPreviewBack: () => void;
  aadhaarNumber?: string;
  aadhaarNumberError?: string | null;
  onChangeAadhaarNumber: (digits: string) => void;
  onBlurAadhaarNumber?: () => void;
}

const AadhaarKycCard = (props: Props) => {
  const { t } = useTranslation();
  const { verified } = props;
  const digits = normalizeAadhaar(props.aadhaarNumber);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Ionicons name="card-outline" size={20} color="black" />
          <Text style={styles.title}>Aadhaar Card</Text>
        </View>
        <View style={[styles.badge, verified ? styles.badgeVerified : styles.badgeNotVerified]}>
          <Ionicons
            name={verified ? 'checkmark-circle' : 'close-circle'}
            size={14}
            color={verified ? 'green' : 'red'}
          />
          <Text style={[styles.badgeText, { color: verified ? 'green' : 'red' }]}>
            {verified ? t('verified') : t('notverified')}
          </Text>
        </View>
      </View>

      <View style={styles.sidesRow}>
        <AadhaarSide
          label="Front"
          uri={props.frontUri}
          error={props.frontError}
          locked={verified}
          onPick={props.onPickFront}
          onRemove={props.onRemoveFront}
          onPreview={props.onPreviewFront}
        />
        <AadhaarSide
          label="Back"
          uri={props.backUri}
          error={props.backError}
          locked={verified}
          onPick={props.onPickBack}
          onRemove={props.onRemoveBack}
          onPreview={props.onPreviewBack}
        />
      </View>

      <Text style={styles.inputLabel}>
        Aadhaar Number <Text style={styles.optional}>(Optional)</Text>
      </Text>
      <View
        style={[
          styles.inputWrapper,
          props.aadhaarNumberError ? styles.inputWrapperError : null,
          verified ? styles.inputWrapperLocked : null,
        ]}>
        <Ionicons name="finger-print-outline" size={18} color="#6B6B6B" />
        <TextInput
          style={styles.input}
          value={verified ? maskAadhaar(digits) : formatAadhaar(digits)}
          onChangeText={text => props.onChangeAadhaarNumber(normalizeAadhaar(text))}
          onBlur={props.onBlurAadhaarNumber}
          editable={!verified}
          keyboardType="number-pad"
          // 12 digits + 2 spaces
          maxLength={14}
          placeholder="XXXX XXXX XXXX"
          placeholderTextColor="#A0A0A0"
        />
        {!verified && digits.length === 12 && !props.aadhaarNumberError ? (
          <Ionicons name="checkmark-circle" size={18} color="green" />
        ) : null}
      </View>
      {props.aadhaarNumberError ? (
        <Text style={styles.errorText}>{props.aadhaarNumberError}</Text>
      ) : (
        <Text style={styles.helperText}>12-digit number printed on your Aadhaar card</Text>
      )}
    </View>
  );
};

export default AadhaarKycCard;

const styles = StyleSheet.create({
  card: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 18,
    borderWidth: 0.5,
    borderColor: 'grey',
    padding: 14,
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
    marginLeft: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
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
  sidesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  side: {
    width: '48%',
  },
  sideLabel: {
    fontSize: 13,
    color: 'black',
    marginBottom: 6,
  },
  required: {
    color: 'red',
  },
  tile: {
    height: 110,
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
  inputLabel: {
    fontSize: 13,
    color: 'black',
    marginTop: 16,
    marginBottom: 6,
  },
  optional: {
    color: '#8A8A8A',
    fontSize: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
  },
  inputWrapperError: {
    borderColor: 'red',
  },
  inputWrapperLocked: {
    backgroundColor: '#F5F5F5',
  },
  input: {
    flex: 1,
    fontSize: 16,
    letterSpacing: 1.5,
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
