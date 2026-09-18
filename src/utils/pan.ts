/**
 * PAN (Permanent Account Number) helpers.
 *
 * Standard format: 5 letters, 4 digits, 1 letter - e.g. ABCPE1234F.
 * The 4th letter is the holder type (P = person, C = company, F = firm, ...).
 */

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
const HOLDER_TYPES = 'ABCFGHJLPT';

/** Uppercases and keeps only letters/digits, capped at 10. */
export const normalizePan = (value: string = ''): string =>
  value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);

/**
 * Returns an error message, or null when valid.
 * An empty value is valid - the field is optional.
 */
export const getPanError = (value: string = ''): string | null => {
  const pan = normalizePan(value);
  if (pan.length === 0) {
    return null;
  }
  if (pan.length !== 10) {
    return 'PAN must be 10 characters';
  }
  if (!PAN_REGEX.test(pan) || !HOLDER_TYPES.includes(pan[3])) {
    return 'Enter a valid PAN (e.g. ABCPE1234F)';
  }
  return null;
};
