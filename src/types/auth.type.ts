import { JWTPayload } from "jose";
import { TUserCreateDto } from "./user.type";

export type TAuthSignInDto = {
  email: string;
  password?: string;
  googleId?: string;
};

export type TAuthSignUpDto = TUserCreateDto;

export type TJWTPayload = JWTPayload & {
  userId?: string;
};
