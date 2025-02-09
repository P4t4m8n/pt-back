import { Request, Response } from "express";
import { AppError } from "../../util/Error.util";
import { authUtil } from "./auth.util";
import { authService } from "./auth.service";
import { asyncLocalStorage } from "../../middlewares/localStorage.middleware";
import {
  FRONTEND_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_REDIRECT_URI,
} from "../../config/env.config";
/**
 * Handles the sign-in process using email.
 *
 * @param req - The request object containing the sign-in data.
 * @param res - The response object used to send the response.
 *
 * @throws {AppError} If validation errors are found in the sign-in data.
 *
 * @returns {Promise<void>} A promise that resolves when the sign-in process is complete.
 */
export const signInEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const dataDto = req.body;

    const authDto = authUtil.sanitizeSignInDto(dataDto);
    const validationErrors = authUtil.validateSignInDto(authDto);

    if (Object.keys(validationErrors).length > 0) {
      throw AppError.create("Validation Error", 401, true, validationErrors);
    }

    const user = await authService.signIn(authDto);
    const token = await authUtil.createJWT(user.id!);
    res.cookie("token", token, authUtil.COOKIE).status(200).json({ user });
  } catch (error) {
    AppError.handleResponse(res, error);
  }
};
/**
 * Handles user sign-up with email.
 *
 * @param {Request} req - The request object containing the sign-up data.
 * @param {Response} res - The response object to send the result.
 *
 * @throws {AppError} If there are validation errors in the sign-up data.
 *
 * @returns {Promise<void>} A promise that resolves when the sign-up process is complete.
 */
export const signUpWithEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const dataDto = req.body;

    const authDto = authUtil.sanitizeSignUpDto(dataDto);
    const validationErrors = authUtil.validateSignUpDto(authDto);

    if (Object.keys(validationErrors).length > 0) {
      throw AppError.create("Validation Error", 401, true, validationErrors);
    }

    const user = await authService.signUp(authDto);
    const token = await authUtil.createJWT(user.id!);
    res.cookie("token", token, authUtil.COOKIE).status(200).json({ user });
  } catch (error) {
    AppError.handleResponse(res, error);
  }
};
/**
 * Redirects the user to Google's OAuth 2.0 authorization endpoint.
 * Constructs the Google authentication URL with the necessary query parameters
 * including client ID, redirect URI, response type, and scope.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 *
 * @returns {Promise<void>} - A promise that resolves when the redirection is complete.
 *
 * @throws {Error} - If an error occurs during the redirection process, it is handled by AppError.
 */
export const googleRedirect = async (req: Request, res: Response) => {
  try {
    console.log("GOOGLE_REDIRECT_URI:", GOOGLE_REDIRECT_URI);
    console.log("GOOGLE_CLIENT_ID:", GOOGLE_CLIENT_ID);
    const googleAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=email%20profile`;

    res.redirect(googleAuthURL);
  } catch (error) {
    AppError.handleResponse(res, error);
  }
};
/**
 * Handles the Google OAuth callback.
 *
 * This function is triggered when Google redirects the user back to your application after they have authenticated.
 * It exchanges the authorization code for an access token, fetches the user's information from Google, and then
 * attempts to sign in or sign up the user in your application. Finally, it creates a JWT token for the user and
 * sets it as a cookie before redirecting to the frontend.
 *
 * @param {Request} req - The request object, containing the authorization code in the query parameters.
 * @param {Response} res - The response object, used to send the JWT token as a cookie and handle errors.
 *
 * @throws {AppError} If the authorization code is missing or if there are any errors during the sign-in or sign-up process.
 */
export const googleCallback = async (req: Request, res: Response) => {
  const { code } = req.query;

  if (!code) {
    throw AppError.create("Google authentication failed", 400, true);
  }
  try {
    // Exchange authorization code for access token
    const accessToken = await authService.getGoogleToken(code as string);

    // Fetch user information
    const userInfoResponse = await authService.getGoogleUser(accessToken);

    let user = null;

    try {
      user = await authService.signIn(userInfoResponse);
    } catch (error) {
      if (error instanceof AppError && error.statusCode === 404) {
        // User not found, attempt to sign up
        user = await authService.signUp(userInfoResponse);
      } else {
        // Other errors
        throw error;
      }
    }

    const token = await authUtil.createJWT(user.id!);
    res.cookie("token", token, authUtil.COOKIE).redirect(FRONTEND_URL);
  } catch (error) {
    AppError.handleResponse(res, error);
  }
};
/**
 * Signs out the user by clearing the authentication token cookie.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A JSON response with a message indicating the user has signed out.
 */
export const signOut = async (req: Request, res: Response) => {
  try {
    res
      .clearCookie("token", authUtil.COOKIE)
      .status(200)
      .json({ message: "Signed out" });
  } catch (error) {
    AppError.handleResponse(res, error);
  }
};
/**
 * Retrieves the currently logged-in user from the async local storage and sends it in the response.
 * If no user is found, it sends `null`.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 * @throws {Error} - If an error occurs during the process, it is handled by `AppError.handleResponse`.
 */
export const getSessionUser = async (
  _: Request,
  res: Response
): Promise<void> => {
  try {
    const store = asyncLocalStorage.getStore();
    const user = store?.loggedinUser;

    res.status(200).json(user || null);
  } catch (error) {
    AppError.handleResponse(res, error);
  }
};
