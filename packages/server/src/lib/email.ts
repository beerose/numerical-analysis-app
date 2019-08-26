import { ServerRoutes, UserDTO } from 'common';
import nodeMailer, { Transporter } from 'nodemailer';

import { generateUserJwtToken } from './generateUserJwtToken';

let transporter: Transporter;

const { EMAIL_PASSWORD, EMAIL } = process.env;

console.assert(
  EMAIL && EMAIL_PASSWORD,
  'process.env.EMAIL and process.env.EMAIL_PASSWORD have to be defined'
);

export const email = {
  get transporter() {
    if (!transporter) {
      transporter = nodeMailer.createTransport({
        auth: {
          pass: process.env.EMAIL_PASSWORD,
          user: process.env.EMAIL,
        },
        host: 'smtp.gmail.com',
        // port: 587,
        port: 465,
        secure: true,
        service: 'gmail',
      });
    }
    return transporter;
  },
};

const DEVELOPMENT_MAIL_REGEX = /(hasparus)|(ola.zxcvbnm)@gmail\.com/;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:1234';

export const sendRegistrationLink = (
  user: Omit<UserDTO, 'id'>,
  callback: (err: Error | null, info: any) => void
) => {
  if (
    process.env.NODE_ENV !== 'production' &&
    !user.email.match(DEVELOPMENT_MAIL_REGEX)
  ) {
    // We don't want to send emails to some poor students we ended up having addresses to.
    callback(null, 'Email was not send -- development environment.');
    return;
  }

  const token = generateUserJwtToken({
    email: user.email,
    user_name: user.user_name,
    user_role: user.user_role,
  });

  const link = `${CLIENT_URL}${ServerRoutes.Accounts.New}?token=${token}`;

  email.transporter.sendMail(
    {
      from: 'Aplikacja Lagrange',
      html: emailMessage(
        user.user_name,
        'Poniżej znajduje się link, dzięki któremu możesz aktywować swoje konto w aplikacji Lagrange, gdzie możesz śledzić swoje punkty z Analizy Numerycznej i wybierać zadania.',
        link,
        'Aktywuj konto'
      ),
      subject: 'Zaproszenie do aplikacji',
      to: user.email,
    },
    (...args) => {
      logError(...args);
      if (callback) {
        callback(...args);
      }
    }
  );
};

export const sendResetPasswordLink = (
  user: Omit<UserDTO, 'id'>,
  callback: (err: Error | null, info: any) => void
) => {
  if (
    process.env.NODE_ENV !== 'production' &&
    !user.email.match(DEVELOPMENT_MAIL_REGEX)
  ) {
    // We don't want to send emails to some poor students we ended up having addresses to.
    callback(null, 'Email was not send -- development environment.');
    return;
  }

  const token = generateUserJwtToken({
    email: user.email,
    user_name: user.user_name,
    user_role: user.user_role,
  });

  const link = `${CLIENT_URL}${ServerRoutes.Accounts.ResetPassword}?token=${token}`;

  email.transporter.sendMail(
    {
      from: 'Aplikacja Lagrange',
      html: emailMessage(
        user.user_name,
        'Poniżej znajduje się link, dzięki któremu możesz zresetować swoje hasło w aplikacji Lagrange.',
        link,
        'Ustaw nowe hasło'
      ),
      subject: 'Reset hasła w aplikacji Lagrange',
      to: user.email,
    },
    callback
  );
};

const logError = (error: Error | null, info: any) => {
  if (error || !info.messageId) {
    console.error(error || 'messageId missing');
  }
};

const emailMessage = (
  userName: string,
  message: string,
  link: string,
  linkText: string
) => /* html */ `\
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head></head>
<body>
  <h1 style="font-size: 1.5em; font-weight: normal;">Cześć <b>${userName}</b>,</h1>
  <p style="max-width: 600px;">${message}
  </p>
  <a style="font-size: 1.5em; text-align: center; max-width: 600px; display: block;" href="${link}">${linkText}</a>
</body>
</html>
`;
