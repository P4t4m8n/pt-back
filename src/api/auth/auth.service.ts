import { prisma } from "../../../prisma/prisma";
import { TUser, TUserCreateDto } from "../../types/user.type";
import { AppError } from "../../util/Error.util";
import bcrypt from "bcrypt";
import { authUtil } from "./auth.util";
import { userService } from "../user/user.service";
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
} from "../../config/env.config";
import { TAuthSignInDto } from "../../types/auth.type";

const signIn = async (userDto: TAuthSignInDto): Promise<TUser> => {
  const { email, password, googleId } = userDto;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user?.email || !user?.id) {
    throw AppError.create("User not found", 404, true);
  }

  if (user?.passwordHash && password) {
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      throw AppError.create("Invalid credentials", 401, true);
    }
  } else if (user?.googleIdHash && googleId) {
    const match = await bcrypt.compare(googleId, user.googleIdHash);
    if (!match) {
      throw AppError.create("Invalid credentials", 401, true);
    }
  }

  const returnUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    imgUrl: user.imgUrl,
  };
  return returnUser;
};

const signUp = async (dto: TUserCreateDto): Promise<TUser> => {
  const saltRounds = 10;

  const { email, password, googleId } = dto;

  if (!email || (!password && !googleId)) {
    throw new Error("missing credentials");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  let passwordHash = null;
  let googleIdHash = null;

  if (password) {
    passwordHash = (await bcrypt.hash(password, saltRounds)) as string;
  }
  if (googleId) {
    googleIdHash = (await bcrypt.hash(googleId, saltRounds)) as string;
  }
  delete dto?.password;
  delete dto?.googleId;

  const user = await prisma.user.create({
    data: { ...dto, passwordHash, googleIdHash,trainee:{
      create:{}
    } },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      imgUrl: true,
    },
  });

  return user;
};

const getSessionUser = async (token: string): Promise<TUser | null> => {
  const payload = await authUtil.decodeToken(token);
  if (!payload) return null;
  const user = await userService.getById(payload?.userId as string);

  return user;
};

const getGoogleToken = async (code: string): Promise<string> => {
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
    }).toString(),
  });

  if (!tokenResponse.ok) {
    throw AppError.create("Failed to fetch google token", 500, true);
  }

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  return accessToken;
};

const getGoogleUser = async (accessToken: string): Promise<TUserCreateDto> => {
  const userInfoResponse = await fetch(
    "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!userInfoResponse.ok) {
    throw AppError.create("Failed to fetch google user", 500, true);
  }

  const userInfo = await userInfoResponse.json();

  if (!userInfo?.email || !userInfo?.id) {
    throw AppError.create("User not found in google", 404, true);
  }

  return {
    firstName: userInfo?.given_name,
    lastName: userInfo?.family_name,
    email: userInfo.email,
    imgUrl: userInfo?.picture,
    googleId: userInfo.id,
    phone: null,
  };
};

export const authService = {
  signIn,
  signUp,
  getSessionUser,
  getGoogleToken,
  getGoogleUser,
};
