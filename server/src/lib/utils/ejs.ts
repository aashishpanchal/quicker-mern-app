import fs from 'fs';
import ejs from 'ejs';
import path from 'path';

interface TemOptions {
  dir?: string; // Directory where templates are located
  options?: ejs.Options; // Options to pass to EJS compiler
}

/** Compiles an EJS template with provided context. */
export async function temCompiler(
  tem: string,
  context?: Record<string, any>,
  options: TemOptions = {},
): Promise<string> {
  // Set default values for options
  options = Object.assign(
    {
      dir: path.join(process.cwd(), 'views'), // Default directory for templates
      options: {rmWhitespace: true}, // Default EJS options
    },
    options,
  );

  // Extract file extension and name
  const ext = path.extname(tem) || '.ejs';
  const temName = path.basename(tem, ext);

  // Determine the directory of the template
  const dir = path.isAbsolute(tem)
    ? path.dirname(tem)
    : path.join(options?.dir || '', path.dirname(tem));

  const fullPath = path.join(dir, temName + ext);

  // Read the template file
  const template = await fs.promises.readFile(fullPath, 'utf-8');

  // Compile template
  const compiledTemplate = ejs.compile(template, {
    ...(options.options || {}),
    filename: fullPath, // Set filename for better error reporting
  });

  // Render template with provided context
  return compiledTemplate(context || {});
}
