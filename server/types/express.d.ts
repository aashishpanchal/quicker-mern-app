import type {UserDocument} from '#/db/types';

// extend the user interface in the Express namespace
declare global {
  namespace Express {
    // user object
    interface User extends UserDocument {}
  }
}
