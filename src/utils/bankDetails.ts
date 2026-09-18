/**
 * Bank account helpers for the optional bank details on the Profile screen.
 *
 * Every field is optional on its own; a field is only checked for format
 * once the user fills it in.
 */

export interface BankDetails {
  accountNo?: string;
  holderName?: string;
  bankName?: string;
  ifsc?: string;
}

export const BANK_FIELDS: (keyof BankDetails)[] = ['accountNo', 'holderName', 'bankName', 'ifsc'];

// First 4 letters = bank code, 5th is always 0, last 6 = branch code.
const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;

export const normalizeAccountNo = (value: string = '') => value.replace(/\D/g, '').slice(0, 18);
export const normalizeIfsc = (value: string = '') =>
  value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11);
export const normalizeHolderName = (value: string = '') => value.replace(/[^A-Za-z .]/g, '');

const clean = (details: BankDetails): Required<BankDetails> => ({
  accountNo: (details.accountNo || '').trim(),
  holderName: (details.holderName || '').trim(),
  bankName: (details.bankName || '').trim(),
  ifsc: (details.ifsc || '').trim(),
});

export const hasAnyBankDetail = (details: BankDetails) =>
  BANK_FIELDS.some(field => clean(details)[field] !== '');

/** True when the user changed at least one field compared to what was saved. */
export const bankDetailsChanged = (current: BankDetails, saved: BankDetails) => {
  const a = clean(current);
  const b = clean(saved);
  return BANK_FIELDS.some(field => a[field] !== b[field]);
};

/** Error for one field, or null. An empty field is always valid. */
export const getBankFieldError = (field: keyof BankDetails, details: BankDetails): string | null => {
  const value = clean(details)[field];

  if (value === '') {
    return null;
  }

  switch (field) {
    case 'accountNo':
      return /^\d{9,18}$/.test(value) ? null : 'Account number must be 9 to 18 digits';
    case 'holderName':
      return value.length >= 3 ? null : 'Enter the full account holder name';
    case 'bankName':
      return value.length >= 2 ? null : 'Enter a valid bank name';
    case 'ifsc':
      return IFSC_REGEX.test(value) ? null : 'Enter a valid 11-character IFSC (e.g. SBIN0001234)';
    default:
      return null;
  }
};
