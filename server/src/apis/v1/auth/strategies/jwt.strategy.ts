import config from '#/config';
import {JWT} from '#/constants';
import {userModel} from '#/db/models';
import {Strategy, ExtractJwt} from 'passport-jwt';

/** Jwt auth strategy */
export const JwtStrategy = new Strategy(
  {
    secretOrKey: config.secret,
    jwtFromRequest: ExtractJwt.fromExtractors([
      ExtractJwt.fromAuthHeaderAsBearerToken(),
      req => req.cookies?.[JWT.ACCESS] || null,
    ]),
  },
  async (payload, done) => {
    try {
      if (payload.type !== JWT.ACCESS)
        throw new Error('Access token type invalid.');
      // Find user
      const user = await userModel.findById(payload.sub);
      // User to done callback function
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  },
);
