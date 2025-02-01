import { Request, Response, NextFunction } from "express";
import { AsyncLocalStorage } from "async_hooks";
import { TUser } from "../types/user.type";
import { authService } from "../api/auth/auth.service";
import { AppError } from "../util/Error.util";

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
      if (!loggedinUser) {
        throw AppError.create("Not Authenticated", 401);
      }
      const alsStore = asyncLocalStorage.getStore();
      if (!alsStore) {
        throw AppError.create("Not Authenticated", 401);
      }
      alsStore.loggedinUser = loggedinUser as TUser;
    } catch (error) {
      if (!(error instanceof AppError)) {
        AppError.create(`${error}`, 500, false);
      }
      res.clearCookie("token");
    } finally {
      next();
    }
  });
}
