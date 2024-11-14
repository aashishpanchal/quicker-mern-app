import passport from 'passport';
import {JwtStrategy} from './jwt.strategy';

passport.use('jwt', JwtStrategy);
