import fs from "fs";

type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

type LogArgument = string | number | boolean | object | Error;

class Logger {
  private static logsDir = "./logs";
  private static logFile = `${Logger.logsDir}/backend.log`;

  static init() {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir);
    }
  }

  static debug(...args: LogArgument[]): void {
    this.doLog("DEBUG", ...args);
  }

  static info(...args: LogArgument[]): void {
    this.doLog("INFO", ...args);
  }

  static warn(...args: LogArgument[]): void {
    this.doLog("WARN", ...args);
  }

  static error(...args: LogArgument[]): void {
    this.doLog("ERROR", ...args);
  }

  private static getTime(): string {
    const now = new Date();
    return now.toLocaleString("he");
  }

  private static isError(err: unknown): err is Error {
    return err instanceof Error;
  }

  private static stringifyArg(arg: LogArgument): string {
    if (typeof arg === "string") return arg;
    if (this.isError(arg)) return arg.message;
    return JSON.stringify(arg);
  }

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
