import sanitizeHtml from "sanitize-html";
/**
 * Sanitizes a field from FormData.
 * @param formData The FormData object.
 * @param fieldName The name of the form field to sanitize.
 * @returns The sanitized string.
 */
const SanitizedFormField = (formData: FormData, fieldName: string): string => {
  return sanitizeHtml(formData.get(fieldName)?.toString() || "");
};
/**
 * Sanitizes an object field.
 * @param value The value to sanitize.
 * @returns The sanitized string or null if no value is provided.
 */
const SanitizedObjectField = (
  value?: string | null | number
): string | null => {
  if (!value) return null;
  return sanitizeHtml(value.toString());
};
/**
 * Returns a boolean value.
 * @param value The boolean value to sanitize.
 * @returns True if value is truthy, otherwise false.
 */
const SanitizedBoolean = (value?: boolean): boolean => {
  return value || false;
};
/**
 * Provides sanitization utilities for various data types.
 */
export const sanitizeUtil = {
  /**
   * Cleans HTML from a FormData field.
   */
  SanitizedFormField,
  /**
   * Cleans HTML from an object field.
   */
  SanitizedObjectField,
  /**
   * Converts a value to a boolean.
   */
  SanitizedBoolean,
};
