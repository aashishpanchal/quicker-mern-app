import * as z from 'zod';
import {isMongoId} from './rules';

export const EmailDto = z.object({
  email: z.string().email(),
});

export const MongoIdDto = z.object({
  id: isMongoId(),
});

export type EmailDto = z.infer<typeof EmailDto>;
export type MongoIdDto = z.infer<typeof MongoIdDto>;
