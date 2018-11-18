import jwt from 'jsonwebtoken';
import nodeMailer from 'nodemailer';

export const generateToken = (email: string, userName: string) => {
  return jwt.sign({ email, user_name: userName }, process.env.JWT_SECRET!);
};

export const transporter = nodeMailer.createTransport({
  auth: {
    pass: process.env.EMAIL_PASSWORD,
    user: process.env.EMAIL,
  },
  host: process.env.EMAIL_HOST,
  port: 587,
  secure: false,
});

export const prepareEmailTemplate = ({ username, link }: { username: string; link: string }) => `
  <b>Witaj ${username},</b>
  <br /><br />
  Poniżej znajduje się link, dzięki któremu możesz założyć konto w portalu Analiza Numeryczna M.
  <br />
  <a href="${link}">Dołącz do aplikacji</a>
`;
