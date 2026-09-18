/**
 * Aadhaar number helpers.
 *
 * A valid Aadhaar number (UIDAI standard) is 12 digits, never starts with
 * 0 or 1, and its last digit is a Verhoeff checksum of the first 11.
 */

// Verhoeff multiplication table
const D = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];

// Verhoeff permutation table
const P = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

const passesVerhoeff = (digits: string): boolean => {
  let c = 0;
  const reversed = digits.split('').reverse();
  for (let i = 0; i < reversed.length; i++) {
    c = D[c][P[i % 8][Number(reversed[i])]];
  }
  return c === 0;
};

/** Keeps only digits, capped at 12. */
export const normalizeAadhaar = (value: string = ''): string =>
  value.replace(/\D/g, '').slice(0, 12);

/** "123456789012" -> "1234 5678 9012" (works on partial input too). */
export const formatAadhaar = (value: string = ''): string =>
  normalizeAadhaar(value).replace(/(\d{4})(?=\d)/g, '$1 ');

/** "123456789012" -> "XXXX XXXX 9012" */
export const maskAadhaar = (value: string = ''): string => {
  const digits = normalizeAadhaar(value);
  if (digits.length < 4) {
    return digits;
  }
  return `XXXX XXXX ${digits.slice(-4)}`;
};

/**
 * Returns an error message, or null when the number is valid.
 * An empty value is valid - the field is optional.
 */
export const getAadhaarError = (value: string = ''): string | null => {
  const digits = normalizeAadhaar(value);
  if (digits.length === 0) {
    return null;
  }
  if (digits.length !== 12) {
    return 'Aadhaar number must be 12 digits';
  }
  if (digits[0] === '0' || digits[0] === '1') {
    return 'Aadhaar number cannot start with 0 or 1';
  }
  if (!passesVerhoeff(digits)) {
    return 'Please enter a valid Aadhaar number';
  }
  return null;
};
