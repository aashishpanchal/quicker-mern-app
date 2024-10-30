import bcrypt from 'bcrypt';
import {NotFoundError} from 'exlite';
import {model, Schema} from 'mongoose';
import type {User, UserModel} from '../types';

/** DB-Schema */
const schema = new Schema<User, UserModel>(
  {
    username: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    phone: {type: String, unique: true, required: true},
    password: {type: String, select: false, required: true},
    avatar: {type: String},
    fullname: {type: String, required: true},
    verified: {type: Boolean, default: false},
    blocked: {type: Boolean, default: false},
    lastLogin: {type: Date, default: Date.now},
  },
  {timestamps: true},
);
// Middlewares
schema.pre('save', async function (next) {
  if (this.password && this?.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});
// Definition of methods
schema.method('checkPassword', function (password: string) {
  return bcrypt.compare(password, this.password);
});
schema.static('findByEmail', async function (email: string) {
  const user = await this.findOne({email});
  // Check user account exit or not
  if (!user) throw new NotFoundError('User account is not registered');
  // Then return user account
  return user;
});

// Generate model from schema
export const userModel = model<User, UserModel>('User', schema);
