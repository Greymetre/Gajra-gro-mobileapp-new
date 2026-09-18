import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  BankDetails,
  normalizeAccountNo,
  normalizeHolderName,
  normalizeIfsc,
} from '../../../utils/bankDetails';
import { DocumentTile, KycCardHeader, KycField, StatusBadge, kycStyles } from './KycCardParts';

interface Props {
  /** Passbook verified by admin: image can't be changed. */
  passbookVerified: boolean;
  passbookUri?: string | null;
  passbookError?: string | null;
  onPickPassbook: () => void;
  onRemovePassbook: () => void;
  onPreviewPassbook: () => void;

  bankValues: BankDetails;
  bankErrors: Partial<Record<keyof BankDetails, string | null>>;
  /** Bank account verified by admin: fields are read-only. */
  bankLocked: boolean;
  onChangeBank: (field: keyof BankDetails, value: string) => void;
  onBlurBank: (field: keyof BankDetails) => void;
}

const PassbookBankCard = (props: Props) => {
  const { t } = useTranslation();
  const { bankLocked, bankValues, bankErrors } = props;

  return (
    <View style={kycStyles.card}>
      <KycCardHeader
        icon="business-outline"
        title={t('pass_cheque')}
        verified={props.passbookVerified}
      />
      <DocumentTile
        uri={props.passbookUri}
        locked={props.passbookVerified}
        emptyText="Tap to upload passbook or cancelled cheque"
        error={props.passbookError}
        onPick={props.onPickPassbook}
        onRemove={props.onRemovePassbook}
        onPreview={props.onPreviewPassbook}
      />

      <View style={kycStyles.divider} />

      <View style={styles.subHeader}>
        <Text style={styles.subTitle}>
          Bank Details <Text style={kycStyles.optional}>(Optional)</Text>
        </Text>
        {bankLocked ? <StatusBadge verified /> : null}
      </View>

      <KycField
        label="Account Number"
        icon="keypad-outline"
        locked={bankLocked}
        value={bankValues.accountNo || ''}
        onChangeText={text => props.onChangeBank('accountNo', normalizeAccountNo(text))}
        onBlur={() => props.onBlurBank('accountNo')}
        keyboardType="number-pad"
        maxLength={18}
        placeholder="Enter account number"
        error={bankErrors.accountNo}
      />
      <KycField
        label="Account Holder Name"
        icon="person-outline"
        locked={bankLocked}
        value={bankValues.holderName || ''}
        onChangeText={text => props.onChangeBank('holderName', normalizeHolderName(text))}
        onBlur={() => props.onBlurBank('holderName')}
        autoCapitalize="words"
        maxLength={60}
        placeholder="As per bank records"
        error={bankErrors.holderName}
      />
      <KycField
        label="Bank Name"
        icon="business-outline"
        locked={bankLocked}
        value={bankValues.bankName || ''}
        onChangeText={text => props.onChangeBank('bankName', text)}
        onBlur={() => props.onBlurBank('bankName')}
        autoCapitalize="words"
        maxLength={60}
        placeholder="e.g. State Bank of India"
        error={bankErrors.bankName}
      />
      <KycField
        label="IFSC Code"
        icon="barcode-outline"
        locked={bankLocked}
        value={bankValues.ifsc || ''}
        onChangeText={text => props.onChangeBank('ifsc', normalizeIfsc(text))}
        onBlur={() => props.onBlurBank('ifsc')}
        autoCapitalize="characters"
        maxLength={11}
        placeholder="e.g. SBIN0001234"
        error={bankErrors.ifsc}
      />
    </View>
  );
};

export default PassbookBankCard;

const styles = StyleSheet.create({
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subTitle: {
    fontSize: 14,
    color: 'black',
    fontWeight: '600',
  },
});
