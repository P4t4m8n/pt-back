import sanitizeHtml from "sanitize-html";

const SanitizedField = (formData: FormData, fieldName: string): string => {
  return sanitizeHtml(formData.get(fieldName)?.toString() || "");
};

export const sanitizeUtil = {
  SanitizedField,
};
