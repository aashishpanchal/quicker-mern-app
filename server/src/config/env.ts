import 'dotenv/config';
import * as z from 'zod';
import {validateEnv} from '#lib/utils';

// Env validation schema
const schema = z.object({
  HOST: z.string(),
  NAME: z.string(),
  PORT: z.coerce.number(),
  NODE_ENV: z.enum(['dev', 'prod']).default('dev'),
  SECRET: z.string().min(32),
  CLIENT_URL: z.string().url(),
  // Database
  DATABASE_URL: z.string().url(),
  // Redis/Cache database url
  REDIS_URL: z.string().url(),
  // Jwt
  JWT_ACCESS_EXP: z.string(),
  JWT_REFRESH_EXP: z.string(),
  // SMTP
  SMTP_PORT: z.coerce.number(),
  SMTP_HOST: z.string(),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
  SMTP_FROM: z.string(),
});

// validate env
export default validateEnv(schema);
