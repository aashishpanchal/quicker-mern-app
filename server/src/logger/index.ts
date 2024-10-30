import winston from 'winston';
import {prettyPrint} from './format';

const LEVEL = 'silly';
const LEVELS = winston.config.npm.levels;

/**
 * @singleton
 * Logger class that wraps Winston logging functionalities.
 * Supports multiple log levels and formats.
 */
class Logger {
  readonly #log = winston.createLogger({
    level: LEVEL,
    levels: LEVELS,
    format: prettyPrint(),
    transports: [new winston.transports.Console()],
  });

  public info(message: unknown, ...args: any[]): void {
    this.log('info', message, args);
  }

  public warn(message: unknown, ...args: any[]): void {
    this.log('warn', message, args);
  }

  public error(message: unknown, ...args: any[]): void {
    this.log('error', message, args);
  }

  public debug(message: unknown, ...args: any[]): void {
    this.log('debug', message, args);
  }

  private log(
    level: 'info' | 'debug' | 'warn' | 'error',
    message: any,
    args: any[],
  ): void {
    this.#log.log(level, message, ...args);
  }
}

// We can use directly
export default new Logger();
