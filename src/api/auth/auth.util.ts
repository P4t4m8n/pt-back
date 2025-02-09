//Core
import { jwtVerify, SignJWT } from "jose";
//Types
import {
  TAuthSignInDto,
  TAuthSignUpDto,
  TJWTPayload,
} from "../../types/auth.type";
import { CookieOptions } from "express";
//Util
import { sanitizeUtil } from "../../util/sanitize.util";
import { validationUtil } from "../../util/validation.util";
import { AppError } from "../../util/Error.util";
//Config
import { JWT_SECRET, NODE_ENV } from "../../config/env.config";
/**
 * Configuration options for the authentication cookie.
 *
 * @constant
 * @type {CookieOptions}
 * @property {boolean} httpOnly - Indicates if the cookie is accessible only through the HTTP protocol.
 * @property {boolean} secure - Indicates if the cookie should be sent only over HTTPS. Set to true if the environment is production.
 * @property {string} sameSite - Controls whether the cookie is sent with cross-site requests. Set to "none" if the environment is production, otherwise "lax".
 * @property {string} path - Specifies the URL path that must exist in the requested URL for the browser to send the Cookie header.
 * @property {number} maxAge - Specifies the number of milliseconds until the cookie expires. Set to 24 hours.
 */
const COOKIE: CookieOptions = {
  httpOnly: true,
  secure: NODE_ENV === "production",
  sameSite: NODE_ENV === "production" ? "none" : "lax",
  path: "/",
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
};

/**
 * Sanitizes the fields of a sign-up DTO (Data Transfer Object).
 *
 * This function ensures that the fields `email`, `password`, `firstName`, `lastName`,
 * and `imgUrl` are sanitized using the `sanitizeUtil.SanitizedObjectField` method.
 * If any of these fields are not provided or are invalid, they will be set to default values.
 *
 * @param {TAuthSignUpDto} dto - The sign-up DTO to be sanitized.
 * @returns {TAuthSignUpDto} - The sanitized sign-up DTO.
 */
const sanitizeSignUpDto = (dto: TAuthSignUpDto): TAuthSignUpDto => {
  const email = sanitizeUtil.SanitizedObjectField(dto?.email) || "";
  const password = sanitizeUtil.SanitizedObjectField(dto?.password) || "";
  const firstName = sanitizeUtil.SanitizedObjectField(dto?.firstName) || "";
  const lastName = sanitizeUtil.SanitizedObjectField(dto?.lastName) || "";
  const imgUrl =
    sanitizeUtil.SanitizedObjectField(dto?.imgUrl) || "/imgs/avatarDefault.svg";

  const returnedData: TAuthSignUpDto = {
    email,
    password,
    firstName,
    lastName,
    imgUrl,
  };

  return returnedData;
};
/**
 * Validates the sign-up data transfer object (DTO) for user registration.
 *
 * @param {TAuthSignUpDto} userDto - The user sign-up data transfer object containing user details.
 * @returns {Record<string, string>} An object containing validation errors, if any. The keys are the field names and the values are the corresponding error messages.
 */
const validateSignUpDto = (userDto: TAuthSignUpDto): Record<string, string> => {
  const errors: Record<string, string> = {};

  const emailError = _validateEmail(userDto?.email);
  if (emailError) errors.email = emailError;
  const passwordError = _validatePassword(userDto?.password);
  if (passwordError) errors.password = passwordError;

  const firstNameError = _validateNames(userDto?.firstName, "First Name");
  if (firstNameError) errors.firstName = firstNameError;

  const lastNameError = _validateNames(userDto?.lastName, "Last Name");
  if (lastNameError) errors.lastName = lastNameError;

  return errors;
};
/**
 * Validates the sign-in data transfer object (DTO) for user authentication.
 *
 * @param {TAuthSignInDto} userDto - The data transfer object containing user sign-in information.
 * @returns {Record<string, string>} An object containing validation errors, if any. The keys are the field names and the values are the corresponding error messages.
 */
const validateSignInDto = (userDto: TAuthSignInDto): Record<string, string> => {
  const errors: Record<string, string> = {};

  const emailError = _validateEmail(userDto?.email);
  if (emailError) errors.email = emailError;

  const passwordError = _validatePassword(userDto?.password);
  if (passwordError) errors.password = passwordError;

  return errors;
};
const sanitizeSignInDto = (dto: TAuthSignInDto): TAuthSignInDto => {
  const email = sanitizeUtil.SanitizedObjectField(dto?.email) || "";
  const password = sanitizeUtil.SanitizedObjectField(dto?.password) || "";

  return {
    email,
    password,
  };
};
/**
 * Creates a JSON Web Token (JWT) for a given user ID.
 *
 * @param {string} userId - The ID of the user for whom the JWT is being created.
 * @param {string} [alg="HS256"] - The algorithm to be used for signing the JWT. Defaults to "HS256".
 * @param {string} [expiration="24h"] - The expiration time for the JWT. Defaults to "24h".
 * @returns {Promise<string>} A promise that resolves to the signed JWT.
 */
const createJWT = async (
  userId: string,
  alg: string = "HS256",
  expiration: string = "24h"
) => {
  const secret = new TextEncoder().encode(JWT_SECRET);
  return new SignJWT({ userId })
    .setProtectedHeader({ alg })
    .setExpirationTime(expiration)
    .sign(secret);
};
/**
 * Decodes a JWT token and returns its payload.
 *
 * @param {string} [token] - The JWT token to decode.
 * @returns {Promise<TJWTPayload | null>} - A promise that resolves to the decoded payload or null if the token is invalid or not provided.
 *
 * @throws {AppError} - Throws an AppError if there is an error during token verification.
 */
const decodeToken = async (token?: string): Promise<TJWTPayload | null> => {
  try {
    if (!token) return null;
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify<TJWTPayload>(token, secret);

    if (!payload) return null;

    return payload;
  } catch (error) {
    if (error instanceof Error) {
      AppError.create(error.message, 500);
    }
    return null;
  }
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
/**
 * Private function.
 * Validates the given password.
 *
 * @param password - The password to be validated.
 * @returns A message if the password is invalid, otherwise null.
 */
const _validatePassword = (password?: string): string | null => {
  if (!password) {
    return "Password is required.";
  }
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
  if (!passwordPattern.test(password)) {
    return "Password must contain at least one uppercase letter, one lowercase letter, and one number.";
  }
  return null;
};
/**
 * Private function.
 * Validates the given name.
 *
 * @param name - The name to be validated.
 * @param fieldName - The name of the field being validated.
 * @returns A message if the name is invalid, otherwise null.
 */
const _validateNames = (name: string, fieldName: string) => {
  const errorLen = validationUtil.validateStrLength(fieldName, 2, name);
  if (errorLen) {
    return errorLen;
  }

  const error = validationUtil.validateLetters(fieldName, name);
  if (error) {
    return error;
  }

  return null;
};

export const authUtil = {
  sanitizeSignUpDto,
  validateSignUpDto,
  validateSignInDto,
  sanitizeSignInDto,
  createJWT,
  decodeToken,
  COOKIE,
};
