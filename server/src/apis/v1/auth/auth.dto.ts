import * as z from 'zod';
import {EmailDto} from '#lib/dto';

// Schemas
export const LoginDto = z.object({
  username: z.string(),
  password: z.string(),
});

export const RegisterDto = EmailDto.extend({
  fullname: z.string(),
  password: z.string(),
});

export const VerifyEmailDto = z.object({
  code: z.string(),
  hash: z.string().base64().optional(),
  email: z.string().email(),
});

export const LogoutDto = z.object({
  all: z.boolean().optional(),
});

export const PasswordDto = z.object({
  query: z.object({
    uid: z.string().base64(),
    token: z.string().base64(),
  }),
  body: z.object({
    password: z.string(),
  }),
});

// Types
export type LoginDto = z.infer<typeof LoginDto>;
export type RegisterDto = z.infer<typeof RegisterDto>;
export type VerifyEmailDto = z.infer<typeof VerifyEmailDto>;
export type LogoutDto = z.infer<typeof LogoutDto>;
export type PasswordDto = z.infer<typeof PasswordDto>;
