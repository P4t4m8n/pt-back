import sanitizeHtml from "sanitize-html";

const SanitizedFormField = (formData: FormData, fieldName: string): string => {
  return sanitizeHtml(formData.get(fieldName)?.toString() || "");
};
const SanitizedObjectField = (value?: string|null|number): string | null => {
  if (!value) return null;
  return sanitizeHtml(value.toString());
};

export const sanitizeUtil = {
  SanitizedFormField,
  SanitizedObjectField,
};
