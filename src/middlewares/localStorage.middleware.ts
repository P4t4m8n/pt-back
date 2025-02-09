import { Request, Response, NextFunction } from "express";
import { AsyncLocalStorage } from "async_hooks";
import { TUser } from "../types/user.type";
import { authService } from "../api/auth/auth.service";
import { AppError } from "../util/Error.util";
/**
 * Represents the data stored in the AsyncLocalStorage.
 * @property {TUser} [loggedinUser] - Currently logged-in user's data.
 */
interface AsyncStorageData {
  loggedinUser?: TUser;
}
/**
 * The AsyncLocalStorage instance used for storing user-related data.
 */
export const asyncLocalStorage = new AsyncLocalStorage<AsyncStorageData>();
/**
 * Middleware that sets up and runs the AsyncLocalStorage context for each request.
 * If a valid token exists in cookies, extracts the logged-in user and stores it.
 * @param {Request} req - Express Request object
 * @param {Response} res - Express Response object
 * @param {NextFunction} next - Express NextFunction callback
 */
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
    console.log("token:", token)
    if (!token || typeof token !== "string") {
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
