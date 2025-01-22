import sanitizeHtml from "sanitize-html";
import { TUserCreateDto, TUserUpdateDto } from "../../types/user.type";
import { sanitizeUtil } from "../../util/sanitize.util";
import { validationUtil } from "../../util/validation.util";
import { jwtVerify } from "jose";

const formDataToUserDTO = (formData: FormData): TUserCreateDto => {
  const email = sanitizeUtil.SanitizedField(formData, "email");
  const password = sanitizeUtil.SanitizedField(formData, "password");
  const firstName = sanitizeUtil.SanitizedField(formData, "firstName");
  const lastName = sanitizeUtil.SanitizedField(formData, "lastName");
  const imgUrl =
    sanitizeUtil.SanitizedField(formData, "imgUrl") ||
    "/imgs/avatarDefault.svg";
  const googleId = sanitizeUtil.SanitizedField(formData, "googleId");
  const phone = sanitizeUtil.SanitizedField(formData, "phone");

  const returnedData: TUserCreateDto = {
    email,
    password,
    firstName,
    lastName,
    imgUrl,
    googleId,
    phone: phone ? sanitizeHtml(phone.toString()) : null,
  };

  return returnedData;
};

 const validateUserDto = (userDto: TUserCreateDto | TUserUpdateDto) => {
  const errors: string[] = [];

  const emailError = _validateEmail(userDto?.email);
  if (emailError) errors.push(emailError);

  const firstNameErrorLen = validationUtil.validateStrLength(
    "First name",
    2,
    userDto?.firstName
  );

  if (firstNameErrorLen) errors.push(firstNameErrorLen);

  const firstNameError = validationUtil.validateLetters(
    "First name",
    userDto?.firstName
  );
  if (firstNameError) errors.push(firstNameError);

  const lastNameErrorLen = validationUtil.validateStrLength(
    "Last name",
    2,
    userDto?.lastName
  );
  if (lastNameErrorLen) errors.push(lastNameErrorLen);

  const lastNameError = validationUtil.validateLetters(
    "Last name",
    userDto?.lastName
  );
  if (lastNameError) errors.push(lastNameError);

  return errors;
};

const decodeToken = async (token: string) => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);

  return payload;
};

/**
 * Private function.
 * Validates the given email address.
 *
 * @param email - The email address to be validated.
 * @returns A message if the email is invalid, otherwise null.
 */
const _validateEmail = (email?: string): string | null => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailPattern.test(email)) {
    return "Please provide a valid email address.";
  }
  return null;
};

export const authUtil = {
  formDataToUserDTO,
  validateUserDto,
  decodeToken
};
