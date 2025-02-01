import { Request, Response, NextFunction } from "express";
import { asyncLocalStorage } from "./localStorage.middleware";
import { AppError } from "../util/Error.util";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const store = asyncLocalStorage.getStore();
  if (!store?.loggedinUser) {
    throw AppError.create("Not Authenticated", 401);
  }

  next();
}

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const store = asyncLocalStorage.getStore();
  const loggedinUser = store?.loggedinUser;

  if (!loggedinUser) {
    throw AppError.create("Not Authenticated", 401);
  }

  if (!loggedinUser?.trainer) {
    throw AppError.create("Not Authorized", 403);
  }

  next();
}
