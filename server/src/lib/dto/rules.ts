import * as z from 'zod';
import {isValidObjectId} from 'mongoose';

export const isMongoId = (message: string = 'Invalid formate of uid') =>
  z.string().refine(value => isValidObjectId(value), {
    message,
  });
