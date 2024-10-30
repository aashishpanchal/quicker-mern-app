import {model, Schema} from 'mongoose';
import type {Token, TokenModel} from '../types';

/** auth-token (refresh, access, and others) */
const schema = new Schema<Token, TokenModel>({
  jti: {type: String, required: true, unique: true},
  user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  blacklist: {type: Boolean, default: false},
  blacklistAt: {type: Date, default: null},
  expiredAt: {type: Date, required: true},
});

// generate model from schema
export const tokenModel = model<Token, TokenModel>('Token', schema);
