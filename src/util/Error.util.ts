import Logger from "./Logger.util";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);

    // Set prototype explicitly for extending built-ins
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Capture stack trace for better debugging
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    // Log the error upon creation
    this.logError();
  }

  /**
   * Logs the error using the Logger class.
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
   * A static helper method for creating an AppError instance.
   * @param message - The error message
   * @param statusCode - HTTP status code
   * @param isOperational - Operational flag
   */
  public static create(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true
  ): AppError {
    return new AppError(message, statusCode, isOperational);
  }
}
