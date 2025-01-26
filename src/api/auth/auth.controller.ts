import { CookieOptions, Request, Response } from "express";
import { SignJWT } from "jose";
import { AppError } from "../../util/Error.util";
import { authUtil } from "./auth.util";
import { authService } from "./auth.service";
import { asyncLocalStorage } from "../../middlewares/localStorage.middleware";

export const signInEmail = async (req: Request, res: Response) => {
  try {
    const formData = req.body;

    const userDto = authUtil.formDataToUserDTO(formData);
    const validationErrors = authUtil.validateUserDto(userDto);

    if (validationErrors.length > 0) {
      AppError.create(validationErrors.join(", "), 400, true);
    }

    const user = await authService.signIn(userDto);
    const token = await createJWT(user.id!);
    res.cookie("token", token, COOKIE).status(200).json({ user });
  } catch (error) {
    AppError.handleResponse(res, error);
  }
};

export const signUpWithEmail = async (req: Request, res: Response) => {
  try {
    const formData = req.body;

    const userDto = authUtil.formDataToUserDTO(formData);
    const validationErrors = authUtil.validateUserDto(userDto);

    if (validationErrors.length > 0) {
      AppError.create(validationErrors.join(", "), 400, true);
    }

    const user = await authService.signUp(userDto);
    const token = await createJWT(user.id!);
    res.cookie("token", token, COOKIE).status(200).json({ user });
  } catch (error) {
    AppError.handleResponse(res, error);
  }
};

export const googleRedirect = async (req: Request, res: Response) => {
  try {
    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
    const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
    const googleAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=email%20profile`;

    res.redirect(googleAuthURL);
  } catch (error) {
    AppError.handleResponse(res, error);
  }
};

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

    const token = await createJWT(user.id!);
    res.cookie("token", token, COOKIE).redirect(process.env.FRONTEND_URL!);
  } catch (error) {
    AppError.handleResponse(res, error);
  }
};

export const signOut = async (req: Request, res: Response) => {
  try {
    res
      .clearCookie("token", COOKIE)
      .status(200)
      .json({ message: "Signed out" });
  } catch (error) {
    AppError.handleResponse(res, error);
  }
};

export const getSessionUser = async (req: Request, res: Response) => {
  try {
    const store = asyncLocalStorage.getStore();
    const user = store?.loggedinUser;

    res.status(200).json(user || null);
  } catch (error) {
    AppError.handleResponse(res, error);
  }
};
const createJWT = async (
  userId: string,
  alg: string = "HS256",
  expiration: string = "24h"
) => {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  return new SignJWT({ userId })
    .setProtectedHeader({ alg })
    .setExpirationTime(expiration)
    .sign(secret);
};

const COOKIE: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
};
