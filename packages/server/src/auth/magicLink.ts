import { UserRole } from 'common';

import { generateToken, prepareEmailTemplate, transporter } from './utils';

export const sendMagicLinks = () => {
  const token = generateToken(process.env.EMAIL || '', 'Ola', UserRole.admin);
  const mailOptions = {
    from: 'Analiza numeryczna',
    html: prepareEmailTemplate({
      link: `http://localhost:1234/accounts/new#token=${token}`,
      username: 'XYZ',
    }),
    subject: 'Zaproszenie do aplikacji',
    to: process.env.EMAIL,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error || !info.messageId) {
      console.log(error);
    }
    console.log('Message sent.');
  });
};
