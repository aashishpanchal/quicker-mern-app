import crypto from 'crypto';
import config from '#/config';
import {BadRequestError} from 'exlite';

/** Generate random unique uuid */
export const uuid = () => crypto.randomUUID();

/** Hmac-Hash data with salt */
export const hmac = (data: string) =>
  crypto.createHmac('sha256', config.secret).update(data).digest('base64url');

/** Raw string to encode and decode base64url */
export const base64url = {
  encode: (data: string) => Buffer.from(data).toString('base64url'),
  decode: (data: string) => {
    try {
      return Buffer.from(data, 'base64url').toString();
    } catch (error) {
      throw new BadRequestError('Invalid base64url string');
    }
  },
};

/** Generate random characters of given length */
export const randomChar = (length: number) => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({length}, () => {
    return chars[crypto.randomInt(0, chars.length)];
  }).join('');
};
