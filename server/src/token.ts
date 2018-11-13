import { Response } from 'express';
import jwt from 'jsonwebtoken';
import nodeMailer from 'nodemailer';

export const generate = (account: any) => jwt.sign({ id: account.id }, process.env.JWT_SECRET!);

const transporter = nodeMailer.createTransport({
  auth: {
    pass: process.env.EMAIL_PASSWORD,
    user: process.env.EMAIL,
  },
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
});

export const send = (_req: any, res: Response) => {
  const mailOptions = {
    from: '"Analiza numeryczna" <hello@analizanumeryczna.com>',
    html: '<b>Zaproszenie</b>',
    subject: 'Zaproszenie do aplikacji',
    to: process.env.EMAIL,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
  // return res.status(200).send('send');
};
