import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { normalizeUpi } from '../../../utils/upi';
import { DocumentTile, KycCardHeader, KycField, kycStyles } from './KycCardParts';

interface Props {
  /** UPI verified by admin: ID and screenshot are read-only. */
  verified: boolean;
  upiId?: string | null;
  upiIdError?: string | null;
  onChangeUpiId: (upi: string) => void;
  onBlurUpiId: () => void;
  screenshotUri?: string | null;
  screenshotError?: string | null;
  onPickScreenshot: () => void;
  onRemoveScreenshot: () => void;
  onPreviewScreenshot: () => void;
}

const UpiKycCard = (props: Props) => {
  const { t } = useTranslation();
  const hasUpiId = normalizeUpi(props.upiId || '').length > 0;

  return (
    <View style={kycStyles.card}>
      <KycCardHeader icon="phone-portrait-outline" title={t('upi_id')} verified={props.verified} />

      <KycField
        label="UPI ID"
        icon="at-outline"
        locked={props.verified}
        value={props.upiId || ''}
        onChangeText={text => props.onChangeUpiId(normalizeUpi(text))}
        onBlur={props.onBlurUpiId}
        autoCapitalize="none"
        keyboardType="email-address"
        maxLength={100}
        placeholder="e.g. 9876543210@ybl"
        helper="Find it in your UPI app (PhonePe, GPay, Paytm...)"
        error={props.upiIdError}
      />

      <Text style={styles.label}>
        {t('upi_id_image')}
        {hasUpiId ? (
          <Text style={styles.required}> *</Text>
        ) : (
          <Text style={kycStyles.optional}> (Required when UPI ID is added)</Text>
        )}
      </Text>
      <DocumentTile
        uri={props.screenshotUri}
        locked={props.verified}
        emptyText="Tap to upload UPI app screenshot"
        error={props.screenshotError}
        onPick={props.onPickScreenshot}
        onRemove={props.onRemoveScreenshot}
        onPreview={props.onPreviewScreenshot}
      />
    </View>
  );
};

export default UpiKycCard;

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    color: 'black',
    marginTop: 14,
    marginBottom: 6,
  },
  required: {
    color: 'red',
  },
});
