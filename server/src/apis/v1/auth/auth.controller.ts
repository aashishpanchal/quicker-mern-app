import config from '#/config';
import {JWT} from '#/constants';
import {singleton} from 'tsyringe';
import {ApiRes, BadRequestError} from 'exlite';
import {AuthService, TokenService} from './services';
import type {Request, Response} from 'express';

@singleton()
export class AuthController {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
  ) {}

  async login(req: Request, res: Response) {
    const user = await this.authService.auth(req.body);
    const {access, refresh} = await this.tokenService.generate(user.id);
    // Set token in cookies
    res.cookie(JWT.ACCESS, access.token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: !config.isDev,
      maxAge: access.maxAge,
    });
    res.cookie(JWT.REFRESH, refresh.token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: !config.isDev,
      maxAge: refresh.maxAge,
    });
    const data = {
      user: user.id,
      access: access.token,
      refresh: refresh.token,
    };
    return ApiRes.ok(data, 'User login successfully');
  }

  async register(req: Request, res: Response) {
    // Add new user
    const {exp, hash64, user} = await this.authService.register(req.body);
    // Set hash in cookies
    res.cookie('hash64', hash64, {
      httpOnly: true,
      sameSite: 'strict',
      secure: !config.isDev,
      maxAge: exp,
    });
    return ApiRes.created(
      {exp, user: user.id},
      `Send verification code on ${user.email}`,
    );
  }

  async resentCode(req: Request) {
    const email = req.body.email;
    // Resend email verification code
    const {hash64, exp, user} = await this.authService.resentEmailCode(email);
    // Set hash in cookies
    req.res.cookie('hash', hash64, {
      httpOnly: true,
      sameSite: 'strict',
      secure: !config.isDev,
      maxAge: exp,
    });
    return ApiRes.created(
      {exp, user: user.id},
      `Send verification code on ${email}`,
    );
  }

  async verifyEmail(req: Request, res: Response) {
    const {email, hash, code} = req.body;
    // Verify Email
    const user = await this.authService.verifyEmailCode({email, hash, code});
    // Clear hash from cookies
    res.clearCookie('hash');
    // Generate Access and Refresh Token
    const {access, refresh} = await this.tokenService.generate(user.id);
    // Set token in cookies
    res.cookie(JWT.ACCESS, access.token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: !config.isDev,
      maxAge: access.maxAge,
    });
    res.cookie(JWT.REFRESH, refresh.token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: !config.isDev,
      maxAge: refresh.maxAge,
    });
    const data = {
      user: user.id,
      access: access.token,
      refresh: refresh.token,
    };
    return ApiRes.ok(data, `User email verify successfully`);
  }

  async refresh(req: Request) {
    const token = req.body?.token || req.cookies[JWT.REFRESH];
    // Throw error if token is not provided
    if (token === undefined)
      throw new BadRequestError(
        'Refresh token is required in (body or cookies)',
      );
    // Generate new access token
    const access = await this.tokenService.refreshAccess(token);
    // Set token in cookies
    req.res.cookie(JWT.ACCESS, access.token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: !config.isDev,
      maxAge: access.maxAge,
    });
    return ApiRes.created({token: access.token}, 'Access token refreshed');
  }

  async logout(req: Request, res: Response) {
    const many = req.query.all;
    // Get token from request body or cookies
    const token = req.body?.token || req.cookies[JWT.REFRESH];
    // Throw error if token is not provided
    if (token === undefined)
      throw new BadRequestError(
        'Refresh token is required in (body or cookies)',
      );
    // Block refresh token
    await this.tokenService.addBlacklist(token, many as unknown as boolean);
    // Clear Access and Refresh token from cookies
    res.clearCookie(JWT.ACCESS);
    res.clearCookie(JWT.REFRESH);
    return ApiRes.ok(
      null,
      many
        ? 'User logout successfully in all system!'
        : 'User logout successfully',
    );
  }

  async forgotPassword(req: Request) {
    const {email} = req.body;
    // Reset link send on Email
    await this.authService.forgotPassword(email);
    return ApiRes.ok({}, `Password reset link send on ${email}`);
  }

  async resetPassword(req: Request) {
    const {password} = req.body;
    const {uid, token} = req.query as any;
    // Set new password
    const user = await this.authService.resetPassword(uid, token, password);
    return ApiRes.ok({user: user.id}, 'Password reset successfully');
  }
}
