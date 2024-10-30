import passport from 'passport';

// Middleware for JWT authentication without creating a session
export const JwtAuth = passport.authenticate('jwt', {session: false});
