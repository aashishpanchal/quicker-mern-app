import type {ZodType} from 'zod';

// Validates environment variables against a provided schema.
export const validateEnv = <T extends ZodType>(schema: T) => {
  const {success, data, error} = schema.readonly().safeParse(process.env);
  // if success then data set in req[type]
  if (success) return data;
  // Handle validation errors
  console.log('❌ Invalid environment variables', error.formErrors.fieldErrors);
  // Exit the process if validation fails
  process.exit(1);
};
