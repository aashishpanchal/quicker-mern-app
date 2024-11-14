import './strategies';
import {Router} from 'express';
import {EmailDto} from '#lib/dto';
import {validate} from '#/middlewares';
import {createController} from 'exlite';
import {AuthController} from './auth.controller';
import {
  LoginDto,
  LogoutDto,
  PasswordDto,
  RegisterDto,
  VerifyEmailDto,
} from './auth.dto';

export const authRoutes = (): Router => {
  // Router
  const router = Router();
  // Controller
  const auth = createController(AuthController);
  // Initialize
  return router
    .post('/login', validate.body(LoginDto), auth.getMethod('login'))
    .post('/register', validate.body(RegisterDto), auth.getMethod('register'))
    .post('/resend-code', validate.body(EmailDto), auth.getMethod('resentCode'))
    .post(
      '/verify-email',
      validate.body(VerifyEmailDto),
      auth.getMethod('verifyEmail'),
    )
    .post('/refresh', auth.getMethod('refresh'))
    .post('/logout', validate.body(LogoutDto), auth.getMethod('logout'))
    .post(
      '/forgot-password',
      validate.body(EmailDto),
      auth.getMethod('forgotPassword'),
    )
    .put(
      '/reset-password',
      validate.query(PasswordDto.shape.query),
      validate.body(PasswordDto.shape.body),
      auth.getMethod('resetPassword'),
    );
};
