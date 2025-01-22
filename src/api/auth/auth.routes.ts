import { Router } from "express";
import {
  getSessionUser,
  googleCallback,
  googleRedirect,
  signInEmail,
  signOut,
  signUpWithEmail,
} from "./auth.controller";

export const authRoutes = Router();

authRoutes.post("/sign-in", signInEmail);
authRoutes.post("/sign-up", signUpWithEmail);

authRoutes.get("/callback/google", googleCallback);
authRoutes.get("/google", googleRedirect);

authRoutes.post("/sign-out", signOut);

authRoutes.get("/session", getSessionUser);
