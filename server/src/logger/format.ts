import * as colorette from 'colorette';
import {format, type Logform} from 'winston';

// Color
const Color: Record<string, colorette.Color> = {
  info: colorette.greenBright,
  error: colorette.redBright,
  warn: colorette.yellowBright,
  debug: colorette.cyanBright,
  verbose: colorette.blueBright,
};

// Error log
const errorLog: Logform.FormatWrap = format(info => {
  if (info?.level === 'error' && info instanceof Error)
    return {...info, message: info?.stack};
  return info;
});

// Pretty-Print Format
export const prettyPrint = () => {
  const handlers: Logform.Format[] = [];
  // Add log-error
  handlers.push(errorLog());
  // Add printf
  handlers.push(
    format.printf(({level, message}) => {
      const color = Color[level] || ((text: string): string => text);
      // make prefix
      const prefix = color(level.toUpperCase()).concat(':').padEnd(18);
      return colorette.bold(`${prefix} ${message as string}`);
    }),
  );

  return format.combine(...handlers);
};
