import { UserDTO } from 'common';
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
        port: 587,
        service: 'gmail',
      });
    }
    return transporter;
  },
};

const DEVELOPMENT_MAIL_REGEX = /^(hasparus|ola.zxcvbnm)\+\w+@gmail\.com/;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:1234';

export const sendRegistrationLink = (user: UserDTO) => {
  if (
    process.env.NODE_ENV !== 'production' &&
    !user.email.match(DEVELOPMENT_MAIL_REGEX)
  ) {
    // We don't want to send emails to some poor students we ended up having addresses to.
    return;
  }

  const token = generateUserJwtToken({
    email: user.email,
    user_name: user.user_name,
    user_role: user.user_role,
  });

  const link = `${CLIENT_URL}/accounts/new?token=${token}`;

  email.transporter.sendMail(
    {
      from: 'Aplikacja Lagrange',
      html: /* html */ `\
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head></head>
<body>
  <h1 style="font-size: 1.5em; font-weight: normal;">Cześć <b>${
    user.user_name
  }</b>,</h1>
  <p style="max-width: 600px;">Poniżej znajduje się link, dzięki któremu możesz aktywować swoje konto w aplikacji Lagrange, gdzie możesz śledzić swoje punkty z Analizy Numerycznej i wybierać zadania.
  </p>
  <a style="font-size: 1.5em; text-align: center; max-width: 600px; display: block;" href="${link}">Aktywuj konto</a>
</body>
</html>
`,
      subject: 'Zaproszenie do aplikacji',
      to: user.email,
    },
    (error, info) => {
      if (error || !info.messageId) {
        console.error(error || 'messageId missing');
      }
    }
  );
};
