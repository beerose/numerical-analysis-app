import { Request, Response } from 'express';
import * as codes from 'http-status-codes';
import jwt from 'jsonwebtoken';
import nodeMailer from 'nodemailer';

export const generate = (email: string) => {
  return jwt.sign({ email }, process.env.JWT_SECRET!);
};

const transporter = nodeMailer.createTransport({
  auth: {
    pass: process.env.EMAIL_PASSWORD,
    user: process.env.EMAIL,
  },
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true,
});

const prepareEmailTemplate = ({ username, link }: { username: string; link: string }) => `
  <b>Witaj ${username},</b>
  <br /><br />
  Poniżej znajduje się link, dzięki któremu możesz założyć konto w portalu Analiza Numeryczna M.
  <br />
  <a href=${link}>Dołącz do aplikacji</a>
`;

export const sendMagicLinks = (req: Request, res: Response) => {
  const token = generate(process.env.EMAIL || '');
  const mailOptions = {
    from: 'Analiza numeryczna',
    html: prepareEmailTemplate({
      link: `localhost:3000/account?token=${token}`,
      username: 'XYZ',
    }),
    subject: 'Zaproszenie do aplikacji',
    to: process.env.EMAIL,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
};

const findUserByEmail = (email: string) => {
  return {};
};

interface CreateWithTokenRequest extends Request {
  query: {
    token?: string;
  };
}
export const createWithToken = (req: CreateWithTokenRequest, res: Response) => {
  const { token } = req.query;
  if (!token) {
    return res.status(codes.BAD_REQUEST).send({ error: 'token is required' });
  }
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return res.status(codes.FORBIDDEN).send({ error: 'cannot verify jwt' });
  }

  if (!decoded.hasOwnProperty('email')) {
    return res.status(codes.FORBIDDEN).send({ error: 'invalid jwt format' });
  }

  const user = findUserByEmail((decoded as { email: string }).email);
  if (!user) {
    return res.status(codes.FORBIDDEN).send({ error: 'failed to find user' });
  }

  // if ((decoded as { expiration: Date }).expiration < new Date()) {
  //   return res.status(codes.FORBIDDEN).send({ error: 'token has expired' });
  // }

  return res.status(codes.OK).send({ token });
};
