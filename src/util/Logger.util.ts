import fs from "fs";
/**
 * Possible log levels.
 */
type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";
/**
 * Possible argument types for the logger.
 */
type LogArgument = string | number | boolean | object | Error;
/**
 * A simple file logger utility.
 */
class Logger {
  /**
   * Directory to store log files.
   */
  private static logsDir = "./logs";
  /**
   * Main log file path.
   */
  private static logFile = `${Logger.logsDir}/backend.log`;
  /**
   * Initializes the logger by creating the logs directory if needed.
   */
  static init(): void {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir);
    }
  }
  /**
   * Logs debug messages.
   * @param args The messages or objects to log.
   */
  static debug(...args: LogArgument[]): void {
    this.doLog("DEBUG", ...args);
  }
  /**
   * Logs info messages.
   * @param args The messages or objects to log.
   */
  static info(...args: LogArgument[]): void {
    this.doLog("INFO", ...args);
  }
  /**
   * Logs warning messages.
   * @param args The messages or objects to log.
   */
  static warn(...args: LogArgument[]): void {
    this.doLog("WARN", ...args);
  }
  /**
   * Logs error messages.
   * @param args The messages or objects to log.
   */
  static error(...args: LogArgument[]): void {
    this.doLog("ERROR", ...args);
  }
  /**
   * Retrieves the current time formatted as a locale string.
   * @returns A string representation of the current time.
   */
  private static getTime(): string {
    const now = new Date();
    return now.toLocaleString("he");
  }
  /**
   * Checks if a value is an Error object.
   * @param err The value to check.
   * @returns True if it is an Error, false otherwise.
   */
  private static isError(err: unknown): err is Error {
    return err instanceof Error;
  }
  /**
   * Converts an argument into a string for logging.
   * @param arg The log argument to stringify.
   * @returns A string representation of the argument.
   */
  private static stringifyArg(arg: LogArgument): string {
    if (typeof arg === "string") return arg;
    if (this.isError(arg)) return arg.message;
    return JSON.stringify(arg);
  }
  /**
   * Writes log messages to the file.
   * @param level The log level (DEBUG, INFO, WARN, ERROR).
   * @param args The messages or objects to log.
   */
  private static doLog(level: LogLevel, ...args: LogArgument[]): void {
    const strs = args.map((arg) => this.stringifyArg(arg));
    const line = `${this.getTime()} - ${level} - ${strs.join(" | ")}\n`;
    fs.appendFile(this.logFile, line, (err) => {
      if (err) console.error("FATAL: cannot write to log file");
    });
  }
}
Logger.init();
export default Logger;
