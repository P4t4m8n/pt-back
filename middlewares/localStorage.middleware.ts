import { Request, Response, NextFunction } from "express";
import { AsyncLocalStorage } from "async_hooks";
import { TUser } from "../src/types/user.type";
import { authService } from "../src/api/auth/auth.service";

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

    const token = req.cookies.token;
    if (typeof token !== "string") {
      return next();
    }

    const loggedinUser = await authService.getSessionUser(token);

    if (loggedinUser) {
      const alsStore = asyncLocalStorage.getStore();
      if (alsStore) {
        alsStore.loggedinUser = loggedinUser as TUser;
      }
    }

    next();
  });
}
