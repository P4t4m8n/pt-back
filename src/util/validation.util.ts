/**
 * Validates that a string has the specified minimum length.
 * @param filedName - Name of the field being validated.
 * @param length - Minimum length required.
 * @param str - String to validate.
 * @returns An error message or null if valid.
 */
const validateStrLength = (
  filedName: string,
  length: number,
  str?: string
): string | null => {
  if (!str || str.trim().length < length) {
    return `${filedName} must be at least ${length} characters long.`;
  }
  return null;
};
/**
 * Validates that an array has the specified minimum length.
 * @param filedName - Name of the field being validated.
 * @param arr - Array to validate.
 * @param length - Minimum length required.
 * @returns An error message or null if valid.
 */
const validateArrayLength = (
  filedName: string,
  arr: unknown[] | null | undefined,
  length: number
): string | null => {
  if (!arr) {
    return `${filedName} is required.`;
  }
  if (arr?.length < length) {
    return `At least ${length} ${filedName} is required.`;
  }
  return null;
};
/**
 * Validates that a value is neither null nor undefined.
 * @param filedName - Name of the field being validated.
 * @param value - Value to validate.
 * @returns An error message or null if valid.
 */
const validateExistence = (
  filedName: string,
  value: unknown
): string | null => {
  if (value === null || value === undefined) {
    return `${filedName} is required.`;
  }
  return null;
};
/**
 * Validates that a string contains only letters, numbers, and spaces.
 * @param filedName - Name of the field being validated.
 * @param value - String to validate.
 * @returns An error message or null if valid.
 */
const validateLettersAndNumbers = (
  filedName: string,
  value?: string | null
): string | null => {
  if (value === null || value === undefined || !value) return null;
  if (!/^[a-zA-Z0-9 ]+$/.test(value)) {
    return `${filedName} can only contain letters, numbers, and spaces.`;
  }
  return null;
};
/**
 * Validates that a string contains only letters.
 * @param filedName - Name of the field being validated.
 * @param value - String to validate.
 * @returns An error message or null if valid.
 */
const validateLetters = (filedName: string, value?: string): string | null => {
  if (value === null || value === undefined) return null;
  if (!/^[a-zA-Z]+$/.test(value)) {
    return `${filedName} contain only letters.`;
  }
  return null;
};
/**
 * Validates that a value contains only numbers.
 * @param filedName - Name of the field being validated.
 * @param value - Value to validate.
 * @returns An error message or null if valid.
 */
const validateNumbers = (
  filedName: string,
  value?: string | number | null
): string | null => {
  if (value === null || value === undefined) return null;
  if (!/^[0-9]+$/.test(value?.toString() || "")) {
    return `${filedName} contain only numbers.`;
  }
  return null;
};
/**
 * Validates that a value is a valid Date object or string.
 * @param filedName - Name of the field being validated.
 * @param value - Date or date string to validate.
 * @returns An error message or null if valid.
 */
const validateDate = (
  filedName: string,
  value?: Date | null | string
): string | null => {
  if (value instanceof Date) {
    return null;
  }

  if (value === null || value === undefined) {
    return `${filedName} is required.`;
  }

  const _value = typeof value === "string" ? new Date(value) : value;
  if (isNaN(_value?.getTime())) {
    return `${filedName} is invalid.`;
  }
  return null;
};
/**
 * Validates that a string can be parsed as a valid date.
 * @param filedName - Name of the field being validated.
 * @param value - Date string to validate.
 * @returns An error message or null if valid.
 */
const validateDateStr = (filedName: string, value?: string): string | null => {
  if (value === null || value === undefined) {
    return `${filedName} is required.`;
  }
  if (isNaN(Date.parse(value))) {
    return `${filedName} is invalid.`;
  }
  return null;
};

/**
 * Provides validation utilities for various data types.
 */
export const validationUtil = {
  validateStrLength,
  validateArrayLength,
  validateExistence,
  validateLettersAndNumbers,
  validateLetters,
  validateNumbers,
  validateDate,
  validateDateStr,
};
