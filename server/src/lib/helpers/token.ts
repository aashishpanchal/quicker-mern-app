import config from '#/config';
import {singleton} from 'tsyringe';
import {base64url, hmac, randomChar} from '#lib/utils';

@singleton()
export class Token {
  /**  Get expiry time in milliseconds */
  private getExpiry = (ms: number) => Date.now() + ms;

  /** Generate a hashed token based on the email and expiry */
  public getToken(email: string) {
    const exp = this.getExpiry(config.tokenExp);
    const hash = hmac(`${email}.${exp}`);
    // encode hash in base64url format
    const token = base64url.encode(`${hash}.${exp}`);
    return {exp: config.tokenExp / 1000, token}; // Return expiry in seconds
  }

  /** Generate a hashed code based on the email and expiry */
  public getCode(email: string, digits: number = 6) {
    const exp = this.getExpiry(config.codeExp);
    const code = randomChar(digits);
    const hash = hmac(`${email}.${code}.${exp}`);
    // encode the hash and expiry in base64url format
    const hash64 = base64url.encode(`${hash}.${exp}`);
    return {exp: config.codeExp / 1000, code, hash64}; // Return expiry in seconds
  }

  /** Validate the provided token with the email */
  public checkToken(email: string, token: string) {
    const decodedToken = base64url.decode(token);
    // Ensure the decoded token has a valid format
    if (!decodedToken || !decodedToken.includes('.')) return false;
    const [hash, exp] = decodedToken.split('.');
    // Check if the token has expired
    if (!exp || Date.now() > Number(exp)) return false;
    // Validate the token by comparing hashes
    return hmac(`${email}.${exp}`) === hash;
  }

  /** Validate the provided code with the email */
  public checkCode(email: string, code: string, encodedHash: string) {
    const decodedHash = base64url.decode(encodedHash);
    // Ensure the decoded hash has a valid format
    if (!decodedHash || !decodedHash.includes('.')) return false;
    const [hash, exp] = decodedHash.split('.');
    // Check if the code has expired
    if (!exp || Date.now() > Number(exp)) return false;
    // Validate the code by comparing hashes
    return hmac(`${email}.${code}.${exp}`) === hash;
  }
}
