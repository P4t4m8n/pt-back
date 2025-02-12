import { Response } from "express";
import Logger from "./Logger.util";

/**
 * Custom error class for application-specific errors.
 * Extends the built-in `Error` class to include additional properties.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly validationErrors?: Record<string, string>;

  /**
   * Creates an instance of `AppError`.
   *
   * @param message - The error message.
   * @param statusCode - HTTP status code (default is 500).
   * @param isOperational - Flag indicating if the error is operational (default is true).
   * @param validationErrors - Flag indicating if the error is operational (default is true).
   */
  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    validationErrors?: Record<string, string>
  ) {
    super(message);

    // Set prototype explicitly for extending built-ins
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.validationErrors = validationErrors;

    // Capture stack trace for better debugging
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    // Log the error upon creation
    this.logError();
  }

  /**
   * Logs the error using the Logger class.
   *
   * @private
   */
  private logError(): void {
    if (this.isOperational) {
      Logger.warn(`Operational Error: ${this.message}`, {
        statusCode: this.statusCode,
        stack: this.stack,
      });
    } else {
      Logger.error(`System Error: ${this.message}`, {
        statusCode: this.statusCode,
        stack: this.stack,
      });
    }
  }

  /**
   * A static helper method for creating an `AppError` instance.
   *
   * @param message - The error message.
   * @param statusCode - HTTP status code (default is 500).
   * @param isOperational - Operational flag (default is true).
   * @returns A new instance of `AppError`.
   */
  public static create(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    validationErrors?: Record<string, string>
  ): AppError {
    return new AppError(message, statusCode, isOperational, validationErrors);
  }

  /**
   * Handles the response by sending an appropriate error message and status code.
   *
   * @param res - The response object to send the error message.
   * @param error - The error object to handle. If it is an instance of `AppError`,
   *                it sends the error's status code and message. Otherwise, it creates
   *                a new `AppError` with a 500 status code and sends its message.
   *                400 status code is used for validation errors return an object with key and error.
   */
  public static handleResponse(res: Response, error: unknown): void {
    if (
      error instanceof AppError &&
      error.statusCode >= 400 &&
      error.statusCode < 500
    ) {
      res
        .status(error.statusCode)
        .json({ message: error.message, errors: error.validationErrors });
    } else if (error instanceof AppError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      const err = AppError.create(`Unexpected Error -> ${error}`, 500, false);
      res.status(err.statusCode).json({ message: err.message });
    }
  }
}
