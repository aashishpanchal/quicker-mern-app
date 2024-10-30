import type {ROLES} from '#/constants';
import type {HydratedDocument, Model, Types} from 'mongoose';

// user schema type
export type User = {
  id: string;
  username: string;
  phone: string;
  email: string;
  password: string;
  fullname: string;
  bio: string;
  role: ROLES;
  avatar?: string;
  blocked: boolean;
  verified: boolean;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date;
};

// auth-token schema type
export type Token = {
  id: string;
  jti: string;
  blacklist: boolean;
  user: Types.ObjectId;
  expiredAt: Date;
  blacklistAt: Date;
};

export type Post = {
  id: string;
  content: string;
  author: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export type PostAttachment = {
  id: string;
  url: string;
  type: string;
};

// methods type
type UserMethods = {
  checkPassword(password: string): Promise<boolean>;
};
// document and model type
export type UserModel = Model<User, object, UserMethods> & {
  findByEmail: (email: string) => Promise<UserDocument>;
};
export type UserDocument = HydratedDocument<User, UserMethods>;
export type TokenModel = Model<Token>;
export type TokenDocument = HydratedDocument<Token>;
