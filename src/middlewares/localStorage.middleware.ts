import { Request, Response, NextFunction } from "express";
import { AsyncLocalStorage } from "async_hooks";
import { TUser } from "../types/user.type";
import { authService } from "../api/auth/auth.service";
import { AppError } from "../util/Error.util";
import { COOKIE } from "../api/auth/auth.controller";

export interface AsyncStorageData {
  loggedinUser?: TUser;
}

export const asyncLocalStorage = new AsyncLocalStorage<AsyncStorageData>();

export async function setupAsyncLocalStorage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const storage: AsyncStorageData = {};

  asyncLocalStorage.run(storage, async () => {
    if (!req.cookies) {
      return next();
    }

    const token = req?.cookies?.token;
    if (typeof token !== "string") {
      return next();
    }
    try {
      const loggedinUser = await authService.getSessionUser(token);
      if (loggedinUser) {
        const alsStore = asyncLocalStorage.getStore();
        if (alsStore) {
          alsStore.loggedinUser = loggedinUser as TUser;
        }
      }
    } catch (error) {
      AppError.create("Not Authenticated", 401);
      res.clearCookie("token");
      next();
    } finally {
      next();
    }
  });
}
