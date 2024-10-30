import type {Schema} from 'mongoose';

/**
 * Formats a Mongoose schema to customize its JSON output.
 * @param schema - The Mongoose schema to format.
 */
export const format = <T extends Schema>(schema: T) =>
  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform(_doc, ret, _options) {
      const id = ret._id;
      delete ret._id;
      return {id, ...ret};
    },
  });
