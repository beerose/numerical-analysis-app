import { UserRole } from 'common';

import { email } from './email';
import { generateUserJwtToken } from './generateUserJwtToken';

const sendMagicLinks = () => {
  const token = generateUserJwtToken(
    process.env.EMAIL || '',
    'Ola',
    UserRole.admin
  );
  const mailOptions = {
    from: 'Analiza numeryczna',
    html: email.prepareTemplate({
      // TODO: Why is there '#' instead of '?'
      link: `http://localhost:1234/accounts/new#token=${token}`,
      username: 'XYZ',
    }),
    subject: 'Zaproszenie do aplikacji',
    to: process.env.EMAIL,
  };

  email.transporter.sendMail(mailOptions, (error, info) => {
    if (error || !info.messageId) {
      console.log(error);
    }
    console.log('Message sent.');
  });
};

// TODO: Add better tests
describe('magic links', () => {
  it("don't crash the app", () => {
    sendMagicLinks();
  });
});
