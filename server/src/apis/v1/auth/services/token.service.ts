import ms from 'ms';
import config from '#/config';
import jwt from 'jsonwebtoken';
import {JWT} from '#/constants';
import {uuid} from '#lib/utils';
import {singleton} from 'tsyringe';
import {tokenModel} from '#/db/models';
import {BadRequestError, UnAuthorizedError} from 'exlite';

export type TokenType = {token: string; maxAge: number};

type Options = {
  exp: string;
  type: JWT;
  user: string;
  cache: boolean;
};

@singleton()
export class TokenService {
  readonly #jwt = config.jwt;
  readonly #secret = config.secret;

  /**
   * Create a new JWT token.
   */
  async create({user, exp, type, cache}: Options): Promise<TokenType> {
    // Create pre-build payload
    const obj = {sub: user, type, jti: uuid(), iss: this.#jwt.iss};
    // Generate token
    const token = jwt.sign(obj, this.#secret, {
      expiresIn: exp,
    });
    const maxAge = ms(exp);
    // Cache token to database
    if (cache)
      await tokenModel.create({
        user,
        jti: obj.jti,
        type: obj.type,
        expiredAt: new Date(Date.now() + maxAge),
        blacklist: false, // Initially, the token is not blacklisted
      });
    // Finally return generated token
    return {token, maxAge};
  }

  /**
   * Verify a JWT token.
   */
  verify(token: string, type: JWT): jwt.JwtPayload {
    try {
      const payload = jwt.verify(token, this.#secret) as jwt.JwtPayload;
      if (payload.type !== type)
        throw new UnAuthorizedError('Token type is invalid');
      return payload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError)
        throw new UnAuthorizedError('Token is expired');
      if (error instanceof jwt.JsonWebTokenError)
        throw new UnAuthorizedError(error.message);
      throw error;
    }
  }

  /**
   * Blacklist a token or all tokens of a user.
   */
  async addBlacklist(token: string, many?: boolean) {
    const {jti, sub} = this.verify(token, JWT.REFRESH);
    const result = await tokenModel.findOne({jti});
    // Check if the token is already blacklisted
    if (!result || result.blacklist)
      throw new BadRequestError('Token is already blacklisted');
    const $set = {blacklist: true, blacklistAt: Date.now()};
    // If many is true, block all refresh tokens
    if (many)
      await tokenModel.updateMany({user: sub, blacklist: false}, {$set});
    else await tokenModel.updateOne({jti}, $set);
  }

  /**
   * The generated access and refresh tokens.
   */
  async generate(user: string) {
    const {accessExp, refreshExp} = this.#jwt;
    // Generate tokens
    const [access, refresh] = await Promise.all([
      this.create({user, exp: accessExp, type: JWT.ACCESS, cache: false}),
      this.create({user, exp: refreshExp, type: JWT.REFRESH, cache: true}),
    ]);
    // Finally return auth tokens
    return {access, refresh};
  }

  /**
   * Generate a new access token using a valid refresh token.
   */
  async refreshAccess(refreshToken: string): Promise<TokenType> {
    // Verify refresh token
    const {sub, jti} = this.verify(refreshToken, JWT.REFRESH);
    // Check if token is blacklisted
    const tokenData = await tokenModel.findOne({jti, blacklist: false});
    if (!tokenData)
      throw new UnAuthorizedError('Refresh token is blacklisted or invalid');
    // Generate new access token
    return this.create({
      user: sub,
      exp: this.#jwt.accessExp,
      type: JWT.ACCESS,
      cache: false,
    });
  }
}
