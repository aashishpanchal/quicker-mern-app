import morgan from 'morgan';
import logger from '#/logger';
import {bold} from 'colorette';

const FORMAT = `:remote-addr - "${bold(':method :url HTTP/:http-version')}" :status - :response-time ms`;

export const terminalLog = () =>
  morgan(FORMAT, {stream: {write: message => logger.info(message.trim())}});
