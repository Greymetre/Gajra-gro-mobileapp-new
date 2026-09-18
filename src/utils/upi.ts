/**
 * UPI ID helpers.
 *
 * Standard format: <name>@<bank handle>, e.g. 9876543210@ybl or name.surname@okhdfcbank.
 */

const UPI_REGEX = /^[a-zA-Z0-9._-]{2,256}@[a-zA-Z][a-zA-Z0-9.-]{1,63}$/;

/** UPI IDs never contain spaces; trim them away while typing/pasting. */
export const normalizeUpi = (value: string = ''): string => value.replace(/\s/g, '').slice(0, 100);

/**
 * Returns an error message, or null when valid.
 * An empty value is valid - the field is optional.
 */
export const getUpiError = (value: string = ''): string | null => {
  const upi = normalizeUpi(value);
  if (upi.length === 0) {
    return null;
  }
  if (!upi.includes('@')) {
    return 'UPI ID must contain @ (e.g. 9876543210@ybl)';
  }
  if (!UPI_REGEX.test(upi)) {
    return 'Enter a valid UPI ID (e.g. 9876543210@ybl)';
  }
  return null;
};
