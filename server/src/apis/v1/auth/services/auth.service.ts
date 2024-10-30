import config from '#/config';
import {singleton} from 'tsyringe';
import {userModel} from '#/db/models';
import {base64url} from '#lib/utils';
import {isValidObjectId} from 'mongoose';
import {sendMail, Token} from '#lib/helpers';
import {ConflictError, ForbiddenError, BadRequestError} from 'exlite';
import type {LoginDto, RegisterDto, VerifyEmailDto} from '../auth.dto';

@singleton()
export class AuthService {
  constructor(private token: Token) {}

  async auth({username, password}: LoginDto) {
    // Find user by username
    const user = await userModel.findOne(
      {$or: [{email: username}, {username}]},
      '+password',
    );
    if (!user) throw new BadRequestError('User account is not registered');
    // Check user password
    if (!(await user.checkPassword(password)))
      throw new BadRequestError('Invalid credentials');

    return user;
  }

  async register({email, ...data}: RegisterDto) {
    // Fist check user already exists or not
    const user = await userModel.findOne({$or: [{email}]});
    // If user already exits, throw error
    if (user)
      throw new ConflictError('User account already registered with email');
    // Add new user
    return userModel
      .create(Object.assign(data, {username: email.split('@')[0], email}))
      .then(async user => {
        // Generate verification code
        const {code, hash64, exp} = this.token.getCode(user.email);
        // Send verification code to user email
        await sendMail({
          to: user.email,
          subject: `Register on ${config.name}`,
          template: 'emails/register',
          context: {code, email, exp: exp / 60},
        });
        return {exp, hash64, user};
      });
  }

  async resentEmailCode(email: string) {
    const user = await userModel.findByEmail(email);
    // If user already verified, throw error
    if (user.verified)
      throw new ForbiddenError('User account already verified');
    // Generate verification code
    const {code, exp, hash64} = this.token.getCode(user.email);
    // Send code/otp in user email
    await sendMail({
      to: user.email,
      subject: `Register on ${config.name}`,
      template: 'emails/register',
      context: {code, email, exp: exp / 60},
    });
    return {exp, hash64, user};
  }

  async verifyEmailCode({code, email, hash}: VerifyEmailDto) {
    const isValid = this.token.checkCode(email, code, hash);
    if (!isValid) throw new BadRequestError('Invalid verification code');
    // Find user by email
    const user = await userModel.findByEmail(email);
    // if user already verified, throw error
    if (user.verified)
      throw new ForbiddenError('User account already verified');
    // Update user account
    user.verified = true;
    // Save update
    await user.save({validateBeforeSave: false});
    // Send welcome email
    await sendMail({
      to: user.email,
      subject: `Welcome to ${config.name}`,
      template: 'emails/welcome',
      context: {username: user.username, exploreUrl: config.clientUrl},
    });
    return user;
  }

  async forgotPassword(email: string) {
    const user = await userModel.findByEmail(email);
    // Generate reset token
    const {token, exp} = this.token.getToken(user.email);
    const resetUrl = `${config.clientUrl}/reset-password?uid=${base64url.encode(user.id)}&token=${token}`;
    // Send reset link in user email
    await sendMail({
      to: user.email,
      subject: `Reset your password on ${config.name}`,
      template: 'emails/forgot-password',
      context: {resetUrl, username: user.username, exp: exp / 60},
    });
    return user;
  }

  async resetPassword(uid: string, token: string, newPassword: string) {
    const id = base64url.decode(uid);
    // validate id
    if (!isValidObjectId(id)) throw new BadRequestError('Invalid uid');
    // Find user by id
    const user = await userModel.findById(id);
    // Check token is valid or not
    if (!this.token.checkToken(user.email, token))
      throw new BadRequestError('Invalid token');
    // Update user password
    user.password = newPassword;
    // Save update
    return await user.save({validateBeforeSave: false}).then(async res => {
      await sendMail({
        to: user.email,
        subject: 'Password changed successfully',
        template: 'emails/reset-password',
      });
      return res;
    });
  }
}
