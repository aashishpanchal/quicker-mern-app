import config from '#/config';
import {temCompiler} from '#lib/utils';
import {InternalServerError} from 'exlite';
import {createTransport, type SendMailOptions} from 'nodemailer';

// types
export type MailerOptions = SendMailOptions & {
  context?: object;
  template?: string;
};

// create transporter instance
const mailer = createTransport({
  host: config.smtp.host,
  port: config.smtp.port,
  auth: {
    user: config.smtp.user,
    pass: config.smtp.pass,
  },
});

/** Email sender */
export const sendMail = async (mail: MailerOptions) => {
  const verify = await mailer.verify();
  // check connection configuration
  if (!verify)
    throw new InternalServerError('Failed to connect to mail server!!!');
  // add default from email address
  mail = Object.assign({from: config.smtp.from}, mail);
  if (mail?.template)
    mail.html = await temCompiler(
      mail.template,
      Object.assign(mail.context, {
        appName: config.name,
      }),
    );
  // remove template and context from mail data
  delete mail.template;
  delete mail.context;
  // after send mail, return the result
  return await mailer.sendMail(mail);
};
