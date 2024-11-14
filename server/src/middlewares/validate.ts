import type {ZodType} from 'zod';
import {wrapper, BadRequestError, ReqHandler} from 'exlite';

// Define the type for validate object
type Validate = Record<
  'body' | 'query' | 'params',
  <T extends ZodType>(obj: T) => ReqHandler
>;

/**
 * Middleware to validate request data against a Zod schema.
 */
const validator = <T extends ZodType>(
  obj: T,
  type: 'body' | 'query' | 'params',
) =>
  wrapper((req, _res, next) => {
    const {success, data, error} = obj.readonly().safeParse(req[type]);
    if (success) {
      req[type] = data;
      next();
    } else
      throw new BadRequestError(
        `Received data is not valid from req.${type}`,
        error.errors,
      );
  });

/**
 * Object containing validation middleware for request body, query, and params.
 */
export const validate: Validate = {
  body: obj => validator(obj, 'body'),
  params: obj => validator(obj, 'params'),
  query: obj => validator(obj, 'query'),
};
