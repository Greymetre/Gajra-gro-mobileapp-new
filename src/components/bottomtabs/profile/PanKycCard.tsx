import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { normalizePan } from '../../../utils/pan';
import { DocumentTile, KycCardHeader, KycField, kycStyles } from './KycCardParts';

interface Props {
  /** PAN verified by admin: image and number are read-only. */
  verified: boolean;
  imageUri?: string | null;
  imageError?: string | null;
  onPickImage: () => void;
  onRemoveImage: () => void;
  onPreviewImage: () => void;
  panNumber?: string;
  panNumberError?: string | null;
  onChangePanNumber: (pan: string) => void;
  onBlurPanNumber: () => void;
}

const PanKycCard = (props: Props) => {
  const { t } = useTranslation();

  return (
    <View style={kycStyles.card}>
      <KycCardHeader icon="id-card-outline" title={t('pancard')} verified={props.verified} />
      <DocumentTile
        uri={props.imageUri}
        locked={props.verified}
        emptyText="Tap to upload PAN card"
        error={props.imageError}
        onPick={props.onPickImage}
        onRemove={props.onRemoveImage}
        onPreview={props.onPreviewImage}
      />
      <KycField
        label="PAN Number (Optional)"
        icon="card-outline"
        locked={props.verified}
        value={normalizePan(props.panNumber)}
        onChangeText={text => props.onChangePanNumber(normalizePan(text))}
        onBlur={props.onBlurPanNumber}
        autoCapitalize="characters"
        maxLength={10}
        placeholder="e.g. ABCPE1234F"
        helper="10-character PAN printed on your card"
        error={props.panNumberError}
      />
    </View>
  );
};

export default PanKycCard;
