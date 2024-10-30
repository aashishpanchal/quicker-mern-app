import ms from 'ms';
import env from './env';

// Server Configuration
const config = {
  port: env.PORT,
  host: env.HOST,
  name: env.NAME,
  secret: env.SECRET,
  isDev: env.NODE_ENV === 'dev',
  clientUrl: env.CLIENT_URL,
  // Database
  databaseUrl: env.DATABASE_URL,
  // Redis database url
  redisUrl: env.REDIS_URL,
  // Jwt
  jwt: {
    iss: env.NAME,
    accessExp: env.JWT_ACCESS_EXP,
    refreshExp: env.JWT_REFRESH_EXP,
  },
  // SMTP
  smtp: {
    host: env.SMTP_HOST,
    pass: env.SMTP_PASS,
    port: env.SMTP_PORT,
    user: env.SMTP_USER,
    from: env.SMTP_FROM,
  },
  // Verification
  codeExp: ms('5m'),
  tokenExp: ms('10m'),
} as const;

export default config;
